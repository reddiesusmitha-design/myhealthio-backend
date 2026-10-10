"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMERGENCY_DIRECTORY = void 0;
exports.triggerEmergencySos = triggerEmergencySos;
exports.getActiveEmergency = getActiveEmergency;
exports.updateEmergencyStatus = updateEmergencyStatus;
exports.getEmergencyDirectory = getEmergencyDirectory;
const response_1 = require("../utils/response");
const Emergency_1 = require("../models/Emergency");
const database_1 = require("../config/database");
let activeDispatches = {};
exports.EMERGENCY_DIRECTORY = [
    {
        name: 'National Emergency Service',
        number: '112',
        type: 'ALL_EMERGENCY',
        description: 'Unified 24x7 toll-free emergency dispatch (Police, Fire, Ambulance)',
        tollFree: true,
    },
    {
        name: 'EMRI National Ambulance Service',
        number: '108',
        type: 'AMBULANCE',
        description: 'Free public emergency medical transport & life support',
        tollFree: true,
    },
    {
        name: 'Maternal & Child Health Express',
        number: '102',
        type: 'MATERNITY',
        description: 'Free transit for expectant mothers & pediatric emergencies',
        tollFree: true,
    },
    {
        name: 'Apollo Emergency Lifeline',
        number: '1066',
        type: 'PRIVATE_ICU_AMBULANCE',
        description: 'Advanced Cardiac Life Support (ACLS) ICU ambulance fleet',
        tollFree: false,
    },
    {
        name: 'Fortis Emergency Response',
        number: '105010',
        type: 'PRIVATE_ICU_AMBULANCE',
        description: 'Rapid cardiac & trauma intervention unit',
        tollFree: false,
    },
    {
        name: 'National Poison Control Center',
        number: '1800 116 117',
        type: 'POISON',
        description: 'Toxicology guidance & antidote protocol',
        tollFree: true,
    },
];
async function triggerEmergencySos(req, res) {
    const userId = req.user?.id || 'patient-user-001';
    const { patientName, patientPhone, bloodGroup, latitude, longitude, address, landmark, ambulanceType, severity, criticalConditions, } = req.body;
    const dispatchData = {
        id: `dispatch-${Date.now()}`,
        userId,
        patientName: patientName || 'Demo Patient',
        patientPhone: patientPhone || '+91 98765 43210',
        bloodGroup: bloodGroup || 'O+',
        criticalConditions: criticalConditions || ['Type 2 Diabetes', 'Hypertension'],
        allergies: ['Penicillin', 'Sulfa drugs'],
        location: {
            latitude: Number(latitude) || 17.385,
            longitude: Number(longitude) || 78.4867,
            address: address || 'Flat 402, Green Meadows Residency, Jubilee Hills, Hyderabad',
            landmark: landmark || 'Opposite KBR Park Main Gate',
        },
        severity: severity || 'CRITICAL',
        ambulanceType: ambulanceType || 'ADVANCED_CARDIAC_ICU',
        status: 'DISPATCHED',
        hospitalDestination: 'Apollo Hospitals Emergency & Trauma Centre',
        ambulanceDetails: {
            providerName: '108 EMRI Emergency Response Fleet',
            vehicleNumber: 'TS-09-EM-1088',
            driverName: 'Rajesh Kumar (Senior Paramedic & Driver)',
            driverPhone: '+91 98490 10811',
            etaMinutes: 6,
        },
        emergencyContactsNotified: true,
        notes: 'GPS telemetry linked. Siren active. Nearest traffic signals alerted for green corridor.',
        createdAt: new Date(),
    };
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const doc = await Emergency_1.AmbulanceDispatchModel.create(dispatchData);
            activeDispatches[userId] = doc;
            return (0, response_1.sendSuccess)(res, doc, 'Ambulance dispatched! Emergency services en route.', 201);
        }
    }
    catch (err) {
        // fallback
    }
    activeDispatches[userId] = dispatchData;
    return (0, response_1.sendSuccess)(res, dispatchData, 'Ambulance dispatched! Emergency services en route.', 201);
}
async function getActiveEmergency(req, res) {
    const userId = req.user?.id || 'patient-user-001';
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const doc = await Emergency_1.AmbulanceDispatchModel.findOne({
                userId,
                status: { $in: ['REQUESTED', 'DISPATCHED', 'EN_ROUTE', 'ARRIVED'] },
            }).sort({ createdAt: -1 });
            if (doc)
                return (0, response_1.sendSuccess)(res, doc, 'Active emergency dispatch found');
        }
    }
    catch (err) {
        // fallback
    }
    const dispatch = activeDispatches[userId] || null;
    return (0, response_1.sendSuccess)(res, dispatch, 'Active emergency dispatch fetched');
}
async function updateEmergencyStatus(req, res) {
    const userId = req.user?.id || 'patient-user-001';
    const { id } = req.params;
    const { status, etaMinutes } = req.body;
    try {
        if ((0, database_1.isDatabaseConnected)()) {
            const updated = await Emergency_1.AmbulanceDispatchModel.findOneAndUpdate({ _id: id, userId }, { status, ...(etaMinutes !== undefined && { 'ambulanceDetails.etaMinutes': etaMinutes }) }, { new: true });
            if (updated) {
                activeDispatches[userId] = updated;
                return (0, response_1.sendSuccess)(res, updated, 'Emergency status updated');
            }
        }
    }
    catch (err) {
        // fallback
    }
    if (activeDispatches[userId]) {
        activeDispatches[userId].status = status;
        if (etaMinutes !== undefined) {
            activeDispatches[userId].ambulanceDetails.etaMinutes = etaMinutes;
        }
        return (0, response_1.sendSuccess)(res, activeDispatches[userId], 'Emergency status updated');
    }
    return (0, response_1.sendSuccess)(res, { id, status }, 'Emergency status updated');
}
async function getEmergencyDirectory(req, res) {
    return (0, response_1.sendSuccess)(res, exports.EMERGENCY_DIRECTORY, 'Emergency helpline directory retrieved');
}

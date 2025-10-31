import Patient from '../models/Patient.js'

//Get all health data for patient
router.get("/me/Patient", protect, async (req, res) => {
    try {
        const patientData = await Patient.findOne({ user: req.user.id });
        res.status(200).json(patientData);
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});


//Update patient health data
router.put("/me/Patient", protect, async (req, res) => {
    try {
        let patientData = await Patient.findOne({ user: req.user.id });
        if (!patientData) {
            patientData = await Patient.create({ user: req.user.id, ...req.body });
        } else {
            patientData = await Patient.findOneAndUpdate({ user: req.user.id }, req.body, { new: true });
        }
        res.status(200).json(patientData);
    } catch (e) {
        res.status(500).json({ message: "Server error" });
    }
});

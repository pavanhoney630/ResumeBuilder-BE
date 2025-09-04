// routes/resume.routes.js
const express = require("express");
const router = express.Router();
const {authToken} = require("../../middlewares/Auth.middleware");
const {createResume,getCurrentResume,getResumeVersions,updateResume,downloadResumePdf,deleteResumeVersion} = require("../../controllers/ResumeController/ResumeBuilder.controller");

// Create resume
router.post("/create", authToken, createResume);

// Get current resume
router.get("/current/:resumeId", authToken, getCurrentResume);

// Get all versions
router.get("/versions/:userId", authToken, getResumeVersions);

// Update resume
router.put("/update/:resumeId", authToken, updateResume);

// Download resume PDF
router.get("/download/:resumeId/:versionNum", authToken, downloadResumePdf);

// Delete a specific version
router.delete("/delete/:resumeId/:versionNum", authToken, deleteResumeVersion);

module.exports = router;

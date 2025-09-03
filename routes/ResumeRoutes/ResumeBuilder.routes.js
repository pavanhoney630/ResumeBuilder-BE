// routes/resume.routes.js
const express = require("express");
const router = express.Router();
const {authToken} = require("../../middlewares/Auth.middleware");
const {createResume,getCurrentResume,getResumeVersions,updateResume,downloadResumePdf} = require("../../controllers/ResumeController/ResumeBuilder.controller");

// Create resume
router.post("/create", authToken, createResume);

// Get current resume
router.get("/current/:userId", authToken, getCurrentResume);

// Get all versions
router.get("/versions/:userId", authToken, getResumeVersions);

// Update resume
router.put("/update/:resumeId", authToken, updateResume);

// Download resume PDF
router.get("/download/:resumeId/:versionNum", authToken, downloadResumePdf);

module.exports = router;

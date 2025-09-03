// controllers/resume.controller.js
const Resume = require("../../models/ResumeModel/ResumeBuilder.model");
const { generatePdfBuffer } = require("../../utils/pdfGenerator");

// Create or update resume (new version)
const createResume = async (req, res, next) => {
  try {
    const { personal, education, experience, skills } = req.body;

    let resume = await Resume.findOne({ user: req.user.id });

    if (!resume) {
      resume = new Resume({
        user:req.user.id,
        currentVersion: 1,
        versions: [
          {
            version: 1,
            personal,
            education,
            experience,
            skills,
          },
        ],
      });
    } else {
      const newVersion = resume.currentVersion + 1;
      resume.versions.push({
        version: newVersion,
        personal,
        education,
        experience,
        skills,
      });
      resume.currentVersion = newVersion;
    }

    await resume.save();
    res.status(201).json({ success: true, data: resume });
  } catch (err) {
    next(err);
  }
};

// Get current resume
const getCurrentResume = async (req, res, next) => {
  try {
    const {userId} = req.params
    const resume = await Resume.findOne({ user: userId });
    if (!resume) return res.status(404).json({ success: false, message: "Resume not found" });

    const current = resume.versions.find(v => v.version === resume.currentVersion);
    res.json({ success: true, data: current });
  } catch (err) {
    next(err);
  }
};

// Get all versions
const getResumeVersions = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const resume = await Resume.findOne({ user: userId });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    // Add download link for each version
    const versionsWithLinks = resume.versions.map((v) => ({
      ...v.toObject(), // convert Mongoose subdoc to plain object
      downloadLink: `${req.protocol}://${req.get("host")}/api/resume/download/${resume._id}/${v.version}`,
    }));

    res.json({
      success: true,
      message: "Resume versions fetched successfully",
      ResumeVersions: versionsWithLinks,
    });
  } catch (err) {
    next(err);
  }
};



const updateResume = async (req, res, next) => {
  try {
    const { personal, education, experience, skills } = req.body;

    let resume = await Resume.findOne({ user: req.user.id });
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    // find the latest version (by currentVersion number)
    const currentVersion = resume.versions.find(
      (v) => v.version === resume.currentVersion
    );

    if (!currentVersion) {
      return res.status(404).json({ success: false, message: "Current version not found" });
    }

    // update fields (only overwrite what was passed in req.body)
    if (personal) currentVersion.personal = personal;
    if (education) currentVersion.education = education;
    if (experience) currentVersion.experience = experience;
    if (skills) currentVersion.skills = skills;

    await resume.save();

    res.status(200).json({ success: true, data: resume });
  } catch (err) {
    next(err);
  }
};


// Download resume PDF
// Download specific resume version as PDF
const downloadResumePdf = async (req, res, next) => {
  try {
    const { resumeId, versionNum } = req.params;  // two params

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    // find the version by version number
    const selectedVersion = resume.versions.find(
      (v) => v.version === Number(versionNum)
    );

    if (!selectedVersion) {
      return res.status(404).json({ success: false, message: "Version not found" });
    }

    const pdfBuffer = await generatePdfBuffer(selectedVersion);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_v${selectedVersion.version}.pdf`,
    });

    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
};





module.exports = {
    createResume,
    getCurrentResume,
    getResumeVersions,
    updateResume,
    downloadResumePdf
};

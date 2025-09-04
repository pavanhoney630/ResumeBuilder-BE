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
    const { resumeId } = req.params; // should match :resumeId in route
    if (!resumeId) {
      return res.status(400).json({ success: false, message: "resumeId is required" });
    }

    const resume = await Resume.findById(resumeId);

    if (!resume)
      return res.status(404).json({ success: false, message: "Resume not found" });

    const current = resume.versions.find((v) => v.version === resume.currentVersion);

    res.json({ success: true, data: { ...resume.toObject(), currentVersion: current } });
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

    // Add _id and download link for each version
    const versionsWithLinks = resume.versions.map((v) => ({
      ...v.toObject(), // convert Mongoose subdoc to plain object
      resumeId: resume._id, // add parent resume _id
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
    const { resumeId } = req.params;  // <--- use this
    const { personal, education, experience, skills } = req.body;

    let resume = await Resume.findById(resumeId);  // <--- find by resumeId
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const currentVersion = resume.versions.find(
      (v) => v.version === resume.currentVersion
    );
    if (!currentVersion) {
      return res.status(404).json({ success: false, message: "Current version not found" });
    }

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

// Delete resume (entire resume with all versions)
// Delete a specific resume version
const deleteResumeVersion = async (req, res, next) => {
  try {
    const { resumeId, versionNum } = req.params;

    if (!resumeId || !versionNum) {
      return res.status(400).json({ success: false, message: "resumeId and versionNum are required" });
    }

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    const versionIndex = resume.versions.findIndex(v => v.version === Number(versionNum));
    if (versionIndex === -1) {
      return res.status(404).json({ success: false, message: "Version not found" });
    }

    // Remove the version
    resume.versions.splice(versionIndex, 1);

    // If deleted version was the current version, set currentVersion to the latest version
    if (resume.currentVersion === Number(versionNum)) {
      const latestVersion = Math.max(...resume.versions.map(v => v.version));
      resume.currentVersion = latestVersion || 0; // 0 if no versions left
    }

    await resume.save();

    res.status(200).json({
      success: true,
      message: `Version ${versionNum} deleted successfully`,
    });
  } catch (err) {
    next(err);
  }
};






module.exports = {
    createResume,
    getCurrentResume,
    getResumeVersions,
    updateResume,
    downloadResumePdf,
    deleteResumeVersion
};

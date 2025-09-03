// models/resume.model.js
const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema(
  {
    school: { type: String, required: true, trim: true },
    degree: { type: String, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
  },
  { _id: false }
);

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    current: { type: Boolean, default: false },
    description: { type: String, trim: true, maxlength: 3000 },
  },
  { _id: false }
);

const ResumeVersionSchema = new mongoose.Schema(
  {
    version: { type: Number, required: true },
    personal: {
      firstName: { type: String, required: true, trim: true },
      lastName: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true },
      phone: { type: String, trim: true },
      summary: { type: String, trim: true, maxlength: 2000 },
    },
    education: [EducationSchema],
    experience: [ExperienceSchema],
    skills: [{ type: String, trim: true }],
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    currentVersion: { type: Number, default: 1 },
    versions: [ResumeVersionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", ResumeSchema);

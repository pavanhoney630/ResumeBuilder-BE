// utils/pdfGenerator.js
const PDFDocument = require("pdfkit");

exports.generatePdfBuffer = (resume) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text(`${resume.personal.firstName} ${resume.personal.lastName}`, { align: "center" });
      doc.fontSize(12).text(resume.personal.email, { align: "center" });
      if (resume.personal.phone) doc.text(resume.personal.phone, { align: "center" });
      doc.moveDown();

      // Summary
      if (resume.personal.summary) {
        doc.fontSize(14).text("Summary", { underline: true });
        doc.fontSize(12).text(resume.personal.summary);
        doc.moveDown();
      }

      // Education
      if (resume.education?.length) {
        doc.fontSize(14).text("Education", { underline: true });
        resume.education.forEach((edu) => {
          doc.fontSize(12).text(`${edu.degree} in ${edu.fieldOfStudy} - ${edu.school}`);
        });
        doc.moveDown();
      }

      // Experience
      if (resume.experience?.length) {
        doc.fontSize(14).text("Experience", { underline: true });
        resume.experience.forEach((exp) => {
          doc.fontSize(12).text(`${exp.title} at ${exp.company}`);
          if (exp.description) doc.text(exp.description);
        });
        doc.moveDown();
      }

      // Skills
      if (resume.skills?.length) {
        doc.fontSize(14).text("Skills", { underline: true });
        doc.fontSize(12).text(resume.skills.join(", "));
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

exports.generatePdfBuffer = (resume) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // ----- REGISTER AND USE FONT -----
      const fontPath = path.join(__dirname, "fonts", "Noto_Serif", "static", "NotoSerif-Regular.ttf");
      if (!fs.existsSync(fontPath)) {
        throw new Error("Font file not found at " + fontPath);
      }
      doc.registerFont("NotoSerif", fontPath);
      doc.font("NotoSerif");

      // ----- HEADER -----
      doc.rect(0, 0, doc.page.width, 80).fill("#0d6efd"); // header background
      doc
        .fillColor("white")
        .fontSize(24)
        .text(`${resume.personal.firstName} ${resume.personal.lastName}`, 50, 25, { align: "left" });
      doc
        .fontSize(12)
        .text(`📧 ${resume.personal.email} | 📞 ${resume.personal.phone || "-"}`, 50, 55, { align: "left" });

      doc.moveDown(2);

      // ----- SUMMARY -----
      if (resume.personal.summary) {
        doc.fillColor("#0d6efd").fontSize(16).text("Summary", { underline: true });
        doc.moveDown(0.2);
        doc.fillColor("black").fontSize(12).text(resume.personal.summary);
        doc.moveDown();
      }

      // ----- EDUCATION -----
      if (resume.education?.length) {
        doc.fillColor("#0d6efd").fontSize(16).text("Education", { underline: true });
        doc.moveDown(0.2);
        resume.education.forEach((edu) => {
          doc
            .fillColor("black")
            .fontSize(12)
            .text(`${edu.degree} in ${edu.fieldOfStudy}`, { continued: true })
            .fillColor("#6c757d")
            .text(` - ${edu.school}`);
        });
        doc.moveDown();
      }

      // ----- EXPERIENCE -----
      if (resume.experience?.length) {
        doc.fillColor("#0d6efd").fontSize(16).text("Experience", { underline: true });
        doc.moveDown(0.2);
        resume.experience.forEach((exp) => {
          doc.fillColor("black").fontSize(12).text(`${exp.title} at ${exp.company}`);
          if (exp.description) doc.fillColor("#495057").text(exp.description, { indent: 20 });
        });
        doc.moveDown();
      }

      // ----- SKILLS -----
      if (resume.skills?.length) {
        doc.fillColor("#0d6efd").fontSize(16).text("Skills", { underline: true });
        doc.moveDown(0.2);

        let x = doc.x;
        let y = doc.y;
        const skillHeight = 20;

        resume.skills.forEach((skill) => {
          const skillWidth = doc.widthOfString(skill) + 15;
          doc.rect(x, y, skillWidth, skillHeight).fill("#0d6efd").stroke();
          doc.fillColor("white").fontSize(10).text(skill, x + 5, y + 5);
          x += skillWidth + 5;
          if (x > doc.page.width - 100) {
            x = doc.x;
            y += skillHeight + 5;
          }
        });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

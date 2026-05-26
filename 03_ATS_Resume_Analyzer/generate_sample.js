const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs');

async function createPdf() {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  
  page.drawText('John Doe\nSoftware Engineer\njohn.doe@example.com | 555-0100 | linkedin.com/in/johndoe\n\nExperience\nSenior Developer at Tech Corp (2020-Present)\n- Built awesome things using React, Node.js, and AWS.\n- Increased revenue by 20%.\n\nEducation\nB.S. Computer Science, University of Technology', {
    x: 50,
    y: height - 4 * fontSize,
    size: fontSize,
    font: timesRomanFont,
    color: rgb(0, 0, 0),
  });
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('./sample_resume.pdf', pdfBytes);
  console.log('sample_resume.pdf created successfully');
}

createPdf();

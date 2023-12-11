const { PDFDocument, PDFName } = require('pdf-lib');
const express = require('express');
const fs = require('fs').promises;
const Router = express.Router();
Router.use(express.json());
Router.use(express.urlencoded({ extended: true }));
const multer  = require('multer');

const storage = multer.memoryStorage(); // You can change this to diskStorage if you want to save files to disk
const upload = multer({ storage: storage });

// Router
// .route('/MakePDF')
// .post(upload.fields([{ name: 'file1' }, { name: 'file2' }]),async (req,res)=>{
//   try {
//   console.log(req.files['file1'][0]);  
//   const pdfFiles = [req.body.pdf1, req.body.pdf2];
//    console.log(pdfFiles);
 
//   mergePDFs(pdfFiles);
//   res.sendStatus(200);
//  } catch (error) {
//   res.sendStatus(401);
//  }
  

Router
.route('/MakePDF')
.post(async (req,res)=>{
  try {
  const pdfFiles = [req.body.pdf1, req.body.pdf2];
   console.log(pdfFiles);
 
  mergePDFs(pdfFiles);
  res.sendStatus(200);
 } catch (error) {
  res.sendStatus(401);
 } 
  
})
const mergePDFs = async (filePaths) => {
  try {
    const pdfDoc = await PDFDocument.create();

    for (const filePath of filePaths) {
      const pdfBytes = await fs.readFile(filePath);
      const pdf = await PDFDocument.load(pdfBytes);

      const copiedPages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => pdfDoc.addPage(page));
    }

    const mergedPdfBytes = await pdfDoc.save();
    await fs.writeFile('merged.pdf', mergedPdfBytes);

    console.log('PDFs merged successfully into merged.pdf');
  } catch (error) {
    console.error('Error merging PDFs:', error);
  }
};

module.exports=Router;
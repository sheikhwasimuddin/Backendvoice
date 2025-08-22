const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Route for uploading audio file and processing it
app.post('/upload', upload.single('audio'), (req, res) => {
  const filePath = req.file.path;
  console.log('Received file: ', filePath);

  // Run Python script to transcribe and analyze emotions
  exec(`python3 model.py ${filePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send(`Error: ${stderr}`);
    }
    
    // Send the output from Python as the response
    res.json(JSON.parse(stdout));
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

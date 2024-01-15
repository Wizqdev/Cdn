// Importing
const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const languageDetect = require('language-detect');
const config = require('./config.json');

// Defining
const app = express();
Port = config.Web.Port;
const publicFolderPath = path.join(__dirname, 'Public');

// Setting View Point
app.enable('trust proxy');
app.set('views', './Pages');
app.set('view engine', 'ejs');

// Loading In Static
app.use('/', express.static('./Public'));

// Multer Setup For File Upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;

    // Check file type and set destination accordingly
    if (file.mimetype.includes('image')) {
      uploadPath = path.join(publicFolderPath, 'Images');
    } else if (file.mimetype.includes('video')) {
      uploadPath = path.join(publicFolderPath, 'Videos');
    } else if (file.mimetype.includes('audio')) {
      uploadPath = path.join(publicFolderPath, 'Audio');
    } else if (file.mimetype.includes('text') || file.mimetype.includes('application/json')) {
      uploadPath = path.join(publicFolderPath, 'Txt');
    } else {
      const detectedLanguages = languageDetect.detectOne(file.buffer.toString());

      if (detectedLanguages) {
        uploadPath = path.join(publicFolderPath, detectedLanguages);
      } else {
        uploadPath = publicFolderPath;
      }
    }

    fs.promises.mkdir(uploadPath, { recursive: true })
      .then(() => {
        cb(null, uploadPath);
      })
      .catch(err => {
        console.error('Error creating destination folder:', err);
        cb(err);
      });
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Defining 
const upload = multer({ storage: storage });

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/upload', (req, res) => {
  res.render('upload');
});

app.post('/upload', upload.single('file'), (req, res) => {
  const uploadedPath = path.relative(publicFolderPath, req.file.path);
  res.json({ uploadedPath });
});

console.clear();
console.log('');
console.log('_________ ________    _______   ');
console.log('\\_   ___ \\______ \\   \\      \\  ');
console.log('/    \\  \\/ |    |  \\  /   |   \\ ');
console.log('\\     \\____|    `   \\/    |    \\');
console.log(' \\______  /_______  /\\____|__  /');
console.log('        \\/        \\/         \\/ ');
console.log('');
console.log('|Creator: github.com/Wizqdev           |');
console.log('|Creator: Website: https://wizq.dev     |');
console.log('|Contact: https://wizq.dev/discord     |');
console.log('');


// Servering The Server 
app.listen(Port, () => {
  console.log(`Server Running On Port ${Port}`);
});

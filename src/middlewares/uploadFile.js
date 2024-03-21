// const multer = require("multer");
// const { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } = require("../config");
// const storage = multer.memoryStorage({});

// const fileFilter = (req, file, cb) => {
//   if (!file.mimetype.startsWith("image/")) {
//     return cb(new Error("Only image files are allowed"), false);
//   }
//   if (file.size > MAX_FILE_SIZE) {
//     return cb(new Error("File size exceeds the maximum limit"), false);
//   }
//   if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
//     return cb(new Error("File extension is not allowed"), false);
//   }

//   cb(null, true);
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

// module.exports = upload;


const multer = require("multer");
const path = require("path");

const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2 MB
const UPLOAD_DIRECTORY = 'public/images/users';
const ALLOWED_FILE_TYPES = ["jpg", "jpeg", "png", "gif"];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIRECTORY);
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extname, "") + extname
    );
  },
});

const fileFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).substring(1);
  if (!ALLOWED_FILE_TYPES.includes(extname.toLowerCase())) {
    return cb(new Error("File type not allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: fileFilter,
});

module.exports = upload;


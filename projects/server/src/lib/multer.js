// Import Multer
const multer = require("multer");
// Import File System
const fs = require("fs");

// 1. Setup Disk Storage & Filename
let defaultPath = "Public";
var storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    console.log(file);
    // Check Directory (Exist or Not)
    let isDirectoryExist = fs.existsSync(`src/${defaultPath}/${file.fieldname}`);

    if (!isDirectoryExist) {
      await fs.promises.mkdir(`src/${defaultPath}/${file.fieldname}`, {
        recursive: true,
      });
    }

    // To Create 'Public/pdf' or 'Public/images'
    if (file.fieldname === "files") {
      cb(null, `src/${defaultPath}/${file.fieldname}`); // Public/files
    }
    if (file.fieldname === "images") {
      cb(null, `src/${defaultPath}/${file.fieldname}`); // Public/images
    }
    if (file.fieldname === "property") {
      cb(null, `src/${defaultPath}/${file.fieldname}`); //Public/property
    }
    if (file.fieldname === "profile") {
      cb(null, `src/${defaultPath}/${file.fieldname}`); //Public/profile
    }
    if (file.fieldname === "payment_proof") {
      cb(null, `src/${defaultPath}/${file.fieldname}`); //Public/payment_proof
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      "PIMG" +
        "-" +
        Date.now() +
        Math.round(Math.random() * 1000000000) +
        "." +
        file.mimetype.split("/")[1]
    ); // [image, png]
  },
});

// 2. Setup File Filter
var fileFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.split("/")[0] === "image") {
    // [image, png]
    // Accept
    cb(null, true);
  } else if (file.mimetype.split("/")[0] !== "image") {
    // Reject
    cb(new Error("File Must Be Image!"));
  }
};

exports.multerUpload = multer({ storage: storage, fileFilter: fileFilter });

// Import Multer
const { multerUpload } = require("./../lib/multer");

// Import DeleteFiles
const deleteFiles = require("./../helpers/deleteFiles");
const uploadImagesProperty = (req, res, next) => {
  const multerResultProperty = multerUpload.fields([
    { name: "property", maxCount: 3 },
  ]);

  multerResultProperty(req, res, function (err) {
    try {
      if (err) throw err;

      req.files.property.forEach((value) => {
        if (value.size > 1100000)
          throw {
            message: `${value.originalname} size too large`,
          };
      });

      next();
    } catch (error) {
      console.log(error);
      if (req.files.property) {
        deleteFiles(req.files.property);
      }
      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  });
};

module.exports = uploadImagesProperty;

// Import Multer
const { multerUpload } = require("./../lib/multer");

// Import DeleteFiles
const deleteFiles = require("./../helpers/deleteFiles");
const uploadImagesProfilePic = (req, res, next) => {
  const multerResultProperty = multerUpload.fields([
    { name: "profile", maxCount: 3 },
  ]);

  multerResultProperty(req, res, function (err) {
    try {
      if (err) throw err;

      req.files.profile.forEach((value) => {
        if (value.size > 1100000)
          throw {
            message: `${value.originalname} size too large`,
          };
      });

      next();
    } catch (error) {
      console.log(error);
      if (req.files.profile) {
        deleteFiles(req.files.profile);
      }
      res.status(400).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  });
};

module.exports = uploadImagesProfilePic;

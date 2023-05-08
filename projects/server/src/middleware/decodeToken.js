const { validateToken } = require("../lib/jwt");

module.exports = {
  verifyToken: (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).send({
        isError: true,
        message: "Token not found",
        isData: false,
        data: null,
      });
    }

    try {
      const validateTokenResult = validateToken(token);
      req.dataToken = validateTokenResult;
      next();
    } catch (error) {
      console.log(error.message);
      res.status(401).send({
        isError: true,
        message: error.message,
        data: null,
      });
    }
  },
};
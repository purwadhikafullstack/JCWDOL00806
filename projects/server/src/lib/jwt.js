const jwt = require('jsonwebtoken')

const createToken = (payload) => {
    return jwt.sign(payload, `${process.env.JWT_TOKEN}`, {
        expiresIn: '1h'
    })
}

const validateToken = (token) => {
    return jwt.verify(token, `${process.env.JWT_TOKEN}`)
}

module.exports = {
    createToken,
    validateToken,
}
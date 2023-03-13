const jwt = require('jsonwebtoken')

const jwtVerify = (req, res, next) => {
    // Get token from headers
    const token = req.headers.authorization

    if (!token)
        return res.status(406).send({
            error: true,
            message: 'Token Not Found!',
            data: null
        })

    jwt.verify(token, `${process.env.JWT_TOKEN}`, (err, data) => {
        try {
            if (err) throw err

            req.dataDecode = data

            next()
        } catch (error) {
            res.status(500).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    })
}

module.exports = jwtVerify
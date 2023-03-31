// import multer
const { multerUpload } = require("./../lib/multer")

// import deleteFiles
const deleteFiles = require("./../helpers/deleteFiles")

const uploadImagesPaymentProof = (req, res, next) => {
    const multerResultPaymentProof = multerUpload.fields([
        { name: "payment_proof", maxCount: 3 }
    ])

    multerResultPaymentProof(req, res, function(err) {
        try {
            if (err) throw err

            req.files.payment_proof.forEach((value) => {
                if (value.size > 1100000)
                    throw {
                        message: `${value.originalname} size too large`
                    }
            })

            next()
        } catch (error) {
            if (req.files.payment_proof)
                deleteFiles(req.files.payment_proof)

            res.status(400).send({
                isError: true,
                message: error.message,
                data: null
            })
        }
    })
}

module.exports = uploadImagesPaymentProof
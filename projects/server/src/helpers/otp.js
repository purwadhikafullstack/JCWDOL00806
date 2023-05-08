const genereateOTP = () => {
    let OTP = ''

    // generate a 6-digit OTP
    for (let i = 1; i <= 6; i++) {
        OTP += Math.floor(Math.random() * 10)
    }

    return OTP
}

const checkOtpExpired = (lastGenerateOtp) => {
    let lastTimestamp = new Date(lastGenerateOtp).getTime()
    let timeDiff = Date.now() - lastTimestamp
    let hoursDiff = timeDiff / (1000 * 60 * 60)

    if (hoursDiff >= 24) return true

    return false
}

module.exports = {
    genereateOTP,
    checkOtpExpired,
}
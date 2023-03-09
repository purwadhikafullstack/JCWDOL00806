const bcrypt = require('bcrypt')
const saltRounds = 10

const hashPassword = async (password) => {
    try {
        return await bcrypt.hash(password, saltRounds)
    } catch (e) {
        return null
    }
}

const hashMatch = async (passwordFromLogin, hashedPasswordFromDatabase) => {
    try {
        let match = await bcrypt.compare(passwordFromLogin, hashedPasswordFromDatabase)
        return match
    } catch (error) {
        return false
    }
}

module.exports = {
    hashPassword,
    hashMatch,
}
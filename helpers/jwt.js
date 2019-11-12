const jwt = require('jsonwebtoken')


module.exports = {
    createJWTToken: (payload) => {
        return jwt.sign(payload, 'sutrisno', {
            expiresIn: '12h'
        })
    }
}
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')

module.exports = (req, res, next) => {

    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1]

        if (!token) {
            throw new HttpError('Auth faild!')
        }

        const decodedToken = jwt.verify(token, 'secret_key')
        req.userData = { userId: decodedToken.userId }
        next()

    } catch (err) {
        const error = new HttpError('Auth faild!', 401)
        return next(error)
    }
}
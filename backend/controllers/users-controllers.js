const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const HttpError = require('../models/http-error')
const User = require('../models/user')

const getUsers = async (req, res, next) => {
    let users

    try {
        users = await User.find({}, '-passwrod')
    } catch (err) {
        const error = new HttpError('Getting users faild', 500)
        return next(error)
    }

    res.json({ users: users.map(user => user.toObject({ getters: true })) })
}

const singup = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        throw new HttpError('Invalid Inputs', 422)
    }

    const { name, email, password } = req.body

    let existingUser

    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError('Sing up faild.', 500)
        return next(error)
    }

    if (existingUser) {
        const error = new HttpError('User exist.', 422)
        return next(error)
    }

    let hashedPassword

    try {
        hashedPassword = await bcrypt.hash(password, 12)
    } catch (err) {
        const error = new HttpError('Could not create user', 500)
        return next(error)
    }

    const createdUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
        image: req.file.path,
        posts: []
    })

    try {
        await createdUser.save()
    } catch (err) {
        const error = new HttpError('Sing up faild.', 500)
        return next(error)
    }

    let token

    try {
        token = jwt.sign(
            { userId: createdUser.id, email: createdUser.email },
            'secret_key',
            { expiresIn: '1h' }
        )
    } catch (err) {
        const error = new HttpError('Sing up faild.', 500)
        return next(error)
    }

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        token: token
    })
}

const login = async (req, res, next) => {
    const { email, password } = req.body

    let existingUser

    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        const error = new HttpError('Logimn faild.', 500)
        return next(error)
    }

    if (!existingUser) {
        const error = new HttpError('Invalid inputs.', 401)
        return next(error)
    }

    let isValidPassword = false

    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (err) {
        const error = new HttpError('Could not login.', 500)
        return next(error)
    }

    if (!isValidPassword) {
        const error = new HttpError('Invalid inputs.', 401)
        return next(error)
    }

    let token

    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'secret_key',
            { expiresIn: '1h' }
        )
    } catch (err) {
        const error = new HttpError('Login faild.', 500)
        return next(error)
    }

    res.json({
        userId: existingUser.id,
        email: existingUser.email,
        token: token
    })
}

exports.getUsers = getUsers
exports.singup = singup
exports.login = login
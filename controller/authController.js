const User = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerController = async (req, res) => {
    const { name, email, password } = req.body

    try {
        const salt = await bcrypt.genSaltSync(15);
        const hashPassword = await bcrypt.hash(password, salt)
        const user = new User({
            name,
            email,
            password: hashPassword
        })

        await user.save()

        return res.send({
            message: 'create user',
            status: 'seccess',
            code: "201"
        })
    } catch (error) {
        return res.send({
            message: 'this email use before',
            status: 'fail',
            code: "400"
        })
    }
}

const loginController = async (req, res) => {
    try {
        // const { email, password } = req.body
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.send({
                message: 'user not found'
            })
        }

        const unhashPassword = await bcrypt.compare(req.body.password, user.password)
        if (!unhashPassword) {
            return res.send({
                message: 'invalid credentials'
            })
        }

        const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY)
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        return res.send({
            message: 'success'
        })

    } catch (error) {
        return res.send({
            message: 'error in login'
        })
    }
}

const logoutController = async (req, res) => {
    res.cookie('jwt', '', { maxAge: '' })
    return res.send({
        message: 'success'
    })
}

const userController = async (req, res) => {
    try {
        const cookie = req.cookies['jwt']
        const claims = jwt.verify(cookie, process.env.SECRET_KEY)

        if (!claims) {
            return res.send({
                message: 'unauthenticated'
            })
        }

        const user = await User.findOne({ _id: claims._id })

        const { password, ...data } = await user.toJSON()

        return res.send(data)
    }
    catch (error) {
        return res.send({
            message: 'unauthenticated'
        })
    }
}


module.exports = {
    registerController,
    loginController,
    logoutController,
    userController
}
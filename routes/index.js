const express = require('express')
const { registerController, loginController, userController, logoutController } = require('../controller/authController')
const route = express.Router()

route.post('/register', registerController)
route.post('/login', loginController)
route.post('/logout', logoutController)
route.get('/user', userController)

module.exports = route
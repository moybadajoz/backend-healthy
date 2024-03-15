const express = require('express')
const { registerUser, loginUser } = require('./../controller/userController') //'./../controller/userController'
const router = express.Router()
const authenticateToken = require('./../auth/authMiddleware')


router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/get-all-users', authenticateToken, (req, res) => {
    res.json({
        message: 'Protected Path'
    })
})

module.exports = router
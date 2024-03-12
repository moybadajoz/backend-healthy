const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = admin.firestore()

// Ruta Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const userRef = db.collection('users').doc(email)
        const userDoc = await userRef.get()

        if (!userDoc.exists) {
            return res.status(401).json({
                'status': 'failed',
                'message': 'Invalid email or password'
            })
        }

        const userData = userDoc.data()
        const isPassValid = await bcrypt.compare(password, userData.password)

        if (!isPassValid) {
            return res.status(401).json({
                'status': 'failed',
                'message': 'Invalid email or password'
            })
        }

        const token = jwt.sign(
            { email: userData.email },
            'CLAVE SUPER SECRETA',
            { expiresIn: '1h' })
        return res.json({
            'status': 'success',
            token
        })

    } catch (error) {
        return res.json({
            'status': 'failed',
            'error': error
        })
    }
})

module.exports = router
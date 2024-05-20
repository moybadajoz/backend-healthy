const jwt = require('jsonwebtoken')
const User = require('../models/User')

const registerPatient = async (req, res) => {
    try {
        console.log(req.body)
        console.log(req.user)
        const { email, nombre, apaterno, amaterno, direccion, telefono, sexo, edad } = req.body
        const { userId } = req.user
        const existingUser = await User.findByEmail(email)

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exist'
            })
        }

        const newUser = await User.createUser(email, password, nombre, apaterno, amaterno, direccion, telefono)

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser
        })
    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers()
        res.json({
            users,
            message: 'success'
        })
    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const deleteUser = async (req, res) => {
    const userEmail = req.params.email
    try {
        await User.deleteUser(userEmail)
        res.status(204).send()
    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const updateUser = async (req, res) => {
    const userEmail = req.params.email
    const userData = req.body
    try {
        const userUpdated = await User.updateUser(userEmail, userData)
        res.json({
            userUpdated,
            message: 'success'
        })
    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}


module.exports = { 
    registerPatient, 
}
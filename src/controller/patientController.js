const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Patient = require('../models/Patient')

const registerPatient = async (req, res) => {
    try {
        const { email, nombre, apaterno, amaterno, direccion, telefono, sexo, edad } = req.body
        const { userId } = req.user

        const existingPatient = await Patient.findPatientByEmail(email, userId)
        // console.log(existingPatient)
        if (existingPatient) {
            return res.status(400).json({
                message: 'Patient already exist'
            })
        }
        const newPatient = await Patient.createPatient(nombre, apaterno, amaterno, edad, sexo, email, telefono, direccion, userId)

        res.status(201).json({
            message: 'Patient registered successfully',
            user: newPatient
        })
    } catch {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const getAllPatientsByUser = async (req, res) => {
    try {
        const { userId } = req.user
        const patients = await Patient.getAllPatientsByUser (userId)
        res.json({
            patients,
            message: 'success'
        })
    } catch {
        res.status(500).json({ 
            message: 'Internal Server Error'
        })
    }
}

// const deleteUser = async (req, res) => {
//     const userEmail = req.params.email
//     try {
//         await User.deleteUser(userEmail)
//         res.status(204).send()
//     } catch {
//         res.status(500).json({
//             message: 'Internal Server Error'
//         })
//     }
// }

// const updateUser = async (req, res) => {
//     const userEmail = req.params.email
//     const userData = req.body
//     try {
//         const userUpdated = await User.updateUser(userEmail, userData)
//         res.json({
//             userUpdated,
//             message: 'success'
//         })
//     } catch {
//         res.status(500).json({
//             message: 'Internal Server Error'
//         })
//     }
// }


module.exports = { 
    registerPatient, 
    getAllPatientsByUser
}
const express = require('express')
const { registerUser, loginUser, getAllUsers, deleteUser, updateUser } = require('./../controller/userController') //'./../controller/userController'
const { registerPatient, getAllPatientsByUser } = require('./../controller/patientController')
const { bookingAppointment, getAppointments } = require('./../controller/appointmentController')
const router = express.Router()
const authenticateToken = require('./../auth/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/get-all-users', authenticateToken, getAllUsers)
router.delete('/users/:email', authenticateToken, deleteUser)
router.put('/users/:email', authenticateToken, updateUser)

router.post('/register_patient', authenticateToken, registerPatient)
router.get('/getAllPatients', authenticateToken, getAllPatientsByUser)

router.post('/bookingAppointment', authenticateToken, bookingAppointment)
router.get('/getAppointments/:start/:end', authenticateToken, getAppointments)

module.exports = router
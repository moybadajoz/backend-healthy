const express = require('express')

const { registerUser, loginUser, getAllUsers, deleteUser, updateUser } = require('./../controller/userController') //'./../controller/userController'
const { registerPatient, getAllPatientsByUser } = require('./../controller/patientController')
const { bookingAppointment, getAppointments, nextAppointment, cancelAppointment, rescheduleAppt } = require('./../controller/appointmentController')
const router = express.Router()
const authenticateToken = require('./../auth/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/get-all-users', authenticateToken, getAllUsers)
router.delete('/users/:email', authenticateToken, deleteUser)
router.put('/users/:email', authenticateToken, updateUser)

router.post('/register_patient', authenticateToken, registerPatient)
router.get('/get-all-patients', authenticateToken, getAllPatientsByUser)

router.post('/bookingAppointment', authenticateToken, bookingAppointment)
router.get('/getAppointments/:start/:end', authenticateToken, getAppointments)
router.get('/next-appointment/:now', authenticateToken, nextAppointment)
router.put('/cancelAppointment/:id', authenticateToken, cancelAppointment)
router.put('/reschedule-appointment/:id', authenticateToken, rescheduleAppt)

module.exports = router
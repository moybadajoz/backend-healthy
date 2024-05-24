const Patient = require('../models/Patient')
const Appointment = require('../models/Appointment')
const User = require('../models/User')
const { config } = require('dotenv')

const bookingAppointment = async (req, res) => {
    try {
        const { patientId, date, time, notes } = req.body
        const { userId } = req.user
        // console.log('@@@ appointment =>\n', patientId, date, time, userId)
        console.log('@@ date conversion => ', new Date(`${date}T${time}`))
        const dateTime = new Date(`${date}T${time}`)
        const conflictByUser = await Appointment.findAppointmentConflictByUser(userId, dateTime)
        
        if (conflictByUser.conflict) {
            return res.json({
                message: "Conflict with the user's schedule"
            })
        }
        const conflictByPatient = await Appointment.findAppointmentConflictByPatient(patientId, dateTime)
        if (conflictByPatient.conflict) {
            return res.json({
                message: "Conflict with the patient's schedule"
            })
        }
        const newAppointment = await Appointment.bookingAppointment(patientId, dateTime, notes, userId)
        return res.json({
            message: 'todo bien de momento'
        })
        
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports = {
    bookingAppointment
}
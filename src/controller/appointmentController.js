const Patient = require('../models/Patient')
const Appointment = require('../models/Appointment')
const User = require('../models/User')
const { config } = require('dotenv')
const { messaging, app } = require('firebase-admin')

const bookingAppointment = async (req, res) => {
    try {
        const { patientId, dateTimeStart, dateTimeEnd, notes } = req.body
        const { userId } = req.user
        // console.log(dateTimeStart)
        const newDateTimeStart = new Date(dateTimeStart)
        const newDateTimeEnd = new Date(dateTimeEnd)
        // console.log('@@@ appointment =>\n', patientId, date, time, userId)
        const conflictByUser = await Appointment.findAppointmentConflictByUser(userId, newDateTimeStart, newDateTimeEnd)
        
        if (conflictByUser.conflict) {
            return res.json({
                message: "Conflict with the user's schedule"
            })
        }
        const conflictByPatient = await Appointment.findAppointmentConflictByPatient(patientId, newDateTimeStart, newDateTimeEnd)
        if (conflictByPatient.conflict) {
            return res.json({
                message: "Conflict with the patient's schedule"
            })
        }
        const newAppointment = await Appointment.bookingAppointment(patientId, newDateTimeStart, newDateTimeEnd, notes, userId)
        return res.json({
            appoinment: newAppointment,
            message: 'Successful'
        })
        
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const getAppointments = async (req, res) => {
    try {
        const { start, end } = req.params
        const { userId } = req.user
    
        const queryStartOfDate = new Date(start)
        const queryEndOfDate = new Date(end)
        // console.log('@@ => ', req.params)
        const appointments = await Appointment.getAllAppointmentsByUserAndDate(userId, queryStartOfDate, queryEndOfDate)
        // console.log(appointments)
        const appointmentsDetails = await Appointment.getPatientDetails(appointments)
        return res.json({
            appointments: appointmentsDetails
        })
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports = {
    bookingAppointment,
    getAppointments
}
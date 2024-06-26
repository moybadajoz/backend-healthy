const Patient = require('../models/Patient')
const Appointment = require('../models/Appointment')
const User = require('../models/User')
const { config } = require('dotenv')
const { messaging, app } = require('firebase-admin')
const { updateUser } = require('../interfaces/IUser')

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
        const newAppointment = await Appointment.bookingAppointment(patientId, newDateTimeStart, newDateTimeEnd, notes, userId, 'Booking')
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

const nextAppointment = async (req, res) => {
    try {
        const { now } = req.params
        const { userId } = req.user

        const time = new Date(now)

        const appointment = await Appointment.getNextAppointment(userId, time)

        return res.status(200).json({
            message: 'Success',
            appointment: appointment
        })

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params
        // const { userId } = req.user
        const status = await Appointment.cancelAppt(id)
        // console.log('@')
        if (status.status === 0){
            return res.json({
                message: "Success"
            })
        }
        return res.json({
            message: "SWW"
        })

    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const rescheduleAppt = async(req, res) => {
    try {
        const { patientId, dateTimeStart, dateTimeEnd, notes } = req.body
        const { userId } = req.user
        const { id } = req.params
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
        const data = {
            dateTimeStart: newDateTimeStart,
            dateTimeEnd: newDateTimeEnd,
            notes: notes
        }
        await Appointment.updateAppt(id, data)
        return res.json({
            message: 'Successful'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}

const appointmentComplete = async(req, res) => {
    try {
        const { comments, treatment, prescription, payment } = req.body
        const { id } = req.params

        const data = {
            comments,
            treatment,
            prescription,
            payment,
            state: 'Complete'
        }

        await Appointment.updateAppt(id, data)
        return res.json({
            message: 'success'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}

const getAppointmentsByPatient = async(req, res) => {
    try {    
        const { id } = req.params
        const appointments = await Appointment.getAllAppointmentsByPatient(id)
        return res.json({
            message: 'success',
            appointments: appointments.appointments
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params
        const appoinment = await Appointment.getAppointmentById(id)
        return res.json({
            message: 'success',
            appt: appoinment.appointment
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

module.exports = {
    bookingAppointment,
    getAppointments,
    nextAppointment,
    cancelAppointment,
    rescheduleAppt,
    appointmentComplete,
    getAppointmentsByPatient,
    getAppointmentById
}
const admin = require('../config/firebase')
const bcrypt = require('bcrypt')
const IAppointment = require('../interfaces/IAppointment')
const firestore = admin.firestore()

class Appointment extends IAppointment {
    constructor(patientId, date, time, notes, userId) {
        super()
        this.patientId = patientId
        this.date = date
        this.time = time
        this.notes = notes
        this.userId = userId
        //agrega si la cita ya se completo o no
    }

    static async bookingAppointment (patientId, dateTime, notes, userId) {
        try {
            const appointment = firestore.collection('appointments').doc()
            await appointment.set({
                patientId,
                dateTime,
                notes,
                userId
            })
            return new Appointment(patientId, dateTime, notes, userId)
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error creating user')
        }
    }

    static async findAppointmentConflictByUser (userId, dateTime) {
        try {
            const appointments = await firestore.collection('appointments')
                .where('dateTime', "==", dateTime)
                .where('userId', "==", userId)
                .get()

            return {
                conflict: appointments.docs.length > 0
            }
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error finding conflicts by User')
        }
    }

    static async findAppointmentConflictByPatient (patientId, dateTime) {
        try {
            const appointments = await firestore.collection('appointments')
                .where('dateTime', "==", dateTime)
                .where('userId', "==", patientId)
                .get()

            return {
                conflic: appointments.docs.length > 0
            }
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error finding conflicts by User')
        }
    }
}

module.exports = Appointment
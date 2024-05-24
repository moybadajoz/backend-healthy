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
    }

    static async bookingAppointment (patientId, date, time, notes, userId) {
        try {
            const appointment = firestore.collection('appointments').doc()
            await appointment.set({
                patientId,
                date,
                time,
                notes,
                userId
            })
            return new Appointment(patient, date, time, notes, user)
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error creating user')
        }
    }
}

module.exports = Appointment
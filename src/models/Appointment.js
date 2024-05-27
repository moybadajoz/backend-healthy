const admin = require('../config/firebase')
const bcrypt = require('bcrypt')
const IAppointment = require('../interfaces/IAppointment')
const firestore = admin.firestore()
const Patient = require('../models/Patient')

class Appointment extends IAppointment {
    constructor(patientId, dateTimeStart, dateTimeEnd, notes, userId) {
        super()
        this.patientId = patientId
        this.dateTimeStart = dateTimeStart
        this.dateTimeEnd = dateTimeEnd
        this.notes = notes
        this.userId = userId
        //agrega si la cita ya se completo o no
    }

    static async bookingAppointment (patientId, dateTimeStart, dateTimeEnd, notes, userId) {
        try {
            const appointment = firestore.collection('appointments').doc()
            await appointment.set({
                patientId,
                dateTimeStart,
                dateTimeEnd,
                notes,
                userId
            })
            return new Appointment(patientId, dateTimeStart, dateTimeEnd, notes, userId)
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error creating user')
        }
    }

    static async getAllAppointmentsByUser (userId) {
        try {
            const appointments = await firestore.collection('appointments')
                .where('userId', "==", userId)
                .get()
            return {
                appointments: appointments.docs
            }
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error getting appointments')
        }
    }

    static async getAllAppointmentsByUserAndDate (userId, startOfDate, endOfDate) {
        try {
            // console.log('@@@ => ', userId, startOfDate, endOfDate)
            const appointments = await firestore.collection('appointments')
                .where('userId', "==", userId)
                .where('dateTimeStart', ">=", startOfDate)
                .where('dateTimeStart', "<=", endOfDate)
                .get()
            // const time = appointments.docs[0].data().dateTimeStart
            // console.log('@@@', new Date(time._seconds*1000))
            const docs = []
            appointments.docs.forEach((doc) => {
                docs.push({
                    ...doc.data()
                })
            })
            return {
                docs
            }
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error getting appointments')
        }
    }

    static async findAppointmentConflictByUser (userId, dateTimeStart) {
        try {
            const appointments = await firestore.collection('appointments')
                .where('dateTime', "==", dateTimeStart)
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

    static async findAppointmentConflictByPatient (patientId, dateTimeStart) {
        try {
            const appointments = await firestore.collection('appointments')
                .where('dateTime', "==", dateTimeStart)
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

    static async getPatientDetails (appointments) {
        try {
            const newAppointment = []
            for (const doc of appointments.docs) {
                const patientDetails = (await Patient.getPatientById(doc.patientId)).data()
                newAppointment.push({
                    patient: patientDetails,
                    ...doc
                })
            }
            return newAppointment
        } catch (error) {
            throw new Error('Error getting details')
        }
    }
}

module.exports = Appointment
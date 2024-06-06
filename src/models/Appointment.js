const admin = require('../config/firebase')
const bcrypt = require('bcrypt')
const IAppointment = require('../interfaces/IAppointment')
const firestore = admin.firestore()
const Patient = require('../models/Patient')
const User = require('../models/User')

class Appointment extends IAppointment {
    constructor(patientId, dateTimeStart, dateTimeEnd, notes, userId, state) {
        super()
        this.patientId = patientId
        this.dateTimeStart = dateTimeStart
        this.dateTimeEnd = dateTimeEnd
        this.notes = notes
        this.userId = userId
        this.state = state
        this.comments = ''
        this.treatment = ''
        this.prescription = ''
        this.payment = 0
    }

    static async bookingAppointment (patientId, dateTimeStart, dateTimeEnd, notes, userId, state) {
        try {
            const appointment = firestore.collection('appointments').doc()
            await appointment.set({
                patientId,
                dateTimeStart,
                dateTimeEnd,
                notes,
                userId,
                state
            })
            return new Appointment(patientId, dateTimeStart, dateTimeEnd, notes, userId, state)
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
                    apptId: doc.id,
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

    static async findAppointmentConflictByUser (userId, dateTimeStart, dateTimeEnd) {
        try {
            const conflictStart = await firestore.collection('appointments')
                .where('dateTimeStart', ">=", dateTimeStart)
                .where('dateTimeStart', "<=", dateTimeEnd)
                .where('userId', "==", userId)
                .get()
            if (conflictStart.docs.length > 0) {
                return {conflict: true}
            }
            const conflictEnd = await firestore.collection('appointments')
                .where('dateTimeEnd', ">=", dateTimeStart)
                .where('dateTimeEnd', "<=", dateTimeEnd)
                .where('userId', "==", userId)
                .get()
            if (conflictEnd.docs.length > 0) {
                return {conflict: true}
            }
            const conflictStartEnd = await firestore.collection('appointments')
                .where('userId', "==", userId)
                .where('dateTimeStart', "<=", dateTimeStart)
                .where('dateTimeEnd', ">=", dateTimeEnd)
                .get()
            if (conflictStartEnd.docs.length > 0) {
                return {conflict: true}
            }
            return {
                conflict: false
            }
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error finding conflicts by User')
        }
    }

    static async findAppointmentConflictByPatient (patientId, dateTimeStart, dateTimeEnd) {
        try {
            const conflictStart = await firestore.collection('appointments')
                .where('dateTimeStart', ">=", dateTimeStart)
                .where('dateTimeStart', "<=", dateTimeEnd)
                .where('patientId', "==", patientId)
                .get()
            if (conflictStart.docs.length > 0) {
                console.log('@')
                return {conflict: true}
            }

            const conflictEnd = await firestore.collection('appointments')
                .where('dateTimeEnd', ">=", dateTimeStart)
                .where('dateTimeEnd', "<=", dateTimeEnd)
                .where('patientId', "==", patientId)
                .get()
            if (conflictEnd.docs.length > 0) {
                console.log('@@')
                return {conflict: true}
            }
            const conflictStartEnd = await firestore.collection('appointments')
                .where('dateTimeStart', "<=", dateTimeStart)
                .where('dateTimeEnd', ">=", dateTimeStart)
                .where('patientId', "==", patientId)
                .get()
            if (conflictStartEnd.docs.length > 0) {
                console.log('@@@')
                return {conflict: true}
            }
            return {
                conflict: false
            }
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error finding conflicts by User')
        }
    }

    static async getPatientDetails (appointments) {
        try {
            const newAppointment = []
            // console.log(appointments)
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

    static async getNextAppointment (userId, time) {
        try {
            const appointments = await firestore.collection('appointments')
                .where('userId', '==', userId)
                .where('dateTimeStart', '>=', time)
                .where('state', "==", 'Booking')
                .get()
            if (appointments.docs.length > 0){
                const docsDetails = await this.getPatientDetails({docs: [appointments.docs[0].data()]})
                docsDetails[0].apptId = appointments.docs[0].id
                // const doc = docsDetails
                return docsDetails[0]
            }
            return {err: 'empty'}

        } catch (error) {
            console.log(error)
            throw new Error('Error finding next appointment')
        }
    }

    static async cancelAppt (id) {
        try {
            const data = {
                state: 'Canceled'
            }
            await firestore.collection('appointments').doc(id).update(data)
            return {
                status: 0
            }
        } catch (error) {
            console.log(error)
            throw new Error('Error cancel appt')
        }
    }

    static async updateAppt (id, data) {
        try {
            await firestore.collection('appointments').doc(id).update(data)
            return { a: 0 }
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    static async getAllAppointmentsByPatient (id) {
        try {
            // console.log(id)
            const appointments = await firestore.collection('appointments')
                .where('patientId', "==", id)
                .where('state', '==', 'Complete')
                .get()
            // console.log(appointments.docs.length)
            const newAppointments = []
            // console.log(appointments)
            for (const doc of appointments.docs) {
                // console.log('@@@ => ',doc.data().userId)
                const details = (await User.findById(doc.data().userId)).user
                newAppointments.push({
                    user: details,
                    ...doc.data(),
                    apptId: doc.id
                })
            }
            
            return {
                appointments: newAppointments
            }
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error getting appointments')
        }
    }

    static async getAppointmentById (id) {
        try {
            const appointment = await firestore.collection('appointments').doc(id).get()
            const appt = {
                user: (await User.findById(appointment.data().userId)).user,
                patient: (await Patient.getPatientById(appointment.data().patientId)).data(),
                apptId: appointment.id,
                ...appointment.data()
            }
            
            return {
                appointment: appt
            }
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error getting appointments')
        }
    }
}

module.exports = Appointment
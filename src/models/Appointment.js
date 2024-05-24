const admin = require('../config/firebase')
const bcrypt = require('bcrypt')
const IAppointment = require('../interfaces/IAppointment')
const firestore = admin.firestore()

class Appointment extends IAppointment {
    constructor(Patient, date, time, notes) {
        super()
        this.Patient = Patient
        this.date = date
        this.time = time
        this.notes = notes
    }
}

module.exports = Appointment
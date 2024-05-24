const admin = require('../config/firebase')
const bcrypt = require('bcrypt')
const IPatient = require('../interfaces/IPatient')
const firestore = admin.firestore()

class Patient extends IPatient {
    constructor(nombre, apaterno, amaterno, edad, sexo, email, telefono, direccion, userId) {
        super()
        this.nombre = nombre
        this.apaterno = apaterno
        this.amaterno = amaterno
        this.edad = edad
        this.sexo = sexo
        this.email = email
        this.telefono = telefono
        this.direccion = direccion
        this.userId = userId
    }

    static async createPatient(nombre, apaterno, amaterno, edad, sexo, email, telefono, direccion, userId) {
        try {
            const patient = firestore.collection('patients').doc()
            await patient.set({
                nombre,
                apaterno,
                amaterno,
                edad,
                sexo,
                email,
                telefono,
                direccion,
                userId
            })
        }
        catch (error) {
            console.log('Error => ', error)
            throw new Error('Error creating patient')
        }
    }

    static async findPatientByEmail(email, userId) {
        try {
            console.log('@@ test => ', email, ' => ', userId)
            const patient = await firestore.collection('patients')
                .where('email', '==', email)
                .where('userId', '==', userId)
                .get()
                
            if (patient.docs.length > 0) {
                const patientData = patient.docs[0].data()
                // console.log(user.docs[0].id)
                return {
                    user: new Patient(patientData.email, patientData.password, patientData.nombre),
                    userId:  patient.docs[0].id
                    }
            }
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error finding user')
        }
    }
}

module.exports = Patient
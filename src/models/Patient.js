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

    static async createPatient(nombre, apaterno, amaterno, edad, sexo, email, telefono, direccion) {
        try {
            const patient = firestore.collection('patient').doc()
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
}

module.exports = Patient
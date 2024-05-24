class IPatient {
    /*
        ~~~ Interface pacientes
    */
   static async createPatient (nombre, apaterno, amaterno, edad, sexo, email, telefono, direccion, userId) { }
   static async findPatientByEmail (email, userId) { }

}

module.exports = IPatient
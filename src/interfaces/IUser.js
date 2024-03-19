class IUser {
    /*
        Crear un nuevo usuario
        @param {string} email -> correo del usuario
        @param {strign} password -> password 
        @returns {promise<User>}
        @throws {error} si hay un error en la creacion
    */
    static async createUser(email, password) { }
    static async findByEmail(email) { }
    async verifyPassword(password) { }
}

module.exports = IUser
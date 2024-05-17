const admin = require('../config/firebase')
const bcrypt = require('bcrypt')
const IUser = require('../interfaces/IUser')
const firestore = admin.firestore()

class User extends IUser {
    constructor(email, password, nombre, apaterno, amaterno, direccion, telefono) {
        super()
        this.email = email
        this.password = password
        this.nombre = nombre
        this.apaterno = apaterno
        this.amaterno = amaterno
        this.direccion = direccion
        this.telefono = telefono
    }

    static async createUser(email, password, nombre, apaterno, amaterno, direccion, telefono) {
        try {
            const hash = await bcrypt.hash(password, 10)
            const user = firestore.collection('users').doc()
            await user.set({
                email,
                password: hash,
                nombre,
                apaterno,
                amaterno,
                direccion,
                telefono
            })
            return new User(email, password, nombre, apaterno, amaterno, direccion, telefono)
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error creating user')
        }
    }

    async verifyPassword(password) {
        return await bcrypt.compare(password, this.password)
    }

    static async findByEmail(email) {
        try {
            const user = await firestore.collection('users').where('email', '==', email).get()
            
            if (!user.empty) {
                const userData = user.docs[0].data()
                return new User(userData.email, userData.password, userData.nombre)
            }
        } catch (error) {
            console.log('Error => ', error)
            throw new Error('Error finding user')
        }
    }

    static async getAllUsers() {
        try {
            const users = await firestore.collection('users').get()
            const foundUsers = []
            users.forEach(doc => {
                foundUsers.push({
                    email: doc.email,
                    ...doc.data()
                })
            })
            return foundUsers
        } catch (error) {
            throw error
        }
    }

    static async deleteUser(UserEmail) {
        try {
            await firestore.collection('users').doc(UserEmail).delete()
        } catch (error) {
            throw error
        }
    }

    static async updateUser(userEmail, userData) {
        try {
            const hash = await bcrypt.hash(userData.password, 10)
            const data = {
                email: userData.email,
                password: hash,
                nombre: userData.nombre,
                apaterno: userData.apaterno,
                amaterno: userData.amaterno,
                direccion: userData.direccion,
                telefono: userData.telefono
            }
            await firestore.collection('users').doc(userEmail).update(data)
            const userUpdate = await firestore.collection('users').doc(userEmail).get()
            return {
                userUpdate: userUpdate.data()
            }
        } catch (error) {
            throw error
        }
    }
}

module.exports = User
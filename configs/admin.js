'use strict'

import User from '../src/models/user.model.js'
import { encrypt } from '../utils/encrypt.js'

export const firstAdmin = async () => {
    try {
        let verify = await User.find()
        if (verify.length == 0) {
            const pass = await encrypt(process.env.PASS_ADMIN)
            let admin = new User({
                name: 'Josúe',
                surname: 'Noj',
                user: 'jnoj',
                password: pass,
                role: 'TEACHER_ROLE'
            })
            await admin.save()
            console.log('First administrator created')
        }
    } catch (err) {
        console.error(err)
        console.log('Error creating administrator')
    }
}
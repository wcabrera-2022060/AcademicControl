'use strict'

import { Schema, model } from 'mongoose'

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    user: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        minLength: 8,
        required: true
    },
    role: {
        type: String,
        enum: ['TEACHER_ROLE', 'STUDENT_ROLE'],
        default: 'STUDENT_ROLE',
        required: true
    }
})

export default model('user', userSchema)
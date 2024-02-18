import { Schema, model } from 'mongoose'

const courseSchema = Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        unique: true,
        required: true
    },
    teacher: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },
    students: [{
        type: Schema.ObjectId,
        ref: 'user'
    }],
})

export default model('course', courseSchema)
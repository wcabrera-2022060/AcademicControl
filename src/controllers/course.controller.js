'use strict'

import { checkDates } from '../../utils/validations.js'
import Course from '../models/course.model.js'

export const registerCourse = async (req, res) => {
    try {
        let data = req.body
        let course = new Course(data)
        await course.save()
        return res.send({ message: 'Successful registration' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering course', err })
    }
}

export const getAllCourses = async (req, res) => {
    try {
        const query = [{ path: 'teacher', select: 'name surname' },
        { path: 'students', select: 'name surname' }]
        let courses = await Course.find().populate(query)
        return res.send({ courses })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting courses', err })
    }
}

export const findCourse = async (req, res) => {
    try {
        let { name } = req.body
        let course = await Course.findOne({ name: name }).populate('teacher', ['name', 'surname'])
        if (course == null) return res.status(404).send({ message: 'Course not found' })
        return res.send({ message: 'Course found', course })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting the course', err })
    }
}

export const updateCourse = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let dates = checkDates(data, false)
        if(!dates) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updateCourse = await Course.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if(!updateCourse) return res.status(404).send({message: 'Course not found, not updated'})
        return res.send({message: 'Course updated successfully', updateCourse})
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating course' })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        let { id } = req.params
        let deleteCourse = await Course.findOneAndDelete({ _id: id })
        if (!deleteCourse) return res.status(404).send({ message: 'Course not found, not deleted' })
        return res.send({ message: `Course ${deleteCourse.name} delete successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting course' })
    }
}
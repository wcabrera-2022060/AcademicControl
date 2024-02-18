'use strict'

import User from '../models/user.model.js'
import { checkPassword, encrypt } from '../../utils/encrypt.js'
import { checkDates } from '../../utils/validations.js'
import { generateJwt } from '../../utils/jwt.js'
import Course from '../models/course.model.js'

/* export const test = (req, res)=>{
    return res.send('Hello World')
} */

export const registerUser = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        data.role = 'STUDENT_ROLE'
        let user = new User(data)
        await user.save()
        return res.send({ message: 'Successful registration' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error registering user', err })
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        return res.send({ users })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting users' })
    }
}

export const findUser = async (req, res) => {
    try {
        let { username } = req.body
        let user = await User.findOne({ user: username })
        if (user == null) return res.status(404).send({ message: 'User not found' })
        return res.send({ message: 'User found', user })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting the user' })
    }
}

export const updateUser = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let dates = checkDates(data, id)
        if (!dates) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updateUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateUser) return res.status(404).send({ message: 'User not found, not updated' })
        return res.send({ message: 'User updated successfully', updateUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating user' })
    }
}

export const deleteUser = async (req, res) => {
    try {
        let { id } = req.params
        let deleteUser = await User.findOneAndDelete({ _id: id })
        if (!deleteUser) return res.status(404).send({ message: 'User not found, not deleted' })
        return res.send({ message: `User ${deleteUser.user} delete successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting user' })
    }
}

export const login = async (req, res) => {
    try {
        let { user, password } = req.body
        let dataUser = await User.findOne({ user })
        if (dataUser && await checkPassword(password, dataUser.password)) {
            let userInfo = {
                uid: dataUser._id,
                name: dataUser.name,
                surname: dataUser.surname,
                user: dataUser.user,
                role: dataUser.role
            }
            let token = await generateJwt(userInfo)

            return res.send({
                message: `Welcome ${dataUser.name}`,
                userInfo,
                token
            })
        }
        return res.status(404).send({ message: 'Invalid credentials' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Failed login' })
    }
}


export const courseAssignment = async (req, res) => {
    try {
        const query = [{ path: 'teacher', select: 'name surname' },
        { path: 'students', select: 'name surname' }]
        let { name } = req.body
        let { _id } = req.user
        let numberCourses = await Course.countDocuments({ students: _id })
        if (numberCourses >= 3) {
            return res.status(400).send({ message: 'You are already enrolled in 3 courses' })
        }
        let course = await Course.findOne({ name: name, students: _id })
        if (!course) {
            course = await Course.findOneAndUpdate({ name: name },
                { $push: { students: _id } },
                { new: true }).populate(query)
            if (course == null) return res.status(404).send({ message: 'Course not found' })
            return res.send({ message: 'Course updated successfully', course })
        } else {
            return res.status(400).send({ message: 'Student already in the course' })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Join error' })
    }
}

export const enrolledCourse = async (req, res) => {
    try {
        const query = [{ path: 'teacher', select: 'name surname' },
        { path: 'students', select: 'name surname' }]
        let { _id } = req.user
        const courses = await Course.find({ students: _id }).populate(query)
        return res.send({ message: 'These are the courses you are in', courses })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error getting your courses' })
    }
}

export const updatePersonalUser = async (req, res) => {
    try {
        let { _id } = req.user
        let { id } = req.params
        let data = req.body
        if (_id != id) {
            return res.status(403).send({ message: 'You do not have permission to edit this user' })
        }
        let dates = checkDates(data, id)
        if (!dates) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let updateUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )
        if (!updateUser) return res.status(404).send({ message: 'Your user not found, not updated' })
        return res.send({ message: 'User updated successfully', updateUser })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating your user' })
    }
}

export const deletePersonalUser = async (req, res) => {
    try {
        let { _id } = req.user
        let { id } = req.params

        if (_id != id) {
            return res.status(403).send({ message: 'You do not have permission to delete this user' })
        }
        let deleteUser = await User.findOneAndDelete({ _id: id })
        if (!deleteUser) return res.status(404).send({ message: 'Your user not found, not deleted' })
        return res.send({ message: `Your user ${deleteUser.user} delete successfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting your user' })
    }
}


export const userToAdmin = async (req, res) => {
    try {
        let { id } = req.params
        let newAdmin = await User.findOneAndUpdate({ _id: id }, { role: 'TEACHER_ROLE' }, { new: true })
        if (!newAdmin) return res.status(404).send({ message: 'User not found, dont change roles' })
        return res.send({ message: 'This user is now admin', newAdmin })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error changing roles' })
    }
}

export const teacherViewHisCourses = async(req, res)=>{
    try{
        let {_id} = req.user
        const courses = await Course.find({teacher: _id})
        return res.send({courses})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error when viewing your courses'})
    }
}

export const teacherUpdateHisCourse = async(req, res) =>{
    try {
        let { _id } = req.user
        let { id } = req.params
        let { name } = req.body
        let data = req.body
        let dates = checkDates(data, false)
        if (!dates) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' })
        let course = await Course.findOne({ name: name })
        if (!course) return res.status(404).send({ message: 'Course not found' })
        if(id == _id && course.teacher == id){
            let updateCourse = await Course.findOneAndUpdate({name: name}, data, {new: true})
            if (!updateCourse) return res.status(404).send({ message: 'Error when updating course' })
            return res.send({ message: 'Course successfully updating', updateCourse })
        }else{
            return res.status(500).send({message: 'Course not updated 1'})
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Course not updated 2'})
    }
}

export const teacherDeleteHisCourse = async (req, res) => {
    try {
        let { _id } = req.user
        let { id } = req.params
        let { name } = req.body
        let course = await Course.findOne({ name: name })
        if (!course) return res.status(404).send({ message: 'Course not found' })
        if (id == _id && course.teacher == id) {
            let deleteCourse = await Course.findOneAndDelete({ name: name })
            if (!deleteCourse) return res.status(404).send({ message: 'Error when deleting course' })
            return res.send({ message: 'Course successfully deleted', deleteCourse })
        }else{
            return res.status(500).send({ message: 'Error deleting your course' })
        }
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting your course' })
    }
}
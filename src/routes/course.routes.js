'use strict'

import { Router } from 'express'

import { deleteCourse, findCourse, getAllCourses, registerCourse, updateCourse } from '../controllers/course.controller.js'

const api = Router()

api.post('/registerCourse', registerCourse)
api.get('/getAllCourses', getAllCourses)
api.post('/findCourse', findCourse)
api.put('/updateCourse/:id', updateCourse)
api.delete('/deleteCourse/:id', deleteCourse)

export default api
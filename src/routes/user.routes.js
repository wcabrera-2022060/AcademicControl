'use strict'

import { Router } from 'express'
import { courseAssignment, deletePersonalUser, deleteUser, enrolledCourse, findUser, getAllUsers, login, registerUser, teacherDeleteHisCourse, teacherUpdateHisCourse, teacherViewHisCourses, updatePersonalUser, updateUser, userToAdmin } from '../controllers/user.controller.js'
import { validateJwt, validateRoleStudent, validateRoleTeacher } from '../../middlewares/verifyRoles.js'

const api = Router()

api.post('/registerUser', registerUser)
api.get('/getAllUsers', getAllUsers)
api.post('/findUser', findUser)
api.put('/updateUser/:id', updateUser)
api.delete('/deleteUser/:id', deleteUser)
api.post('/login', login)

api.put('/courseAssignment', [validateJwt, validateRoleStudent], courseAssignment)
api.post('/enrolledCourse', [validateJwt, validateRoleStudent], enrolledCourse)
api.put('/updatePersonalUser/:id', validateJwt, updatePersonalUser)
api.delete('/deletePersonalUser/:id', validateJwt, deletePersonalUser)

api.put('/userToAdmin/:id', [validateJwt, validateRoleTeacher], userToAdmin)
api.post('/teacherViewHisCourses', [validateJwt, validateRoleTeacher],teacherViewHisCourses)
api.put('/teacherUpdateHisCourse/:id', [validateJwt, validateRoleTeacher],teacherUpdateHisCourse)
api.delete('/teacherDeleteHisCourse/:id', [validateJwt, validateRoleTeacher],teacherDeleteHisCourse)

//!api.get('/test', [validateJwt, validateRole], test)

export default api
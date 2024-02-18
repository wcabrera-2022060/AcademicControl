'use strict'

import jwt from 'jsonwebtoken'
import User from  '../src/models/user.model.js'

export const validateJwt = async(req, res, next) => {
    try{
        let {token} = req.headers
        if(!token) return res.status(401).send({message: 'Unauthorized'})
        let {uid} = jwt.verify(token, process.env.SECRET_KEY)
        let user = await User .findOne({_id:uid})
        if(!user) return res.status(404).send({message: 'User not found - Unauthorized'})
        req.user = user
        next()
    }catch(err){
        console.error(err)
        return res.status(401).send({message: 'Invalidad token or expired'})
    }
}

export const validateRoleStudent = async(req, res, next) =>{
    try {
        console.log('1')
        let {user, role} = req.user
        if(!role || role == 'TEACHER_ROLE') return res.status(403).send({message: `You dont have access, you are admin | username ${user}`})
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({message: 'Unauthorized role, you are ADMIN'})
    }
}

export const validateRoleTeacher = async(req, res, next) =>{
    try {
        let {user, role} = req.user
        if(!role || role == 'STUDENT_ROLE') return res.status(403).send({message: `You dont have access, you are student | username ${user}`})
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({message: 'Unauthorized role, you are STUDENT'})
    }
}
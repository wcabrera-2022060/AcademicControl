'use strict'

import { compare, hash } from 'bcrypt'

export const encrypt = async (pass) => {
    try {
        return await hash(pass, 5)
    } catch (err) {
        console.error(err)
        return err
    }
}

export const checkPassword = async(password, hash) =>{
    try{
        return await compare(password, hash)
    }catch(err){
        console.error(err)
        return err
    }
}
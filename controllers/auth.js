import { validationResult } from "express-validator"
import Customer from "../models/customer.js"
import bcrypt from 'bcryptjs'

export const registerCustomer = async (req, res) =>{
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(401).json({error: 'invalid inputs'})
    }
    const {fullName, email, phoneNumber, location, password} = req.body
    try {
         const hashedPassword = await bcrypt.hash(password, 10)
         const newCustomer = await Customer.create({fullName: fullName, email: email, phoneNumber: phoneNumber, location: location, password: hashedPassword})
         await newCustomer.save()   
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: 'internal server error'})
    }
}
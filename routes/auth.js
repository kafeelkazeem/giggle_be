import express from 'express'
import { registerCustomer } from '../controllers/auth.js'
import { body } from 'express-validator'

const router = express.Router()

const customerValidation = [
    body('fullName').trim().notEmpty(),
    body('email').trim().notEmpty().isEmail(),
    body('phoneNumber').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('password').trim().notEmpty().isLength({min:5}).isAlphanumeric()
]

router.post('/registerCustomer', customerValidation,  registerCustomer)

export default router
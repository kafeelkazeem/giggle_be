import express from 'express'
import { customerLogin, registerCustomer} from '../controllers/auth.js'
import { body } from 'express-validator'
import { checkValidation } from '../middlewares/checkValidation.js'

const router = express.Router()

const customerValidation = [
    body('fullName').trim().notEmpty(),
    body('email').trim().notEmpty().isEmail(),
    body('phoneNumber').trim().notEmpty(),
    //body('location').trim().notEmpty(),
    body('password').trim().notEmpty().isLength({min: 5}).isAlphanumeric()
]

const loginValidation  = [
    body('email').trim().notEmpty(),
    body('password').trim().notEmpty()
]

router.post('/registerCustomer', customerValidation, checkValidation,  registerCustomer)
router.post('/customerLogin', loginValidation, checkValidation, customerLogin)

export default router
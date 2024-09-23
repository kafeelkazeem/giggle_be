import express from 'express'
import { customerLogin, registerCustomer, registerTechnician, technicianLogin} from '../controllers/auth.js'
import { body } from 'express-validator'
import { checkValidation } from '../middlewares/checkValidation.js'

const router = express.Router()

const customerValidation = [
    body('fullName').trim().notEmpty(),
    body('email').trim().notEmpty().isEmail(),
    body('phoneNumber').trim().notEmpty(),
    body('password').trim().notEmpty().isLength({min: 5}).isAlphanumeric()
]

const technicianValidation = [
    body('businessName').trim().notEmpty(),
    body('category').notEmpty(),
    body('email').trim().notEmpty().isEmail(),
    body('phoneNumber').trim().notEmpty(),
    body('address').isString().trim().notEmpty(),
    body('state').isString().trim().notEmpty(),
    body('password').trim().notEmpty().isLength({min: 5}).isAlphanumeric()
]

const loginValidation  = [
    body('email').trim().notEmpty(),
    body('password').trim().notEmpty()
]

router.post('/registerCustomer', customerValidation, checkValidation,  registerCustomer)
router.post('/registerTechnician', technicianValidation, checkValidation, registerTechnician)
router.post('/customerLogin', loginValidation, checkValidation, customerLogin)
router.post('/technicianLogin', loginValidation, checkValidation, technicianLogin)

export default router
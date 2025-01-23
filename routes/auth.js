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
    // Validate fullName
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    // Validate businessName
    body('businessName').trim().notEmpty().withMessage('Business name is required'),
    // Validate email
    body('profession').notEmpty().isString(),
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    // Validate phoneNumber
    body('phoneNumber').trim().notEmpty().withMessage('Phone number is required'),
    // Validate WhatsAppNumber (optional)
    body('whatsappNumber').optional().trim(),
    // Validate address
    body('address').isString().trim().notEmpty().withMessage('Address is required'),
    // Validate state
    body('state').isString().trim().optional().withMessage('State is required'),
    // Validate password
    body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 5 })
      .withMessage('Password must be at least 8 characters long')
      .isAlphanumeric()
      .withMessage('Password must be alphanumeric'),
    // Validate availability (isAvailable)
    body('isAvailable').optional().isBoolean().withMessage('Availability must be a boolean'),
    // Validate startTime
    body('startTime').optional().isISO8601().withMessage('Start time must be a valid ISO8601 date'),
    // Validate endTime
    body('endTime')
      .optional()
      .isISO8601()
      .withMessage('End time must be a valid ISO8601 date')
      .custom((value, { req }) => {
        const { startTime } = req.body;
        if (startTime && new Date(value) <= new Date(startTime)) {
          throw new Error('End time must be after start time');
        }
        return true;
      }),
  ];

const loginValidation  = [
    body('email').trim().notEmpty(),
    body('password').trim().notEmpty()
]

router.post('/registerCustomer', customerValidation, checkValidation,  registerCustomer)
router.post('/registerTechnician', technicianValidation, checkValidation, registerTechnician)
router.post('/customerLogin', loginValidation, checkValidation, customerLogin)
router.post('/technicianLogin', loginValidation, checkValidation, technicianLogin)

export default router
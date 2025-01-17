import express from 'express'
import { updateTechnicianProfile } from '../controllers/technician.js'
import { body } from 'express-validator'
import { checkValidation } from '../middlewares/checkValidation.js'
import { authenticateJWT } from '../middlewares/authJWT.js'

const router = express.Router()

const updateProfileValidator = [
    body('businessName').trim().isString().notEmpty(),
    body('profession').isString().notEmpty(),
    body('address').isString().trim().notEmpty()
]


router.put('/updateTechnicianProfile', authenticateJWT, updateProfileValidator, checkValidation, updateTechnicianProfile)

export default router
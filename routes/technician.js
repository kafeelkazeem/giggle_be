import express from 'express'
import { getMyProfile, updateBio, updateTechnicianProfile, uploadProfilePicture } from '../controllers/technician.js'
import { body } from 'express-validator'
import { checkValidation } from '../middlewares/checkValidation.js'
import { authenticateJWT } from '../middlewares/authJWT.js'
import upload from '../middlewares/multer.js'

const router = express.Router()

const updateProfileValidator = [
    body('businessName').trim().isString().notEmpty(),
    body('profession').isString().notEmpty(),
    body('address').isString().trim().notEmpty()
]


router.put('/updateTechnicianProfile', authenticateJWT, updateProfileValidator, checkValidation, updateTechnicianProfile)
router.post('/uploadProfilePicture', authenticateJWT,  upload.single('profileImage'), uploadProfilePicture )
router.get('/getmyprofile', authenticateJWT, getMyProfile)
router.put('/updateBio', authenticateJWT, [body('bio').notEmpty().isString().trim()], checkValidation, updateBio)

export default router
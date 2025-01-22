import express from 'express'
import { deleteImage, getImages, getMyProfile, updateBio, updateContact, updateTechnicianProfile, uploadPastJobsPicture, uploadProfilePicture } from '../controllers/technician.js'
import { body } from 'express-validator'
import { checkValidation } from '../middlewares/checkValidation.js'
import { authenticateJWT } from '../middlewares/authJWT.js'
import upload from '../middlewares/multer.js'

const router = express.Router()

const updateProfileValidator = [
    body('businessName').trim().isString().notEmpty(),
    body('profession').isString().notEmpty(),
    body('address').isString().trim().notEmpty(),
    body('phoneNumber').trim().notEmpty(),
]

const updateContactValidator = [
    body('phoneNumber').isNumeric().notEmpty(),
    body('whatsappNumber').isNumeric().notEmpty()
]


router.put('/updateTechnicianProfile', authenticateJWT, updateProfileValidator, checkValidation, updateTechnicianProfile)
router.post('/uploadProfilePicture', authenticateJWT,  upload.single('profileImage'), uploadProfilePicture )
router.get('/getmyprofile', authenticateJWT, getMyProfile)
router.put('/updateBio', authenticateJWT, [body('bio').notEmpty().isString().trim()], checkValidation, updateBio)
router.post('/uploadPastJobsPictures', authenticateJWT, upload.single('images'), uploadPastJobsPicture)
router.get('/getImages', authenticateJWT, getImages)
router.delete('/deleteImage', authenticateJWT, [body('imageUrl').notEmpty().isURL()], checkValidation, deleteImage)
router.put('updateContact', authenticateJWT, updateContactValidator, checkValidation, updateContact )

export default router
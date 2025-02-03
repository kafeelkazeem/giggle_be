import express from 'express'
import { addSocials, changePassword, deleteImage, getImages, getMyProfile, getSocials, removeSocials, updateAvailability, updateBio, updateContact, updateTechnicianProfile, uploadPastJobsPicture, uploadProfilePicture } from '../controllers/technician.js'
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
    body('WhatsappNumber').trim().notEmpty()
]

const updateContactValidator = [
    body('phoneNumber').isNumeric().notEmpty(),
    body('whatsappNumber').isNumeric().notEmpty()
]

const changePasswordVal = [
    body('currentPassword').notEmpty().trim(),
    body('newPassword').trim().notEmpty().isLength({min: 5}).isAlphanumeric().withMessage('Must be alphanumeric and more than 5 characters')
]

const isAvailableVal = [
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
]


router.put('/updateTechnicianProfile', authenticateJWT, updateProfileValidator, checkValidation, updateTechnicianProfile)
router.post('/uploadProfilePicture', authenticateJWT,  upload.single('profileImage'), uploadProfilePicture )
router.get('/getmyprofile', authenticateJWT, getMyProfile)
router.put('/updateBio', authenticateJWT, [body('bio').notEmpty().isString().trim()], checkValidation, updateBio)

router.post('/uploadPastJobsPictures', authenticateJWT, upload.single('images'), uploadPastJobsPicture)
router.get('/getImages', authenticateJWT, getImages)
router.delete('/deleteImage', authenticateJWT, [body('imageUrl').notEmpty().isURL()], checkValidation, deleteImage)

router.put('/updateContact', authenticateJWT, updateContactValidator, checkValidation, updateContact )

router.get('/getSocials', authenticateJWT, getSocials)
router.post('/addSocial', authenticateJWT, [body('socialLink').notEmpty().isURL().trim()], checkValidation, addSocials)
router.delete('/removeSocial', authenticateJWT, [body('socialLink').notEmpty().isURL().trim()], checkValidation, removeSocials)

router.put('/changeTechnicianPassword', authenticateJWT, changePasswordVal, checkValidation, changePassword)

router.put('/updateAvalaibility', authenticateJWT, isAvailableVal, checkValidation, updateAvailability)

export default router
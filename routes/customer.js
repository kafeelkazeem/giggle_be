import express from 'express'
import { Search, changePassword, getSelectedProfession, getSingleTechnician, getTechniciansLocation, updateProfile, updateSearchRange } from '../controllers/customer.js'
import { body, query } from 'express-validator'
import { checkValidation } from '../middlewares/checkValidation.js'
import { deleteReview, getTechnicianReviews, leaveReview } from '../controllers/review.js'
import { authenticateJWT } from '../middlewares/authJWT.js'

const router = express.Router()

const selectedProfessionVal = [
    query('profession').trim().toLowerCase().notEmpty(),
    query('latitude').trim().isNumeric().notEmpty(),
    query('longitude').trim().isNumeric().notEmpty()
]

const leaveReviewVal = [
    body('customerId').notEmpty().isMongoId(),
    body('technicianId').notEmpty().isMongoId(),
    body('rating').notEmpty().isInt({min: 1, max: 5}),
    body('review').notEmpty().isString()
]

const deleteReviewVal = [
    query('customerId').notEmpty().isMongoId(),
    query('reviewId').notEmpty().isMongoId()
]

const updateProfileVal = [
    body('fullName').notEmpty().trim().isString(),
    body('phoneNumber').notEmpty().trim()
]

const changePasswordVal = [
    body('currentPassword').notEmpty().trim(),
    body('newPassword').trim().notEmpty().isLength({min: 5}).isAlphanumeric().withMessage('Must be alphanumeric and more than 5 characters')
]

router.get('/getSelectedProfession', authenticateJWT, selectedProfessionVal, checkValidation, getSelectedProfession)
router.get('/techniciansLocation', getTechniciansLocation)
router.get('/singleTechnician', [query('technicianId').notEmpty().isMongoId()], checkValidation, getSingleTechnician)
router.get('/search', authenticateJWT, [query('searchQuery').notEmpty().isString()], checkValidation, Search)

router.post('/leaveReview', authenticateJWT, leaveReviewVal, checkValidation, leaveReview)
router.get('/getReview', [query('technicianId').notEmpty().isMongoId()], checkValidation, getTechnicianReviews)
router.delete('/deleteReview', deleteReviewVal, checkValidation, deleteReview )

router.put('/updateProfile', authenticateJWT, updateProfileVal, checkValidation, updateProfile)
router.put('/changePassword', authenticateJWT, changePasswordVal, checkValidation, changePassword)
router.put('/updateSearchRange', authenticateJWT, [body('searchRange').notEmpty().isNumeric()], checkValidation, updateSearchRange)

export default router
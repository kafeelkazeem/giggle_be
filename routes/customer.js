import express from 'express'
import { Search, getSelectedCategory, getSingleTechnician, getTechniciansLocation } from '../controllers/customer.js'
import { body, query } from 'express-validator'
import { checkValidation } from '../middlewares/checkValidation.js'
import { deleteReview, getTechnicianReviews, leaveReview } from '../controllers/review.js'
import { authenticateJWT } from '../middlewares/authJWT.js'

const router = express.Router()

const selectedCategoryVal = [
    query('category').trim().toLowerCase().notEmpty(),
    query('latitude').trim().isNumeric().notEmpty(),
    query('longitude').trim().isNumeric().notEmpty()
]

const techniciansLocationVal = [
    query('selectedCategory').trim().toLowerCase().notEmpty()
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

router.get('/getSelectedCategory', selectedCategoryVal, checkValidation, getSelectedCategory)
router.get('/techniciansLocation', techniciansLocationVal, checkValidation, getTechniciansLocation)
router.get('/singleTechnician', [query('technicianId').notEmpty().isMongoId()], checkValidation, getSingleTechnician)
router.get('/search', authenticateJWT, [query('searchQuery').notEmpty().isString()], checkValidation, Search)

router.post('/leaveReview', authenticateJWT, leaveReviewVal, checkValidation, leaveReview)
router.get('/getReview', [query('technicianId').notEmpty().isMongoId()], checkValidation, getTechnicianReviews)
router.delete('/deleteReview', authenticateJWT, deleteReviewVal, checkValidation, deleteReview )


export default router
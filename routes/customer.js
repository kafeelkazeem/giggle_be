import express from 'express'
import { getSelectedCategory, getSingleTechnician, getTechniciansLocation } from '../controllers/customer.js'
import { body, query } from 'express-validator'
import { checkValidation } from '../middlewares/checkValidation.js'
import { getTechnicianReviews, leaveReview } from '../controllers/review.js'

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

router.get('/getSelectedCategory', selectedCategoryVal, checkValidation, getSelectedCategory)
router.get('/techniciansLocation', techniciansLocationVal, checkValidation, getTechniciansLocation)
router.get('/singleTechnician', getSingleTechnician)

router.post('/leaveReview', leaveReviewVal, checkValidation, leaveReview)
router.get('getReview', [query('technicianId').notEmpty().isMongoId()], checkValidation, getTechnicianReviews)


export default router
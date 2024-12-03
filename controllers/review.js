import Review from '../models/review.js'
import Technician from "../models/technician.js"

export const leaveReview = async (req, res) =>{
    const {customerId, technicianId, rating, review} = req.body
    try {
        const newReview = await Review.create({customer: customerId, technician: technicianId, rating: rating, review: review})
        await newReview.save()
        
        //calculate technician's average ratings
        const reviews = await Review.find({technician: technicianId})
        const totalReviews = reviews.length;
        const avgRatings = reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews;

        await Technician.findByIdAndUpdate(technicianId, { avgRatings, reviewCount: totalReviews});

        return res.status(200).json({success: 'Review added'})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

export const getTechnicianReviews = async (req, res) =>{
    const {technicianId} = req.query
    try {
        const Reviews = await Review.find({technician: technicianId}).populate('customer', 'fullName');
        return res.status(200).json({reviews: Reviews})           
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}
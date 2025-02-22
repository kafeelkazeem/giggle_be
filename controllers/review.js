import Review from '../models/review.js'
import Technician from "../models/technician.js"

//middleware for creating customer review
export const leaveReview = async (req, res) =>{
    const {customerId, technicianId, rating, review} = req.body
    try {
        const newReview = await Review.create({customer: customerId, technician: technicianId, rating: rating, review: review})
        await newReview.save()
        
        //calculate technician's average ratings
        const reviews = await Review.find({technician: technicianId})
        const totalReviews = reviews.length;
        const avgRatings = reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews;

        await Technician.findByIdAndUpdate(technicianId, { 'rating.avgRatings': avgRatings, 'rating.reviewCount': totalReviews});

        return res.status(200).json({success: 'Review added'})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

//middleware for fetching a technician's review
export const getTechnicianReviews = async (req, res) =>{
    const {technicianId} = req.query
    try {
        const Reviews = (await Review.find({technician: technicianId}).populate('customer', 'fullName')).reverse();
        return res.status(200).json({reviews: Reviews})           
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

//middleware to delete review
export const deleteReview = async (req, res) => {
    const { customerId, reviewId } = req.query;
    
    try {
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }

        if (customerId !== review.customer.toString()) {
            return res.status(403).json({ error: "Not authorised" });
        }

        await Review.findByIdAndDelete(reviewId);

        // Recalculate technician's average ratings
        const technicianId = review.technician;
        const reviews = await Review.find({ technician: technicianId });

        const totalReviews = reviews.length;
        const avgRatings = totalReviews > 0 
            ? reviews.reduce((sum, rev) => sum + rev.rating, 0) / totalReviews 
            : 0; // Set avgRatings to 0 if no reviews exist

        await Technician.findByIdAndUpdate(technicianId, {
            'rating.avgRatings': avgRatings,
            'rating.reviewCount': totalReviews
        });

        res.status(200).json({ success: "Deleted" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};

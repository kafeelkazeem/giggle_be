import Review from '../models/review.js'

export const leaveReview = async (req, res) =>{
    const {customerId, technicianId, rating, review} = req.body
    try {
        const newReview = await Review.create({customerId: customerId, technicianId: technicianId, rating: rating, review: review})
        await newReview.save()
        return res.status(200).json({success: 'Review added'})
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}

export const getTechnicianReviews = async (req, res) =>{
    const {technicianId} = req.query
    try {
        const Reviews = await Review.find({technicianId: technicianId})
        return res.status(200).json({reviews: Reviews})           
    } catch (error) {
        console.log(error)
        res.status(500).json({error: 'internal server error'})
    }
}
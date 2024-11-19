import mongoose from "mongoose"

const Schema = mongoose.Schema

// Review model
const ReviewSchema = new Schema({
    technicianId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Technician',
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1, // Minimum rating value
        max: 5, // Maximum rating value
    },
    review: {
        type: String,
        required: true,
        trim: true,
    },
}, {timestamps: true})


export default mongoose.model('Review', ReviewSchema)
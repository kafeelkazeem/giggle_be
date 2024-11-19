import mongoose from "mongoose"

const Schema = mongoose.Schema

// Technician's model
const TechnicianSchema = new Schema({
    businessName : {
        type: String,
        required: true,
    },
    category : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true
    },
    phoneNumber : {
        type: String,
        required: true
    },
    description : {
        type: String
    },
    address : {
        type: String,
        required: true,
    },
    state : {
        type: String,
        required: true,
        default: 'kano state'
    },
    avgRatings : {
        type: Number,
        default: 1
    },
    ratingCount : {
        type: Number
    },
    latitude : {
        type: Number,
        required: true
    },
    longitude : {
        type: Number,
        required: true
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps: true})


export default mongoose.model('Technician', TechnicianSchema)
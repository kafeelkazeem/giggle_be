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
    address : {
        type: String,
        required: true,
        default: 'sabon gari kano'
    },
    state : {
        type: String,
        required: true,
        default: 'kano state'
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps: true})


export default mongoose.model('Technician', TechnicianSchema)
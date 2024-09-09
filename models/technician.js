import mongoose from "mongoose"

const Schema = mongoose.Schema

const CustomerSchema = new Schema({
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
        type: Number,
        required: true
    },
    state : {
        type: String,
        required: true,
        default: 'sabon gari kano'
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps: true})


export default mongoose.model('Customer', CustomerSchema)
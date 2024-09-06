import mongoose from "mongoose"

const Schema = mongoose.Schema

const CustomerSchema = new Schema({
    fullName : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true
    },
    phoneNumber : {
        type: Number,
        required: true
    },
    location : {
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
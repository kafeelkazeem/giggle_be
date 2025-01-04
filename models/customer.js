import mongoose from "mongoose"

const Schema = mongoose.Schema

//customer's model
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
    searchRange : {
        type: Number,
        default: 10,
    },
    password : {
        type : String,
        required : true
    }
}, {timestamps: true})

export default mongoose.model('Customer', CustomerSchema)
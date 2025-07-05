import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name: {type:String},
    srn: {type:String, required:true},
    sem: {type:String},
    branch: {type:String},
    phone: {type:String}, 
    email: {type:String, required:true, unique:true}, 
    password: {type:String, required:true}, 
    booksBorrowed: {type:Object, default:{}},
    image: {type:String}
},{minimize:false})

const UserModel = mongoose.model("User", userSchema) || mongoose.models.User;

export default UserModel;
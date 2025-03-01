const mongoose=require('mongoose')
const UserSchema=new mongoose.Schema({
    fullname:{type:String,require:true},
    email:{type:String,require:true},
    password:{type:String,require:true},
    confirmpassword:{type:String,require:true}
})
module.exports=mongoose.model("User",UserSchema)
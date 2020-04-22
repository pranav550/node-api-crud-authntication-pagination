const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true, 'Name must be add to this User']
},
email:{
     type:String,
     required:[true, 'Email must be add to this User'],
     unique:true,
     match:[ 
         /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please Add A Valid Email'
         ],
       
},
password:{
    type:String,
    required:[true, 'Password must be add to this User'],
    minlength:6,
    select: false
},
role: {
    type:String,
    enum:['user','publisher'],
    default: 'user'
},
resetPasswordToken: String,

resetPasswordExpire: Date,

createdAt:{
    type:Date,
    default:Date.now
}

})
 
//encrypt password using bycrypt

UserSchema.pre('save', async function(next){
  const salt = await bycrypt.genSalt(10)
  this.password = await bycrypt.hash(this.password, salt);
})

// sign jwt and return
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

// Match User Entered Password to hashed pasword in database
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bycrypt.compare(enteredPassword, this.password)
}

module.exports = mongoose.model("User", UserSchema)
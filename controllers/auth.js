const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

exports.register = asyncHandler(async(req, res, next)=>{
    const user = await User.create(req.body)
    const token = user.getSignedJwtToken()
    res.status(200).json({success:true, data:user, token})
})


exports.login = asyncHandler(async(req, res, next)=>{
    const {email, password} = req.body

    // validate email and password
    if(!email || !password){
        return next(new ErrorResponse('Plese provide email and password',400))
    }

    //check for user
    const user = await User.findOne({email}).select('+password')

     if(!user){
         return next(new ErrorResponse('Invalid Credentials', 401));
     }

     // check if password matches
     const isMatch = await user.matchPassword

     if(!isMatch){
        return next(new ErrorResponse('Invalid Credentials', 401));
     }

    const token = user.getSignedJwtToken(password)
    res.status(200).json({success:true, token})
})


// cookie

const sendTokenResponse = (user, statusCode, res) =>{
    const token = user.getSignedJwtToken()

    const options = {
        expires:new Date(Date.now+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV='production'){
        options.secure = true
    }
    res.status(statusCode).cookie('token',token,options)
    .json({success:true, token})
}

// get current login user

exports.getMe= asyncHandler(async(req, res, next)=>{
        const user = await User.findById(req.user.id);
        res.status(200).json({
            status:true,
            data:user
        })
})

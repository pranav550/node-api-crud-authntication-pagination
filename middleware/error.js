const ErrorResponse = require('../utils/errorResponse');

const errorHandler= async (err, req, res, next) =>{
    let error = {...err}
    error.message = err.message;

    // log for console
    console.error(err)
    
    // Mongoose bad ObjectID
    if(err.name==='CastError'){
       const message = `bootcamp not found with id of ${err.value}`
       error = new ErrorResponse(message, 404)
    } 

    // mongoose duplicate error
    if(err.code ===11000){
        const message = 'Duplicate field value entered'
        error = new ErrorResponse(message,400)
    }

    //Mongoose Validation Error
    if(err.name==='ValidationError'){
        const message = Object.values(err.errors).map(val=>val.message);
        error = new ErrorResponse(message,400 )
    }
    res.status(error.statusCode || 500).json({
        success:true,
        error:error.message || 'Server Error'
    })
}

module.exports = errorHandler
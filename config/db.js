const mongoose = require("mongoose");

const connectDB = async (req, res, next)=>{

    const conn = await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true,
        useFindAndModify:false
    })

    console.log(`mongoose connected ${conn.connection.host}`.cyan.underline.bold)

}

module.exports = connectDB
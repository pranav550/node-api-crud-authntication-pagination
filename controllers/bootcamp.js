const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.find();
    res.status(200).json({ success: true, count:bootcamp.length, data: bootcamp })
})

exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body)
    res.status(201).json({ success: true, data: bootcamp })
})

exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp Not Found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: bootcamp })
})

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp Not Found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: bootcamp })
})

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp Not Found with id of ${req.params.id}`, 404))
    }
    res.status(200).json({ success: true, data: {} })
})

exports.getBootcampsFilter = asyncHandler(async (req, res, next) => {
    let query;
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}`);
    query = Bootcamp.find(JSON.parse(queryStr))
    const bootcamp = await query
    res.status(200).json({ success: true, count:bootcamp.length, data: bootcamp })
})

exports.getBootcampsSelect = asyncHandler(async (req, res, next) => {
    let query
    const reqQuery = {...req.query}
    const removeFields = ['select']
    removeFields.forEach(param =>delete reqQuery[param])
    // console.log(reqQuery)
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        //  console.log(fields)
        query= Bootcamp.find(query);
        query = query.select(fields)
    }
    const bootcamp = await query
    res.status(200).json({ success: true, count:bootcamp.length, data: bootcamp })
})

exports.getBootcampsSort = asyncHandler(async (req, res, next) => {
    let query
    query= Bootcamp.find(query);
    if(req.query.sort){
       const sortBy = req.query.sort.split(',').join(' ')
       query= query.sort(sortBy)
      
    }else{
        query =query.sort('-createdAt');
       
    }
   // query= Bootcamp.find(query);
    const bootcamp = await query
    res.status(200).json({ success: true, count:bootcamp.length, data: bootcamp })
})

exports.getBootcampsPagination = asyncHandler(async (req, res, next) => {
    let query
    query= Bootcamp.find(query);
    const page = parseInt(req.query.page,10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await Bootcamp.countDocuments();

    query = query.skip(startIndex).limit(limit);
    const bootcamp = await query
    
    const pagination ={}
    if(endIndex<total){
        pagination.next = {
            page:page+1,
            limit 
        }
    }

    if(startIndex>0){
        pagination.prev = {
            page:page-1,
            limit
        }
    }

    res.status(200).json({ success: true, count:bootcamp.length, pagination, data: bootcamp })
})


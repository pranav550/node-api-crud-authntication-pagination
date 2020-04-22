const express = require("express");
const router = express.Router();
const {getBootcamps,
      getBootcamp,
      createBootcamp,
      updateBootcamp,
      deleteBootcamp,
      getBootcampsFilter,
      getBootcampsSelect,
      getBootcampsSort,
      getBootcampsPagination
} 
= require('../controllers/bootcamp');

const {protect} = require('../middleware/auth')

router.route('/')
      .get(getBootcamps)
      .post(protect, createBootcamp)


      router.route('/filter')
      .get(getBootcampsFilter)

      router.route('/select')
      .get(getBootcampsSelect)

      router.route('/sort')
      .get(getBootcampsSort)

      router.route('/pagination')
      .get(getBootcampsPagination)
         
     

router.route('/:id')
      .get(getBootcamp)
      .put(protect,updateBootcamp)
      .delete(protect,deleteBootcamp)
        

module.exports = router
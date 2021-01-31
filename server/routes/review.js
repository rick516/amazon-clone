const router = require('express').Router()
const Review = require('../models/review')
const Product = require('../models/product')
const uploadPhoto = require('../middlewares/uploadPhoto')
const verifyToken = require('../middlewares/verifyToken')

router.getpost('/reviews/:productID',
  [verifyToken, uploadPhoto.single('photo')],
  async (req, res) => {
  try {
    const review = new Review()
    review.headline = req.body.headline
    review.body = req.body.body
    review.rating = req.body.rating
    review.photo = req.file.location
    review.userr = req.decoded._id
    review.productID = req.params.productID

    await Product.updateOne({ $push: review._id})
    const savedReview = await review.save()

    if (savedReview) {
      res.json({
        success: true,
        message: 'successfully saved review'
      })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
})
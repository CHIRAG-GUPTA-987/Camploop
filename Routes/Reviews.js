const express=require('express');
const catchAsync = require('../utils/catchAsync')
const {validateReview, isLoggedIn, isReviewAuthor, isReview} = require('../middleware')
const Reviews = require('../Controllers/Reviews')
const router=express.Router({mergeParams: true});

//FAKE GET ROUTE AND CREATING NEW REVIEW

router.route('/')
    .get(Reviews.fakeReviewtoCampgrounds)
    .post(isLoggedIn, isReview, validateReview, catchAsync(Reviews.newReview))

//DELETING REVIEWS

router.route('/:reviewID')
    .delete(isLoggedIn, isReviewAuthor, catchAsync(Reviews.deleteReview))

module.exports = router;
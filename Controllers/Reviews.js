const Review = require('../Models/review')
const CampGround = require('../Models/CampGrounds');

module.exports.fakeReviewtoCampgrounds = (req, res)=>{
    res.redirect('/campground')
}
module.exports.newReview = async(req, res)=>{
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review)
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', `Successfully added a new review to ${campground.title}`)
    res.redirect(`/campground/${campground._id}`);
}
module.exports.deleteReview = async(req, res)=>{
    const {id, reviewID} = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, {$pull: {reviews: reviewID}});
    await Review.findByIdAndDelete(reviewID);
    req.flash('success', `Successfully deleted a review from ${campground.title}`)
    res.redirect(`/campground/${campground._id}`);
}
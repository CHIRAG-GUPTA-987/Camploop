const CampGround = require('../Models/CampGrounds');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})
const {cloudinary} = require('../cloudinary')

module.exports.showAllCampgrounds = async(req, res)=>{
    const campgrounds = await CampGround.find({})
    return res.render('Campgrounds/index', {campgrounds})  
}
module.exports.renderNewForm = (req, res)=>{
    res.render('Campgrounds/new')
}
module.exports.createNewCampground = async(req, res)=>{
    const loc = await geocoder.forwardGeocode({
        query: req.body.CampGround.location,
        limit: 1
    }).send();
    if(loc.body.features.length === 0){
        req.flash('error', `Location doesn't exist on map`)
        console.log('hello')
        return res.redirect('/campground/new')
    }
    const {title, price, description, location} = req.body.CampGround
    const newCamp = new CampGround({title: title, price: price, description: description, location: location, author: req.user._id})
    newCamp.geometry = loc.body.features[0].geometry;
    newCamp.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    await newCamp.save()
    req.flash('success', `Successfully added ${newCamp.title}`)
    res.redirect(`/campground/${newCamp._id}`)
}
module.exports.showCampground = async(req, res)=>{
    const {id} = req.params
    req.session.returnTo = req.originalUrl
    const campground = await CampGround.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    })
    .populate('author')
    if(!campground){
        req.flash('error', `Can't find the campground`)
        return res.redirect('/campground')
    }
    let user_id = null;
    if(req.user){
        for(review of campground.reviews){
            if(review.author._id.equals(req.user._id)){
                user_id = req.user._id;
                break;
            }
        }
    }
    res.render('Campgrounds/show', {campground, user_id})
}
module.exports.editForm = async(req, res)=>{
    const {id} = req.params
    const campground = await CampGround.findById(id)
    if(!campground){
        req.flash('error', `Can't edit unknown campground`)
        return res.redirect('/campground')
    }
    res.render('Campgrounds/edit', {campground})
}
module.exports.editCampground = async(req, res)=>{
    const {id} = req.params
    const {price, description, location} = req.body.CampGround
    const campEdit = await CampGround.findByIdAndUpdate(id, {price, description, location})
    const images = req.files.map(f=>({url: f.path, filename: f.filename}))
    campEdit.images.push(...images);
    await campEdit.save();
    if(req.body.deleteImages){
        if(req.body.deleteImages.length === campEdit.images.length){
            req.body.deleteImages = req.body.deleteImages.slice(1, req.body.deleteImages.length);
        }
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await campEdit.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages }}}})
    }
    req.flash('success', `Successfully updated ${campEdit.title}`)
    return res.redirect(`/campground/${campEdit._id}`)
}
module.exports.deleteCampground = async(req, res)=>{
    const {id} = req.params
    const deletedCamp = await CampGround.findByIdAndDelete(id)
    req.flash('success', `Successfully deleted ${deletedCamp.title}`)
    return res.redirect('/Campground')
}
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNew = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.renderlisting = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path :"reviews", populate :{
        path : "author",
    }}).populate("owner");

    if (!listing) {
        req.flash("error", "Listing does not exist :(");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

module.exports.addNew = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "New Listing Created :)");
    res.redirect("/listings");
};

module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist :(");
        return res.redirect("/listings");
    }

    let originalImageURL = listing.image.url;
    originalImageURL = originalImageURL.replace("/upload","/upload/h_300,w_730");
    res.render("listings/edit.ejs", { listing,originalImageURL});
};

module.exports.updateEdit = async (req, res) => {
    
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated :)");
    res.redirect(`/listings/${id}`);
};

module.exports.destroylisting = async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    console.log(deletedList);
    req.flash("success", "Listing Deleted :(");
    res.redirect("/listings");
};
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const Listing = require("./listing.js"); 
const Review = require("./review.js");  

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: true }, 
    createdAt: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userSchema.plugin(passportLocalMongoose); 

userSchema.post("findOneAndDelete", async (user) => {
    if (user) {
        // User ke saare listings delete kar do
        await Listing.deleteMany({ owner: user._id });
        
        // User ke saare reviews delete kar do (jo usne doosron ki listings par kiye the)
        await Review.deleteMany({ author: user._id });
    }
});

module.exports = mongoose.model('User', userSchema);

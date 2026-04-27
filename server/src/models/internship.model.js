import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    company: {
        type: String,
        required: true
    },

    location: {
        type: String,
        default: "India"
    },

    stipend: {
        type: String,
        default: "Not disclosed"
    },

    tags: [String],

    applyUrl: {
        type: String,
        required: true
    },

    source: String,

    postedAt: {
        type: Date,
        default: Date.now
    }

});

const Internship =
    mongoose.model(
        "Internship",
        internshipSchema
    );

export default Internship;
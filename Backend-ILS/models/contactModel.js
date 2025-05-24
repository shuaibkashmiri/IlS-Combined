import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
  },
  documents: {
    type: String,  // Cloudinary URL for the PDF
    required: true,
  },
  picture: {
    type: String,  // Cloudinary URL for the profile picture
    required: true,
  }
}, {
  timestamps: true
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;

import Contact from "../models/contactModel.js";

export const createContact = async (req, res) => {
  const { name, email, message, mobile } = req.body;
  try {
    const contact = await Contact.create({ name, email, message, mobile });

    if (!contact) {
      return res.status(400).json({ message: "Message not Sent" });
    }
    res.status(201).json({
      message: "Message sent successfully we will get back to shortly",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const messages = await Contact.find();
    if (!messages) {
      return res.status(400).json({
        message: "No Messages",
      });
    }
    return res.status(200).json({ messages: messages });
  } catch (error) {
    console.log(error);
  }
};


// teach on ILs


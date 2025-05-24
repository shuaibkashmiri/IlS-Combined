import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  cardNumber: {
    type: String,
    default: null,
  },
  department: {
    type: String,
    default: null,
  },
});

export default mongoose.model("Employee", employeeSchema);

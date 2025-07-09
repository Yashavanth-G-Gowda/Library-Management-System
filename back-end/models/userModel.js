import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String },
  srn: { type: String, required: true },
  sem: { type: String },
  branch: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fine: { type: Number, default: 0 }, // ✅ Total fine
  booksBorrowed: {
    type: Map,
    of: new mongoose.Schema({
      isbn: { type: String, required: true },
      returnDate: { type: String, required: true }
    }, { _id: false }),
    default: {}
  },
  image: { type: String }
}, { minimize: false });

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModel;
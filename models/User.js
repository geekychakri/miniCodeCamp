import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  user: String,
  courses: Array,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;

import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  access_token: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.models.Account || mongoose.model("Account", AccountSchema);
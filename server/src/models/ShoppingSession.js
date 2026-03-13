const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  message: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

const participantSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  display_name: { type: String },
  joined_at: { type: Date, default: Date.now },
});

const cartItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  added_by: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
});

const voteSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  user_id: { type: String, required: true },
  vote: { type: Boolean, required: true },
  created_at: { type: Date, default: Date.now },
});

const shoppingSessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    created_by: { type: String, required: true },
    invite_code: { type: String, required: true, unique: true },
    is_active: { type: Boolean, default: true },
    participants: [participantSchema],
    cart_items: [cartItemSchema],
    messages: [messageSchema],
    votes: [voteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ShoppingSession", shoppingSessionSchema);

const mongoose = require("mongoose");

const groupDealSchema = new mongoose.Schema(
  {
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    created_by: { type: String, required: true },
    invite_code: { type: String, required: true, unique: true },
    target_participants: { type: Number, default: 5 },
    discount_percent: { type: Number, default: 20 },
    expires_at: { type: Date, required: true },
    is_active: { type: Boolean, default: true },
    participants: [
      {
        user_id: { type: String, required: true },
        joined_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("GroupDeal", groupDealSchema);

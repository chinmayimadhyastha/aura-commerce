const express = require("express");
const GroupDeal = require("../models/GroupDeal");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Get all active deals
router.get("/", async (req, res) => {
  try {
    const deals = await GroupDeal.find({ is_active: true })
      .sort({ createdAt: -1 })
      .lean();
    const productIds = deals.map((d) => d.product_id);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    const productMap = {};
    products.forEach((p) => { productMap[p._id.toString()] = p; });
    const enriched = deals.map((d) => ({
      ...d,
      products: productMap[d.product_id.toString()] || null,
    }));
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create deal
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { product_id, target_participants, discount_percent } = req.body;
    const invite_code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const deal = await GroupDeal.create({
      product_id,
      created_by: req.user.id,
      invite_code,
      target_participants,
      discount_percent,
      expires_at,
      participants: [{ user_id: req.user.id }],
    });
    req.io.to("group-deals").emit("deal-updated");
    const product = await Product.findById(product_id).lean();
    res.json({ ...deal.toObject(), products: product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Join deal by id
router.post("/:id/join", authMiddleware, async (req, res) => {
  try {
    const deal = await GroupDeal.findById(req.params.id);
    if (!deal) return res.status(404).json({ error: "Not found" });
    const already = deal.participants.find((p) => p.user_id === req.user.id);
    if (already) return res.status(400).json({ error: "Already joined" });
    deal.participants.push({ user_id: req.user.id });
    await deal.save();
    req.io.to("group-deals").emit("deal-updated");
    res.json(deal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Join by invite code
router.post("/join-by-code", authMiddleware, async (req, res) => {
  try {
    const { invite_code } = req.body;
    const deal = await GroupDeal.findOne({ invite_code: invite_code.toUpperCase(), is_active: true });
    if (!deal) return res.status(404).json({ error: "Deal not found" });
    const already = deal.participants.find((p) => p.user_id === req.user.id);
    if (!already) {
      deal.participants.push({ user_id: req.user.id });
      await deal.save();
    }
    req.io.to("group-deals").emit("deal-updated");
    res.json(deal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

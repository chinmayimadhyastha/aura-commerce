const express = require("express");
const ShoppingSession = require("../models/ShoppingSession");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// Create session
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const invite_code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const session = await ShoppingSession.create({
      name,
      created_by: req.user.id,
      invite_code,
      participants: [{ user_id: req.user.id, display_name: req.user.email.split("@")[0] }],
    });
    res.json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Join by invite code
router.post("/join", authMiddleware, async (req, res) => {
  try {
    const { invite_code } = req.body;
    const session = await ShoppingSession.findOne({
      invite_code: invite_code.toUpperCase(),
      is_active: true,
    });
    if (!session) return res.status(404).json({ error: "Session not found" });

    const already = session.participants.find((p) => p.user_id === req.user.id);
    if (!already) {
      session.participants.push({ user_id: req.user.id, display_name: req.user.email.split("@")[0] });
      await session.save();
    }

    const populated = await getPopulated(session._id);
    res.json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get session with populated products
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const populated = await getPopulated(req.params.id);
    if (!populated) return res.status(404).json({ error: "Not found" });
    res.json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add to cart
router.post("/:id/cart", authMiddleware, async (req, res) => {
  try {
    const { product_id } = req.body;
    const session = await ShoppingSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Not found" });
    session.cart_items.push({ product_id, added_by: req.user.id });
    await session.save();
    const populated = await getPopulated(session._id);
    req.io.to(`session-${session._id}`).emit("cart-updated", populated.cart_items);
    res.json(populated.cart_items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Remove from cart
router.delete("/:id/cart/:itemId", authMiddleware, async (req, res) => {
  try {
    const session = await ShoppingSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Not found" });
    session.cart_items = session.cart_items.filter((i) => i._id.toString() !== req.params.itemId);
    await session.save();
    const populated = await getPopulated(session._id);
    req.io.to(`session-${session._id}`).emit("cart-updated", populated.cart_items);
    res.json(populated.cart_items);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Send message
router.post("/:id/messages", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const session = await ShoppingSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Not found" });
    const msg = { user_id: req.user.id, message };
    session.messages.push(msg);
    await session.save();
    const saved = session.messages[session.messages.length - 1];
    req.io.to(`session-${session._id}`).emit("message", saved);
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Vote on product
router.post("/:id/votes", authMiddleware, async (req, res) => {
  try {
    const { product_id, vote } = req.body;
    const session = await ShoppingSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Not found" });
    const existing = session.votes.find(
      (v) => v.product_id.toString() === product_id && v.user_id === req.user.id
    );
    if (existing) {
      existing.vote = vote;
    } else {
      session.votes.push({ product_id, user_id: req.user.id, vote });
    }
    await session.save();
    req.io.to(`session-${session._id}`).emit("votes-updated", session.votes);
    res.json(session.votes);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

async function getPopulated(sessionId) {
  const session = await ShoppingSession.findById(sessionId).lean();
  if (!session) return null;
  // Populate product details in cart_items
  const productIds = session.cart_items.map((i) => i.product_id);
  const products = await Product.find({ _id: { $in: productIds } }).lean();
  const productMap = {};
  products.forEach((p) => { productMap[p._id.toString()] = p; });
  session.cart_items = session.cart_items.map((item) => ({
    ...item,
    products: productMap[item.product_id.toString()] || null,
  }));
  return session;
}

module.exports = router;

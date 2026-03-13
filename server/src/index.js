require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const sessionRoutes = require("./routes/sessions");
const groupDealRoutes = require("./routes/groupDeals");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

// Attach io to req for use in routes
app.use((req, _res, next) => {
  req.io = io;
  next();
});

app.get("/", (req, res) => {
  res.send("Aura Commerce Backend Running 🚀");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/group-deals", groupDealRoutes);

// Socket.io for real-time
io.on("connection", (socket) => {
  socket.on("join-session", (sessionId) => {
    socket.join(`session-${sessionId}`);
  });
  socket.on("leave-session", (sessionId) => {
    socket.leave(`session-${sessionId}`);
  });
  socket.on("join-deals", () => {
    socket.join("group-deals");
  });
  socket.on("disconnect", () => {});
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    seedProducts();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Seed initial products
async function seedProducts() {
  const Product = require("./models/Product");
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      {
        name: "Noir Leather Tote",
        price: 890,
        category: "Bags",
        image_url: "/product-1.jpg",
        mood: "bold",
        specs: { material: "Full-grain leather", dimensions: "38 × 28 × 12 cm", weight: "680g", color: "Noir Black", lining: "Suede interior", closure: "Magnetic snap" },
      },
      {
        name: "Chronograph Gold",
        price: 2450,
        category: "Watches",
        image_url: "/product-2.jpg",
        mood: "minimal",
        specs: { movement: "Swiss automatic", water_resistance: "100m", case: "18k gold-plated steel", dimensions: "42mm diameter", warranty: "2 years", weight: "145g" },
      },
      {
        name: "Aviator Shades",
        price: 340,
        category: "Eyewear",
        image_url: "/product-3.jpg",
        mood: "adventurous",
        specs: { lens: "Polarized gradient", material: "Titanium frame", color: "Gold / Smoke", dimensions: "145mm width", weight: "28g", warranty: "1 year" },
      },
      {
        name: "Elysian Parfum",
        price: 275,
        category: "Fragrance",
        image_url: "/product-4.jpg",
        mood: "cozy",
        specs: { notes_top: "Bergamot, Neroli", notes_heart: "Jasmine, Rose", material: "Eau de Parfum 100ml", color: "Amber flacon", closure: "Crystal stopper" },
      },
      {
        name: "Heritage Wallet",
        price: 195,
        category: "Accessories",
        image_url: "/product-5.jpg",
        mood: "minimal",
        specs: { material: "Vegetable-tanned leather", color: "Cognac Brown", card_slots: "8 slots", dimensions: "9.5 × 11 cm", weight: "85g", closure: "Bi-fold" },
      },
      {
        name: "Silk Ombré Scarf",
        price: 420,
        category: "Accessories",
        image_url: "/product-6.jpg",
        mood: "cozy",
        specs: { material: "100% Mulberry silk", dimensions: "90 × 90 cm", weave: "Twill", color: "Champagne to Ivory", weight: "65g", care: "Dry clean only" },
      },
    ]);
    console.log("Products seeded");
  }
}

// src/pages/Wishlist.tsx
import { motion } from "framer-motion";
import { ArrowLeft, Heart, ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/contexts/WishListContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const ALL_PRODUCTS = [
  { id: 1, name: "Noir Leather Tote", price: 890, category: "Bags", image: product1 },
  { id: 2, name: "Chronograph Gold", price: 2450, category: "Watches", image: product2 },
  { id: 3, name: "Aviator Shades", price: 340, category: "Eyewear", image: product3 },
  { id: 4, name: "Elysian Parfum", price: 275, category: "Fragrance", image: product4 },
  { id: 5, name: "Heritage Wallet", price: 195, category: "Accessories", image: product5 },
  { id: 6, name: "Silk Ombré Scarf", price: 420, category: "Accessories", image: product6 },
];

const Wishlist = () => {
  const { items, toggle } = useWishlist();
  const { addItem } = useCart();

  const wishlisted = ALL_PRODUCTS.filter((p) => items.includes(p.id));

  const handleAddToCart = (product: typeof ALL_PRODUCTS[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Link to="/">
              <button className="text-muted-foreground hover:text-primary transition-colors p-2">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold">
                Your <span className="text-gradient-gold italic">Wishlist</span>
              </h1>
              <p className="text-muted-foreground font-body text-sm">
                {wishlisted.length === 0 ? "Nothing saved yet" : `${wishlisted.length} item${wishlisted.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {wishlisted.length === 0 ? (
            <div className="text-center py-24">
              <Heart className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-20" />
              <p className="text-muted-foreground font-body text-lg mb-6">
                You haven't liked anything yet.
              </p>
              <Link to="/">
                <button className="bg-gradient-gold text-primary-foreground px-8 py-3 rounded-sm font-body font-semibold tracking-wider uppercase text-sm hover:opacity-90 transition-opacity">
                  Browse Collection
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlisted.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Remove from wishlist */}
                    <button
                      onClick={() => toggle(product.id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-red-500 hover:bg-card transition-colors"
                    >
                      <X size={14} />
                    </button>

                    {/* Add to cart on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-primary text-primary-foreground py-2.5 rounded-sm font-body text-xs font-semibold tracking-wider uppercase flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                      >
                        <ShoppingBag size={14} /> Add to Cart
                      </button>
                    </div>

                    <div className="absolute bottom-4 left-4 group-hover:opacity-0 transition-opacity">
                      <span className="px-3 py-1 text-xs font-body tracking-wider uppercase bg-card/80 backdrop-blur text-foreground rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-base font-semibold mb-1">{product.name}</h3>
                  <p className="text-primary font-body font-medium">${product.price.toLocaleString()}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Wishlist;
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

const products = [
  { id: 1, name: "Noir Leather Tote", price: 890, category: "Bags", image: product1, mood: "bold" },
  { id: 2, name: "Chronograph Gold", price: 2450, category: "Watches", image: product2, mood: "minimal" },
  { id: 3, name: "Aviator Shades", price: 340, category: "Eyewear", image: product3, mood: "adventurous" },
  { id: 4, name: "Elysian Parfum", price: 275, category: "Fragrance", image: product4, mood: "cozy" },
  { id: 5, name: "Heritage Wallet", price: 195, category: "Accessories", image: product5, mood: "minimal" },
  { id: 6, name: "Silk Ombré Scarf", price: 420, category: "Accessories", image: product6, mood: "cozy" },
];

const ProductGrid = () => {
  const { addItem } = useCart();
  const { toggle, isLiked } = useWishlist();

  const handleAddToCart = (product: typeof products[0]) => {
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
    <section id="products" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary tracking-[0.3em] uppercase text-sm font-body mb-4">
            Curated Selection
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold">
            Featured <span className="text-gradient-gold italic">Pieces</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300" />

                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => toggle(product.id)}
                    className={`w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center transition-colors ${
                      isLiked(product.id) ? "text-red-500" : "text-foreground hover:text-primary"
                    }`}
                  >
                    {isLiked(product.id) ? (
                      <Heart size={18} className="fill-red-500 text-red-500" />
                    ) : (
                      <Heart size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <ShoppingBag size={18} />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 text-xs font-body tracking-wider uppercase bg-card/80 backdrop-blur text-foreground rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>

              <h3 className="font-display text-lg font-semibold mb-1">{product.name}</h3>
              <p className="text-primary font-body font-medium">${product.price.toLocaleString()}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
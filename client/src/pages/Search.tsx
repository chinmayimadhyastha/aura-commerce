import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { getProductImage } from "@/lib/products";
import api from "@/integrations/api/client";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data));
    // Auto-focus search input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.mood && p.mood.toLowerCase().includes(q))
      )
    );
  }, [query, products]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: getProductImage(product.image_url),
    });
    toast.success(`${product.name} added to cart`);
  };

  const categories = [...new Set(products.map((p) => p.category))];
  const displayProducts = query.trim() ? results : products;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link to="/">
              <button className="text-muted-foreground hover:text-primary transition-colors p-2">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <h1 className="text-3xl font-display font-bold">
              Search <span className="text-gradient-gold italic">Collection</span>
            </h1>
          </div>

          {/* Search Input */}
          <div className="relative mb-10">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by name, category, or mood..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-lg py-4 pl-12 pr-12 font-body text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Category chips when no query */}
          {!query && (
            <div className="mb-8">
              <p className="text-muted-foreground font-body text-sm mb-3 uppercase tracking-wider">Browse by Category</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setQuery(cat)}
                    className="px-4 py-2 rounded-full border border-border text-sm font-body text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results count */}
          {query && (
            <p className="text-muted-foreground font-body text-sm mb-6">
              {results.length === 0 ? "No results" : `${results.length} result${results.length !== 1 ? "s" : ""}`} for "{query}"
            </p>
          )}

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={query}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-card mb-3">
                    <img
                      src={getProductImage(product.image_url)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors duration-300" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur flex items-center justify-center text-foreground hover:text-primary transition-colors">
                        <Heart size={18} />
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
                  <h3 className="font-display text-base font-semibold mb-1">{product.name}</h3>
                  <p className="text-primary font-body font-medium">${product.price.toLocaleString()}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {query && results.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground font-body">No products match "{query}"</p>
              <button onClick={() => setQuery("")} className="mt-4 text-primary font-body text-sm hover:underline">
                Clear search
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SearchPage;

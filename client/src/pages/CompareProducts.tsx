import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import api from "@/integrations/api/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProductImage, specLabels } from "@/lib/products";
import Navbar from "@/components/Navbar";

const CompareProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data));
  }, []);

  const toggleProduct = (product: any) => {
    if (selected.find((p) => p._id === product._id)) {
      setSelected(selected.filter((p) => p._id !== product._id));
    } else if (selected.length < 4) {
      setSelected([...selected, product]);
    }
  };

  const allSpecKeys = Array.from(
    new Set(selected.flatMap((p) => Object.keys(p.specs || {})))
  );

  const isDifferent = (key: string) => {
    const values = selected.map((p) => (p.specs as Record<string, string>)?.[key] || "—");
    return new Set(values).size > 1;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold">
                Compare <span className="text-gradient-gold italic">Products</span>
              </h1>
              <p className="text-muted-foreground font-body text-sm">Select 2-4 products to compare side-by-side</p>
            </div>
          </div>

          {/* Product Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
            {products.map((product) => {
              const isSelected = !!selected.find((p) => p._id === product._id);
              return (
                <button
                  key={product._id}
                  onClick={() => toggleProduct(product)}
                  className={`relative rounded-lg border overflow-hidden transition-all duration-200 ${
                    isSelected ? "border-primary glow-gold ring-2 ring-primary/30" : "border-border hover:border-primary/50"
                  } ${!isSelected && selected.length >= 4 ? "opacity-40 cursor-not-allowed" : ""}`}
                  disabled={!isSelected && selected.length >= 4}
                >
                  <img src={getProductImage(product.image_url)} alt={product.name} className="w-full aspect-square object-cover" />
                  <div className="p-2 bg-card">
                    <p className="font-display text-xs font-semibold truncate">{product.name}</p>
                    <p className="text-primary text-xs font-body">${product.price}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Comparison Table */}
          {selected.length >= 2 ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border bg-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col className="w-40" />
                      {selected.map((p) => <col key={p._id} />)}
                    </colgroup>
                    <thead>
                      <tr className="border-b border-border">
                        <th className="p-4 text-left font-body text-sm text-muted-foreground uppercase tracking-wider">Spec</th>
                        {selected.map((product) => (
                          <th key={product._id} className="p-4 text-center">
                            <div className="flex flex-col items-center">
                              <img src={getProductImage(product.image_url)} alt={product.name} className="w-20 h-20 object-cover rounded-lg mb-2" />
                              <p className="font-display font-semibold text-sm">{product.name}</p>
                              <p className="text-primary font-body text-sm">${product.price}</p>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border">
                        <td className="p-4 font-body text-sm text-muted-foreground">Price</td>
                        {selected.map((product) => {
                          const prices = selected.map((p) => p.price);
                          const isLowest = product.price === Math.min(...prices);
                          const isHighest = product.price === Math.max(...prices);
                          return (
                            <td key={product._id} className={`p-4 text-center font-body font-semibold text-sm ${
                              prices.length > 1 && isLowest ? "text-success" : prices.length > 1 && isHighest ? "text-destructive" : ""
                            }`}>
                              ${product.price.toLocaleString()}
                              {prices.length > 1 && isLowest && <span className="block text-xs mt-0.5">Best Price</span>}
                            </td>
                          );
                        })}
                      </tr>
                      <tr className="border-b border-border">
                        <td className="p-4 font-body text-sm text-muted-foreground">Category</td>
                        {selected.map((product) => (
                          <td key={product._id} className="p-4 text-center font-body text-sm">{product.category}</td>
                        ))}
                      </tr>
                      {allSpecKeys.map((key) => (
                        <tr key={key} className={`border-b border-border transition-colors ${isDifferent(key) ? "bg-primary/5" : ""}`}>
                          <td className="p-4 font-body text-sm text-muted-foreground flex items-center gap-2">
                            {specLabels[key] || key}
                            {isDifferent(key) && <Scale className="w-3 h-3 text-primary" />}
                          </td>
                          {selected.map((product) => (
                            <td key={product._id} className={`p-4 text-center font-body text-sm ${isDifferent(key) ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                              {(product.specs as Record<string, string>)?.[key] || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <Scale className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground font-body">Select at least 2 products above to compare</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CompareProducts;

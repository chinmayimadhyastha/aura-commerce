import { motion } from "framer-motion";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Cart = () => {
  const { items, removeItem, updateQty, total, clearCart } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-8">
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold">
                Your <span className="text-gradient-gold italic">Cart</span>
              </h1>
              <p className="text-muted-foreground font-body text-sm">
                {items.length === 0 ? "Your cart is empty" : `${items.length} item${items.length !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-20" />
              <p className="text-muted-foreground font-body text-lg mb-6">Nothing here yet.</p>
              <Link to="/">
                <Button className="bg-gradient-gold text-primary-foreground font-body tracking-wider uppercase">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 bg-card border border-border rounded-lg p-4"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-28 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-body text-muted-foreground uppercase tracking-wider">
                            {item.category}
                          </span>
                          <h3 className="font-display font-semibold text-base">{item.name}</h3>
                          <p className="text-primary font-body font-medium mt-1">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-border rounded-md overflow-hidden">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 py-1.5 font-body text-sm border-x border-border min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="px-3 py-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-sm font-body text-muted-foreground">
                          Subtotal: <span className="text-foreground font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-sm text-muted-foreground hover:text-destructive transition-colors font-body flex items-center gap-1"
                >
                  <Trash2 size={14} /> Clear cart
                </button>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-28">
                  <h2 className="font-display font-bold text-xl mb-6">Order Summary</h2>

                  <div className="space-y-3 mb-6 font-body text-sm">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-muted-foreground">
                        <span className="truncate pr-2">{item.name} × {item.quantity}</span>
                        <span className="flex-shrink-0">${(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-6">
                    <div className="flex justify-between font-body text-sm text-muted-foreground mb-2">
                      <span>Subtotal</span>
                      <span>${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-body text-sm text-muted-foreground mb-2">
                      <span>Shipping</span>
                      <span className="text-primary">Free</span>
                    </div>
                    <div className="flex justify-between font-display font-bold text-lg mt-4">
                      <span>Total</span>
                      <span className="text-primary">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-gold text-primary-foreground font-body tracking-wider uppercase py-6 text-sm">
                    Proceed to Checkout
                  </Button>

                  <Link to="/">
                    <button className="w-full mt-3 text-center text-sm font-body text-muted-foreground hover:text-primary transition-colors">
                      Continue Shopping
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;

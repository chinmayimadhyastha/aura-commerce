import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Shop Together", href: "/social-shopping" },
            { label: "Compare", href: "/compare" },
            { label: "Group Deals", href: "/group-deals" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="text-sm font-body tracking-wider text-muted-foreground hover:text-primary transition-colors uppercase"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wide text-gradient-gold">
            AURÈLE
          </h1>
        </Link>

        <div className="flex items-center gap-5">
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Search size={20} />
          </button>
          <button
            onClick={handleUserClick}
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            title={user ? "Sign out" : "Sign in"}
          >
            {user ? <LogOut size={20} /> : <User size={20} />}
          </button>
          <button className="relative text-muted-foreground hover:text-primary transition-colors">
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-card border-t border-border"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {[
                { label: "Shop Together", href: "/social-shopping" },
                { label: "Compare", href: "/compare" },
                { label: "Group Deals", href: "/group-deals" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm font-body tracking-wider text-muted-foreground hover:text-primary transition-colors uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!user && (
                <Link
                  to="/auth"
                  className="text-sm font-body tracking-wider text-primary uppercase"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

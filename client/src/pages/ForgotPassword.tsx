import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import api from "@/integrations/api/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email });
      setSent(true);
      toast.success("If that email exists, a reset link has been sent!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm">
          <ArrowLeft size={16} /> Back to login
        </Link>
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-display font-bold mb-2">Reset Password</h2>
          <p className="text-muted-foreground font-body text-sm mb-6">Enter your email and we'll send a reset link.</p>
          {sent ? (
            <p className="text-primary font-body text-sm">Reset link sent! Check your inbox.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-md py-3 pl-10 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" required />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-md font-body font-semibold text-sm tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

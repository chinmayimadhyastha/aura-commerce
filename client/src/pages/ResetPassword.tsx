import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import api from "@/integrations/api/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/auth/update-password", { password });
      toast.success("Password updated successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8">
          <h2 className="text-2xl font-display font-bold mb-2">Set New Password</h2>
          <p className="text-muted-foreground font-body text-sm mb-6">Enter your new password below.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-md py-3 pl-10 pr-4 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                required minLength={6} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gradient-gold text-primary-foreground py-3 rounded-md font-body font-semibold text-sm tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, ArrowLeft, Plus, Share2, Timer, Check } from "lucide-react";
import { io } from "socket.io-client";
import api from "@/integrations/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getProductImage } from "@/lib/products";
import Navbar from "@/components/Navbar";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const GroupDeals = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [products, setProducts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [targetCount, setTargetCount] = useState(5);
  const [discountPercent, setDiscountPercent] = useState(20);
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchProducts();
    fetchDeals();
    const timer = setInterval(() => setNow(new Date()), 1000);
    const joinCode = searchParams.get("join");
    if (joinCode) joinDealByCode(joinCode);

    const socket = io(SOCKET_URL);
    socket.emit("join-deals");
    socket.on("deal-updated", fetchDeals);

    return () => {
      clearInterval(timer);
      socket.disconnect();
    };
  }, []);

  const fetchProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };

  const fetchDeals = async () => {
    const { data } = await api.get("/group-deals");
    setDeals(data);
  };

  const createDeal = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!selectedProduct) return;
    setLoading(true);
    try {
      await api.post("/group-deals", {
        product_id: selectedProduct,
        target_participants: targetCount,
        discount_percent: discountPercent,
      });
      setShowCreate(false);
      setSelectedProduct("");
      await fetchDeals();
      toast({ title: "Deal created!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.error || err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const joinDeal = async (dealId: string) => {
    if (!user) { navigate("/auth"); return; }
    try {
      await api.post(`/group-deals/${dealId}/join`);
      toast({ title: "Joined! 🎉", description: "You've joined the group deal." });
      await fetchDeals();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      if (msg === "Already joined") {
        toast({ title: "Already joined", description: "You're already part of this deal." });
      } else {
        toast({ title: "Error", description: msg, variant: "destructive" });
      }
    }
  };

  const joinDealByCode = async (code: string) => {
    if (!user) { navigate("/auth"); return; }
    try {
      await api.post("/group-deals/join-by-code", { invite_code: code });
      await fetchDeals();
      toast({ title: "Joined! 🎉" });
    } catch {
      toast({ title: "Deal not found", variant: "destructive" });
    }
  };

  const copyDealLink = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/group-deals?join=${code}`);
    toast({ title: "Link copied!" });
  };

  const getTimeLeft = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - now.getTime();
    if (diff <= 0) return "Expired";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 container mx-auto px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
              <div>
                <h1 className="text-3xl font-display font-bold">
                  Group <span className="text-gradient-gold italic">Deals</span>
                </h1>
                <p className="text-muted-foreground font-body text-sm">Buy together, save together 👨‍👩‍👧‍👦</p>
              </div>
            </div>
            <Button onClick={() => setShowCreate(!showCreate)} className="bg-gradient-gold text-primary-foreground font-body tracking-wider uppercase text-xs">
              <Plus className="w-4 h-4 mr-1" /> Create Deal
            </Button>
          </div>

          {/* Create Deal Form */}
          {showCreate && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8">
              <Card className="border-primary/30 bg-card">
                <CardHeader><CardTitle className="font-display text-lg">Create a Group Deal</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-body text-muted-foreground mb-2 block">Select Product</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {products.map((p) => (
                        <button key={p._id} onClick={() => setSelectedProduct(p._id)}
                          className={`rounded-lg border overflow-hidden transition-all ${selectedProduct === p._id ? "border-primary ring-2 ring-primary/30" : "border-border"}`}>
                          <img src={getProductImage(p.image_url)} alt={p.name} className="w-full aspect-square object-cover" />
                          <p className="text-xs font-body p-1 truncate">{p.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-body text-muted-foreground mb-1 block">Min Buyers</label>
                      <Input type="number" min={2} max={20} value={targetCount} onChange={(e) => setTargetCount(Number(e.target.value))} className="bg-secondary border-border" />
                    </div>
                    <div>
                      <label className="text-sm font-body text-muted-foreground mb-1 block">Discount %</label>
                      <Input type="number" min={5} max={50} value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="bg-secondary border-border" />
                    </div>
                  </div>
                  {selectedProduct && (() => {
                    const p = products.find((p) => p._id === selectedProduct);
                    return (
                      <div className="bg-secondary/50 rounded-lg p-3 font-body text-sm">
                        <p>Solo price: <span className="text-foreground font-semibold">${p?.price}</span></p>
                        <p>Group price: <span className="text-primary font-semibold">${Math.round(p?.price * (1 - discountPercent / 100))}</span>
                          <span className="text-muted-foreground"> (when {targetCount}+ join)</span>
                        </p>
                      </div>
                    );
                  })()}
                  <Button onClick={createDeal} disabled={!selectedProduct || loading} className="w-full bg-gradient-gold text-primary-foreground font-body tracking-wider uppercase">
                    Create Deal (24h Timer)
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Active Deals */}
          <div className="space-y-4">
            {deals.length === 0 ? (
              <div className="text-center py-16">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                <p className="text-muted-foreground font-body">No active deals yet. Create one!</p>
              </div>
            ) : (
              deals.map((deal) => {
                const parts = deal.participants || [];
                const progress = Math.min((parts.length / deal.target_participants) * 100, 100);
                const isExpired = new Date(deal.expires_at).getTime() <= now.getTime();
                const hasJoined = parts.some((p: any) => p.user_id === user?.id);
                const isUnlocked = parts.length >= deal.target_participants;
                const groupPrice = Math.round(deal.products?.price * (1 - deal.discount_percent / 100));

                return (
                  <motion.div key={deal._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className={`border-border bg-card overflow-hidden ${isExpired ? "opacity-60" : ""}`}>
                      <div className="flex flex-col sm:flex-row">
                        <img src={getProductImage(deal.products?.image_url)} alt={deal.products?.name} className="w-full sm:w-40 h-40 object-cover" />
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-display font-bold text-lg">{deal.products?.name}</h3>
                              <div className="flex items-center gap-3 font-body text-sm">
                                <span className="text-muted-foreground line-through">${deal.products?.price}</span>
                                <span className="text-primary font-bold text-lg">${groupPrice}</span>
                                <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-semibold">-{deal.discount_percent}%</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => copyDealLink(deal.invite_code)} className="text-xs">
                                <Share2 className="w-3 h-3 mr-1" /> Share
                              </Button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm font-body mb-1">
                              <span className="text-muted-foreground">{parts.length}/{deal.target_participants} joined</span>
                              <span className={`flex items-center gap-1 ${isExpired ? "text-destructive" : "text-primary"}`}>
                                <Timer className="w-3 h-3" /> {getTimeLeft(deal.expires_at)}
                              </span>
                            </div>
                            <Progress value={progress} className="h-2" />
                          </div>

                          {isUnlocked && (
                            <div className="flex items-center gap-2 text-sm font-body text-success mb-3">
                              <Check className="w-4 h-4" /> Deal unlocked! Group price active.
                            </div>
                          )}

                          {!isExpired && !hasJoined && (
                            <Button onClick={() => joinDeal(deal._id)} className="bg-gradient-gold text-primary-foreground font-body tracking-wider uppercase text-xs">
                              <Users className="w-4 h-4 mr-1" /> Join Deal
                            </Button>
                          )}
                          {hasJoined && (
                            <span className="text-sm font-body text-primary flex items-center gap-1">
                              <Check className="w-4 h-4" /> You've joined
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GroupDeals;

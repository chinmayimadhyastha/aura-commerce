import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Send, ShoppingBag, ThumbsUp, ThumbsDown, Plus, Copy, Trash2, ArrowLeft, MessageCircle } from "lucide-react";
import { io, Socket } from "socket.io-client";
import api from "@/integrations/api/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getProductImage } from "@/lib/products";
import Navbar from "@/components/Navbar";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const SocialShopping = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [sessionName, setSessionName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [activeSession, setActiveSession] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data));
    const code = searchParams.get("join");
    if (code) {
      setInviteCode(code);
      handleJoinSession(code);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages]);

  useEffect(() => {
    if (!activeSession) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit("join-session", activeSession._id);

    socket.on("cart-updated", (cartItems: any[]) => {
      setActiveSession((prev: any) => ({ ...prev, cart_items: cartItems }));
    });
    socket.on("message", (msg: any) => {
      setActiveSession((prev: any) => ({ ...prev, messages: [...(prev.messages || []), msg] }));
    });
    socket.on("votes-updated", (votes: any[]) => {
      setActiveSession((prev: any) => ({ ...prev, votes }));
    });

    return () => {
      socket.emit("leave-session", activeSession._id);
      socket.disconnect();
    };
  }, [activeSession?._id]);

  const createSession = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!sessionName.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/sessions", { name: sessionName });
      setActiveSession(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.error || err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  const handleJoinSession = async (code?: string) => {
    if (!user) { navigate("/auth"); return; }
    const joinCode = code || inviteCode;
    if (!joinCode.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/sessions/join", { invite_code: joinCode });
      setActiveSession(data);
    } catch {
      toast({ title: "Session not found", description: "Check the invite code and try again.", variant: "destructive" });
    }
    setLoading(false);
  };

  const addToCart = async (productId: string) => {
    if (!user || !activeSession) return;
    await api.post(`/sessions/${activeSession._id}/cart`, { product_id: productId });
  };

  const removeFromCart = async (itemId: string) => {
    await api.delete(`/sessions/${activeSession._id}/cart/${itemId}`);
  };

  const sendMessage = async () => {
    if (!user || !activeSession || !newMessage.trim()) return;
    await api.post(`/sessions/${activeSession._id}/messages`, { message: newMessage });
    setNewMessage("");
  };

  const castVote = async (productId: string, vote: boolean) => {
    if (!user || !activeSession) return;
    await api.post(`/sessions/${activeSession._id}/votes`, { product_id: productId, vote });
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/social-shopping?join=${activeSession.invite_code}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied!", description: "Share it with your friends." });
  };

  const getVoteCounts = (productId: string) => {
    const votes = activeSession?.votes || [];
    const productVotes = votes.filter((v: any) => v.product_id === productId);
    return {
      yes: productVotes.filter((v: any) => v.vote).length,
      no: productVotes.filter((v: any) => !v.vote).length,
      myVote: productVotes.find((v: any) => v.user_id === user?.id)?.vote,
    };
  };

  if (!activeSession) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-16 container mx-auto px-6 max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-12">
              <Users className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl font-display font-bold mb-3">
                Social <span className="text-gradient-gold italic">Shopping</span>
              </h1>
              <p className="text-muted-foreground font-body">Shop with friends in real-time. Create a session or join one!</p>
            </div>

            <div className="space-y-6">
              <Card className="border-border bg-card">
                <CardHeader><CardTitle className="font-display text-lg">Create a Session</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Session name (e.g., Weekend Shopping)" value={sessionName} onChange={(e) => setSessionName(e.target.value)} className="bg-secondary border-border" />
                  <Button onClick={createSession} disabled={loading} className="w-full bg-gradient-gold text-primary-foreground font-body tracking-wider uppercase">
                    <Plus className="w-4 h-4 mr-2" /> Create Session
                  </Button>
                </CardContent>
              </Card>

              <div className="text-center text-muted-foreground font-body text-sm">— or —</div>

              <Card className="border-border bg-card">
                <CardHeader><CardTitle className="font-display text-lg">Join a Session</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Enter invite code" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} className="bg-secondary border-border uppercase tracking-widest text-center font-body" />
                  <Button onClick={() => handleJoinSession()} disabled={loading} variant="outline" className="w-full font-body tracking-wider uppercase">
                    <Users className="w-4 h-4 mr-2" /> Join Session
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const cartItems = activeSession.cart_items || [];
  const messages = activeSession.messages || [];
  const participants = activeSession.participants || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-8 container mx-auto px-4">
        {/* Session Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setActiveSession(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold">{activeSession.name}</h1>
              <p className="text-muted-foreground text-sm font-body">{participants.length} participant{participants.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={copyInviteLink} className="font-body text-xs">
            <Copy className="w-3 h-3 mr-1" /> Invite: {activeSession.invite_code}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Column */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Add Products
            </h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {products.map((product) => {
                const voteCounts = getVoteCounts(product._id);
                return (
                  <Card key={product._id} className="border-border bg-card overflow-hidden">
                    <div className="flex gap-3 p-3">
                      <img src={getProductImage(product.image_url)} alt={product.name} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm truncate">{product.name}</p>
                        <p className="text-primary text-sm font-body">${product.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => castVote(product._id, true)} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${voteCounts.myVote === true ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-primary"}`}>
                            <ThumbsUp className="w-3 h-3" /> {voteCounts.yes}
                          </button>
                          <button onClick={() => castVote(product._id, false)} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${voteCounts.myVote === false ? "bg-destructive/20 text-destructive" : "text-muted-foreground hover:text-destructive"}`}>
                            <ThumbsDown className="w-3 h-3" /> {voteCounts.no}
                          </button>
                          <Button size="sm" variant="ghost" className="ml-auto h-7 text-xs" onClick={() => addToCart(product._id)}>
                            <Plus className="w-3 h-3" /> Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Shared Cart */}
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Shared Cart ({cartItems.length})
            </h2>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground text-sm font-body text-center py-8">Cart is empty. Add some products!</p>
              ) : (
                cartItems.map((item: any) => (
                  <Card key={item._id} className="border-border bg-card">
                    <div className="flex items-center gap-3 p-3">
                      <img src={getProductImage(item.products?.image_url)} alt={item.products?.name} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm truncate">{item.products?.name}</p>
                        <p className="text-primary text-xs font-body">${item.products?.price}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item._id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
              {cartItems.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <p className="text-right font-display font-bold text-lg">
                    Total: <span className="text-primary">${cartItems.reduce((sum: number, i: any) => sum + (i.products?.price || 0), 0).toLocaleString()}</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Chat */}
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" /> Live Chat
            </h2>
            <Card className="border-border bg-card flex flex-col h-[60vh]">
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg: any) => {
                  const isMe = msg.user_id === user?.id;
                  return (
                    <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm font-body ${isMe ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                        {!isMe && <p className="text-xs font-semibold mb-1 opacity-70">{participants.find((p: any) => p.user_id === msg.user_id)?.display_name || "User"}</p>}
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>
              <div className="border-t border-border p-3 flex gap-2">
                <Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="bg-secondary border-border text-sm" />
                <Button size="icon" onClick={sendMessage} className="bg-primary text-primary-foreground shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialShopping;

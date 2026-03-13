import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Send, ShoppingBag, ThumbsUp, ThumbsDown, Plus, Copy, Trash2, ArrowLeft, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getProductImage } from "@/lib/products";
import Navbar from "@/components/Navbar";
import ParticipantsList from "@/components/social-shopping/ParticipantsList";

const SocialShopping = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [sessionName, setSessionName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [activeSession, setActiveSession] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [votes, setVotes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts();
    const code = searchParams.get("join");
    if (code) {
      setInviteCode(code);
      joinSession(code);
    }
  }, [searchParams]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeSession) return;

    const channel = supabase.channel(`session-${activeSession.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "session_cart_items", filter: `session_id=eq.${activeSession.id}` }, () => fetchCartItems())
      .on("postgres_changes", { event: "*", schema: "public", table: "session_messages", filter: `session_id=eq.${activeSession.id}` }, () => fetchMessages())
      .on("postgres_changes", { event: "*", schema: "public", table: "session_votes", filter: `session_id=eq.${activeSession.id}` }, () => fetchVotes())
      .on("postgres_changes", { event: "*", schema: "public", table: "session_participants", filter: `session_id=eq.${activeSession.id}` }, () => fetchParticipants())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeSession]);

  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    if (data) setProducts(data);
  };

  const fetchCartItems = async () => {
    if (!activeSession) return;
    const { data } = await supabase.from("session_cart_items").select("*, products(*)").eq("session_id", activeSession.id);
    if (data) setCartItems(data);
  };

  const fetchMessages = async () => {
    if (!activeSession) return;
    const { data } = await supabase.from("session_messages").select("*").eq("session_id", activeSession.id).order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  const fetchVotes = async () => {
    if (!activeSession) return;
    const { data } = await supabase.from("session_votes").select("*").eq("session_id", activeSession.id);
    if (data) setVotes(data);
  };

  const fetchParticipants = async () => {
    if (!activeSession) return;
    const { data } = await supabase.from("session_participants").select("*").eq("session_id", activeSession.id);
    if (data) setParticipants(data);
  };

  const createSession = async () => {
    if (!user) { navigate("/auth"); return; }
    if (!sessionName.trim()) return;
    setLoading(true);

    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase.from("shopping_sessions").insert({
      name: sessionName,
      created_by: user.id,
      invite_code: code,
    }).select().single();

    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); setLoading(false); return; }

    // Add creator as participant
    await supabase.from("session_participants").insert({
      session_id: data.id,
      user_id: user.id,
      display_name: user.email?.split("@")[0] || "Host",
    });

    setActiveSession(data);
    fetchParticipants();
    fetchCartItems();
    fetchMessages();
    fetchVotes();
    setLoading(false);
  };

  const joinSession = async (code?: string) => {
    if (!user) { navigate("/auth"); return; }
    const joinCode = code || inviteCode;
    if (!joinCode.trim()) return;
    setLoading(true);

    const { data: session, error } = await supabase.from("shopping_sessions").select("*").eq("invite_code", joinCode.toUpperCase()).eq("is_active", true).single();

    if (error || !session) { toast({ title: "Session not found", description: "Check the invite code and try again.", variant: "destructive" }); setLoading(false); return; }

    await supabase.from("session_participants").upsert({
      session_id: session.id,
      user_id: user.id,
      display_name: user.email?.split("@")[0] || "Guest",
    }, { onConflict: "session_id,user_id" });

    setActiveSession(session);
    setTimeout(() => {
      fetchParticipants();
      fetchCartItems();
      fetchMessages();
      fetchVotes();
    }, 300);
    setLoading(false);
  };

  const addToCart = async (productId: string) => {
    if (!user || !activeSession) return;
    await supabase.from("session_cart_items").insert({
      session_id: activeSession.id,
      product_id: productId,
      added_by: user.id,
    });
  };

  const removeFromCart = async (itemId: string) => {
    await supabase.from("session_cart_items").delete().eq("id", itemId);
  };

  const sendMessage = async () => {
    if (!user || !activeSession || !newMessage.trim()) return;
    await supabase.from("session_messages").insert({
      session_id: activeSession.id,
      user_id: user.id,
      message: newMessage,
    });
    setNewMessage("");
  };

  const castVote = async (productId: string, voteValue: boolean) => {
    if (!user || !activeSession) return;
    await supabase.from("session_votes").upsert({
      session_id: activeSession.id,
      product_id: productId,
      user_id: user.id,
      vote: voteValue,
    }, { onConflict: "session_id,product_id,user_id" });
  };

  const copyInviteLink = () => {
    const link = `${window.location.origin}/social-shopping?join=${activeSession.invite_code}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Link copied!", description: "Share it with your friends." });
  };

  const getVoteCounts = (productId: string) => {
    const productVotes = votes.filter((v) => v.product_id === productId);
    return {
      yes: productVotes.filter((v) => v.vote).length,
      no: productVotes.filter((v) => !v.vote).length,
      myVote: productVotes.find((v) => v.user_id === user?.id)?.vote,
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
                  <Button onClick={() => joinSession()} disabled={loading} variant="outline" className="w-full font-body tracking-wider uppercase">
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

        {/* Participants Bar */}
        <ParticipantsList participants={participants} currentUserId={user?.id} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Products Column */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Add Products
            </h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {products.map((product) => {
                const voteCounts = getVoteCounts(product.id);
                return (
                  <Card key={product.id} className="border-border bg-card overflow-hidden">
                    <div className="flex gap-3 p-3">
                      <img src={getProductImage(product.image_url)} alt={product.name} className="w-16 h-16 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm truncate">{product.name}</p>
                        <p className="text-primary text-sm font-body">${product.price}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => castVote(product.id, true)} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${voteCounts.myVote === true ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-primary"}`}>
                            <ThumbsUp className="w-3 h-3" /> {voteCounts.yes}
                          </button>
                          <button onClick={() => castVote(product.id, false)} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${voteCounts.myVote === false ? "bg-destructive/20 text-destructive" : "text-muted-foreground hover:text-destructive"}`}>
                            <ThumbsDown className="w-3 h-3" /> {voteCounts.no}
                          </button>
                          <Button size="sm" variant="ghost" className="ml-auto h-7 text-xs" onClick={() => addToCart(product.id)}>
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
                cartItems.map((item) => (
                  <Card key={item.id} className="border-border bg-card">
                    <div className="flex items-center gap-3 p-3">
                      <img src={getProductImage(item.products?.image_url)} alt={item.products?.name} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-semibold text-sm truncate">{item.products?.name}</p>
                        <p className="text-primary text-xs font-body">${item.products?.price}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
              {cartItems.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <p className="text-right font-display font-bold text-lg">
                    Total: <span className="text-primary">${cartItems.reduce((sum, i) => sum + (i.products?.price || 0), 0).toLocaleString()}</span>
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
                {messages.map((msg) => {
                  const isMe = msg.user_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm font-body ${isMe ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                        {!isMe && <p className="text-xs font-semibold mb-1 opacity-70">{participants.find((p) => p.user_id === msg.user_id)?.display_name || "User"}</p>}
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

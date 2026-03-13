import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Flame, Leaf, Mountain, Heart } from "lucide-react";

const moods = [
  {
    id: "cozy",
    label: "Cozy",
    icon: Heart,
    description: "Warm textures, soft tones, comfort-first pieces",
    gradient: "from-amber-900/30 to-orange-900/20",
  },
  {
    id: "bold",
    label: "Bold",
    icon: Flame,
    description: "Statement pieces, sharp silhouettes, high contrast",
    gradient: "from-red-900/30 to-rose-900/20",
  },
  {
    id: "minimal",
    label: "Minimal",
    icon: Sparkles,
    description: "Clean lines, neutral palette, timeless elegance",
    gradient: "from-stone-800/30 to-zinc-900/20",
  },
  {
    id: "nature",
    label: "Earthy",
    icon: Leaf,
    description: "Organic materials, earth tones, sustainable luxury",
    gradient: "from-emerald-900/30 to-green-900/20",
  },
  {
    id: "adventurous",
    label: "Adventurous",
    icon: Mountain,
    description: "Utility meets style, rugged refinement",
    gradient: "from-sky-900/30 to-blue-900/20",
  },
];

const MoodSelector = () => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <section id="mood" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary tracking-[0.3em] uppercase text-sm font-body mb-4">
            ✦ Exclusive Feature
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Shop by <span className="text-gradient-gold italic">Mood</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Select your current vibe and discover a curated collection that matches your energy.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {moods.map((mood, i) => {
            const Icon = mood.icon;
            const isSelected = selected === mood.id;
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelected(mood.id)}
                className={`relative group p-6 rounded-lg border transition-all duration-300 text-left ${
                  isSelected
                    ? "border-primary glow-gold bg-secondary"
                    : "border-border hover:border-primary/50 bg-background"
                }`}
              >
                <div
                  className={`absolute inset-0 rounded-lg bg-gradient-to-br ${mood.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative z-10">
                  <Icon
                    size={28}
                    className={`mb-4 transition-colors ${
                      isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    }`}
                  />
                  <h3 className="font-display text-lg font-semibold mb-2">{mood.label}</h3>
                  <p className="text-muted-foreground text-sm font-body leading-relaxed">
                    {mood.description}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-10"
          >
            <a
              href="#products"
              className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-8 py-3 font-body font-semibold tracking-wider uppercase text-sm rounded-sm hover:opacity-90 transition-opacity"
            >
              <Sparkles size={16} />
              Show Me {moods.find((m) => m.id === selected)?.label} Picks
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MoodSelector;

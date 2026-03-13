import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-background/70" />

      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary tracking-[0.3em] uppercase text-sm font-body mb-6"
        >
          A New Way to Shop
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-6"
        >
          Shop Your
          <br />
          <span className="text-gradient-gold italic">Mood</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-muted-foreground font-body text-lg md:text-xl max-w-xl mx-auto mb-10"
        >
          The world's first mood-curated shopping experience.
          Tell us how you feel, we'll find what you need.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#mood"
            className="inline-flex items-center gap-2 bg-gradient-gold text-primary-foreground px-8 py-4 font-body font-semibold tracking-wider uppercase text-sm rounded-sm hover:opacity-90 transition-opacity"
          >
            Discover Your Mood
            <ArrowRight size={18} />
          </a>
          <a
            href="#products"
            className="inline-flex items-center gap-2 border border-border text-foreground px-8 py-4 font-body font-semibold tracking-wider uppercase text-sm rounded-sm hover:border-primary hover:text-primary transition-colors"
          >
            Browse Collection
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-16 bg-gradient-to-b from-primary/0 via-primary to-primary/0" />
      </motion.div>
    </section>
  );
};

export default HeroSection;

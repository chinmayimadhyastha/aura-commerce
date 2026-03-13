import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Scale, Tags } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Shop Together",
    description: "Create a live shopping session, invite friends, share a cart, chat, and vote on items in real-time.",
    link: "/social-shopping",
    cta: "Start Session",
  },
  {
    icon: Scale,
    title: "Compare Products",
    description: "Select 2-4 products and compare specs side-by-side with highlighted differences.",
    link: "/compare",
    cta: "Compare Now",
  },
  {
    icon: Tags,
    title: "Group Deals",
    description: "Buy together and save! The more people join, the lower the price. 24-hour limited deals.",
    link: "/group-deals",
    cta: "View Deals",
  },
];

const FeatureShowcase = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary tracking-[0.3em] uppercase text-sm font-body mb-4">
            ✦ Special Features
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Shop <span className="text-gradient-gold italic">Smarter</span>
          </h2>
          <p className="text-muted-foreground font-body max-w-lg mx-auto">
            Experience shopping like never before with social features, smart comparison, and group savings.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link to={feature.link} className="block group">
                  <div className="border border-border rounded-lg p-8 bg-card hover:border-primary/50 transition-all duration-300 hover:glow-gold h-full">
                    <Icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                    <h3 className="font-display text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground font-body text-sm leading-relaxed mb-6">{feature.description}</p>
                    <span className="inline-flex items-center text-primary font-body font-semibold text-sm tracking-wider uppercase group-hover:gap-2 transition-all">
                      {feature.cta} →
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;

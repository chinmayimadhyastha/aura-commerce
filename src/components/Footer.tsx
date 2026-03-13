const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="text-2xl font-display font-bold text-gradient-gold mb-4">AURÈLE</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              The world's first mood-curated luxury marketplace. Where emotion meets elegance.
            </p>
          </div>
          {[
            { title: "Shop", links: ["New Arrivals", "Collections", "Shop by Mood", "Sale"] },
            { title: "Company", links: ["About Us", "Careers", "Sustainability", "Press"] },
            { title: "Support", links: ["Contact", "Shipping", "Returns", "FAQ"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-body font-semibold tracking-wider uppercase text-sm mb-4">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-muted-foreground text-sm font-body hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm font-body">
            © 2026 Aurèle. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-muted-foreground text-sm font-body hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

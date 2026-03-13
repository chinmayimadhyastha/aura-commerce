import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  mood: string;
  specs: Record<string, string>;
}

// Local image mapping for DB products
export const productImageMap: Record<string, string> = {
  "/product-1.jpg": product1,
  "/product-2.jpg": product2,
  "/product-3.jpg": product3,
  "/product-4.jpg": product4,
  "/product-5.jpg": product5,
  "/product-6.jpg": product6,
};

export const getProductImage = (imageUrl: string | null): string => {
  if (!imageUrl) return product1;
  return productImageMap[imageUrl] || imageUrl;
};

export const specLabels: Record<string, string> = {
  material: "Material",
  dimensions: "Dimensions",
  weight: "Weight",
  color: "Color",
  lining: "Lining",
  closure: "Closure",
  warranty: "Warranty",
  movement: "Movement",
  water_resistance: "Water Resistance",
  lens: "Lens",
  case: "Case",
  notes_top: "Top Notes",
  notes_heart: "Heart Notes",
  card_slots: "Card Slots",
  weave: "Weave",
  care: "Care",
};

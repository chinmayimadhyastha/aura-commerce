import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import product7 from "@/assets/product-7.jpg";
import product8 from "@/assets/product-8.jpg";
import product9 from "@/assets/product-9.jpg";
import product10 from "@/assets/product-10.jpg";
import product11 from "@/assets/product-11.jpg";
import product12 from "@/assets/product-12.jpg";
import product13 from "@/assets/product-13.jpg";
import product14 from "@/assets/product-14.jpg";
import product15 from "@/assets/product-15.jpg";
import product16 from "@/assets/product-16.jpg";
import product17 from "@/assets/product-17.jpg";
import product18 from "@/assets/product-18.jpg";

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
  "/product-7.jpg": product7,
  "/product-8.jpg": product8,
  "/product-9.jpg": product9,
  "/product-10.jpg": product10,
  "/product-11.jpg": product11,
  "/product-12.jpg": product12,
  "/product-13.jpg": product13,
  "/product-14.jpg": product14,
  "/product-15.jpg": product15,
  "/product-16.jpg": product16,
  "/product-17.jpg": product17,
  "/product-18.jpg": product18,
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
  notes_base: "Base Notes",
  card_slots: "Card Slots",
  weave: "Weave",
  care: "Care",
  driver: "Driver",
  frequency: "Frequency",
  battery: "Battery",
  connectivity: "Connectivity",
  noise_cancellation: "Noise Cancellation",
  display: "Display",
  processor: "Processor",
  storage: "Storage",
  camera: "Camera",
  sole: "Sole",
  fit: "Fit",
  laptop: "Laptop Fit",
  capacity: "Capacity",
  volume: "Volume",
  longevity: "Longevity",
  sillage: "Sillage",
  switches: "Switches",
  layout: "Layout",
  backlight: "Backlight",
  uv_protection: "UV Protection",
  sensors: "Sensors",
  buckle: "Buckle",
  width: "Width",
};

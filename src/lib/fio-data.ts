import blouse from "@/assets/item-blouse.jpg";
import trousers from "@/assets/item-trousers.jpg";
import bag from "@/assets/item-bag.jpg";
import coat from "@/assets/item-coat.jpg";
import heels from "@/assets/item-heels.jpg";
import outfit1 from "@/assets/outfit-1.jpg";
import insp1 from "@/assets/insp-1.jpg";
import insp2 from "@/assets/insp-2.jpg";
import insp3 from "@/assets/insp-3.jpg";
import insp4 from "@/assets/insp-4.jpg";
import insp5 from "@/assets/insp-5.jpg";
import insp6 from "@/assets/insp-6.jpg";

export type Item = {
  id: string;
  name: string;
  category: "Tops" | "Bottoms" | "Outerwear" | "Bags" | "Shoes";
  color: string;
  colorHex: string;
  image: string;
  aspect: "tall" | "square";
};

export const items: Item[] = [
  { id: "1", name: "Silk Shell Blouse", category: "Tops", color: "Cream", colorHex: "#FFF1DC", image: blouse, aspect: "tall" },
  { id: "2", name: "Wide-Leg Trouser", category: "Bottoms", color: "Coral", colorHex: "#FF8E72", image: trousers, aspect: "tall" },
  { id: "3", name: "Leather Carry Tote", category: "Bags", color: "Espresso", colorHex: "#3A2B28", image: bag, aspect: "tall" },
  { id: "4", name: "Pillow Wool Coat", category: "Outerwear", color: "Blush", colorHex: "#F6C7D5", image: coat, aspect: "tall" },
  { id: "5", name: "Suede Point Pump", category: "Shoes", color: "Coral", colorHex: "#FF8E72", image: heels, aspect: "tall" },
];

export const categories = ["All", "Tops", "Bottoms", "Outerwear", "Bags", "Shoes"] as const;
export const palette = [
  { name: "Cream", hex: "#FFF1DC" },
  { name: "Blush", hex: "#F6C7D5" },
  { name: "Coral", hex: "#FF8E72" },
  { name: "Espresso", hex: "#3A2B28" },
];

export const inspirations = [
  { id: "i1", image: insp1, h: 520 },
  { id: "i2", image: insp2, h: 360 },
  { id: "i3", image: insp3, h: 600 },
  { id: "i4", image: insp4, h: 440 },
  { id: "i5", image: insp5, h: 380 },
  { id: "i6", image: insp6, h: 560 },
];

export const sampleOutfit = {
  image: outfit1,
  title: "Sunday at the Gallery",
  reasoning:
    "A soft cream silk blouse anchors the look, while warm coral trousers add an editorial pulse. We balanced the saturation with espresso accessories and a blush bag — a palette pulled from your saved Pinterest moods and the warm light of late-September afternoons.",
  pieces: [items[0], items[1], items[2], items[4]],
};

export { outfit1 };

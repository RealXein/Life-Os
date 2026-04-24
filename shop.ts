export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "boost" | "consumable" | "cosmetic" | "wellness";
  rarity: "common" | "rare" | "epic" | "legendary";
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: "double-xp-1d",
    name: "Double XP — 24 hours",
    description: "All XP earned in the next 24 hours is doubled.",
    price: 250,
    category: "boost",
    rarity: "rare",
  },
  {
    id: "streak-freeze",
    name: "Streak Freeze",
    description: "Protect a habit streak for one missed day. Stackable.",
    price: 120,
    category: "consumable",
    rarity: "common",
  },
  {
    id: "focus-token",
    name: "Focus Token",
    description: "Spend during a focus session for a guaranteed extra XP boost.",
    price: 80,
    category: "consumable",
    rarity: "common",
  },
  {
    id: "calm-day",
    name: "Calm Day Pass",
    description: "Lower targets for one day with no streak penalty.",
    price: 150,
    category: "wellness",
    rarity: "common",
  },
  {
    id: "accent-pack",
    name: "Accent Color Pack",
    description: "Unlocks the full accent palette in Themes.",
    price: 200,
    category: "cosmetic",
    rarity: "rare",
  },
];

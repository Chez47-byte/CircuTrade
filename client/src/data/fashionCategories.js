export const fashionCategories = [
  {
    slug: "trendy",
    label: "Trendy",
    shortLabel: "Trend",
    description: "Fresh drops, statement silhouettes, and everyday fashion with momentum.",
    heroImage:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "vintage",
    label: "Vintage",
    shortLabel: "Vintage",
    description: "Old-world tailoring, heirloom textures, and timeless collectible wardrobe pieces.",
    heroImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "premium",
    label: "Premium",
    shortLabel: "Premium",
    description: "Luxury labels, refined finish, and polished pieces for elevated wardrobes.",
    heroImage:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "party",
    label: "Party",
    shortLabel: "Party",
    description: "After-dark dressing, standout shine, and event-ready looks made to arrive boldly.",
    heroImage:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "wedding",
    label: "Wedding",
    shortLabel: "Wedding",
    description: "Occasionwear for receptions, ceremonies, festive edits, and destination celebrations.",
    heroImage:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
  },
];

export const getFashionCategory = (slug) =>
  fashionCategories.find((category) => category.slug === slug);

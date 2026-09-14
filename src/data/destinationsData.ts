export interface DestinationData {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  longDesc: string;
  image: string;
  experienceCount: number;
  startingPrice: number;
  popularAttractions: string;
  bestTimeToVisit: string;
  featured: boolean;
}

export const DESTINATIONS_CATALOG: DestinationData[] = [
  {
    id: "dest-sigiriya",
    name: "Sigiriya & Cultural Triangle",
    slug: "sigiriya",
    shortDesc:
      "Ancient 5th-century rock citadels, gilded cave temples, and royal water gardens rising dramatically from Sri Lanka's emerald central plains.",
    longDesc:
      "The Cultural Triangle forms the cradle of ancient Sri Lankan civilization. Anchored by the UNESCO World Heritage Lion Rock Citadel of Sigiriya and the subterranean Buddhist shrines of Dambulla, this region invites travelers into an awe-inspiring world of 2,500-year-old hydraulic engineering, vibrant frescoes, and spiritual serenity.",
    image:
      "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1200&auto=format&fit=crop",
    experienceCount: 8,
    startingPrice: 85,
    popularAttractions:
      "Sigiriya Lion Rock, Dambulla Cave Temple, Pidurangala Rock, Polonnaruwa Ruins, Minneriya Elephant Gathering",
    bestTimeToVisit:
      "January to September (Dry weather, clear skies for morning fortress climb)",
    featured: true,
  },
  {
    id: "dest-ella",
    name: "Ella & Mountain Highlands",
    slug: "ella",
    shortDesc:
      "Misty mountain peaks, emerald tea estates, Nine Arches Bridge, and the world's most famous scenic blue train journey.",
    longDesc:
      "Perched high in Sri Lanka's central highlands, Ella is a tranquil mountain haven surrounded by cascading waterfalls, tea gardens, and dramatic hill passes. Famed for Little Adam's Peak, Ella Rock, and the architectural masterpiece of the colonial Nine Arches Viaduct.",
    image:
      "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
    experienceCount: 6,
    startingPrice: 65,
    popularAttractions:
      "Nine Arches Bridge, Little Adam's Peak, Ella Rock, Ravana Falls, Halpewatte Tea Factory",
    bestTimeToVisit: "January to April & June to August",
    featured: true,
  },
  {
    id: "dest-yala",
    name: "Yala Wildlife Safaris",
    slug: "yala",
    shortDesc:
      "Home to the world's highest density of leopards, wild elephants, sloth bears, and crocodiles across dramatic coastal dry zone wilderness.",
    longDesc:
      "Yala National Park is Sri Lanka's premier wildlife sanctuary, bordering the Indian Ocean in the southeast. Experienced local safari trackers navigate rugged scrubland and freshwater lagoons in 4x4 open-top jeeps in search of the elusive Ceylon leopard.",
    image:
      "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop",
    experienceCount: 5,
    startingPrice: 95,
    popularAttractions:
      "Block 1 Leopard Safari, Elephant Herd Waterholes, Sloth Bear Tracking, Kumana Bird Sanctuary",
    bestTimeToVisit:
      "February to June (Dry season provides optimal waterhole game viewing)",
    featured: true,
  },
  {
    id: "dest-galle",
    name: "Galle Dutch Fort",
    slug: "galle",
    shortDesc:
      "17th-century oceanfront ramparts, cobblestone alleys, Dutch colonial architecture, boutique villas, and tropical coastal charm.",
    longDesc:
      "Built by Portuguese and Dutch colonizers between the 16th and 17th centuries, Galle Fort is Asia's best-preserved fortified sea bastion. Stroll past whitewashed ramparts, colonial clock towers, spice merchants, and charming seaside gelato parlors.",
    image:
      "https://images.unsplash.com/photo-1566296566002-390b1062b186?q=80&w=1200&auto=format&fit=crop",
    experienceCount: 4,
    startingPrice: 45,
    popularAttractions:
      "Galle Lighthouse, Dutch Reformed Church, Sea Wall Ramparts, Maritime Museum, Unawatuna Beach",
    bestTimeToVisit: "November to April (Calm seas and warm golden sunshine)",
    featured: true,
  },
  {
    id: "dest-mirissa",
    name: "Mirissa & Southern Coast",
    slug: "mirissa",
    shortDesc:
      "Golden crescent beaches, swaying palm groves, vibrant surf breaks, and world-class blue whale expeditions in the Indian Ocean.",
    longDesc:
      "Mirissa is the jewel of Sri Lanka's southern shores. Renowned as one of the premier whale watching havens on Earth, Mirissa pairs exhilarating ocean wildlife cruises with laid-back beachside dining, snorkeling around coral reefs, and coconut tree hills overlooking sunset horizons.",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop",
    experienceCount: 5,
    startingPrice: 75,
    popularAttractions:
      "Mirissa Whale Watching, Coconut Tree Hill, Parrot Rock, Secret Beach, Weligama Bay Surfing",
    bestTimeToVisit: "November to April (Best marine visibility and calm seas)",
    featured: true,
  },
  {
    id: "dest-nuwara-eliya",
    name: "Nuwara Eliya Highlands",
    slug: "nuwara-eliya",
    shortDesc:
      "Misty colonial hill station known as 'Little England', enveloped by verdant Ceylon tea gardens, waterfalls, and cool mountain breezes.",
    longDesc:
      "Nestled in the shadows of Mount Pidurutalagala at 1,868 meters elevation, Nuwara Eliya is the heartland of world-renowned Ceylon tea. With Victorian post offices, manicured golf links, botanical gardens, and dramatic cascades like Ramboda Falls, it offers a refreshing highland retreat.",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
    experienceCount: 4,
    startingPrice: 70,
    popularAttractions:
      "Historic Tea Factory & Plucking, Lake Gregory, Ramboda Falls, Victoria Park, Pedro Tea Estate",
    bestTimeToVisit: "March to May & August to September",
    featured: true,
  },
];

export function getDestinationBySlug(slug: string): DestinationData | undefined {
  return DESTINATIONS_CATALOG.find((d) => d.slug === slug);
}

export interface TourData {
  id: string;
  title: string;
  slug: string;
  location: string;
  destinationSlug: string;
  destinationName: string;
  categorySlug: string;
  categoryName: string;
  duration: string;
  durationHours: number;
  rating: number;
  reviewCount: number;
  bookedCount: number;
  price: number;
  previousPrice?: number | null;
  childPrice: number;
  tourType: string;
  liveGuide: string;
  badge?: string;
  freeCancellation: boolean;
  instantBook: boolean;
  pickupAvailable: boolean;
  pickupLocationDefault: string;
  shortDescription: string;
  description: string;
  importantInfo?: string;
  whatToBring?: string;
  highlights: string[];
  includes: string[];
  excludes: string[];
  images: { id: string; url: string; caption: string; isPrimary: boolean }[];
  itinerary: {
    id: string;
    stepNumber: number;
    title: string;
    duration: string;
    location: string;
    description: string;
  }[];
  faq: { question: string; answer: string }[];
  reviews: {
    id: string;
    userName: string;
    userCountry: string;
    travelDate: string;
    rating: number;
    comment: string;
  }[];
}

export const TOURS_CATALOG: TourData[] = [
  {
    id: "tour-sigiriya",
    title: "Sigiriya Rock Fortress & Dambulla Cave Temple Day Tour",
    slug: "sigiriya-rock-fortress-dambulla-day-tour",
    location: "Sigiriya & Dambulla",
    destinationSlug: "sigiriya",
    destinationName: "Sigiriya & Cultural Triangle",
    categorySlug: "cultural",
    categoryName: "Cultural Heritage",
    duration: "10 Hours",
    durationHours: 10,
    rating: 4.95,
    reviewCount: 342,
    bookedCount: 520,
    price: 85,
    previousPrice: 110,
    childPrice: 55,
    tourType: "Private Tour",
    liveGuide: "English, German & French",
    badge: "Bestseller",
    freeCancellation: true,
    instantBook: true,
    pickupAvailable: true,
    pickupLocationDefault: "Hotel Lobby in Colombo, Negombo, or Kandy",
    shortDescription:
      "Climb King Kashyapa's 5th-century UNESCO Lion Rock Citadel, view ancient frescoes, and explore the golden Buddhist cave sanctuaries of Dambulla.",
    description:
      "Immerse yourself in Sri Lanka's ancient royal heritage with this full-day private journey to Sigiriya and Dambulla. Begin early to scale the magnificent 200-meter monolith of Sigiriya Lion Rock Fortress before midday heat, exploring royal water gardens, the mirror wall, and 1,500-year-old painted frescoes. Following an authentic Sri Lankan village buffet served in traditional clay pots, journey to the UNESCO-listed Dambulla Golden Cave Temples, a complex of five ancient caverns holding over 150 gilded Buddha statues and centuries of sacred ceiling murals.",
    importantInfo:
      "Modest attire covering shoulders and knees is mandatory when entering Dambulla Cave Temples. Shoes must be removed before entering sacred temple precincts (socks recommended on sunny days).",
    whatToBring:
      "Comfortable walking shoes with rubber grip, sun hat, UV sunglasses, sunscreen, camera, modest temple scarf, and refillable water bottle.",
    highlights: [
      "Scale the dramatic 200-meter monolith of Sigiriya UNESCO Lion Rock Citadel",
      "Marvel at the enigmatic 5th-century Sigiriya Maiden cliffside frescoes",
      "Explore 5 sacred subterranean cave sanctuaries of Dambulla with 150+ golden statues",
      "Savor an authentic Sri Lankan village clay pot buffet lunch in rural Hiriwadunna",
      "Travel in private air-conditioned comfort with a certified Sri Lankan chauffeur guide",
    ],
    includes: [
      "Private air-conditioned car / minivan with licensed chauffeur guide",
      "Roundtrip hotel pickup and drop-off (Colombo, Negombo, or Kandy)",
      "Traditional Sri Lankan village buffet lunch with fresh seasonal fruits",
      "Chilled bottled mineral water and fresh King Coconut refreshment",
      "Highway toll fees, parking fees, and vehicle fuel charges",
    ],
    excludes: [
      "Sigiriya Lion Rock entrance ticket ($36 USD per adult)",
      "Dambulla Royal Cave Temple entrance ticket ($10 USD per adult)",
      "Personal souvenirs and optional driver gratuities",
    ],
    images: [
      {
        id: "sig-1",
        url: "https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1200&auto=format&fit=crop",
        caption: "Sigiriya Ancient Lion Rock Citadel",
        isPrimary: true,
      },
      {
        id: "sig-2",
        url: "https://images.unsplash.com/photo-1566296566002-390b1062b186?q=80&w=1200&auto=format&fit=crop",
        caption: "Cultural Triangle Heritage",
        isPrimary: false,
      },
      {
        id: "sig-3",
        url: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
        caption: "Scenic Central Plains",
        isPrimary: false,
      },
    ],
    itinerary: [
      {
        id: "sig-it1",
        stepNumber: 1,
        title: "Morning Hotel Pickup & Countryside Drive",
        duration: "2.5 Hours",
        location: "Hotel Lobby",
        description:
          "Meet your private chauffeur guide at your hotel. Relax in air-conditioned comfort as we journey through scenic rural countryside and rubber plantations.",
      },
      {
        id: "sig-it2",
        stepNumber: 2,
        title: "Sigiriya Lion Rock Fortress Ascent",
        duration: "3 Hours",
        location: "Sigiriya",
        description:
          "Ascend through royal water gardens and ancient stone staircases to view the frescoes, pass the colossal Lion Paws, and take in panoramic summit vistas.",
      },
      {
        id: "sig-it3",
        stepNumber: 3,
        title: "Authentic Village Lunch & Cooking Demo",
        duration: "1.5 Hours",
        location: "Hiriwadunna Village",
        description:
          "Enjoy a traditional Sri Lankan clay pot feast cooked over firewood, with fresh lake fish, fragrant curries, and coconut sambal.",
      },
      {
        id: "sig-it4",
        stepNumber: 4,
        title: "Dambulla Golden Cave Monasteries",
        duration: "2 Hours",
        location: "Dambulla",
        description:
          "Explore the 2,000-year-old rock monastery sanctuaries filled with preserved Buddhist statuary and vivid ceiling murals.",
      },
      {
        id: "sig-it5",
        stepNumber: 5,
        title: "Return Hotel Transfer",
        duration: "2.5 Hours",
        location: "Return Journey",
        description:
          "Comfortable return drive to your hotel with a stop for fresh King Coconut refreshment along the way.",
      },
    ],
    faq: [
      {
        question: "Is climbing Sigiriya difficult?",
        answer:
          "There are approximately 1,200 steps to the summit. The ascent is taken at a steady pace with rest stops. Visitors with average mobility manage well; comfortable footwear is essential.",
      },
      {
        question: "Are entrance tickets included?",
        answer:
          "Entrance tickets to Sigiriya ($36) and Dambulla ($10) are purchased directly at official ticketing counters. Your chauffeur will escort and assist you.",
      },
    ],
    reviews: [
      {
        id: "rev-s1",
        userName: "Marcus Vance",
        userCountry: "United Kingdom",
        travelDate: "August 2026",
        rating: 5,
        comment:
          "Climbing Sigiriya with our guide was the undisputed highlight of our Sri Lanka vacation. Exceptionally well organized.",
      },
      {
        id: "rev-s2",
        userName: "Elena Rostova",
        userCountry: "Germany",
        travelDate: "July 2026",
        rating: 5,
        comment:
          "The private car was spotless, driving was safe and courteous, and the village lunch was truly memorable.",
      },
    ],
  },
  {
    id: "tour-ella",
    title: "Kandy to Ella Scenic Blue Train & Tea Country Trek",
    slug: "kandy-to-ella-scenic-train-journey",
    location: "Ella & Mountain Highlands",
    destinationSlug: "ella",
    destinationName: "Ella & Mountain Highlands",
    categorySlug: "adventure",
    categoryName: "Adventure & Hiking",
    duration: "1 Day (8-9 Hours)",
    durationHours: 8,
    rating: 4.98,
    reviewCount: 420,
    bookedCount: 680,
    price: 65,
    previousPrice: 85,
    childPrice: 45,
    tourType: "Scenic Small Group / Private",
    liveGuide: "English & German",
    badge: "Iconic Experience",
    freeCancellation: true,
    instantBook: true,
    pickupAvailable: true,
    pickupLocationDefault: "Kandy or Nuwara Eliya Hotel Lobby / Train Station",
    shortDescription:
      "Ride the legendary Sri Lankan blue train through cloud forests and tea plantations, then explore Nine Arches Bridge and Little Adam's Peak.",
    description:
      "Recognized universally as one of the most stunning railway journeys on planet Earth, the high-altitude train ride to Ella winds past mist-veiled mountain peaks, cascading waterfalls, and manicured emerald tea estates. We pre-secure your guaranteed reserved seats so you can relax by the open windows and capture iconic photographs. Upon arrival at Ella railway station, your local guide accompanies you through highland trails to photograph the architectural marvel of Nine Arches Bridge and complete the panoramic sunset hike to Little Adam's Peak.",
    importantInfo:
      "Train departure times are regulated by Sri Lanka Railways and may be subject to operational timetables. Reserved seat confirmation vouchers are issued directly to your booking voucher.",
    whatToBring:
      "Light sweater or windbreaker (highlands can be cool/misty), walking trainers or hiking shoes, camera with spare battery, sun protection.",
    highlights: [
      "Guaranteed pre-reserved seats on the world-famous highland blue train",
      "Marvel at infinite vistas of Ceylon tea hills, gorges, and waterfalls",
      "Walk the rails to photograph trains crossing the colonial Nine Arches Bridge",
      "Sunset trek to the panoramic ridge of Little Adam's Peak overlooking Ella Gap",
      "Visit an authentic tea plantation to observe orthodox tea processing",
    ],
    includes: [
      "Reserved train ticket (2nd or 3rd Class Reserved Seating)",
      "Private station transfers and luggage handling assistance",
      "Certified local hill-country trekking guide in Ella",
      "Guided excursion to Nine Arches Bridge and Little Adam's Peak",
      "Fresh Ceylon highland tea tasting session",
    ],
    excludes: [
      "Personal snacks & lunch along the railway route",
      "Optional flying Ravana zipline activity tickets",
      "Driver and guide tips",
    ],
    images: [
      {
        id: "ella-1",
        url: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
        caption: "Iconic Sri Lanka Blue Train crossing Nine Arches Bridge",
        isPrimary: true,
      },
      {
        id: "ella-2",
        url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop",
        caption: "Rolling Ceylon Tea Hills",
        isPrimary: false,
      },
      {
        id: "ella-3",
        url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
        caption: "Ella Gap Mountain Vistas",
        isPrimary: false,
      },
    ],
    itinerary: [
      {
        id: "ella-it1",
        stepNumber: 1,
        title: "Station Assistance & Train Boarding",
        duration: "45 Mins",
        location: "Kandy / Peradeniya Railway Station",
        description:
          "Meet your guide representative at the platform with your pre-issued reserved seat tickets and receive baggage boarding support.",
      },
      {
        id: "ella-it2",
        stepNumber: 2,
        title: "Scenic Train Ride through Central Highlands",
        duration: "4 Hours",
        location: "Kandy to Ella Highland Line",
        description:
          "Travel past St. Clair's and Devon falls, through Hatton and Nanu Oya, watching tea pickers on emerald hillsides and deep mountain passes.",
      },
      {
        id: "ella-it3",
        stepNumber: 3,
        title: "Ella Arrival & Nine Arches Bridge Walk",
        duration: "1.5 Hours",
        location: "Demodara Nine Arches Viaduct",
        description:
          "Walk through the forest path to stand beneath the colonial brick-and-stone viaduct as mountain trains roll overhead.",
      },
      {
        id: "ella-it4",
        stepNumber: 4,
        title: "Little Adam's Peak Panoramic Hike",
        duration: "1.5 Hours",
        location: "Ella Gap Ridge",
        description:
          "An easy to moderate ascent through tea trails leading to 360-degree views over Ella Rock and the southern coastal plains.",
      },
    ],
    faq: [
      {
        question: "Which side of the train has the best views?",
        answer:
          "Between Kandy and Nuwara Eliya, the right side often offers dramatic valley panoramas, while approaching Ella, the left side affords spectacular views. You can move freely to doorway observation spots.",
      },
      {
        question: "What happens to our heavy luggage during the train ride?",
        answer:
          "Our private transport handles your large suitcases separately by road directly to your Ella hotel, leaving you unencumbered with just your daypack on the train.",
      },
    ],
    reviews: [
      {
        id: "rev-e1",
        userName: "Markus Weber",
        userCountry: "Germany",
        travelDate: "July 2026",
        rating: 5,
        comment:
          "Booking reserved seats in advance was completely stress-free. The views across Nine Arches Bridge were straight out of a postcard!",
      },
    ],
  },
  {
    id: "tour-yala",
    title: "Yala National Park Leopard Safari in 4x4 Jeep",
    slug: "yala-national-park-safari",
    location: "Yala National Park",
    destinationSlug: "yala",
    destinationName: "Yala Wildlife Safaris",
    categorySlug: "wildlife",
    categoryName: "Wildlife & Safari",
    duration: "6 Hours",
    durationHours: 6,
    rating: 4.91,
    reviewCount: 285,
    bookedCount: 490,
    price: 95,
    previousPrice: 125,
    childPrice: 60,
    tourType: "Private 4x4 Safari",
    liveGuide: "English Tracker Guide",
    badge: "Wild Ceylon",
    freeCancellation: true,
    instantBook: true,
    pickupAvailable: true,
    pickupLocationDefault: "Hotel in Yala, Tissamaharama, or Kirinda",
    shortDescription:
      "Track the world's highest density of leopards, wild elephant herds, sloth bears, and saltwater crocodiles in a customized 4x4 open-top safari jeep.",
    description:
      "Yala National Park is Sri Lanka's premier wildlife sanctuary, bordering the sapphire waters of the Indian Ocean in the southern dry zone. With one of the densest populations of leopards on Earth (*Panthera pardus kotiya*), Yala delivers unmatched opportunities for dramatic predator sightings. Board your elevated, open-sided 4x4 safari vehicle equipped with all-terrain suspension. Guided by a certified local wildlife naturalist and tracker, explore Block 1's sandy tracks, waterholes, rocky outcrops, and coastal scrub.",
    importantInfo:
      "Safari departs promptly at 5:30 AM (morning session) or 2:00 PM (afternoon session) to coincide with peak animal activity hours.",
    whatToBring:
      "Camera with telephoto zoom lens, binoculars, earth-toned clothing (khaki, olive, brown), dust scarf or sunglasses, light jacket for early morning chill.",
    highlights: [
      "High probability of spotting elusive wild Sri Lankan leopards and sloth bears",
      "Watch wild elephant herds bathing in freshwater waterholes and lagoons",
      "Dedicated, open-top 4x4 safari jeep with raised spectator seating",
      "Certified wildlife tracker with deep behavioral knowledge of park territory",
      "Rest stop at the rugged Indian Ocean beachfront within the park boundaries",
    ],
    includes: [
      "Exclusive private 4x4 safari jeep hire with experienced wildlife driver",
      "Hotel pickup and drop-off in Yala, Tissamaharama, or Kataragama",
      "Licensed Sri Lanka Wildlife Department tracker guide assistance",
      "High-power binoculars for wildlife viewing",
      "Chilled bottled water and tropical fruit refreshments",
    ],
    excludes: [
      "Yala National Park entrance admission ticket ($32 USD per adult)",
      "Personal travel insurance & driver tips",
    ],
    images: [
      {
        id: "yala-1",
        url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop",
        caption: "Sri Lankan Leopard on rocky outcrop in Yala",
        isPrimary: true,
      },
      {
        id: "yala-2",
        url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200&auto=format&fit=crop",
        caption: "Wild Asian Elephant herd in Yala sanctuary",
        isPrimary: false,
      },
    ],
    itinerary: [
      {
        id: "yala-it1",
        stepNumber: 1,
        title: "Hotel Pickup in Customized 4x4 Jeep",
        duration: "30 Mins",
        location: "Hotel Lobby",
        description:
          "Board your high-clearance safari jeep before dawn or afternoon heat and journey to the Palatupana park entrance gate.",
      },
      {
        id: "yala-it2",
        stepNumber: 2,
        title: "Block 1 Game Drive & Leopard Tracking",
        duration: "3.5 Hours",
        location: "Yala National Park Block 1",
        description:
          "Traverse waterholes, dense scrub, and granite boulders in search of leopards, sloth bears, spotted deer, and elephants.",
      },
      {
        id: "yala-it3",
        stepNumber: 3,
        title: "Coastal Lagoon & Patanangala Rest Stop",
        duration: "45 Mins",
        location: "Patanangala Beach",
        description:
          "Step down onto the wild ocean coastline to stretch your legs, enjoy fresh fruit and refreshments, and watch coastal sea eagles.",
      },
      {
        id: "yala-it4",
        stepNumber: 4,
        title: "Sunset Wilderness Drive & Return Transfer",
        duration: "1.5 Hours",
        location: "Park Exit & Hotel",
        description:
          "Final tracking loop as animals converge on twilight watering holes, followed by drop-off at your hotel.",
      },
    ],
    faq: [
      {
        question: "Is morning or afternoon safari better?",
        answer:
          "Both sessions offer excellent opportunities. Morning safaris benefit from cool temperatures and early predator movement; afternoon safaris often see elephants gathering around large water reservoirs.",
      },
    ],
    reviews: [
      {
        id: "rev-y1",
        userName: "Sophie Taylor",
        userCountry: "Canada",
        travelDate: "July 2026",
        rating: 5,
        comment:
          "We saw two leopards resting on granite boulders! The driver was exceptionally patient and respectful of animal space.",
      },
    ],
  },
  {
    id: "tour-galle",
    title: "Galle Dutch Fort Walking Tour & Southern Coast Highlights",
    slug: "galle-fort-walking-tour",
    location: "Galle Dutch Fort",
    destinationSlug: "galle",
    destinationName: "Galle Dutch Fort",
    categorySlug: "cultural",
    categoryName: "Cultural Heritage",
    duration: "5 Hours",
    durationHours: 5,
    rating: 4.88,
    reviewCount: 198,
    bookedCount: 340,
    price: 45,
    previousPrice: 60,
    childPrice: 30,
    tourType: "Guided Walking & Coastal Tour",
    liveGuide: "English & Italian",
    badge: "Heritage Pick",
    freeCancellation: true,
    instantBook: true,
    pickupAvailable: true,
    pickupLocationDefault: "Hotel in Galle, Unawatuna, or Bentota",
    shortDescription:
      "Stroll the cobblestone streets and sea ramparts of Asia's best-preserved 17th-century UNESCO maritime fortress with a resident historian.",
    description:
      "Step back in time inside the 400-year-old bastions of Galle Dutch Fort, a living UNESCO World Heritage site standing proudly at the edge of the Indian Ocean. Built by the Portuguese in 1588 and fortified extensively by the Dutch East India Company throughout the 1600s, Galle Fort remains an enchanting enclave of whitewashed colonial villas, spice warehouses, jewelry ateliers, and coastal lighthouses. Accompanied by a resident heritage guide, walk the ancient sea ramparts, visit the Dutch Reformed Church, explore boutique alleyways, and watch cliff divers plunge into ocean swells at Flag Rock.",
    importantInfo:
      "This is primarily a walking tour on paved cobblestones and grassy rampart walls. Comfortable shoes and sun protection recommended.",
    whatToBring:
      "Comfortable walking shoes, sun hat, sunglasses, camera, light cotton attire, pocket money for local gelato or crafts.",
    highlights: [
      "Explore Asia's finest surviving 17th-century European fortified maritime citadel",
      "Walk the ocean ramparts from Sun Bastion to the iconic 1939 Galle Lighthouse",
      "Visit the historic Dutch Reformed Church (Groote Kerk) built in 1755",
      "Discover the Old Dutch Hospital quarter and boutique heritage artisan workshops",
      "Watch dramatic ocean sunsets from Flag Rock bastion where local cliff divers leap",
    ],
    includes: [
      "Licensed English-speaking local heritage walking guide / historian",
      "Fresh King Coconut refreshment during the walk",
      "Admission to historic Maritime Archaeology Museum",
      "Roundtrip transport from hotels in Galle or Unawatuna bay",
    ],
    excludes: [
      "Lunch, personal souvenirs, and jewelry purchases",
      "Driver and guide gratuities",
    ],
    images: [
      {
        id: "galle-1",
        url: "https://images.unsplash.com/photo-1566296566002-390b1062b186?q=80&w=1200&auto=format&fit=crop",
        caption: "Historic Galle Dutch Fort ramparts and lighthouse",
        isPrimary: true,
      },
    ],
    itinerary: [
      {
        id: "galle-it1",
        stepNumber: 1,
        title: "Old Gate & Main Rampart Welcome",
        duration: "45 Mins",
        location: "Galle Fort Main Gate",
        description:
          "Meet your guide beneath the Dutch coat of arms (VOC) at the fortress gateway for a captivating introduction to maritime trade routes.",
      },
      {
        id: "galle-it2",
        stepNumber: 2,
        title: "Colonial Churches & Dutch Quarter",
        duration: "1.5 Hours",
        location: "Church Street & Groote Kerk",
        description:
          "Walk shaded cobblestone lanes to explore ancient gravestones, British clock towers, and historic colonial mansions.",
      },
      {
        id: "galle-it3",
        stepNumber: 3,
        title: "Sea Ramparts & Galle Lighthouse Stroll",
        duration: "1.5 Hours",
        location: "Point Utrecht Bastion",
        description:
          "Follow the seaside fortifications overlooking emerald waters, passing the lighthouse and shaded tamarind trees.",
      },
      {
        id: "galle-it4",
        stepNumber: 4,
        title: "Flag Rock Sunset & Artisan Streets",
        duration: "1 Hour",
        location: "Flag Rock & Pedlar Street",
        description:
          "Watch the sunset over the Indian Ocean while enjoying artisan ice cream or browsing handwoven textiles.",
      },
    ],
    faq: [
      {
        question: "Is Galle Fort suitable for children and seniors?",
        answer:
          "Yes. The terrain is largely flat and pedestrian-friendly, with ample shaded cafe stops along the route.",
      },
    ],
    reviews: [
      {
        id: "rev-g1",
        userName: "Claire Davenport",
        userCountry: "Australia",
        travelDate: "June 2026",
        rating: 5,
        comment:
          "Our guide brought the history alive with fascinating stories of Dutch merchants and sea battles. An absolute must-do in the south.",
      },
    ],
  },
  {
    id: "tour-mirissa",
    title: "Mirissa Whale Watching & Coral Reef Snorkeling Expedition",
    slug: "mirissa-whale-watching",
    location: "Mirissa Bay & South Coast",
    destinationSlug: "mirissa",
    destinationName: "Mirissa & Southern Coast",
    categorySlug: "wildlife",
    categoryName: "Wildlife & Safari",
    duration: "4-5 Hours",
    durationHours: 5,
    rating: 4.86,
    reviewCount: 215,
    bookedCount: 390,
    price: 75,
    previousPrice: 95,
    childPrice: 45,
    tourType: "Marine Boat Expedition",
    liveGuide: "Certified Marine Naturalist",
    badge: "Ocean Adventure",
    freeCancellation: true,
    instantBook: true,
    pickupAvailable: true,
    pickupLocationDefault: "Hotel in Mirissa, Weligama, or Matara",
    shortDescription:
      "Cruise deep into the Indian Ocean continental shelf to observe blue whales, sperm whales, and leaping spinner dolphins in their natural habitat.",
    description:
      "The warm tropical waters off Mirissa on Sri Lanka's southern coast are globally celebrated as one of the world's most dependable locations for encountering the majestic Blue Whale (*Balaenoptera musculus*)—the largest creature ever known to have lived. Board a purpose-built, dual-deck passenger vessel meeting international maritime safety standards. Accompanied by a marine biologist naturalist, navigate offshore feeding grounds where deep-sea trenches bring abundant krill. Look for towering water spouts, massive flukes lifting gracefully into the horizon, and playful pods of spinner dolphins riding the bow wave.",
    importantInfo:
      "Peak whale watching season runs from November to April when sea conditions are calm. Seasickness medication is recommended 30 minutes before boarding for guests sensitive to ocean swells.",
    whatToBring:
      "Light waterproof jacket, polarized sunglasses, sun protection, camera with strap, seasickness tablets.",
    highlights: [
      "Observe colossal Blue Whales and Sperm Whales in open deep ocean waters",
      "Watch acrobatic pods of wild spinner and bottlenose dolphins jumping alongside the vessel",
      "Accompanied by an SLTDA certified marine biologist and safety crew",
      "Continental breakfast and tropical fruit served onboard during the cruise",
      "Strict compliance with international whale-watching safety distance guidelines",
    ],
    includes: [
      "Passenger cruise ticket on certified double-deck marine vessel",
      "Coast Guard approved safety life jackets for all guests",
      "Breakfast box with fresh fruit, pastries, and bottled water",
      "Certified marine naturalist guide narration",
      "Harbour pickup and drop-off in Mirissa or Weligama bay",
    ],
    excludes: [
      "Personal seasickness medication",
      "Underwater camera hire",
      "Crew gratuities",
    ],
    images: [
      {
        id: "mir-1",
        url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop",
        caption: "Southern Sri Lanka coastline and marine waters",
        isPrimary: true,
      },
    ],
    itinerary: [
      {
        id: "mir-it1",
        stepNumber: 1,
        title: "Harbour Check-in & Safety Briefing",
        duration: "30 Mins",
        location: "Mirissa Fishery Harbour",
        description:
          "Board your vessel at 6:30 AM, receive life jacket fittings, and listen to a safety briefing from our marine naturalist.",
      },
      {
        id: "mir-it2",
        stepNumber: 2,
        title: "Offshore Cruise to Continental Shelf",
        duration: "1.5 Hours",
        location: "Deep Indian Ocean",
        description:
          "Cruise 10 to 15 nautical miles offshore while enjoying breakfast and scanning the horizon for blowhole spouts.",
      },
      {
        id: "mir-it3",
        stepNumber: 3,
        title: "Whale Observation & Marine Encounters",
        duration: "2 Hours",
        location: "Feeding Grounds",
        description:
          "Witness blue whales surfacing to breathe and diving gracefully, alongside pods of hundreds of spinner dolphins.",
      },
      {
        id: "mir-it4",
        stepNumber: 4,
        title: "Return Cruise to Mirissa Harbour",
        duration: "1 Hour",
        location: "Mirissa Harbour",
        description:
          "Enjoy cold refreshments on the sun deck as we cruise back into Mirissa harbour for your hotel transfer.",
      },
    ],
    faq: [
      {
        question: "What are the chances of seeing whales?",
        answer:
          "Between November and April, sightings exceed 90%. In the rare event no whales or dolphins are spotted, we provide a free voucher for a second attempt.",
      },
    ],
    reviews: [
      {
        id: "rev-m1",
        userName: "Oliver Smith",
        userCountry: "Netherlands",
        travelDate: "March 2026",
        rating: 5,
        comment:
          "We saw three separate blue whales and a giant pod of dolphins. The crew maintained a respectful distance from the animals. Outstanding.",
      },
    ],
  },
  {
    id: "tour-nuwara-eliya",
    title: "Nuwara Eliya \"Little England\" Tea Plantation & Waterfall Trail",
    slug: "nuwara-eliya-tea-trail",
    location: "Nuwara Eliya & Hill Country",
    destinationSlug: "nuwara-eliya",
    destinationName: "Nuwara Eliya Highlands",
    categorySlug: "cultural",
    categoryName: "Cultural Heritage",
    duration: "8 Hours",
    durationHours: 8,
    rating: 4.92,
    reviewCount: 164,
    bookedCount: 290,
    price: 70,
    previousPrice: 90,
    childPrice: 45,
    tourType: "Scenic Cultural Day Tour",
    liveGuide: "English & French",
    badge: "Highland Beauty",
    freeCancellation: true,
    instantBook: true,
    pickupAvailable: true,
    pickupLocationDefault: "Hotel in Nuwara Eliya, Kandy, or Ella",
    shortDescription:
      "Experience colonial architecture, working orthodox tea factories, scenic mountain cascades, and tranquil Gregory Lake in Sri Lanka's misty hill capital.",
    description:
      "Perched nearly 2,000 meters above sea level beneath Mount Pedro, Nuwara Eliya is affectionately known as 'Little England' for its Tudor-style cottages, rose gardens, and cool mountain climate. This curated full-day journey takes you inside an operational colonial tea estate to walk between tea bushes with estate pluckers, follow the orthodox manufacturing process from withering to grading, and enjoy an expert tea sommelier tasting. Tour Gregory Lake, visit the red-brick colonial Post Office (1894), and stand beside the majestic cascading waters of Ramboda Waterfall.",
    importantInfo:
      "Temperatures in Nuwara Eliya range from 10°C to 20°C (50°F to 68°F). A light warm jacket or sweater is recommended.",
    whatToBring:
      "Warm layer / cardigan, walking shoes, umbrella or light rain shell, camera, small backpack.",
    highlights: [
      "Step inside an operational colonial orthodox tea factory founded in the 19th century",
      "Try your hand at traditional Ceylon two-leaves-and-a-bud tea plucking",
      "Savor a guided tasting of premier Ceylon Orange Pekoe and Silver Tips teas",
      "Photograph the spectacular twin drops of Ramboda Falls (109m high)",
      "Stroll past colonial landmark buildings including the 1894 Victorian Post Office",
    ],
    includes: [
      "Private air-conditioned mountain vehicle with certified chauffeur guide",
      "Tea factory admission, guided manufacturing walkthrough & tasting session",
      "Hotel pickup and drop-off in Nuwara Eliya or Kandy",
      "Bottled mineral water and fresh King Coconut",
    ],
    excludes: [
      "Lunch at colonial hill country restaurant",
      "Optional Gregory Lake boat ride ticket",
      "Gratuities for guide and tea pluckers",
    ],
    images: [
      {
        id: "nuw-1",
        url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
        caption: "Misty tea estates and hills of Nuwara Eliya",
        isPrimary: true,
      },
      {
        id: "nuw-2",
        url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop",
        caption: "Highland tea plucking in Ceylon hills",
        isPrimary: false,
      },
    ],
    itinerary: [
      {
        id: "nuw-it1",
        stepNumber: 1,
        title: "Hotel Pickup & Mountain Scenic Drive",
        duration: "1.5 Hours",
        location: "Hotel Lobby",
        description:
          "Ascend winding mountain passes through pine forests and cloud cover toward the central highland plateau.",
      },
      {
        id: "nuw-it2",
        stepNumber: 2,
        title: "Ramboda Falls & Valley Viewpoint",
        duration: "1 Hour",
        location: "Ramboda Waterfall",
        description:
          "Stop at the viewpoint overlooking the thundering 109-meter cascade and lush surrounding emerald valleys.",
      },
      {
        id: "nuw-it3",
        stepNumber: 3,
        title: "Colonial Tea Estate & Factory Tasting",
        duration: "2.5 Hours",
        location: "Historic Tea Estate",
        description:
          "Walk the estate terraces, observe orthodox drying and rolling machinery, and enjoy a guided tea sommelier tasting.",
      },
      {
        id: "nuw-it4",
        stepNumber: 4,
        title: "Little England Heritage Walk & Gregory Lake",
        duration: "2 Hours",
        location: "Nuwara Eliya Town",
        description:
          "Explore the 1894 Post Office, Victorian parks, and take a peaceful stroll around Lake Gregory before return transfer.",
      },
    ],
    faq: [
      {
        question: "Can we purchase freshly packed tea at the factory?",
        answer:
          "Yes! The factory boutique offers authentic Single Estate Ceylon teas packed immediately after production.",
      },
    ],
    reviews: [
      {
        id: "rev-n1",
        userName: "Hannah Lindqvist",
        userCountry: "Sweden",
        travelDate: "May 2026",
        rating: 5,
        comment:
          "Fascinating to learn how genuine Ceylon tea is produced. Nuwara Eliya is surprisingly cool and utterly charming.",
      },
    ],
  },
];

export function getTourBySlug(slug: string): TourData | undefined {
  return TOURS_CATALOG.find((t) => t.slug === slug);
}

export function getToursByDestination(destSlug: string): TourData[] {
  return TOURS_CATALOG.filter((t) => t.destinationSlug === destSlug);
}

export function getToursByCategory(catSlug: string): TourData[] {
  return TOURS_CATALOG.filter((t) => t.categorySlug === catSlug);
}

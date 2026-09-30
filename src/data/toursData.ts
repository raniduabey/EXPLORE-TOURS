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
        id: "img-sig-1",
        url: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop",
        caption: "King Kashyapa 5th-century UNESCO Sigiriya Lion Rock Citadel",
        isPrimary: true,
      },
      {
        id: "img-sig-2",
        url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop",
        caption: "Panoramic vista of Sigiriya Rock from summit of Pidurangala",
        isPrimary: false,
      },
      {
        id: "img-sig-3",
        url: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=1200&auto=format&fit=crop",
        caption: "Sacred Golden Cave Temples and gilded Buddha statues of Dambulla",
        isPrimary: false,
      },
      {
        id: "img-sig-4",
        url: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200&auto=format&fit=crop",
        caption: "Ancient Royal Water Gardens and hydraulic pools of Sigiriya",
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
        id: "img-ella-1",
        url: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
        caption: "Iconic colonial Nine Arch Viaduct bridge nestled in Ella mountains",
        isPrimary: true,
      },
      {
        id: "img-ella-2",
        url: "https://images.unsplash.com/photo-1589802829985-817e51171b92?q=80&w=1200&auto=format&fit=crop",
        caption: "World-famous scenic blue train crossing through misty tea valleys",
        isPrimary: false,
      },
      {
        id: "img-ella-3",
        url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop",
        caption: "Panoramic mountain trail hiking up Little Adam's Peak at sunrise",
        isPrimary: false,
      },
      {
        id: "img-ella-4",
        url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop",
        caption: "Open-door carriage view of lush highlands from the scenic train",
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
        id: "img-yala-1",
        url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop",
        caption: "Wild Sri Lankan Leopard resting on granite rocks in Yala National Park",
        isPrimary: true,
      },
      {
        id: "img-yala-2",
        url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1200&auto=format&fit=crop",
        caption: "Wild Asian Elephant herd bathing in a freshwater safari reservoir",
        isPrimary: false,
      },
      {
        id: "img-yala-3",
        url: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=1200&auto=format&fit=crop",
        caption: "Customized 4x4 open-top game drive jeep tracking wildlife in Yala",
        isPrimary: false,
      },
      {
        id: "img-yala-4",
        url: "https://images.unsplash.com/photo-1547970810-dc1eac37d174?q=80&w=1200&auto=format&fit=crop",
        caption: "Elephant family herd traversing coastal dry zone scrublands",
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
        id: "img-galle-1",
        url: "https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?q=80&w=1200&auto=format&fit=crop",
        caption: "Historic Galle Fort Lighthouse surrounded by palm trees and ocean",
        isPrimary: true,
      },
      {
        id: "img-galle-2",
        url: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=1200&auto=format&fit=crop",
        caption: "17th-century Dutch colonial sea ramparts and bastions overlooking the Indian Ocean",
        isPrimary: false,
      },
      {
        id: "img-galle-3",
        url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
        caption: "Traditional stilt fishermen balancing on wooden poles in Weligama Bay",
        isPrimary: false,
      },
      {
        id: "img-galle-4",
        url: "https://images.unsplash.com/photo-1518467166778-b88f373ffec7?q=80&w=1200&auto=format&fit=crop",
        caption: "Green sea turtle at Kosgoda Sea Turtle Conservation Project",
        isPrimary: false,
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
        id: "img-mir-1",
        url: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?q=80&w=1200&auto=format&fit=crop",
        caption: "Majestic Blue Whale fluke diving into deep waters off Mirissa",
        isPrimary: true,
      },
      {
        id: "img-mir-2",
        url: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop",
        caption: "Golden crescent shores and turquoise waters of Mirissa Beach",
        isPrimary: false,
      },
      {
        id: "img-mir-3",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
        caption: "Sunset viewpoint from iconic Coconut Tree Hill overlooking Mirissa Bay",
        isPrimary: false,
      },
      {
        id: "img-mir-4",
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=1200&auto=format&fit=crop",
        caption: "Pods of playful spinner dolphins leaping in the Indian Ocean",
        isPrimary: false,
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
        id: "img-nuw-1",
        url: "https://images.unsplash.com/photo-1576085898323-218337e3e43c?q=80&w=1200&auto=format&fit=crop",
        caption: "Lush green Ceylon tea estate and traditional tea plucking in Nuwara Eliya",
        isPrimary: true,
      },
      {
        id: "img-nuw-2",
        url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format&fit=crop",
        caption: "Spectacular cascading double falls of Ramboda Waterfall (109m)",
        isPrimary: false,
      },
      {
        id: "img-nuw-3",
        url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop",
        caption: "Misty mountain valleys and emerald tea plantations of Little England",
        isPrimary: false,
      },
      {
        id: "img-nuw-4",
        url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop",
        caption: "Highland mountain pass panorama in central Sri Lanka",
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
  {
    id: "tour-6day-highlights",
    title: "6-Day Sri Lanka Highlights & Golden Triangle Tour",
    slug: "6-day-sri-lanka-highlights-golden-triangle-tour",
    location: "Colombo, Sigiriya, Kandy, Ella, Yala & Mirissa",
    destinationSlug: "sigiriya",
    destinationName: "Cultural Triangle & Highlands",
    categorySlug: "multiday",
    categoryName: "Multi-Day Tour Packages",
    duration: "6 Days / 5 Nights",
    durationHours: 144,
    rating: 4.96,
    reviewCount: 168,
    bookedCount: 312,
    price: 365,
    previousPrice: 450,
    childPrice: 220,
    tourType: "Private Tour Package",
    liveGuide: "English, German & French",
    badge: "Top Rated Package",
    freeCancellation: true,
    instantBook: true,
    pickupAvailable: true,
    pickupLocationDefault: "Bandaranaike International Airport (CMB) or any Hotel in Colombo / Negombo",
    shortDescription:
      "The quintessential 6-day private circuit: scale Sigiriya Lion Rock, explore Dambulla caves, sacred Kandy, misty Ella mountain ridges, Yala leopard safari, and Mirissa blue whales.",
    description:
      "Designed for travelers seeking the very best of Sri Lanka in a comfortable, fast-paced private journey. Across 6 days, you will journey from the cultural treasures of the ancient Cultural Triangle (Sigiriya & Dambulla) to the sacred hill capital of Kandy, travel through tea-carpeted mountains into dramatic Ella, embark on a private 4x4 leopard game drive in Yala National Park, and conclude on the palm-fringed southern coast with a sunrise blue whale watching cruise.",
    importantInfo:
      "Modest attire covering shoulders and knees is strictly required for Dambulla Cave Temples and Kandy Temple of the Tooth. Comfortable walking footwear is advised for Sigiriya Lion Rock climb and Little Adam's Peak hike.",
    whatToBring:
      "Comfortable light cotton clothing, walking shoes or sneakers, sun hat, UV sunglasses, sunscreen, camera, light jacket for Nuwara Eliya / Ella evening breezes, and modest temple attire.",
    highlights: [
      "Climb King Kashyapa's 5th-century UNESCO Sigiriya Lion Rock Fortress citadel",
      "Explore the 5 golden subterranean cave sanctuaries of Dambulla with 150+ Buddha statues",
      "Witness sacred evening reverence at the Temple of the Sacred Tooth Relic in Kandy",
      "Hike to Little Adam's Peak and photograph the colonial architectural icon Demodara Nine Arches Bridge",
      "Thrilling private 4x4 open-top jeep safari in Yala National Park tracking leopards & wild elephants",
      "Early morning ocean cruise off Mirissa searching for majestic blue whales and spinner dolphins",
      "Stroll the cobbled ramparts of UNESCO-listed 17th-century Dutch Galle Fort",
    ],
    includes: [
      "Private dedicated air-conditioned modern vehicle with licensed English-speaking chauffeur guide",
      "5 nights handpicked 3-star/4-star hotel & eco-resort accommodations with daily breakfast",
      "Airport pickup and final drop-off at CMB Airport or Colombo/Negombo hotel",
      "All vehicle fuel charges, expressway tolls, driver accommodation & parking fees",
      "Chilled bottled water provided throughout the private journey",
      "Traditional Kandyan cultural dance performance ticket",
      "Madu River mangrove boat safari through cinnamon islands and river channels",
    ],
    excludes: [
      "National park and cultural site entrance tickets (Sigiriya, Dambulla, Yala jeep entrance)",
      "Whale watching boat cruise ticket ($65 USD per person)",
      "Lunches and dinners (chauffeur guide will recommend authentic local restaurants)",
      "Personal expenses and tips for guides / drivers",
    ],
    images: [
      {
        id: "img-6d-1",
        url: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop",
        caption: "Sunrise at UNESCO Sigiriya Lion Rock Fortress Citadel",
        isPrimary: true,
      },
      {
        id: "img-6d-2",
        url: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
        caption: "Demodara Nine Arch Bridge in misty Ella highlands",
        isPrimary: false,
      },
      {
        id: "img-6d-3",
        url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop",
        caption: "Ceylon Leopard prowling through Yala National Park scrubland",
        isPrimary: false,
      },
      {
        id: "img-6d-4",
        url: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=1200&auto=format&fit=crop",
        caption: "Galle Dutch Fort lighthouse and colonial ocean bastions",
        isPrimary: false,
      },
    ],
    itinerary: [
      {
        id: "itin-6d-1",
        stepNumber: 1,
        title: "Day 1: Airport / Colombo to Sigiriya via Dambulla Caves",
        duration: "Full Day",
        location: "Colombo to Sigiriya",
        description:
          "Warm welcome by your private chauffeur guide at Colombo Airport (CMB) or your hotel. Journey across scenic rural landscapes into the Cultural Triangle. Ascend to the UNESCO Golden Cave Temple at Dambulla, admiring five ancient cavern sanctuaries adorned with 2,000-year-old murals and 150 golden Buddha statues. Arrive in Sigiriya for evening relaxation or an optional Minneriya elephant gathering safari.",
      },
      {
        id: "itin-6d-2",
        stepNumber: 2,
        title: "Day 2: Sigiriya Lion Rock Citadel to Royal Kandy",
        duration: "Full Day",
        location: "Sigiriya to Kandy",
        description:
          "Beat the morning heat to conquer the 1,200 steps of Sigiriya Lion Rock Fortress, exploring King Kashyapa's water gardens, Mirror Wall, and ancient fresco maidens. En route to Kandy, visit the 8th-century Nalanda Gedige temple and a fragrant spice garden in Matale. In Kandy, explore the Temple of the Sacred Tooth Relic and attend a vibrant Kandyan cultural dance performance.",
      },
      {
        id: "itin-6d-3",
        stepNumber: 3,
        title: "Day 3: Kandy to Ella via Ramboda Falls & Tea Country",
        duration: "Full Day",
        location: "Kandy to Ella",
        description:
          "Tour the sprawling Peradeniya Royal Botanic Gardens before ascending into misty hill country. Stop at cascading Ramboda Falls and tour an authentic tea factory to witness orthodox black tea manufacturing with private tasting. Arrive in tranquil Ella village and hike up Little Adam's Peak for panoramic sunset views across Ella Gap.",
      },
      {
        id: "itin-6d-4",
        stepNumber: 4,
        title: "Day 4: Nine Arches Bridge to Yala Leopard Safari",
        duration: "Full Day",
        location: "Ella to Tissamaharama / Yala",
        description:
          "Morning walk to photograph the world-famous Demodara Nine Arches Bridge nestled amidst dense jungle valleys. Descend from highlands past Ravana Falls and ancient Buduruwagala rock carvings to Tissamaharama. Board an open-top 4x4 jeep for an exhilarating afternoon game drive in Yala National Park, tracking wild leopards, elephants, sloth bears, and crocodiles.",
      },
      {
        id: "itin-6d-5",
        stepNumber: 5,
        title: "Day 5: Yala to Mirissa & Galle Dutch Fort Heritage",
        duration: "Full Day",
        location: "Tissamaharama to Mirissa",
        description:
          "Travel along the scenic southern coastline. Visit the Kosgoda Sea Turtle Conservation Project and embark on a serene boat safari through Madu River mangrove tunnels. In the afternoon, take a guided walk along the UNESCO-listed ramparts of Galle Dutch Fort, discovering colonial Portuguese and Dutch architecture, art boutiques, and the historic lighthouse.",
      },
      {
        id: "itin-6d-6",
        stepNumber: 6,
        title: "Day 6: Sunrise Mirissa Blue Whale Cruise to Airport",
        duration: "Full Day",
        location: "Mirissa to Colombo Airport",
        description:
          "Early morning departure from Mirissa Port for a thrilling whale watching expedition into deep Indian Ocean waters, spotting giant blue whales, sperm whales, and leaping dolphin pods. Return to shore, freshen up, and enjoy a comfortable private highway transfer back to Colombo or Bandaranaike International Airport for your departing flight.",
      },
    ],
    faq: [
      {
        question: "Is this a private tour or group tour?",
        answer:
          "This is an entirely private tour exclusively for you and your travelling companions. Your itinerary and pace are tailored to your preferences.",
      },
      {
        question: "Can we customize this 6-day package?",
        answer:
          "Yes! We can swap destinations, upgrade hotel categories to 5-star luxury, or add scenic train rides upon request.",
      },
    ],
    reviews: [
      {
        id: "rev-6d-1",
        userName: "Marcus Weber",
        userCountry: "Germany",
        travelDate: "July 2026",
        rating: 5,
        comment:
          "An unbelievable 6 days! Our chauffeur guide was knowledgeable, safe, and made sure we beat every crowd at Sigiriya and Yala. Seeing both leopards and blue whales in one week was unforgettable.",
      },
    ],
  },
  {
    id: "tour-8day-splendour",
    title: "8-Day Splendour of Sri Lanka Classical Circuit",
    slug: "8-day-splendour-of-sri-lanka-classical-circuit",
    location: "Negombo, Sigiriya, Kandy, Nuwara Eliya, Ella, Yala & Mirissa",
    destinationSlug: "sigiriya",
    destinationName: "Cultural Triangle & Highlands",
    categorySlug: "multiday",
    categoryName: "Multi-Day Tour Packages",
    duration: "8 Days / 7 Nights",
    durationHours: 192,
    rating: 4.98,
    reviewCount: 215,
    bookedCount: 438,
    price: 430,
    previousPrice: 540,
    childPrice: 260,
    tourType: "Private Tour Package",
    liveGuide: "English, German, French & Italian",
    badge: "Bestseller Circuit",
    freeCancellation: true,
    instantBook: true,
    pickupAvailable: true,
    pickupLocationDefault: "Bandaranaike International Airport (CMB) or any Hotel in Colombo / Negombo",
    shortDescription:
      "The ultimate 8-day classical voyage: Sigiriya Citadel, Dambulla Cave Sanctuaries, Temple of the Tooth, Nuwara Eliya tea carpet, iconic scenic blue train, Yala safari, and Galle Fort.",
    description:
      "The Splendour of Sri Lanka 8-Day tour is our most acclaimed classical holiday itinerary, offering the perfect blend of world heritage, cool misty highlands, exhilarating wildlife encounters, and tropical coastal relaxation. Travel in complete comfort in a private air-conditioned vehicle with a certified guide, staying in charming handpicked accommodations with daily breakfast. Features the world-famous highland train journey from Nanu Oya to Ella and a private 4x4 safari in Yala.",
    importantInfo:
      "Modest attire covering shoulders and knees is mandatory for all Buddhist sacred sites (Dambulla, Kandy Temple of the Tooth). Shoes must be removed before entering temple compounds.",
    whatToBring:
      "Walking shoes, light breathable clothes, a sweater/jacket for cool Nuwara Eliya evenings, sun protection (hat, sunglasses, sunscreen), camera, and modest clothing for temples.",
    highlights: [
      "Climb 5th-century Sigiriya UNESCO Lion Rock Fortress Citadel and marvel at ancient royal frescoes",
      "Explore 5 gilded subterranean cave sanctuaries at UNESCO Dambulla Golden Temple",
      "Witness sacred evening ceremonies at the Temple of the Sacred Tooth Relic in Kandy",
      "Tour lush Nuwara Eliya tea estates, waterfalls, and colonial landmarks in 'Little England'",
      "Experience the world's most scenic blue train ride through misty mountain passes into Ella",
      "Hike to Little Adam's Peak and photograph Demodara Nine Arches colonial railway bridge",
      "Thrilling private 4x4 jeep safari in Yala National Park tracking leopards and wild elephants",
      "Sunset views from Coconut Tree Hill and leisure on the golden sands of Mirissa Beach",
      "Guided stroll along the 17th-century ramparts of UNESCO World Heritage Galle Dutch Fort",
    ],
    includes: [
      "7 nights quality 3-star/4-star hotel accommodations with daily breakfast",
      "Private modern air-conditioned vehicle with licensed English-speaking chauffeur guide",
      "Roundtrip airport transfers from CMB International Airport or Colombo / Negombo",
      "Reserved seats on the world-famous scenic mountain blue train (Nanu Oya to Ella)",
      "All vehicle fuel, expressway tolls, highway charges, driver accommodation & parking fees",
      "Chilled bottled mineral water throughout the entire private tour",
      "Traditional Kandyan cultural dance performance tickets",
    ],
    excludes: [
      "Monuments & National Park entry tickets (Sigiriya, Dambulla, Tooth Temple, Yala jeep entry)",
      "Optional activities: Whale watching boat tour, Minneriya elephant safari, Gregory Lake boating",
      "Lunches and dinners (your guide will recommend high-standard hygienic local restaurants)",
      "Personal travel insurance, alcoholic beverages, and discretionary tips",
    ],
    images: [
      {
        id: "img-8d-1",
        url: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
        caption: "Scenic Blue Train Crossing Demodara Nine Arch Bridge in Ella",
        isPrimary: true,
      },
      {
        id: "img-8d-2",
        url: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop",
        caption: "Ancient Sigiriya Lion Rock Fortress rising dramatically above the jungle",
        isPrimary: false,
      },
      {
        id: "img-8d-3",
        url: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop",
        caption: "Emerald green tea plantation carpet in Nuwara Eliya highlands",
        isPrimary: false,
      },
      {
        id: "img-8d-4",
        url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop",
        caption: "Private 4x4 Leopard Safari in Yala National Park",
        isPrimary: false,
      },
      {
        id: "img-8d-5",
        url: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=1200&auto=format&fit=crop",
        caption: "Colonial ramparts and ocean lighthouse at Galle Fort",
        isPrimary: false,
      },
    ],
    itinerary: [
      {
        id: "itin-8d-1",
        stepNumber: 1,
        title: "Day 1: Airport / Negombo to Sigiriya via Dambulla Golden Temple",
        duration: "Full Day",
        location: "Negombo to Sigiriya",
        description:
          "Arrive at Bandaranaike International Airport where your chauffeur guide greets you warmly. Depart for the central cultural heartland. In the afternoon, ascend the stone staircase to Dambulla Golden Cave Temple, a complex of five ancient monastic caves containing 150+ Buddha sculptures and ceiling frescoes dating back over two millennia. Check in to your Sigiriya resort.",
      },
      {
        id: "itin-8d-2",
        stepNumber: 2,
        title: "Day 2: Sigiriya Lion Rock Citadel to Royal City of Kandy",
        duration: "Full Day",
        location: "Sigiriya to Kandy",
        description:
          "Early morning climb up the 5th-century UNESCO Sigiriya Rock Citadel to explore King Kashyapa's sky palace ruins, Lion Gate, and ancient fresco maidens before the heat sets in. Travel south to Kandy, stopping at the 8th-century Nalanda Gedige and a spice plantation in Matale. In Kandy, witness the evening veneration pooja at the Temple of the Sacred Tooth Relic.",
      },
      {
        id: "itin-8d-3",
        stepNumber: 3,
        title: "Day 3: Kandy to Nuwara Eliya 'Little England' Tea Country",
        duration: "Full Day",
        location: "Kandy to Nuwara Eliya",
        description:
          "Explore the renowned Peradeniya Royal Botanical Gardens, home to over 4,000 plant species and grand royal palm avenues. Ascend winding mountain roads into the central highlands, stopping at dramatic Ramboda Waterfalls and visiting a premier tea plantation to discover the art of hand-picking and black tea processing with fresh tasting.",
      },
      {
        id: "itin-8d-4",
        stepNumber: 4,
        title: "Day 4: Scenic Blue Train from Nanu Oya to Ella Highlands",
        duration: "Full Day",
        location: "Nuwara Eliya to Ella",
        description:
          "Board the world-famous highland blue train at Nanu Oya station for a breathtaking 3-hour journey through misty eucalyptus forests, rolling tea hills, and dramatic ravines into Ella. After hotel check-in, embark on a scenic hike up Little Adam's Peak for sweeping 360-degree views of Ella Gap.",
      },
      {
        id: "itin-8d-5",
        stepNumber: 5,
        title: "Day 5: Demodara Nine Arch Bridge to Yala Leopard Safari",
        duration: "Full Day",
        location: "Ella to Tissamaharama / Yala",
        description:
          "Stroll along jungle trails to the iconic Demodara Nine Arches Bridge to photograph trains curving gracefully along the colonial stone viaduct. Descend to the southern plains past roaring Ravana Falls. In the afternoon, board an open 4x4 safari jeep for a wildlife game drive in Yala National Park, tracking leopards, elephants, sloth bears, and crocodiles.",
      },
      {
        id: "itin-8d-6",
        stepNumber: 6,
        title: "Day 6: Tissamaharama to Mirissa Tropical Coastline",
        duration: "Full Day",
        location: "Tissamaharama to Mirissa",
        description:
          "Enjoy a leisurely morning exploring Tissamaharama Lake birdlife before driving west along the golden southern coastline. Arrive in Mirissa, check in to your beach resort, and relax by the Indian Ocean waves or enjoy fresh seafood by candlelit beachfront tables.",
      },
      {
        id: "itin-8d-7",
        stepNumber: 7,
        title: "Day 7: Mirissa Blue Whale Watching & Coconut Tree Hill",
        duration: "Full Day",
        location: "Mirissa",
        description:
          "Optional sunrise boat cruise into the deep ocean off Mirissa to encounter magnificent blue whales, sperm whales, and spinner dolphins. In the afternoon, explore the iconic viewpoint of Coconut Tree Hill and secluded Secret Beach, watching an enchanting sunset over the turquoise bay.",
      },
      {
        id: "itin-8d-8",
        stepNumber: 8,
        title: "Day 8: Mirissa to Galle Dutch Fort, Turtle Sanctuary & Airport",
        duration: "Full Day",
        location: "Mirissa to Colombo Airport",
        description:
          "Visit the historic UNESCO World Heritage Galle Dutch Fort, walking along 400-year-old bastions and charming colonial cobblestone lanes. Continue northward to visit a Sea Turtle Conservation Project and take an optional boat safari on the Madu River mangrove estuary before your transfer along the southern expressway to Colombo or CMB Airport.",
      },
    ],
    faq: [
      {
        question: "Are train tickets included and guaranteed?",
        answer:
          "Yes! We arrange reserved seats on the scenic hill country blue train from Nanu Oya to Ella. If train operations are suspended by Sri Lanka Railways, private luxury road transfer is provided.",
      },
      {
        question: "Can we book extra nights on the beach?",
        answer:
          "Absolutely! You can easily extend your stay in Mirissa, Bentota, or Tangalle. Simply let us know your preferred dates.",
      },
    ],
    reviews: [
      {
        id: "rev-8d-1",
        userName: "Claire & James Thornton",
        userCountry: "United Kingdom",
        travelDate: "August 2026",
        rating: 5,
        comment:
          "The 8-day tour was absolute perfection. The blue train ride through tea country was surreal, and we were lucky enough to see two leopards in Yala! Our driver guide made the entire experience seamless and stress-free.",
      },
    ],
  },
  {
    id: "tour-14day-grand",
    title: "14-Day Sri Lanka All-in-One Classic Grand Tour",
    slug: "14-day-sri-lanka-all-in-one-classic-grand-tour",
    location: "Negombo, Anuradhapura, Polonnaruwa, Sigiriya, Kandy, Nuwara Eliya, Ella, Yala & Bentota",
    destinationSlug: "sigiriya",
    destinationName: "Complete Sri Lanka Circuit",
    categorySlug: "multiday",
    categoryName: "Multi-Day Tour Packages",
    duration: "14 Days / 13 Nights",
    durationHours: 336,
    rating: 4.97,
    reviewCount: 184,
    bookedCount: 289,
    price: 1050,
    previousPrice: 1280,
    childPrice: 650,
    tourType: "Comprehensive Grand Tour",
    liveGuide: "English, German, French & Spanish",
    badge: "Most Comprehensive",
    freeCancellation: true,
    instantBook: true,
    pickupAvailable: true,
    pickupLocationDefault: "Bandaranaike International Airport (CMB) or any Hotel in Colombo / Negombo",
    shortDescription:
      "A grand 14-day odyssey uncovering the ancient kingdoms of Anuradhapura & Polonnaruwa, Sigiriya Lion Rock, Kandy, Horton Plains, tea highlands, scenic train, Yala safari, Mirissa whales, and Bentota beach.",
    description:
      "The definitive Sri Lanka grand tour. Over two unforgettable weeks, discover why Marco Polo called Sri Lanka the finest island of its size in the world. Traverse ancient 2,500-year-old royal kingdoms, scale fortress monoliths, hike the cloud forests of Horton Plains to World's End, ride the world-renowned blue train, track wild leopards in Yala, sail alongside ocean blue whales, and unwind at luxury beachfront resorts on the golden south coast.",
    importantInfo:
      "Temple entry rules require modest clothing covering shoulders and knees. A jacket or fleece is recommended for chilly early mornings at Horton Plains (World's End trek).",
    whatToBring:
      "Comfortable trekking shoes, warm fleece/jacket for highlands, light summer clothes, swimwear, sun hat, UV sunglasses, high-SPF sunscreen, camera with telephoto lens for safaris, and modest temple attire.",
    highlights: [
      "Sacred ancient capital of Anuradhapura: 2,300-year-old Jaya Sri Maha Bodhi tree & white stupas",
      "Royal ruins of 12th-century Polonnaruwa and Gal Vihara monumental carved Buddha statues",
      "Private 4x4 elephant safari at Minneriya National Park during the legendary gathering",
      "Climb 5th-century Sigiriya UNESCO Lion Rock Citadel and explore Dambulla Cave Temples",
      "Temple of the Sacred Tooth Relic and authentic Kandyan cultural dance performance",
      "Trek Horton Plains National Park through cloud forests to the dramatic 880m World's End drop",
      "Iconic mountain blue train ride from Nanu Oya to Ella through tea plantations and viaducts",
      "Hike Little Adam's Peak and walk across the colonial architectural marvel Nine Arches Bridge",
      "Exciting dawn and afternoon leopard safari drives in Yala National Park",
      "Sunrise ocean cruise off Mirissa observing magnificent wild blue whales and spinner dolphins",
      "Walk the 17th-century ramparts of UNESCO-listed Galle Dutch Fort and visit sea turtle hatcheries",
      "Bentota beach leisure, water sports, and tranquil boat safari through Madu River mangrove estuary",
    ],
    includes: [
      "13 nights handpicked 3-star/4-star boutique hotels & eco-resorts with daily breakfast",
      "Private modern air-conditioned vehicle with dedicated licensed chauffeur guide for all 14 days",
      "Roundtrip CMB Airport transfers and all inter-city highway expressway toll fees",
      "Reserved seats on the world-famous scenic mountain blue train (Nanu Oya to Ella)",
      "Madu River mangrove boat safari through cinnamon peeling islands and river channels",
      "Traditional Kandyan cultural dance performance tickets in Kandy",
      "Unlimited chilled bottled mineral water and complimentary fresh tropical fruits",
    ],
    excludes: [
      "Heritage and National Park entrance tickets (Anuradhapura, Polonnaruwa, Sigiriya, Dambulla, Horton Plains, Yala)",
      "Optional safari jeeps & whale watching boat tickets",
      "Lunches and dinners (your personal chauffeur guide will recommend verified hygienic restaurants)",
      "Personal expenses, alcoholic beverages, and discretionary gratuities",
    ],
    images: [
      {
        id: "img-14d-1",
        url: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1200&auto=format&fit=crop",
        caption: "Sacred Ruwanwelisaya Stupa in ancient kingdom of Anuradhapura",
        isPrimary: true,
      },
      {
        id: "img-14d-2",
        url: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop",
        caption: "Sigiriya UNESCO Lion Rock Citadel aerial vista",
        isPrimary: false,
      },
      {
        id: "img-14d-3",
        url: "https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?q=80&w=1200&auto=format&fit=crop",
        caption: "Wild elephant gathering in Minneriya National Park reservoir",
        isPrimary: false,
      },
      {
        id: "img-14d-4",
        url: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
        caption: "Scenic Highland Blue Train curving across Nine Arches Bridge in Ella",
        isPrimary: false,
      },
      {
        id: "img-14d-5",
        url: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop",
        caption: "Sri Lankan Leopard in Yala National Park",
        isPrimary: false,
      },
      {
        id: "img-14d-6",
        url: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=1200&auto=format&fit=crop",
        caption: "Sunset at Galle Dutch Fort historic lighthouse and bastions",
        isPrimary: false,
      },
    ],
    itinerary: [
      {
        id: "itin-14d-1",
        stepNumber: 1,
        title: "Day 1: Arrival & Coastal Welcome in Negombo",
        duration: "Full Day",
        location: "Negombo",
        description:
          "Warm welcome at Bandaranaike International Airport by your private chauffeur guide. Transfer to your beachside hotel in Negombo. Spend the afternoon unwinding by the pool or exploring the bustling Negombo fish market, Dutch canals, and golden sands.",
      },
      {
        id: "itin-14d-2",
        stepNumber: 2,
        title: "Day 2: Negombo to Sacred Ancient Kingdom of Anuradhapura",
        duration: "Full Day",
        location: "Negombo to Anuradhapura",
        description:
          "Journey north to Sri Lanka's oldest ancient capital, Anuradhapura (founded 5th century BC). Visit the sacred Jaya Sri Maha Bodhi (the world's oldest historically documented tree), the monumental white dome of Ruwanwelisaya, and ancient royal hydraulic reservoirs.",
      },
      {
        id: "itin-14d-3",
        stepNumber: 3,
        title: "Day 3: Polonnaruwa Royal Ruins & Minneriya Elephant Safari",
        duration: "Full Day",
        location: "Anuradhapura to Polonnaruwa & Sigiriya",
        description:
          "Explore the 12th-century medieval capital of Polonnaruwa, admiring the royal palace ruins and the colossal granite Buddha statues of Gal Vihara. In the afternoon, embark on an open 4x4 safari in Minneriya National Park to witness wild elephant herds gathering around the historic reservoir.",
      },
      {
        id: "itin-14d-4",
        stepNumber: 4,
        title: "Day 4: Sigiriya Rock Citadel & Dambulla Caves to Kandy",
        duration: "Full Day",
        location: "Sigiriya to Kandy",
        description:
          "Conquer the 200m vertical rock of Sigiriya Lion Rock Fortress, taking in King Kashyapa's royal summit palace ruins. Continue to Dambulla to explore five sacred Buddhist cave temples. Stop at a fragrant Matale spice garden before reaching the royal hill capital of Kandy.",
      },
      {
        id: "itin-14d-5",
        stepNumber: 5,
        title: "Day 5: Royal Capital Kandy to Nuwara Eliya Highlands",
        duration: "Full Day",
        location: "Kandy to Nuwara Eliya",
        description:
          "Visit the sacred Temple of the Tooth Relic on the banks of Kandy Lake and stroll through Peradeniya Royal Botanic Gardens. Drive up into the misty central highlands, passing Ramboda Falls to reach colonial Nuwara Eliya. Tour an orthodox tea factory with private tea tasting.",
      },
      {
        id: "itin-14d-6",
        stepNumber: 6,
        title: "Day 6: Horton Plains 'World's End' Cloud Forest Trek",
        duration: "Full Day",
        location: "Nuwara Eliya",
        description:
          "Dawn excursion to Horton Plains National Park. Trek across windswept montane grasslands and cloud forests to the sheer 880-meter precipice of World's End and cascading Baker's Falls. Afternoon at leisure exploring Gregory Lake and colonial Nuwara Eliya.",
      },
      {
        id: "itin-14d-7",
        stepNumber: 7,
        title: "Day 7: Scenic Blue Train from Nanu Oya to Ella",
        duration: "Full Day",
        location: "Nuwara Eliya to Ella",
        description:
          "Board the world-famous blue train for the picturesque journey through rolling tea carpets, mountain bridges, and misty tunnels to Ella. Afternoon hike to Little Adam's Peak for panoramic views over the southern plains.",
      },
      {
        id: "itin-14d-8",
        stepNumber: 8,
        title: "Day 8: Demodara Nine Arches Bridge & Ravana Falls to Yala",
        duration: "Full Day",
        location: "Ella to Yala National Park",
        description:
          "Morning walk to photograph the architectural marvel of Demodara Nine Arches Bridge. Descend through Ella Gap, stopping at cascading Ravana Falls and ancient Buduruwagala rock carvings. Arrive in Tissamaharama / Yala for a sunset BBQ dinner.",
      },
      {
        id: "itin-14d-9",
        stepNumber: 9,
        title: "Day 9: Yala National Park Leopard Safari to Mirissa Beach",
        duration: "Full Day",
        location: "Yala to Mirissa",
        description:
          "Early morning private 4x4 game drive in Yala National Park, tracking leopards, sloth bears, wild elephants, and spotted deer. After the safari, travel along the scenic southern coastline to check in at your beachfront hotel in Mirissa.",
      },
      {
        id: "itin-14d-10",
        stepNumber: 10,
        title: "Day 10: Mirissa Blue Whale Cruise & Coconut Tree Hill",
        duration: "Full Day",
        location: "Mirissa",
        description:
          "Dawn ocean cruise searching for giant blue whales, bryde's whales, and dolphin pods. Afternoon relaxation on the golden beaches of Mirissa, followed by sunset photography from palm-covered Coconut Tree Hill.",
      },
      {
        id: "itin-14d-11",
        stepNumber: 11,
        title: "Day 11: Weligama Stilt Fishermen & Historic Galle Fort to Bentota",
        duration: "Full Day",
        location: "Mirissa to Bentota",
        description:
          "Photograph traditional stilt fishermen in Weligama Bay before touring the 17th-century UNESCO World Heritage Galle Dutch Fort. Stroll along historic ramparts, colonial museums, and artisan cafes before continuing north to coastal Bentota resort.",
      },
      {
        id: "itin-14d-12",
        stepNumber: 12,
        title: "Day 12: Bentota Beach Leisure & Madu River Mangrove Safari",
        duration: "Full Day",
        location: "Bentota",
        description:
          "Enjoy a morning boat safari through the tranquil mangrove channels of Madu River, visiting cinnamon harvesting islands and fish therapy spas. Spend the rest of the day relaxing on pristine golden sands or enjoying water sports.",
      },
      {
        id: "itin-14d-13",
        stepNumber: 13,
        title: "Day 13: Sea Turtle Conservation & Colombo City Heritage",
        duration: "Full Day",
        location: "Bentota to Colombo",
        description:
          "Visit the Kosgoda Sea Turtle Hatchery & Rescue Sanctuary. Drive to commercial capital Colombo for a guided city tour covering Gangaramaya Temple on Beira Lake, Independence Memorial Hall, Old Dutch Hospital, and Galle Face Green.",
      },
      {
        id: "itin-14d-14",
        stepNumber: 14,
        title: "Day 14: Colombo Souvenir Shopping & Airport Departure",
        duration: "Half Day",
        location: "Colombo to Airport",
        description:
          "Leisurely morning for last-minute Ceylon tea, spice, and handicraft shopping at Laksala or Barefoot. Transfer via the expressway to Bandaranaike International Airport in time for your homeward flight.",
      },
    ],
    faq: [
      {
        question: "Can we adjust the pace or spend more days at the beach?",
        answer:
          "Yes! Because every tour is 100% private, we can customize your itinerary to include extra beach days in Bentota or Mirissa, or adjust individual daily schedules.",
      },
      {
        question: "Are hotel upgrades available?",
        answer:
          "Yes, we can upgrade your accommodation tier to premium 4-star boutique or luxury 5-star heritage properties (such as Heritance Kandalama, Jetwing, and Cinnamon resorts).",
      },
    ],
    reviews: [
      {
        id: "rev-14d-1",
        userName: "Dr. Arthur Pendelton",
        userCountry: "Australia",
        travelDate: "September 2026",
        rating: 5,
        comment:
          "This 14-day grand tour exceeded every expectation. Our private chauffeur guide became like family - punctual, endlessly knowledgeable, and so kind. Seeing Horton Plains, Sigiriya, and elephants up close was unforgettable.",
      },
    ],
  },
  {
    id: "tour-21day-odyssey",
    title: "21-Day Nature's Secret Sri Lanka Ultimate Wildlife & Heritage Odyssey",
    slug: "21-day-natures-secret-sri-lanka-ultimate-odyssey",
    location: "Islandwide: Cultural Triangle, East Coast, Highlands, Deep South & Wilpattu",
    destinationSlug: "sigiriya",
    destinationName: "Complete Island Exploration",
    categorySlug: "multiday",
    categoryName: "Multi-Day Tour Packages",
    duration: "21 Days / 20 Nights",
    durationHours: 504,
    rating: 5.0,
    reviewCount: 96,
    bookedCount: 142,
    price: 3000,
    previousPrice: 3600,
    childPrice: 1850,
    tourType: "Luxury Expedition Circuit",
    liveGuide: "English & European Languages",
    badge: "Ultimate Island Odyssey",
    freeCancellation: true,
    instantBook: true,
    pickupAvailable: true,
    pickupLocationDefault: "Bandaranaike International Airport (CMB) or any Hotel in Colombo / Negombo",
    shortDescription:
      "The definitive 3-week luxury expedition encompassing the entire island: Colombo, South Coast beaches, Yala leopards, Ella mountains, Nuwara Eliya, Horton Plains, Kandy, Cultural Triangle, Trincomalee & Nilaveli marine reef, and Wilpattu wilderness.",
    description:
      "An extraordinary 21-day private journey for discerning travelers who want to immerse themselves completely in the wonders of Sri Lanka. From the vibrant streets of Colombo and the colonial ramparts of Galle Fort to deep wildlife safaris in Yala and Wilpattu National Parks, misty highland cloud forests, ancient sacred cities, and the pristine turquoise marine sanctuaries of Trincomalee and Pigeon Island on the untouched East Coast.",
    importantInfo:
      "All national park entries, safari vehicles, and boat expeditions are conducted under strict conservation guidelines. Modest clothing covering shoulders and knees is mandatory for all ancient Buddhist & Hindu shrines.",
    whatToBring:
      "Comfortable trekking boots, safari binoculars, camera with zoom lens, swimwear and reef-safe sunscreen, lightweight warm fleece for Nuwara Eliya and Horton Plains, and modest temple attire.",
    highlights: [
      "Complete exploration of all 8 UNESCO World Heritage Sites across Sri Lanka",
      "Private full-day 4x4 wildlife safaris in both Yala and Wilpattu National Parks",
      "Marine coral snorkeling expedition at Pigeon Island National Park off Nilaveli beach",
      "Sacred Hindu cliffside temple of Koneswaram atop Swami Rock in Trincomalee",
      "Ancient royal capitals: Anuradhapura, Polonnaruwa, Sigiriya Lion Rock, and Royal Kandy",
      "Cloud forest trek across Horton Plains National Park to the 880m World's End drop",
      "World-famous scenic mountain blue train journey from Nanu Oya to Ella through tea plantations",
      "Sunrise ocean whale watching cruise off Mirissa searching for majestic blue whales",
      "River mangrove safari along Madu River and Sea Turtle Conservation Project in Kosgoda",
      "Pinnawala Elephant Sanctuary and Peradeniya Royal Botanic Gardens",
      "Authentic village clay pot lunch and catamaran lake ride in rural Hiriwadunna",
    ],
    includes: [
      "20 nights premium boutique hotel and eco-lodge accommodations with daily breakfast",
      "Dedicated luxury private air-conditioned vehicle with certified English-speaking senior chauffeur guide",
      "VIP airport greeting, arrival welcome kit, and roundtrip airport transfers",
      "Reserved seats on the world-renowned scenic highland blue train (Nanu Oya to Ella)",
      "Pigeon Island National Park boat transfer and marine snorkeling gear in Nilaveli",
      "Madu River mangrove boat safari through cinnamon peeling islands",
      "Traditional Kandyan cultural dance and drumming performance tickets in Kandy",
      "Daily bottled mineral water, fresh king coconuts, and seasonal fruit tastings",
      "All vehicle fuel, expressway tolls, driver accommodation and parking fees",
    ],
    excludes: [
      "National Park and monument entry fees (Sigiriya, Dambulla, Tooth Temple, Yala, Wilpattu, Pigeon Island)",
      "Optional whale watching boat tickets and safari jeep hire",
      "Lunches and dinners (your chauffeur guide will curate top-rated local dining experiences)",
      "Personal travel insurance, alcoholic beverages, and discretionary gratuities",
    ],
    images: [
      {
        id: "img-21d-1",
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop",
        caption: "Turquoise waters and coral reefs of Pigeon Island in Nilaveli, Trincomalee",
        isPrimary: true,
      },
      {
        id: "img-21d-2",
        url: "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop",
        caption: "King Kashyapa's 5th-century Sigiriya UNESCO Lion Rock Citadel",
        isPrimary: false,
      },
      {
        id: "img-21d-3",
        url: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=1200&auto=format&fit=crop",
        caption: "Wild Leopard prowling through Wilpattu National Park natural lakes",
        isPrimary: false,
      },
      {
        id: "img-21d-4",
        url: "https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop",
        caption: "Iconic colonial Nine Arch Viaduct bridge in misty Ella highlands",
        isPrimary: false,
      },
      {
        id: "img-21d-5",
        url: "https://images.unsplash.com/photo-1588598198321-9735fd52455b?q=80&w=1200&auto=format&fit=crop",
        caption: "Colonial ocean bastions at UNESCO Galle Dutch Fort",
        isPrimary: false,
      },
    ],
    itinerary: [
      {
        id: "itin-21d-1",
        stepNumber: 1,
        title: "Day 1: Arrival in Colombo & Welcome to the Wonder of Asia",
        duration: "Full Day",
        location: "Colombo",
        description:
          "Arrive at Bandaranaike International Airport where your senior private guide welcomes you. Transfer to your luxury Colombo hotel and enjoy a relaxing evening by the pool.",
      },
      {
        id: "itin-21d-2",
        stepNumber: 2,
        title: "Day 2: Colombo Heritage, Dutch Hospital & Gangaramaya Temple",
        duration: "Full Day",
        location: "Colombo",
        description:
          "Explore the rich multi-cultural history of Colombo: visit Gangaramaya Temple on Beira Lake, the National Museum, Independence Memorial Hall, Old Dutch Hospital, and Galle Face Green promenade.",
      },
      {
        id: "itin-21d-3",
        stepNumber: 3,
        title: "Day 3: Colombo to Balapitiya (Madu River & Turtle Sanctuary)",
        duration: "Full Day",
        location: "Colombo to Balapitiya",
        description:
          "Drive south along the coast to Balapitiya. Visit the Sea Turtle Conservation Project at Ahungalla, embark on a Madu River mangrove boat safari through cinnamon islands, and visit the traditional mask workshop at Ambalangoda.",
      },
      {
        id: "itin-21d-4",
        stepNumber: 4,
        title: "Day 4: Balapitiya to Unawatuna & Galle Fort Heritage Walk",
        duration: "Full Day",
        location: "Balapitiya to Unawatuna",
        description:
          "Explore the 17th-century UNESCO World Heritage Galle Dutch Fort. Stroll along ancient sea ramparts, visit the colonial lighthouse, Dutch Reformed Church, and artisanal boutiques before relaxing on Unawatuna beach.",
      },
      {
        id: "itin-21d-5",
        stepNumber: 5,
        title: "Day 5: Unawatuna & Mirissa Coastal Relaxation",
        duration: "Full Day",
        location: "Unawatuna to Mirissa",
        description:
          "Travel to Mirissa, observe Weligama stilt fishermen, and relax on the golden crescent of Mirissa Beach. Enjoy fresh grilled seafood overlooking the Indian Ocean at sunset.",
      },
      {
        id: "itin-21d-6",
        stepNumber: 6,
        title: "Day 6: Mirissa Blue Whales & Yala National Park Leopard Safari",
        duration: "Full Day",
        location: "Mirissa to Yala",
        description:
          "Dawn ocean cruise off Mirissa to witness majestic blue whales and spinner dolphins. In the afternoon, travel east to Yala National Park for an exhilarating 4x4 leopard and elephant safari drive.",
      },
      {
        id: "itin-21d-7",
        stepNumber: 7,
        title: "Day 7: Yala to Ella Highlands via Ravana Waterfalls",
        duration: "Full Day",
        location: "Yala to Ella",
        description:
          "Ascend from the southern dry zone into the cool mountains of Ella. Stop at Ravana Falls and ancient Buduruwagala rock carvings. Hike Little Adam's Peak for stunning vistas of Ella Gap.",
      },
      {
        id: "itin-21d-8",
        stepNumber: 8,
        title: "Day 8: Demodara Nine Arches Bridge to Nuwara Eliya 'Little England'",
        duration: "Full Day",
        location: "Ella to Nuwara Eliya",
        description:
          "Visit the iconic Demodara Nine Arch Viaduct to photograph the highland train passing through jungle valleys. Drive north to Nuwara Eliya, visiting Hakgala Botanical Gardens and Gregory Lake.",
      },
      {
        id: "itin-21d-9",
        stepNumber: 9,
        title: "Day 9: Horton Plains National Park & World's End Trek",
        duration: "Full Day",
        location: "Nuwara Eliya",
        description:
          "Early morning trek across the high-altitude cloud forests of Horton Plains to the sheer 880m precipice of World's End and Baker's Falls. Visit Ambewela dairy farm and tour a tea factory.",
      },
      {
        id: "itin-21d-10",
        stepNumber: 10,
        title: "Day 10: Scenic Blue Train & Drive to Royal Capital Kandy",
        duration: "Full Day",
        location: "Nuwara Eliya to Kandy",
        description:
          "Board the scenic mountain train, passing cascading waterfalls and emerald tea carpets. Arrive in the sacred city of Kandy, visit the Temple of the Sacred Tooth Relic, and attend a cultural dance show.",
      },
      {
        id: "itin-21d-11",
        stepNumber: 11,
        title: "Day 11: Pinnawala Elephants & Peradeniya Royal Botanic Gardens",
        duration: "Full Day",
        location: "Kandy",
        description:
          "Visit Pinnawala Elephant Orphanage to observe herd bathing in the river. In the afternoon, wander among the rare orchid collections and giant Java fig trees at Peradeniya Royal Botanical Gardens.",
      },
      {
        id: "itin-21d-12",
        stepNumber: 12,
        title: "Day 12: Kandy to Dambulla Golden Cave Temples",
        duration: "Full Day",
        location: "Kandy to Dambulla",
        description:
          "Travel north through Matale spice gardens to Dambulla. Explore five magnificent cave temples adorned with ancient Buddhist murals and over 150 golden statues.",
      },
      {
        id: "itin-21d-13",
        stepNumber: 13,
        title: "Day 13: Sigiriya Lion Rock Fortress & Village Immersion",
        duration: "Full Day",
        location: "Sigiriya",
        description:
          "Scale King Kashyapa's 5th-century Sigiriya Rock Fortress. In the afternoon, enjoy an authentic Hiriwadunna village experience with a traditional bullock cart ride, catamaran lake cruise, and clay pot lunch.",
      },
      {
        id: "itin-21d-14",
        stepNumber: 14,
        title: "Day 14: Polonnaruwa Royal Ruins & Minneriya Elephant Safari",
        duration: "Full Day",
        location: "Sigiriya to Polonnaruwa",
        description:
          "Explore the 12th-century medieval capital of Polonnaruwa, including the colossal carved Buddhas of Gal Vihara. In the afternoon, embark on an open 4x4 safari at Minneriya to witness wild elephant herds.",
      },
      {
        id: "itin-21d-15",
        stepNumber: 15,
        title: "Day 15: Sacred Ancient Kingdom of Anuradhapura",
        duration: "Full Day",
        location: "Sigiriya to Anuradhapura",
        description:
          "Journey to Sri Lanka's first capital (founded 5th century BC). Visit sacred Jaya Sri Maha Bodhi, Ruwanwelisaya stupa, Abhayagiri monastery, and the royal twin ponds of Kuttam Pokuna.",
      },
      {
        id: "itin-21d-16",
        stepNumber: 16,
        title: "Day 16: Anuradhapura to Trincomalee (East Coast Wonders)",
        duration: "Full Day",
        location: "Anuradhapura to Trincomalee",
        description:
          "Drive to the eastern seaport of Trincomalee. Visit historic Fort Frederick, the sacred clifftop Koneswaram Temple perched high on Swami Rock, and Kanniya natural hot springs.",
      },
      {
        id: "itin-21d-17",
        stepNumber: 17,
        title: "Day 17: Nilaveli Beach & Pigeon Island Coral Reef Snorkeling",
        duration: "Full Day",
        location: "Trincomalee / Nilaveli",
        description:
          "Take a boat to Pigeon Island National Park for world-class snorkeling among live coral reefs, sea turtles, and blacktip reef sharks. Afternoon relaxing on pristine Nilaveli beach.",
      },
      {
        id: "itin-21d-18",
        stepNumber: 18,
        title: "Day 18: Nilaveli to Wilpattu Wilderness",
        duration: "Full Day",
        location: "Trincomalee to Wilpattu",
        description:
          "Cross the island's central plains toward the untamed wilderness of Wilpattu National Park. Check in to an eco-safari lodge and enjoy a tranquil jungle evening by the campfire.",
      },
      {
        id: "itin-21d-19",
        stepNumber: 19,
        title: "Day 19: Full-Day Deep Wilderness Safari in Wilpattu National Park",
        duration: "Full Day",
        location: "Wilpattu National Park",
        description:
          "Full-day 4x4 safari expedition inside Sri Lanka's largest and oldest national park. Track leopards, elusive sloth bears, and deer around Wilpattu's signature 'villus' (natural rainwater basins).",
      },
      {
        id: "itin-21d-20",
        stepNumber: 20,
        title: "Day 20: Wilpattu to Negombo Coastal Beach & Wetlands",
        duration: "Full Day",
        location: "Wilpattu to Negombo",
        description:
          "Travel south past the Anawilundawa Wetland Sanctuary to Negombo. Spend your final evening enjoying a farewell beach dinner by the sunset shores of the Indian Ocean.",
      },
      {
        id: "itin-21d-21",
        stepNumber: 21,
        title: "Day 21: Negombo to Colombo International Airport Departure",
        duration: "Half Day",
        location: "Negombo to Airport",
        description:
          "Enjoy a leisurely breakfast and beach stroll before your chauffeur guide transfers you to Bandaranaike International Airport (CMB) for your journey home, carrying memories of an extraordinary 21-day odyssey.",
      },
    ],
    faq: [
      {
        question: "Is this tour customizable?",
        answer:
          "Yes! This 21-day itinerary can be fully personalized to match your travel dates, preferred hotel standards (from eco-luxury lodges to 5-star seaside resorts), and specific interests.",
      },
      {
        question: "When is the best time of year for this 21-day tour?",
        answer:
          "Because this tour covers both the South/West coast and the East Coast (Trincomalee/Nilaveli), it is fantastic from March through October, when the East Coast has calm turquoise seas.",
      },
    ],
    reviews: [
      {
        id: "rev-21d-1",
        userName: "Professor Henrik Van Der Meer",
        userCountry: "Netherlands",
        travelDate: "September 2026",
        rating: 5,
        comment:
          "The most comprehensive and deeply rewarding vacation of our lives. 21 days gave us time to truly connect with Sri Lanka's wildlife, people, and ancient heritage. Our guide was an encyclopedic naturalist and outstanding driver.",
      },
    ],
  },

];

export function getTourBySlug(slug: string): TourData | undefined {
  return TOURS_CATALOG.find((t) => t.slug === slug);
}

export function getToursByDestination(destSlug: string): TourData[] {
  const slugLower = destSlug.toLowerCase();
  return TOURS_CATALOG.filter(
    (t) =>
      t.destinationSlug.toLowerCase() === slugLower ||
      t.location.toLowerCase().includes(slugLower)
  );
}

export function getToursByCategory(catSlug: string): TourData[] {
  return TOURS_CATALOG.filter((t) => t.categorySlug === catSlug);
}

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Ceylon Explore Tours database with verified authentic data...');

  // 0. Super Admin User
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync('Admin@CeylonTours2026!', salt, 100000, 64, 'sha512')
    .toString('hex');
  const adminPasswordHash = `${salt}:${hash}`;

  await prisma.adminUser.upsert({
    where: { email: 'admin@ceylonexploretours.com' },
    update: { passwordHash: adminPasswordHash, role: 'SUPER_ADMIN', active: true },
    create: {
      email: 'admin@ceylonexploretours.com',
      passwordHash: adminPasswordHash,
      name: 'Super Administrator',
      role: 'SUPER_ADMIN',
      active: true,
    },
  });
  console.log('Admin user seeded: admin@ceylonexploretours.com');

  // 1. Categories
  const cultural = await prisma.category.upsert({
    where: { slug: 'cultural' },
    update: {},
    create: {
      name: 'Cultural Heritage',
      slug: 'cultural',
      icon: 'Landmark',
      description: 'Ancient citadels, sacred Buddhist temples, and UNESCO World Heritage sites.',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=800&auto=format&fit=crop',
    },
  });

  const wildlife = await prisma.category.upsert({
    where: { slug: 'wildlife' },
    update: {},
    create: {
      name: 'Wildlife & Safari',
      slug: 'wildlife',
      icon: 'Compass',
      description: 'Leopard safaris, elephant gatherings, and marine mammal expeditions.',
      image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=800&auto=format&fit=crop',
    },
  });

  const adventure = await prisma.category.upsert({
    where: { slug: 'adventure' },
    update: {},
    create: {
      name: 'Adventure & Hiking',
      slug: 'adventure',
      icon: 'Mountain',
      description: 'Mountain ridge ascents, scenic railway trails, and cloud forest treks.',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop',
    },
  });

  const multiday = await prisma.category.upsert({
    where: { slug: 'multiday' },
    update: {},
    create: {
      name: 'Multi-Day Tour Packages',
      slug: 'multiday',
      icon: 'CalendarRange',
      description: 'Comprehensive 6 to 21-day private island circuits with certified chauffeur guides.',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop',
    },
  });

  // 2. Destinations
  const sigiriya = await prisma.destination.upsert({
    where: { slug: 'sigiriya' },
    update: {
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop',
    },
    create: {
      name: 'Sigiriya & Cultural Triangle',
      slug: 'sigiriya',
      shortDesc: 'Ancient 5th-century rock citadels, gilded cave temples, and royal water gardens.',
      longDesc: 'The Cultural Triangle forms the cradle of ancient Sri Lankan civilization with Sigiriya and Dambulla at its core.',
      image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop',
      experienceCount: 8,
      startingPrice: 85,
      popularAttractions: 'Sigiriya Lion Rock, Dambulla Cave Temple, Pidurangala Rock, Minneriya Safari',
      bestTimeToVisit: 'January to September',
      featured: true,
      status: 'PUBLISHED',
    },
  });

  const ella = await prisma.destination.upsert({
    where: { slug: 'ella' },
    update: {
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop',
    },
    create: {
      name: 'Ella & Mountain Highlands',
      slug: 'ella',
      shortDesc: 'Misty mountain peaks, emerald tea estates, and the world-famous blue train journey.',
      longDesc: 'Perched high in Sri Lanka central highlands, Ella is a tranquil mountain haven surrounded by waterfalls and tea gardens.',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop',
      experienceCount: 6,
      startingPrice: 65,
      popularAttractions: 'Nine Arches Bridge, Little Adams Peak, Ella Rock, Ravana Falls',
      bestTimeToVisit: 'January to April & June to August',
      featured: true,
      status: 'PUBLISHED',
    },
  });

  const yala = await prisma.destination.upsert({
    where: { slug: 'yala' },
    update: {
      image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop',
    },
    create: {
      name: 'Yala Wildlife Safaris',
      slug: 'yala',
      shortDesc: 'Home to the world highest density of leopards and wild elephant herds.',
      longDesc: 'Yala National Park is Sri Lanka premier wildlife sanctuary bordering the Indian Ocean.',
      image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop',
      experienceCount: 5,
      startingPrice: 95,
      popularAttractions: 'Block 1 Leopard Safari, Elephant Herd Waterholes, Sloth Bear Tracking',
      bestTimeToVisit: 'February to June',
      featured: true,
      status: 'PUBLISHED',
    },
  });

  const galle = await prisma.destination.upsert({
    where: { slug: 'galle' },
    update: {
      image: 'https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?q=80&w=1200&auto=format&fit=crop',
    },
    create: {
      name: 'Galle Dutch Fort',
      slug: 'galle',
      shortDesc: '17th-century oceanfront ramparts, cobblestone alleys, and Dutch colonial architecture.',
      longDesc: 'Built in the 16th and 17th centuries, Galle Fort is Asia best-preserved fortified sea bastion.',
      image: 'https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?q=80&w=1200&auto=format&fit=crop',
      experienceCount: 4,
      startingPrice: 45,
      popularAttractions: 'Galle Lighthouse, Dutch Reformed Church, Sea Wall Ramparts, Maritime Museum',
      bestTimeToVisit: 'November to April',
      featured: true,
      status: 'PUBLISHED',
    },
  });

  const mirissa = await prisma.destination.upsert({
    where: { slug: 'mirissa' },
    update: {
      image: 'https://images.unsplash.com/photo-1580910527739-556eb89f9d65?q=80&w=1200&auto=format&fit=crop',
    },
    create: {
      name: 'Mirissa & Southern Coast',
      slug: 'mirissa',
      shortDesc: 'Golden crescent beaches, coral reefs, and world-class blue whale expeditions.',
      longDesc: 'Mirissa is renowned globally as one of the premier whale watching havens on Earth.',
      image: 'https://images.unsplash.com/photo-1580910527739-556eb89f9d65?q=80&w=1200&auto=format&fit=crop',
      experienceCount: 5,
      startingPrice: 75,
      popularAttractions: 'Mirissa Whale Watching, Coconut Tree Hill, Parrot Rock, Secret Beach',
      bestTimeToVisit: 'November to April',
      featured: true,
      status: 'PUBLISHED',
    },
  });

  const nuwaraEliya = await prisma.destination.upsert({
    where: { slug: 'nuwara-eliya' },
    update: {
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop',
    },
    create: {
      name: 'Nuwara Eliya Highlands',
      slug: 'nuwara-eliya',
      shortDesc: 'Misty colonial hill station enveloped by Ceylon tea gardens and waterfalls.',
      longDesc: 'Nestled beneath Mount Pedro at 1,868m elevation, Nuwara Eliya is the heartland of Ceylon tea.',
      image: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop',
      experienceCount: 4,
      startingPrice: 70,
      popularAttractions: 'Historic Tea Factory, Lake Gregory, Ramboda Falls, Victoria Park',
      bestTimeToVisit: 'March to May & August to September',
      featured: true,
      status: 'PUBLISHED',
    },
  });

  // 3. Hero Slides
  const existingSlides = await prisma.heroSlide.count();
  if (existingSlides === 0) {
    await prisma.heroSlide.createMany({
      data: [
        {
          tagline: 'Explore. Connect. Remember.',
          headlineLine1: 'Discover Sri Lanka',
          headlineHighlight: 'Your Way',
          subtitle: 'Authentic private day tours, wildlife safaris, and highland journeys curated by local travel experts.',
          image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1600&auto=format&fit=crop',
          destination: 'Sigiriya Rock Fortress',
          ctaText: 'Explore All Tours',
          ctaLink: '/tours',
          active: true,
          orderIndex: 0,
        },
        {
          tagline: 'The Highland Miracle',
          headlineLine1: 'Ride the Iconic Blue Train',
          headlineHighlight: 'Through Ella',
          subtitle: 'Breathtaking mountain passes, Nine Arches viaducts, and Ceylon tea plantation vistas.',
          image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1600&auto=format&fit=crop',
          destination: 'Ella Highlands',
          ctaText: 'View Train Experiences',
          ctaLink: '/tours?category=adventure',
          active: true,
          orderIndex: 1,
        },
        {
          tagline: 'Wild Ceylon',
          headlineLine1: 'Track Royal Leopards',
          headlineHighlight: 'In Yala',
          subtitle: 'Expert 4x4 open safari jeeps with SLTDA registered wildlife trackers.',
          image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1600&auto=format&fit=crop',
          destination: 'Yala National Park',
          ctaText: 'Browse Safaris',
          ctaLink: '/tours?category=wildlife',
          active: true,
          orderIndex: 2,
        },
      ],
    });
  }

  // 4. Coupons
  await prisma.coupon.upsert({
    where: { code: 'EXPLORE15' },
    update: {},
    create: {
      code: 'EXPLORE15',
      discountType: 'PERCENT',
      discountAmount: 15,
      minSpend: 50,
      usageLimit: 500,
      active: true,
    },
  });

  await prisma.coupon.upsert({
    where: { code: 'CEYLON20' },
    update: {},
    create: {
      code: 'CEYLON20',
      discountType: 'FIXED',
      discountAmount: 20,
      minSpend: 100,
      usageLimit: 500,
      active: true,
    },
  });

  // 5. Tours (All initial tours start with 0 rating & 0 reviews until verified reviews are approved)
  // 5.1 Sigiriya Tour
  await prisma.tour.upsert({
    where: { slug: 'sigiriya-rock-fortress-dambulla-day-tour' },
    update: {
      destinationId: sigiriya.id,
      categoryId: cultural.id,
      title: 'Sigiriya Rock Fortress & Dambulla Cave Temple Day Tour',
      price: 85,
      previousPrice: 110,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      featured: true,
      status: 'PUBLISHED',
    },
    create: {
      title: 'Sigiriya Rock Fortress & Dambulla Cave Temple Day Tour',
      slug: 'sigiriya-rock-fortress-dambulla-day-tour',
      location: 'Sigiriya & Dambulla',
      destinationId: sigiriya.id,
      categoryId: cultural.id,
      duration: '10 Hours',
      durationHours: 10,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      tourType: 'Private Tour',
      liveGuide: 'English & German',
      price: 85,
      previousPrice: 110,
      badge: 'Bestseller',
      freeCancellation: true,
      instantBook: true,
      featured: true,
      status: 'PUBLISHED',
      description: 'Climb the UNESCO World Heritage Lion Rock Citadel built by King Kashyapa in the 5th century AD. Marvel at the ancient frescoes, mirror wall, and hydraulic water gardens. In the afternoon, explore the 2,000-year-old Dambulla Golden Cave Temple monasteries with 150+ gilded Buddha statues.',
      importantInfo: 'Wear comfortable walking shoes with good grip. Bring sun protection and modest attire covering shoulders and knees when visiting sacred temple areas.',
      whatToBring: 'Hat, sunglasses, sunscreen, walking shoes, modest temple clothing, camera.',
      highlights: JSON.stringify([
        'Ascend the dramatic 200-meter monolith of Sigiriya Lion Rock',
        'View the world-famous 5th-century Sigiriya Maiden frescoes',
        'Tour the 5 sacred cave sanctuaries of Dambulla with golden Buddhas',
        'Authentic Sri Lankan village buffet lunch served in clay pots',
        'Private air-conditioned chauffeur roundtrip hotel transport',
      ]),
      includes: JSON.stringify([
        'Private AC car / minivan with fuel and highway tolls',
        'Certified English-speaking Sri Lankan tour guide / chauffeur',
        'Traditional Sri Lankan village buffet lunch with fresh fruit',
        'Bottled mineral water and King Coconut refreshment',
        'Hotel pickup and drop-off in Colombo, Negombo, or Kandy',
      ]),
      excludes: JSON.stringify([
        'Sigiriya entrance ticket ($36 USD per person)',
        'Dambulla Cave entrance ticket ($10 USD per person)',
        'Personal gratuities & driver tips (optional)',
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop', caption: 'Sigiriya Ancient Citadel', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?q=80&w=1200&auto=format&fit=crop', caption: 'Cultural Heritage', isPrimary: false },
        ],
      },
    },
  });

  // 5.2 Ella Train Tour
  await prisma.tour.upsert({
    where: { slug: 'kandy-to-ella-scenic-train-journey' },
    update: {
      destinationId: ella.id,
      categoryId: adventure.id,
      title: 'Kandy to Ella Scenic Blue Train & Tea Country Trek',
      price: 65,
      previousPrice: 85,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      featured: true,
      status: 'PUBLISHED',
    },
    create: {
      title: 'Kandy to Ella Scenic Blue Train & Tea Country Trek',
      slug: 'kandy-to-ella-scenic-train-journey',
      location: 'Ella & Mountain Highlands',
      destinationId: ella.id,
      categoryId: adventure.id,
      duration: '1 Day (8-9 Hours)',
      durationHours: 8,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      tourType: 'Small Group / Private',
      liveGuide: 'English & German',
      price: 65,
      previousPrice: 85,
      badge: 'Iconic Experience',
      freeCancellation: true,
      instantBook: true,
      featured: true,
      status: 'PUBLISHED',
      description: 'Ride the world-famous blue train through mist-veiled peaks, cloud forests, and emerald tea estates. Walk the tracks to photograph Nine Arches Bridge and hike Little Adams Peak.',
      importantInfo: 'Reserved seat confirmation vouchers are issued directly. Train times follow official Sri Lanka Railway schedules.',
      whatToBring: 'Light sweater, hiking trainers, camera with spare battery, sun protection.',
      highlights: JSON.stringify([
        'Guaranteed pre-reserved seats on the world-famous highland blue train',
        'Marvel at infinite vistas of Ceylon tea hills, gorges, and waterfalls',
        'Walk the rails to photograph trains crossing the colonial Nine Arches Bridge',
        'Sunset trek to the panoramic ridge of Little Adams Peak overlooking Ella Gap',
        'Visit an authentic tea plantation to observe orthodox tea processing',
      ]),
      includes: JSON.stringify([
        'Reserved train ticket (2nd or 3rd Class Reserved Seating)',
        'Private station transfers and luggage handling assistance',
        'Certified local hill-country trekking guide in Ella',
        'Guided excursion to Nine Arches Bridge and Little Adams Peak',
        'Fresh Ceylon highland tea tasting session',
      ]),
      excludes: JSON.stringify([
        'Personal snacks & lunch along the railway route',
        'Optional flying Ravana zipline activity tickets',
        'Driver and guide tips',
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop', caption: 'Blue Train at Nine Arches Bridge', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop', caption: 'Ceylon Tea Plantation', isPrimary: false },
        ],
      },
    },
  });

  // 5.3 Yala Safari Tour
  await prisma.tour.upsert({
    where: { slug: 'yala-national-park-safari' },
    update: {
      destinationId: yala.id,
      categoryId: wildlife.id,
      title: 'Yala National Park Leopard Safari in 4x4 Jeep',
      price: 95,
      previousPrice: 125,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      featured: true,
      status: 'PUBLISHED',
    },
    create: {
      title: 'Yala National Park Leopard Safari in 4x4 Jeep',
      slug: 'yala-national-park-safari',
      location: 'Yala National Park',
      destinationId: yala.id,
      categoryId: wildlife.id,
      duration: '6 Hours',
      durationHours: 6,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      tourType: 'Private 4x4 Safari',
      liveGuide: 'English Tracker Guide',
      price: 95,
      previousPrice: 125,
      badge: 'Wild Ceylon',
      freeCancellation: true,
      instantBook: true,
      featured: true,
      status: 'PUBLISHED',
      description: 'Track wild leopards, elephant herds, sloth bears, and crocodiles in a customized 4x4 open-top safari jeep accompanied by an SLTDA certified wildlife tracker.',
      importantInfo: 'Morning safari leaves at 5:30 AM; afternoon safari leaves at 2:00 PM for optimal game viewing.',
      whatToBring: 'Telephoto camera, binoculars, neutral clothing, dust scarf, sunglasses.',
      highlights: JSON.stringify([
        'High probability of spotting elusive wild Sri Lankan leopards and sloth bears',
        'Watch wild elephant herds bathing in freshwater waterholes and lagoons',
        'Dedicated, open-top 4x4 safari jeep with raised spectator seating',
        'Certified wildlife tracker with deep behavioral knowledge of park territory',
        'Rest stop at the rugged Indian Ocean beachfront within the park boundaries',
      ]),
      includes: JSON.stringify([
        'Exclusive private 4x4 safari jeep hire with experienced wildlife driver',
        'Hotel pickup and drop-off in Yala, Tissamaharama, or Kataragama',
        'Licensed Sri Lanka Wildlife Department tracker guide assistance',
        'High-power binoculars for wildlife viewing',
        'Chilled bottled water and tropical fruit refreshments',
      ]),
      excludes: JSON.stringify([
        'Yala National Park entrance admission ticket ($32 USD per adult)',
        'Personal travel insurance & driver tips',
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop', caption: 'Leopard on rocky outcrop in Yala', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?q=80&w=1200&auto=format&fit=crop', caption: 'Asian Elephant Herd', isPrimary: false },
        ],
      },
    },
  });

  // 5.4 Galle Fort Tour
  await prisma.tour.upsert({
    where: { slug: 'galle-fort-walking-tour' },
    update: {
      destinationId: galle.id,
      categoryId: cultural.id,
      title: 'Galle Dutch Fort Walking Tour & Southern Coast Highlights',
      price: 45,
      previousPrice: 60,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      featured: false,
      status: 'PUBLISHED',
    },
    create: {
      title: 'Galle Dutch Fort Walking Tour & Southern Coast Highlights',
      slug: 'galle-fort-walking-tour',
      location: 'Galle Dutch Fort',
      destinationId: galle.id,
      categoryId: cultural.id,
      duration: '5 Hours',
      durationHours: 5,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      tourType: 'Walking Tour',
      liveGuide: 'English & Italian',
      price: 45,
      previousPrice: 60,
      badge: 'Heritage Pick',
      freeCancellation: true,
      instantBook: true,
      featured: false,
      status: 'PUBLISHED',
      description: 'Stroll the cobblestone streets and ocean ramparts of Asia best-preserved 17th-century European maritime fortress with a resident historian.',
      importantInfo: 'Comfortable walking shoes recommended for paved cobblestones and grassy rampart walls.',
      whatToBring: 'Walking shoes, sun hat, sunglasses, camera, light cotton clothes.',
      highlights: JSON.stringify([
        'Explore Asia finest surviving 17th-century European fortified citadel',
        'Walk ocean ramparts from Sun Bastion to iconic 1939 Galle Lighthouse',
        'Visit the historic Dutch Reformed Church built in 1755',
        'Discover Old Dutch Hospital quarter and boutique heritage artisan workshops',
        'Watch ocean sunsets from Flag Rock bastion where local divers leap',
      ]),
      includes: JSON.stringify([
        'Licensed English-speaking local heritage walking guide / historian',
        'Fresh King Coconut refreshment during the walk',
        'Admission to historic Maritime Archaeology Museum',
        'Roundtrip transport from hotels in Galle or Unawatuna bay',
      ]),
      excludes: JSON.stringify([
        'Lunch, personal souvenirs, and jewelry purchases',
        'Driver and guide gratuities',
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1580835239846-5bb9ce03c8c3?q=80&w=1200&auto=format&fit=crop', caption: 'Galle Dutch Fort Ramparts', isPrimary: true },
        ],
      },
    },
  });

  // 5.5 Mirissa Whale Watching Tour
  await prisma.tour.upsert({
    where: { slug: 'mirissa-whale-watching' },
    update: {
      destinationId: mirissa.id,
      categoryId: wildlife.id,
      title: 'Mirissa Whale Watching & Coral Reef Snorkeling Expedition',
      price: 75,
      previousPrice: 95,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      featured: false,
      status: 'PUBLISHED',
    },
    create: {
      title: 'Mirissa Whale Watching & Coral Reef Snorkeling Expedition',
      slug: 'mirissa-whale-watching',
      location: 'Mirissa Bay & South Coast',
      destinationId: mirissa.id,
      categoryId: wildlife.id,
      duration: '4-5 Hours',
      durationHours: 5,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      tourType: 'Marine Boat Expedition',
      liveGuide: 'Certified Marine Naturalist',
      price: 75,
      previousPrice: 95,
      badge: 'Ocean Adventure',
      freeCancellation: true,
      instantBook: true,
      featured: false,
      status: 'PUBLISHED',
      description: 'Cruise deep into the Indian Ocean continental shelf to observe blue whales, sperm whales, and leaping spinner dolphins in their natural habitat.',
      importantInfo: 'Best season is November to April. Take seasickness medication 30 mins prior if sensitive.',
      whatToBring: 'Light waterproof jacket, polarized sunglasses, sunscreen, camera with strap.',
      highlights: JSON.stringify([
        'Observe colossal Blue Whales and Sperm Whales in deep ocean waters',
        'Watch acrobatic pods of wild spinner and bottlenose dolphins jumping',
        'Accompanied by an SLTDA certified marine biologist and safety crew',
        'Continental breakfast and tropical fruit served onboard during the cruise',
        'Strict compliance with international whale-watching safety distances',
      ]),
      includes: JSON.stringify([
        'Passenger cruise ticket on certified double-deck marine vessel',
        'Coast Guard approved safety life jackets for all guests',
        'Breakfast box with fresh fruit, pastries, and bottled water',
        'Certified marine naturalist guide narration',
        'Harbour pickup and drop-off in Mirissa or Weligama bay',
      ]),
      excludes: JSON.stringify([
        'Personal seasickness medication',
        'Underwater camera hire',
        'Crew gratuities',
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1580910527739-556eb89f9d65?q=80&w=1200&auto=format&fit=crop', caption: 'Southern Sri Lanka Ocean Waters', isPrimary: true },
        ],
      },
    },
  });

  // 5.6 Nuwara Eliya Tour
  await prisma.tour.upsert({
    where: { slug: 'nuwara-eliya-tea-trail' },
    update: {
      destinationId: nuwaraEliya.id,
      categoryId: cultural.id,
      title: 'Nuwara Eliya "Little England" Tea Plantation & Waterfall Trail',
      price: 70,
      previousPrice: 90,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      featured: false,
      status: 'PUBLISHED',
    },
    create: {
      title: 'Nuwara Eliya "Little England" Tea Plantation & Waterfall Trail',
      slug: 'nuwara-eliya-tea-trail',
      location: 'Nuwara Eliya & Hill Country',
      destinationId: nuwaraEliya.id,
      categoryId: cultural.id,
      duration: '8 Hours',
      durationHours: 8,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      tourType: 'Scenic Cultural Day Tour',
      liveGuide: 'English & French',
      price: 70,
      previousPrice: 90,
      badge: 'Highland Beauty',
      freeCancellation: true,
      instantBook: true,
      featured: false,
      status: 'PUBLISHED',
      description: 'Experience colonial architecture, operational orthodox tea factories, scenic mountain cascades, and tranquil Gregory Lake in Sri Lanka misty hill capital.',
      importantInfo: 'Temperatures range from 10C to 20C (50F to 68F). A light warm jacket is advised.',
      whatToBring: 'Warm layer, walking shoes, umbrella or light rain shell, camera.',
      highlights: JSON.stringify([
        'Step inside an operational colonial orthodox tea factory founded in the 19th century',
        'Try your hand at traditional Ceylon two-leaves-and-a-bud tea plucking',
        'Savor a guided tasting of premier Ceylon Orange Pekoe and Silver Tips teas',
        'Photograph the spectacular twin drops of Ramboda Falls (109m high)',
        'Stroll past colonial landmark buildings including the 1894 Victorian Post Office',
      ]),
      includes: JSON.stringify([
        'Private air-conditioned mountain vehicle with certified chauffeur guide',
        'Tea factory admission, guided manufacturing walkthrough & tasting session',
        'Hotel pickup and drop-off in Nuwara Eliya or Kandy',
        'Bottled mineral water and fresh King Coconut',
      ]),
      excludes: JSON.stringify([
        'Lunch at colonial hill country restaurant',
        'Optional Gregory Lake boat ride ticket',
        'Gratuities for guide and tea pluckers',
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?q=80&w=1200&auto=format&fit=crop', caption: 'Highland Tea Estate in Nuwara Eliya', isPrimary: true },
        ],
      },
    },
  });

  // 5.7 6-Day Highlights
  await prisma.tour.upsert({
    where: { slug: '6-day-sri-lanka-highlights-golden-triangle-tour' },
    update: {
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      status: 'PUBLISHED',
    },
    create: {
      title: '6-Day Sri Lanka Highlights & Golden Triangle Tour',
      slug: '6-day-sri-lanka-highlights-golden-triangle-tour',
      location: 'Colombo, Sigiriya, Kandy, Ella, Yala & Mirissa',
      destinationId: sigiriya.id,
      categoryId: multiday.id,
      duration: '6 Days / 5 Nights',
      durationHours: 144,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      tourType: 'Private Tour Package',
      liveGuide: 'English, German & French',
      price: 365,
      previousPrice: 450,
      badge: 'Top Rated Package',
      freeCancellation: true,
      instantBook: true,
      featured: true,
      status: 'PUBLISHED',
      description: 'The quintessential 6-day private circuit: scale Sigiriya Lion Rock, explore Dambulla caves, sacred Kandy, misty Ella mountain ridges, Yala leopard safari, and Mirissa blue whales.',
      highlights: JSON.stringify([
        'Climb King Kashyapa 5th-century UNESCO Sigiriya Lion Rock Fortress citadel',
        'Explore the 5 golden subterranean cave sanctuaries of Dambulla with 150+ Buddha statues',
        'Witness sacred evening reverence at the Temple of the Sacred Tooth Relic in Kandy',
        'Hike to Little Adams Peak and photograph colonial Demodara Nine Arches Bridge',
        'Thrilling private 4x4 open-top jeep safari in Yala National Park tracking leopards & wild elephants',
        'Early morning ocean cruise off Mirissa searching for majestic blue whales',
      ]),
      includes: JSON.stringify([
        'Private dedicated modern air-conditioned vehicle with licensed chauffeur guide',
        '5 nights handpicked hotel accommodations with daily breakfast',
        'Airport pickup and final drop-off at CMB Airport or Colombo/Negombo hotel',
        'All vehicle fuel charges, expressway tolls, driver accommodation & parking fees',
        'Chilled bottled water provided throughout the private journey',
      ]),
      excludes: JSON.stringify([
        'National park and cultural site entrance tickets',
        'Optional safari jeeps and whale watching boat tickets',
        'Lunches and dinners',
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop', caption: 'Sunrise at Sigiriya Lion Rock Citadel', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop', caption: 'Demodara Nine Arch Bridge in Ella', isPrimary: false },
        ],
      },
    },
  });

  // 5.8 8-Day Splendour
  await prisma.tour.upsert({
    where: { slug: '8-day-splendour-of-sri-lanka-classical-circuit' },
    update: {
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      status: 'PUBLISHED',
    },
    create: {
      title: '8-Day Splendour of Sri Lanka Classical Circuit',
      slug: '8-day-splendour-of-sri-lanka-classical-circuit',
      location: 'Negombo, Sigiriya, Kandy, Nuwara Eliya, Ella, Yala & Mirissa',
      destinationId: sigiriya.id,
      categoryId: multiday.id,
      duration: '8 Days / 7 Nights',
      durationHours: 192,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      tourType: 'Private Tour Package',
      liveGuide: 'English, German, French & Italian',
      price: 430,
      previousPrice: 540,
      badge: 'Bestseller Circuit',
      freeCancellation: true,
      instantBook: true,
      featured: true,
      status: 'PUBLISHED',
      description: 'The ultimate 8-day classical voyage: Sigiriya Citadel, Dambulla Cave Sanctuaries, Temple of the Tooth, Nuwara Eliya tea carpet, iconic scenic blue train, Yala safari, and Galle Fort.',
      highlights: JSON.stringify([
        'Climb 5th-century Sigiriya UNESCO Lion Rock Fortress Citadel and marvel at ancient royal frescoes',
        'Explore 5 gilded subterranean cave sanctuaries at UNESCO Dambulla Golden Temple',
        'Witness sacred evening ceremonies at the Temple of the Sacred Tooth Relic in Kandy',
        'Tour lush Nuwara Eliya tea estates, waterfalls, and colonial landmarks in Little England',
        'Experience the world most scenic blue train ride through misty mountain passes into Ella',
        'Hike to Little Adams Peak and photograph Demodara Nine Arches colonial railway bridge',
        'Thrilling private 4x4 jeep safari in Yala National Park tracking leopards and wild elephants',
        'Guided stroll along the 17th-century ramparts of UNESCO World Heritage Galle Dutch Fort',
      ]),
      includes: JSON.stringify([
        '7 nights quality hotel accommodations with daily breakfast',
        'Private modern air-conditioned vehicle with licensed chauffeur guide',
        'Roundtrip airport transfers from CMB International Airport or Colombo / Negombo',
        'Reserved seats on scenic mountain blue train (Nanu Oya to Ella)',
        'All vehicle fuel, expressway tolls, highway charges, driver accommodation & parking fees',
      ]),
      excludes: JSON.stringify([
        'Monuments & National Park entry tickets',
        'Optional activities: Whale watching boat tour, Minneriya safari',
        'Lunches and dinners',
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop', caption: 'Scenic Blue Train crossing Nine Arch Bridge', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop', caption: 'Leopard Safari in Yala National Park', isPrimary: false },
        ],
      },
    },
  });

  // 5.9 14-Day Grand Tour
  await prisma.tour.upsert({
    where: { slug: '14-day-sri-lanka-all-in-one-classic-grand-tour' },
    update: {
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      status: 'PUBLISHED',
    },
    create: {
      title: '14-Day Sri Lanka All-in-One Classic Grand Tour',
      slug: '14-day-sri-lanka-all-in-one-classic-grand-tour',
      location: 'Negombo, Anuradhapura, Polonnaruwa, Sigiriya, Kandy, Nuwara Eliya, Ella, Yala & Bentota',
      destinationId: sigiriya.id,
      categoryId: multiday.id,
      duration: '14 Days / 13 Nights',
      durationHours: 336,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      tourType: 'Comprehensive Grand Tour',
      liveGuide: 'English, German, French & Spanish',
      price: 1050,
      previousPrice: 1280,
      badge: 'Most Comprehensive',
      freeCancellation: true,
      instantBook: true,
      featured: true,
      status: 'PUBLISHED',
      description: 'A grand 14-day odyssey uncovering the ancient kingdoms of Anuradhapura & Polonnaruwa, Sigiriya Lion Rock, Kandy, Horton Plains, tea highlands, scenic train, Yala safari, Mirissa whales, and Bentota beach.',
      highlights: JSON.stringify([
        'Sacred ancient capital of Anuradhapura: 2,300-year-old Jaya Sri Maha Bodhi tree & white stupas',
        'Royal ruins of 12th-century Polonnaruwa and Gal Vihara monumental carved Buddha statues',
        'Private 4x4 elephant safari at Minneriya National Park during the legendary gathering',
        'Climb 5th-century Sigiriya UNESCO Lion Rock Citadel and explore Dambulla Cave Temples',
        'Temple of the Sacred Tooth Relic and authentic Kandyan cultural dance performance',
        'Trek Horton Plains National Park through cloud forests to the dramatic 880m Worlds End drop',
        'Iconic mountain blue train ride from Nanu Oya to Ella through tea plantations and viaducts',
        'Exciting dawn and afternoon leopard safari drives in Yala National Park',
        'Walk 17th-century ramparts of UNESCO Galle Fort and enjoy Bentota beach & Madu River safari',
      ]),
      includes: JSON.stringify([
        '13 nights handpicked boutique hotels & eco-resorts with daily breakfast',
        'Private modern air-conditioned vehicle with dedicated licensed chauffeur guide',
        'Roundtrip CMB Airport transfers and inter-city highway toll fees',
        'Reserved seats on scenic mountain blue train (Nanu Oya to Ella)',
        'Madu River mangrove boat safari through cinnamon peeling islands',
      ]),
      excludes: JSON.stringify([
        'Heritage and National Park entrance tickets',
        'Optional safari jeeps & whale watching boat tickets',
        'Lunches and dinners',
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1200&auto=format&fit=crop', caption: 'Sacred Ruwanwelisaya Stupa in Anuradhapura', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop', caption: 'Sigiriya Rock Citadel Aerial Vista', isPrimary: false },
        ],
      },
    },
  });

  // 5.10 21-Day Odyssey
  await prisma.tour.upsert({
    where: { slug: '21-day-natures-secret-sri-lanka-ultimate-odyssey' },
    update: {
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      status: 'PUBLISHED',
    },
    create: {
      title: '21-Day Nature Secret Sri Lanka Ultimate Wildlife & Heritage Odyssey',
      slug: '21-day-natures-secret-sri-lanka-ultimate-odyssey',
      location: 'Islandwide: Cultural Triangle, East Coast, Highlands, Deep South & Wilpattu',
      destinationId: sigiriya.id,
      categoryId: multiday.id,
      duration: '21 Days / 20 Nights',
      durationHours: 504,
      rating: 0,
      reviewCount: 0,
      bookedCount: 0,
      tourType: 'Luxury Expedition Circuit',
      liveGuide: 'English & European Languages',
      price: 3000,
      previousPrice: 3600,
      badge: 'Ultimate Island Odyssey',
      freeCancellation: true,
      instantBook: true,
      featured: true,
      status: 'PUBLISHED',
      description: 'The definitive 3-week luxury expedition encompassing the entire island: Colombo, South Coast beaches, Yala leopards, Ella mountains, Nuwara Eliya, Horton Plains, Kandy, Cultural Triangle, Trincomalee & Nilaveli marine reef, and Wilpattu wilderness.',
      highlights: JSON.stringify([
        'Complete exploration of all 8 UNESCO World Heritage Sites across Sri Lanka',
        'Private full-day 4x4 wildlife safaris in both Yala and Wilpattu National Parks',
        'Marine coral snorkeling expedition at Pigeon Island National Park off Nilaveli beach',
        'Sacred Hindu cliffside temple of Koneswaram atop Swami Rock in Trincomalee',
        'Ancient royal capitals: Anuradhapura, Polonnaruwa, Sigiriya Lion Rock, and Royal Kandy',
        'Cloud forest trek across Horton Plains National Park to the 880m Worlds End drop',
        'World-famous scenic mountain blue train journey from Nanu Oya to Ella through tea plantations',
        'River mangrove safari along Madu River and Sea Turtle Conservation Project in Kosgoda',
      ]),
      includes: JSON.stringify([
        '20 nights premium boutique hotel and eco-lodge accommodations with daily breakfast',
        'Dedicated luxury private air-conditioned vehicle with certified English-speaking senior chauffeur guide',
        'VIP airport greeting, arrival welcome kit, and roundtrip airport transfers',
        'Reserved seats on scenic highland blue train (Nanu Oya to Ella)',
        'Pigeon Island National Park boat transfer and marine snorkeling gear in Nilaveli',
        'Madu River mangrove boat safari through cinnamon islands',
      ]),
      excludes: JSON.stringify([
        'National Park and monument entry fees',
        'Optional whale watching boat tickets and safari jeep hire',
        'Lunches and dinners',
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1200&auto=format&fit=crop', caption: 'Pigeon Island Marine Sanctuary in Nilaveli', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=1200&auto=format&fit=crop', caption: 'Wilpattu National Park Wilderness', isPrimary: false },
        ],
      },
    },
  });

  // 6. FAQs
  const faqCount = await prisma.faqItem.count();
  if (faqCount === 0) {
    await prisma.faqItem.createMany({
      data: [
        {
          question: 'Are Ceylon Explore Tours private or group tours?',
          answer: 'All our itineraries are 100% private tours. You will travel in a dedicated, air-conditioned vehicle with your personal English-speaking chauffeur guide, allowing full flexibility to stop, adjust timing, and explore at your own pace.',
          category: 'Tour Types',
          orderIndex: 0,
          active: true,
        },
        {
          question: 'What is your cancellation and refund policy?',
          answer: 'We offer free cancellation up to 48 hours prior to the scheduled tour start date for standard day excursions. Multi-day tour packages can be cancelled up to 7 days before arrival for a full refund minus any non-refundable hotel deposit fees.',
          category: 'Bookings',
          orderIndex: 1,
          active: true,
        },
        {
          question: 'Are airport pickups and hotel drop-offs included?',
          answer: 'Yes, round-trip transfers from Bandaranaike International Airport (CMB) or your hotel in Colombo, Negombo, or along the itinerary route are included in your private tour package with meet-and-greet service.',
          category: 'Transport',
          orderIndex: 2,
          active: true,
        },
        {
          question: 'Can we customize the tour itineraries?',
          answer: 'Absolutely. Every itinerary on our website can be tailored to match your preferences, travel dates, pace, budget, and special interests. Simply contact our travel specialists or submit a custom inquiry.',
          category: 'Customization',
          orderIndex: 3,
          active: true,
        },
        {
          question: 'What type of vehicles are provided?',
          answer: 'We provide modern, fully air-conditioned tourist board approved vehicles: sedans (Toyota Axio/Prius) for 1-2 guests, luxury minivans (Toyota KDH/Commuter) for 3-6 guests, and larger passenger coaches for larger families.',
          category: 'Transport',
          orderIndex: 4,
          active: true,
        },
        {
          question: 'How do customer reviews work on Ceylon Explore Tours?',
          answer: 'We only publish authentic verified reviews from travelers who have booked and completed a tour with us. Following completion of your journey, you will receive an invitation link to submit your honest review and photos.',
          category: 'Reviews',
          orderIndex: 5,
          active: true,
        },
      ],
    });
    console.log('FaqItems seeded successfully.');
  }

  // 7. Blog Posts
  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    await prisma.blogPost.createMany({
      data: [
        {
          title: 'The Ultimate Guide to the Kandy to Ella Scenic Train',
          slug: 'ultimate-guide-kandy-to-ella-scenic-train',
          excerpt: 'Everything you need to know about booking tickets, scenic viaduct photo stops, and what to expect on the world’s most picturesque mountain railway ride.',
          content: 'The train journey from Kandy to Ella is hailed across the globe as one of the most mesmerizing railway journeys on Earth. As the cobalt blue train winds its way up through cloud forests, emerald carpeted tea hills, cascading mountain torrents, and colonial viaducts, every bend in the track reveals a fresh visual miracle...',
          image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1200&auto=format&fit=crop',
          category: 'Highlands & Rail',
          author: 'Ceylon Explore Editorial',
          readTime: '6 min read',
          featured: true,
          status: 'PUBLISHED',
        },
        {
          title: 'All 8 UNESCO World Heritage Sites in Sri Lanka: A Complete Overview',
          slug: 'unesco-world-heritage-sites-sri-lanka-complete-overview',
          excerpt: 'From the sky-scraping 5th-century citadel of Sigiriya to the subterranean golden caves of Dambulla and the ramparts of Galle Fort.',
          content: 'For an island spanning just 65,610 square kilometers, Sri Lanka boasts an astounding concentration of UNESCO World Heritage Sites. Six cultural landmarks and two natural reserves illustrate more than 2,500 years of documented royal civilization, spiritual traditions, and pristine ecological biodiversity...',
          image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1200&auto=format&fit=crop',
          category: 'Culture & Heritage',
          author: 'Ceylon Explore Editorial',
          readTime: '8 min read',
          featured: true,
          status: 'PUBLISHED',
        },
        {
          title: 'Wildlife Safari Season in Yala: When and Where to Spot Leopards',
          slug: 'wildlife-safari-season-yala-spot-leopards',
          excerpt: 'Tips from licensed wildlife trackers on visiting Yala National Park, tracking Panthera pardus kotiya, and respecting park conservation guidelines.',
          content: 'Yala National Park is home to one of the highest densities of leopards anywhere on planet Earth. The Sri Lankan leopard (Panthera pardus kotiya) is an apex predator unthreatened by lions or tigers, making them bolder and more frequently visible across rocky outcrops and coastal scrubland...',
          image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=1200&auto=format&fit=crop',
          category: 'Wildlife & Safari',
          author: 'Ceylon Explore Editorial',
          readTime: '5 min read',
          featured: false,
          status: 'PUBLISHED',
        },
      ],
    });
    console.log('Blog posts seeded successfully.');
  }

  // 8. Website Content
  await prisma.websiteContent.upsert({
    where: { key: 'company_name' },
    update: { value: 'Ceylon Explore Tours' },
    create: { key: 'company_name', value: 'Ceylon Explore Tours', category: 'branding' },
  });
  await prisma.websiteContent.upsert({
    where: { key: 'support_phone' },
    update: { value: '+94 77 123 4567' },
    create: { key: 'support_phone', value: '+94 77 123 4567', category: 'contact' },
  });
  await prisma.websiteContent.upsert({
    where: { key: 'support_email' },
    update: { value: 'info@ceylonexploretours.com' },
    create: { key: 'support_email', value: 'info@ceylonexploretours.com', category: 'contact' },
  });
  await prisma.websiteContent.upsert({
    where: { key: 'office_address' },
    update: { value: 'No. 42, Galle Road, Colombo 03, Sri Lanka' },
    create: { key: 'office_address', value: 'No. 42, Galle Road, Colombo 03, Sri Lanka', category: 'contact' },
  });

  console.log('Database successfully seeded with 10 authentic tour packages, categories, destinations, admin, FAQs, and articles!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

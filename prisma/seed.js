const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial Ceylon Explore Guide database...');

  // 1. Categories
  const cultural = await prisma.category.upsert({
    where: { slug: 'cultural' },
    update: {},
    create: {
      name: 'Cultural Heritage',
      slug: 'cultural',
      icon: 'Landmark',
      description: 'Ancient citadels, sacred Buddhist temples, and UNESCO World Heritage sites.',
      image: 'https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=800&auto=format&fit=crop'
    }
  });

  const wildlife = await prisma.category.upsert({
    where: { slug: 'wildlife' },
    update: {},
    create: {
      name: 'Wildlife & Safari',
      slug: 'wildlife',
      icon: 'Compass',
      description: 'Leopard safaris, elephant gatherings, and marine mammal expeditions.',
      image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?q=80&w=800&auto=format&fit=crop'
    }
  });

  const adventure = await prisma.category.upsert({
    where: { slug: 'adventure' },
    update: {},
    create: {
      name: 'Adventure & Hiking',
      slug: 'adventure',
      icon: 'Mountain',
      description: 'Mountain ridge ascents, white-water rafting, and cloud forest treks.',
      image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800&auto=format&fit=crop'
    }
  });

  // 2. Destinations
  const sigiriya = await prisma.destination.upsert({
    where: { slug: 'sigiriya' },
    update: {},
    create: {
      name: 'Sigiriya & Cultural Triangle',
      slug: 'sigiriya',
      shortDesc: 'Ancient 5th-century rock citadels, gilded cave temples, and royal water gardens.',
      longDesc: 'The Cultural Triangle forms the cradle of ancient Sri Lankan civilization with Sigiriya and Dambulla at its core.',
      image: 'https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1200&auto=format&fit=crop',
      experienceCount: 8,
      startingPrice: 85,
      popularAttractions: 'Sigiriya Lion Rock, Dambulla Cave Temple, Pidurangala Rock, Minneriya Safari',
      bestTimeToVisit: 'January to September',
      featured: true
    }
  });

  const ella = await prisma.destination.upsert({
    where: { slug: 'ella' },
    update: {},
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
      featured: true
    }
  });

  const yala = await prisma.destination.upsert({
    where: { slug: 'yala' },
    update: {},
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
      featured: true
    }
  });

  // 3. Hero Slides
  await prisma.heroSlide.createMany({
    data: [
      {
        tagline: 'Explore. Connect. Remember.',
        headlineLine1: 'Discover Sri Lanka',
        headlineHighlight: 'Your Way',
        subtitle: 'Authentic day tours, wildlife safaris, and highland journeys curated by local travel experts.',
        image: 'https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1600&auto=format&fit=crop',
        destination: 'Sigiriya Rock Fortress',
        ctaText: 'Explore All Tours',
        ctaLink: '/tours',
        active: true,
        orderIndex: 0
      },
      {
        tagline: 'The Highland Miracle',
        headlineLine1: 'Ride the Iconic Blue Train',
        headlineHighlight: 'Through Ella',
        subtitle: 'Breathtaking mountain passes, Nine Arches viaducts, and Ceylon tea plantation vistas.',
        image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=1600&auto=format&fit=crop',
        destination: 'Ella Highlands',
        ctaText: 'View Train Experiences',
        ctaLink: '/tours?category=scenic',
        active: true,
        orderIndex: 1
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
        orderIndex: 2
      }
    ]
  });

  // 4. Tours
  await prisma.tour.upsert({
    where: { slug: 'sigiriya-rock-fortress-dambulla-day-tour' },
    update: {},
    create: {
      title: 'Sigiriya Rock Fortress & Dambulla Cave Temple Day Tour',
      slug: 'sigiriya-rock-fortress-dambulla-day-tour',
      location: 'Sigiriya & Dambulla',
      destinationId: sigiriya.id,
      categoryId: cultural.id,
      duration: '10 Hours',
      durationHours: 10,
      rating: 4.95,
      reviewCount: 342,
      bookedCount: 520,
      tourType: 'Private Tour',
      liveGuide: 'English & German',
      price: 85,
      previousPrice: 110,
      badge: 'Bestseller',
      freeCancellation: true,
      instantBook: true,
      description: 'Climb the UNESCO World Heritage Lion Rock Citadel built by King Kashyapa in the 5th century AD. Marvel at the ancient frescoes, mirror wall, and hydraulic water gardens. In the afternoon, explore the 2,000-year-old Dambulla Golden Cave Temple monasteries with 150+ gilded Buddha statues.',
      importantInfo: 'Wear comfortable walking shoes with good grip. Bring sun protection and modest attire covering shoulders and knees when visiting the sacred Dambulla Cave Temples.',
      whatToBring: 'Hat, sunglasses, sunscreen, walking shoes, modest temple clothing, camera.',
      highlights: JSON.stringify([
        'Ascend the dramatic 200-meter monolith of Sigiriya Lion Rock',
        'View the world-famous 5th-century Sigiriya Maiden frescoes',
        'Tour the 5 sacred cave sanctuaries of Dambulla with golden Buddhas',
        'Authentic Sri Lankan village buffet lunch served in clay pots',
        'Private air-conditioned chauffeur roundtrip hotel transport'
      ]),
      includes: JSON.stringify([
        'Private AC car / minivan with fuel and highway tolls',
        'Certified English-speaking Sri Lankan tour guide / chauffeur',
        'Traditional Sri Lankan village buffet lunch with fresh fruit',
        'Bottled mineral water and King Coconut refreshment',
        'Hotel pickup and drop-off in Colombo, Negombo, or Kandy'
      ]),
      excludes: JSON.stringify([
        'Sigiriya entrance ticket ($36 USD per person)',
        'Dambulla Cave entrance ticket ($10 USD per person)',
        'Personal gratuities & driver tips (optional)'
      ]),
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1200&auto=format&fit=crop', caption: 'Sigiriya Ancient Citadel', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1566296566002-390b1062b186?q=80&w=1200&auto=format&fit=crop', caption: 'Cultural Heritage', isPrimary: false }
        ]
      },
      itinerary: {
        create: [
          { stepNumber: 1, title: 'Hotel Pickup & Countryside Drive', duration: '2.5 Hours', location: 'En route', description: 'Meet private chauffeur at hotel lobby.' },
          { stepNumber: 2, title: 'Sigiriya Lion Rock Fortress Ascent', duration: '3 Hours', location: 'Sigiriya', description: 'Ascend through ancient water gardens.' },
          { stepNumber: 3, title: 'Village Lunch & Cooking Demo', duration: '1.5 Hours', location: 'Hiriwadunna', description: 'Enjoy traditional clay pot feast.' },
          { stepNumber: 4, title: 'Dambulla Royal Cave Temple', duration: '2 Hours', location: 'Dambulla', description: 'Explore ancient Buddhist cave shrines.' }
        ]
      }
    }
  });

  // 5. Blog Post
  await prisma.blogPost.upsert({
    where: { slug: 'ultimate-10-day-sri-lanka-itinerary' },
    update: {},
    create: {
      title: 'The Ultimate 10-Day Sri Lanka Itinerary for First-Time Visitors',
      slug: 'ultimate-10-day-sri-lanka-itinerary',
      excerpt: 'From ancient Sigiriya to Ella trains and Yala safaris, discover the perfect balanced route.',
      content: 'Full travel guide for exploring Sri Lanka...',
      category: 'Itineraries',
      author: 'Nalaka Perera',
      readTime: '7 Min Read',
      image: 'https://images.unsplash.com/photo-1578564499890-7949609022f3?q=80&w=1200&auto=format&fit=crop',
      featured: true
    }
  });

  console.log('Database seeded successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());

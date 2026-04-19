// FILE: backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DriveEase database...');

  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.car.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  const hashedAdmin = await bcrypt.hash('Admin1234!', 12);
  const hashedStaff = await bcrypt.hash('Staff1234!', 12);
  const hashedCustomer = await bcrypt.hash('Customer1234!', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@driveease.ng',
      password: hashedAdmin,
      firstName: 'Emeka',
      lastName: 'Okafor',
      phone: '+2348012345678',
      role: 'ADMIN',
      loyaltyTier: 'PLATINUM',
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: 'staff@driveease.ng',
      password: hashedStaff,
      firstName: 'Amina',
      lastName: 'Bello',
      phone: '+2348023456789',
      role: 'STAFF',
      loyaltyTier: 'GOLD',
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@driveease.ng',
      password: hashedCustomer,
      firstName: 'Chidi',
      lastName: 'Nwosu',
      phone: '+2348034567890',
      role: 'CUSTOMER',
      loyaltyTier: 'SILVER',
      driverLicense: 'NGA-2019-DL-4521',
    },
  });

  const extraCustomers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'fatima.ibrahim@gmail.com',
        password: hashedCustomer,
        firstName: 'Fatima',
        lastName: 'Ibrahim',
        phone: '+2348045678901',
        role: 'CUSTOMER',
        loyaltyTier: 'GOLD',
      },
    }),
    prisma.user.create({
      data: {
        email: 'tunde.adeyemi@gmail.com',
        password: hashedCustomer,
        firstName: 'Tunde',
        lastName: 'Adeyemi',
        phone: '+2348056789012',
        role: 'CUSTOMER',
        loyaltyTier: 'BRONZE',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ngozi.obi@gmail.com',
        password: hashedCustomer,
        firstName: 'Ngozi',
        lastName: 'Obi',
        phone: '+2348067890123',
        role: 'CUSTOMER',
        loyaltyTier: 'SILVER',
      },
    }),
  ]);

  console.log('👤 Created users');

  const cars = await Promise.all([
    prisma.car.create({
      data: {
        make: 'Toyota',
        model: 'Camry',
        year: 2022,
        category: 'COMPACT',
        pricePerDay: 25000,
        pricePerWeek: 150000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 45000,
        color: 'Pearl White',
        images: [
          'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Air Conditioning',
          'Bluetooth',
          'Backup Camera',
          'USB Charging',
        ],
        rating: 4.5,
        reviewCount: 23,
        licensePlate: 'LAG-234-AB',
        vin: 'JT2BF22K1W0123456',
        description:
          'A reliable and comfortable sedan perfect for city driving and business trips.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Honda',
        model: 'CR-V',
        year: 2023,
        category: 'SUV',
        pricePerDay: 38000,
        pricePerWeek: 228000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 18000,
        color: 'Lunar Silver',
        images: [
          'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'AWD',
          'Sunroof',
          'Apple CarPlay',
          'Lane Assist',
          'Heated Seats',
        ],
        rating: 4.8,
        reviewCount: 31,
        licensePlate: 'ABJ-567-CD',
        vin: '5J6RW2H55LA000123',
        description:
          'Spacious SUV with advanced safety features, ideal for family trips.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Mercedes-Benz',
        model: 'C300',
        year: 2023,
        category: 'LUXURY',
        pricePerDay: 85000,
        pricePerWeek: 510000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 12000,
        color: 'Obsidian Black',
        images: [
          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Leather Seats',
          'Panoramic Roof',
          'MBUX System',
          'Ambient Lighting',
          'Massage Seats',
        ],
        rating: 4.9,
        reviewCount: 15,
        licensePlate: 'LAG-890-EF',
        vin: 'WDDWF8EB4KR000456',
        description:
          'Premium luxury sedan for executives and special occasions.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Kia',
        model: 'Sportage',
        year: 2022,
        category: 'SUV',
        pricePerDay: 32000,
        pricePerWeek: 192000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 35000,
        color: 'Snow White Pearl',
        images: [
          'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Touchscreen',
          'Reversing Camera',
          'Cruise Control',
          'Smart Key',
        ],
        rating: 4.3,
        reviewCount: 18,
        licensePlate: 'PHC-112-GH',
        vin: 'KNDPM3AC5N7000789',
        description:
          'Practical and stylish SUV with modern technology at an affordable price.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Toyota',
        model: 'Corolla',
        year: 2021,
        category: 'ECONOMY',
        pricePerDay: 18000,
        pricePerWeek: 108000,
        seats: 5,
        transmission: 'MANUAL',
        fuelType: 'PETROL',
        mileage: 62000,
        color: 'Celestial Silver',
        images: [
          'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Air Conditioning',
          'CD Player',
          'Power Windows',
          'Central Lock',
        ],
        rating: 4.1,
        reviewCount: 42,
        licensePlate: 'IBD-445-IJ',
        vin: '2T1BURHE0JC000012',
        description:
          'Budget-friendly economy car, great fuel efficiency for daily commutes.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Ford',
        model: 'Explorer',
        year: 2022,
        category: 'SUV',
        pricePerDay: 55000,
        pricePerWeek: 330000,
        seats: 7,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 28000,
        color: 'Iconic Silver',
        images: [
          'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800',
        ],
        status: 'RENTED',
        features: [
          '3-Row Seating',
          'SYNC 4',
          '4WD',
          'Ford Co-Pilot 360',
          'Tow Package',
        ],
        rating: 4.6,
        reviewCount: 12,
        licensePlate: 'LAG-778-KL',
        vin: '1FM5K8GC4NGA00456',
        description:
          'Large family SUV with impressive capabilities and modern infotainment.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Hyundai',
        model: 'Tucson',
        year: 2023,
        category: 'SUV',
        pricePerDay: 35000,
        pricePerWeek: 210000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'HYBRID',
        mileage: 8000,
        color: 'Amazon Gray',
        images: [
          'https://images.unsplash.com/photo-1633509252568-40b0a4d2e0b6?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Hybrid Engine',
          'Digital Cockpit',
          'Safe Exit Assist',
          'Bose Sound',
        ],
        rating: 4.7,
        reviewCount: 9,
        licensePlate: 'AKW-321-MN',
        vin: '5NMP4DAF6PH000111',
        description:
          'Eco-friendly hybrid SUV with cutting-edge safety technology.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'BMW',
        model: '5 Series',
        year: 2023,
        category: 'LUXURY',
        pricePerDay: 95000,
        pricePerWeek: 570000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 5000,
        color: 'Alpine White',
        images: [
          'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'iDrive 8',
          'Harman Kardon',
          'Active Steering',
          'Head-Up Display',
          'Wireless Charging',
        ],
        rating: 5.0,
        reviewCount: 7,
        licensePlate: 'LAG-999-OP',
        vin: 'WBA53BH08PCM00789',
        description:
          'The ultimate executive sedan — power, prestige, and perfection.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Nissan',
        model: 'Sentra',
        year: 2021,
        category: 'ECONOMY',
        pricePerDay: 15000,
        pricePerWeek: 90000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 55000,
        color: 'Fresh Powder',
        images: [
          'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Air Conditioning',
          'Bluetooth',
          'Intelligent Key',
          'USB Port',
        ],
        rating: 4.0,
        reviewCount: 28,
        licensePlate: 'KAN-654-QR',
        vin: '3N1AB8CV4MY000333',
        description:
          'Compact and efficient — ideal for solo trips and short-term rentals.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Toyota',
        model: 'Hiace Bus',
        year: 2022,
        category: 'VAN',
        pricePerDay: 45000,
        pricePerWeek: 270000,
        seats: 14,
        transmission: 'MANUAL',
        fuelType: 'DIESEL',
        mileage: 72000,
        color: 'White',
        images: [
          'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          '14-Seater',
          'Air Conditioning',
          'Luggage Rack',
          'Tinted Windows',
        ],
        rating: 4.2,
        reviewCount: 35,
        licensePlate: 'OGU-874-ST',
        vin: 'JTFSX22P300001234',
        description:
          'Perfect for group travel, airport transfers, and corporate shuttles.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Lexus',
        model: 'RX 350',
        year: 2023,
        category: 'LUXURY',
        pricePerDay: 90000,
        pricePerWeek: 540000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 9000,
        color: 'Nebula Gray',
        images: [
          'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Mark Levinson Audio',
          'Panoramic View Monitor',
          'Remote Connect',
          'Semi-Aniline Leather',
        ],
        rating: 4.9,
        reviewCount: 11,
        licensePlate: 'LAG-111-UV',
        vin: '2T2HZMAA5PC000567',
        description:
          'Refined luxury crossover with whisper-quiet cabin and superior comfort.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Volkswagen',
        model: 'Golf',
        year: 2022,
        category: 'COMPACT',
        pricePerDay: 22000,
        pricePerWeek: 132000,
        seats: 5,
        transmission: 'MANUAL',
        fuelType: 'PETROL',
        mileage: 38000,
        color: 'Reflex Silver',
        images: [
          'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        ],
        status: 'MAINTENANCE',
        features: [
          'Digital Cockpit',
          'Wireless Carplay',
          'IQ.DRIVE',
          'LED Matrix Lights',
        ],
        rating: 4.4,
        reviewCount: 20,
        licensePlate: 'EDO-432-WX',
        vin: '1VWFE21C04M000890',
        description:
          'European performance hatch — fun to drive with premium tech.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Tesla',
        model: 'Model 3',
        year: 2023,
        category: 'ELECTRIC',
        pricePerDay: 75000,
        pricePerWeek: 450000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'ELECTRIC',
        mileage: 15000,
        color: 'Midnight Cherry Red',
        images: [
          'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Autopilot',
          '15" Touchscreen',
          'Over-the-Air Updates',
          'Glass Roof',
          '500km Range',
        ],
        rating: 4.8,
        reviewCount: 6,
        licensePlate: 'LAG-2023-EV',
        vin: '5YJ3E1EA4NF000001',
        description:
          "Nigeria's cleanest drive — zero emissions, maximum performance.",
      },
    }),
    prisma.car.create({
      data: {
        make: 'Honda',
        model: 'Civic',
        year: 2022,
        category: 'COMPACT',
        pricePerDay: 20000,
        pricePerWeek: 120000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 30000,
        color: 'Sonic Gray Pearl',
        images: [
          'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Honda Sensing',
          'Wireless CarPlay',
          'Bose Audio',
          'Sunroof',
        ],
        rating: 4.6,
        reviewCount: 17,
        licensePlate: 'RIV-567-YZ',
        vin: '19XFE1F34LE000222',
        description:
          'Sporty and comfortable compact — a smart choice for any journey.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Toyota',
        model: 'Land Cruiser',
        year: 2022,
        category: 'SUV',
        pricePerDay: 80000,
        pricePerWeek: 480000,
        seats: 7,
        transmission: 'AUTO',
        fuelType: 'DIESEL',
        mileage: 22000,
        color: 'Attitude Black',
        images: [
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Kinetic Dynamic Suspension',
          'Multi-Terrain Select',
          'JBL Audio',
          '7-Seater',
          'Crawl Control',
        ],
        rating: 4.9,
        reviewCount: 8,
        licensePlate: 'FCT-900-AA',
        vin: 'JTMHK3FV5N5000098',
        description:
          'The king of Nigerian roads — conquers any terrain with absolute authority.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Chevrolet',
        model: 'Malibu',
        year: 2021,
        category: 'COMPACT',
        pricePerDay: 23000,
        pricePerWeek: 138000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 48000,
        color: 'Summit White',
        images: [
          'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'MyLink Infotainment',
          'Teen Driver',
          'Rear Camera',
          '4G LTE WiFi',
        ],
        rating: 4.2,
        reviewCount: 14,
        licensePlate: 'OND-234-BB',
        vin: '1G1ZD5ST4MF000345',
        description:
          'Comfortable mid-size sedan with smart technology at competitive pricing.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Peugeot',
        model: '3008',
        year: 2022,
        category: 'SUV',
        pricePerDay: 40000,
        pricePerWeek: 240000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 19000,
        color: 'Pearl White Nacrée',
        images: [
          'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'i-Cockpit',
          'Focal Audio',
          'Night Vision',
          'Adaptive Cruise Control',
        ],
        rating: 4.5,
        reviewCount: 10,
        licensePlate: 'LAG-456-CC',
        vin: 'VF3MCBHZWKS000456',
        description:
          'French elegance meets African roads — distinctive design inside and out.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Mitsubishi',
        model: 'Outlander',
        year: 2022,
        category: 'SUV',
        pricePerDay: 36000,
        pricePerWeek: 216000,
        seats: 7,
        transmission: 'AUTO',
        fuelType: 'HYBRID',
        mileage: 25000,
        color: 'Sterling Silver',
        images: [
          'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
        ],
        status: 'AVAILABLE',
        features: ['PHEV', '7-Seater', 'S-AWC', 'Bose Sound', 'MI-PILOT'],
        rating: 4.4,
        reviewCount: 13,
        licensePlate: 'ABI-789-DD',
        vin: 'JA4J3VA80PZ000678',
        description:
          'Eco-smart 7-seater — ideal for large families wanting fuel savings.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Suzuki',
        model: 'Swift',
        year: 2022,
        category: 'ECONOMY',
        pricePerDay: 16000,
        pricePerWeek: 96000,
        seats: 5,
        transmission: 'MANUAL',
        fuelType: 'PETROL',
        mileage: 40000,
        color: 'Phoenix Red',
        images: [
          'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',
        ],
        status: 'AVAILABLE',
        features: ['Touchscreen', 'Reverse Sensor', 'Auto AC', 'Keyless Entry'],
        rating: 4.1,
        reviewCount: 22,
        licensePlate: 'OSG-123-EE',
        vin: 'JS3RG9154P4000789',
        description:
          'Nippy city car with low running costs — perfect for Lagos traffic.',
      },
    }),
    prisma.car.create({
      data: {
        make: 'Audi',
        model: 'Q5',
        year: 2023,
        category: 'LUXURY',
        pricePerDay: 88000,
        pricePerWeek: 528000,
        seats: 5,
        transmission: 'AUTO',
        fuelType: 'PETROL',
        mileage: 7000,
        color: 'Daytona Gray',
        images: [
          'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
        ],
        status: 'AVAILABLE',
        features: [
          'Quattro AWD',
          'Virtual Cockpit',
          'Bang & Olufsen',
          'Matrix LED',
          'Air Suspension',
        ],
        rating: 4.9,
        reviewCount: 5,
        licensePlate: 'LAG-007-FF',
        vin: 'WA1BNAF70PD000900',
        description:
          'Quattro precision meets Nigerian ambition — the pinnacle of luxury SUV.',
      },
    }),
  ]);

  console.log(`🚗 Created ${cars.length} cars`);

  const allCustomers = [customer, ...extraCustomers];
  const availableCars = cars.filter((c) => c.status === 'AVAILABLE');

  const bookings = [];
  const now = new Date();

  const bookingTemplates = [
    {
      userId: customer.id,
      carId: cars[0].id,
      daysAgo: 90,
      duration: 3,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: customer.id,
      carId: cars[1].id,
      daysAgo: 60,
      duration: 7,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: customer.id,
      carId: cars[3].id,
      daysAgo: 30,
      duration: 2,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: customer.id,
      carId: cars[4].id,
      daysAgo: 14,
      duration: 5,
      status: 'CONFIRMED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: customer.id,
      carId: cars[13].id,
      daysAgo: -5,
      duration: 4,
      status: 'PENDING' as const,
      paymentStatus: 'UNPAID' as const,
    },
    {
      userId: extraCustomers[0].id,
      carId: cars[2].id,
      daysAgo: 45,
      duration: 2,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[0].id,
      carId: cars[7].id,
      daysAgo: 20,
      duration: 3,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[0].id,
      carId: cars[10].id,
      daysAgo: 5,
      duration: 7,
      status: 'ACTIVE' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[1].id,
      carId: cars[8].id,
      daysAgo: 75,
      duration: 1,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[1].id,
      carId: cars[4].id,
      daysAgo: 40,
      duration: 3,
      status: 'CANCELLED' as const,
      paymentStatus: 'REFUNDED' as const,
    },
    {
      userId: extraCustomers[1].id,
      carId: cars[6].id,
      daysAgo: 10,
      duration: 2,
      status: 'CONFIRMED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[2].id,
      carId: cars[14].id,
      daysAgo: 55,
      duration: 5,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[2].id,
      carId: cars[9].id,
      daysAgo: 25,
      duration: 2,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[2].id,
      carId: cars[16].id,
      daysAgo: -3,
      duration: 6,
      status: 'PENDING' as const,
      paymentStatus: 'UNPAID' as const,
    },
    {
      userId: customer.id,
      carId: cars[19].id,
      daysAgo: 120,
      duration: 1,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[0].id,
      carId: cars[12].id,
      daysAgo: 100,
      duration: 3,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[1].id,
      carId: cars[17].id,
      daysAgo: 80,
      duration: 4,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[2].id,
      carId: cars[15].id,
      daysAgo: 65,
      duration: 2,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: customer.id,
      carId: cars[11].id,
      daysAgo: 50,
      duration: 3,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
    {
      userId: extraCustomers[0].id,
      carId: cars[18].id,
      daysAgo: 35,
      duration: 5,
      status: 'COMPLETED' as const,
      paymentStatus: 'PAID' as const,
    },
  ];

  for (const template of bookingTemplates) {
    const car = cars.find((c) => c.id === template.carId)!;
    const pickupDate = new Date(now);
    pickupDate.setDate(pickupDate.getDate() - template.daysAgo);
    pickupDate.setHours(10, 0, 0, 0);

    const returnDate = new Date(pickupDate);
    returnDate.setDate(returnDate.getDate() + template.duration);

    const dailyRate = Number(car.pricePerDay);
    const insuranceIncluded = Math.random() > 0.5;
    const gpsIncluded = Math.random() > 0.6;
    const insuranceCost = insuranceIncluded ? 3000 * template.duration : 0;
    const gpsCost = gpsIncluded ? 1500 * template.duration : 0;
    const subtotal = dailyRate * template.duration + insuranceCost + gpsCost;
    const totalAmount = subtotal;

    const booking = await prisma.booking.create({
      data: {
        userId: template.userId,
        carId: template.carId,
        pickupDate,
        returnDate,
        pickupLocation: [
          'Lagos Island',
          'Victoria Island',
          'Lekki',
          'Ikeja',
          'Abuja CBD',
        ][Math.floor(Math.random() * 5)],
        returnLocation: [
          'Lagos Island',
          'Victoria Island',
          'Lekki',
          'Ikeja',
          'Abuja CBD',
        ][Math.floor(Math.random() * 5)],
        totalDays: template.duration,
        dailyRate,
        insuranceIncluded,
        gpsIncluded,
        childSeatIncluded: false,
        insuranceCost,
        gpsCost,
        childSeatCost: 0,
        subtotal,
        discount: 0,
        totalAmount,
        status: template.status,
        paymentStatus: template.paymentStatus,
        paymentReference:
          template.paymentStatus === 'PAID'
            ? `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
            : null,
      },
    });

    bookings.push(booking);
  }

  console.log(`📋 Created ${bookings.length} bookings`);

  const notifications = [
    {
      userId: admin.id,
      title: 'New Booking Alert',
      message: 'Chidi Nwosu just booked Toyota Land Cruiser for 4 days.',
      type: 'INFO' as const,
      isRead: false,
    },
    {
      userId: admin.id,
      title: 'Fleet Update',
      message: 'Volkswagen Golf has been sent for routine maintenance.',
      type: 'WARNING' as const,
      isRead: false,
    },
    {
      userId: admin.id,
      title: 'Revenue Milestone',
      message: 'Congratulations! DriveEase hit ₦5,000,000 in monthly revenue.',
      type: 'SUCCESS' as const,
      isRead: true,
    },
    {
      userId: staff.id,
      title: 'Booking to Confirm',
      message: 'Please review and confirm booking from Tunde Adeyemi.',
      type: 'INFO' as const,
      isRead: false,
    },
    {
      userId: customer.id,
      title: 'Welcome to DriveEase!',
      message:
        'Hi Chidi, your account is ready. Start exploring our fleet today!',
      type: 'SUCCESS' as const,
      isRead: true,
    },
    {
      userId: customer.id,
      title: 'Booking Confirmed',
      message: 'Your Toyota Corolla booking has been confirmed for 5 days.',
      type: 'SUCCESS' as const,
      isRead: false,
    },
    {
      userId: customer.id,
      title: 'Return Reminder',
      message: 'Your Honda CR-V is due for return tomorrow at 10:00 AM.',
      type: 'WARNING' as const,
      isRead: false,
    },
    {
      userId: extraCustomers[0].id,
      title: 'Booking Active',
      message: 'Your Lexus RX 350 rental has started. Enjoy your drive!',
      type: 'SUCCESS' as const,
      isRead: false,
    },
    {
      userId: extraCustomers[0].id,
      title: 'Loyalty Upgrade!',
      message: "Congratulations Fatima! You've been upgraded to GOLD tier.",
      type: 'SUCCESS' as const,
      isRead: false,
    },
    {
      userId: extraCustomers[1].id,
      title: 'Cancellation Processed',
      message:
        'Your booking has been cancelled and a refund of ₦90,000 is being processed.',
      type: 'INFO' as const,
      isRead: true,
    },
    {
      userId: extraCustomers[1].id,
      title: 'New Booking Pending',
      message: 'Your Hyundai Tucson booking is pending confirmation.',
      type: 'INFO' as const,
      isRead: false,
    },
    {
      userId: extraCustomers[2].id,
      title: 'Welcome to DriveEase!',
      message: 'Hi Ngozi, welcome aboard! Check out our premium fleet.',
      type: 'SUCCESS' as const,
      isRead: true,
    },
    {
      userId: admin.id,
      title: 'Payment Received',
      message: 'Payment of ₦210,000 received for booking #LAND-002.',
      type: 'SUCCESS' as const,
      isRead: false,
    },
    {
      userId: staff.id,
      title: 'Car Due for Service',
      message: 'Toyota Hiace Bus (OGU-874-ST) is due for a 75,000km service.',
      type: 'WARNING' as const,
      isRead: false,
    },
    {
      userId: admin.id,
      title: 'New Customer Registered',
      message: 'Fatima Ibrahim just created an account on DriveEase.',
      type: 'INFO' as const,
      isRead: true,
    },
    {
      userId: customer.id,
      title: 'Special Offer',
      message:
        'Book any luxury car this weekend and get 10% off with code: DRIVE10.',
      type: 'INFO' as const,
      isRead: false,
    },
    {
      userId: extraCustomers[0].id,
      title: 'Invoice Ready',
      message:
        'Your invoice for BMW 5 Series (3 days) is available to download.',
      type: 'INFO' as const,
      isRead: true,
    },
    {
      userId: extraCustomers[2].id,
      title: 'Booking Upcoming',
      message:
        'Your Peugeot 3008 pickup is in 2 days. Location: Victoria Island.',
      type: 'WARNING' as const,
      isRead: false,
    },
    {
      userId: staff.id,
      title: 'Tesla Model 3 Available',
      message:
        'Tesla Model 3 has been cleaned and is ready for the next customer.',
      type: 'SUCCESS' as const,
      isRead: false,
    },
    {
      userId: admin.id,
      title: 'System Health',
      message:
        'All systems operational. Database backup completed successfully.',
      type: 'SUCCESS' as const,
      isRead: true,
    },
  ];

  for (const notif of notifications) {
    await prisma.notification.create({ data: notif });
  }

  console.log(`🔔 Created ${notifications.length} notifications`);
  console.log('\n✅ Database seeded successfully!\n');
  console.log('🔐 Login credentials:');
  console.log('   Admin:    admin@driveease.ng     / Admin1234!');
  console.log('   Staff:    staff@driveease.ng     / Staff1234!');
  console.log('   Customer: customer@driveease.ng  / Customer1234!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

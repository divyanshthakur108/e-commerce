const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Product = require("./models/product");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const products = [
  // 1. ELECTRONICS
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    category: "Electronics",
    description: "Industry-leading noise canceling with two processors and 8 microphones. Auto NC Optimizer automatically optimizes noise canceling based on your wearing conditions and environment.",
    price: 34990,
    discountPrice: 29990,
    rating: 4.8,
    numReviews: 342,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80"
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Battery Life", value: "30 Hours" },
      { name: "Connectivity", value: "Bluetooth 5.2" },
      { name: "Noise Cancellation", value: "Active Noise Cancelling (ANC)" }
    ]
  },
  {
    name: "Bose SoundLink Flex Bluetooth Speaker",
    brand: "Bose",
    category: "Electronics",
    description: "State-of-the-art design filled with exclusive Bose technologies. PositionIQ technology automatically detects orientation to optimize sound.",
    price: 15900,
    discountPrice: 12999,
    rating: 4.7,
    numReviews: 189,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80",
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80"
    ],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Waterproof", value: "IP67 Rating" },
      { name: "Battery Life", value: "12 Hours" }
    ]
  },
  {
    name: "GoPro HERO12 Black Action Camera",
    brand: "GoPro",
    category: "Electronics",
    description: "Incredible image quality, even better HyperSmooth video stabilization and a huge boost in battery life come together in the ultimate action camera.",
    price: 45000,
    discountPrice: 38990,
    rating: 4.6,
    numReviews: 95,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Video Resolution", value: "5.3K60 + 4K120" },
      { name: "Photo Resolution", value: "27 MP" }
    ]
  },
  {
    name: "Anker PowerCore 26800mAh Power Bank",
    brand: "Anker",
    category: "Electronics",
    description: "Colossal capacity high-speed charging power bank for smartphones and laptops.",
    price: 6999,
    discountPrice: 4999,
    rating: 4.5,
    numReviews: 512,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1609592424074-1296c006841d?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1609592424074-1296c006841d?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Capacity", value: "26800 mAh" },
      { name: "Ports", value: "3 USB-A Output Ports" }
    ]
  },

  // 2. MOBILES
  {
    name: "Apple iPhone 15 Pro Max (256 GB) - Natural Titanium",
    brand: "Apple",
    category: "Mobiles",
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and a more versatile Pro camera system.",
    price: 159900,
    discountPrice: 148900,
    rating: 4.9,
    numReviews: 820,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80"
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Display", value: "6.7-inch Super Retina XDR OLED" },
      { name: "Processor", value: "A17 Pro Chip" },
      { name: "Camera", value: "48MP Main + 12MP Ultra Wide + 12MP Telephoto" }
    ]
  },
  {
    name: "Samsung Galaxy S24 Ultra 5G (512 GB)",
    brand: "Samsung",
    category: "Mobiles",
    description: "Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, unleash whole new levels of creativity, productivity and possibility.",
    price: 139999,
    discountPrice: 129999,
    rating: 4.8,
    numReviews: 610,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Display", value: "6.8-inch Quad HD+ Dynamic AMOLED 2X" },
      { name: "Processor", value: "Snapdragon 8 Gen 3 for Galaxy" },
      { name: "S-Pen", value: "Included" }
    ]
  },
  {
    name: "Google Pixel 8 Pro 5G",
    brand: "Google",
    category: "Mobiles",
    description: "The most powerful, personal Pixel yet. Designed by Google, built for AI, with advanced camera sensors and Tensor G3 processor.",
    price: 106999,
    discountPrice: 93999,
    rating: 4.6,
    numReviews: 240,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80"],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Processor", value: "Google Tensor G3" },
      { name: "Display", value: "6.7-inch Super Actua display" }
    ]
  },
  {
    name: "OnePlus 12 5G (Silky Black, 256 GB)",
    brand: "OnePlus",
    category: "Mobiles",
    description: "Smooth Beyond Belief. Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System for Mobile, 5400 mAh Battery with 100W SUPERVOOC.",
    price: 64999,
    discountPrice: 59999,
    rating: 4.7,
    numReviews: 430,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "RAM & Storage", value: "12GB RAM, 256GB ROM" },
      { name: "Charging", value: "100W SuperVOOC Fast Charge" }
    ]
  },

  // 3. LAPTOPS
  {
    name: "Apple MacBook Pro 16-inch M3 Max (36GB, 1TB SSD)",
    brand: "Apple",
    category: "Laptops",
    description: "MacBook Pro blasts forward with the M3 Max chip. Built on 3-nanometer technology and featuring an all-new GPU architecture.",
    price: 349900,
    discountPrice: 329900,
    rating: 4.9,
    numReviews: 145,
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80"
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Processor", value: "Apple M3 Max 14-Core CPU" },
      { name: "Display", value: "16.2-inch Liquid Retina XDR" },
      { name: "RAM", value: "36GB Unified Memory" }
    ]
  },
  {
    name: "ASUS ROG Zephyrus G16 Gaming Laptop (RTX 4080)",
    brand: "ASUS",
    category: "Laptops",
    description: "Ultra-thin OLED gaming laptop powered by Intel Core Ultra 9 and NVIDIA GeForce RTX 4080 GPU.",
    price: 249990,
    discountPrice: 229990,
    rating: 4.8,
    numReviews: 88,
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80"],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "GPU", value: "NVIDIA GeForce RTX 4080 12GB" },
      { name: "Display", value: "16-inch 2.5K 240Hz OLED" }
    ]
  },
  {
    name: "Dell XPS 13 Intel Core Ultra 7 Ultrabook",
    brand: "Dell",
    category: "Laptops",
    description: "Iconic design crafted with CNC machined aluminum and Gorilla Glass 3. Exceptionally light and portable.",
    price: 159990,
    discountPrice: 145990,
    rating: 4.6,
    numReviews: 120,
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Weight", value: "1.19 kg" },
      { name: "Storage", value: "1TB PCIe NVMe SSD" }
    ]
  },

  // 4. FASHION
  {
    name: "Men's Premium Lambskin Leather Biker Jacket",
    brand: "LeatherCraft",
    category: "Fashion",
    description: "Crafted from 100% genuine lambskin leather. Features asymmetric zip closure, zippered cuffs, and soft viscose inner lining.",
    price: 14999,
    discountPrice: 8999,
    rating: 4.7,
    numReviews: 210,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Material", value: "100% Genuine Lambskin Leather" },
      { name: "Fit", value: "Slim Fit" }
    ]
  },
  {
    name: "Women's Oversized Denim Jacket",
    brand: "Levi's",
    category: "Fashion",
    description: "Classic vintage denim jacket with modern oversized silhouette. Durable 100% cotton denim.",
    price: 5999,
    discountPrice: 3999,
    rating: 4.6,
    numReviews: 175,
    stock: 40,
    imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Material", value: "100% Cotton Denim" },
      { name: "Care", value: "Machine Washable" }
    ]
  },
  {
    name: "Ray-Ban Aviator Classic Sunglasses",
    brand: "Ray-Ban",
    category: "Fashion",
    description: "Currently one of the most iconic sunglass models in the world. Ray-Ban Aviator Classic sunglasses were originally designed for U.S. aviators in 1937.",
    price: 11590,
    discountPrice: 9290,
    rating: 4.8,
    numReviews: 480,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Frame Material", value: "Metal Gold" },
      { name: "Lens Color", value: "G-15 Green Classic" }
    ]
  },

  // 5. SHOES
  {
    name: "Nike Air Jordan 1 Retro High OG",
    brand: "Nike",
    category: "Shoes",
    description: "The sneaker that started it all. Premium leather, responsive Air-Sole cushioning and iconic high-top silhouette.",
    price: 18995,
    discountPrice: 16995,
    rating: 4.9,
    numReviews: 950,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&q=80",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Upper Material", value: "Full Grain Leather" },
      { name: "Sole", value: "Rubber Outsole with Flex Grooves" }
    ]
  },
  {
    name: "Adidas Ultraboost Light Running Shoes",
    brand: "Adidas",
    category: "Shoes",
    description: "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole.",
    price: 18999,
    discountPrice: 13999,
    rating: 4.7,
    numReviews: 310,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Cushioning", value: "Light BOOST" },
      { name: "Outsole", value: "Continental Rubber" }
    ]
  },
  {
    name: "Puma RS-X Triple Sneakers",
    brand: "Puma",
    category: "Shoes",
    description: "RS-X is back. The future-retro silhouette of this sneaker returns with a progressive aesthetic and angular details.",
    price: 9999,
    discountPrice: 6499,
    rating: 4.5,
    numReviews: 180,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80"],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Style Code", value: "391928_01" }
    ]
  },

  // 6. FURNITURE
  {
    name: "Herman Miller Aeron Ergonomic Office Chair",
    brand: "Herman Miller",
    category: "Furniture",
    description: "The benchmark for ergonomic seating. Features Pellicle suspension material and PostureFit SL back support.",
    price: 145000,
    discountPrice: 129000,
    rating: 4.9,
    numReviews: 290,
    stock: 6,
    imageUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Warranty", value: "12 Years Official Warranty" },
      { name: "Adjustability", value: "Fully Adjustable Arms & Tilt" }
    ]
  },
  {
    name: "Nordic Minimalist Fabric 3-Seater Sofa",
    brand: "IKEA",
    category: "Furniture",
    description: "Spacious Scandinavian style sofa with high-resilience foam cushions and durable linen-blend upholstery.",
    price: 49999,
    discountPrice: 36999,
    rating: 4.6,
    numReviews: 140,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    freeDelivery: false,
    specifications: [
      { name: "Seating Capacity", value: "3 Persons" },
      { name: "Frame Material", value: "Solid Teak Wood" }
    ]
  },
  {
    name: "Solid Sheesham Wood Dining Table (6 Seater)",
    brand: "Urban Ladder",
    category: "Furniture",
    description: "Elegant 6-seater dining set crafted from 100% solid Sheesham wood with walnut finish.",
    price: 39999,
    discountPrice: 28999,
    rating: 4.7,
    numReviews: 95,
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: false,
    specifications: [
      { name: "Wood Type", value: "Sheesham Wood" },
      { name: "Finish", value: "Walnut Finish" }
    ]
  },

  // 7. HOME & KITCHEN
  {
    name: "Philips Digital Air Fryer HD9252/90",
    brand: "Philips",
    category: "Home & Kitchen",
    description: "Patented Rapid Air technology with unique starfish design pan lets you fry, bake, grill and roast with up to 90% less fat.",
    price: 12995,
    discountPrice: 8999,
    rating: 4.7,
    numReviews: 870,
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Capacity", value: "4.1 Liters" },
      { name: "Power", value: "1400 Watts" }
    ]
  },
  {
    name: "Nespresso Vertuo Pop Espresso Machine",
    brand: "Nespresso",
    category: "Home & Kitchen",
    description: "Compact & colorful single-serve coffee machine using Centrifusion technology for rich crema espressos.",
    price: 17900,
    discountPrice: 14990,
    rating: 4.8,
    numReviews: 230,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Water Tank", value: "600ml" },
      { name: "Coffee Cup Sizes", value: "Espresso, Double Espresso, Gran Lungo, Mug" }
    ]
  },
  {
    name: "Dyson V15 Detect Cordless Vacuum Cleaner",
    brand: "Dyson",
    category: "Home & Kitchen",
    description: "Dyson's most intelligent cordless vacuum with laser technology revealing microscopic dust.",
    price: 65900,
    discountPrice: 59900,
    rating: 4.9,
    numReviews: 310,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80"],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Run Time", value: "Up to 60 Minutes" },
      { name: "Suction Power", value: "240 AW" }
    ]
  },

  // 8. BEAUTY
  {
    name: "Estée Lauder Advanced Night Repair Serum (50ml)",
    brand: "Estée Lauder",
    category: "Beauty",
    description: "Deep and fast night renewal serum for skin that looks smoother, less lined, younger, radiant and even-toned.",
    price: 10500,
    discountPrice: 8900,
    rating: 4.9,
    numReviews: 640,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Volume", value: "50 ml" },
      { name: "Skin Type", value: "All Skin Types" }
    ]
  },
  {
    name: "Dyson Airwrap Multi-Styler Complete Long",
    brand: "Dyson",
    category: "Beauty",
    description: "Style with air, not extreme heat. Re-engineered attachments harness Enhanced Coanda airflow to create your styles.",
    price: 49900,
    discountPrice: 45900,
    rating: 4.8,
    numReviews: 420,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Technology", value: "Coanda Air Styling" },
      { name: "Heat Settings", value: "3 Precise Heat Settings" }
    ]
  },
  {
    name: "MAC Matte Lipstick - Velvet Teddy",
    brand: "MAC",
    category: "Beauty",
    description: "The iconic product that made M·A·C famous. Long-wearing formula with high color payoff and a creamy matte finish.",
    price: 2200,
    discountPrice: 1870,
    rating: 4.7,
    numReviews: 1200,
    stock: 60,
    imageUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Finish", value: "Creamy Matte" },
      { name: "Shade", value: "Deep-tone Beige Nude" }
    ]
  },

  // 9. GROCERY
  {
    name: "Starbucks Dark Roast Whole Bean Coffee (1kg)",
    brand: "Starbucks",
    category: "Grocery",
    description: "100% Arabica dark roast coffee beans with full-bodied, bold and smoky flavors.",
    price: 2499,
    discountPrice: 1999,
    rating: 4.8,
    numReviews: 380,
    stock: 45,
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Weight", value: "1 kg" },
      { name: "Bean Type", value: "100% Arabica" }
    ]
  },
  {
    name: "Borges Extra Virgin Olive Oil (2 Liters)",
    brand: "Borges",
    category: "Grocery",
    description: "First cold pressed Spanish Extra Virgin Olive Oil ideal for salad dressings and healthy cooking.",
    price: 2999,
    discountPrice: 2199,
    rating: 4.7,
    numReviews: 290,
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Volume", value: "2 Liters" },
      { name: "Origin", value: "Spain" }
    ]
  },

  // 10. SPORTS
  {
    name: "Manduka PRO Yoga Mat (6mm Thick)",
    brand: "Manduka",
    category: "Sports",
    description: "An ultra-dense and spacious performance yoga mat that has unmatched comfort and cushioning.",
    price: 11900,
    discountPrice: 9499,
    rating: 4.9,
    numReviews: 160,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80"],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Thickness", value: "6 mm" },
      { name: "Lifetime Guarantee", value: "Yes" }
    ]
  },
  {
    name: "Bowflex SelectTech 552 Adjustable Dumbbells (Pair)",
    brand: "Bowflex",
    category: "Sports",
    description: "Combines 15 sets of weights into one using a unique dial system to adjust weights from 5 to 52.5 lbs.",
    price: 42999,
    discountPrice: 34999,
    rating: 4.8,
    numReviews: 540,
    stock: 10,
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: false,
    specifications: [
      { name: "Weight Range", value: "5 to 52.5 lbs per dumbbell" }
    ]
  },

  // 11. WATCHES
  {
    name: "Fossil Gen 6 Touchscreen Smartwatch",
    brand: "Fossil",
    category: "Watches",
    description: "Faster performance with Snapdragon Wear 4100+ platform. Continuous heart rate monitoring, SpO2 sensor and fast charging.",
    price: 24995,
    discountPrice: 16995,
    rating: 4.5,
    numReviews: 320,
    stock: 22,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Case Size", value: "44 mm" },
      { name: "OS", value: "Wear OS by Google" }
    ]
  },
  {
    name: "Seiko Automatic Sports Watch (SSK001)",
    brand: "Seiko",
    category: "Watches",
    description: "Classic GMT automatic watch with rotating 24-hour bezel, stainless steel bracelet and Lumibrite hands.",
    price: 45000,
    discountPrice: 38250,
    rating: 4.9,
    numReviews: 190,
    stock: 14,
    imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Movement", value: "Automatic Caliber 4R34" },
      { name: "Water Resistance", value: "100 Meters" }
    ]
  },

  // 12. BOOKS
  {
    name: "Atomic Habits by James Clear (Hardcover Collector's Edition)",
    brand: "Penguin Random House",
    category: "Books",
    description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones. Over 15 million copies sold worldwide.",
    price: 1299,
    discountPrice: 799,
    rating: 4.9,
    numReviews: 2400,
    stock: 100,
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Format", value: "Hardcover" },
      { name: "Pages", value: "320 Pages" }
    ]
  },
  {
    name: "The Psychology of Money by Morgan Housel",
    brand: "Harriman House",
    category: "Books",
    description: "Timeless lessons on wealth, greed, and happiness doing well with money isn’t necessarily about what you know. It’s about how you behave.",
    price: 499,
    discountPrice: 349,
    rating: 4.8,
    numReviews: 1800,
    stock: 80,
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Format", value: "Paperback" },
      { name: "Language", value: "English" }
    ]
  },

  // 13. TOYS
  {
    name: "LEGO Creator Expert Porsche 911 (1458 Pieces)",
    brand: "LEGO",
    category: "Toys",
    description: "Build a detailed classic Porsche 911 Turbo or Targa model car with air-cooled engine, steering and gearshift.",
    price: 16999,
    discountPrice: 13999,
    rating: 4.9,
    numReviews: 310,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Piece Count", value: "1458 Pieces" },
      { name: "Age Group", value: "18+" }
    ]
  },
  {
    name: "DJI Mini 3 Pro Drone with Smart Controller",
    brand: "DJI",
    category: "Toys",
    description: "Lightweight sub-249g foldable camera drone featuring 4K60fps HDR video, tri-directional obstacle sensing and 34-min flight time.",
    price: 89900,
    discountPrice: 79900,
    rating: 4.8,
    numReviews: 220,
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&q=80"],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Takeoff Weight", value: "< 249 g" },
      { name: "Video Resolution", value: "4K/60fps HDR" }
    ]
  },

  // 14. GAMING
  {
    name: "Sony PlayStation 5 Console (Slim Disc Edition)",
    brand: "Sony",
    category: "Gaming",
    description: "Unleash new gaming possibilities with custom CPU, GPU and SSD with Integrated I/O that rewrite the rules of what a PlayStation console can do.",
    price: 54990,
    discountPrice: 49990,
    rating: 4.9,
    numReviews: 1420,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80"
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Storage", value: "1TB Ultra-High Speed SSD" },
      { name: "Audio", value: "Tempest 3D AudioTech" }
    ]
  },
  {
    name: "Logitech G PRO X 2 LIGHTSPEED Wireless Gaming Headset",
    brand: "Logitech",
    category: "Gaming",
    description: "Pro-grade gaming headset designed with 50 mm Graphene drivers, Bluetooth and LIGHTSPEED wireless connectivity.",
    price: 24995,
    discountPrice: 20995,
    rating: 4.7,
    numReviews: 280,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1599669454699-248893623440?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Battery Life", value: "Up to 50 Hours" },
      { name: "Wireless Range", value: "30 Meters" }
    ]
  },
  {
    name: "Razer BlackWidow V4 Pro Mechanical Gaming Keyboard",
    brand: "Razer",
    category: "Gaming",
    description: "Full-blown battlestation mechanical keyboard with Razer Command Dial, 8 dedicated macro keys, and immersive Chroma RGB lighting.",
    price: 22999,
    discountPrice: 18999,
    rating: 4.6,
    numReviews: 190,
    stock: 25,
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80"],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    freeDelivery: true,
    specifications: [
      { name: "Switch Type", value: "Razer Green Mechanical Switches" }
    ]
  },

  // 15. ACCESSORIES
  {
    name: "Peak Design Everyday Backpack 20L (V2)",
    brand: "Peak Design",
    category: "Accessories",
    description: "An iconic, award-winning pack built for everyday carry and photo gear setup with MagLatch hardware and FlexFold dividers.",
    price: 27999,
    discountPrice: 23999,
    rating: 4.9,
    numReviews: 310,
    stock: 18,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Capacity", value: "20 Liters" },
      { name: "Laptop Carry", value: "Fits 15-inch MacBooks" }
    ]
  },
  {
    name: "Belkin 3-in-1 Wireless MagSafe Charger",
    brand: "Belkin",
    category: "Accessories",
    description: "Charge your iPhone, Apple Watch and AirPods simultaneously with 15W official MagSafe fast charging.",
    price: 13999,
    discountPrice: 11499,
    rating: 4.8,
    numReviews: 450,
    stock: 30,
    imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80",
    images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80"],
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    freeDelivery: true,
    specifications: [
      { name: "Output Power", value: "15W MagSafe Fast Charge" }
    ]
  }
];

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@shopnest.com",
      password: "password123",
      role: "admin",
      verified: true
    });

    await Product.insertMany(products);

    console.log(`✅ Successfully seeded ${products.length} realistic products across 15 categories!`);
    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

importData();

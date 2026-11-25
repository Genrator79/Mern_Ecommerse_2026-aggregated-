import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "./models/User";
import { Category } from "./models/Category";
import { Product } from "./models/Product";
import { Promo } from "./models/Promo";
import { Banner } from "./models/Banner";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mern-ecommerce";

async function seed() {
  console.log("==========================================");
  console.log("🌱 STARTING DATABASE SEEDING...");
  console.log("==========================================");

  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  // 1. CLEAR EXISTING DATA (Except preserved user data if needed, but here we reset clean)
  console.log("🧹 Cleaning old categories, products, banners, and promos...");
  await Category.deleteMany({});
  await Product.deleteMany({});
  await Promo.deleteMany({});
  await Banner.deleteMany({});

  // 2. SEED / UPDATE DEMO USERS
  console.log("👤 Setting up Admin and Customer accounts...");
  const adminPasswordHash = await bcrypt.hash("adminPassword123", 10);
  const customerPasswordHash = await bcrypt.hash("password123", 10);

  await User.findOneAndUpdate(
    { email: "abhijeet2026@gmail.com" },
    {
      $set: {
        name: "Abhijeet Admin",
        email: "abhijeet2026@gmail.com",
        password: adminPasswordHash,
        role: "admin",
        points: 500,
      },
    },
    { upsert: true, new: true },
  );

  await User.findOneAndUpdate(
    { email: "customer@example.com" },
    {
      $set: {
        name: "Alex Customer",
        email: "customer@example.com",
        password: customerPasswordHash,
        role: "user",
        points: 150,
      },
    },
    { upsert: true, new: true },
  );

  console.log("✅ Accounts configured:");
  console.log("   Admin:    abhijeet2026@gmail.com / adminPassword123");
  console.log("   Customer: customer@example.com / password123");

  // 3. SEED CATEGORIES (Distinct, clean, real-world)
  console.log("📁 Seeding Categories...");
  const categoriesData = [
    { name: "Jackets & Outerwear" },
    { name: "Hoodies & Sweatshirts" },
    { name: "T-Shirts & Polos" },
    { name: "Pants & Denim" },
    { name: "Sneakers & Footwear" },
    { name: "Accessories & Bags" },
  ];

  const createdCategories = await Category.insertMany(categoriesData);
  const catMap = new Map<string, mongoose.Types.ObjectId>();
  for (const cat of createdCategories) {
    catMap.set(cat.name, cat._id);
  }
  console.log(`✅ Seeded ${createdCategories.length} distinct categories`);

  // Admin user ID for product attribution
  const adminUser = await User.findOne({ email: "abhijeet2026@gmail.com" });
  const adminId = adminUser?._id;

  // 4. SEED BANNERS (Hero & Side Promo Banners)
  console.log("🖼️ Seeding Hero & Side Banners...");
  const bannersData = [
    {
      imageUrl:
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85",
      imagePublicId: "seed_hero_banner_1",
      createdBy: adminId,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1000&auto=format&fit=crop&q=85",
      imagePublicId: "seed_side_banner_1",
      createdBy: adminId,
    },
    {
      imageUrl:
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1000&auto=format&fit=crop&q=85",
      imagePublicId: "seed_side_banner_2",
      createdBy: adminId,
    },
  ];

  await Banner.insertMany(bannersData);
  console.log(`✅ Seeded ${bannersData.length} promotional banners`);

  // 5. SEED PRODUCTS (Realistic, high-res multi-image fashion items)
  console.log("👕 Seeding Products with multiple images, sizes, and colors...");

  const productsData = [
    {
      title: "Minimalist Leather Bomber Jacket",
      description:
        "Crafted from supple full-grain lambskin leather with a satin lining. Features premium custom hardware, ribbed collar and cuffs, and tailored interior pockets. Designed for enduring modern luxury and effortless layering.",
      category: catMap.get("Jackets & Outerwear"),
      brand: "Zara",
      price: 249,
      salePercentage: 15,
      stock: 22,
      status: "active",
      colors: ["Black", "Brown", "Navy"],
      sizes: ["S", "M", "L", "XL"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_jacket_1",
          isCover: true,
        },
        {
          url: "https://images.unsplash.com/photo-1520975954732-35dd22299614?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_jacket_2",
          isCover: false,
        },
        {
          url: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_jacket_3",
          isCover: false,
        },
      ],
      createdBy: adminId,
    },
    {
      title: "Heavyweight Boxy Fleece Hoodie",
      description:
        "Engineered with 480 GSM dense organic cotton fleece. Features double-lined architectural hood without drawstrings, dropped shoulders, and kangaroo pocket with hidden earphone loop. Pre-shrunk for the ideal boxy drape.",
      category: catMap.get("Hoodies & Sweatshirts"),
      brand: "Nike",
      price: 110,
      salePercentage: 0,
      stock: 35,
      status: "active",
      colors: ["Black", "Grey", "Olive", "Navy"],
      sizes: ["S", "M", "L", "XL"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_hoodie_1",
          isCover: true,
        },
        {
          url: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_hoodie_2",
          isCover: false,
        },
      ],
      createdBy: adminId,
    },
    {
      title: "Vintage Washed Oversized Tee",
      description:
        "Made from 240 GSM heavy jersey ring-spun combed cotton. Acid enzyme washed for an authentic vintage handfeel and faded seam aesthetics. Reinforced neckband prevents stretching wash after wash.",
      category: catMap.get("T-Shirts & Polos"),
      brand: "Uniqlo",
      price: 45,
      salePercentage: 20,
      stock: 40,
      status: "active",
      colors: ["Black", "White", "Beige", "Charcoal"],
      sizes: ["S", "M", "L", "XL"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_tee_1",
          isCover: true,
        },
        {
          url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_tee_2",
          isCover: false,
        },
        {
          url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_tee_3",
          isCover: false,
        },
      ],
      createdBy: adminId,
    },
    {
      title: "Relaxed Fit Technical Cargo Pants",
      description:
        "Constructed with resilient cotton-ripstop blend with stretch mobility. Integrated adjustable waistband cords, ergonomic articulated knees, and magnetic flap utility pockets for urban functionality.",
      category: catMap.get("Pants & Denim"),
      brand: "H&M",
      price: 95,
      salePercentage: 10,
      stock: 18,
      status: "active",
      colors: ["Black", "Olive", "Tan"],
      sizes: ["S", "M", "L", "XL"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_pants_1",
          isCover: true,
        },
        {
          url: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_pants_2",
          isCover: false,
        },
      ],
      createdBy: adminId,
    },
    {
      title: "Urban Retro Low-Top Sneakers",
      description:
        "Premium Italian nappa leather upper with perforated toe box and suede overlays. Memory foam cushioned footbed paired with a vulcanized rubber cupsole for all-day comfort and timeless street aesthetic.",
      category: catMap.get("Sneakers & Footwear"),
      brand: "Adidas",
      price: 160,
      salePercentage: 25,
      stock: 15,
      status: "active",
      colors: ["White", "Black", "Navy"],
      sizes: ["S", "M", "L", "XL"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_sneakers_1",
          isCover: true,
        },
        {
          url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_sneakers_2",
          isCover: false,
        },
        {
          url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_sneakers_3",
          isCover: false,
        },
      ],
      createdBy: adminId,
    },
    {
      title: "Water-Resistant Technical Windbreaker Parka",
      description:
        "Triple-layer weatherproof shell with taped seams and breathable membrane. Equipped with YKK Aquaguard waterproof zippers, storm hood with visor, and deep fleece-lined handwarmer pockets.",
      category: catMap.get("Jackets & Outerwear"),
      brand: "Puma",
      price: 180,
      salePercentage: 0,
      stock: 25,
      status: "active",
      colors: ["Olive", "Black", "Yellow"],
      sizes: ["S", "M", "L", "XL"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_parka_1",
          isCover: true,
        },
        {
          url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_parka_2",
          isCover: false,
        },
      ],
      createdBy: adminId,
    },
    {
      title: "Structured Canvas Utility Weekender Bag",
      description:
        "High-density 16oz cotton canvas with full-grain leather trim and brass fittings. Features padded 16-inch laptop compartment, shoe compartment with exterior ventilation, and removable padded shoulder strap.",
      category: catMap.get("Accessories & Bags"),
      brand: "Calvin Klein",
      price: 135,
      salePercentage: 15,
      stock: 12,
      status: "active",
      colors: ["Tan", "Black", "Navy"],
      sizes: ["M", "L"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_bag_1",
          isCover: true,
        },
        {
          url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_bag_2",
          isCover: false,
        },
      ],
      createdBy: adminId,
    },
    {
      title: "Double-Breasted Wool Tailored Overcoat",
      description:
        "70% recycled Melton wool blend with a structured shoulder silhouette and notched lapel. Full cupro lining allows smooth layering over suits and heavy knitwear. Finished with genuine horn buttons.",
      category: catMap.get("Jackets & Outerwear"),
      brand: "Tommy Hilfiger",
      price: 320,
      salePercentage: 20,
      stock: 14,
      status: "active",
      colors: ["Charcoal", "Black", "Navy"],
      sizes: ["S", "M", "L", "XL"],
      images: [
        {
          url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_coat_1",
          isCover: true,
        },
        {
          url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
          publicId: "seed_coat_2",
          isCover: false,
        },
      ],
      createdBy: adminId,
    },
  ];

  await Product.insertMany(productsData);
  console.log(`✅ Seeded ${productsData.length} premium fashion products`);

  // 5. SEED ACTIVE PROMO CODES
  console.log("🎟️ Seeding Promo Codes...");
  const promosData = [
    {
      code: "WELCOME10",
      percentage: 10,
      count: 100,
      minimumOrderValue: 40,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
    {
      code: "SUPER20",
      percentage: 20,
      count: 50,
      minimumOrderValue: 100,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  ];

  await Promo.insertMany(promosData);
  console.log(`✅ Seeded ${promosData.length} promo codes: WELCOME10, SUPER20`);

  console.log("==========================================");
  console.log("🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("==========================================");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});

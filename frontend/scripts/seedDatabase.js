import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../backend/models/User.js'
import Brand from '../backend/models/Brand.js'
import Category from '../backend/models/Category.js'
import Product from '../backend/models/Product.js'
import Variant from '../backend/models/Variant.js'
import Menu from '../backend/models/Menu.js'
import { fileURLToPath } from 'url'
import path from 'path'



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 👇 EXPLICITLY load backend/.env
dotenv.config({
  path: path.resolve(__dirname, "../backend/.env"),
})

// ✅ DEBUG (temporary, keep for now)
console.log("ENV CHECK:", {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT,
})

const MONGODB_URI = process.env.MONGODB_URI
// dotenv.config()


// const MONGODB_URI = process.env.MONGODB_URI

async function seedDatabase() {
  try {
    // Connect to MongoDB
   await mongoose.connect(MONGODB_URI)

    console.log('Connected to MongoDB')

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Brand.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Variant.deleteMany({}),
      Menu.deleteMany({}),
    ])
    console.log('Cleared existing data')

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@nutristar.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      supercashBalance: 1000,
    })
    console.log('Created admin user')

    // Create sample users
    const users = await User.create([
      {
        name: 'User One',
        email: 'user1@example.com',
        password: await bcrypt.hash('user123', 10),
        phone: '9876543210',
        address: '123 Main St',
        city: 'Mumbai',
        pincode: '400001',
        supercashBalance: 500,
      },
      {
        name: 'User Two',
        email: 'user2@example.com',
        password: await bcrypt.hash('user123', 10),
        phone: '9876543211',
        address: '456 Oak Ave',
        city: 'Delhi',
        pincode: '110001',
        supercashBalance: 250,
      },
    ])
    console.log('Created sample users')

    // Create brands
    const brands = await Brand.create([
      { name: 'MyFitness', slug: 'myfitness', isActive: true },
      { name: 'Optimum Nutrition', slug: 'optimum-nutrition', isActive: true },
      { name: 'GNC', slug: 'gnc', isActive: true },
      { name: 'MuscleTech', slug: 'muscletech', isActive: true },
      { name: 'Dymatize', slug: 'dymatize', isActive: true },
    ])
    console.log('Created brands')

    // Create categories
    const categories = await Category.create([
      { name: 'Protein Powder', slug: 'protein-powder', isActive: true },
      { name: 'Pre-Workout', slug: 'pre-workout', isActive: true },
      { name: 'Vitamins & Minerals', slug: 'vitamins-minerals', isActive: true },
      { name: 'Amino Acids', slug: 'amino-acids', isActive: true },
      { name: 'Mass Gainers', slug: 'mass-gainers', isActive: true },
    ])
    console.log('Created categories')

    // Create products
    const products = await Product.create([
      {
        name: 'Whey Protein Concentrate',
        slug: 'whey-protein-concentrate',
        description: 'Premium whey protein with high protein content and minimal carbs',
        category: categories[0]._id,
        brand: brands[0]._id,
        basePrice: 1999,
        supercashReward: 100,
        benefits: ['Muscle Growth', 'Recovery', 'Strength'],
        isActive: true,
      },
      {
        name: 'Creatine Monohydrate',
        slug: 'creatine-monohydrate',
        description: 'Pure creatine monohydrate for muscle strength and power',
        category: categories[3]._id,
        brand: brands[1]._id,
        basePrice: 999,
        supercashReward: 50,
        benefits: ['Strength', 'Power', 'Endurance'],
        isActive: true,
      },
      {
        name: 'Pre-Workout Energy Booster',
        slug: 'pre-workout-energy',
        description: 'Advanced pre-workout formula with caffeine and amino acids',
        category: categories[1]._id,
        brand: brands[2]._id,
        basePrice: 1499,
        supercashReward: 75,
        benefits: ['Energy', 'Focus', 'Endurance'],
        isActive: true,
      },
      {
        name: 'Mass Gainer Pro',
        slug: 'mass-gainer-pro',
        description: 'High-calorie mass gainer with carbs and protein',
        category: categories[4]._id,
        brand: brands[3]._id,
        basePrice: 2499,
        supercashReward: 125,
        benefits: ['Muscle Gain', 'Weight Gain', 'Energy'],
        isActive: true,
      },
      {
        name: 'Multivitamin Complex',
        slug: 'multivitamin-complex',
        description: 'Complete multivitamin and mineral complex',
        category: categories[2]._id,
        brand: brands[4]._id,
        basePrice: 799,
        supercashReward: 40,
        benefits: ['Immunity', 'Energy', 'Health'],
        isActive: true,
      },
    ])
    console.log('Created products')

    // Create variants
    const variants = await Variant.create([
      {
        product: products[0]._id,
        sku: 'WPC-CHO-1KG',
        size: '1kg',
        flavor: 'Chocolate',
        price: 1999,
        mrp: 2499,
        stock: 50,
        isActive: true,
      },
      {
        product: products[0]._id,
        sku: 'WPC-VAN-1KG',
        size: '1kg',
        flavor: 'Vanilla',
        price: 1999,
        mrp: 2499,
        stock: 45,
        isActive: true,
      },
      {
        product: products[0]._id,
        sku: 'WPC-CHO-2KG',
        size: '2kg',
        flavor: 'Chocolate',
        price: 3699,
        mrp: 4499,
        stock: 30,
        isActive: true,
      },
      {
        product: products[1]._id,
        sku: 'CREAT-250G',
        size: '250g',
        flavor: 'Unflavored',
        price: 999,
        mrp: 1299,
        stock: 100,
        isActive: true,
      },
      {
        product: products[2]._id,
        sku: 'PRE-500G-FRUIT',
        size: '500g',
        flavor: 'Fruit Punch',
        price: 1499,
        mrp: 1799,
        stock: 60,
        isActive: true,
      },
      {
        product: products[3]._id,
        sku: 'MG-2KG-CHO',
        size: '2kg',
        flavor: 'Chocolate',
        price: 2499,
        mrp: 2999,
        stock: 25,
        isActive: true,
      },
      {
        product: products[4]._id,
        sku: 'MULTI-120TAB',
        size: '120 Tablets',
        flavor: 'N/A',
        price: 799,
        mrp: 999,
        stock: 80,
        isActive: true,
      },
    ])
    console.log('Created variants')

    // Create menu items
    await Menu.create([
      {
        title: 'Protein Supplements',
        categoryId: categories[0]._id,
        brandIds: [brands[0]._id, brands[1]._id],
        isMegaMenu: true,
        isFeatured: true,
        isActive: true,
        order: 1,
      },
      {
        title: 'Pre-Workout Boosters',
        categoryId: categories[1]._id,
        brandIds: [brands[2]._id, brands[3]._id],
        isMegaMenu: true,
        isFeatured: true,
        isActive: true,
        order: 2,
      },
      {
        title: 'Vitamins & Health',
        categoryId: categories[2]._id,
        brandIds: [brands[4]._id],
        isMegaMenu: true,
        isActive: true,
        order: 3,
      },
      {
        title: 'Mass Building',
        categoryId: categories[4]._id,
        brandIds: [brands[3]._id, brands[0]._id],
        isFeatured: true,
        isActive: true,
        order: 4,
      },
    ])
    console.log('Created menu items')

    console.log('Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()

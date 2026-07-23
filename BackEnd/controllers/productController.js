const Product = require("../models/product");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

// Get all products with Filtering, Sorting, Searching & Pagination
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      isFeatured,
      isBestSeller,
      isNewArrival,
      sort,
      page = 1,
      limit = 100, // Return all if limit not passed for flexibility
    } = req.query;

    let query = {};

    // Text search (name, brand, description)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "All") {
      query.category = { $regex: new RegExp(category.trim(), "i") };
    }

    // Brand filter
    if (brand && brand !== "All") {
      const brandList = brand.split(",");
      query.brand = { $in: brandList.map((b) => new RegExp(b.trim(), "i")) };
    }

    // Price Filter (checks price safely to avoid 0 maxPrice collapse)
    const minVal = minPrice !== "" && minPrice !== undefined ? Number(minPrice) : null;
    const maxVal = maxPrice !== "" && maxPrice !== undefined ? Number(maxPrice) : null;

    if ((minVal !== null && !isNaN(minVal) && minVal > 0) || (maxVal !== null && !isNaN(maxVal) && maxVal > 0)) {
      query.price = {};
      if (minVal !== null && !isNaN(minVal) && minVal > 0) {
        query.price.$gte = minVal;
      }
      if (maxVal !== null && !isNaN(maxVal) && maxVal > 0) {
        query.price.$lte = maxVal;
      }
    }

    // Rating Filter
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Badges Filter
    if (isFeatured === "true") query.isFeatured = true;
    if (isBestSeller === "true") query.isBestSeller = true;
    if (isNewArrival === "true") query.isNewArrival = true;

    // Sorting
    let sortOptions = {};
    if (sort === "price-asc") {
      sortOptions.price = 1;
    } else if (sort === "price-desc") {
      sortOptions.price = -1;
    } else if (sort === "rating-desc") {
      sortOptions.rating = -1;
    } else if (sort === "newest") {
      sortOptions.createdAt = -1;
    } else {
      sortOptions.createdAt = -1; // Default newest
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Fetch distinct metadata for filter sidebars
    const categories = await Product.distinct("category");
    const brands = await Product.distinct("brand");

    // If simple array is requested or fallback
    if (req.query.format === "array") {
      return res.json(products);
    }

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(totalProducts / limitNum) || 1,
      totalProducts,
      categories,
      brands,
    });
  } catch (error) {
    console.error("getProducts error:", error);
    res.status(500).json({ message: "Server error fetching products" });
  }
};

// GET /api/products/home - Combined single request endpoint for home sections
const getHomeProducts = async (req, res) => {
  try {
    const [featured, bestSellers, newArrivals, allProducts] = await Promise.all([
      Product.find({ isFeatured: true }).limit(8),
      Product.find({ isBestSeller: true }).limit(8),
      Product.find({ isNewArrival: true }).limit(8),
      Product.find({}).sort({ createdAt: -1 }).limit(12),
    ]);

    res.json({
      success: true,
      featured,
      bestSellers,
      newArrivals,
      products: allProducts,
    });
  } catch (error) {
    console.error("getHomeProducts error:", error);
    res.status(500).json({ success: false, message: "Error fetching home products" });
  }
};

// GET /api/products/featured
const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured products" });
  }
};

// GET /api/products/best-sellers
const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isBestSeller: true }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching best sellers" });
  }
};

// GET /api/products/new-arrivals
const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true }).limit(10);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching new arrivals" });
  }
};

// GET /api/products/category/:category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({
      category: { $regex: new RegExp(`^${category}$`, "i") },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching category products" });
  }
};

// GET /api/products/search?q=...
const searchProducts = async (req, res) => {
  try {
    const q = req.query.q || "";
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error searching products" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create product (Admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      discountPrice,
      category,
      stock,
      isFeatured,
      isBestSeller,
      isNewArrival,
      freeDelivery,
    } = req.body;

    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }

    const newProduct = new Product({
      name,
      brand: brand || "Generic",
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : Number(price) * 0.9,
      category,
      stock: Number(stock),
      imageUrl,
      images: imageUrl ? [imageUrl] : [],
      isFeatured: isFeatured === "true" || isFeatured === true,
      isBestSeller: isBestSeller === "true" || isBestSeller === true,
      isNewArrival: isNewArrival === "true" || isNewArrival === true,
      freeDelivery: freeDelivery !== "false",
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error creating product" });
  }
};

// Update product (Admin)
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      discountPrice,
      category,
      stock,
      isFeatured,
      isBestSeller,
      isNewArrival,
      freeDelivery,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.discountPrice = discountPrice !== undefined ? Number(discountPrice) : product.discountPrice;
    product.category = category || product.category;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    if (isFeatured !== undefined) product.isFeatured = isFeatured === "true" || isFeatured === true;
    if (isBestSeller !== undefined) product.isBestSeller = isBestSeller === "true" || isBestSeller === true;
    if (isNewArrival !== undefined) product.isNewArrival = isNewArrival === "true" || isNewArrival === true;
    if (freeDelivery !== undefined) product.freeDelivery = freeDelivery !== "false";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      product.imageUrl = result.secure_url;
      if (!product.images.includes(result.secure_url)) {
        product.images.push(result.secure_url);
      }
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating product" });
  }
};

// Delete product (Admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getProducts,
  getHomeProducts,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getProductsByCategory,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

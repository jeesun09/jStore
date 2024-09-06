import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

// Get all products - Admin Only
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); //find all products
    res.status(200).json({ products });
  } catch (error) {
    console.log("Error in getting all products: ", error.message);
    res.status(500).json({ message: "Server Error in getting all products" });
  }
};

// Get featured products
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      res.status(200).json(JSON.parse(featuredProducts));
    }
    // if there are no featured products in redis, get them from the database
    featuredProducts = await Product.find({ isFeatured: true }).lean(); //lean() is gonna return a plain JS object instead of a mongoose document, which is good for performance

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }
    // store the featured products in redis for quick access
    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.status(200).json(featuredProducts);
  } catch (error) {
    console.log("Error in getting featured products: ", error.message);
    res
      .status(500)
      .json({ message: "Server Error in getting featured products" });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }
    const product = await Product.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });

    res.status(201).json({ product });
  } catch (error) {
    console.log("Error in creating product: ", error.message);
    res.status(500).json({
      message: "Server Error in creating product",
      error: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0]; //this will get the id of the image
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.log("Error in deleting image from cloudinary: ", error.message);
      }
    }
    await product.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleting product: ", error.message);
    res.status(500).json({
      message: "Server Error in deleting product",
      error: error.message,
    });
  }
};

// Get Recommended Products
export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.status(200).json({ products });
  } catch (error) {
    console.log("Error in getting recommended products: ", error.message);
    res
      .status(500)
      .json({ message: "Server Error in getting recommended products" });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.status(200).json({ products });
  } catch (error) {
    console.log("Error in getting products by category: ", error.message);
    res
      .status(500)
      .json({ message: "Server Error in getting products by category" });
  }
};

// Toggle featured product
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      // update the product in redis
      await updateFeaturedProductsInRedis();
      res.status(200).json({ updatedProduct });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggling featured product: ", error.message);
    res
      .status(500)
      .json({ message: "Server Error in toggling featured product" });
  }
};
async function updateFeaturedProductsInRedis() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean(); //lean() is gonna return a plain JS object instead of a mongoose document, which is good for performance
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Error in updating featured products in redis: ", error.message);
  }
}

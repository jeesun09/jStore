import Product from "../models/product.model.js";

// Add to cart controller
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    res.status(200).json(user.cartItems);
  } catch (error) {
    console.log("Error in addToCart controller: ", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// remove all from cart controller
export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.status(200).json(user.cartItems);
  } catch (error) {
    console.log("Error in removeAllFromCart controller: ", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// update quantity of product in cart controller
export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.status(200).json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.status(200).json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.log("Error in updateQuantity controller: ", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// get cart products controller
export const getCartProducts = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });
    //add quantity to the products
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find(
        (cartItem) => cartItem.id === product.id
      );
      return { ...product.toJSON(), quantity: item.quantity };
    });
    res.json({ cartItems });
  } catch (error) {
    console.log("Error in getCartProducts controller: ", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

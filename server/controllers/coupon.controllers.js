import Coupon from "../models/coupon.model.js";

// get coupon controller
export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller: ", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// validate coupon controller
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      return res.status(400).json({ message: "Invalid Coupon" });
    }
    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon Expired" });
    }
    res.json({
      message: "Coupon Valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller: ", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



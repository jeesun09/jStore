import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getDailySalesData } from "../controllers/analytics.controllers.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const startDate = new Date();
    const endDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

    const dailySalesData = await getDailySalesData(startDate, endDate);
    res.status(200).json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.error("Error in getting analytics data: ", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";
import axios from "../lib/axios";
import toast from "react-hot-toast";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get("/products/recommendations");
        setRecommendations(response.data.products);
      } catch (error) {
        toast.error(
          error.response.data.message ||
            "An error occurred while fetching recommendations"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Display recommendations here */}
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;

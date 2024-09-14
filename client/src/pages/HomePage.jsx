import CategoryItem from "../components/CategoryItem";

const categories = [
  { href: "/jeans", name: "Jeans", imgUrl: "/images/jeans.jpg" },
  { href: "/tshirts", name: "T-shirts", imgUrl: "/images/tshirts.jpg" },
  { href: "/shoes", name: "Shoes", imgUrl: "/images/shoes.jpg" },
  { href: "/glasses", name: "Glasses", imgUrl: "/images/glasses.png" },
  { href: "/jackets", name: "Jackets", imgUrl: "/images/jackets.jpg" },
  { href: "/suits", name: "Suits", imgUrl: "/images/suits.jpg" },
  { href: "/bags", name: "Bags", imgUrl: "/images/bags.jpg" },
];

const HomePage = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:p-6 lg:px-8 py-16">
        <h1 className="text-center text-4xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in eco-friendly fashion
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <CategoryItem category={category} key={category.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  FaHome,
  FaBook,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaPlus,
  FaBars,
  FaSearch,
  FaUser,
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from "react-icons/fa";
import AddRecipe from '../../components/AddRecipe';
import RecipeDetails from '../../components/RecipeDetails';
import UserProfileModal from '../../components/UserProfileModal';

export default function HomePage() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [allRecipes, setAllRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [followerCount, setFollowerCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [followingRecipes, setFollowingRecipes] = useState([]);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const id = searchParams.get("userId");
    if (id) {
      setUserId(id);
      fetchUserInfo(id);
      fetchAllRecipes();
      fetchFollowingRecipes(id);
      fetchFollowerCount(id);
    }
  }, [searchParams]);

  const fetchUserInfo = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/recipewebv3/api/accfuntionality.php?operation=getUserInfo&user_id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("User data:", data);
        setUsername(data.username);
        setFullname(data.fullname);
        setProfileImageUrl(data.profile_image);
        console.log("Profile Image URL:", data.profile_image);
      } else {
        console.error("Failed to load user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchAllRecipes = async () => {
    try {
      const response = await fetch(
        "http://localhost/recipewebv3/api/accfuntionality.php?operation=getAllRecipes"
      );
      if (response.ok) {
        const data = await response.json();
        setAllRecipes(data);
        setFilteredRecipes(data);
      } else {
        console.error("Failed to load recipes");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const fetchFollowingRecipes = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/recipewebv3/api/accfuntionality.php?operation=getFollowingRecipes&user_id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setFollowingRecipes(data);
      } else {
        console.error("Failed to load following recipes");
      }
    } catch (error) {
      console.error("Error fetching following recipes:", error);
    }
  };

  const fetchFollowerCount = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/recipewebv3/api/accfuntionality.php?operation=getFollowerCount&user_id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setFollowerCount(data.follower_count);
      } else {
        console.error("Failed to load follower count");
      }
    } catch (error) {
      console.error("Error fetching follower count:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    router.push("/");
  };

  const filterRecipes = (query) => {
    setSearchQuery(query);
    const recipesToFilter = activeTab === "all" ? allRecipes : followingRecipes;
    const filtered = recipesToFilter.filter((recipe) => {
      const username = recipe.username.toLowerCase();
      const fullname = recipe.fullname.toLowerCase();
      const recipeName = recipe.recipe_name.toLowerCase();
      const mealtype = recipe.mealtype.toLowerCase();
      const searchLower = query.toLowerCase();

      return (
        username.includes(searchLower) ||
        fullname.includes(searchLower) ||
        recipeName.includes(searchLower) ||
        mealtype.includes(searchLower)
      );
    });
    setFilteredRecipes(filtered);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      setFilteredRecipes(allRecipes);
    } else {
      setFilteredRecipes(followingRecipes);
    }
    setSearchQuery("");
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const StarRating = ({ rating }) => {
    console.log('Raw rating:', rating); // Debug log

    // Ensure rating is a number between 0 and 5
    const numericRating = Math.min(Math.max(parseFloat(rating) || 0, 0), 5);
    console.log('Numeric rating:', numericRating); // Debug log

    const stars = [];
    const fullStars = Math.floor(numericRating);
    const hasHalfStar = numericRating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return (
      <div className="flex items-center">
        {stars}
        <span className="ml-1 text-sm text-gray-600">({numericRating.toFixed(1)})</span>
      </div>
    );
  };

  const RecipeCard = ({ recipe }) => {
    console.log('Recipe:', recipe); // Debug log
    console.log('Average rating:', recipe.average_rating); // Debug log

    return (
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
        onClick={() => setSelectedRecipe(recipe)}
      >
        <div className="relative pt-[66.67%]">
          <Image
            src={`http://localhost/recipewebv3/assets/images/${recipe.recipe_image}`}
            alt={recipe.recipe_name}
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{recipe.recipe_name}</h3>
          <StarRating rating={parseFloat(recipe.average_rating) || 0} />
          <p className="text-gray-600 text-sm my-2">{recipe.description}</p>
          <div className="flex items-center mt-2">
            {recipe.profile_image ? (
              <Image
                src={`http://localhost/recipewebv3/assets/${recipe.profile_image}`}
                alt={recipe.fullname}
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                <FaUser className="text-gray-600" />
              </div>
            )}
            <span 
              className="text-base font-semibold cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                handleUserClick({
                  user_id: recipe.user_id,
                  username: recipe.username,
                  fullname: recipe.fullname,
                  profile_image: recipe.profile_image
                });
              }}
            >
              {recipe.fullname}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const refreshRecipes = async () => {
    const response = await fetch('http://192.168.0.108/recipeshare-app-1/api/accfuntionality.php?operation=getAllRecipes');
    const data = await response.json();
    setAllRecipes(data);
    setFilteredRecipes(data);
  };

  const handleRecipeUpdate = () => {
    fetchAllRecipes();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-white w-64 min-h-screen p-4 fixed left-0 top-0 bottom-0 shadow-md z-20 transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="mb-8">
          <h1 className="text-2xl font-pacifico text-[#FF6B6B]">RecipeShare</h1>
        </div>
        <nav className="space-y-2">
          <Link href="/" className="flex items-center py-2 px-4 rounded text-[#FF6B6B]">
            <FaHome className="mr-2" /> Home
          </Link>
          <Link href="/my-recipes" className="flex items-center py-2 px-4 rounded text-gray-700">
            <FaBook className="mr-2" /> My Recipes
          </Link>
          <Link href="/settings" className="flex items-center py-2 px-4 rounded text-gray-700">
            <FaCog className="mr-2" /> Settings
          </Link>
          <Link href="/help" className="flex items-center py-2 px-4 rounded text-gray-700">
            <FaQuestionCircle className="mr-2" /> Help & Feedback
          </Link>
          <button onClick={handleLogout} className="flex items-center py-2 px-4 rounded text-gray-700 w-full text-left">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-[#FF6B6B] text-white p-4 sticky top-0 z-10 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white focus:outline-none mr-4"
            >
              <FaBars size={24} />
            </button>
            <h1 className="text-2xl font-pacifico">RecipeShare</h1>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search recipes..."
                className="pl-10 pr-4 py-2 rounded-full text-gray-800"
                value={searchQuery}
                onChange={(e) => filterRecipes(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                {profileImageUrl ? (
                  <Image
                    src={`http://localhost/recipewebv3/assets/${profileImageUrl}`}
                    alt={fullname || "User"}
                    width={40}
                    height={40}
                    className="rounded-full mr-2"
                    onError={(e) => {
                      console.error("Failed to load image:", e.target.src);
                      e.target.src = "/assets/images/user.png";
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    <FaUser className="text-gray-600" />
                  </div>
                )}
                <span>{fullname || "User"}</span>
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20">
                  <div className="bg-[#FF6B6B] text-white p-3">
                    <p className="font-bold">{fullname || "User"}</p>
                    <p className="text-sm">{username || "username"}</p>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-gray-600 mb-2">Followers: {followerCount}</p>
                    <button className="w-full bg-[#FF6B6B] text-white py-2 rounded-md text-sm hover:bg-[#FF8C8C] transition-colors duration-300">
                      View Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex mb-6">
              <button
                className={`mr-4 px-4 py-2 rounded ${activeTab === "all" ? "bg-[#FF6B6B] text-white" : "bg-gray-200"}`}
                onClick={() => handleTabChange("all")}
              >
                All Recipes
              </button>
              <button
                className={`px-4 py-2 rounded ${activeTab === "following" ? "bg-[#FF6B6B] text-white" : "bg-gray-200"}`}
                onClick={() => handleTabChange("following")}
              >
                Following
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.recipe_id} recipe={recipe} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddRecipeModalOpen(true)}
        className="fixed bottom-8 right-8 bg-[#FF6B6B] text-white p-4 rounded-full shadow-lg hover:bg-[#FF8C8C] transition-colors duration-300"
      >
        <FaPlus size={24} />
      </button>

      {/* Add Recipe Modal */}
      {isAddRecipeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#FF6B6B]">Add New Recipe</h2>
              <button
                onClick={() => setIsAddRecipeModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <AddRecipe userId={userId} onSuccess={() => {
              setIsAddRecipeModalOpen(false);
              refreshRecipes();
            }} />
          </div>
        </div>
      )}

      {/* Recipe Details Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#FF6B6B]">{selectedRecipe.recipe_name}</h2>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <RecipeDetails 
              recipe={selectedRecipe} 
              currentUserId={userId}
              onClose={() => setSelectedRecipe(null)}
              onUpdate={handleRecipeUpdate}
            />
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          currentUserId={userId}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
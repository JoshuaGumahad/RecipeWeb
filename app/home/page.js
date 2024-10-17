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
import loginBg from '../../assets/images/loginbg.jpeg';

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <FaStar
            key={index}
            className={`w-4 h-4 ${
              starValue <= rating ? 'text-yellow-400' : 'text-gray-600'
            }`}
          />
        );
      })}
      <span className="ml-2 text-sm text-gray-300">({rating.toFixed(1)})</span>
    </div>
  );
};

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
  const [displayedRecipes, setDisplayedRecipes] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);

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
      const searchLower = query.toLowerCase();
      return username.includes(searchLower) || fullname.includes(searchLower) || recipeName.includes(searchLower);
    });
    setDisplayedRecipes(filtered);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "all") {
      setDisplayedRecipes(allRecipes);
    } else {
      setDisplayedRecipes(followingRecipes);
    }
  };

  useEffect(() => {
    // Initialize displayed recipes with all recipes
    setDisplayedRecipes(allRecipes);
  }, [allRecipes]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserRecipes(user.user_id);
    fetchFollowerCount(user.user_id);
  };

  const refreshRecipes = async () => {
    const response = await fetch('http://localhost/recipeshare-app-1/api/accfuntionality.php?operation=getAllRecipes');
    const data = await response.json();
    setAllRecipes(data);
    setFilteredRecipes(data);
  };

  const handleRecipeUpdate = () => {
    fetchAllRecipes();
  };

  const closeModal = (setterFunction) => {
    return (e) => {
      if (e.target === e.currentTarget) {
        setterFunction(null);
      }
    };
  };

  const RecipeCard = ({ recipe }) => {
    // Parse the average_rating, defaulting to 0 if it's not a valid number
    const averageRating = parseFloat(recipe.average_rating) || 0;

    return (
      <div 
        className="bg-black bg-opacity-80 rounded-lg shadow-md overflow-hidden cursor-pointer border border-gray-700"
        onClick={() => setSelectedRecipe(recipe)}
      >
        <div className="relative pt-[75%]">
          <Image
            src={`http://localhost/recipewebv3/assets/images/${recipe.recipe_image}`}
            alt={recipe.recipe_name}
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 w-full h-full"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            {recipe.mealtype}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-white">{recipe.recipe_name}</h3>
          <div className="flex items-center">
            <StarRating rating={averageRating} />
            <span className="ml-2 text-sm text-gray-300">
              ({averageRating.toFixed(1)})
            </span>
          </div>
          <p className="text-gray-300 text-sm my-2">{recipe.description}</p>
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
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mr-2">
                <FaUser className="text-gray-300" />
              </div>
            )}
            <span 
              className="text-base font-semibold text-white hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                handleUserClick({
                  user_id: recipe.user_id,
                  fullname: recipe.fullname,
                  username: recipe.username,
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

  const fetchUserRecipes = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost/recipewebv3/api/accfuntionality.php?operation=getUserRecipes&user_id=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        setUserRecipes(data);
      } else {
        console.error("Failed to load user recipes");
      }
    } catch (error) {
      console.error("Error fetching user recipes:", error);
    }
  };

  return (
    <div className="min-h-screen relative font-sans">
      <Image
        src={loginBg}
        alt="Background"
        fill
        style={{ objectFit: 'cover' }}
        quality={100}
        priority
      />

      {/* Content Wrapper */}
      <div className="relative z-20 flex min-h-screen text-white">
        {/* Sidebar */}
        <aside className={`bg-black bg-opacity-80 w-64 min-h-screen p-4 fixed left-0 top-0 bottom-0 shadow-md z-30 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="mb-8">
            <h1 className="text-2xl font-pacifico text-white">RecipeShare</h1>
          </div>
          <nav className="space-y-2">
            <Link href="/" className="flex items-center py-2 px-4 rounded text-white hover:bg-gray-800">
              <FaHome className="mr-2" /> Home
            </Link>
            <Link href="/settings" className="flex items-center py-2 px-4 rounded text-white hover:bg-gray-800">
              <FaCog className="mr-2" /> Settings
            </Link>
            <Link href="/help" className="flex items-center py-2 px-4 rounded text-white hover:bg-gray-800">
              <FaQuestionCircle className="mr-2" /> Help & Feedback
            </Link>
            <button onClick={handleLogout} className="flex items-center py-2 px-4 rounded text-white hover:bg-gray-800 w-full text-left">
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Header */}
          <header className="bg-black bg-opacity-50 text-white p-4 sticky top-0 z-30 flex justify-between items-center">
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
                  className="pl-10 pr-4 py-2 rounded-full text-black bg-white bg-opacity-80"
                  value={searchQuery}
                  onChange={(e) => filterRecipes(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-600" />
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
                  <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-80 rounded-md shadow-lg overflow-hidden z-20">
                    <div className="p-3 border-b border-gray-700">
                      <p className="font-bold text-white">{fullname || "User"}</p>
                      <p className="text-sm text-gray-300">{username || "username"}</p>
                    </div>
                    <div className="p-3">
                      <p className="text-sm text-gray-300 mb-2">Followers: {followerCount}</p>
                      <button 
                        className="w-full bg-gray-700 text-white py-2 rounded-md text-sm hover:bg-gray-600 transition-colors duration-300"
                        onClick={() => {
                          setSelectedUser({
                            user_id: userId,
                            fullname: fullname,
                            username: username,
                            profile_image: profileImageUrl
                          });
                          setIsProfileDropdownOpen(false);
                        }}
                      >
                        View Recipes
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
                  className={`mr-4 px-4 py-2 rounded ${activeTab === "all" ? "bg-white text-black" : "bg-black bg-opacity-50 text-white"}`}
                  onClick={() => handleTabChange("all")}
                >
                  All Recipes
                </button>
                <button
                  className={`px-4 py-2 rounded ${activeTab === "following" ? "bg-white text-black" : "bg-black bg-opacity-50 text-white"}`}
                  onClick={() => handleTabChange("following")}
                >
                  Following
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedRecipes.map((recipe) => (
                  <RecipeCard key={recipe.recipe_id} recipe={recipe} />
                ))}
              </div>
            </div>
          </main>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setIsAddRecipeModalOpen(true)}
          className="fixed bottom-8 right-8 bg-white text-black p-4 rounded-full shadow-lg hover:bg-gray-200 transition-colors duration-300 z-30"
        >
          <FaPlus size={24} />
        </button>

        {/* Add Recipe Modal */}
        {isAddRecipeModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
               onClick={() => setIsAddRecipeModalOpen(false)}>
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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

        {/* User Profile Modal */}
        {selectedUser && (
          <UserProfileModal
            user={selectedUser}
            currentUserId={userId}
            onClose={() => setSelectedUser(null)}
            setSelectedRecipe={setSelectedRecipe}
          />
        )}

        {/* Recipe Details Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
               onClick={() => setSelectedRecipe(null)}>
            <div className="bg-black bg-opacity-80 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto text-white" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">{selectedRecipe.recipe_name}</h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-300 hover:text-white"
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
                onUpdate={() => {
                  fetchAllRecipes();
                  fetchFollowingRecipes(userId);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

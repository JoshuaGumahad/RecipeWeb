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
  FaUser
} from "react-icons/fa";

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

  useEffect(() => {
    const id = searchParams.get("userId");
    if (id) {
      setUserId(id);
      fetchUserInfo(id);
      fetchAllRecipes();
      fetchFollowingRecipes(id);  // Add this line
      fetchFollowerCount(id);
    }
  }, [searchParams]);

  const fetchUserInfo = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/recipeshare-app-1/api/accfuntionality.php?operation=getUserInfo&user_id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("User data:", data);
        setUsername(data.username);
        setFullname(data.fullname);
        setProfileImageUrl(data.profile_image);
        console.log("Profile Image URL:", data.profile_image); // Add this line
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
        "http://localhost/recipeshare-app-1/api/accfuntionality.php?operation=getAllRecipes"
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
        `http://localhost/recipeshare-app-1/api/accfuntionality.php?operation=getFollowingRecipes&user_id=${id}`
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
        `http://localhost/recipeshare-app-1/api/accfuntionality.php?operation=getFollowerCount&user_id=${id}`
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

  const RecipeCard = ({ recipe }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <Image
          src={`http://localhost/recipeshare-app-1/assets/images/${recipe.recipe_image}`}
          alt={recipe.recipe_name}
          width={300}
          height={200}
          className="w-full h-48 object-cover"
          priority
        />
        <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
          {recipe.mealtype.split(',').map((type, index) => (
            <span key={index} className="bg-[#FF6B6B] text-white text-xs px-2 py-1 rounded-full">
              {type.trim()}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{recipe.recipe_name}</h3>
        <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
        <div className="flex items-center">
          {recipe.profile_image ? (
            <Image
              src={`http://localhost/recipeshare-app-1/assets/${recipe.profile_image}`}
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
          <span className="text-base font-semibold">{recipe.fullname}</span>
        </div>
      </div>
    </div>
  );

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
                    src={`http://localhost/recipeshare-app-1/assets/${profileImageUrl}`}
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
      <Link
        href="/add-recipe"
        className="fixed bottom-8 right-8 bg-[#FF6B6B] text-white p-4 rounded-full shadow-lg hover:bg-[#FF8C8C] transition-colors duration-300"
      >
        <FaPlus size={24} />
      </Link>
    </div>
  );
}
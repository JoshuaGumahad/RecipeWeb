"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaHome,
  FaBook,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaPlus,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function HomePage() {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [fullname, setFullname] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const id = searchParams.get("userId");
    if (id) {
      setUserId(id);
      fetchUserInfo(id);
    }
  }, [searchParams]);

  const fetchUserInfo = async (id) => {
    try {
      const response = await fetch(
        `http://localhost/recipeshare-app-1/api/accfuntionality.php?operation=getUserInfo&user_id=${id}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setFullname(data.fullname);
        // Prepend the base URL to the profile image path
        setProfileImageUrl(
          data.profile_image
            ? `http://localhost/recipeshare-app-1/${data.profile_image}`
            : null
        );
      } else {
        console.error("Failed to load user info");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const handleLogout = () => {
    // Implement logout logic here
    router.push("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="h-56 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/bg.jpg')" }}>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <h2 className="text-2xl font-pacifico text-[#FF6B6B]">RecipeShare</h2>
            <div className="flex items-center mt-4">
              <div className="w-16 h-16 rounded-full bg-white overflow-hidden flex items-center justify-center">
                <span className="text-3xl text-[#FF6B6B]">👤</span>
              </div>
              <div className="ml-3">
                <p className="font-bold">{fullname || "User"}</p>
                <p className="text-sm">@{username || "user"}</p>
              </div>
            </div>
          </div>
        </div>
        <nav className="p-4">
          <Link href="/" className="flex items-center py-2 hover:bg-gray-100">
            <FaHome className="text-[#FF6B6B] mr-2" /> Home
          </Link>
          <Link href="/my-recipes" className="flex items-center py-2 hover:bg-gray-100">
            <FaBook className="text-[#FF6B6B] mr-2" /> My Recipes
          </Link>
          <hr className="my-2" />
          <Link href="/settings" className="flex items-center py-2 hover:bg-gray-100">
            <FaCog className="text-[#FF6B6B] mr-2" /> Settings
          </Link>
          <Link href="/help" className="flex items-center py-2 hover:bg-gray-100">
            <FaQuestionCircle className="text-[#FF6B6B] mr-2" /> Help & Feedback
          </Link>
          <hr className="my-2" />
          <button onClick={handleLogout} className="flex items-center py-2 hover:bg-gray-100 w-full text-left">
            <FaSignOutAlt className="text-[#FF6B6B] mr-2" /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#FF6B6B] text-white p-4 flex justify-between items-center">
          <div className="w-8"></div>
          <h1 className="text-2xl font-bold">RecipeShare</h1>
          <div className="w-8"></div>
        </header>

        {/* Content */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`fixed top-4 left-4 z-40 p-2 rounded-full bg-[#FF6B6B] text-white focus:outline-none transition-all duration-300 ease-in-out ${
              isSidebarOpen ? 'left-68' : 'left-4'
            }`}
          >
            {isSidebarOpen ? <FaBars /> : <FaBars />}
          </button>

          <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-3xl font-pacifico text-[#FF6B6B] text-center mb-8">
              Welcome to RecipeShare!
            </h2>

            {/* Recipe Sections */}
            {[1, 2].map((section) => (
              <div key={section} className="mb-8">
                <h3 className="text-xl font-bold mb-4">Featured Recipes {section}</h3>
                <div className="flex overflow-x-auto pb-4 -mx-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="flex-none w-40 mx-2">
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-24 bg-gray-300"></div>
                        <div className="p-3">
                          <h4 className="font-bold">Recipe {index}</h4>
                          <p className="text-sm text-gray-600">A delicious recipe description</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Floating Action Button */}
        <Link
          href="/add-recipe"
          className="fixed bottom-6 right-6 bg-[#FF6B6B] text-white p-4 rounded-full shadow-lg"
        >
          <FaPlus />
        </Link>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaUser, FaTimes } from 'react-icons/fa';

export default function UserProfileModal({ user, currentUserId, onClose, setSelectedRecipe }) {
  const [userRecipes, setUserRecipes] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserRecipes(user.user_id);
      fetchFollowerCount(user.user_id);
      checkFollowStatus(currentUserId, user.user_id);
    }
  }, [user, currentUserId]);

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

  const fetchFollowerCount = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost/recipewebv3/api/accfuntionality.php?operation=getFollowerCount&user_id=${userId}`
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

  const checkFollowStatus = async (followerId, followedId) => {
    try {
      const response = await fetch(
        `http://localhost/recipewebv3/api/accfuntionality.php?operation=checkFollowStatus&follower_id=${followerId}&followed_id=${followedId}`
      );
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.is_following);
      } else {
        console.error("Failed to check follow status");
      }
    } catch (error) {
      console.error("Error checking follow status:", error);
    }
  };

  const handleFollowUnfollow = async () => {
    try {
      const response = await fetch('http://localhost/recipewebv3/api/accfuntionality.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `operation=followUnfollowUser&follower_id=${currentUserId}&followed_id=${user.user_id}`,
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsFollowing(!isFollowing);
          fetchFollowerCount(user.user_id);
        }
      } else {
        console.error("Failed to follow/unfollow user");
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-80 rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">{user.fullname}'s Profile</h2>
          <button onClick={onClose} className="text-gray-300 hover:text-white">
            <FaTimes />
          </button>
        </div>
        <div className="flex items-center mb-4">
          {user.profile_image ? (
            <Image
              src={`http://localhost/recipewebv3/assets/${user.profile_image}`}
              alt={user.fullname}
              width={64}
              height={64}
              className="rounded-full mr-4"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center mr-4">
              <FaUser className="text-gray-300 text-2xl" />
            </div>
          )}
          <div>
            <p className="font-semibold">{user.fullname}</p>
            <p className="text-gray-300">@{user.username}</p>
            <p className="text-gray-300">Followers: {followerCount}</p>
            {currentUserId !== user.user_id && (
              <button
                onClick={handleFollowUnfollow}
                className={`mt-2 px-4 py-2 rounded ${
                  isFollowing ? 'bg-gray-600 text-white' : 'bg-white text-black'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Recipes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userRecipes.map((recipe) => (
            <div 
              key={recipe.recipe_id} 
              className="border border-gray-700 rounded-lg p-4 cursor-pointer"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <Image
                src={`http://localhost/recipewebv3/assets/images/${recipe.recipe_image}`}
                alt={recipe.recipe_name}
                width={200}
                height={150}
                className="rounded-lg mb-2"
              />
              <h4 className="font-semibold">{recipe.recipe_name}</h4>
              <p className="text-gray-300">{recipe.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaUser, FaTimes, FaEdit, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import EditRecipe from './EditRecipe';

export default function UserProfileModal({ user, currentUserId, onClose, setSelectedRecipe, onEditRecipe }) {
  const [userRecipes, setUserRecipes] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

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

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
  };

  const handleEditSuccess = async (updatedRecipe) => {
    setEditingRecipe(null);
    if (updatedRecipe && updatedRecipe.recipe_id) {
      // Update the recipes list with the edited recipe
      setUserRecipes(prevRecipes => 
        prevRecipes.map(recipe => 
          recipe.recipe_id === updatedRecipe.recipe_id ? updatedRecipe : recipe
        )
      );
    }
    // Fetch updated recipes to ensure we have the latest data
    await fetchUserRecipes(user.user_id);
    onEditRecipe();
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-80 rounded-lg p-8 w-11/12 max-w-6xl max-h-[90vh] overflow-y-auto text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{user.fullname}'s Profile</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FaTimes size={24} />
          </button>
        </div>
        
        <div className="flex items-center mb-8">
          <div className="mr-6">
            {user.profile_image ? (
              <Image
                src={`http://localhost/recipewebv3/assets/${user.profile_image}`}
                alt={user.fullname}
                width={100}
                height={100}
                className="rounded-full"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                <FaUser className="text-gray-400 text-4xl" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-semibold">{user.fullname}</h3>
            <p className="text-gray-400 mb-2">@{user.username}</p>
            <p className="text-gray-300 mb-3">Followers: {followerCount}</p>
            {currentUserId !== user.user_id && (
              <button
                onClick={handleFollowUnfollow}
                className={`px-4 py-2 rounded-full flex items-center ${
                  isFollowing ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {isFollowing ? <FaUserMinus className="mr-2" /> : <FaUserPlus className="mr-2" />}
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold mb-4">Recipes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userRecipes.map((recipe) => (
            <div 
              key={recipe.recipe_id} 
              className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer relative hover:bg-gray-700 transition-colors duration-200"
              onClick={() => setSelectedRecipe(recipe)}
            >
              <div className="relative">
                <Image
                  src={`http://localhost/recipewebv3/assets/images/${recipe.recipe_image}`}
                  alt={recipe.recipe_name}
                  width={300}
                  height={200}
                  className="w-full object-cover"
                />
                {currentUserId === user.user_id && (
                  <button
                    className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-opacity duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditRecipe(recipe);
                    }}
                  >
                    <FaEdit className="text-white" />
                  </button>
                )}
              </div>
              <div className="p-4">
                <h4 className="text-xl font-semibold mb-2">{recipe.recipe_name}</h4>
                <p className="text-gray-400 line-clamp-2">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Recipe Modal */}
        {editingRecipe && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
            <div className="bg-black bg-opacity-80 rounded-lg p-6 w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto text-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">Edit Recipe</h3>
                <button
                  onClick={() => setEditingRecipe(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes size={20} />
                </button>
              </div>
              <EditRecipe
                recipe={editingRecipe}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditingRecipe(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

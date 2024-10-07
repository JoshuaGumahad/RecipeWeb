import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';

const UserProfileModal = ({ user, currentUserId, onClose }) => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchUserRecipes();
    fetchFollowerCount();
    if (currentUserId !== user.user_id) {
      checkFollowStatus();
    }
  }, [user.user_id, currentUserId]);

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch(`http://localhost/recipewebv3/api/accfuntionality.php?operation=getUserRecipes&user_id=${user.user_id}`);
      if (response.ok) {
        const data = await response.json();
        setUserRecipes(data);
      } else {
        console.error('Failed to load user recipes');
      }
    } catch (error) {
      console.error('Error fetching user recipes:', error);
    }
  };

  const fetchFollowerCount = async () => {
    try {
      const response = await fetch(`http://localhost/recipewebv3/api/accfuntionality.php?operation=getFollowerCount&user_id=${user.user_id}`);
      if (response.ok) {
        const data = await response.json();
        setFollowerCount(data.follower_count);
      } else {
        console.error('Failed to load follower count');
      }
    } catch (error) {
      console.error('Error fetching follower count:', error);
    }
  };

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`http://localhost/recipewebv3/api/accfuntionality.php?operation=checkFollowStatus&follower_id=${currentUserId}&followed_id=${user.user_id}`);
      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.is_following);
      } else {
        console.error('Failed to check follow status');
      }
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const followUnfollowUser = async () => {
    if (currentUserId === user.user_id) {
      alert("You cannot follow your own account");
      return;
    }

    try {
      const response = await fetch('http://localhost/recipewebv3/api/accfuntionality.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'operation': 'followUnfollowUser',
          'follower_id': currentUserId.toString(),
          'followed_id': user.user_id.toString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setFollowerCount(data.follower_count);
          setIsFollowing(data.is_following);
          alert(data.message);
        } else {
          alert(data.message);
        }
      } else {
        console.error('Failed to follow/unfollow user');
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#FF6B6B]">User Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="flex items-center mb-6">
          {user.profile_image ? (
            <Image
              src={`http://localhost/recipewebv3/assets/${user.profile_image}`}
              alt={user.fullname}
              width={80}
              height={80}
              className="rounded-full mr-4"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mr-4">
              <FaUser className="text-gray-600" size={40} />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold">{user.fullname}</h3>
            <p className="text-gray-600">@{user.username}</p>
            <p className="text-sm mt-2">Followers: {followerCount}</p>
          </div>
        </div>
        {currentUserId !== user.user_id && (
          <button
            onClick={followUnfollowUser}
            className={`mb-6 px-4 py-2 rounded ${isFollowing ? 'bg-gray-300 text-[#FF6B6B]' : 'bg-[#FF6B6B] text-white'}`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
        <h4 className="text-lg font-bold mb-4">User's Recipes</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userRecipes.map((recipe) => (
            <div key={recipe.recipe_id} className="bg-white rounded-lg shadow-md overflow-hidden">
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
                <h5 className="font-bold text-lg mb-2">{recipe.recipe_name}</h5>
                <p className="text-gray-600 text-sm">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;

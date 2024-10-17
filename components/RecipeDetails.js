import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaStar, FaRegStar, FaUser } from 'react-icons/fa';

const StarRating = ({ rating, onRatingChange = null }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`cursor-pointer ${onRatingChange ? 'hover:text-yellow-400' : ''}`}
          onClick={() => onRatingChange && onRatingChange(star)}
        >
          {star <= Math.round(rating) ? (
            <FaStar className="text-yellow-400" />
          ) : (
            <FaRegStar className="text-yellow-400" />
          )}
        </span>
      ))}
    </div>
  );
};

const RecipeDetails = ({ recipe, currentUserId, onClose, onUpdate }) => {
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetchComments();
    fetchRatings();
  }, [recipe.recipe_id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost/recipewebv3/api/accfuntionality.php?operation=getRatingsAndComments&recipe_id=${recipe.recipe_id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.ratings)) {
          setComments(data.ratings);
        }
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await fetch(`http://localhost/recipewebv3/api/accfuntionality.php?operation=getRecipeRatings&recipe_id=${recipe.recipe_id}&user_id=${currentUserId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAverageRating(parseFloat(data.average_rating) || 0);
          setUserRating(parseFloat(data.user_rating) || 0);
        }
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const handleRating = async (rating) => {
    try {
      const response = await fetch('http://localhost/recipewebv3/api/accfuntionality.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'operation': 'addRatingAndComment',
          'recipe_id': recipe.recipe_id.toString(),
          'user_id': currentUserId.toString(),
          'rating': rating.toString(),
          'comment': '', // Empty comment when just rating
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserRating(rating);
          setAverageRating(parseFloat(data.average_rating) || 0);
          fetchComments(); // Refresh comments and ratings
          onUpdate(); // Trigger update in parent component
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost/recipewebv3/api/accfuntionality.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'operation': 'addRatingAndComment',
          'recipe_id': recipe.recipe_id.toString(),
          'user_id': currentUserId.toString(),
          'rating': userRating.toString(),
          'comment': comment,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setComment('');
          fetchComments(); // Refresh comments
          fetchRatings(); // Refresh ratings
          onUpdate(); // Trigger update in parent component
        }
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
        <Image
          src={`http://localhost/recipewebv3/assets/images/${recipe.recipe_image}`}
          alt={recipe.recipe_name}
          layout="fill"
          objectFit="cover"
          className="rounded-lg absolute top-0 left-0 w-full h-full"
        />
      </div>
      <div className="flex items-center space-x-4">
        {recipe.profile_image ? (
          <Image
            src={`http://localhost/recipewebv3/assets/${recipe.profile_image}`}
            alt={recipe.fullname}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
            <FaUser className="text-gray-600" />
          </div>
        )}
        <div>
          <h3 className="font-bold text-lg">{recipe.fullname}</h3>
          <p className="text-gray-600">@{recipe.username}</p>
        </div>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Description</h3>
        <p>{recipe.description}</p>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Ingredients</h3>
        <p>{recipe.ingredients}</p>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Cooking Time</h3>
        <p>{recipe.cooking_time}</p>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Steps</h3>
        <ol className="list-decimal list-inside space-y-2">
          {recipe.steps.split('||').map((step, index) => (
            <li key={index}>{step.trim()}</li>
          ))}
        </ol>
      </div>
      <div>
        <h3 className="font-bold text-lg mb-2">Meal Type</h3>
        <div className="flex flex-wrap gap-2">
          {recipe.mealtype.split(',').map((type, index) => (
            <span key={index} className="bg-[#FF6B6B] text-white text-xs px-2 py-1 rounded-full">
              {type.trim()}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Rate this recipe</h3>
        <div className="flex items-center mb-2">
          <StarRating rating={userRating} onRatingChange={handleRating} />
          <span className="ml-2">Your rating: {userRating}</span>
        </div>
        <p className="mt-2">Average rating: {averageRating.toFixed(1)}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Comments</h3>
        <form onSubmit={handleComment} className="mb-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 bg-white rounded text-black"
            rows="3"
            placeholder="Add a comment..."
          ></textarea>
          <button type="submit" className="mt-2 bg-[#FF6B6B] text-white px-4 py-2 rounded">
            Post Comment
          </button>
        </form>
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="mb-2 p-2 bg-white rounded">
              <p className="font-semibold text-black">{comment.username}</p>
              <p className="text-black">{comment.comment}</p>
              <div className="mt-2">
                <StarRating rating={parseFloat(comment.rating)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;

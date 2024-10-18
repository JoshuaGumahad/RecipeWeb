import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FaCamera } from 'react-icons/fa';

const EditRecipe = ({ recipe, onSuccess, onCancel }) => {
  const [recipeName, setRecipeName] = useState(recipe.recipe_name);
  const [ingredients, setIngredients] = useState(recipe.ingredients);
  const [cookingTime, setCookingTime] = useState(recipe.cooking_time);
  const [description, setDescription] = useState(recipe.description);
  const [steps, setSteps] = useState(recipe.steps ? recipe.steps.split('||') : ['']);
  const [mealTypes, setMealTypes] = useState({
    breakfast: false,
    brunch: false,
    elevenses: false,
    lunch: false,
    tea: false,
    supper: false,
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(`http://localhost/recipewebv3/assets/images/${recipe.recipe_image}`);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const recipeTypes = recipe.mealtype.split(',');
    const updatedMealTypes = { ...mealTypes };
    recipeTypes.forEach(type => {
      updatedMealTypes[type.trim().toLowerCase()] = true;
    });
    setMealTypes(updatedMealTypes);
  }, [recipe.mealtype]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const handleMealTypeChange = (type) => {
    setMealTypes({ ...mealTypes, [type]: !mealTypes[type] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('operation', 'editRecipe');
    formData.append('recipe_id', recipe.recipe_id);
    formData.append('recipe_name', recipeName);
    formData.append('cooking_time', cookingTime);
    formData.append('ingredients', ingredients);
    formData.append('description', description);
    formData.append('mealtype', JSON.stringify(Object.keys(mealTypes).filter(key => mealTypes[key])));
    formData.append('steps', JSON.stringify(steps));
    if (image) {
      formData.append('recipe_image', image);
    }

    try {
      const response = await axios.post('http://localhost/recipewebv3/api/accfuntionality.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert('Recipe updated successfully');
        // Pass the updated recipe data back to the parent component
        onSuccess({
          ...recipe,
          recipe_name: recipeName,
          cooking_time: cookingTime,
          ingredients: ingredients,
          description: description,
          mealtype: Object.keys(mealTypes).filter(key => mealTypes[key]).join(','),
          steps: steps.join('||'),
          recipe_image: response.data.recipe_image || recipe.recipe_image
        });
      } else {
        alert(`Failed to update recipe: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error updating recipe:', error);
      alert('An error occurred while updating the recipe');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <div className="flex justify-center">
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-700">
          {previewUrl && (
            <Image src={previewUrl} alt="Recipe preview" layout="fill" objectFit="cover" />
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            Change Photo
          </button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Recipe Name"
        value={recipeName}
        onChange={(e) => setRecipeName(e.target.value)}
        className="w-full p-2 border rounded bg-gray-800 text-white"
        required
      />
      <textarea
        placeholder="Ingredients"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="w-full p-2 border rounded bg-gray-800 text-white"
        rows="3"
        required
      ></textarea>
      <input
        type="text"
        placeholder="Cooking Time"
        value={cookingTime}
        onChange={(e) => setCookingTime(e.target.value)}
        className="w-full p-2 border rounded bg-gray-800 text-white"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded bg-gray-800 text-white"
        rows="3"
        required
      ></textarea>
      <div>
        <h3 className="font-bold mb-2">Meal Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(mealTypes).map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={mealTypes[type]}
                onChange={() => handleMealTypeChange(type)}
                className="form-checkbox text-[#FF6B6B]"
              />
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-bold mb-2">Steps</h3>
        {steps.map((step, index) => (
          <div key={index} className="mb-2">
            <input
              type="text"
              placeholder={`Step ${index + 1}`}
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
              className="w-full p-2 border rounded bg-gray-800 text-white"
              required
            />
          </div>
        ))}
        <button type="button" onClick={addStep} className="text-[#FF6B6B]">
          + Add Step
        </button>
      </div>
      <div className="flex space-x-2">
        <button type="submit" className="flex-1 bg-[#FF6B6B] text-white p-2 rounded hover:bg-[#FF8C8C] transition-colors duration-300">
          Update Recipe
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-600 text-white p-2 rounded hover:bg-gray-700 transition-colors duration-300">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditRecipe;

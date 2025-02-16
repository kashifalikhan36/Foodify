import React, { useState } from 'react';
import { ChefHat, Clock, Users, Loader2, Utensils } from 'lucide-react';
import { generateRecipe } from './api';
import type { Recipe } from './types';

function App() {
  const [prompt, setPrompt] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const parseRecipe = (recipeText: string) => {
    // Regex patterns for extracting ingredients and instructions
    const ingredientsPattern = /Ingredients:(.*?)(?=Instructions:|$)/s;
    const instructionsPattern = /Instructions:(.*?)(?=Additional Ingredients|$)/s;

    // Match the ingredients and instructions sections
    const ingredientsMatch = recipeText.match(ingredientsPattern);
    const instructionsMatch = recipeText.match(instructionsPattern);

    // Parse the matched ingredients and instructions, split by new lines
    const ingredients = ingredientsMatch ? ingredientsMatch[1].trim().split('\n').filter(line => line.trim()) : [];
    const instructions = instructionsMatch ? instructionsMatch[1].trim().split('\n').filter(line => line.trim()) : [];

    console.log('Parsed Ingredients:', ingredients);
    console.log('Parsed Instructions:', instructions);

    return {
      ingredients,
      instructions,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const generatedRecipe = await generateRecipe(prompt);
      console.log('Raw Recipe:', generatedRecipe);

      // Parse the recipe string
      const { ingredients, instructions } = parseRecipe(generatedRecipe);

      // Set parsed data
      setRecipe({
        title: 'Generated Recipe', // Example, adjust as needed
        ingredients,
        instructions,
        cookingTime: '30 mins', // Example, adjust as needed
        servings: 4, // Example, adjust as needed
      });
    } catch (err) {
      setError('Failed to generate recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6 transform hover:scale-110 transition-transform duration-300">
            <ChefHat className="w-16 h-16 text-orange-500" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">AI Recipe Generator</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your culinary ideas into detailed recipes with the help of AI
          </p>
        </header>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mb-16">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., A healthy vegetarian pasta dish with mushrooms..."
                className="w-full p-6 rounded-2xl border-2 border-orange-200 focus:ring-4 focus:ring-orange-100 focus:border-orange-400 outline-none text-lg transition-all duration-300 pr-36"
              />
              <button
                type="submit"
                disabled={loading || !prompt}
                className="absolute right-2 top-2 px-6 py-4 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  'Generate'
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Be specific about ingredients, cooking style, or dietary restrictions
            </p>
          </div>
        </form>

        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm animate-fade-in">
            <p className="flex items-center gap-2">
              <span className="text-red-500">•</span>
              {error}
            </p>
          </div>
        )}

        {recipe ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 animate-fade-in">
              <div className="flex items-center gap-4 mb-8">
                <Utensils className="w-10 h-10 text-orange-500" />
                <h2 className="text-4xl font-bold text-gray-800">{recipe.title}</h2>
              </div>

              <div className="flex gap-8 mb-12 flex-wrap">
                {recipe.cookingTime && (
                  <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-lg">
                    <Clock className="w-6 h-6 text-orange-500" />
                    <span className="text-gray-700 font-medium">{recipe.cookingTime}</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-3 bg-orange-50 px-4 py-2 rounded-lg">
                    <Users className="w-6 h-6 text-orange-500" />
                    <span className="text-gray-700 font-medium">Serves {recipe.servings}</span>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-500 font-bold">1</span>
                    </span>
                    Ingredients
                  </h3>
                  <ul className="space-y-3">
                    {recipe.ingredients && recipe.ingredients.length > 0 ? (
                      recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-3 group">
                          <span className="text-orange-500 text-lg group-hover:scale-125 transition-transform">•</span>
                          <span className="text-gray-700">{ingredient}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No ingredients available.</li>
                    )}
                  </ul>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-500 font-bold">2</span>
                    </span>
                    Instructions
                  </h3>
                  <ol className="space-y-6">
                    {recipe.instructions && recipe.instructions.length > 0 ? (
                      recipe.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-4 group">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                            {index + 1}
                          </span>
                          <span className="text-gray-700">{instruction}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No instructions available.</li>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No recipe generated yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;

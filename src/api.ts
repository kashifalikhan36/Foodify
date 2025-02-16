interface GenerateRecipeRequest {
  text: string;
}

interface GenerateRecipeResponse {
  response_text: string;
}

export async function generateRecipe(prompt: string): Promise<string> {
  try {
    const url = "http://127.0.0.1:8000/foodify"; // Local FastAPI endpoint

    // Prepare the request body
    const body: GenerateRecipeRequest = { text: prompt };

    // Make the POST request to the local FastAPI server
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",  // Adding Accept header for good practice
      },
      body: JSON.stringify(body),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse the JSON response
    const data: GenerateRecipeResponse = await response.json();

    // Check if response_text exists
    if (!data.response_text) {
      throw new Error('No response_text found in the response');
    }

    // Return the processed response text
    return data.response_text;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}

// // Example usage
// generateRecipe("How to make a pizza?")
//   .then((recipe) => console.log("Recipe:", recipe))
//   .catch((error) => console.error("Error:", error));

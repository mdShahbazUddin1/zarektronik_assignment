// Import required modules
const fs = require("fs").promises;
const process = require("process");
const fetch = require("node-fetch");

// Get command line arguments
const command = process.argv[2];
const searchTerm = process.argv[3];

// Function to fetch jokes from the API based on a search term
async function getJokes(searchTerm) {
  // API URL for fetching jokes
  const apiUrl = `https://icanhazdadjoke.com/search?term=${searchTerm}`;

  try {
    // Fetch data from the API
    const response = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();

    // Check if there are any jokes in the response
    if (data.results && data.results.length > 0) {
      // Get a random joke from the results
      const randomJoke = getRandomJoke(data.results);

      // Display the joke and save it to a file
      console.log(`Here's a joke for you:\n${randomJoke.joke}`);
      await saveJokeToFile(randomJoke);
    } else {
      console.log("The joke gods are taking a day off!");
    }
  } catch (error) {
    console.error("Error fetching jokes from the API:", error.message);
  }
}

// Function to select a random joke from an array of jokes
function getRandomJoke(jokes) {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

// Function to save a joke to a file (jokes.txt)
async function saveJokeToFile(joke) {
  try {
    await fs.appendFile("jokes.txt", `${joke.joke}\n\n`);
    console.log("Joke saved to jokes.txt for future laughs!");
  } catch (err) {
    console.error("Error saving joke to file:", err);
  }
}

// Check if the command is valid and a search term is provided
if (command === "searchTerm" && searchTerm) {
  getJokes(searchTerm);
} else {
  // Display an error message for invalid command or missing search term
  console.error(
    "Please provide a valid command and search term. Usage: node script.js searchTerm <your_search_term>"
  );
}

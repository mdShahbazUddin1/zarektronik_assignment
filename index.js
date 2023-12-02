
const fs = require("fs").promises;
const process = require("process");
const fetch = require("node-fetch");

const command = process.argv[2];
const searchTerm = process.argv[3];


async function getJokes(searchTerm) {
  const apiUrl = `https://icanhazdadjoke.com/search?term=${searchTerm}`;
  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: "application/json" },
    });
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const randomJoke = getRandomJoke(data.results);
      console.log(`Here's a joke for you:\n${randomJoke.joke}`);
      await saveJokeToFile(randomJoke);
    } else {
      console.log(
        "The joke gods are taking a day off!"
      );
    }
  } catch (error) {
    console.error("Error fetching jokes from the API:", error.message);
  }
}

// Function to select a random joke 
function getRandomJoke(jokes) {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

// Function to save joke to a jokes.txt
async function saveJokeToFile(joke) {
  try {
    await fs.appendFile("jokes.txt", `${joke.joke}\n\n`);
    console.log("Joke saved to jokes.txt for future laughs!");
  } catch (err) {
    console.error("Error saving joke to file:", err);
  }
}


if (command === "searchTerm" && searchTerm) {
  getJokes(searchTerm);
} else {
  console.error(
    "Please provide a valid command and search term. Usage: node script.js searchTerm <your_search_term>"
  );
}

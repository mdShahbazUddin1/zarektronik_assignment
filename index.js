// Import required modules
const fs = require("fs");
const process = require("process");
const request = require("request");

// Function to make API request and get jokes based on the search term
function getJokes(searchTerm, callback) {
  const apiUrl = `https://icanhazdadjoke.com/search?term=${searchTerm}`;

  request(
    { url: apiUrl, headers: { Accept: "application/json" } },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const jokes = JSON.parse(body).results;
        callback(null, jokes);
      } else {
        callback(error || "Unable to fetch jokes from the API");
      }
    }
  );
}

// Function to select a random joke from the array
function getRandomJoke(jokes) {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

// Function to save joke to a file
function saveJokeToFile(joke) {
  fs.appendFile("jokes.txt", `${joke.joke}\n\n`, (err) => {
    if (err) throw err;
    console.log("Joke saved to jokes.txt for future laughs!");
  });
}

// Command line arguments
const command = process.argv[2];
const searchTerm = process.argv[3];


 if (command === "searchTerm") {
  if (!searchTerm) {
    console.error("Please provide a search term for jokes.");
  } else {
    getJokes(searchTerm, (error, jokes) => {
      if (error) {
        console.error(error);
      } else if (jokes.length === 0) {
        console.log(
          "Sorry, no jokes found for the given search term. The joke gods are taking a day off!"
        );
      } else {
        const randomJoke = getRandomJoke(jokes);
        console.log(`Here's a joke for you:\n${randomJoke.joke}`);
        saveJokeToFile(randomJoke);
      }
    });
  }
} else {
  console.error('Invalid command. Please use "searchTerm" ');
}

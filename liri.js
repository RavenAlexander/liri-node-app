require("dotenv").config();

//OMDB API and key
//http://www.omdbapi.com/?i=tt3896198&apikey=ebbdc44a

// BandsinTown API
// app id: 44a7f8e7f90fc2fd4bc21913a5ad0450


// NPM module used to access Bands in Town API.
require('bandsintown')('44a7f8e7f90fc2fd4bc21913a5ad0450');

// Used to access spotify keys in local file, keys.js.
require("./keys.js");

// NPM module used to access Spotify API.
var Spotify = require('node-spotify-api');

//NPM module to access OMDB
var omdb = require('omdb');

// NPM module used to access OMDB API.
var request = require("request");

// NPM module used to read the random.txt file.
var fs = require("fs");

// Controller and required parameters.
// ____________________________________________________________________________________


// Action requested.
var action = process.argv[2];

// Optional argument to request specific information.
// Based on action type.
var argument = "";

// Controller function that determines what action is taken,
// and specific data to complete that action.
doSomething(action, argument);

// Switch operation used to determin which action to take.
function doSomething(action, argument) {

	switch (action) {
		
		// Gets concert info.
		case "concert-this": 
		getConcert();
		break;

		// Gets song information.
		case "spotify-this-song":
		
		// First gets song title argument.
		var songTitle = argument;

		// If no song title provided, defaults to specific song.
		if (songTitle === "") {
			lookupSpecificSong();

		// Else looks up song based on song title.
		} else {
			// Get song information from Spotify.
			getSongInfo(songTitle);
		}
		break;

		// Gets movie information.
		case "movie-this":

		// First gets movie title argument.
		var movieTitle = argument;

		// If no movie title provided, defaults to specific movie.
		if (movieTitle === "") {
			getMovieInfo("Inception");

		// Else looks up movie based on movie title.
		} else {
			getMovieInfo(movieTitle);
		}
		break;

		// Gets text inside file, and uses it to do something.
		case "do-what-it-says": 
		doWhatItSays();
		break;
	}
}

// Function to show the concert lists.
function getConcert() {
    var bandsintown = require('bandsintown')('44a7f8e7f90fc2fd4bc21913a5ad0450');
    
    bandsintown
  .getArtist('Lady Gaga')
  .then(function(events) {
    console.log(events); 
})
    bandsintown
  .getArtistEventList('Lady Gaga')
.then(function(response) {
       console.log(response);
   });
}

// Calls Spotify API to retrieve song information for song title.
function getSongInfo(songTitle) {

    var spotify = new Spotify({
        id: 'e1f12026f482448ab06ceceb39c7bebc',
        secret: 'e1f12026f482448ab06ceceb39c7bebc'
      });

	// Calls Spotify API to retrieve a track.
	spotify.search({type: 'track', query: songTitle, limit: 3}, function(err, data) {
		if (err) {
			console.log(err);
			return
		} else {
            console.log(data);
        }

	});
	
}

// When no song title provided, defaults to specific song, All the Small Things.
function lookupSpecificSong() {

    var spotify = new Spotify({
        id: 'e1f12026f482448ab06ceceb39c7bebc',
        secret: 'e1f12026f482448ab06ceceb39c7bebc'
      });
       
      spotify
        .search({ type: 'track', query: 'All the Small Things' })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(err) {
          console.log(err);
        });
}

// Passes a query URL to OMDB to retrieve movie information for movie title.
// If no movie title provided, defaults to the movie, Mr. Nobody.
function getMovieInfo(movieTitle) {
    omdb
	// Runs a request to the OMDB API with the movie specified.
    var queryUrl = "http://www.omdbapi.com/?i="+ movieTitle + "&apikey=ebbdc44a";

	request(queryUrl, function(error, response, body) {
	  // If the request is successful...
	  if (!error && response.statusCode === 200) {
	    

	    // Prints out movie info.
	    console.log("Movie Title: " + body.Title);
	    console.log("Release Year: " + body.Year);
	    console.log("IMDB Rating: " + body.imdbRating);
	    console.log("Country Produced In: " + body.Country);
	    console.log("Language: " + body.Language);
	    console.log("Plot: " + body.Plot);
	    console.log("Actors: " + body.Actors);
	    console.log("Rotten Tomatoes URL: " + body.tomatoURL);
	  }
	});
}

// Uses fs node package to take the text inside random.txt,
// and do something with it.
function doWhatItSays() {

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			console.log(err);
		} else {

			// Creates array with data.
			var randomArray = data.split(",");

			// Sets action to first item in array.
			action = randomArray[0];

			// Sets optional third argument to second item in array.
			argument = randomArray[1];

			// Calls main controller to do something based on action and argument.
			doSomething(action, argument);
		}
	});
}

// Logs data to the terminal and output to a text file.
function logOutput(logText) {
	fs.writeFile("random.txt", "utf8", function(err, data) {

})
};
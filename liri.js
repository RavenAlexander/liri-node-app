require("dotenv").config();

//OMDB API and key
//http://www.omdbapi.com/?i=tt3896198&apikey=ebbdc44a

// BandsinTown API
// app id: 44a7f8e7f90fc2fd4bc21913a5ad0450

// Used to access spotify keys in local file, keys.js.
var keys = require("./keys.js");

// NPM module used to access Spotify API.
var Spotify = require('node-spotify-api');

// NPM module used to access OMDB API.
var request = require("request");

// NPM module used to read the random.txt file.
var fs = require("fs");

var moment = require('moment');
moment().format();

// Controller and required parameters.
// ____________________________________________________________________________________
function getConcert(concertArtist) {

	request("https://rest.bandsintown.com/artists/" + concertArtist + "/events?app_id=44a7f8e7f90fc2fd4bc21913a5ad0450&date=upcoming", function (error, response, body) {
		 if (!error && response.statusCode == 200) {
			 var jsonData = JSON.parse(body);

			console.log("Artist(s): " + jsonData[0].lineup);
			 console.log("Venue Name: " + jsonData[0].venue.name);
			 console.log("Location: " + jsonData[0].venue.city + ", " + jsonData[0].venue.region +" "+ jsonData[0].venue.country );
			 console.log("Date of Event: " + moment(jsonData[0].datetime).format("MM-DD-YYYY"));
		 }
	 })
	
	};



var getArtistNames = function(artist) {
	return artist.name;
}

var getMeSpotify = function(songName){

	var spotify = new Spotify(keys.spotify);

spotify.search({type: 'track', query: songName, limit: 5},
function (err, data){
	if (err)
 {
	 console.log('Error occurred: ' + err);
	 return; 
	}

	 var songs = data.tracks.items;
	 for(var i=0; i<songs.length; i++) {
		 console.log(i);
		 console.log('artist(s): '+ songs[i].artists.map(
			 getArtistNames));
			 console.log('song name: '+ songs[i].name);
			 console.log('preview song: '+songs[i].preview_url);
			 console.log('album: '+ songs[i].album.name);
			 console.log('----------------------------------------------------');
		 }
		});
	 
 };

 function lookupSpecificSong() {


	    var spotify = new Spotify(keys.spotify);
		   
		  spotify.search({type: 'track', query: 'the sign ace of base', limit: 5},
		  function (err, data){
			  if (err)
		   {
			   console.log('Error occurred: ' + err);
			   return; 
			  }
		  
			   var songs = data.tracks.items;
			   for(var i=0; i<songs.length; i++) {
				   console.log(i);
				   console.log('artist(s): '+ songs[i].artists.map(
					   getArtistNames));
					   console.log('song name: '+ songs[i].name);
					   console.log('preview song: '+songs[i].preview_url);
					   console.log('album: '+ songs[i].album.name);
					   console.log('----------------------------------------------------');
				   }
				  });
				};


 var getMeMovie = function(movieName) {
	request("http://www.omdbapi.com/?t="+ movieName + "&apikey=ebbdc44a", function (error, response, body) {
		 if (!error && response.statusCode == 200) {
			 var jsonData = JSON.parse(body);

			 console.log("Movie Title: " + jsonData.Title);
			 console.log("IMDB Rating: " + jsonData.imdbRating);
			 console.log("Country Produced In: " + jsonData.Country);
			 console.log("Language: " + jsonData.Language);
			 console.log("Plot: " + jsonData.Plot);
			 console.log("Actors: " + jsonData.Actors);
			 //Rotten Tomatoes Rating 
			 console.log(jsonData.Ratings[1]);
			 //Rotten Tomatoes URL is unavailable to use without an API key from Fandango, see this link for details: https://github.com/omdbapi/OMDb-API/issues/5
			//  console.log("Rotten Tomatoes URL: " + jsonData.tomatoURL);
			 console.log("Release Year: " + jsonData.Year);
		 }
	 }); 
 };

 var lookupSpecificMovie = function() {
	request("http://www.omdbapi.com/?t="+ "Mr-Nobody" + "&apikey=ebbdc44a", function (error, response, body) {
		 if (!error && response.statusCode == 200) {
			 var jsonData = JSON.parse(body);

			 console.log("Movie Title: " + jsonData.Title);
			 console.log("IMDB Rating: " + jsonData.imdbRating);
			 console.log("Country Produced In: " + jsonData.Country);
			 console.log("Language: " + jsonData.Language);
			 console.log("Plot: " + jsonData.Plot);
			 console.log("Actors: " + jsonData.Actors);
			 //Rotten Tomatoes Rating
			 console.log(jsonData.Ratings[1]);
			  //Rotten Tomatoes URL is unavailable to use without an API key from Fandango, see this link for details: https://github.com/omdbapi/OMDb-API/issues/5
			//  console.log("Rotten Tomatoes URL: " + jsonData.tomatoURL);
			 console.log("Release Year: " + jsonData.Year);
		 }
	 })
 };

 var doWhatItSays = function() {
	 fs.readFile('random.txt', 'utf8', function (err, data) {
		 if (err) throw err;

		 var dataArr = data.split(',');

		 if (dataArr.length == 2) {
			 pick(dataArr[0], dataArr[1]);
		 } else if (dataArr.length ==1) {
			 pick(dataArr[0]);
		 }
	 });
 };

var pick = function(caseData, functionData) {
	switch(caseData){
		case "concert-this": 
		//If no concert name provided, LIRI tells you to include one
		if (functionData === undefined) {
			console.log("Please input an Artist/Band name.");
			return;
		} else {
		getConcert(functionData);
		}
		break;
		case 'spotify-this-song':
		// If no song title provided, defaults to The Sign - Ace of Base.
		if (functionData === undefined) {
			lookupSpecificSong();

		// Else looks up song based on song title.
		} else {
			// Get song information from Spotify.
			getMeSpotify(functionData);
		}
			break;
		case 'movie-this':
		//If no movie title provided, defaults to Mr. Nobody
		if (functionData === undefined) {
			lookupSpecificMovie(); }
		else {
			getMeMovie(functionData); 
		}
			break;
			
		case 'do-what-it-says':
		//Reads the random.txt file and does what it says
			doWhatItSays();
			break;
		default:
		//if an incorrect command is put in LIRI will say it doesn't know what it means.
		console.log("LIRI does not know how to handle that");
	}
};

var runThis = function(argOne, argTwo) {
	pick(argOne, argTwo);
};

runThis(process.argv[2], process.argv[3]);

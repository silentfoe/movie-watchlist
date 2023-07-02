// *** Things left to do. ***
// *** Allow app to work when using the 'enter' key. (currently only works using the button)
// *** Allow user to add movie to local storage with the "plus" button after searching the movies. Add movie ID to an array???
// *** Render movies stored in local storage when they access the "my watchlist page"
// *** See if I can clean up the CSS a little bit and make the styling look better
// *** Need to have a reset function that will clear the current search if I type in a new search
// *** Use event.target.id---see if I can use the IMDB id or will have to add the id. Could I use the index?? This is for triggering an event listener to add the movie to the watchlist
// ***
// ***
// ***

import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const inputVal = document.querySelector("input"); //for the input field of the search text on the main page

const moviesSection = document.getElementById("show-movies"); // bottom half of main page with the "start exploring text"

let movieIMDBNumArray = []; // setting an empty array to hold all the movie title IMDB ID's
let fullMovieDataArray = []; // array to hold full set of data for all the movies searched

document.querySelector("button").addEventListener("click", async () => {
  try {
    let res = await fetch(
      `http://www.omdbapi.com/?apikey=1a68644e&s=${inputVal.value
        .split(" ")
        .join("+")}`
    );
    let data = await res.json();

    for (let i = 0; i < data.Search.length; i++) {
      // looping through the data that comes back from the search and then putting that data into an array
      movieIMDBNumArray.push(data.Search[i].imdbID);
    }
  } catch (error) {
    console.log(error);
   
    // if the array is empty, then return warning in the DOM
    return moviesSection.innerHTML = `<div class="not-found-container"><p class="not-found">Unable to find what you're looking for. Please try another search.</p></div>`;
  }

    getFullMovieData(movieIMDBNumArray); // calling the array filled with the movie title IMDB ID's
    inputVal.value = "";
    resetSearch()
});

// calling the API for each movie to get the full movie object back from the inital search
async function getFullMovieData(movieID) {
  try {
    for (let i = 0; i < movieID.length; i++) {
      let res = await fetch(
        `http://www.omdbapi.com/?apikey=1a68644e&i=${movieID[i]}`
      );
      let data = await res.json()
      fullMovieDataArray.push(data);
    }
  } catch (error) {
    throw error;
  }

  console.log(fullMovieDataArray); // don't need this line, will need to remove

  filterMovieDataArray(fullMovieDataArray);
}

function filterMovieDataArray(arrayOfMovieData) {
  // removing all the games from the array that was returned from the search word
  const filterMovieOrGame  = arrayOfMovieData.filter((movie) => {
    return movie.Type !== "game";
  });

  displayMovieData(filterMovieOrGame);
}

// // adding ids to each movie
// function addIdToMovie(movieArrayWithNoId) {
//     const arrayWithId = movieArrayWithNoId.map(movie => movie.id === uuidv4())
//     displayMovieData(arrayWithId)
// }

// function below is displaying the movie data in the DOM
function displayMovieData(movieDataArray) {
  // movie.Ratings[0].Value.split('/')[0] is only showing the first number in the rating value, does not include the 10

  let movieDataParts = "";

  movieDataArray.map((movie, indx) => {
    if (indx === movieDataArray.length - 1) {
      movieDataParts += `<div class="movie-data-container" id="${movie.imdbID}">
                    <img class="movie-img" src=${movie.Poster} />
                    <div class="movie-contents">
                        <div class="movie-title-rating">
                            <div class="movie-title">
                                ${movie.Title}
                            </div>
                            <div class="star-rating">
                                <i class="fa-sharp fa-solid fa-star" style="color: #e9ed02;"></i>
                                ${
                                  movie.Ratings.length > 0
                                    ? movie.Ratings[0].Value.split("/")[0]
                                    : ""
                                }
                            </div>
                        </div>
                        <div class="movie-time-genre-add">
                            <div class="movie-runtime">
                                ${movie.Runtime}
                            </div>
                            <div class="movie-genre">
                                ${movie.Genre}
                            </div>
                            <div class="add-watchlist">
                                <i data-id="${movie.imdbID}" class="movie-circle-icon fa-solid fa-circle-plus" style="color: #ffffff;">Watchlist</i>
                            </div>
                        </div>
                        <div class="movie-plot">
                            ${movie.Plot}
                        </div>
                    </div>
                </div>`;
    } else {
      movieDataParts += `<div class="movie-data-container">
                    <img class="movie-img" src=${movie.Poster} />
                    <div class="movie-contents">
                        <div class="movie-title-rating">
                            <div class="movie-title">
                                ${movie.Title}
                            </div>
                            <div class="star-rating">
                                <i class="fa-sharp fa-solid fa-star" style="color: #e9ed02;"></i>
                                ${
                                  movie.Ratings.length > 0
                                    ? movie.Ratings[0].Value.split("/")[0]
                                    : ""
                                }
                            </div>
                        </div>
                        <div class="movie-time-genre-add">
                            <div class="movie-runtime">
                                ${movie.Runtime}
                            </div>
                            <div class="movie-genre">
                                ${movie.Genre}
                            </div>
                            <div class="add-watchlist">
                                <i data-id="${movie.imdbID}" class="movie-circle-icon fa-solid fa-circle-plus" style="color: #ffffff;">Watchlist</i>
                            </div>
                        </div>
                        <div class="movie-plot">
                            ${movie.Plot}
                        </div>
                    </div>
                </div>
                <hr/>`;
    }
  });

  moviesSection.innerHTML = movieDataParts;
}

function resetSearch() {
    movieIMDBNumArray = []
    fullMovieDataArray = []
}


// using the data attribute to link the watchlist add button to the movie it was clicked on. Will need to add this to local storage now and change the icon to a minus. 
document.getElementById('show-movies').addEventListener('click', (event) => {
    
    console.log(event)

    const movie = fullMovieDataArray.filter(movie => movie.imdbID === event.target.dataset.id)

    console.log(movie)
    
})
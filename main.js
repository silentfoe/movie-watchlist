// *** Things left to do. ***
// *** Allow app to work when using the 'enter' key. (currently only works using the button)
// *** refactor code...are there any places where I can drier? What can I clean up to make this better?
// *** fix console error and tie the show local storage function to when I click the my watchlist text
// *** work on 2 letter movies, currently comes back with an error and will not search when only using 2 letters. 
// ***
// ***
// ***
// *** Work on the responsiveness when I render movies on smaller screens, right now the movies shown throw off css
// ***See if I can clean up the CSS a little bit and make the styling look better

const inputVal = document.querySelector("input"); //for the input field of the search text on the main page
const moviesSection = document.getElementById("show-movies"); // bottom half of main page with the "start exploring text"

let movieIMDBNumArray = []; // setting an empty array to hold all the movie title IMDB ID's
let fullMovieDataArray = []; // array to hold full set of data for all the movies searched
let addToLocalStorageMovieArray = [];

document.addEventListener("click", async (event) => {
  if (event.target.id === "search-btn") {
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
      return (moviesSection.innerHTML = `<div class="not-found-container"><p class="not-found">Unable to find what you're looking for. Please try another search.</p></div>`);
    }

    getFullMovieData(movieIMDBNumArray); // calling the array filled with the movie title IMDB ID's
    inputVal.value = "";
    resetSearch();
  }
});

// calling the API for each movie to get the full movie object back from the inital search
async function getFullMovieData(movieID) {
  try {
    for (let i = 0; i < movieID.length; i++) {
      let res = await fetch(
        `http://www.omdbapi.com/?apikey=1a68644e&i=${movieID[i]}`
      );
      let data = await res.json();
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
  const filterMovieOrGame = arrayOfMovieData.filter((movie) => {
    return movie.Type !== "game";
  });

  displayMovieData(filterMovieOrGame);
}

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
                                <i data-id="${
                                  movie.imdbID
                                }" class="movie-circle-icon fa-solid fa-circle-plus" style="color: #ffffff;">Watchlist</i>
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
                                <i data-id="${
                                  movie.imdbID
                                }" class="movie-circle-icon fa-solid fa-circle-plus" style="color: #ffffff;">Watchlist</i>
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
  movieIMDBNumArray = [];
  fullMovieDataArray = [];
}

// using the data attribute to link the watchlist add button to the movie it was clicked on. This adds the movie to local storage
document.addEventListener("click", (event) => {
  if (event.target.dataset.id) {
    const movie = fullMovieDataArray.filter(
      (movie) => movie.imdbID === event.target.dataset.id
    )[0];

    addToLocalStorageMovieArray.push(movie); // do I need this array to hold the movie I am saving in local storage??? Or should this be deleted?
    localStorage.setItem(movie.imdbID, JSON.stringify(movie)); // adding the movie to local storage

    showMoviesStoredInLocalStorage();
  }
});

// function that takes the movies from local storage and displays them on the my watchlist page
function showMoviesStoredInLocalStorage() {
  if (localStorage.length > 0) {
    let showMoviesHtml = "";

    for (let i = 0; i < localStorage.length; i++) {
      let movie = JSON.parse(Object.values(localStorage)[i]);

      showMoviesHtml += ` 
        
        <div class="movie-data-container" id="${movie.imdbID}">
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
                    <i data-remove="${
                      movie.imdbID
                    }" class="movie-circle-icon fa-solid fa-circle-minus" style="color: #ffffff;">Watchlist</i>
                </div>
            </div>
            <div class="movie-plot">
                ${movie.Plot}
            </div>
        </div>
    </div>
    <hr/>    
        `;
    }
    document.getElementById("show-watchlist").style.justifyContent = 'flex-start'
    document.getElementById("show-watchlist").innerHTML = showMoviesHtml;
  } else {
    document.getElementById("show-watchlist").innerHTML = `
      <div class="watchlist-text">
        <p class="watchlist-text">Your watchlist is looking a little empty...</p>
        <div class="add-movies">
          <a href="index.html" class="circle-to-search"
            ><i
              class="circle-icon fa-solid fa-circle-plus"
              style="color: #ffffff"
            ></i
          ></a>
          <p class="watchlist-to-search">Let's add some movies!</p>
        </div>
      </div>
    
    `;
  }
}

// calling the function in order to render any movies that might be in local storage
showMoviesStoredInLocalStorage();

// removing the movie from local storage

document.addEventListener("click", (event) => {
  if (event.target.dataset.remove) {
    console.log(event.target.dataset.remove);
    localStorage.removeItem(event.target.dataset.remove); // adding the movie to local storage

    showMoviesStoredInLocalStorage();
  }
});

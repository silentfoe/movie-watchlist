

// *** Things left to do. ***
// *** Allow app to work when using the 'enter' key. (currently only works using the button)
// *** Allow user to add movie to local storage with the "plus" button after searching the movies. Add movie ID to an array???
// *** Render movies stored in local storage when they access the "my watchlist page"
// *** See if I can clean up the CSS a little bit and make the styling look better
// ***
// ***
// ***
// ***
// ***


//for the input field text
let inputVal = document.querySelector('input')
// bottom half of main page with the "start exploring text"
moviesSection = document.getElementById('show-movies')


document.querySelector('button').addEventListener('click', async () => {
    
    let movieIMDBNumArray = [] // setting an empty array to hold all the movie title IMDB ID's

    try {
        let res = await fetch(`http://www.omdbapi.com/?apikey=1a68644e&s=${inputVal.value.split(' ').join('+')}`)
        let data = await res.json()
        
        for(let i = 0; i < data.Search.length; i++){ // looping through the data that comes back from the search and then putting that data into an array
            movieIMDBNumArray.push(data.Search[i].imdbID)
        }

    } catch (error) {
        
        
        console.log(error)
        
    }

    // if the array is empty, then return warning in the DOM
    if(movieIMDBNumArray.length === 0){

        moviesSection.innerHTML = `<div class="not-found-container"><p class="not-found">Unable to find what you're looking for. Please try another search.</p></div>`

    }else {
    
    getFullMovieData(movieIMDBNumArray) // calling the array filled with the movie title IMDB ID's

    }

    inputVal.value = ''
  
})


// calling the API for each movie to get the full movie object back from the inital search
async function getFullMovieData(movieID) {

    let fullMovieDataArray = []

    try {

        for(let i = 0; i < movieID.length; i++){
            
            res = await fetch(`http://www.omdbapi.com/?apikey=1a68644e&i=${movieID[i]}`)
            fullMovieDataArray.push(await res.json()) 
        }
        
        
    } catch (error) {
        throw error
    }
    
    console.log(fullMovieDataArray) // don't need this line, will need to remove
    
    
    filterMovieDataArray(fullMovieDataArray)
}


function filterMovieDataArray(arrayOfMovieData){
    
    // removing all movies that don't have a picture to display
    const filterMoviePoster = arrayOfMovieData.filter(movie => {
        return movie.Poster !== 'N/A'
    })

    // removing all the games from the array
    const filterMovieOrGame = filterMoviePoster.filter(movie => {
        return movie.Type !== 'game'
    })

    displayMovieData(filterMovieOrGame)
}




// function below is displaying the movie data in the DOM
function displayMovieData(movieDataArray) {
    
    // movie.Ratings[0].Value.split('/')[0] is only showing the first number in the rating value, does not include the 10
    
        
        let movieDataParts = ''
    
        movieDataArray.map((movie, indx) => {

            if(indx === movieDataArray.length - 1){
                movieDataParts += 
                `<div class="movie-data-container">
                    <img class="movie-img" src=${movie.Poster} />
                    <div class="movie-contents">
                        <div class="movie-title-rating">
                            <div class="movie-title">
                                ${movie.Title}
                            </div>
                            <div class="star-rating">
                                <i class="fa-sharp fa-solid fa-star" style="color: #e9ed02;"></i>
                                ${movie.Ratings.length > 0 ?movie.Ratings[0].Value.split('/')[0] : ''}
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
                                <a href="search.html" id="Add-to-watchlist"><i class="movie-circle-icon fa-solid fa-circle-plus" style="color: #ffffff;"></i>Watchlist</a>
                            </div>
                        </div>
                        <div class="movie-plot">
                            ${movie.Plot}
                        </div>
                    </div>
                </div>`

            }else {
                movieDataParts += 
                `<div class="movie-data-container">
                    <img class="movie-img" src=${movie.Poster} />
                    <div class="movie-contents">
                        <div class="movie-title-rating">
                            <div class="movie-title">
                                ${movie.Title}
                            </div>
                            <div class="star-rating">
                                <i class="fa-sharp fa-solid fa-star" style="color: #e9ed02;"></i>
                                ${movie.Ratings.length > 0 ?movie.Ratings[0].Value.split('/')[0] : ''}
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
                                <a href="search.html" id="Add-to-watchlist"><i class="movie-circle-icon fa-solid fa-circle-plus" style="color: #ffffff;"></i>Watchlist</a>
                            </div>
                        </div>
                        <div class="movie-plot">
                            ${movie.Plot}
                        </div>
                    </div>
                </div>
                <hr/>`
            }
        })
    
        moviesSection.innerHTML = movieDataParts

    }
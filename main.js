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
        
        
        moviesSection.innerHTML = `<div class="not-found-container"><p class="not-found">Unable to find what you're looking for. Please try another search.</p></div>`
        
    }
    
    getFullMovieData(movieIMDBNumArray) // calling the array filled with the movie title IMDB ID's
  
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
    
    console.log(fullMovieDataArray)
    console.log(fullMovieDataArray[0].Ratings[0].Value)
    
    displayMovieData(fullMovieDataArray)
}

// function below is displaying the movie data in the DOM
function displayMovieData(movieDataArray) {
    
    let movieDataParts = ''

    movieDataArray.map(movie => {
        movieDataParts += 
        `<div class="movie-data-container">
            <img class="movie-img" src=${movie.Poster} />
            <div class="movie-contents">
                <div class="movie-title-rating">${movie.Title}${movie.Ratings[0].Value}</div>
                <div class="movie-time-genre-add">
                ${movie.Runtime}${movie.Genre}<a href="search.html" id="Add-to-watchlist"><i class=" circle-icon fa-solid fa-circle-plus" style="color: #ffffff;"></i>Watchlist</a>
                </div>
                <div class="movie-plot">${movie.Plot}</div>
            </div>
        </div>
        <hr>`
    })

    moviesSection.innerHTML = movieDataParts
}



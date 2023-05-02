let inputVal = document.querySelector('input')



// maybe should use the 's' function to search with the API instead of the 't'??? 's' pulls up all movie titles with the search word in it but with less data. 
// example: http://www.omdbapi.com/?apikey=1a68644e&s=<search>&t=<title>
// figure out a way to call the API again with the movie title from the 's' search in order to populate more data about the movie 
// need a way to loop through the search results and then call the API with each movie id number

document.querySelector('button').addEventListener('click', async () => {
    let res = await fetch(`http://www.omdbapi.com/?apikey=1a68644e&s=${inputVal.value.split(' ').join('+')}`)
    let data = await res.json()
    
    // need to use multiple functions in order to call data from the API using the path below. Need to loop through the data.Search array and get the movieID and then pull the data from the movie id into the watchlist render. 
    console.log(data.Search[1].Title)
    
    
    
    
})



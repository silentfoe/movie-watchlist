let inputVal = document.querySelector('input')


document.querySelector('button').addEventListener('click', async () => {
    let res = await fetch(`http://www.omdbapi.com/?apikey=1a68644e&t=${inputVal.value.split(' ').join('+')}`)
    let data = await res.json()
    console.log(data)

    
})



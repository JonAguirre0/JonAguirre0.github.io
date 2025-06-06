const menu = document.querySelector('.menu')
const offScreenMenu = document.querySelector('.off-screen-menu')
const accountMenu = document.querySelector('.user')
const accountIcon = document.getElementById('user')
const accountXIcon = document.getElementById('x')
const offScreenSideMenu = document.querySelector('.off-screen-side-menu')
const signin = document.querySelector('.signin')
const createAccount = document.querySelector('.create-account')
const logo = document.querySelector('.logoImg')
const topRated = document.querySelector('.toprated')
const random = document.querySelector('.random')
const darkToggle = document.querySelector('.dark-toggle')
const toggleImg = document.querySelector('.toggleImg')
const prev = document.querySelector('.prev')
const counter = document.querySelector('.counter')
const next = document.querySelector('.next')
const main = document.getElementById('main')
const main2 = document.getElementById('main2')
const form = document.querySelector('.form')
const search = document.querySelector('.search')
const closeEl = document.getElementById('x')
const title = document.getElementById('title')
const genre = document.querySelector('.genre')
const gameGenre = document.querySelector('.gameG')

const today = new Date()
const year = today.getFullYear()
const month = String(today.getMonth() + 1).padStart(2,'0')
const day = String(today.getDate()).padStart(2,'0')
const todaysDate = `${year}-${month}-${day}`
const endOfYear = `${year}-12-31`

//Provide API key below
const API_KEY = '?'
const API_URL = `https://api.rawg.io/api/games?key=${API_KEY}`
const API_URL_TOPRATED = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-metacritic`
const API_URL_USERRATING = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-rating`
const API_URL_UPCOMING = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=released&dates=${todaysDate},${endOfYear}`
const API_URL_Search = `https://api.rawg.io/api/games?key=${API_KEY}&search=`
const API_URL_RANDOM = `https://api.rawg.io/api/games?key=${API_KEY}&page=`
const API_GENRES = `https://api.rawg.io/api/genres?key=${API_KEY}`

let page = 1
let isTopRated = false
let isSearchTerm = false
let isGenre = false
let genreName = ''


window.onload = function loading() {
    setTimeout(function() {
        document.getElementById('loader').style.display = "none"
        document.getElementById('background').style.display = "block"
    }, 999)
}

// async function getGenres(url) {
//     main2.innerHTML = ''
    
//     const res = await fetch(url)
//     const data = await res.json()
//     showGenres(data.results)
// }

//Get initial games
// getGames(API_URL)
getGames(API_URL_UPCOMING)

async function getGames(url) {
    main.innerHTML = ''
    
    const res = await fetch(url)
    const data = await res.json()
    document.getElementById('next').disabled = !data.next
    document.getElementById('prev').disabled = !data.previous
    
    // const res = await fetch(url)
    // const data = await res.json()
    //.map() is used to loop over each "game" in the data.results array and perform an operation on each game. Promise.all() is used since .map() creates an array of promises, Promise.all() is used to wait for all promises to resolve before continuing.
    const gamesDescription = await Promise.all(data.results.map(async (game) => {
        const gameDescription = await getGameDescription(game)
        return gameDescription
    })) 
    

    showGames(gamesDescription)
    // showGames(data.results)
    counter.innerHTML = `${page}`
}

async function getGameDescription(game) {
    const url = `https://api.rawg.io/api/games/${game.id}?key=${API_KEY}`
    const res = await fetch(url)
    const data = await res.json()
    const description = data.description
    game.description = description
    return game
    
}

function showGames(games) {
    games.forEach((game) => {
        const {name, background_image, metacritic, rating, description, released} = game

        const gameEl = document.createElement('div')
        gameEl.classList.add('game')
        gameEl.innerHTML = `
            <img src="${background_image ? background_image: 'https://media.istockphoto.com/id/1472933890/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg?s=612x612&w=0&k=20&c=Rdn-lecwAj8ciQEccm0Ep2RX50FCuUJOaEM8qQjiLL0='}" alt="${title}"}>
            <div class="game-info">
                <h3>${name}</h3>
                <span id="UR">User Rating: <span id="R" class="${getClassByRate(rating)}">${rating}/5</span></span>
                <span id="line"></span>
                <span id="MR">Metacritic Rating: <span id="M" class="${getClassByMetacritic(metacritic)}">${metacritic ? metacritic :''}</span></span>
                <span id="line"></span>
                <span id="D">Date: <span class="date">${released}</span></span>
                <span id="line"></span>
            </div>
            <div class="overview">
                <h3>Description</h3>
                ${description} ${released}    
            </div>
        `
        main.appendChild(gameEl)
    })
}

// function showGenres(games) {
//     games.forEach((game) => {
//         const {name, image_background,slug} = game

//         const genreEl = document.createElement('div')
//         genreEl.classList.add('gameG')
//         genreEl.innerHTML = `
//             <div class="game-img">
//                 <img src="${image_background ? image_background: 'https://media.istockphoto.com/id/1472933890/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg?s=612x612&w=0&k=20&c=Rdn-lecwAj8ciQEccm0Ep2RX50FCuUJOaEM8qQjiLL0='}">
//             </div>
//             <div class="game-info">
//                 <h3>${name}</h3>
//             </div>
//         `
//         genreEl.addEventListener('click', () => {
//             main2.innerHTML=''
//             const genreName = slug.toLowerCase()
//             console.log(`genre clicked ${genreName}`)
//             const API_GENRE_NAME = `https://api.rawg.io/api/games?genres=${genreName}&key=${API_KEY}`
//             getGames(API_GENRE_NAME)
//         })
//         main2.appendChild(genreEl)
//     })
// }

function getClassByRate(rate){
    if(rate >= 4) {
        return 'green'
    } else if(rate >= 3) {
        return 'orange'
    } else {
        return 'red'
    }
}

function getClassByMetacritic(rate){
    if(rate >= 80) {
        return 'green'
    } else if(rate >= 50) {
        return 'orange'
    } else {
        return 'red'
    }
}


logo.addEventListener('click', () => {
    window.scrollTo(0,0)
    window.location.reload()
    search.value = ''
})

menu.addEventListener('click', () => {
    menu.classList.toggle('active')
    offScreenMenu.classList.toggle('active')
})

darkToggle.addEventListener('click', () => {
    if(toggleImg.src === 'https://cdn-icons-png.freepik.com/512/6714/6714978.png') {
        // toggleImg.src = 'https://static.thenounproject.com/png/979909-200.png'
        toggleImg.src = './images/image3.png' 
        document.body.classList.toggle('dark-theme')
    } else {
        toggleImg.src = 'https://cdn-icons-png.freepik.com/512/6714/6714978.png'
        document.body.classList.toggle('dark-theme')
    }   
})

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const searchTerm = search.value
    isSearchTerm = true

    if(searchTerm && searchTerm !== '') {
        getGames(API_URL_Search + searchTerm)
        title.innerHTML = `${searchTerm}`

        page = 1
        counter.innerHTML = ''
        // search.value = ''
        //to get rid of the prev, counter, next elements since not needed
        // prev.style.display = 'none'
        // counter.style.display = 'none'
        // next.style.display = 'none'
    } else {
        window.location.reload()
    }
})

accountMenu.addEventListener('click', () => {
    accountIcon.classList.toggle('active')
    accountXIcon.classList.toggle('active')
    offScreenSideMenu.classList.toggle('active')
})

topRated.addEventListener('click', () => {
    document.getElementById('loader').style.display = "block"

    page = 1
    isTopRated = true
    getGames(API_URL_TOPRATED).then(() => {
        document.getElementById('loader').style.display = "none"
        document.getElementById('background').style.display = "block"
    }) 
    title.innerHTML = "Top Rated Games"
    counter.innerHTML = `${page}`
})

random.addEventListener('click', () => {
    getRandomGames()
    title.innerHTML = "Random Games"
    counter.innerHTML = `${page}`
    document.getElementById("prev").style.display = 'none'
    document.getElementById("counter").style.display = 'none'
    document.getElementById("next").style.display = 'none'
})
function getRandomGames() {
    const randomPage = Math.floor(Math.random() * 500) + 1
    const API_URL_RANDOM = `https://api.rawg.io/api/games?key=${API_KEY}&page=${randomPage}`
    getGames(API_URL_RANDOM)
}

//still work in progress below
// genre.addEventListener('click', () => {
//     title.innerText = "Browse by Genres"
//     main.innerHTML = ''
//     isGenre = true
    
//     getGenres(API_GENRES)
// })

// gameGenre.addEventListener('click', () => {
//     console.log('gameG clicked')
// })

next.addEventListener('click', () => {
    page++
    getNextPage()
    counter.innerHTML = `${page}`
})

function getNextPage() {
    if (isTopRated) {
        document.getElementById('loader').style.display = "block"
        const API_URL_TOPRATED = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-metacritic&page=${page}`
        getGames(API_URL_TOPRATED).then(() => {
            document.getElementById('loader').style.display = "none"
            document.getElementById('background').style.display = "block"
        })
        // title.innerHTML = `Top Rated Games Page ${page}`
    } else if (isSearchTerm) {
        document.getElementById('loader').style.display = "block"
        const searchTerm = search.value
        const API_URL_Search = `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&search=${searchTerm}`
        getGames(API_URL_Search).then(() => {
            document.getElementById('loader').style.display = "none"
            document.getElementById('background').style.display = "block"
        })
    } else if(isGenre) {
        const genreName = slug.toLowerCase()
        const API_GENRE_NAME = `https://api.rawg.io/api/games?genres=${genreName}&page=${page}&key=${API_KEY}`
        getGames(API_GENRE_NAME)
    } else {
        document.getElementById('loader').style.display = "block"
        const API_URL_UPCOMING = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=released&dates=${todaysDate},${endOfYear}&page=${page}`
        getGames(API_URL_UPCOMING).then(() => {
            document.getElementById('loader').style.display = "none"
            document.getElementById('background').style.display = "block"
        })
        // title.innerHTML = `Upcoming Games Page ${page}`
    }
}

prev.addEventListener('click', () => {
    page--
    getPrevPage()
    counter.innerHTML = `${page}`
})

function getPrevPage() {
    if (isTopRated) {
        document.getElementById('loader').style.display = "block"
        const API_URL_TOPRATED = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=-metacritic&page=${page}`
        getGames(API_URL_TOPRATED).then(() => {
            document.getElementById('loader').style.display = "none"
            document.getElementById('background').style.display = "block"
        })
        // title.innerHTML = `Top Rated Games Page ${page}`
    } else if(isSearchTerm) {
        document.getElementById('loader').style.display = 'block'
        const searchTerm = search.value
        const API_URL_Search = `https://api.rawg.io/api/games?key=${API_KEY}&page=${page}&search=${searchTerm}`
        getGames(API_URL_Search).then(() => {
            document.getElementById('loader').style.display = "none"
            document.getElementById('background').style.display = "block"
        })
    } else {
        document.getElementById('loader').style.display = "block"
        const API_KEY_UPCOMING = `https://api.rawg.io/api/games?key=${API_KEY}&ordering=released&dates=${todaysDate},${endOfYear}&page=${page}`
        getGames(API_KEY_UPCOMING).then(() => {
            document.getElementById('loader').style.display = "none"
            document.getElementById('background').style.display = "block"
        })
        // title.innerHTML = `Upcoming Games Page ${page}`
    }
}











const leftBtn = document.querySelector(".leftBtn")
const rightBtn = document.querySelector('.rightBtn')
const leftBtn2 = document.querySelector(".leftBtn2")
const rightBtn2 = document.querySelector('.rightBtn2')
let currentIndex = 0
//let currentIndex2 = 0
leftBtn.addEventListener('click', () => {
    slider1('left')
})
rightBtn.addEventListener('click', () => {
    slider1('right')
})
leftBtn2.addEventListener('click', () => {
    sliderRPG('left')
})
rightBtn2.addEventListener('click', () => {
    sliderRPG('right')
})
function slider1(direction){
    const slider = document.querySelector('.slider')
    const genres = document.querySelectorAll('.gameG')
    const gameGWidth = genres[0].offsetWidth
    const totalGenres = genres.length

    if (direction === 'right') {
        if (currentIndex < totalGenres - 1){
            currentIndex++
        } else {
            currentIndex = 0
        }
    } else if(direction === 'left'){
        if(currentIndex > 0){
            currentIndex--
        } else {
            currentIndex = totalGenres - 1
        }
    }
    slider.style.transform = `translateX(-${gameGWidth * currentIndex}px)`
}
function sliderRPG(direction){
    const sliderRPG = document.querySelector('.sliderRPG')
    const genres = document.querySelectorAll('.gameG2')
    const gameGWidth = genres[0].offsetWidth
    const totalGenres = genres.length

    // if (currentIndex2 === totalGenres -7) {
    //     rightBtn2.disabled = true
    //     rightBtn2.style.cursor = 'not-allowed'
    // } else {
    //     rightBtn2.disabled = false
    //     rightBtn2.style.cursor = 'pointer'
    // }

    // if(currentIndex2===0) {
    //     leftBtn2.disabled = true
    //     leftBtn2.style.cursor = 'not-allowed'
    // } else {
    //     leftBtn2.disabled = false
    //     leftBtn2.style.cursor = 'pointer'
    // }
    // let currentIndex2 = 0
    if (direction === 'right') {
        if (currentIndex < totalGenres - 1){
            currentIndex++
        } else {
            currentIndex = 0
        }
    } else if(direction === 'left'){
        if(currentIndex > 0){
            currentIndex--
        } else {
            currentIndex = totalGenres - 1
        }
    }
    sliderRPG.style.transform = `translateX(-${gameGWidth * currentIndex}px)`
}














//need to test the below, and delete the duplicates above
async function getGenres(url) {
    main.innerHTML = ''
    const res = await fetch(url)
    const data = await res.json()
    showGenres(data.results)
}

function showGenres(genres) {
    genres.forEach((genre) => {
        const { name, image_background, id } = genre

        const genreEl = document.createElement('div')
        genreEl.classList.add('genre')
        genreEl.innerHTML = `
            <div class="game-img">
                <img src="${image_background ? image_background : 'https://media.istockphoto.com/id/1472933890/vector/no-image-vector-symbol-missing-available-icon-no-gallery-for-this-moment-placeholder.jpg?s=612x612&w=0&k=20&c=Rdn-lecwAj8ciQEccm0Ep2RX50FCuUJOaEM8qQjiLL0='}">
            </div>
            <div class="game-info">
                <h3>${name}</h3>
            </div>
        `
        genreEl.addEventListener('click', () => {
            isGenre = true
            getGamesByGenre(id,name)
        })

        main.appendChild(genreEl)

    })
}

genre.addEventListener('click', () => {
    page = 1
    title.innerText = "Browse by Genres"
    counter.innerHTML = `${page}`
    const API_GENRES = `https://api.rawg.io/api/genres?key=${API_KEY}`
    
    getGenres(API_GENRES)

    document.getElementById("prev").style.display = 'none'
    document.getElementById("counter").style.display = 'none'
    document.getElementById("next").style.display = 'none'
})

let currentGenreId = null
let currentGenreName = null
async function getGamesByGenre(id, name) {
    main.innerHTML = ''
    currentGenreId = id
    currentGenreName = name
    const url = `https://api.rawg.io/api/genres/${id}?key=${API_KEY}`

    const res = await fetch(url)
    const data = await res.json()

    title.innerHTML = `Browsing by ${name} Games`
    document.getElementById("prev").style.display = 'block'
    document.getElementById("counter").style.display = 'block'
    document.getElementById("next").style.display = 'block'
    
    showGames(data.results)
}
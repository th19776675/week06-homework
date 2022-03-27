// Declarations

const searchInput = document.querySelector(".search-input")
const searchForm = document.querySelector("form")

let savedSearches = document.querySelector("#saved-searches")

const clearBtn = document.querySelector(".clear-btn")

const mainTitle = document.querySelector("#main-forecast h2")
const mainFields = document.querySelectorAll("#main-forecast p")

const dateFields = document.querySelectorAll(".date")
const conditionsFields = document.querySelectorAll(".conditions")
const tempFields = document.querySelectorAll(".temp")
const windFields = document.querySelectorAll(".wind")
const humidityFields = document.querySelectorAll(".humidity")
const uvFields = document.querySelectorAll(".uv")
const uvIndicator = document.querySelectorAll("span")

let recentSearches = []

// Searching + Recently Searched

searchForm.addEventListener("submit", function(event){
    event.preventDefault()
    getCoords(searchInput.value.trim(), true)
    searchInput.value = ""
    console.log(recentSearches)
})   

clearBtn.addEventListener("click", function(){
    localStorage.clear()
    while (savedSearches.firstChild) {
        savedSearches.removeChild(savedSearches.lastChild)
    }
    recentSearches = []
})

function createSavedSearch(city) {
    let savedSearchBtn = document.createElement("button")
    savedSearchBtn.textContent = city
    savedSearches.appendChild(savedSearchBtn)
    recentSearches.push(city)
    localStorage.setItem("localSavedSearches", JSON.stringify(recentSearches))
}                         

savedSearches.addEventListener("click", function(event){
    if (event.target.localName === "button") {
        console.log(event.target)
        getCoords(event.target.textContent, false)
        searchInput.value = ""
    }    
})

function callSearches() {
    if (JSON.parse(localStorage.getItem("localSavedSearches")) !== null) {
        recentSearches = JSON.parse(localStorage.getItem("localSavedSearches"))
        for (let i = 0; i < recentSearches.length; i++){
            let savedSearchBtn = document.createElement("button")
            savedSearches.appendChild(savedSearchBtn)
            savedSearchBtn.textContent = recentSearches[i]
        }
    } 
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function getConditions(currentConditions) {
    if (0 < currentConditions && currentConditions < 300 ) {
        return "🌧"
    } else if (299 < currentConditions && currentConditions < 500 ) {
        return "🌧"
    } else if (499 < currentConditions && currentConditions < 511) {
        return "🌦"
    } else if (currentConditions === 511 || 599 < currentConditions && currentConditions < 623) {
        return "🌨"
    } else if (700 < currentConditions && currentConditions< 782) {
        return "🌫"
    } else if (currentConditions === 800) {
        return "☀"
    } else {
        return "☁"
    }
}

function checkUV(UV) {
    if (0 <= UV && UV <3) {
        return "lightgreen"
    } else if (3 <= UV && UV < 7) {
        return "yellow"
    } else {
        return "red"
    }
}

function getCoords(city, createCondition) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=d322ae663fb727b202d40d6c138ddd30")
        .then(function (response) {
            if (response.ok) {
                searchInput.placeholder = ""
                response.json().then(function (data){
                    if (data.length === 0) {
                        searchInput.placeholder = "This city is not in our database."
                        return;
                    } else {
                        if (createCondition === true){
                            createSavedSearch(city)
                        }
                        fillWeather(data[0].lat, data[0].lon, city)
                        return
                    }
                })
            } else {
                searchInput.placeholder = "Your search failed. Try again."
            }
        }) 
}


function fillWeather(lat, lon, title) {
    fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=metric&appid=d322ae663fb727b202d40d6c138ddd30")
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                    mainTitle.textContent = capitalizeFirstLetter(title) 
                    for (let i = 0; i < 6; i++) {
                        dateFields[i].textContent = new Date(data.daily[i].dt*1000).toLocaleDateString("en-AU");
                        tempFields[i].textContent = `Temp: ${data.daily[i].temp.day} °C`
                        windFields[i].textContent = `Wind: ${data.daily[i].wind_speed} MPH`
                        humidityFields[i].textContent = `Humidity: ${data.daily[i].humidity} %`
                        uvFields[i].textContent = `UV Index: ${data.daily[i].uvi}`
                        uvIndicator[i].textContent = "•"
                        uvIndicator[i].style.color = checkUV(data.daily[i].uvi)
                        conditionsFields[i].textContent = getConditions(data.daily[i].weather[0].id)
                    }
                });
            } else {
                return;
            }
        })
}

callSearches()



  
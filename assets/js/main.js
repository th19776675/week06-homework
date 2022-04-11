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

const refreshBtn = document.querySelector(".refresh-btn")

const closeBtn = document.querySelector(".close-btn")
const citySearch = document.querySelector("#city-search")
const searchWrapper = document.querySelector("#search-wrapper")
const cityResults = document.querySelector("#city-results")

const widgetBtn = document.querySelector(".widget-btn")
const container = document.querySelector("#container")
const innerWrapper = document.querySelector("#inner-wrapper")

let recentSearches = []

// Searching + Recently Searched

searchForm.addEventListener("submit", function(event){
    event.preventDefault()
    getCoords(searchInput.value.trim(), true)
    searchInput.value = ""
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
        return "#27AE60"
    } else if (3 <= UV && UV < 7) {
        return "#F1C40F"
    } else {
        return "#E74C3C"
    }
}

function getCoords(city, createCondition) {
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=d322ae663fb727b202d40d6c138ddd30")
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
                        mainTitle.textContent = "..."
                        mainTitle.style = "color: var(--bg); background: var(--main)"
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
                    mainTitle.textContent = capitalizeFirstLetter(title) 
                    for (let i = 0; i < 6; i++) {
                        dateFields[i].textContent = new Date(data.daily[i].dt*1000).toLocaleDateString("en-AU");
                        tempFields[i].textContent = `Temp: ${data.daily[i].temp.day} °C`
                        windFields[i].textContent = `Wind: ${data.daily[i].wind_speed} MPH`
                        humidityFields[i].textContent = `Humidity: ${data.daily[i].humidity} %`
                        uvIndicator[i].textContent = data.daily[i].uvi
                        uvIndicator[i].style.background = checkUV(data.daily[i].uvi)
                        conditionsFields[i].textContent = getConditions(data.daily[i].weather[0].id)
                    }
                });
            } else {
                return;
            }
        })
}

refreshBtn.addEventListener("click", function(){
    location.reload();
})

let searchStatus = "Open"

closeBtn.addEventListener("click", function(){
    if (searchStatus === "Open"){
        searchWrapper.style.display = "none"
        citySearch.style.width = "2%"
        cityResults.style.width = "98%"
        searchStatus = "Closed"
    } else {
        searchWrapper.style.display = "block"
        citySearch.style.width = "20%"
        cityResults.style.width = "80%"  
        searchStatus = "Open"
 
    }
})

let widgetStatus = "Open"

widgetBtn.addEventListener("click", function(){
    if (widgetStatus === "Open"){
        container.style.display = "none"
        innerWrapper.style.width = "250px"
        widgetBtn.style.left = "42%"
        widgetStatus = "Closed"
    } else {
        container.style = "flex"
        widgetBtn.style.left = "49%"
        innerWrapper.style.width = "1200px"
        widgetStatus = "Open"
 
    }
})


callSearches()

dragElement(document.getElementById("inner-wrapper"))

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "-header")) {
      document.getElementById(elmnt.id + "-header").onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
  

  
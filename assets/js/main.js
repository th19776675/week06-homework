// Declarations

const searchInput = document.querySelector(".search-input")
const searchForm = document.querySelector("form")

const apiKey = "d322ae663fb727b202d40d6c138ddd30"



// Searching + Recently Searched

searchForm.addEventListener("submit", function(event){
    event.preventDefault()
    searchInput.value = ""
    searchInput.placeholder = "This City is not in our Database."
    
})    



let city = ""
const queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=d322ae663fb727b202d40d6c138ddd30"

function fillWeather(url) {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                });
            } else {
                return;
            }
        })
}






  
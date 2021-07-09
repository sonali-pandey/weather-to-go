// Open weather API Key
const apiKey = "64eb91bf2065795eb1daaa57db853cad";

// units for Temp, humidty , and wind speed
const units = ["<sup>o</sup>F", "<span>MPH</span>", "<span>%</span>", ""]

// number of days's forecast to display : max 7 days from the current API used
const futureDays = 5;

// Array to store searches in Local storage
var cities=[];

// number of searches made and keep history to max 10 
var searchCount = 0;
var forecastArrIndex;
var listEl;

// legends of weather forecast to display
const legends = ["temp", "wind_speed", "humidity", "uvi"];

// object to save the weather forecast data before passing them to HTML element
const weatherData = [
    {
        name: "Temp: ",
        value: "0"
    }, 
    {
        name: "Wind: ",
        value: "0"
    }, 
    {
        name: "Humidity: ",
        value:"0"
    },                    
    {
        name: "UV Index: ",
        value:"0"
    }
    ];

// function display history on webpage
var displayHistory = function(){

    $(".history li").remove();

    loadSearch()

    for(var i = searchCount-1 ; i >= 0 ; i--){
        var historyListEl = $("<li>")
            .text(cities[i][0].name)
            .addClass("search-history btn grey col s12");
        
        $(".history").append(historyListEl);

    }

};

// loading search hostory from local storage
var loadSearch = function(){
    cities = JSON.parse(localStorage.getItem("cities"));

    if(!cities){
        cities=[];
        return 0;
    }else{

        // making sure maximum 10 searches are saved and displayed
        if(cities.length>10){
            cities.shift();
            searchCount = cities.length;
        }
        return 1;
    }
    
};


// function to check duplicated searches and make sure the search history is unique
var checkDuplicateSearch = function (city){

    // array recieving value 0 for no history stored and 1 if search history is saved in local storage
    var arr = loadSearch();

    // duplicate flag sets for duplicate searches and resets for unique search
    var duplicate = 0;

    // check for duplicated search in the local storage if the array is non-empty
    if(arr){
    
   for (var i = 0; i< searchCount; i++){
       if((cities[i][0].name === city)){
           duplicate = 1;
           break;
       }
   }

   // save searched city to local storage if it is unique
    if(duplicate === 0){
        saveSearch(city);
    }

}else{
    // save searched city to without duplicate checking local storage of it is first search
    saveSearch(city);
}
};


// function to save searches to local storage
var saveSearch = function(city){

    var tempArr=[]
    tempArr.push({
        name:city
    });

    cities[searchCount]=tempArr;
    searchCount++;

    // save searches in local storage
    localStorage.setItem("cities", JSON.stringify(cities));

    var arry = loadSearch();
    displayHistory();

};


// function to color code the UV index as per the risk severity
var uviCheck = function(){

    $(".current-data li:last-child").attr("id","uvi");
    $("#uvi p:nth-child(2)").addClass("uvi-data");

    var uviData = $(".uvi-data");
    var uviValue = uviData.text();

    // green: "LOW" risk level
    if(uviValue<=2){
        uviData.addClass("green");
    }

    // yellow: "Moderate" risk level 
    else if(uviValue>2 && uviValue<=5){
        uviData.addClass("yellow");
    }

    // orange: "High" risk level
    else if(uviValue>5 && uviValue<=7){
        uviData.addClass("orange");
    }

    // red: "Extreme" risk
    else{
        uviData.addClass("red");
    }
};

// display current day weather forecast
 var displayCurrentWeather = function(forecast){


               // display current weather forecast in an unordered list
    for( var i = 0 ; i < weatherData.length ; i++){

        // saving the current weather forecast data in an array
        weatherData[i].value = forecast[legends[i]];

        var dataEl = $("<li>")
            .html(`<p>${weatherData[i].name}</p><p>${weatherData[i].value}</p><p>${units[i]}</p>`);

        listEl.append(dataEl);
    }
       // color coding UV index based on conditions' severity
       uviCheck();
    }

// display 5-Day weather forecast
 var displayDailyWeather = function(forecast){

    forecastArrIndex = listEl.attr("id");

    // display current weather forecast in an unordered list
    for( var i = 0 ; i < weatherData.length-1; i++){

        if(i!==0){
            weatherData[i].value = forecast[forecastArrIndex][legends[i]];
        }
        else{
        // saving the current weather forecast data in an array
        weatherData[i].value = forecast[forecastArrIndex][legends[i]].day;
        }

        var dataEl = $("<li>")
            .html(`<p>${weatherData[i].name}</p><p>${weatherData[i].value}</p><p>${units[i]}</p>`);

        listEl.append(dataEl);
    }

 }

 var dailyForecast = function(dailyForecast){

    $(".weather-forecast").remove();

    for (var i = 1 ; i <= futureDays ; i++){

        var divEl = $("<div>")
            .addClass("weather-forecast card-panel blue-grey white-text col s2");

        // display date
        var dateEl = $("<time>")
            .addClass("col s12")
            .text(`${dayjs.unix(dailyForecast[i].dt).format("DD/MM/YYYY")}`);

        // display weather icon
        var weatherIcon = $("<img>")
            .attr("src", `https://openweathermap.org/img/w/${dailyForecast[i].weather[0]["icon"]}.png`)
            .attr("alt", `${dailyForecast[i].weather[0]["description"]}`);

        listEl = $("<ul>")
            .attr("id", i);

        // function to display the forecast
        displayDailyWeather(dailyForecast);

        divEl.append(dateEl);
        divEl.append(weatherIcon);
        divEl.append(listEl);
        $(".daily-wrapper").append(divEl);

    }

 }

 var currentForecast = function(city, currentForecast){

    $(".current-data li").remove();

    // display city name
    $("#city").text(city);

    // display current date
    $("#current-date")
        .text(`${dayjs.unix(currentForecast.dt)
        .format(" (DD/MM/YYYY) ")} `);

    // display current weather icon
    $(".icon")
        .attr("src",`https://openweathermap.org/img/w/${currentForecast.weather[0]["icon"]}.png`)
        .attr("alt", currentForecast.weather[0]["description"]);

    listEl = $(".current-data");

    // function to display required weather details/legends
    displayCurrentWeather(currentForecast);
 }

 // function to get current and dialy forecast
 var getForecast = function (name, lon, lat){

    const oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`;

    fetch(oneCallApi).then(function(response){

        response.json().then(function(data){

            if(response.ok){

                currentForecast(name,data.current);
                dailyForecast(data.daily);

            }else{

                alert("Please enter valid city Name");

            }

        });
    }); 
}
 
// get coordinates of the searched city to display 5-day forecast
 var getLocation = function(userInput){

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${apiKey}`;

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){

            if(response.ok){

                // getting lattitude and longitude of he city searched
                var lat = data.coord.lat;
                var long = data.coord.lon;

                // check if the same city was searched before to avoid duplicated search history
                checkDuplicateSearch(data.name);

                // get current day and future weather forecast by feeding city name and coordinates to one call API - 5Day weather forecast
                getForecast(data.name, long,lat);

            }else{
                alert("Please enter a valid city name!");
            }
        })
    })
}

// event listener for city search
 $("#submit").on("click", function(event){
    event.preventDefault();
     var userInput = $("#city-name").val().trim();

    if(userInput){
        getLocation(userInput);
    }else{
        alert("Please enter a city name.")
    }
});

// event listener for searching through history
$(".history").on("click", function(e){
    e.preventDefault();
    var selection = e.target.innerHTML;

    if(selection){
        getLocation(selection);
    }else{
        alert("Please enter a city name.")
    }
});

// display previous search history when page is loaded
displayHistory();
const apiKey = "64eb91bf2065795eb1daaa57db853cad";
const units = ["<sup>o</sup>F", "<span>MPH</span>", "<span>%</span>", ""]
const futureDays = 5;

var cities=[];
var searchCount = 0;
var forecastArrIndex;
var listEl;


const legends = ["temp", "wind_speed", "humidity", "uvi"];
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


var saveSearch = function(city){

    var tempArr=[]
    tempArr.push({
        name:city
    });

    cities[searchCount]=tempArr;
    searchCount++;

    // save searches in local storage
    localStorage.setItem("cities", JSON.stringify(cities));

}

var uviCheck = function(){

    $(".current-data li:last-child").attr("id","uvi");
    $("#uvi p:nth-child(2)").addClass("uvi-data");

    var uviData = $(".uvi-data");
    var uviValue = uviData.text();

    if(uviValue<=2){
        uviData.addClass("green");
    }
    else if(uviValue>2 && uviValue<=5){
        uviData.addClass("yellow");
    }
    else if(uviValue>5 && uviValue<=7){
        uviData.addClass("orange");
    }
    else{
        uviData.addClass("red");
    }
}

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

        var dateEl = $("<time>")
            .addClass("col s12")
            .text(`${dayjs.unix(dailyForecast[i].dt).format("DD/MM/YYYY")}`);

        var weatherIcon = $("<img>")
            .attr("src", `https://openweathermap.org/img/w/${dailyForecast[i].weather[0]["icon"]}.png`)
            .attr("alt", `${dailyForecast[i].weather[0]["description"]}`);

        listEl = $("<ul>")
            .attr("id", i);

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
 
 var getLocation = function(userInput){

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${apiKey}`;

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){

            if(response.ok){
                var lat = data.coord.lat;
                var long = data.coord.lon;
                saveSearch(data.name);
                getForecast(data.name, long,lat);
            }else{
                alert("Error");
            }
        })
    })
}

 $("#submit").on("click", function(event){
    event.preventDefault();
     var userInput = $("#city-name").val().trim();

    if(userInput){
        getLocation(userInput);
    }else{
        alert("Please enter a city name.")
    }
});
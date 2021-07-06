const apiKey = "64eb91bf2065795eb1daaa57db853cad";
const legends = ["temp", "wind_speed", "humidity", "uvi"];
const units = ["<sup>o</sup>F", "<span>MPH</span>", "<span>%</span>", ""]
const futureDays = 5;

var userInput;
var currentWeatherEl = document.querySelector(".current-day")

const weatherLegends = [
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



$("#submit").on("click", function(event){
    event.preventDefault();
    userInput = $("#city-name").val().trim();

    if(userInput){
        getCoord();
    }else{
        alert("Please enter a city name.")
    }
});

var getCoord = function(){
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=${apiKey}`;

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){

            if(response.ok){
                var lat = data.coord.lat;
                var long = data.coord.lon;
                weatherData(data.name, long,lat);
            }else{
                alert("Error");
            }
        })
    })
}


var weatherData = function (name, lon, lat){
    const oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}`;

    fetch(oneCallApi).then(function(response){
        response.json().then(function(data){
            if(response.ok){
                displayCurrentData(name,data.current);
                displayDailyData(data.daily);

                
            }else{
                alert("Please enter valid city Name");
            }
        });
    }); 
}

var uviCheck = function(){
    $(".current-day li:last-child").attr("id","uvi");
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

 var displayCurrentData = function(city, current){

    $("#city").text(city);
    $("#current-date").text(`${dayjs.unix(current.dt).format(" (DD/MM/YYYY) ")} `);
    $(".icon")
        .attr("src",`https://openweathermap.org/img/w/${current.weather[0]["icon"]}.png`)
        .attr("alt", current.weather[0]["description"]);

    for( var i = 0 ; i < weatherLegends.length ; i++){
        weatherLegends[i].value = current[legends[i]];
        var listEl = document.createElement("li");
        var markup = `<p>${weatherLegends[i].name}</p><p>${weatherLegends[i].value}</p><p>${units[i]}</p>`;
        listEl.innerHTML = markup;
        currentWeatherEl.appendChild(listEl);
    }
    uviCheck();
 }

 var displayDailyData = function(daily){

    for (var i = 1 ; i <= futureDays ; i++){

        var divEl = document.createElement("div");
        
        var dailyData = 
        `<time class="col s12">${dayjs.unix(daily[i].dt).format("DD/MM/YYYY")}</time>
        <img src="https://openweathermap.org/img/w/${daily[i].weather[0]["icon"]}.png">
        <ul>
        <li><p>Temp: ${daily[i].temp.day}<sup>o</sup>F<p></li>
        <li><p>Wind: ${daily[i].wind_speed} MPH</p></li>
        <li><p>Humidity: ${daily[i].humidity}%</p></li>
        </ul>`;

        divEl.innerHTML = dailyData;

        var wrapperEl = document.querySelector(".daily-wrapper");
        wrapperEl.appendChild(divEl);
 }

 $(".daily-wrapper div").addClass("weather-forecast card-panel blue-grey white-text col s2");

 }
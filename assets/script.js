const apiKey = "64eb91bf2065795eb1daaa57db853cad";
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
const legends = ["temp", "wind_speed", "humidity", "uvi"];
const units = ["<sup>o</sup>F", "<span>MPH</span>", "<span>%</span>", ""]
var userInput;
var dateEl = document.querySelector(".date");
var currentWeatherEl = document.querySelector(".current-day")


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
                for( var i = 0 ; i < weatherLegends.length ; i++){
                    weatherLegends[i].value = data.current[legends[i]];
                    var listEl = document.createElement("li");
                    var markup = `<p>${weatherLegends[i].name}</p><p>${weatherLegends[i].value}</p><p>${units[i]}</p>`;
                    listEl.innerHTML = markup;
                    currentWeatherEl.appendChild(listEl);
                }
                uviCheck();
                display(name, data.current.weather[0]["icon"], data.current.weather[0]["description"]);
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

var display = function(city, icon, description){
    $("#city").text(city);
    dateEl.textContent= "(" + dayjs().format("DD/MM/YYYY")+ ")";
    $(".icon").attr("src", `https://openweathermap.org/img/w/${icon}.png`)
        .attr("alt", description);
 };
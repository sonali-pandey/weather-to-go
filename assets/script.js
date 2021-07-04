var dataSubmitEl = document.querySelector("#submit");
var userInputEl = document.querySelector("#city-name");
var cityEl = document.querySelector("#city");

var formSubmitHandler = function(event){
 event.preventDefault();

 // get input data
 var cityName = userInputEl.value.trim();

    if(cityName){
        alert("HEY!");
    display(cityName);
    }else(
        alert("Please enter a city name.")
    )
};

var display = function(cityName){
    // cityEl.textContent = data.city.name;
    cityEl.textContent = cityName + " (" + dayjs().format("DD/MM/YYYY")+ ")";

};

dataSubmitEl.addEventListener("click", formSubmitHandler);
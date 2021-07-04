var userFormEl = document.querySelector("#user-form");
var userInputEl = document.querySelector("#city-name")
const apiKey = "64eb91bf2065795eb1daaa57db853cad";

var formSubmitHandler = function(event){
 event.preventDefault();

 // input data
 var cityName = userInputEl.value.trim();
 console.log(cityName);
}

userFormEl.addEventListener("click", formSubmitHandler);
let currentDate = $("#current-date").text(moment().format("MM-DD-YYYY"));
var clearBtn = document.querySelector("#clear");
let citiesDiv = document.getElementById("cities");
let cities;
var searchInput;
var APIKey = "7ce604287f42a2c24e790725482afef6";

function displaySaved() {
  let citiesSaved = JSON.parse(localStorage.getItem("cities"));
  if (citiesSaved) {
    cities = citiesSaved;
  } else {
    cities = [];
  }
  cities.forEach((city) => createButtons(city));
}

function savedCities(citiesToSave) {
  localStorage.setItem("cities", JSON.stringify(citiesToSave));
}

clearBtn.addEventListener("click", function () {
  window.localStorage.clear();
  citiesDiv.innerHTML = "";
});

function searchCity(searchInput, addToHistory = true) {
  if (!searchInput) {
    alert("please enter a city");
    return false;
  }

  $("#forecastRow").empty();
  if (addToHistory) {
    createButtons(searchInput);
    cities.push(searchInput);
  }
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchInput +
    "&units=imperial&appid=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response.coord.lon);
    console.log(response.coord.lat);
    var latData = response.coord.lat;
    var lonData = response.coord.lon;
    $("#current-city").text(response.name);
    $("#current-windspeed").text("Wind Speed: " + response.wind.speed);
    $("#current-humidity").text("Humidity: " + response.main.humidity);
    $("#current-temp").text("Temperature (F) " + response.main.temp.toFixed(2));
    $("#weather-image").attr({
      src:
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png",
      height: "100px",
      width: "100px",
    });
    getuvIndex(latData, lonData);
  });

  savedCities(cities);

  var queryURL5 =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    searchInput +
    "&units=imperial&appid=" +
    APIKey;
  $.ajax({
    url: queryURL5,
    method: "GET",
  }).then(function (response5) {
    for (i = 0; i < response5.list.length; i++) {
      if (response5.list[i].dt_txt.split(" ")[1] === "18:00:00") {
        var forecastEl = $("<div class='col' id='fiveDay'>");
        var dateEl = $("<h6>").append(
          "Date: " + response5.list[i].dt_txt.split(" ")[0]
        );
        var iconEl = $("<h6>").append(
          "<img src='https://openweathermap.org/img/w/" +
            response5.list[i].weather[0].icon +
            ".png'>"
        );
        var tempEl = $("<h6>").append("Temp: " + response5.list[i].main.temp);
        var humidityEl = $("<h6>").append(
          "Humidity: " + response5.list[i].main.humidity
        );
        forecastEl.append(dateEl, iconEl, tempEl, humidityEl);
      }
      $("#forecastRow").append(forecastEl);
    }
  });
}

$("#search").on("click", function (event) {
  event.preventDefault();
  var searchInput = $("#searchInput").val();
  searchCity(searchInput);
  $("#forecastRow").empty();
});

function createButtons(searchInput) {
  var btn = $("<button>").text(searchInput);
  btn.addClass("list-button");
  btn.attr("data-name", searchInput);
  btn.on("click", function (event) {
    event.preventDefault();
    searchCity(searchInput, false);
  });
  $("#cities").append(btn);
}
function getuvIndex(latData, lonData) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
    latData +
    "&lon=" +
    lonData +
    "&appid=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (uvresponse) {
    var uv = uvresponse.value;
    console.log(uvresponse);
    $("#uv-index").text("uv-index: " + uv);
    $("#uv-index").removeClass(
      ["low", "moderate", "high", "veryHigh", "extreme"].join(" ")
    );
    if (uv < 3) {
      $("#uv-index").addClass("low");
    } else if (uv < 6) {
      $("#uv-index").addClass("moderate");
    } else if (uv < 8) {
      $("#uv-index").addClass("high");
    } else if (uv < 11) {
      $("#uv-index").addClass("veryHigh");
    } else {
      $("#uv-index").addClass("extreme");
    }
  });
}
$(document).ready(function () {
  displaySaved();
});

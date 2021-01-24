let currentDate = $("#current-date").text(moment().format("MM-DD-YYYY"));
var clearBtn = document.querySelector("#clear");
let citiesDiv = document.getElementById("cities");
let cities;
var searchInput;
var APIKey = "7ce604287f42a2c24e790725482afef6";

function displaySaved() {
  let savedCities = JSON.parse(localStorage.getItem("cities"));
  if (savedCities) {
    cities = savedCities;
  } else {
    cities = [];
  }
  $("#forecastRow").empty();
}

function savedCities(cities) {
  localStorage.setItem("cities", JSON.stringify(cities));
}

clearBtn.addEventListener("click", function () {
  window.localStorage.clear();
  citiesDiv.innerHTML = "";
});

function searchCity(searchInput) {
  displaySaved();
  cities.push(searchInput);
  if (searchInput != "") {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      searchInput +
      "&units=imperial&appid=" +
      APIKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      var latData = $(response.coord.lat);
      var lonData = $(response.coord.lon);
      console.log(response);
      $("#current-city").text(response.name);
      $("#current-windspeed").text("Wind Speed: " + response.wind.speed);
      $("#current-humidity").text("Humidity: " + response.main.humidity);
      $("#current-temp").text(
        "Temperature (F) " + response.main.temp.toFixed(2)
      );
      $("#uv-index").text("uv-index: " + latData + lonData);
      $("#weather-image").attr({
        src:
          "https://openweathermap.org/img/w/" +
          response.weather[0].icon +
          ".png",
        height: "100px",
        width: "100px",
      });
    });
    savedCities(cities);
  } else {
    alert("please enter a city");
  }
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
  createButtons(searchInput);
  $("#forecastRow").empty();
});

function getUV(latData, lonData) {
  var queryURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latData +
    "&lon=" +
    lonData +
    "&exclude=minutely,hourly,daily,alerts&appid=" +
    APIKey;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (uvresponse) {
    searchCity(input);
    var uvresponse = lonData;
    var uvresponse = latData;
    if (uvresponse < 3) {
      $(this).addClass("low");
    } else if (uv < 6) {
      $(this).addClass("moderate");
    } else if (uv < 8) {
      $(this).addClass("high");
    } else if (uv < 11) {
      $(this).addClass("veryHigh");
    } else {
      $(this).addClass("extreme");
    }
    $("#uv-index").text(uv);
  });
}

function createButtons(searchInput) {
  var btn = $("<button>").text(searchInput);
  btn.addClass("list-button");
  btn.attr("data-name", searchInput);
  btn.on("click", function (event) {
    event.preventDefault();
    searchCity(searchInput);
  });
  $("#cities").append(btn);
}

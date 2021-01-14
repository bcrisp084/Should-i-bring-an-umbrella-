let currentDate = $("#current-date").text(moment().format("MM-DD-YYYY"));
var APIKey = "7ce604287f42a2c24e790725482afef6";
var searchInput = $("#searchInput").val();

$("#search").on("click", function (event) {
  event.preventDefault();
  if (searchInput !== "") {
    var queryURL =
      "http//api.openweathermap.org/data/2.5/weather?q=" +
      searchInput +
      "&units=imperial" +
      APIKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      $(".currrent-city").html(
        "<h1>" + response.name + " Weather Details</h1>"
      );
      $(".current-wind").text("Wind Speed: " + response.wind.speed);
      $(".current-humidity").text("Humidity: " + response.main.humidity);
      $(".current-temp").text("Temperature (F) " + currerntTemp.toFixed(2));
    });
  } else {
    alert("please enter a city");
  }
});

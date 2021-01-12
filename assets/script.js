$(document).ready(function () {
  let currentDate = $("#date").text(moment().format("MM-DD-YYYY"));
  let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
  const inputEl = document.getElementById("searchInput");
  const humidityEl = document.querySelector(".humidity");
  const tempEl = document.querySelector(".temp");
  const uvIndexEl = document.querySelector(".uv-index");
  const windEl = document.querySelector(".wind");

  searchEl.addEventListener("click", function () {
    const searchTerm = inputEl.value;
    getWeather(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
  });
});

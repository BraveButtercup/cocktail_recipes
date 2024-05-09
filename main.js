const API_URL = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic";
const API_URL_NON = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic";
const API_INGR = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;
let searchValue;
const DRINKS = await fetchData(API_URL);
const NADRINKS = await fetchData(API_URL_NON);
const $CONTAINER = document.querySelector(".js-container");
const $BUTTON_FIRST = document.querySelector(".js-btn");
const $BUTTON_TWO = document.querySelector(".js-btn-two");
const $INPUT = document.querySelector(".js-field");

//
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.drinks
};

function renderData(data) {
    $CONTAINER.innerHTML = ""
    let template = data.map(glass => createDataTemplate(glass)).join("");
    $CONTAINER.innerHTML = template;
};

function alkoholOrNon(event) {
    event.preventDefault();
    let inputValue = document.querySelector('input[name="cocktail"]:checked').value;
    if (inputValue === "Alcoholic") {
        renderData(DRINKS);
    } else {
        renderData(NADRINKS);
    }
};

// searchbar

function createDataTemplate(data) {
    return `<div class="cocktail-card">
    <h2 class="js-name">${data.strDrink}</h2>
    <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="search-img"/>
    <p>${data.strInstructions}</p>
    </div>`
}

async function eventHandler(e) {
    e.preventDefault();
    debugger;
    searchValue = e.target.value.toLowerCase();
    let newApi = API_INGR + searchValue;
    let ingredients = await fetchData(newApi)
    renderData(ingredients);
};


$BUTTON_FIRST.addEventListener("click", alkoholOrNon);
$INPUT.addEventListener("input", eventHandler);

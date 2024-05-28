const API_NAME = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;
const API_INGR = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=`;
const CONTAINER = document.querySelector(".js-container");
const BUTTON = document.querySelector(".js-btn");
const INPUT = document.querySelector(".js-field");

async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.drinks;
    }
    catch (error) {
        return `<div> Fetch failed ${error}</div>`
    }
};

function renderData(data) {

    if (data.length) {
        let template = data.map(glass => createDataTemplate(glass)).join("");
        CONTAINER.innerHTML = template;
    } else {
        CONTAINER.innerHTML = `<div class="error"> No result! Try again </div>`;
    }
};

function createDataTemplate(data) {

    let filteredIngredients = renderIngredients(data);// itt tartok rendereljen ki recepteket gombbal amikor rányomok a gombra megjeleniti a receptet összetevőkkel és leiárssal
    if (filteredIngredients.length > 0) {
        return `<div class="js-card cocktail-card">
                <h2 class="js-name"> ${data.strDrink}</h2>
                <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="search-img"/>
                <h3> Ingredients: </h3>
                <ul>${filteredIngredients}</ul>
                <p>${data.strInstructions}</p>
                </div>`
    } else {
        return ` <div class="js-card cocktail-card">
                <h2 class="js-name"> ${data.strDrink}</h2>
                <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="search-img"/>
                <button class="view-button js-view-btn" data-id ="${data.idDrink}"> View Recipe </button>
                </div>`
    }
}

function validation() {

    if (INPUT.value == "" || INPUT.value.trim().length == 0) {
        INPUT.classList.add("is-invalid")
        return false;
    } else {
        INPUT.classList.remove("is-invalid")
    }
    return true;
};

async function eventHandler(e) {

    e.preventDefault();
    let searchValue = INPUT.value;
    let searchType = document.querySelector('input[name="searchType"]:checked').value;
    CONTAINER.innerHTML = "";
    if (validation()) {
        try {
            if (searchType === "name") {
                let newApi = API_NAME + searchValue;
                let instructions = await fetchData(newApi);
                renderData(instructions);
            }
            else {
                let newApiTwo = API_INGR + searchValue;
                let ingredients = await fetchData(newApiTwo);
                renderData(ingredients);
            }
        }
        catch (error) {
            CONTAINER.innerHTML = `<div class="error js-error"> No Results </div>`
        }

    }
};

function renderIngredients(value) {
    let newList = [];

    for (let i = 1; i <= 15; i++) {
        let ingr = value[`strIngredient${i}`];
        if (typeof ingr === "string" && ingr.length > 0) {
            newList.push(ingr);
        };
    }
    return newList.map(newListIngr => `<li>${newListIngr}</li>`).join("");

}
async function viewRecipeDetails(e) {

    if (e.target.classList.contains('js-view-btn')) {
        const drinkId = e.target.getAttribute('data-id');
        const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkId}`;
        const data = await fetchData(url);
        renderData(data);
    }
}
BUTTON.addEventListener("click", eventHandler);
INPUT.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        eventHandler(e);
    }
});


CONTAINER.addEventListener("click", viewRecipeDetails);



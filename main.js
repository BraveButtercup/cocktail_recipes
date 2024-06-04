const API_NAME = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;
const API_INGR = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=`;
const CONTAINER = document.querySelector(".js-cocktail-container");
const ERROR_CONTAINER = document.querySelector(".js-error-container")
const BUTTON = document.querySelector(".js-btn");
const INPUT = document.querySelector(".js-field");
const UPARROW = document.querySelector(".backtotop");

let showBackButton;
let previousData = [];

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

function renderData(data, showBackButton = false) {

    if (data.length) {
        let template = data.map(glass => createDataTemplate(glass, showBackButton)).join("");
        CONTAINER.innerHTML = template;
    } else {
        ERROR_CONTAINER.innerHTML = `<div class="error"> No result! Try again </div>`;
    }
};

function createDataTemplate(data, showBackButton = false) {

    let filteredIngredients = renderIngredients(data);
    if (filteredIngredients.length > 0) {
        return `<div class="js-card cocktail-card">
                <h2 class="js-name"> ${data.strDrink}</h2>
                <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="search-img"/>
                <div class=ingr-list">
                <h3> Ingredients: </h3>
                <ul>${filteredIngredients}</ul>
                </div>
                <p>${data.strInstructions}</p>
                 ${showBackButton ? '<button class="viewandback-btn js-back-btn"> Back </button>' : ''}
                </div>
                `
    } else {
        return ` <div class="js-card cocktail-card">
                <h2 class="js-name"> ${data.strDrink}</h2>
                <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="search-img"/>
                <button class="viewandback-btn  js-view-btn" data-id ="${data.idDrink}"> View Recipe </button>
               
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
            let data;
            if (searchType === "name") {
                let newApi = API_NAME + searchValue;
                data = await fetchData(newApi);
            }
            else {
                let newApiTwo = API_INGR + searchValue;
                data = await fetchData(newApiTwo);
            }
            previousData = data;
            renderData(data);
            CONTAINER.classList.remove("viewed")
        }
        catch (error) {
            ERROR_CONTAINER.innerHTML = `<div class="error-card"> No Results </div>`
        }

    }

    CONTAINER.scrollIntoView();
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
        renderData(data, showBackButton = true);
        CONTAINER.classList.add("viewed")
    }
    CONTAINER.scrollIntoView();
}

function goBack(e) {
    if (e.target.classList.contains('js-back-btn')) {
        renderData(previousData);
        CONTAINER.classList.remove("viewed");
    }
}


BUTTON.addEventListener("click", eventHandler);
INPUT.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        eventHandler(e);
    }
});


CONTAINER.addEventListener("click", viewRecipeDetails);
CONTAINER.addEventListener("click", goBack);
window.addEventListener("scroll", () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        UPARROW.classList.add("show");
    } else {
        UPARROW.classList.remove("show");
    }
});


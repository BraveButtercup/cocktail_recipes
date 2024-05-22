const API_NAME = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;
const API_INGR = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=`;
const CONTAINER = document.querySelector(".js-container");
const BUTTON = document.querySelector(".js-btn-two");
const INPUT = document.querySelector(".js-field");



async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.drinks;
};

function renderData(data) {

    CONTAINER.innerHTML = "";
    let template = data.map(glass => createDataTemplate(glass)).join("");
    CONTAINER.innerHTML = template;

};

function createDataTemplate(data) {
    let searchType = document.querySelector('input[name="searchType"]:checked').value;
    if (searchType === "name") {
        let filteredIngredients = renderIngredients(data);

        return `<div class="js-card cocktail-card">
                <h2 class="js-name"> ${data.strDrink}</h2>
                <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="search-img"/>
                <div>Ingredients: 
                <ul>${filteredIngredients}</ul></div>
                <p>${data.strInstructions}</p>
    
                </div>`
    } else if (searchType === "ingredient") {
        return `<div class="js-card cocktail-card">
                <a href="#"><h2 class="js-name" data-id = ${data.idDrink} > ${data.strDrink}</h2></a>
                <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="search-img"/>
                </div>`
    } else {
        return `<div class="error js-error"> No results </div>`
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
        } catch (error) {
            CONTAINER.innerHTML = `<div class="error js-error"> No results </div>`
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

async function searchRecipe(e) {
    debugger;
    e.preventDefault();
    CONTAINER.innerHTML = "";
    let idValue = e.target.dataset.id;
    let ingredientsData = await fetchData(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idValue}`);
    let filteredIngredientsTwo = renderIngredients(ingredientsData[0]);
    let html =
        `<div class="js-card cocktail-card">
    <h2 class="js-name"> ${ingredientsData[0].strDrink}</h2>
    <img src="${ingredientsData[0].strDrinkThumb}" alt="${ingredientsData[0].strDrink}" class="search-img"/>
    <div>Ingredients: 
    <ul>${filteredIngredientsTwo}</ul></div>
    <p>${ingredientsData[0].strInstructions}</p>

    </div>`

    return CONTAINER.innerHTML += html;

}

BUTTON.addEventListener("click", eventHandler);
INPUT.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        eventHandler(e);
    }
});

CONTAINER.addEventListener("click", searchRecipe);





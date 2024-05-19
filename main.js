const API_NAME = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=`;
const API_INGR = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=`;
const $CONTAINER = document.querySelector(".js-container");
const $BUTTON = document.querySelector(".js-btn-two");
const $INPUT = document.querySelector(".js-field");
//const API = await fetchdata()



//
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data.drinks || [];
};

function renderData(data) {

    $CONTAINER.innerHTML = "";
    let template = data.map(glass => createDataTemplate(glass)).join("");
    $CONTAINER.innerHTML = template;


};

function createDataTemplate(data) {
    let searchType = document.querySelector('input[name="searchType"]:checked').value;
    if (searchType === "name") {
        let filteredIngredients = renderIngredients(data);

        return `<div class="js-card cocktail-card">
                <h2 class="js-name" data-id = ${data.idDrink} > ${data.strDrink}</h2>
                <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="search-img"/>
                <div>Ingredients: 
                <ul>${filteredIngredients}</ul></div>
                <p>${data.strInstructions}</p>
    
                </div>`}
    else {
        return `<div class="js-card cocktail-card">
                <h2 class="js-name" data-id = ${data.idDrink} > ${data.strDrink}</h2>
                <img src="${data.strDrinkThumb}" alt="${data.strDrink}" class="search-img"/>
                </div>`
    }
}


function validation() {

    if ($INPUT.value == "" || $INPUT.value.trim().length == 0) {
        $INPUT.classList.add("is-invalid")
        return false;
    } else {
        $INPUT.classList.remove("is-invalid")
    }
    return true;
};

async function eventHandler(e) {
    debugger;
    e.preventDefault();
    let searchValue = $INPUT.value;
    let searchType = document.querySelector('input[name="searchType"]:checked').value;
    $CONTAINER.innerHTML = "";
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
            $CONTAINER.innerHTML = `<div class="error js-error"> No results </div>`
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

    return newList.map(newListIngr => `<li>${newListIngr}</li>`).join("");;

}
$BUTTON.addEventListener("click", eventHandler);
$INPUT.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        eventHandler(e);
    }
});





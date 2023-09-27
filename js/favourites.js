const mealContainer = document.querySelector('.meal');
const favouriteMealContainer = document.querySelector('.favourite-meal');
const mealReceipePopupContainer = document.querySelector('.meal-receipe-popup-container');
const mealReceipePopupCloseButton = document.querySelector('.meal-receipe-popup > i');
const mealReceipePopupInside = document.querySelector('.meal-receipe-popup-inside');

// calling favourite meal function to show favourite meals present 
getfavouriteMeals();

// function to get meals in local storage
function getMeals(){
    const mealIDs = JSON.parse(localStorage.getItem('mealIDs'));
    return mealIDs === null ? [] : mealIDs;
}

// function to return meal by its id
async function getMealByID(id){
    // fetching meal using its id
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    // storing in json format
    const dataJson = await data.json();
    const meal = dataJson.meals[0];
    return meal;
}

// function to get favourite meal
async function getfavouriteMeals(){
    favouriteMealContainer.innerHTML = '';
    // getting meals from local storage
    const mealIDs = getMeals();
    const meals = [];
    for(let i=0; i<mealIDs.length;i++){
        const mealId = mealIDs[i];
        // getting meal by its id
        meal = await getMealByID(mealId);
        // adding it to favourite
        addMealToFavourite(meal);
        meals.push(meal);
    }
}

// function to add meal in favourites
function addMealToFavourite(meal){
    // creating favourite meal element with class name
    const favouriteMeal = document.createElement('div');
    favouriteMeal.innerHTML = `
    <div class="meal-card">
        <div class="meal-card-img-container">
            <img
            src="${meal.strMealThumb}"
            />
        </div>
        <div class="meal-name">
            <p>${meal.strMeal}</p>
            <i class="fa-x"></i>
        </div>
    </div>`;
    // fetching cross button
    const cross = favouriteMeal.querySelector('.fa-x');
    // fetching container of image receipe 
    const mealImageReceipe = favouriteMeal.querySelector('.meal-card-img-container')
    // adding event listener to remove from favourites
    cross.addEventListener('click', ()=>{
        // calling function to remove meal by its id
        removeFavouriteMeal(meal.idMeal);
        // keeping the other all favourite meals
        const heartButtons = document.querySelectorAll('.fa-heart');
        heartButtons.forEach((heartButton)=>{
            heartButton.setAttribute('class', ' fa-regular fa-heart');
        });
        getfavouriteMeals();
        
    });
    // appending favourite meal in favourite container
    favouriteMealContainer.appendChild(favouriteMeal);
    // adding event listener on image container to show receipe of the meal
    mealImageReceipe.addEventListener('click', () => {
        // calling receipe function to show instructions of the meal
        showMealReceipe(meal);
    });

}

// function to remove meal from favourites using id
function removeFavouriteMeal(mealId){
    const mealIDs = getMeals();
    localStorage.setItem(
        'mealIDs',
        JSON.stringify(mealIDs.filter((id)=> id!==mealId))
    );
}

// function to show receipe of  the meal
function showMealReceipe(meal){
    mealReceipePopupInside.innerHTML = '';
    // creating element for receipe container
    const mealReceipe = document.createElement('div');
    mealReceipe.classList.add('meal-receipe-popup-inside');
    // adding ingredients with quantity
    const ingredients = [];
    for(let i=1;i<=20;i++)
    {
        if(meal[`strIngredient${i}`]){
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
        else{
            break;
        }
    }
    // setting meal receipe  for receipe container using class name
    mealReceipe.innerHTML = `<div class="left">
        <div class="meal-card">
            <div class="meal-card-img-container">
                <img src="${meal.strMealThumb}"/>
            </div>
            <div class="meal-name">
                <p> ${meal.strMeal}</p>
            </div>
        </div>
        <div class="ingredients">
            <h1>Ingredients</h1>
            <ul>
                ${ingredients.map((ingredient) => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
    </div>
    <div class="right">
        <div>
            <h1>Instructions</h1>
            <p class="meal-instructions">
            ${meal.strInstructions}</p>
        </div>
    </div>`;
    // adding meal receipe inside popup window
    mealReceipePopupInside.appendChild(mealReceipe);

    // styling meal receipe popup container
    mealReceipePopupContainer.style.display = `flex`;
    
    // adding event listener to close meal receipe pop up 
    mealReceipePopupCloseButton.addEventListener('click', ()=>{
        mealReceipePopupContainer.style.display = 'none';
    })
    
}
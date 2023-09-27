const search = document.querySelector('.search');
const mealContainer = document.querySelector('.meal');
const mealReceipePopupContainer = document.querySelector('.meal-receipe-popup-container');
const mealReceipePopupCloseButton = document.querySelector('.meal-receipe-popup > i');
const mealReceipePopupInside = document.querySelector('.meal-receipe-popup-inside');

// function to return meals from php api
async function getSearchMeal(meal){
    // feteching meal from api
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${meal}`);
    // storing meal with information in json format
    const dataJson = await data.json();
    const meals = dataJson.meals;
    return meals;
}

// adding event listener on search while pressing any key
search.addEventListener('keypress', async() =>{
    mealContainer.innerHTML = '';
    const searchValue = search.value;
    const meals = await getSearchMeal(searchValue);
    if(meals){
        meals.forEach((meal) => {
            // calling function to add meal on screen
            addMeal(meal);
        });
    }else {
        mealContainer.innerHTML='';
    }
})

// function to add serached meals on screen by creating div element 
function addMeal(meal){
    const mealCard = document.createElement('div');
    mealCard.classList.add('meal-card');
    // adding meal with class name in mealcard 
    mealCard.innerHTML = `<div class="meal-card-img-container">
        <img src="${meal.strMealThumb}"/>
    </div>
    <div class="meal-name">
        <p>${meal.strMeal}</p>
        <i class="fa-regular fa-heart"></i>
    </div>` ;
    // fetching heart button
    const buttonFavourite = mealCard.querySelector('.fa-heart');
    // adding event listener on heart button whether clicked or not
    buttonFavourite.addEventListener('click', () => {
        if(buttonFavourite.classList.contains('fa-regular')){
            buttonFavourite.setAttribute('class', 'fa-solid fa-heart');
            addMeals(meal.idMeal);
        }
        else{
            buttonFavourite.setAttribute('class', 'fa-regular fa-heart');
            removeMeals(meal.idMeal);
        }
    })
    // appending each meal card in meal container
    mealContainer.appendChild(mealCard);  
    // adding event listener on meal card to see the receipe with instructions and gradients
    mealCard.firstChild.addEventListener('click',
    ()=>{
        // calling meal receipe function 
        showMealReceipe(meal);
    });

}

// function to get meals in local storage
function getMeals(){
    const mealIDs = JSON.parse(localStorage.getItem('mealIDs'));
    console.log(mealIDs)
    return mealIDs === null ? [] : mealIDs;
}

// function to add meal id in local storage
function addMeals(mealId){
    const mealIDs = getMeals();
    localStorage.setItem('mealIDs', JSON.stringify([...mealIDs,mealId]));
}

// function to remove meal with the specific id from local storage
function removeMeals(mealId){
    const mealIDs = getMeals();
    localStorage.setItem('mealIDs', JSON.stringify(mealIDs.filter((id)=> id!== mealId)));
}

// function to show meal receipe
function showMealReceipe(meal){
    mealReceipePopupInside.innerHTML = '';
    // creating element on which receipe would be shown
    const mealReceipe = document.createElement('div');
    mealReceipe.classList.add('meal-receipe-popup-inside');
    // getting ingredients with quantity
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
    // adding meal receipe info with class name
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

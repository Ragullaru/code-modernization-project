'use client';

import { useState, FormEvent, MouseEvent } from 'react';
import { Search, Shuffle } from 'lucide-react';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  [key: string]: string | undefined;
}

interface MealSearchResponse {
  meals: Meal[] | null;
}

export default function MealFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [resultHeading, setResultHeading] = useState('');
  const [showNoResults, setShowNoResults] = useState(false);

  const searchMeal = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear single meal
    setSelectedMeal(null);

    const term = searchTerm.trim();

    if (!term) {
      alert('Please enter a search term');
      return;
    }

    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
      );
      const data: MealSearchResponse = await res.json();

      setResultHeading(`Search results for '${term}':`);

      if (data.meals === null) {
        setShowNoResults(true);
        setMeals([]);
      } else {
        setShowNoResults(false);
        setMeals(data.meals);
      }

      // Clear search text
      setSearchTerm('');
    } catch (error) {
      console.error('Error searching meals:', error);
    }
  };

  const getMealById = async (mealID: string) => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
      );
      const data: MealSearchResponse = await res.json();

      if (data.meals && data.meals[0]) {
        setSelectedMeal(data.meals[0]);
      }
    } catch (error) {
      console.error('Error fetching meal by ID:', error);
    }
  };

  const getRandomMeal = async () => {
    // Clear meals and heading
    setMeals([]);
    setResultHeading('');
    setShowNoResults(false);

    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/random.php`
      );
      const data: MealSearchResponse = await res.json();

      if (data.meals && data.meals[0]) {
        setSelectedMeal(data.meals[0]);
      }
    } catch (error) {
      console.error('Error fetching random meal:', error);
    }
  };

  const handleMealClick = (mealID: string) => {
    getMealById(mealID);
  };

  const getIngredients = (meal: Meal): string[] => {
    const ingredients: string[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${ingredient} - ${measure}`);
      } else {
        break;
      }
    }

    return ingredients;
  };

  return (
    <div className="container">
      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        :global(body) {
          background: #2d2013;
          color: #fff;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          margin: 0;
        }

        .container {
          margin: auto;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }

        .flex {
          display: flex;
        }

        input,
        button {
          border: 1px solid #dedede;
          font-size: 14px;
          padding: 8px 10px;
          margin: 0;
        }

        input[type='text'] {
          width: 300px;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }

        .search-btn {
          cursor: pointer;
          border-left: 0;
          border-radius: 0;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .random-btn {
          cursor: pointer;
          margin-left: 10px;
          border-radius: 4px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .meals {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-gap: 20px;
          margin-top: 20px;
        }

        .meal {
          cursor: pointer;
          position: relative;
          height: 180px;
          width: 180px;
          text-align: center;
        }

        .meal img {
          width: 100%;
          height: 100%;
          border: 4px #fff solid;
          border-radius: 2px;
          object-fit: cover;
        }

        .meal-info {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease-in;
          opacity: 0;
        }

        .meal:hover .meal-info {
          opacity: 1;
        }

        .single-meal {
          margin: 30px auto;
          width: 70%;
        }

        .single-meal img {
          width: 300px;
          margin: 15px;
          border: 4px #fff solid;
          border-radius: 2px;
        }

        .single-meal-info {
          margin: 20px;
          padding: 10px;
          border: 2px #e09850 dashed;
          border-radius: 5px;
        }

        .single-meal p {
          margin: 0;
          letter-spacing: 0.5px;
          line-height: 1.5;
        }

        .single-meal ul {
          padding-left: 0;
          list-style-type: none;
        }

        .single-meal ul li {
          border: 1px solid #ededed;
          border-radius: 5px;
          background-color: #fff;
          display: inline-block;
          color: #2d2013;
          font-size: 12px;
          font-weight: bold;
          padding: 5px;
          margin: 0 5px 5px 0;
        }

        @media (max-width: 800px) {
          .meals {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 700px) {
          .meals {
            grid-template-columns: repeat(2, 1fr);
          }

          .meal {
            height: 200px;
            width: 200px;
          }
        }

        @media (max-width: 500px) {
          input[type='text'] {
            width: 100%;
          }

          .meals {
            grid-template-columns: 1fr;
          }

          .meal {
            height: 300px;
            width: 300px;
          }
        }
      `}</style>

      <h1>Meal Finder</h1>
      
      <div className="flex">
        <form className="flex" onSubmit={searchMeal}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for meals or keywords"
          />
          <button className="search-btn" type="submit">
            <Search size={16} />
          </button>
        </form>
        <button className="random-btn" onClick={getRandomMeal}>
          <Shuffle size={16} />
        </button>
      </div>

      {resultHeading && <h2>{resultHeading}</h2>}
      {showNoResults && <p>There are no search results. Try again!</p>}

      <div className="meals">
        {meals.map((meal) => (
          <div
            key={meal.idMeal}
            className="meal"
            onClick={() => handleMealClick(meal.idMeal)}
          >
            <img src={meal.strMealThumb} alt={meal.strMeal} />
            <div className="meal-info">
              <h3>{meal.strMeal}</h3>
            </div>
          </div>
        ))}
      </div>

      {selectedMeal && (
        <div className="single-meal">
          <h1>{selectedMeal.strMeal}</h1>
          <img src={selectedMeal.strMealThumb} alt={selectedMeal.strMeal} />
          <div className="single-meal-info">
            {selectedMeal.strCategory && <p>{selectedMeal.strCategory}</p>}
            {selectedMeal.strArea && <p>{selectedMeal.strArea}</p>}
          </div>
          <div className="main">
            <p>{selectedMeal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
              {getIngredients(selectedMeal).map((ing, index) => (
                <li key={index}>{ing}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
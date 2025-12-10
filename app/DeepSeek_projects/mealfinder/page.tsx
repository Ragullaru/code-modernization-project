'use client';

import { useState, FormEvent, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faRandom } from '@fortawesome/free-solid-svg-icons';

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions: string;
  [key: `strIngredient${number}`]: string;
  [key: `strMeasure${number}`]: string;
}

interface MealApiResponse {
  meals: Meal[] | null;
}

export default function MealFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [meals, setMeals] = useState<Meal[]>([]);
  const [singleMeal, setSingleMeal] = useState<Meal | null>(null);
  const [resultHeading, setResultHeading] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const mealsContainerRef = useRef<HTMLDivElement>(null);

  const searchMeals = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert('Please enter a search term');
      return;
    }

    setIsLoading(true);
    setSingleMeal(null);
    setResultHeading(`Search results for '${searchTerm}':`);

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
      );
      const data: MealApiResponse = await response.json();

      if (data.meals === null) {
        setResultHeading('There are no search results. Try again!');
        setMeals([]);
      } else {
        setMeals(data.meals);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
      setResultHeading('Error fetching meals. Please try again.');
    } finally {
      setIsLoading(false);
      setSearchTerm('');
    }
  };

  const getMealById = async (mealID: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
      );
      const data: MealApiResponse = await response.json();
      if (data.meals && data.meals[0]) {
        setSingleMeal(data.meals[0]);
        setResultHeading('');
        setMeals([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching meal details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomMeal = async () => {
    setIsLoading(true);
    setMeals([]);
    setResultHeading('');
    setSingleMeal(null);

    try {
      const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/random.php'
      );
      const data: MealApiResponse = await response.json();
      if (data.meals && data.meals[0]) {
        setSingleMeal(data.meals[0]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching random meal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMealClick = (mealID: string) => {
    getMealById(mealID);
  };

  const getIngredients = (meal: Meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof Meal];
      const measure = meal[`strMeasure${i}` as keyof Meal];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${ingredient} - ${measure || ''}`);
      } else {
        break;
      }
    }
    return ingredients;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const mealInfo = e
        .composedPath()
        .find((el): el is Element => el instanceof Element && el.classList?.contains('meal-info'));
      
      if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealid');
        if (mealID) {
          getMealById(mealID);
        }
      }
    };

    const mealsContainer = mealsContainerRef.current;
    if (mealsContainer) {
      mealsContainer.addEventListener('click', handleClickOutside);
    }

    return () => {
      if (mealsContainer) {
        mealsContainer.removeEventListener('click', handleClickOutside);
      }
    };
  }, []);

  return (
    <div className="container">
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
          background: #2d2013;
          color: #fff;
          font-family: Verdana, Geneva, Tahoma, sans-serif;
          margin: 0;
          padding: 20px;
        }

        .container {
          margin: auto;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .flex {
          display: flex;
          width: 100%;
          justify-content: center;
          margin-bottom: 20px;
        }

        input,
        button {
          border: 1px solid #dedede;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          font-size: 14px;
          padding: 8px 10px;
          margin: 0;
          background: white;
          color: #333;
        }

        input[type='text'] {
          width: 300px;
        }

        .search-btn {
          cursor: pointer;
          border-left: 0;
          border-radius: 0;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          background: #f0f0f0;
          transition: background 0.2s;
        }

        .search-btn:hover {
          background: #e0e0e0;
        }

        .random-btn {
          cursor: pointer;
          margin-left: 10px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          background: #f0f0f0;
          transition: background 0.2s;
        }

        .random-btn:hover {
          background: #e0e0e0;
        }

        .meals {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-gap: 20px;
          margin-top: 20px;
          width: 100%;
        }

        .meal {
          cursor: pointer;
          position: relative;
          height: 180px;
          width: 180px;
          text-align: center;
          margin: 0 auto;
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
          padding: 10px;
        }

        .meal:hover .meal-info {
          opacity: 1;
        }

        .single-meal {
          margin: 30px auto;
          width: 100%;
          max-width: 600px;
        }

        .single-meal img {
          width: 300px;
          max-width: 100%;
          margin: 15px;
          border: 4px #fff solid;
          border-radius: 2px;
        }

        .single-meal-info {
          margin: 20px;
          padding: 10px;
          border: 2px #e09850 dashed;
          border-radius: 5px;
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .single-meal p {
          margin: 0;
          letter-spacing: 0.5px;
          line-height: 1.5;
          text-align: left;
        }

        .single-meal ul {
          padding-left: 0;
          list-style-type: none;
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          justify-content: center;
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
        }

        .loading {
          margin: 20px;
          font-size: 18px;
          color: #e09850;
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

          .flex {
            flex-direction: column;
            gap: 10px;
          }

          .random-btn {
            margin-left: 0;
            width: 100%;
          }
        }
      `}</style>

      <h1>Meal Finder</h1>
      
      <div className="flex">
        <form className="flex" onSubmit={searchMeals}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for meals or keywords"
            disabled={isLoading}
          />
          <button className="search-btn" type="submit" disabled={isLoading}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
        <button className="random-btn" onClick={getRandomMeal} disabled={isLoading}>
          <FontAwesomeIcon icon={faRandom} />
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      {resultHeading && !isLoading && (
        <div id="result-heading">
          <h2>{resultHeading}</h2>
        </div>
      )}

      {meals.length > 0 && !singleMeal && !isLoading && (
        <div id="meals" className="meals" ref={mealsContainerRef}>
          {meals.map((meal) => (
            <div key={meal.idMeal} className="meal">
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <div className="meal-info" data-mealid={meal.idMeal}>
                <h3>{meal.strMeal}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {singleMeal && !isLoading && (
        <div id="single-meal" className="single-meal">
          <h1>{singleMeal.strMeal}</h1>
          <img src={singleMeal.strMealThumb} alt={singleMeal.strMeal} />
          <div className="single-meal-info">
            {singleMeal.strCategory && <p>{singleMeal.strCategory}</p>}
            {singleMeal.strArea && <p>{singleMeal.strArea}</p>}
          </div>
          <div className="main">
            <p>{singleMeal.strInstructions}</p>
            <h2>Ingredients</h2>
            <ul>
              {getIngredients(singleMeal).map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
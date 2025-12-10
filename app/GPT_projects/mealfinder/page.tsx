"use client";

import React, { useState, FormEvent } from "react";
import Head from "next/head";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string | null;
  strArea?: string | null;
  strInstructions?: string | null;
  [key: string]: string | null | undefined;
};

interface MealApiResponse {
  meals: Meal[] | null;
}

const MEAL_SEARCH_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const MEAL_LOOKUP_URL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
const MEAL_RANDOM_URL = "https://www.themealdb.com/api/json/v1/1/random.php";

const MealFinderPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [heading, setHeading] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchMealsBySearch = async (term: string) => {
    setIsLoading(true);
    setStatusMessage("");
    setSelectedMeal(null);

    try {
      const res = await fetch(`${MEAL_SEARCH_URL}${encodeURIComponent(term)}`);
      const data: MealApiResponse = await res.json();

      if (!data.meals) {
        setMeals([]);
        setHeading("");
        setStatusMessage("There are no search results. Try again!");
        return;
      }

      setMeals(data.meals);
      setHeading(`Search results for '${term}':`);
    } catch (err) {
      console.error(err);
      setMeals([]);
      setHeading("");
      setStatusMessage("Something went wrong while fetching meals.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMealById = async (mealId: string) => {
    setIsLoading(true);
    setStatusMessage("");

    try {
      const res = await fetch(`${MEAL_LOOKUP_URL}${encodeURIComponent(mealId)}`);
      const data: MealApiResponse = await res.json();

      if (data.meals && data.meals[0]) {
        setSelectedMeal(data.meals[0]);
      } else {
        setSelectedMeal(null);
        setStatusMessage("Unable to load meal details.");
      }
    } catch (err) {
      console.error(err);
      setSelectedMeal(null);
      setStatusMessage("Something went wrong while fetching the meal.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRandomMeal = async () => {
    setIsLoading(true);
    setMeals([]);
    setHeading("");
    setStatusMessage("");

    try {
      const res = await fetch(MEAL_RANDOM_URL);
      const data: MealApiResponse = await res.json();

      if (data.meals && data.meals[0]) {
        setSelectedMeal(data.meals[0]);
      } else {
        setSelectedMeal(null);
        setStatusMessage("Unable to load a random meal.");
      }
    } catch (err) {
      console.error(err);
      setSelectedMeal(null);
      setStatusMessage("Something went wrong while fetching a random meal.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const term = searchTerm.trim();

    if (!term) {
      window.alert("Please enter a search term");
      return;
    }

    fetchMealsBySearch(term);
    setSearchTerm("");
  };

  const handleMealClick = (mealId: string) => {
    fetchMealById(mealId);
  };

  const getIngredients = (meal: Meal | null): string[] => {
    if (!meal) return [];
    const ingredients: string[] = [];

    for (let i = 1; i <= 20; i += 1) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push(`${ingredient} - ${measure ?? ""}`.trim());
      } else {
        break;
      }
    }

    return ingredients;
  };

  const ingredients = getIngredients(selectedMeal);

  return (
    <>
      <Head>
        <title>Meal Finder</title>
        <meta
          name="description"
          content="Search and generate random meals from the themealdb.com API"
        />
        {/* Font Awesome - matches original dependency */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.2/css/all.min.css"
        />
      </Head>

      <div className="container">
        <h1>Meal Finder</h1>

        <div className="flex">
          <form className="flex" id="submit" onSubmit={handleSubmit}>
            <input
              type="text"
              id="search"
              placeholder="Search for meals or keywords"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="search-btn"
              type="submit"
              aria-label="Search for meals"
            >
              <i className="fas fa-search" aria-hidden="true" />
            </button>
          </form>

          <button
            className="random-btn"
            id="random"
            type="button"
            onClick={fetchRandomMeal}
            aria-label="Get random meal"
          >
            <i className="fas fa-random" aria-hidden="true" />
          </button>
        </div>

        <div id="result-heading">
          {heading && <h2>{heading}</h2>}
          {statusMessage && <p>{statusMessage}</p>}
          {isLoading && <p>Loading...</p>}
        </div>

        <div id="meals" className="meals">
          {meals.map((meal) => (
            <button
              key={meal.idMeal}
              type="button"
              className="meal"
              onClick={() => handleMealClick(meal.idMeal)}
            >
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <div className="meal-info">
                <h3>{meal.strMeal}</h3>
              </div>
            </button>
          ))}
        </div>

        <div id="single-meal">
          {selectedMeal && (
            <div className="single-meal">
              <h1>{selectedMeal.strMeal}</h1>
              <img
                src={selectedMeal.strMealThumb}
                alt={selectedMeal.strMeal}
              />
              <div className="single-meal-info">
                {selectedMeal.strCategory && (
                  <p>{selectedMeal.strCategory}</p>
                )}
                {selectedMeal.strArea && <p>{selectedMeal.strArea}</p>}
              </div>
              <div className="main">
                {selectedMeal.strInstructions && (
                  <p>{selectedMeal.strInstructions}</p>
                )}
                {ingredients.length > 0 && (
                  <>
                    <h2>Ingredients</h2>
                    <ul>
                      {ingredients.map((ing) => (
                        <li key={ing}>{ing}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global styles ported from original style.css */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        body {
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
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          font-size: 14px;
          padding: 8px 10px;
          margin: 0;
        }

        input[type="text"] {
          width: 300px;
        }

        .search-btn {
          cursor: pointer;
          border-left: 0;
          border-radius: 0;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }

        .random-btn {
          cursor: pointer;
          margin-left: 10px;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
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
          border: none;
          padding: 0;
          background: transparent;
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

        .meal:hover .meal-info,
        .meal:focus-visible .meal-info {
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
          input[type="text"] {
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
    </>
  );
};

export default MealFinderPage;

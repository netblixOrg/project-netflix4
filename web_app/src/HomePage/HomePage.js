import React, { useState, useEffect } from "react";
import HeroSection from './components/HeroSection';
import MovieItem from "./components/MovieItem";
import './HomePage.css';


const HomePage = ({userId}) => {
  const [categoriesWithMovies, setCategoriesWithMovies] = useState([]);

  const API_PORT = process.env.REACT_APP_USER_TO_WEB_PORT;
  const API_URL = `http://localhost:${API_PORT}/api`;

  useEffect(() => {
    fetch(`${API_URL}/movies`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "userId": userId // Add userId to the headers
      }
    })
      .then((response) => response.json())
      .then((data) => setCategoriesWithMovies(data))
      .catch((error) => console.error("Error fetching categories and movies:", error));
  }, [userId, API_URL]);

  return (
    <div>
      <HeroSection userId={userId} />
      <div className="categories-section">
        {categoriesWithMovies.map((category) => (
          <div key={category.category} className="category-block">
            <h2 className="category-title">{category.category}</h2>
            <ul className="movies-list">
              {category.movies.map((movie) => (
                <MovieItem key={movie._id} movie={movie} userId={userId} /> 
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

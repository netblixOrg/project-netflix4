import React, { useState, useEffect } from 'react';
import './Page.css';
import CategoryManager from './Components/CategoryManager';
import MovieManager from './Components/MovieManager';
// import Header from '../HomePage/components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [movies, setMovies] = useState([]);

  const API_PORT = process.env.REACT_APP_USER_TO_WEB_PORT;
  const API_URL = `http://localhost:${API_PORT}/api`;

  useEffect(() => {
    // Fetch categories and movies concurrently
    Promise.all([
      fetch(`${API_URL}/categories`).then((response) => response.json()),
      fetch(`${API_URL}/movies/all`).then((response) => response.json()),
    ])
      .then(([categoriesData, moviesData]) => {
        // Update categories state
        setCategories(categoriesData);

        // Transform the movies data to replace category IDs with names
        const transformedMovies = moviesData.map((movie) => {
          const transformedCategories = movie.categories.map((categoryId) => {
            const category = categoriesData.find((cat) => cat._id === categoryId);
            return category ? category.name : 'Unknown'; // Replace ID with name or 'Unknown' if not found
          });

          return {
            ...movie,
            categories: transformedCategories, // Replace category IDs with names
          };
        });

        // Set the transformed movies
        setMovies(transformedMovies);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [API_URL]);

  return (
    <div>
      <header className="admin-page-header">
        <ul className='managment-list'>
          <li className='managment-block'>
            <CategoryManager categories={categories} setCategories={setCategories} movies={movies} setMovies={setMovies} />
          </li>
          <li className='managment-block'>
            <MovieManager categories={categories} movies={movies} setMovies={setMovies} />
          </li>
        </ul>
      </header>
    </div>
  );
};

export default AdminPage;
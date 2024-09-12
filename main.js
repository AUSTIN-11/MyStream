const apiKey = '05610017862c67bf8901d8212280511f';
const baseUrl = 'https://api.themoviedb.org/3/discover/movie';
const searchUrl = 'https://api.themoviedb.org/3/search/movie';
const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

// Fetch genres and populate dropdown
fetch(genresUrl)
  .then(response => response.json())
  .then(data => {
    const genreSelect = document.getElementById('genre-select');
    data.genres.forEach(genre => {
      const option = document.createElement('option');
      option.value = genre.id;
      option.textContent = genre.name;
      genreSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error fetching genres:', error);
  });

// Event listener for search input
document.getElementById('search-input').addEventListener('input', function() {
  const query = this.value.trim();
  if (query.length > 2) {
    fetch(`${searchUrl}?api_key=${apiKey}&query=${query}`)
      .then(response => response.json())
      .then(data => {
        showSearchSuggestions(data.results);
      })
      .catch(error => {
        console.error('Error fetching search suggestions:', error);
      });
  } else {
    document.getElementById('search-suggestions').innerHTML = '';
  }
});

// Show search suggestions with movie posters
function showSearchSuggestions(movies) {
  const suggestionsContainer = document.getElementById('search-suggestions');
  suggestionsContainer.innerHTML = '';

  movies.forEach(movie => {
    const suggestion = document.createElement('div');

    const posterUrl = movie.poster_path
      ? `${imageBaseUrl}${movie.poster_path}`
      : 'https://via.placeholder.com/50x75?text=No+Image';

    suggestion.innerHTML = `
      <img src="${posterUrl}" alt="${movie.title} poster">
      <span>${movie.title}</span>
    `;

    suggestion.addEventListener('click', () => {
      document.getElementById('search-input').value = movie.title;
      document.getElementById('search-suggestions').innerHTML = '';
      searchMovies(movie.id);  // Trigger search with selected movie's ID
    });
    suggestionsContainer.appendChild(suggestion);
  });
}

// Event listener for form submission
document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form from refreshing the page
  searchMovies(); // Call the search function when form is submitted
});

// Search movies function with genre filter
function searchMovies(movieId = null) {
  const searchInput = document.getElementById('search-input').value.trim();
  const selectedGenre = document.getElementById('genre-select').value;
  let searchUrl = `${baseUrl}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc`;

  if (searchInput && !movieId) {
    searchUrl = `${searchUrl}&query=${searchInput}`;
  }

  if (selectedGenre) {
    searchUrl += `&with_genres=${selectedGenre}`;
  }

  if (movieId) {
    fetchMovieTrailer(movieId); // Fetch the trailer of the selected movie
  } else {
    fetch(searchUrl)
      .then(response => response.json())
      .then(data => {
        displayMovies(data.results);
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }
}

// Display movies 
function displayMovies(movies) {
  const moviesContainer = document.getElementById('movies-grid');
  moviesContainer.innerHTML = '';

  movies.forEach(movie => {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie-item');

    const posterUrl = movie.poster_path
      ? `${imageBaseUrl}${movie.poster_path}`
      : 'https://via.placeholder.com/150x220?text=No+Image';

    const overview = movie.overview || 'No overview available';
    const shortOverview = overview.length > 100 ? overview.slice(0, 100) + '...' : overview;

    movieDiv.innerHTML = `
      <img src="${posterUrl}" alt="${movie.title} poster">
      <h3>${movie.title}</h3>
      <p class="overview">${shortOverview}</p>
      <button class="play-trailer-btn">Watch Trailer</button>
    `;

    movieDiv.querySelector('.play-trailer-btn').addEventListener('click', () => {
      fetchMovieTrailer(movie.id); // Fetch and play the trailer when button is clicked
    });

    moviesContainer.appendChild(movieDiv);
  });
}

//  play movie trailer
function fetchMovieTrailer(movieId) {
  const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`;

  fetch(movieDetailsUrl)
    .then(response => response.json())
    .then(data => {
      const trailers = data.results.filter(video => video.type === 'Trailer');
      if (trailers.length > 0) {
        const trailer = trailers[0];
        const trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
        document.getElementById('player').src = trailerUrl; // Update iframe to play trailer
      } else {
        alert('Sorry. No trailer available for this movie.');
      }
    })
    .catch(error => {
      console.error('Error fetching trailer:', error);
    });
}

// Load movies initially
fetch(`${baseUrl}?api_key=${apiKey}&language=en-US&sort_by=popularity.desc&page=1`)
  .then(response => response.json())
  .then(data => {
    displayMovies(data.results);
  })
  .catch(error => {
    console.error('Error fetching popular movies:', error);
  });

  console.log(displayMovies(data.results));
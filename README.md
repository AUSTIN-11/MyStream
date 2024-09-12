code 1
#
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MyStream - Animations</title>
  <style>
    /* Reuse the existing CSS */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: Verdana, Geneva, Tahoma, sans-serif;
    }

    html {
      scroll-behavior: smooth;
      background-color: aquamarine;
    }

    body {
      margin: 0;
      font-family: 'Arial', sans-serif;
      background-color: aqua;
      color: #333;
    }

    header {
      background-color: #00ced1;
      display: flex;
      justify-content: space-between;
      padding: 20px;
      color: white;
    }

    header h1 {
      font-size: 24px;
    }

    nav ul {
      list-style: none;
      display: flex;
      gap: 20px;
    }

    nav ul li a {
      color: white;
      text-decoration: none;
    }

    .search-bar {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      gap: 10px;
      position: relative;
    }

    .search-bar form {
      display: flex;
      gap: 10px;
    }

    .search-bar input {
      width: 300px;
      padding: 10px;
      border: 2px solid #00ced1;
    }

    .search-bar select {
      padding: 10px;
      border: 2px solid #00ced1;
    }

    .search-bar button {
      background-color: #00ced1;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
    }

    .search-suggestions {
      position: absolute;
      top: 40px;
      background-color: white;
      border: 1px solid #ddd;
      width: 100%;
      max-height: 400px;
      overflow-y: auto;
      z-index: 1000;
    }

    .search-suggestions div {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
    }

    .search-suggestions div img {
      width: 50px;
      height: 75px;
      object-fit: cover;
    }

    .search-suggestions div:hover {
      background-color: #f0f0f0;
    }

    .animations {
      padding: 20px;
    }

    .animations h2 {
      text-align: center;
    }

    .animations-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin: 20px 0;
      justify-content: center;
      position: relative;
    }

    .animation-item {
      width: 250px;
      background-color: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .animation-item img {
      width: 150px;
      height: 220px;
      object-fit: cover;
    }

    .animation-item p {
      font-size: 14px;
      margin-top: 10px;
    }

    .animation-item .overview {
      font-size: 12px;
      color: #555;
      margin-top: 10px;
    }

    .animation-item button {
      background-color: #00ced1;
      border: none;
      color: white;
      padding: 8px 15px;
      cursor: pointer;
      margin-top: 10px;
    }

    .video-player {
      display: none;
      margin: 20px 0;
      text-align: center;
    }

    #player {
      width: 100%;
      max-height: 450px;
      border: none;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin: 20px 0;
    }

    .pagination button {
      background-color: #00ced1;
      color: white;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
    }

    footer {
      text-align: center;
      padding: 20px;
      background-color: #00ced1;
      color: white;
    }
  </style>
</head>

<body>
  <!-- Header Section -->
  <header>
    <div class="logo">
      <h1>MyStream</h1>
    </div>
    <nav>
      <ul>
        <li><a href="index.html">Home</a></li>
        <li><a href="movies.html">Movies</a></li>
        <li><a href="tv-shows.html">TV Shows</a></li>
        <li><a href="animations.html">Animations</a></li>
      </ul>
    </nav>
  </header>

  <!-- Search Bar and Genre Filter (Form) -->
  <section class="search-bar">
    <form id="search-form">
      <input type="text" id="search-input" placeholder="Search animations...">
      <select id="genre-select">
        <option value="">All Genres</option>
      </select>
      <button type="submit">Search</button>
    </form>
    <div id="search-suggestions" class="search-suggestions"></div>
  </section>

  <!-- Animations Section -->
  <section class="animations">
    <h2>Animations</h2>
    <div class="animations-grid" id="animations-grid">
      <!-- Animation Items and Video Player will be dynamically loaded here -->
    </div>
    <div class="pagination">
      <button id="prev-page">Previous</button>
      <button id="next-page">Next</button>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <p>&copy; 2024 MyStream. All rights reserved.</p>
  </footer>

  <!-- JavaScript Code -->
  <script>
    const apiKey = '05610017862c67bf8901d8212280511f';
    const baseUrl = 'https://api.themoviedb.org/3/discover/movie'; // Use discover/movie for animations as well
    const searchUrl = 'https://api.themoviedb.org/3/search/movie'; // Use search/movie for animations as well
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

    let currentPage = 1;
    let currentVideoPlayerDiv = null;

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

    // Show search suggestions with animation posters
    function showSearchSuggestions(animations) {
      const suggestionsContainer = document.getElementById('search-suggestions');
      suggestionsContainer.innerHTML = '';

      animations.forEach(animation => {
        const suggestion = document.createElement('div');

        const posterUrl = animation.poster_path
          ? `${imageBaseUrl}${animation.poster_path}`
          : 'https://via.placeholder.com/50x75?text=No+Image';

        suggestion.innerHTML = `
          <img src="${posterUrl}" alt="${animation.title} poster">
          <span>${animation.title}</span>
        `;

        suggestion.addEventListener('click', () => {
          document.getElementById('search-input').value = animation.title;
          document.getElementById('search-suggestions').innerHTML = '';
          searchAnimations(animation.id);  // Trigger search with selected animation's ID
        });
        suggestionsContainer.appendChild(suggestion);
      });
    }

    // Event listener for form submission
    document.getElementById('search-form').addEventListener('submit', function(event) {
      event.preventDefault();
      searchAnimations();
    });

    // Search animations based on input or genre
    function searchAnimations(selectedAnimationId = null) {
      const searchInput = document.getElementById('search-input').value.trim();
      const genreSelect = document.getElementById('genre-select').value;
      let url = baseUrl + `?api_key=${apiKey}&page=${currentPage}`;

      if (selectedAnimationId) {
        url = `${searchUrl}?api_key=${apiKey}&query=${selectedAnimationId}`;
      } else if (searchInput) {
        url = `${searchUrl}?api_key=${apiKey}&query=${searchInput}&page=${currentPage}`;
      } else if (genreSelect) {
        url += `&with_genres=${genreSelect}`;
      }

      fetch(url)
        .then(response => response.json())
        .then(data => {
          displayAnimations(data.results);
        })
        .catch(error => {
          console.error('Error fetching animations:', error);
        });
    }

    // Display animations in the grid
    function displayAnimations(animations) {
      const animationsGrid = document.getElementById('animations-grid');
      animationsGrid.innerHTML = '';

      animations.forEach(animation => {
        const animationItem = document.createElement('div');
        animationItem.classList.add('animation-item');

        const posterUrl = animation.poster_path
          ? `${imageBaseUrl}${animation.poster_path}`
          : 'https://via.placeholder.com/150x220?text=No+Image';

        animationItem.innerHTML = `
          <img src="${posterUrl}" alt="${animation.title} poster">
          <p>${animation.title}</p>
          <p class="overview">${animation.overview}</p>
          <button onclick="playAnimationTrailer(${animation.id})">Play Trailer</button>
        `;

        animationsGrid.appendChild(animationItem);
      });
    }

    // Play animation trailer by dynamically embedding the YouTube iframe
    function playAnimationTrailer(animationId) {
      fetch(`https://api.themoviedb.org/3/movie/${animationId}/videos?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          const trailer = data.results.find(video => video.type === 'Trailer');
          const animationsGrid = document.getElementById('animations-grid');

          if (trailer) {
            const videoPlayerDiv = document.createElement('div');
            videoPlayerDiv.classList.add('video-player');
            videoPlayerDiv.innerHTML = `
              <iframe id="player" src="https://www.youtube.com/embed/${trailer.key}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            `;

            if (currentVideoPlayerDiv) {
              currentVideoPlayerDiv.remove();
            }

            currentVideoPlayerDiv = videoPlayerDiv;
            animationsGrid.insertBefore(videoPlayerDiv, animationsGrid.firstChild);
            videoPlayerDiv.style.display = 'block';
          } else {
            alert('Trailer not available');
          }
        })
        .catch(error => {
          console.error('Error fetching trailer:', error);
        });
    }

    // Pagination controls
    document.getElementById('prev-page').addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        searchAnimations();
      }
    });

    document.getElementById('next-page').addEventListener('click', function() {
      currentPage++;
      searchAnimations();
    });

    // Initial animation fetch
    searchAnimations();
  </script>
</body>
</html>

#

code 2 

// ========== DATA FILM (Contoh) ==========
// Ini contoh data film - GANTI dengan data film Anda sendiri
const moviesData = {
    films: [
        {
            id: 1,
            title: "Inception",
            year: 2010,
            genre: "Sci-Fi, Thriller",
            duration: "2h 28m",
            rating: 8.8,
            description: "Seorang pencuri yang mencuri rahasia melalui mimpi diberi tugas sebaliknya: menanamkan ide ke dalam pikiran seseorang.",
            thumbnail: "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6iwxhKTSp.jpg",
            videoUrl: "https://www.youtube.com/embed/YoHD9XEInc0",
            isFeatured: true
        },
        {
            id: 2,
            title: "Interstellar",
            year: 2014,
            genre: "Adventure, Drama, Sci-Fi",
            duration: "2h 49m",
            rating: 8.6,
            description: "Sekelompok eksplorator luar angkasa melakukan perjalanan melalui lubang cacing untuk mencari planet yang layak huni bagi umat manusia.",
            thumbnail: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
            videoUrl: "https://www.youtube.com/embed/zSWdZVtXT7E",
            isFeatured: true
        },
        {
            id: 3,
            title: "The Dark Knight",
            year: 2008,
            genre: "Action, Crime, Drama",
            duration: "2h 32m",
            rating: 9.0,
            description: "Ketika ketakutan muncul dari Joker yang psikotis, Batman harus menghadapi kekacauan dan mempertaruhkan segalanya untuk menyelamatkan Gotham.",
            thumbnail: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
            videoUrl: "https://www.youtube.com/embed/EXeTwQWrcwY",
            isFeatured: false
        },
        {
            id: 4,
            title: "Parasite",
            year: 2019,
            genre: "Drama, Thriller",
            duration: "2h 12m",
            rating: 8.6,
            description: "Keluarga miskin yang menyusup ke kehidupan keluarga kaya dengan cara yang tak terduga.",
            thumbnail: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
            videoUrl: "https://www.youtube.com/embed/5xH0HfJHsaY",
            isFeatured: false
        },
        {
            id: 5,
            title: "Spider-Man: No Way Home",
            year: 2021,
            genre: "Action, Adventure, Fantasy",
            duration: "2h 28m",
            rating: 8.3,
            description: "Peter Parker meminta bantuan Doctor Strange untuk membuat identitasnya sebagai Spider-Man dilupakan, tapi spell-nya kacau dan membuka multiverse.",
            thumbnail: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
            videoUrl: "https://www.youtube.com/embed/JfVOs4VSpmA",
            isFeatured: false
        },
        {
            id: 6,
            title: "Joker",
            year: 2019,
            genre: "Crime, Drama, Thriller",
            duration: "2h 2m",
            rating: 8.7,
            description: "Arthur Fleck, seorang komedian gagal, terjun ke kegilaan dan menjadi sosok kriminal ikonik di Gotham.",
            thumbnail: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
            videoUrl: "https://www.youtube.com/embed/zAGVQLHvwOY",
            isFeatured: false
        }
    ]
};

// ========== GLOBAL VARIABLES ==========
let currentMovies = [...moviesData.films];
let currentFeaturedMovie = moviesData.films.find(movie => movie.isFeatured) || moviesData.films[0];

// ========== DOM ELEMENTS ==========
const movieGrid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const heroSection = document.getElementById('hero');
const modal = document.getElementById('videoModal');
const closeModal = document.getElementById('closeModal');
const videoContainer = document.getElementById('videoContainer');
const modalInfo = document.getElementById('modalInfo');

// ========== UTILITY FUNCTIONS ==========
// Fungsi untuk menampilkan loading state
function showLoading() {
    if (movieGrid) {
        movieGrid.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Memuat film...</p>
            </div>
        `;
    }
}

// Fungsi untuk escape HTML (security)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ========== RENDER HERO SECTION ==========
function renderHero() {
    if (!heroSection) return;
    
    heroSection.style.backgroundImage = `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url('${currentFeaturedMovie.thumbnail}')`;
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center';
    
    heroSection.innerHTML = `
        <div class="hero-content">
            <h1 class="hero-title">${escapeHtml(currentFeaturedMovie.title)}</h1>
            <p class="hero-description">${escapeHtml(currentFeaturedMovie.description.substring(0, 150))}...</p>
            <div class="hero-buttons">
                <button class="btn-play" onclick="playMovie(${currentFeaturedMovie.id})">
                    ▶️ Play
                </button>
                <button class="btn-info" onclick="showMovieInfo(${currentFeaturedMovie.id})">
                    ℹ️ Info
                </button>
            </div>
        </div>
    `;
}

// ========== RENDER MOVIE GRID ==========
function renderMovies(movies) {
    if (!movieGrid) return;
    
    if (movies.length === 0) {
        movieGrid.innerHTML = `
            <div class="no-results">
                😢 Tidak ada film yang ditemukan untuk "${escapeHtml(searchInput.value)}"
            </div>
        `;
        return;
    }
    
    movieGrid.innerHTML = movies.map(movie => `
        <div class="movie-card" data-id="${movie.id}" onclick="playMovie(${movie.id})">
            <img class="movie-poster" src="${movie.thumbnail}" alt="${escapeHtml(movie.title)}" loading="lazy">
            <div class="movie-info">
                <div class="movie-title">${escapeHtml(movie.title)}</div>
                <div class="movie-year">${movie.year} • ⭐ ${movie.rating}</div>
            </div>
            <div class="movie-overlay">
                <div class="play-icon">▶️</div>
            </div>
        </div>
    `).join('');
}

// ========== SEARCH FUNCTIONALITY ==========
function searchMovies() {
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        currentMovies = [...moviesData.films];
    } else {
        currentMovies = moviesData.films.filter(movie => 
            movie.title.toLowerCase().includes(query) ||
            movie.genre.toLowerCase().includes(query) ||
            movie.year.toString().includes(query)
        );
    }
    
    renderMovies(currentMovies);
}

// Live search (real-time saat mengetik)
if (searchInput) {
    searchInput.addEventListener('input', () => {
        searchMovies();
    });
}

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        searchMovies();
    });
}

// Search saat tekan Enter
if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });
}

// ========== MODAL / VIDEO PLAYER ==========
function playMovie(movieId) {
    const movie = moviesData.films.find(m => m.id === movieId);
    if (!movie) return;
    
    // YouTube embed with autoplay
    let videoHtml = '';
    
    // Deteksi jika URL adalah YouTube
    if (movie.videoUrl.includes('youtube.com') || movie.videoUrl.includes('youtu.be')) {
        let videoId = '';
        if (movie.videoUrl.includes('youtube.com/watch?v=')) {
            videoId = movie.videoUrl.split('v=')[1].split('&')[0];
        } else if (movie.videoUrl.includes('youtu.be/')) {
            videoId = movie.videoUrl.split('youtu.be/')[1].split('?')[0];
        } else if (movie.videoUrl.includes('embed/')) {
            videoId = movie.videoUrl.split('embed/')[1].split('?')[0];
        }
        videoHtml = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else {
        // Fallback: tampilkan link
        videoHtml = `<div style="padding: 2rem; text-align: center;"><p>Video tidak tersedia untuk ditampilkan. <a href="${movie.videoUrl}" target="_blank">Klik di sini untuk menonton</a></p></div>`;
    }
    
    videoContainer.innerHTML = videoHtml;
    
    modalInfo.innerHTML = `
        <h2>${escapeHtml(movie.title)} (${movie.year})</h2>
        <p>⭐ ${movie.rating} | 🕐 ${movie.duration} | 🎭 ${movie.genre}</p>
        <p style="margin-top: 1rem;">${escapeHtml(movie.description)}</p>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scroll
}

function showMovieInfo(movieId) {
    // Alternative: show info without playing
    const movie = moviesData.films.find(m => m.id === movieId);
    if (!movie) return;
    
    alert(`${movie.title} (${movie.year})\nRating: ⭐ ${movie.rating}\nDurasi: ${movie.duration}\nGenre: ${movie.genre}\n\nDeskripsi:\n${movie.description}`);
}

// Close modal
function closeVideoModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Stop video
    videoContainer.innerHTML = '';
}

if (closeModal) {
    closeModal.addEventListener('click', closeVideoModal);
}

// Close modal klik di luar
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeVideoModal();
    }
});

// Close dengan tombol ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeVideoModal();
    }
});

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ========== FILTER BY GENRE (Optional) ==========
function filterByGenre(genre) {
    if (genre === 'all') {
        currentMovies = [...moviesData.films];
    } else {
        currentMovies = moviesData.films.filter(movie => 
            movie.genre.toLowerCase().includes(genre.toLowerCase())
        );
    }
    renderMovies(currentMovies);
}

// ========== SORT MOVIES (Optional) ==========
function sortMoviesBy(sortBy) {
    const moviesCopy = [...currentMovies];
    
    switch(sortBy) {
        case 'year-asc':
            moviesCopy.sort((a, b) => a.year - b.year);
            break;
        case 'year-desc':
            moviesCopy.sort((a, b) => b.year - a.year);
            break;
        case 'rating':
            moviesCopy.sort((a, b) => b.rating - a.rating);
            break;
        case 'title':
            moviesCopy.sort((a, b) => a.title.localeCompare(b.title));
            break;
        default:
            break;
    }
    
    renderMovies(moviesCopy);
}

// ========== INITIALIZE ==========
function init() {
    showLoading();
    
    // Simulasi loading (optional, untuk efek smooth)
    setTimeout(() => {
        renderHero();
        renderMovies(currentMovies);
    }, 300);
}

// Jalankan saat halaman siap
document.addEventListener('DOMContentLoaded', init);

// ========== EXPOSE FUNCTIONS TO GLOBAL SCOPE ==========
// (Supaya bisa dipanggil dari onclick di HTML)
window.playMovie = playMovie;
window.showMovieInfo = showMovieInfo;
window.closeVideoModal = closeVideoModal;
window.filterByGenre = filterByGenre;
window.sortMoviesBy = sortMoviesBy;

// ========== ADDITIONAL: SAVE WATCH HISTORY (Optional) ==========
function saveWatchHistory(movieId) {
    let history = JSON.parse(localStorage.getItem('watchHistory') || '[]');
    if (!history.includes(movieId)) {
        history.unshift(movieId);
        // Keep only last 20
        history = history.slice(0, 20);
        localStorage.setItem('watchHistory', JSON.stringify(history));
    }
}

// Override playMovie to save history
const originalPlayMovie = window.playMovie;
window.playMovie = function(movieId) {
    saveWatchHistory(movieId);
    originalPlayMovie(movieId);
};

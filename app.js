// =========================
// 1. 음악 데이터
// =========================

const musicList = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna",
    genre: "lofi",
    mood: "study",
    moodName: "집중",
    cover: "cover-study",
    symbol: "🌌",
  },
  {
    id: 2,
    title: "Soft Morning",
    artist: "Mellow",
    genre: "indie",
    mood: "relax",
    moodName: "휴식",
    cover: "cover-relax",
    symbol: "☁️",
  },
  {
    id: 3,
    title: "drowing",
    artist: "WOODZ",
    genre: "pop",
    mood: "workout",
    moodName: "운동",
    cover: "cover-workout",
    symbol: "💪",
    image: "images/1.png",
  },
  {
    id: 4,
    title: "Sunny Day",
    artist: "April",
    genre: "pop",
    mood: "happy",
    moodName: "기분 전환",
    cover: "cover-happy",
    symbol: "☀️",
  },
  {
    id: 5,
    title: "Green Garden",
    artist: "Olive",
    genre: "indie",
    mood: "relax",
    moodName: "휴식",
    cover: "cover-indie",
    symbol: "🌿",
  },
  {
    id: 6,
    title: "Purple Night",
    artist: "Noah",
    genre: "rnb",
    mood: "relax",
    moodName: "휴식",
    cover: "cover-rnb",
    symbol: "🌙",
  },
  {
    id: 7,
    title: "Little Star",
    artist: "Mina",
    genre: "lofi",
    mood: "study",
    moodName: "집중",
    cover: "cover-lofi",
    symbol: "✨",
  },
  {
    id: 8,
    title: "Colorful Life",
    artist: "Daisy",
    genre: "pop",
    mood: "happy",
    moodName: "기분 전환",
    cover: "cover-pop",
    symbol: "🌈",
  },
  {
    id: 9,
    title: "마음의숲",
    artist: "조선힙합",
    genre: "indie",
    mood: "happy",
    moodName: "기분 전환",
    cover: "cover-happy",
    symbol: "🌳",
    image: "images/2.png",
  },
  {
    id: 10,
    title: "be my worst",
    artist: "가수 이름",
    genre: "indie",
    mood: "happy",
    moodName: "기분 전환",
    cover: "cover-happy",
    symbol: "🌈",
    image: "images/3.png",
  },
  {
    id: 11,
    title: "시간이들겠지",
    artist: "가수 이름",
    genre: "indie",
    mood: "workout",
    moodName: "운동",
    cover: "cover-workout",
    symbol: "💪",
    image: "images/4.png",
  },
  {
    id: 12,
    title: "shape of you",
    artist: "에드 시런",
    genre: "pop",
    mood: "study",
    moodName: "집중",
    cover: "cover-pop",
    symbol: "✨",
    image: "images/5.png",
  },
];

// =========================
// 2. HTML 요소 가져오기
// =========================

const musicGrid = document.querySelector("#musicGrid");
const musicCount = document.querySelector("#musicCount");
const searchInput = document.querySelector("#searchInput");
const clearSearch = document.querySelector("#clearSearch");
const emptyMessage = document.querySelector("#emptyMessage");

const moodButtons = document.querySelectorAll(".mood-card");
const genreButtons = document.querySelectorAll(".genre-btn");

const favoritesList = document.querySelector("#favoritesList");

const playlistDetail = document.querySelector("#playlistDetail");
const playlistTitle = document.querySelector("#playlistTitle");
const playlistDescription = document.querySelector("#playlistDescription");
const playlistTracks = document.querySelector("#playlistTracks");
const closePlaylist = document.querySelector("#closePlaylist");

const themeToggle = document.querySelector("#themeToggle");
const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

const toast = document.querySelector("#toast");

// =========================
// 3. 현재 선택 상태
// =========================

let selectedMood = "all";
let selectedGenre = "all";
let searchText = "";

const favoriteIds = new Set();

// =========================
// 4. 알림 표시
// =========================

let toastTimer;

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// =========================
// 5. 음악 이미지 만들기
// =========================

function createMusicCover(music) {
  if (music.image) {
    return `
      <div class="album-cover ${music.cover}">
        <img
          src="${music.image}"
          alt="${music.title}"
          class="custom-music-image"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >
        <span
          class="cover-symbol custom-image-fallback"
          style="display:none;"
        >
          ${music.symbol}
        </span>
      </div>
    `;
  }

  return `
    <div class="album-cover ${music.cover}">
      <span class="cover-symbol">${music.symbol}</span>
    </div>
  `;
}

// =========================
// 6. 음악 카드 만들기
// =========================

function createMusicCard(music) {
  const isLiked = favoriteIds.has(music.id);

  return `
    <article class="music-card">

      ${createMusicCover(music)}

      <span class="music-tag">
        ${music.genre.toUpperCase()}
      </span>

      <div class="music-info">
        <h3>${music.title}</h3>
        <p>${music.artist}</p>
      </div>

      <div class="music-card-bottom">
        <span class="music-mood">${music.moodName}</span>

        <button
          class="like-btn ${isLiked ? "liked" : ""}"
          data-like="${music.id}"
          aria-label="${music.title} 좋아요"
          aria-pressed="${isLiked}"
          title="좋아요"
        >
          ${isLiked ? "♥" : "♡"}
        </button>
      </div>

    </article>
  `;
}

// =========================
// 7. 음악 필터링
// =========================

function getFilteredMusic() {
  return musicList.filter((music) => {
    const matchesMood = selectedMood === "all" || music.mood === selectedMood;

    const matchesGenre =
      selectedGenre === "all" || music.genre === selectedGenre;

    const searchTarget = `${music.title} ${music.artist}`.toLowerCase();

    const matchesSearch = searchTarget.includes(searchText.toLowerCase());

    return matchesMood && matchesGenre && matchesSearch;
  });
}

// =========================
// 8. 음악 화면 업데이트
// =========================

function renderMusic() {
  if (!musicGrid) return;

  const filteredMusic = getFilteredMusic();

  musicGrid.innerHTML = filteredMusic
    .map((music) => createMusicCard(music))
    .join("");

  if (musicCount) {
    musicCount.textContent = filteredMusic.length;
  }

  if (emptyMessage) {
    emptyMessage.hidden = filteredMusic.length !== 0;
  }

  musicGrid.querySelectorAll("[data-like]").forEach((button) => {
    button.addEventListener("click", () => {
      const musicId = Number(button.dataset.like);
      toggleFavorite(musicId);
    });
  });
}

// =========================
// 9. 기분 선택 기능
// =========================

moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMood = button.dataset.mood;

    moodButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    renderMusic();

    const discover = document.querySelector("#discover");

    if (discover) {
      discover.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// =========================
// 10. 장르 선택 기능
// =========================

genreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedGenre = button.dataset.genre;

    genreButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    renderMusic();
  });
});

// =========================
// 11. 검색 기능
// =========================

if (searchInput) {
  searchInput.addEventListener("input", () => {
    searchText = searchInput.value.trim();
    renderMusic();
  });
}

// 검색어 지우기

if (clearSearch) {
  clearSearch.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
      searchText = "";
      renderMusic();
      searchInput.focus();
    }
  });
}

// =========================
// 12. 좋아요 기능
// =========================

function toggleFavorite(musicId) {
  const music = musicList.find((item) => {
    return item.id === musicId;
  });

  if (!music) return;

  if (favoriteIds.has(musicId)) {
    favoriteIds.delete(musicId);
    showToast("좋아요 목록에서 삭제했어요.");
  } else {
    favoriteIds.add(musicId);
    showToast("좋아요 목록에 추가했어요! ♥");
  }

  renderMusic();
  renderFavorites();
  renderPlaylistTracks();
}

// =========================
// 13. 좋아요 목록 화면
// =========================

// =========================
// 13. 좋아요 목록 화면
// =========================

function renderFavorites() {
  if (!favoritesList) return;

  const favoriteMusic = musicList.filter((music) => {
    return favoriteIds.has(music.id);
  });

  if (favoriteMusic.length === 0) {
    favoritesList.innerHTML = `
      <p class="favorites-empty">
        아직 좋아요를 누른 음악이 없어요.<br>
        마음에 드는 노래의 하트를 눌러 보세요.
      </p>
    `;
    return;
  }

  favoritesList.innerHTML = favoriteMusic
    .map((music) => {
      return `
        <article class="favorite-item">
          <div class="favorite-cover ${music.cover}">
            ${
              music.image
                ? `<img
                    src="${music.image}"
                    alt="${music.title}"
                    class="custom-favorite-image"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                  >
                  <span class="favorite-fallback" style="display:none;">
                    ${music.symbol}
                  </span>`
                : music.symbol
            }
          </div>

          <div class="favorite-info">
            <strong>${music.title}</strong>
            <small>${music.artist}</small>
          </div>

          <button
            class="remove-favorite"
            data-remove="${music.id}"
            aria-label="${music.title} 좋아요 취소"
            title="좋아요 취소"
          >
            ♥
          </button>
        </article>
      `;
    })
    .join("");

  favoritesList.querySelectorAll("[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      toggleFavorite(Number(button.dataset.remove));
    });
  });
}
// 상황별 플레이리스트 버튼 클릭 기능
const playlistButtons = document.querySelectorAll(".playlist-card");

playlistButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedMood = button.dataset.playlist;
    selectedGenre = "all";
    searchText = "";

    if (searchInput) {
      searchInput.value = "";
    }

    moodButtons.forEach((item) => {
      item.classList.toggle("active", item.dataset.mood === selectedMood);
    });

    genreButtons.forEach((item) => {
      item.classList.toggle("active", item.dataset.genre === "all");
    });

    renderMusic();

    document.querySelector("#discover")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

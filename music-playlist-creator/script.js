const modal = document.getElementsByClassName("modal-overlay")[0];
const modalContent = document.getElementsByClassName("modal-content")[0];
const playlistList = document.getElementById("playlist-list");
const cards = document.querySelectorAll(".playlist-cards");
const featured = document.getElementById("featured-container");
const searchBar = document.getElementById('search-bar');
const select = document.getElementById('selector');
const deleteButton = document.getElementsByClassName('delete-container')[0];
let span;

let deleting = false;
let liked = false;
let localPlaylists = [];
let modalPlaylist;

function createSong (song) {
    let songDiv = document.createElement('div');
    songDiv.className = "playlist-song";

    songDiv.innerHTML = `
        <img class="playlist-song-img" src=${song.song_img}>
        <div class="playlist-song-info">
            <p style="font-size: 20px">${song.song_title}</p>
            <p>${song.artist_name}</p>
            <p>${song.album_name}</p>
        </div>
        <div class="playlist-song-duration">
            ${song.duration}
        </div>
    `;
    modalContent.appendChild(songDiv)
}

function findPlaylistByName (playlistName) {
    for (const item of localPlaylists) {
        if (item.playlist_name === playlistName) {
            return item;
        }
    }
}

function loadModal (card) {
    let image = card.querySelector(".playlist-img");
    let playlistName = card.querySelector(".playlist-name h1");
    let creatorName = card.querySelector(".creator-name p");

    modalPlaylist = findPlaylistByName(playlistName.innerHTML);
    let songs = modalPlaylist.songs;

    let playlistModalInfo = document.createElement('div');
    playlistModalInfo.className = "playlist-modal-info";
    playlistModalInfo.innerHTML = `
        <img class="playlist-modal-img" src=${image.src}>
        <div class="playlist-modal-text">
            <div class="playlist-modal-title">
                <h2 style="font-size: 40px">${playlistName.innerHTML}</h2>
            </div>
            <div class="playlist-modal-creator">
                <h3 style="font-size: 25px">${creatorName.innerHTML}</h3>
            </div>
        </div>
        <span class="close">&times;</span>
    `;

    let shuffleButton = document.createElement('button');
    shuffleButton.classList.add("shuffle-button");
    shuffleButton.textContent = "Shuffle"
    modalContent.appendChild(playlistModalInfo);
    modalContent.appendChild(shuffleButton);

    for (const item of songs) {
        createSong(item);
    }

    modal.style.display = "block";
    span = document.getElementsByClassName("close")[0];
}

function createFeaturedSongs (randomPlaylist) {
    let featuredList = document.createElement('div');
    featuredList.className = "featured-list";
    randomPlaylist.songs.forEach(song => {
        let featuredSong = document.createElement('div');
        featuredSong.className = "featured-song";
        featuredSong.innerHTML = `
            <img class="featured-song-img" src=${song.song_img}>
            <div class="featured-song-info">
                <p style="font-size: 15px; margin-bottom: 2px;">${song.song_title}</p>
                <p style="font-size: 11px;">${song.artist_name}</p>
                <p style="font-size: 11px;">${song.album_name}</p>
                <p style="font-size: 11px;">${song.duration}</p>
            </div>
        `
        featuredList.append(featuredSong);
    })

    featured.appendChild(featuredList);
}

function createFeaturedPlaylist (randomPlaylist) {
    let featuredPlaylist = document.createElement('div');
    featuredPlaylist.className = "featured-playlist";
    featuredPlaylist.innerHTML = `
        <img class="featured-img" src=${randomPlaylist.playlist_art}>
        <h1 style="margin-top: 10px; font-size: 40px">${randomPlaylist.playlist_name}</h1>
    `
    featured.appendChild(featuredPlaylist);
    createFeaturedSongs(randomPlaylist);
}

async function loadFeatured () {
    await fetchPlaylists();
    let randomPlaylist = localPlaylists[Math.floor(
        Math.random() * localPlaylists.length)]
    createFeaturedPlaylist(randomPlaylist);
}

function createPlaylist (element) {
    let playlist = document.createElement('div');
    playlist.id = element.playlistID;
    playlist.className = "playlist-cards";

    playlist.innerHTML = `
        <img class="playlist-img" src=${element.playlist_art}>
        <div class="playlist-name">
            <h1 style="font-size: 20px">${element.playlist_name}</h1>
        </div>
        <div class="creator-name">
            <p style="font-size: 15px">${element.playlist_author}</p>
        </div>
        <div class="like-container">
            <button><i class="fa-regular fa-heart"></i></button>
            <p>${element.likes}</p>
        </div>
    `
    playlistList.appendChild(playlist);
}

function sortPlaylist (sortType) {
    if (sortType === "name") {
        localPlaylists.sort((a, b) => a.playlist_name.localeCompare(b.playlist_name));
        console.log(localPlaylists)
    } else if (sortType === "likes") {
        localPlaylists.sort((a, b) => b.likes - a.likes);
    } else if (sortType === "name") {
        localPlaylists.sort((a, b) => b.playlistID.substring(3, b.playlistID.length - 1) + 
            a.playlistID.substring(3, a.playlistID.length));
    }

    console.log(sortType);
    playlistContainer = document.getElementById('playlist-list');
    playlistContainer.innerHTML = '';
    localPlaylists.forEach(item => {
        createPlaylist(item);
    })
}

function filterBySearch () {
    localPlaylists.forEach(item => {
        for (let i = 0; i < searchBar.value.length; i++) {
            if (item.playlist_name[i].toLowerCase() != searchBar.value[i].toLowerCase()) {
                deletePlaylist = document.getElementById(item.playlistID);
                playlistList.removeChild(deletePlaylist);
                break;
            }
        }
    })
}

async function fetchPlaylists () {
    try {
        const response = await fetch("./data/data.json")
        const data = await response.json()
        data.forEach(element => {
            localPlaylists.push(element);
        })
    } catch (e) {
        console.log(e);
    }
}

async function loadPlaylists () {
    await fetchPlaylists();
    localPlaylists.forEach(item => {
        createPlaylist(item)
    })
}

function shuffleSongs () {
    let songs = [...modalPlaylist.songs];
    for (let i = songs.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [songs[i], songs[j]] = [songs[j], songs[i]];
    }

    modalPlaylist.songs = songs;
    
    for (const item of modalPlaylist.songs) {
        modalContent.removeChild(modalContent.lastChild);
    }

    for (const item of modalPlaylist.songs) {
        createSong(item)
    }
}

function deleteCard (card) {
    let playlistName = card.querySelector(".playlist-name h1");
    let currPlaylist = findPlaylistByName(playlistName.innerHTML);
    let index = localPlaylists.filter(item => item.playlistID !== currPlaylist.playlistID);
    localPlaylists.splice(index, 1);
    playlistList.removeChild(card);
    deleting = false; 
    deleteButton.className = "delete-container"
}

function updateLike (card) {
    let playlistName = card.querySelector(".playlist-name h1");
    let currPlaylist = findPlaylistByName(playlistName.innerHTML);
    let likesHTML = card.querySelector(".like-container p")
    let likeIcon = card.querySelector(".like-container button")
    if (currPlaylist.liked == false) {
        currPlaylist.likes++;
        likesHTML.innerHTML = `${currPlaylist.likes}`
        likeIcon.style = "color: red"
        currPlaylist.liked = true;
    } else {
        currPlaylist.likes--;
        likesHTML.innerHTML = `${currPlaylist.likes}`
        likeIcon.style = "color: none"
        currPlaylist.liked = false;
    }
}

function handleClick (event) {
    if (span && event.target.closest('.close')) {
        while (modalContent.firstChild) {
            modalContent.removeChild(modalContent.firstChild);
        }
        span = null;
        modal.style.display = "none";
    } else if (event.target.closest('.shuffle-button')) {
        shuffleSongs();
    } else {
        let card = event.target.closest('.playlist-cards');
        if (card && deleting === true) {
            deleteCard(card);
        }
        else if (event.target.closest(".like-container button")) {
            updateLike(card);
        }
        else if (card) {
            loadModal(card);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/music-playlist-creator/index.html") {
        loadPlaylists();
    } else if (window.location.pathname === "/music-playlist-creator/featured.html") {
        loadFeatured();
    }

    select.addEventListener('change', () => {
        const selectedOption = select.options[select.selectedIndex];
        sortPlaylist(selectedOption.value);
    });

    document.addEventListener("click", (event) => {
        handleClick(event);
    })

    searchBar.addEventListener("keyup", () => {
        if (searchBar.value.length > 2) {
            filterBySearch();
        } else {
            if (select == "") {
                sortPlaylist("date");
            } else {
                sortPlaylist(select.value);
            }
        }
    })

    deleteButton.addEventListener("click", () => {
        if (deleting) {
            deleting = false; 
            deleteButton.className = "delete-container"
        } else {
            deleting = true;
            deleteButton.className = "delete-container-active";
        }
    })
})
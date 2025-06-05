const modal = document.getElementsByClassName("modal-overlay")[0];
const modalContent = document.getElementsByClassName("modal-content")[0];
const playlistList = document.getElementById("playlist-list");
const cards = document.querySelectorAll(".playlist-cards");
let span;

let localPlaylists = []

function createSong (song) {
    let songDiv = document.createElement('div');
    songDiv.className = "playlist-song";

    songDiv.innerHTML = `
        <img class="playlist-song-img" src="${song.song_img}">
        <div class="playlist-song-info">
            <p>${song.song_title}</p>
            <p>${song.artist_name}</p>
            <p>${song.album_name}</p>
        </div>
        <div class="playlist-song-duration">
            ${song.duration}
        </div>
    `;
    modalContent.appendChild(songDiv)
}

function findSongsByName (playlistName) {
    console.log(playlistName)
    for (const item of localPlaylists) {
        if (item.playlist_name === playlistName) {
            return item.songs;
        }
    }
}

function loadModal (card) {
    let image = card.querySelector(".playlist-img");
    let playlistName = card.querySelector(".playlist-name h1");
    let creatorName = card.querySelector(".creator-name p");

    let songs = findSongsByName(playlistName.innerHTML);

    let playlistModalInfo = document.createElement('div');
    playlistModalInfo.className = "playlist-modal-info";
    playlistModalInfo.innerHTML = `
        <img class="playlist-modal-img" src=${"./assets/img/playlist.png"}>
        <div class="playlist-modal-text">
            <div class="playlist-modal-title">
                <h2>${playlistName.innerHTML}</h2>
            </div>
            <div class="playlist-modal-creator">
                <h3>${creatorName.innerHTML}</h3>
            </div>
        </div>
        <span class="close">&times;</span>
    `;

    modalContent.appendChild(playlistModalInfo);

    for (const item of songs) {
        createSong(item);
    }

    modal.style.display = "block";
    span = document.getElementsByClassName("close")[0];
}

function createPlaylist (element) {
    let playlist = document.createElement('div');
    playlist.className = "playlist-cards";

    playlist.innerHTML = `
        <img class="playlist-img" src=${"./assets/img/playlist.png"}>
        <div class="playlist-name">
            <h1>${element.playlist_name}</h1>
        </div>
        <div class="creator-name">
            <p>${element.playlist_author}</p>
        </div>
        <div class="like-container">
            <p>Likes: 0</p>
        </div>
    `
    playlistList.appendChild(playlist);
}

function loadPlaylists () {
    fetch("./data/data.json")
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                createPlaylist(element)
                localPlaylists.push(element)
            });
        })
        .catch(error => {
            console.log(error);
        });
}

function handleClick (event) {
    if (span) {
        while (modalContent.firstChild) {
            modalContent.removeChild(modalContent.firstChild);
        }
        span = null;
        modal.style.display = "none";
    }
    const card = event.target.closest('.playlist-cards');
    if (card) {
        loadModal(card);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPlaylists();

    document.addEventListener("click", (event) => {
        handleClick(event);
    })
})
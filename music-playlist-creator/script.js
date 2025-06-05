const modal = document.getElementsByClassName("modal-overlay")[0];
const modalContent = document.getElementsByClassName("modal-content")[0];
const playlistList = document.getElementById("playlist-list");
const cards = document.querySelectorAll(".playlist-cards");
let span;

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

function createPlaylist (element) {
    let playlist = document.createElement('div');
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
        if (event.target.closest(".like-container button")) {
            updateLike(card);
        }
        else if (card) {
            loadModal(card);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadPlaylists();

    document.addEventListener("click", (event) => {
        handleClick(event);
    })
})
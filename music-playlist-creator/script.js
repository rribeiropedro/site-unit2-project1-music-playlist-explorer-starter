const modal = document.getElementsByClassName("modal-overlay")[0];
const modalContent = document.getElementsByClassName("modal-content")[0];
const playlistList = document.getElementById("playlist-list");
const cards = document.querySelectorAll(".playlist-cards");
const featured = document.getElementById("featured-container");
const searchBar = document.getElementById('search-bar');
const select = document.getElementById('selector');
const deleteButton = document.getElementsByClassName('delete-container')[0];
const addButton = document.getElementsByClassName('add-container')[0];
const addSongToForm = document.getElementById('song-form-plus');
const submitPlaylistForm = document.getElementById('add-playlist-submit');
const addModalClose = document.getElementById('form-modal-close');
const editButton = document.getElementsByClassName('edit-container')[0];
const editModal = document.getElementById('edit-modal');
const editForm = document.getElementById("form-edit-playlist");


let span;
let editCloseButton;
let songsAdded = 0;
let deleting = false;
let editing = false;
let liked = false;
let localPlaylists = [];
let modalPlaylist;
let editPlaylist;
let currSongId = 1;

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
    } else if (sortType === "likes") {
        localPlaylists.sort((a, b) => b.likes - a.likes);
    } else if (sortType === "date") {
        localPlaylists.sort((a, b) => b.playlistID.substring(3, b.playlistID.length - 1) + 
            a.playlistID.substring(3, a.playlistID.length));
    }

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

function addAnotherSongInput (form) {
    let songFormList = document.createElement('div');
    currSongId++;
    songFormList.id = "song_" + String(currSongId);
    songFormList.className = "song-form-list";
    songFormList.innerHTML = `
        <div class="song-form-group">
            <label>Song Name</label>
            <input type="text" id="song-name-input">
        </div>
        <div class="song-form-group">
            <label>Song Artist</label>
            <input type="text" id="song-artist-input">
        </div>
        <div class="song-form-group">
            <label>Song Album</label>
            <input type="text" id="song-album-input">
        </div>
        <div class="song-form-group">
            <label>Song Duration</label>
            <input type="text" id="song-duration-input">
        </div>
    `
    let inputList = document.querySelector(form);
    console.log(inputList)
    songsAdded++;
    inputList.appendChild(songFormList)
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

function showEditModal (card) {
    let playlistName = card.querySelector(".playlist-name h1");
    let currPlaylist = findPlaylistByName(playlistName.innerHTML);
    editPlaylist = findPlaylistByName(playlistName.innerHTML);

    let songEditList = document.createElement("div");
    songEditList.className = "form-input";
    songEditList.id = "song-edit-input";
    songEditList.innerHTML = `
        <div id="song-input-label">
            <label style="margin-right: 5px">Edit Songs</label>
            <i id="edit-song-plus" class="fa-solid fa-plus"></i>
        </div>
    `;

    currPlaylist.songs.forEach(song => {
        let songDiv = document.createElement('div');
        songDiv.className = "playlist-song";

        songDiv.innerHTML = `
            <img style="width: 15%" class="playlist-song-img" src=${song.song_img}>
            <div class="playlist-song-info">
                <p style="font-size: 20px">${song.song_title}</p>
                <p>${song.artist_name}</p>
                <p>${song.album_name}</p>
            </div>
            <div class="playlist-song-duration">
                ${song.duration}
            </div>
            <div id="trash" style="display: flex; justify-content: center; align-items: center; margin-right: 20px">
                <i class="fa-solid fa-trash"></i>
            </div>
        `;
        currSongId++;
        songEditList.appendChild(songDiv);
    });

    editForm.innerHTML = `
        <span id="edit-modal-close" class="close">&times;</span>
        <h1>Edit Playlist Form</h1>
        <div id="edit-form-modal" class="input-list">
            <div id="change-name-input" class="form-input">
                <label>Change Name From: ${currPlaylist.playlist_name}</label>
                <input type="text" id="playlist-name">
            </div>
            <div id="change-creator-input" class="form-input">
                <label>Change Creator from: ${currPlaylist.playlist_author}</label>
                <input type="text" id="playlist-creator">
            </div>
        </div>
        <input id="edit-playlist-submit" type="submit" value="Submit">
    `;

    let inputList = editModal.querySelector('.input-list');
    inputList.appendChild(songEditList);
    document.body.appendChild(editModal);
    editCloseButton = document.getElementById('edit-modal-close');
    editModal.style = "display: block";
}

function removeEditSong (trashTarget) {
    let removeSong = trashTarget.parentElement.parentElement;
    let songName = trashTarget.parentElement.parentElement.querySelectorAll(".playlist-song-info p")[0].innerHTML;
    console.log(editPlaylist.songs.length);
    for (let i = 0; i < editPlaylist.songs.length; i++) {
        if (editPlaylist.songs[i].song_title == songName) {
            editPlaylist.songs.splice(i, 1);
            break;
        }
    }
    removeSong.remove();
}

function uploadChanges () {
    let inputList = document.getElementById('edit-form-modal');
    let playlistName = inputList.querySelector("#change-name-input input").value;
    let creatorName = inputList.querySelector("#change-creator-input input").value;
    let editFormModal = document.getElementById("edit-form-modal")

    let songsToAdd = []

    for (let i = 0; i < songsAdded; i++) {
        let currSong = editFormModal.lastChild;
        console.log(currSong)
        let songName = currSong.querySelector(".song-form-group #song-name-input").value;
        let songArtist = currSong.querySelector(".song-form-group #song-artist-input").value;
        let songAlbum = currSong.querySelector(".song-form-group #song-album-input").value;
        let songDuration = currSong.querySelector(".song-form-group #song-duration-input").value;

        songsToAdd.push({
            song_id: `song_${i}`,
            song_title: songName,
            artist_name: songArtist,
            album_name: songAlbum,
            duration: songDuration,
            song_img: "./assets/img/song.png"
        })

        editFormModal.removeChild(editFormModal.lastChild)
    }

    currSongId = 1;
    songsAdded = 0;

    let playlistToBeReplaced = findPlaylistByName(editPlaylist.playlist_name);
    let index = localPlaylists.filter(item => item.playlistID === playlistToBeReplaced.playlistID);

    if (playlistName)
        editPlaylist.playlist_name = playlistName;
    if (creatorName)
        editPlaylist.playlist_author = creatorName;
    editPlaylist.songs.push(...songsToAdd);

    // localPlaylists[index] = editPlaylist;
    console.log(localPlaylists)

    playlistList.innerHTML = ""
    localPlaylists.forEach(item => {
        createPlaylist(item);
    })

    let formModal = document.getElementById("edit-modal");
    formModal.style = "display: none"
    
}

function createPlaylistFromForm () {
    let inputList = document.getElementById('add-form-modal');
    let playlistName = inputList.querySelector("#playlist-name-input input").value;
    let creatorName = inputList.querySelector("#playlist-creator-input input").value;
    let songList = inputList.querySelector("#song-form-input");

    let songsToAdd = []

    for (let i = 1; i <= currSongId; i++) {
        let currSong = songList.querySelector(`#song_${i}`);
        let songName = currSong.querySelector(".song-form-group #song-name-input").value;
        let songArtist = currSong.querySelector(".song-form-group #song-artist-input").value;
        let songAlbum = currSong.querySelector(".song-form-group #song-album-input").value;
        let songDuration = currSong.querySelector(".song-form-group #song-duration-input").value;

        songsToAdd.push({
            song_id: `song_${i}`,
            song_title: songName,
            artist_name: songArtist,
            album_name: songAlbum,
            duration: songDuration,
            song_img: "./assets/img/song.png"
        })
    }

    currSongId = 1;

    localPlaylists.push({
        playlistID: `${localPlaylists.length}`,
        playlist_name: playlistName,
        playlist_author: creatorName,
        playlist_art: "./assets/img/playlist.png",
        likes: 0,
        liked: false,
        songs: songsToAdd
    })
    
    playlistList.innerHTML = ""
    localPlaylists.forEach(item => {
        createPlaylist(item);
    })

    let formModal = document.getElementById("form-modal");
    formModal.style = "display: none"
}

function updateLike (card) {
    let playlistName = card.querySelector(".playlist-name h1");
    let currPlaylist = findPlaylistByName(playlistName.innerHTML);
    let likesHTML = card.querySelector(".like-container p")
    let likeButton = card.querySelector(".like-container button");
    let likeIcon = card.querySelector(".like-container button i");
    if (currPlaylist.liked == false) {
        currPlaylist.likes++;
        likesHTML.innerHTML = `${currPlaylist.likes}`
        likeIcon.classList = "fa-solid fa-heart"
        likeButton.style = "color: red"
        currPlaylist.liked = true;
    } else {
        currPlaylist.likes--;
        likesHTML.innerHTML = `${currPlaylist.likes}`
        likeIcon.classList = "fa-regular fa-heart"
        likeButton.style = "color: none"
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
    } else if (editing && event.target.closest('#edit-modal-close')) {
        document.getElementById('edit-modal').remove();
        editButton.className = "edit-container";
        currSongId = 1;
        editing = false;
    } else if (editing && event.target.closest('#trash')) {
        removeEditSong(event.target);
    } else if (editing && event.target.closest('#edit-song-plus')) {
        addAnotherSongInput("#edit-form-modal");
    } else {
        let card = event.target.closest('.playlist-cards');
        if (card && deleting === true) {
            deleteCard(card);
        } else if (card && editing == true) {
            showEditModal(card);
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

    if (document.body.id === "home") {
        loadPlaylists();
    } else if (document.body.id === "featured") {
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

    addButton.addEventListener("click", () => {
        let formModal = document.getElementById("form-modal");
        formModal.style = "display: block"
    })

    addSongToForm.addEventListener("click", () => {
        addAnotherSongInput("#add-form-modal", "#song-form-input");
    })

    deleteButton.addEventListener("click", () => {
        if (deleting) {
            deleting = false; 
            deleteButton.className = "delete-container";
        } else {
            deleting = true;
            deleteButton.className = "delete-container-active";
            editing = false;
            editButton.className = "edit-container";
        }
    })

    editButton.addEventListener("click", () => {
        if (editing) {
            editing = false;
            editButton.className = "edit-container";
        } else {
            editing = true;
            deleting = false;
            deleteButton.className = "delete-container";
            editButton.className = "edit-container-active";
        }
    })

    addModalClose.addEventListener("click", () => {
        let formModal = document.getElementById("form-modal");
        let songFormInput = document.querySelector("#song-form-input");
        while (songFormInput.children.length > 2) {
            songFormInput.removeChild(songFormInput.lastChild);
        }

        document.getElementById('playlist-name').value = '';
        document.getElementById('playlist-creator').value = '';
        document.getElementById('song-name-input').value = '';
        document.getElementById('song-artist-input').value = '';
        document.getElementById('song-album-input').value = '';
        document.getElementById('song-duration-input').value = '';
        
        formModal.style = "display: none";
    })

    submitPlaylistForm.addEventListener("click", (event) => {
        event.preventDefault();
        createPlaylistFromForm();
    })

    editForm.addEventListener("submit", (event) => {
        event.preventDefault();
        uploadChanges();
    })
})
const modal = document.getElementsByClassName("modal-overlay")[0];
const span = document.getElementsByClassName("close")[0];
const playlistList = document.getElementById("playlist-list")

span.onclick = function() {
   modal.style.display = "none";
}

// Populates playlist with data from data.json
fetch("./data/data.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            console.log(element)
            let playlist = document.createElement('div');
            playlist.className = "playlist-cards";

            let playlistImg = document.createElement('img');
            playlistImg.className = 'playlist-img';
            playlistImg.src = '../assets/img/playlist.png';
            playlist.appendChild(playlistImg);

            let playlistName = document.createElement('div');
            playlistName.className = 'playlist-name';
            let playlistNameH1 = document.createElement('h1');
            playlistNameH1.innerHTML = element.playlist_name;
            playlistName.appendChild(playlistNameH1);
            playlist.appendChild(playlistName);

            let creatorName = document.createElement('div');
            creatorName.className = 'creator-name';
            let playlistCreatorH1 = document.createElement('h1');
            playlistCreatorH1.innerHTML = element.playlist_author;
            creatorName.appendChild(playlistCreatorH1);
            playlist.appendChild(creatorName);

            let likes = document.createElement('div');
            likes.className = 'like-container'
            likes.innerHTML = "Likes";
            playlist.appendChild(likes);

            playlistList.appendChild(playlist);
        });
    })
    .catch(error => {
        console.log(error);
    });

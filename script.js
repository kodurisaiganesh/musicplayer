console.log("Welcome to Spotify");

// Initialize the Variables
let songIndex = 0;
let audioElement = new Audio(); // Create audio element
let masterPlay = document.getElementById('masterPlay');
let myProgressBar = document.getElementById('myProgressBar');
let volumeSlider = document.getElementById('volumeSlider');
let gif = document.getElementById('gif');
let masterSongName = document.getElementById('masterSongName');
let songItems = Array.from(document.getElementsByClassName('songItem'));
let playlist = document.getElementById('playlist');
let addPlaylist = document.getElementById('addPlaylist');
let songItemContainer = document.getElementById('songItemContainer'); // Add this line
let shuffleButton = document.getElementById('shuffle');
let repeatButton = document.getElementById('repeat');
let isShuffling = false;
let isRepeating = false;

let songs = [
    { songName: "Em Sandeham Ledu", filePath: "songs/1.mp3", coverPath: "covers/1.jpg", duration: "05:34" },
    { songName: "Ye Mantramo ", filePath: "songs/2.mp3", coverPath: "covers/2.jpg", duration: "02:33" },
    { songName: "Lutt Putt Gaya", filePath: "songs/3.mp3", coverPath: "covers/3.jpg", duration: "05:34" },
    { songName: "Vikram Title", filePath: "songs/4.mp3", coverPath: "covers/4.jpg", duration: "05:34" },
    { songName: "Ammayi", filePath: "songs/5.mp3", coverPath: "covers/5.jpg", duration: "05:34" },
    { songName: "JAWAN: Chaleya", filePath: "songs/6.mp3", coverPath: "covers/6.jpg", duration: "05:34" },
    { songName: "Yemaaya Chesave-Manasaa", filePath: "songs/7.mp3", coverPath: "covers/7.jpg", duration: "05:34" },
    { songName: "KHAIRIYAT (BONUS TRACK)", filePath: "songs/8.mp3", coverPath: "covers/8.jpg", duration: "05:34" },
    { songName: "Kurchi Madathapetti", filePath: "songs/9.mp3", coverPath: "covers/9.jpg", duration: "05:34" },
    { songName: "Awaara - Chiru Chiru Video", filePath: "songs/10.mp3", coverPath: "covers/10.jpg", duration: "05:34" },
    { songName: "Enna Sona", filePath: "songs/11.mp3", coverPath: "covers/11.jpg", duration: "05:34" },
    { songName: "Gundellonaa", filePath: "songs/12.mp3", coverPath: "covers/12.jpg", duration: "05:34" },
];

songItems.forEach((element, i) => {
    element.getElementsByTagName("img")[0].src = songs[i].coverPath;
    element.getElementsByClassName("songName")[0].innerText = songs[i].songName;

    // Add an event listener to each song item
    element.addEventListener('click', () => {
        playSong(i); // Pass the index 'i' when a song item is clicked
    });
});

// Function to play a song by index
const playSong = (index) => {
    if (index >= 0 && index < songs.length) {
        songIndex = index;
        audioElement.src = songs[songIndex].filePath;
        masterSongName.innerText = songs[songIndex].songName;
        audioElement.currentTime = 0;
        audioElement.play();
        gif.style.opacity = 1;
        masterPlay.classList.remove('fa-play-circle');
        masterPlay.classList.add('fa-pause-circle');
    }
};

// Handle play/pause click
masterPlay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        playSong(songIndex); // Ensure the song plays when masterPlay is clicked
    } else {
        audioElement.pause();
        masterPlay.classList.remove('fa-pause-circle');
        masterPlay.classList.add('fa-play-circle');
        gif.style.opacity = 0;
    }
});

// Listen to Events
audioElement.addEventListener('timeupdate', () => {
    // Update Seekbar
    let progress = parseInt((audioElement.currentTime / audioElement.duration) * 100);
    myProgressBar.value = progress;
});

myProgressBar.addEventListener('change', () => {
    audioElement.currentTime = myProgressBar.value * audioElement.duration / 100;
});

// Volume control
volumeSlider.addEventListener('input', () => {
    audioElement.volume = volumeSlider.value / 100;
});

// Initialize playlists object
let playlists = {};

// Function to load a playlist
function loadPlaylist(playlistName) {
    // Clear current song list
    songItemContainer.innerHTML = '';
    // Load songs from the playlist
    playlists[playlistName].forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'songItem';
        songItem.innerHTML = `
            <img src="${song.coverPath}" alt="${index}">
            <span class="songName">${song.songName}</span>
            <span class="songlistplay"><span class="timestamp">${song.duration} <i id="${index}" class="far songItemPlay fa-play-circle"></i> </span></span>
        `;
        songItemContainer.appendChild(songItem);

        // Add event listener for playing the song
        songItem.querySelector('.songItemPlay').addEventListener('click', () => {
            playSong(index);
        });
    });
}

// Function to add a new playlist
addPlaylist.addEventListener('click', () => {
    const playlistName = prompt("Enter playlist name:");
    if (playlistName && !playlists[playlistName]) {
        playlists[playlistName] = [];
        const li = document.createElement('li');
        li.textContent = playlistName;
        li.addEventListener('click', () => {
            loadPlaylist(playlistName);
        });
        playlist.appendChild(li);
        addSongsToPlaylist(playlistName);
    }
});

// Function to add songs to a playlist
function addSongsToPlaylist(playlistName) {
    const songCount = parseInt(prompt(`How many songs do you want to add to ${playlistName}?`));
    if (songCount > 0) {
        for (let i = 0; i < songCount; i++) {
            const songIndex = parseInt(prompt(`Enter the index of song ${i + 1}:`));
            if (songIndex >= 0 && songIndex < songs.length) {
                addSongToPlaylist(playlistName, songs[songIndex]);
            }
        }
    }
}

// Handle next song click
document.getElementById('next').addEventListener('click', () => {
    if (isShuffling) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        if (songIndex >= songs.length - 1) {
            songIndex = 0;
        } else {
            songIndex += 1;
       
        }
    }
    playSong(songIndex);
});

// Handle previous song click
document.getElementById('previous').addEventListener('click', () => {
    if (isShuffling) {
        songIndex = Math.floor(Math.random() * songs.length);
    } else {
        if (songIndex <= 0) {
            songIndex = songs.length - 1;
        } else {
            songIndex -= 1;
        }
    }
    playSong(songIndex);
});

// Shuffle functionality
shuffleButton.addEventListener('click', () => {
    isShuffling = !isShuffling;
    shuffleButton.classList.toggle('active');
});

// Repeat functionality
repeatButton.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatButton.classList.toggle('active');
});

// Handle song end
audioElement.addEventListener('ended', () => {
    if (isRepeating) {
        audioElement.currentTime = 0;
        audioElement.play();
    } else {
        document.getElementById('next').click();
    }
});
// Function to add a new playlist
addPlaylist.addEventListener('click', () => {
    const playlistName = prompt("Enter playlist name:");
    if (playlistName && !playlists[playlistName]) {
        playlists[playlistName] = [];
        const li = document.createElement('li');
        li.textContent = playlistName;
        li.addEventListener('click', () => {
            loadPlaylist(playlistName);
        });
        playlist.appendChild(li);
        addSongsToPlaylist(playlistName);
    }
});

// Function to load a playlist
function loadPlaylist(playlistName) {
    // Clear current song list
    songItemContainer.innerHTML = '';
    // Load songs from the playlist
    playlists[playlistName].forEach((song, index) => {
        const songItem = document.createElement('div');
        songItem.className = 'songItem';
        songItem.innerHTML = `
            <img src="${song.coverPath}" alt="${index}">
            <span class="songName">${song.songName}</span>
            <span class="songlistplay"><span class="timestamp">${song.duration} <i id="${index}" class="far songItemPlay fa-play-circle"></i> </span></span>
        `;
        songItemContainer.appendChild(songItem);

        // Add event listener for playing the song
        songItem.querySelector('.songItemPlay').addEventListener('click', () => {
            playSong(index);
        });
    });
}
// Function to add a new playlist
addPlaylist.addEventListener('click', () => {
    const playlistName = prompt("Enter playlist name:");
    if (playlistName && !playlists[playlistName]) {
        playlists[playlistName] = [];
        const li = document.createElement('li');
        li.textContent = playlistName;
        li.addEventListener('click', () => {
            loadPlaylist(playlistName);
        });
        playlist.appendChild(li);
        addSongsToPlaylist(playlistName);
    }
});

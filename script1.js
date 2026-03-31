
let currentSong = new Audio();
let currfolder;
 function secondsToMinutesSeconds(seconds){
  if(isNaN(seconds)|| seconds <0){
    return "00:00";
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = String(minutes).padStart(2,'0');
  const formattedSeconds  = String(remainingSeconds).padStart(2,'0');

  return `${formattedMinutes}:${formattedSeconds}`
 }
// async function getSongs() {
//   try {
//     let res = await fetch("http://localhost:3000/api/songs");
//     let data = await res.json(); // ✅ Parse JSON response

//     // Get just the song names
//     let songs = data.map(song => song.name); // e.g. ["song1.mp3", "song2.mp3"]
//     return songs;
//   } catch (err) {
//     console.error("Error fetching songs:", err);
//     return [];
//   }
// }

async function getSongs(folder) {
  currfolder = folder;
  try {
    let res = await fetch(`http://localhost:3000/api/songs/${folder}`);
    let songs = await res.json();
    console.log("Songs from", folder, songs);
    return songs;
  } catch (err) {
    console.error(`Error fetching songs from ${folder}:`, err);
    return [];
  }
}
getSongs("ncs"); // ✅ works now

const playMusic = (track,folder, pause=false) => {
  currentSong.src = `/songs/${currfolder}/` + track; // ✅ lowercase src
  if(!pause){
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};


// async function displayalbum() {
//     let a = await fetch(`http://localhost:3000/api/songs/`);
//     let response = await a.text(); // ✅ Parse JSON response
//    let div = document.createElement("div");
//    div.innerHTML = response;
//     let anchors  = div.getElementsByTagName("a");
//     let cardContainer = document.querySelector(".cardContainer")
//      Array.from(anchors).forEach(async e=>{
//             console.log(e.href);
//     if(e.href.includes("/songs")){
//         let folder = e.href.split("/").slice(-2)[0];
//         // get the meta data of folder
//  let a = await fetch(`http://localhost:3000/api/songs/${folder}/info.json`);
//     let response = await a.json(); // ✅ Parse JSON response
//       console.log(response);
//       cardContainer.innerHTML = cardContainer.innerHTML + ` <div  data-folder="cs" class="card">
//                         <div class="play"> <img src="img/play.svg" alt=""></div>
//                         <img src="song/cs/cover.jpg" alt="">
//                         <h2>${response.title}</h2>
//                         <p>${response.description}</p>
//                     </div>`
//       }
//      })
// }
// displayalbum()
async function displayAlbums() {
  const res = await fetch("http://localhost:3000/api/albums");
  const albums = await res.json();

  const cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = ""; // clear old content

  albums.forEach(album => {
    cardContainer.innerHTML += `
      <div class="card" data-folder="${album.folder}">
        <div class="play"><img src="img/play.svg" alt=""></div>
        <img src="${album.cover}" alt="${album.title}">
        <h2>${album.title}</h2>
        <p>${album.description}</p>
      </div>`;
  });





function loadPlaylistUI(songs) {
  const songUL = document.querySelector(".songlist ul");
  songUL.innerHTML = ""; // Clear old songs

  songs.forEach(song => {
    const cleanName = song.replaceAll("%20", " ");
    songUL.innerHTML += `
      <li>
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
          <div>${cleanName}</div>
          <div>Alok</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>`;
  });

  // Attach click event to each song in the updated list
  Array.from(songUL.getElementsByTagName("li")).forEach(li => {
    li.addEventListener("click", () => {
      const track = li.querySelector(".info div").textContent.trim();
      playMusic(track, false); // plays the clicked song
    });
  });
}









  // Add click listeners to load songs when clicking album card
  Array.from(document.querySelectorAll(".card")).forEach(card => {
    card.addEventListener("click", async () => {
      const folder = card.dataset.folder;
      console.log("Clicked folder:", folder);

      let songs = await getSongs(folder);
      console.log("Fetched songs:", songs);
      loadPlaylistUI(songs); // optional: refresh playlist visually
      playMusic(songs[0], true);
    });
  });

  //   Array.from(document.querySelectorAll(".songItem")).forEach(item => {
  //   item.addEventListener("click", () => {
  //     const index = item.dataset.index;
  //     playMusic(songs[index]);
  //   });
  // });
}


displayAlbums();

async function main() {
  // get the list of all the songs
  const folder = "ncs";
  let songs = await getSongs(folder);
  playMusic(songs[0],folder, true)
  console.log("Fetched songs:", songs);

  let songUL = document.querySelector(".songlist ul");
  songUL.innerHTML = ""; // Clear list first
  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Alok</div>
        </div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>`;
  }
  // attach click event to each song
  Array.from(songUL.getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", () => {
      const track = e.querySelector(".info").firstElementChild.innerHTML.trim();
      console.log("Playing:", track);
      playMusic(track,folder);
    });
  });

  // attach event listener to play/pause button
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });


  //listen for timeupdate event
  currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime,currentSong.duration );
     document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
     document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";

  })

  document.querySelector(".seekbar").addEventListener("click", e=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
              document.querySelector(".circle").style.left = percent + "%";

              currentSong.currentTime = ((currentSong.duration)*percent)/100;

  })

//add event lidtener for hamburger 
document.querySelector(".hamburger").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "0";
})
//add event lidtener for closw
document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "-120%";
})

//add an event listener to prev and next
previous.addEventListener("click",()=>{
  console.log("previous clicked");
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  let prevIndex = (index - 1 + songs.length ) % songs.length;
    playMusic(songs[prevIndex],folder);
})

//add an event listener to next and next
next.addEventListener("click",()=>{
  console.log("next clicked");

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  let nextIndex = (index + 1) % songs.length;
    playMusic(songs[nextIndex],folder);
 
})


//add an event to volume

// document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
//   currentSong.volume = parseInt(e.target.value)/100;
// })

const volume = document.getElementById("volume");

volume.addEventListener("input", (e) => {
  const value = e.target.value;
  currentSong.volume = value / 100;
  // dynamically update the fill
  e.target.style.background = `linear-gradient(to right, orange ${value}%, #444 ${value}%)`;
});

// load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(card=>{
  // console.log(e);
  // console.log(item.dataset);
  
 card.addEventListener("click",async ()=>{
  const folder = card.dataset.folder;
  console.log("Clicked folder:", folder);
  let songs = await getSongs(folder);
  console.log("Fetched songs for", folder, songs);
  // folder/



let songUL = document.querySelector(".songlist ul");
    songUL.innerHTML = ""; // clear previous list

    for (const song of songs) {
      songUL.innerHTML += `
        <li>
          <img class="invert" src="img/music.svg" alt="">
          <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Alok</div>
          </div>
          <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="img/play.svg" alt="">
          </div>
        </li>`;
    }

    // 🎧 Add event listeners to the new playlist
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
      e.addEventListener("click", () => {
        const track = e.querySelector(".info").firstElementChild.innerHTML.trim();
        console.log("Playing:", track);
        playMusic(track, folder);
      });
    });

 })
})
}
main();

let currentSong = new Audio();
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
async function getSongs() {
  try {
    let res = await fetch("http://localhost:3000/api/songs");
    let data = await res.json(); // ✅ Parse JSON response

    // Get just the song names
    let songs = data.map(song => song.name); // e.g. ["song1.mp3", "song2.mp3"]
    return songs;
  } catch (err) {
    console.error("Error fetching songs:", err);
    return [];
  }
}



const playMusic = (track, pause=false) => {
  currentSong.src = "/songs/" + track; // ✅ lowercase src
  if(!pause){
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};
async function main() {
  // get the list of all the songs
  let songs = await getSongs();
  playMusic(songs[0], true)
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
      playMusic(track);
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
    playMusic(songs[prevIndex]);
})

//add an event listener to next and next
next.addEventListener("click",()=>{
  console.log("next clicked");

  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
  let nextIndex = (index + 1) % songs.length;
    playMusic(songs[nextIndex]);
 
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


}
main();

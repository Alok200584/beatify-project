console.log('hey this is hari boll');
    let currentSong = new Audio();
async function getSongs(){
   
    let a = await fetch("http://localhost:3000/api/songs");
    let response = await a.json();
    let div  = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for(let index =0; index< as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
        return songs
    }
}

const playMusic = (track)=>{
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track;
    currentSong.play();
    play.src = "img/pause.svg"
    document.querySelector(".songinfo").innerHTML = track
     document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}
async function main() {

    //get the list of all the songs
    let songs = await getSongs();
    console.log("Fetched songs:", songs);
    
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
   for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + ` <li>
                            <img class="invert"  src="img/music.svg" alt="">
                            <div class="info">
                               <div>${song.replaceAll("%20", " ")}</div>
                               <div>Alok</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert"  src="img/play.svg" alt="">
                            </div>
                        </li>`;
   }
    // attach an event listener to each song
Array.from( document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click", element=>{
console.log(e.querySelector(".info").firstElementChild.innerHTML);
playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    }) 
}) 
//attach an event listener to play next and previous
play.addEventListener("click", ()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src = "img/pause.svg"
    }
    else{
        currentSong.pause()
        play.src = "img/play.svg"
    }
})
}
main()
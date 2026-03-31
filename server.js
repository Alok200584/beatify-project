// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const app = express();
// const port = 3000;
// const cors = require("cors");
// app.use(cors());
// // Folder where songs are stored
// const songsDir = path.join(__dirname, "songs");

// // Serve the songs folder statically (so files are accessible)
// app.use("/songs", express.static(songsDir));

// // API to get all songs
// app.get("/api/songs", (req, res) => {
//   fs.readdir(songsDir, (err, files) => {
//     if (err) return res.status(500).json({ error: "Unable to read songs folder" });
//     const songs = files.filter(file => file.endsWith(".mp3"));
//     const songList = songs.map(file => ({
//       name: file,
//       url: `${req.protocol}://${req.get("host")}/songs/${encodeURIComponent(file)}`
//     }));
//     res.json(songList);
//   });
// });
// // Display clickable song list in browser
// app.get("/", (req, res) => {
//   fs.readdir(songsDir, (err, files) => {
//     if (err) return res.send("Error reading songs folder");

//     const songs = files.filter(file => file.endsWith(".mp3"));
//     const songLinks = songs.map(
//       file => `<li><a href="/songs/${encodeURIComponent(file)}" target="_blank">${file}</a></li>`
//     );

//     res.send(`
//       <h1>🎵 All Songs</h1>
//       <ul>${songLinks.join("")}</ul>
//       <p>API available at <a href="/api/songs" target="_blank">/api/songs</a></p>
//     `);
//   });
// });
// app.listen(port, () => {
//   console.log(`✅ Server running at http://localhost:${port}`);
// });














// server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

// === Middlewares ===
app.use(cors()); // allow frontend JS to fetch from different ports (e.g. 5500)
app.use(express.static(__dirname));

// === Serve songs directory ===
app.use("/songs", express.static(path.join(__dirname, "songs")));

// === API: dynamic folder handling ===
// Example: /api/songs/ncs  or  /api/songs/hindi
app.get("/api/songs/:folder", async (req, res) => {
  try {
    const folderName = req.params.folder;
    const folderPath = path.join(__dirname, "songs", folderName);

    // check if folder exists
    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: `Folder "${folderName}" not found` });
    }

    const files = await fs.promises.readdir(folderPath);
    const songs = files.filter(f => /\.(mp3|wav|m4a|ogg|flac)$/i.test(f));

    res.json(songs);
  } catch (err) {
    console.error("Error reading folder:", err);
    res.status(500).json({ error: "Failed to read folder" });
  }
});

// === Root route: show clickable list of all folders and songs ===
app.get("/", async (req, res) => {
  try {
    const songsRoot = path.join(__dirname, "songs");
    const folders = await fs.promises.readdir(songsRoot, { withFileTypes: true });
    const folderList = folders
      .filter(f => f.isDirectory())
      .map(f => f.name);

    // Generate HTML for all folders + songs
    let html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>🎧 Songs Library</title>
        <style>
          body { background:#111; color:#eee; font-family: Arial; padding:20px; }
          a { color:#ffa500; text-decoration:none; }
          a:hover { text-decoration:underline; }
          h1 { color:#ffa500; }
          ul { list-style:none; padding:0; }
          li { background:#1a1a1a; padding:12px; margin-bottom:10px; border-radius:8px; }
        </style>
      </head>
      <body>
        <h1>🎧 Songs Library</h1>
        <p>API Example: <code>/api/songs/ncs</code></p>
    `;

    for (const folder of folderList) {
      const folderPath = path.join(songsRoot, folder);
      const files = await fs.promises.readdir(folderPath);
      const songs = files.filter(f => /\.(mp3|wav|m4a|ogg|flac)$/i.test(f));

      html += `<h2>📁 ${folder}</h2><ul>`;
      songs.forEach(song => {
        const url = `/songs/${folder}/${encodeURIComponent(song)}`;
        html += `
          <li>
            ${song}<br/>
            <audio controls preload="none" style="width:300px;">
              <source src="${url}">
              Your browser does not support the audio tag.
            </audio>
            &nbsp;<a href="${url}" download>Download</a>
          </li>`;
      });
      html += "</ul>";
    }

    html += `</body></html>`;
    res.send(html);

  } catch (err) {
    console.error("Error building page:", err);
    res.status(500).send("Error building song list");
  }
});

// === Start server ===
app.listen(port, () => {
  console.log(`✅ Server running at: http://localhost:${port}`);
  console.log(`🎵 Songs folder: ${path.join(__dirname, "songs")}`);
});

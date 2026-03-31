const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

// === Middleware ===
app.use(cors());
app.use(express.static(__dirname));

// Serve all songs & album assets (cover, info.json)
app.use("/songs", express.static(path.join(__dirname, "songs")));

// === API 1: Get list of all albums ===
// Each album folder will have: info.json, cover.jpg, and songs
app.get("/api/albums", async (req, res) => {
  try {
    const songsRoot = path.join(__dirname, "songs");
    const folders = await fs.promises.readdir(songsRoot, { withFileTypes: true });

    const albums = [];

    for (const folder of folders) {
      if (folder.isDirectory()) {
        const folderPath = path.join(songsRoot, folder.name);
        const infoPath = path.join(folderPath, "info.json");
        const coverPath = `/songs/${folder.name}/cover.jpg`;

        let info = { title: folder.name, description: "No description" };
        if (fs.existsSync(infoPath)) {
          try {
            const infoData = await fs.promises.readFile(infoPath, "utf-8");
            info = JSON.parse(infoData);
          } catch {
            console.warn(`⚠️ Invalid info.json in ${folder.name}`);
          }
        }

        albums.push({
          folder: folder.name,
          title: info.title,
          description: info.description,
          cover: coverPath,
        });
      }
    }

    res.json(albums);
  } catch (err) {
    console.error("Error reading albums:", err);
    res.status(500).json({ error: "Failed to load albums" });
  }
});

// === API 2: Get all songs from a specific album ===
app.get("/api/songs/:folder", async (req, res) => {
  try {
    const folderName = req.params.folder;
    const folderPath = path.join(__dirname, "songs", folderName);

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

// === Root route for quick testing ===
app.get("/", async (req, res) => {
  res.send(`
    <html>
      <head><title>Music Server</title></head>
      <body style="background:#111;color:#fff;font-family:sans-serif">
        <h1>🎵 Music Server Running</h1>
        <p>Try these:</p>
        <ul>
          <li><a href="/api/albums" style="color:#ffa500">/api/albums</a></li>
          <li><a href="/api/songs/ncs" style="color:#ffa500">/api/songs/ncs</a></li>
        </ul>
      </body>
    </html>
  `);
});

// === Start Server ===
app.listen(port, () => {
  console.log(`✅ Server running at: http://localhost:${port}`);
  console.log(`🎵 Songs folder: ${path.join(__dirname, "songs")}`);
});

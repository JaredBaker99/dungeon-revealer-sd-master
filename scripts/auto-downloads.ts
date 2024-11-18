import * as chokidar from "chokidar";
import archiver from "archiver"; // Corrected import
import * as path from "path";
import * as fs from "fs";
import * as os from "os";

// Define paths
const folderToWatch = path.join(
  __dirname,
  "../data/maps/04320806-2e81-4fc3-b661-594ece6f3972/settings.json"
); // Path to the maps folder
const desktopPath = path.join(os.homedir(), "Desktop"); // Path to the user's desktop
const debounceTime = 1000; // 1-second debounce time for file changes

// Function to zip and download the folder
function downloadFolder(folderPath: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const zipFileName = `test-map-folder-${timestamp}.zip`;
  const outputFilePath = path.join(desktopPath, zipFileName);

  const output = fs.createWriteStream(outputFilePath);
  const archive = archiver("zip", { zlib: { level: 9 } }); // Now this works!

  output.on("close", () => {
    console.log(
      `Saved to Desktop: ${outputFilePath} (${archive.pointer()} bytes)`
    );
  });

  archive.pipe(output);
  archive.directory(folderPath, false);
  archive.finalize();
}

// Watcher for file changes
let timeout: NodeJS.Timeout;
const watcher = chokidar.watch(folderToWatch, { persistent: true });

watcher.on("change", () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => downloadFolder(folderToWatch), debounceTime);
});

console.log(`Watching for changes in: ${folderToWatch}`);

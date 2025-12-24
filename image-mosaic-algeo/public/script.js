const BLOCK_SIZE = 10;
let datasetTiles = [];

function setStatus(text, type = "idle") {
  const el = document.getElementById("status");
  el.textContent = text;
  el.className = `status ${type}`;
}

function averageColor(imageData) {
  let r = 0, g = 0, b = 0;
  const n = imageData.data.length / 4;

  for (let i = 0; i < imageData.data.length; i += 4) {
    r += imageData.data[i];
    g += imageData.data[i + 1];
    b += imageData.data[i + 2];
  }

  return [r / n, g / n, b / n];
}

function euclidean(a, b) {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
  );
}

function applyColorTransform(tileCanvas, tileVector, targetVector) {
  const canvas = document.createElement("canvas");
  canvas.width = tileCanvas.width;
  canvas.height = tileCanvas.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(tileCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  const scale = [
    targetVector[0] / (tileVector[0] + 1e-6),
    targetVector[1] / (tileVector[1] + 1e-6),
    targetVector[2] / (tileVector[2] + 1e-6),
  ];

  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.min(255, data[i]     * scale[0]);
    data[i + 1] = Math.min(255, data[i + 1] * scale[1]);
    data[i + 2] = Math.min(255, data[i + 2] * scale[2]);
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

async function loadImageVector(file) {
  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();

  const tileCanvas = document.createElement("canvas");
  tileCanvas.width = BLOCK_SIZE;
  tileCanvas.height = BLOCK_SIZE;
  const ctx = tileCanvas.getContext("2d");

  ctx.drawImage(img, 0, 0, BLOCK_SIZE, BLOCK_SIZE);
  const data = ctx.getImageData(0, 0, BLOCK_SIZE, BLOCK_SIZE);

  return {
    image: tileCanvas,
    vector: averageColor(data)
  };
}

async function loadDatasetFromFiles(files) {
  datasetTiles = [];
  setStatus("Loading dataset images…", "loading");

  for (const file of files) {
    const tile = await loadImageVector(file);
    datasetTiles.push(tile);
  }

  setStatus(`Dataset loaded: ${datasetTiles.length} images`, "success");
}

document.getElementById("datasetFilesInput")
  .addEventListener("change", async (e) => {
    await loadDatasetFromFiles(Array.from(e.target.files));
  });

document.getElementById("datasetFolderInput")
  .addEventListener("change", async (e) => {
    await loadDatasetFromFiles(Array.from(e.target.files));
  });

document.getElementById("targetInput")
  .addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = document.getElementById("targetPreview");
    img.src = URL.createObjectURL(file);
  });

function findClosestTile(targetVector) {
  let best = datasetTiles[0];
  let minDist = euclidean(targetVector, best.vector);

  for (const t of datasetTiles) {
    const d = euclidean(targetVector, t.vector);
    if (d < minDist) {
      minDist = d;
      best = t;
    }
  }
  return best;
}

async function generatePureMosaic(file) {
  setStatus("Generating mosaic…", "loading");

  const img = new Image();
  img.src = URL.createObjectURL(file);
  await img.decode();

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(img, 0, 0);

  const canvas = document.getElementById("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");

  for (let y = 0; y < canvas.height; y += BLOCK_SIZE) {
    for (let x = 0; x < canvas.width; x += BLOCK_SIZE) {

      const w = Math.min(BLOCK_SIZE, canvas.width - x);
      const h = Math.min(BLOCK_SIZE, canvas.height - y);

      const blockData = tempCtx.getImageData(x, y, w, h);
      const targetVector = averageColor(blockData);

      const tile = findClosestTile(targetVector);
      const adjustedTile = applyColorTransform(
        tile.image,
        tile.vector,
        targetVector
      );

      ctx.drawImage(adjustedTile, x, y, w, h);
    }
  }

  setStatus("Mosaic generation complete.", "success");
}


document.getElementById("generateBtn")
  .addEventListener("click", async () => {
    const targetInput = document.getElementById("targetInput");

    if (!targetInput.files.length || datasetTiles.length === 0) {
      setStatus("Please upload target image and dataset.", "error");
      return;
    }

    await generatePureMosaic(targetInput.files[0]);
  });
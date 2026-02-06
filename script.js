// Generate 12 mock video items (4x3 grid)
const container = document.getElementById('video-container');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingProgress = document.getElementById('loading-progress');
const loadingHint = document.getElementById('loading-hint');

const VID_X = 4;
const VID_Y = 3;
const THUMBNAIL_WIDTH = 320;
const THUMBNAIL_HEIGHT = 240;
const BASE_CELL_WIDTH = 480;
const BASE_CELL_HEIGHT = 360;
const CHANNEL_WIDTH = 40;
const CHANNEL_HEIGHT = 40;
const VIDEO_SRC = 'video_input/input_compressed.mp4';

let __videoReady = false;
let __pendingStart = false;
let __isPlaying = false;
let __rafId = null;

const videoElement = document.createElement('video');
videoElement.src = VIDEO_SRC;
videoElement.preload = 'auto';
videoElement.playsInline = true;

// Configuration
const baseTitles = [
    'Game changer',
    'Heated rivalry',
    'Tough guy',
    'Common goal',
    'Role model',
    'Long game'
];

const titleVariations = [
    `{title} , #skip (don't skip ep.3)`,
    `{title} , He deserves sunshine. and so do you.`,
    `{title} , Blue moon over brooklyn with extra banana please `,
    `{title} , I pick or`,
    `{title} , I love you too #teamskipforever`
];

const channels = [
    'Heated rivalry',
    'Crave',
    'Jacob Tierney',
    'Rechel reid'


];

// Thumbnail images (large images for video thumbnails)
const thumbnailImages = [
    'image/thumbnail/image1.png',
    'image/thumbnail/image2.png',
    'image/thumbnail/image3.png',
    'image/thumbnail/image4.png',
    'image/thumbnail/image5.png',
    'image/thumbnail/image6.png',
    'image/thumbnail/image8.png',
    'image/thumbnail/image9.png',
    'image/thumbnail/image10.png',
    'image/thumbnail/image11.png',
];

// Avatar images (small circular images for channel avatars)
const avatarImages = [
    'image/icon/image1.png',
    'image/icon/image2.png',
    'image/icon/image3.png'
];

// Random image pickers with shuffle algorithm
let thumbnailIndex = 0;
let shuffledThumbnails = [...thumbnailImages].sort(() => Math.random() - 0.5);

let avatarIndex = 0;
let shuffledAvatars = [...avatarImages].sort(() => Math.random() - 0.5);

let titleIndex = 0;
let shuffledTitles = [];

let variationIndex = 0;
let shuffledVariations = [];

let channelIndex = 0;
let shuffledChannels = [...channels].sort(() => Math.random() - 0.5);

function getRandomThumbnail() {
    if (thumbnailIndex >= shuffledThumbnails.length) {
        shuffledThumbnails = [...thumbnailImages].sort(() => Math.random() - 0.5);
        thumbnailIndex = 0;
    }
    return shuffledThumbnails[thumbnailIndex++];
}

function getRandomAvatar() {
    if (avatarIndex >= shuffledAvatars.length) {
        shuffledAvatars = [...avatarImages].sort(() => Math.random() - 0.5);
        avatarIndex = 0;
    }
    return shuffledAvatars[avatarIndex++];
}

function getRandomChannel() {
    if (channelIndex >= shuffledChannels.length) {
        shuffledChannels = [...channels].sort(() => Math.random() - 0.5);
        channelIndex = 0;
    }
    return shuffledChannels[channelIndex++];
}

// Random title generator - show all combinations before repeating
function getRandomTitle() {
    // Initialize shuffled arrays if empty
    if (shuffledTitles.length === 0) {
        shuffledTitles = [...baseTitles].sort(() => Math.random() - 0.5);
        titleIndex = 0;
    }
    if (shuffledVariations.length === 0) {
        shuffledVariations = [...titleVariations].sort(() => Math.random() - 0.5);
        variationIndex = 0;
    }
    
    const title = shuffledTitles[titleIndex];
    const variation = shuffledVariations[variationIndex];
    
    // Move to next variation
    variationIndex++;
    if (variationIndex >= shuffledVariations.length) {
        variationIndex = 0;
        shuffledVariations = [...titleVariations].sort(() => Math.random() - 0.5);
        
        // Move to next title
        titleIndex++;
        if (titleIndex >= shuffledTitles.length) {
            titleIndex = 0;
            shuffledTitles = [...baseTitles].sort(() => Math.random() - 0.5);
        }
    }
    
    return variation.replace('{title}', title);
}

// Random view count generator
function getRandomViews() {
    const views = Math.floor(Math.random() * 10) + 1;
    const decimals = (Math.random() * 9 + 1).toFixed(1);
    const unit = ['K', 'M'][Math.floor(Math.random() * 2)];
    return `${views}.${decimals.split('.')[1]}${unit}`;
}

// Random days ago generator
function getRandomDaysAgo() {
    const days = Math.floor(Math.random() * 365) + 1;
    
    if (days < 7) {
        if (days === 1) return '1 day ago';
        return `${days} days ago`;
    } else if (days < 30) {
        const weeks = Math.floor(days / 7);
        if (weeks === 1) return '1 week ago';
        return `${weeks} weeks ago`;
    } else if (days < 365) {
        const months = Math.floor(days / 30);
        if (months === 1) return '1 month ago';
        return `${months} months ago`;
    } else {
        const years = Math.floor(days / 365);
        if (years === 1) return '1 year ago';
        return `${years} years ago`;
    }
}

// Generate video items
for (let i = 0; i < 12; i++) {
    const item = document.createElement('div');
    item.className = 'video-item';
    
    item.innerHTML = `
        <div class="video-thumbnail-container">
            <img class="yt-img-shadow thumbnail-img" src="${getRandomThumbnail()}" alt="Video ${i}">
            <canvas class="yt-img-shadow video-canvas" width="${THUMBNAIL_WIDTH}" height="${THUMBNAIL_HEIGHT}"></canvas>
        </div>
        <div class="video-info">
            <img class="video-channel-avatar avatar-img" src="${getRandomAvatar()}" alt="Channel Avatar ${i}">
            <canvas class="video-channel-avatar channel-canvas" width="${CHANNEL_WIDTH}" height="${CHANNEL_HEIGHT}"></canvas>
            <div class="video-text">
                <div class="video-title">${getRandomTitle()}</div>
                <div class="video-channel">${getRandomChannel()}</div>
                <div class="video-meta">${getRandomViews()} views • ${getRandomDaysAgo()}</div>
            </div>
        </div>
    `;
    container.appendChild(item);
}

// Regenerate all content when playback completes
function regenerateContent() {
    console.log('🔄 Regenerating content...');
    
    // Clear existing content
    const videoItems = container.querySelectorAll('.video-item');
    
    videoItems.forEach((item, index) => {
        // Get new random values
        const newThumbnail = getRandomThumbnail();
        const newAvatar = getRandomAvatar();
        const newTitle = getRandomTitle();
        const newChannel = getRandomChannel();
        const newViews = getRandomViews();
        const newDaysAgo = getRandomDaysAgo();

        const thumbnailImg = item.querySelector('.thumbnail-img');
        if (thumbnailImg) thumbnailImg.src = newThumbnail;

        const avatarImg = item.querySelector('.avatar-img');
        if (avatarImg) avatarImg.src = newAvatar;
        
        // Update text content
        const titleEl = item.querySelector('.video-title');
        if (titleEl) titleEl.textContent = newTitle;
        
        const channelEl = item.querySelector('.video-channel');
        if (channelEl) channelEl.textContent = newChannel;
        
        const metaEl = item.querySelector('.video-meta');
        if (metaEl) metaEl.textContent = `${newViews} views • ${newDaysAgo}`;
    });
    
    console.log('✅ Content regenerated!');
}

// Set callback for when playback completes
window.onPlaybackComplete = regenerateContent;

// Create snow fall effect with avatar images
function createSnowFall() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    document.body.appendChild(snowContainer);
    
    // Create multiple snow flakes continuously
    function createSnowFlake() {
        const snowFlake = document.createElement('img');
        snowFlake.className = 'snow-flake';
        snowFlake.src = getRandomAvatar();
        
        const randomLeft = Math.random() * 100;
        const randomDuration = 5 + Math.random() * 5;
        
        snowFlake.style.left = randomLeft + '%';
        snowFlake.style.top = '-50px'; // Start above viewport
        snowFlake.style.animationDuration = randomDuration + 's';
        // No animation delay - start immediately
        
        snowContainer.appendChild(snowFlake);
        
        // Remove after animation completes
        setTimeout(() => snowFlake.remove(), (randomDuration + 2) * 1000);
    }
    
    // Create new snowflake every 300ms
    setInterval(createSnowFlake, 500);
}

// Start snowfall
createSnowFall();

const thumbnailCanvases = Array.from(document.querySelectorAll('.video-canvas'));
const avatarCanvases = Array.from(document.querySelectorAll('.channel-canvas'));
const thumbnailImgs = Array.from(document.querySelectorAll('.thumbnail-img'));
const avatarImgs = Array.from(document.querySelectorAll('.avatar-img'));

thumbnailCanvases.forEach((canvas) => {
    canvas.style.display = 'none';
});
avatarCanvases.forEach((canvas) => {
    canvas.style.display = 'none';
});

function renderVideoFrame() {
    if (!__isPlaying) return;
    if (videoElement.readyState < 2) {
        __rafId = requestAnimationFrame(renderVideoFrame);
        return;
    }

    const cellWidth = videoElement.videoWidth / VID_X;
    const cellHeight = videoElement.videoHeight / VID_Y;
    const channelWidth = cellWidth * (CHANNEL_WIDTH / BASE_CELL_WIDTH);
    const channelHeight = cellHeight * (CHANNEL_HEIGHT / BASE_CELL_HEIGHT);

    for (let j = 0; j < VID_Y; ++j) {
        for (let i = 0; i < VID_X; ++i) {
            const index = (j * VID_X) + i;
            const thumbCanvas = thumbnailCanvases[index];
            const avatarCanvas = avatarCanvases[index];
            const sx = i * cellWidth;
            const sy = j * cellHeight;

            if (thumbCanvas) {
                const ctx = thumbCanvas.getContext('2d');
                ctx.drawImage(
                    videoElement,
                    sx,
                    sy,
                    cellWidth,
                    cellHeight,
                    0,
                    0,
                    THUMBNAIL_WIDTH,
                    THUMBNAIL_HEIGHT
                );
            }

            if (avatarCanvas) {
                const avatarCtx = avatarCanvas.getContext('2d');
                avatarCtx.drawImage(
                    videoElement,
                    sx,
                    sy + (cellHeight - channelHeight),
                    channelWidth,
                    channelHeight,
                    0,
                    0,
                    CHANNEL_WIDTH,
                    CHANNEL_HEIGHT
                );
            }
        }
    }

    __rafId = requestAnimationFrame(renderVideoFrame);
}

function startVideoPlayback() {
    if (!__videoReady || __isPlaying) return;
    __isPlaying = true;
    thumbnailImgs.forEach((img) => {
        img.style.display = 'none';
    });
    avatarImgs.forEach((img) => {
        img.style.display = 'none';
    });
    thumbnailCanvases.forEach((canvas) => {
        canvas.style.display = 'block';
    });
    avatarCanvases.forEach((canvas) => {
        canvas.style.display = 'block';
    });
    videoElement.currentTime = 0;
    videoElement.play()
        .then(() => {
            __rafId = requestAnimationFrame(renderVideoFrame);
        })
        .catch(err => {
            __isPlaying = false;
            console.error('Video playback failed:', err);
        });
}

function stopVideoPlayback() {
    if (!__isPlaying) return;
    __isPlaying = false;
    videoElement.pause();
    videoElement.currentTime = 0;
    thumbnailCanvases.forEach((canvas) => {
        canvas.style.display = 'none';
    });
    avatarCanvases.forEach((canvas) => {
        canvas.style.display = 'none';
    });
    thumbnailImgs.forEach((img) => {
        img.style.display = 'block';
    });
    avatarImgs.forEach((img) => {
        img.style.display = 'block';
    });
    if (__rafId) {
        cancelAnimationFrame(__rafId);
        __rafId = null;
    }
}

window.startPlayback = startVideoPlayback;
window.stopPlayback = stopVideoPlayback;
window.resetPlayback = function() {
    stopVideoPlayback();
};

// Load play.js on demand and start playback when a thumbnail is clicked
function loadAndStartPlayer() {
    if (!__videoReady) {
        __pendingStart = true;
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
        return;
    }
    __pendingStart = false;
    startVideoPlayback();
}

// Delegate clicks on thumbnails to start player
container.addEventListener('click', (e) => {
    const thumb = e.target.closest('.video-thumbnail-container');
    if (!thumb) return;
    loadAndStartPlayer();
});

function precheckVideoOnLoad() {
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    if (loadingHint) loadingHint.textContent = 'Loading video';
    if (loadingProgress) loadingProgress.textContent = '0%';
}

videoElement.addEventListener('loadedmetadata', () => {
    __videoReady = true;
    if (loadingHint) loadingHint.textContent = 'Ready';
    if (loadingProgress) loadingProgress.textContent = '100%';
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
    if (__pendingStart) {
        loadAndStartPlayer();
    }
});

videoElement.addEventListener('error', () => {
    __videoReady = false;
    if (loadingHint) loadingHint.textContent = 'Video failed to load';
    console.error('Video failed to load:', videoElement.error);
});

videoElement.addEventListener('ended', () => {
    stopVideoPlayback();
    if (window.onPlaybackComplete) {
        window.onPlaybackComplete();
    }
});

precheckVideoOnLoad();


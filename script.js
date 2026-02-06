// Generate 12 mock video items (4x3 grid)
const container = document.getElementById('video-container');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingProgress = document.getElementById('loading-progress');
const loadingHint = document.getElementById('loading-hint');

const FRAME_COUNT = 2763;
const FRAME_CHECK_BATCH = 12;

const FILE_PATH = (() => {
    if (typeof window !== "undefined" && window.location && window.location.protocol !== "file:") {
        return window.location.origin;
    }
    return "file://" + "H:/Justforfun/skipedityoutubepage_main";
})();

const FRAMEPARTS_BASE_URL = (() => {
    if (typeof window !== "undefined" && window.location && window.location.protocol === "file:") {
        return FILE_PATH + "/frame_output_webp/frame_parts";
    }
    return "frame_output_webp/frame_parts";
})();

let __framesReady = false;
let __pendingStart = false;

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
            <img class="yt-img-shadow" src="${getRandomThumbnail()}" alt="Video ${i}">
        </div>
        <div class="video-info">
            <img class="video-channel-avatar" src="${getRandomAvatar()}" alt="Channel Avatar ${i}">
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
        
        // Update thumbnail
        const thumbnailImg = item.querySelector('.yt-img-shadow');
        if (thumbnailImg) thumbnailImg.src = newThumbnail;
        
        // Update avatar
        const avatarImg = item.querySelector('.video-channel-avatar');
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

// Load play.js on demand and start playback when a thumbnail is clicked
function loadAndStartPlayer() {
    if (!__framesReady) {
        __pendingStart = true;
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
        return;
    }
    __pendingStart = false;
    // If already loaded, reset frame and start
    if (window.startPlayback) {
        if (window.resetPlayback) window.resetPlayback();
        window.startPlayback();
        return;
    }

    // Inject script tag to load play.js from the same folder
    const s = document.createElement('script');
    s.src = 'play.js';
    s.onload = () => {
        if (window.resetPlayback) window.resetPlayback();
        if (window.startPlayback) window.startPlayback();
    };
    s.onerror = () => console.error('Failed to load play.js');
    document.head.appendChild(s);
}

// Delegate clicks on thumbnails to start player
container.addEventListener('click', (e) => {
    const thumb = e.target.closest('.video-thumbnail-container');
    if (!thumb) return;
    loadAndStartPlayer();
});

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image: ' + url));
        img.src = url;
    });
}

async function ensureAllFramesReady() {
    for (let start = 1; start <= FRAME_COUNT; start += FRAME_CHECK_BATCH) {
        const tasks = [];
        const end = Math.min(start + FRAME_CHECK_BATCH - 1, FRAME_COUNT);
        for (let frameIndex = start; frameIndex <= end; ++frameIndex) {
            const channel_path = FRAMEPARTS_BASE_URL + '/' + frameIndex + '/0,0channel.webp';
            const thumbnail_path = FRAMEPARTS_BASE_URL + '/' + frameIndex + '/0,0thumb.webp';
            tasks.push(loadImage(channel_path), loadImage(thumbnail_path));
        }
        await Promise.all(tasks);
        const progress = Math.floor((end / FRAME_COUNT) * 100);
        if (loadingProgress) loadingProgress.textContent = progress + '%';
    }
}

async function precheckFramesOnLoad() {
    if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    if (loadingHint) loadingHint.textContent = 'Checking frame files';

    try {
        await ensureAllFramesReady();
        __framesReady = true;
        if (loadingHint) loadingHint.textContent = 'Ready';
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
        if (__pendingStart) {
            loadAndStartPlayer();
        }
    } catch (err) {
        __framesReady = false;
        if (loadingHint) loadingHint.textContent = 'Missing frame files';
        console.error('Frame precheck failed:', err);
    }
}

precheckFramesOnLoad();


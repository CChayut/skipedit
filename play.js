const VID_X = 4;
const VID_Y = 3;

const VID_DIM = VID_X * VID_Y;

const FRAMERATE = 60;
const FRAME_INTERVAL = 1000 / FRAMERATE;

const FRAME_COUNT = 2763;

let frame = 0;

const thumbnailImgs = document.querySelectorAll(".video-thumbnail-container .yt-img-shadow");
const profileImgs = document.querySelectorAll(".video-channel-avatar");

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


// Audio element for playback
let audioElement = null;

// Initialize audio element
function initAudio() {
    if (!audioElement) {
        audioElement = new Audio(FILE_PATH + "/video_input/audio.mp3");
        audioElement.preload = "auto";
    }
}

// Playback control (exposed on window)
let __playInterval = null;
let __startTime = 0;
let __useAudioSync = true;

window.startPlayback = function() {
    if (__playInterval) return; // already running
    
    // Initialize and play audio
    initAudio();
    audioElement.currentTime = 0;
    update_frame();

    __startTime = performance.now();
    audioElement.play()
        .then(() => { __useAudioSync = true; })
        .catch(err => {
            __useAudioSync = false;
            console.error('Audio playback failed:', err);
        });

    __playInterval = requestAnimationFrame(playbackLoop);
};

window.stopPlayback = function() {
    if (!__playInterval) return;
    
    // Stop audio
    if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
    }
    
    cancelAnimationFrame(__playInterval);
    __playInterval = null;
};

function playbackLoop(currentTime) {
    const targetFrame = (__useAudioSync && audioElement && !audioElement.paused)
        ? Math.min(Math.floor(audioElement.currentTime * FRAMERATE), FRAME_COUNT - 1)
        : Math.min(Math.floor((currentTime - __startTime) / FRAME_INTERVAL), FRAME_COUNT - 1);

    if (targetFrame !== frame) {
        frame = targetFrame;
        update_frame();
    }

    if ((audioElement && audioElement.ended) || frame >= FRAME_COUNT - 1) {
        frame = 0;
        window.stopPlayback();
        if (window.onPlaybackComplete) {
            window.onPlaybackComplete();
        }
        return;
    }
    if (__playInterval) {
        __playInterval = requestAnimationFrame(playbackLoop);
    }
}

window.resetPlayback = function() {
    frame = 0;
};

function update_frame()
{
    for(let i = 0; i < VID_X; ++i)
    {
        for(let j = 0; j < VID_Y; ++j)
        {
            const channel_path =  FRAMEPARTS_BASE_URL + "/" + (frame + 1) + "/" + j + "," + i + "channel.webp";
            const thumbnail_path = FRAMEPARTS_BASE_URL + "/" + (frame + 1) + "/" + j + "," + i + "thumb.webp";
        
            const index = (j * VID_X) + i;
            
            if (thumbnailImgs[index]) {
                thumbnailImgs[index].src = thumbnail_path;
            }
            
            if (profileImgs[index]) {
                profileImgs[index].src = channel_path;
            }
        }
    }
}

function play_video()
{
    update_frame();
    ++frame;
    if(frame >= FRAME_COUNT)
    {
        frame = 0;
        window.stopPlayback();
        
        // Trigger callback to reset to still images
        if (window.onPlaybackComplete) {
            window.onPlaybackComplete();
        }
    }
}

// also expose current frame for external control
window.getPlaybackFrame = function() { return frame; };
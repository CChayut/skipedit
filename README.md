# Skip Edit on YouTube (Web Demo)
Canvas-based playback inside a YouTube-style 4x3 grid (static web demo).

## Overview
This is a static web page that slices a single MP4 into 12 tiles and plays them on canvas
elements. The UI is defined in [index.html](index.html) and [style.css](style.css), with
the behavior in [script.js](script.js).

## Quick Start (Local)
1. Put your video at [video_input/input_compressed.mp4](video_input/input_compressed.mp4)
2. Open [index.html](index.html) in a browser
3. Click any thumbnail to start playback

> If the video does not load from file://, serve the folder with a simple static server
> (any local HTTP server is fine) and open the page from http://.

## Customize Content
- Thumbnails: [image/thumbnail/](image/thumbnail/)
- Avatars: [image/icon/](image/icon/)
- Titles, channels, and meta text: edit arrays in [script.js](script.js)

## Playback Notes
- The grid is 4x3 (12 tiles) and expects 16:9 thumbnails
- Autoplay is blocked by browsers; playback starts on click
- After playback ends, the page regenerates titles and images

## Optional: Frame Generator (Legacy)
The Node script in [index.js](index.js) can extract and slice frames using ffmpeg and jimp.
This is not required for the current MP4-based playback, but kept for experimentation.

## Optional: play.js
[play.js](play.js) is a small shim that defines `startPlayback()`/`stopPlayback()` if they
are missing. It is not required when using [index.html](index.html).

## Disclaimer (Non-Commercial)
This project is for educational/personal demo purposes only and **is not intended for commercial use**.

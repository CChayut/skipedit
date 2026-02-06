# Skip Edit on YouTube (Web Demo)
Frame-based playback on a captured YouTube homepage (simple web demo)

## Overview
This is a static web demo that plays pre-rendered frames on a YouTube homepage layout.

## Hosting (GitHub Pages / Static Hosting)
1. Host the [youtubehomepage/](youtubehomepage/) folder as a static site (e.g., GitHub Pages)
2. Open the hosted page and open the DevTools Console
3. Copy the code from [play.js](play.js) into the Console and run `startPlayback()`
4. Click the YouTube frame area to start playback (if applicable)

> Note: GitHub Pages has no Node runtime. You must generate the frames beforehand.

## Generating Frames (first time / when changing video)
1. Put your input video in [video_input/](video_input/)
2. Update `input_video` in [config.json](config.json)
3. Install FFMPEG and Node.js
4. Run `npm i`
5. Run `node .` to generate frames

## Compressed Frames (WebP)
Use [frame_output_webp/](frame_output_webp/) for smaller file size.

## Limitations
- Requires a YouTube homepage layout with a 4x3 thumbnail grid
- Playback depends on machine/browser performance
- Do not minimize/collapse the window during playback; it may cause audio/video desync

## Disclaimer (Non-Commercial)
This project is for educational/personal demo purposes only and **is not intended for commercial use**.

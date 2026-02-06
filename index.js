// Libraries
const jimp = require("jimp");
const ffmpeg = require("ffmpeg");
const fs = require("fs");
const Jimp = require("jimp");
const lodash = require("lodash");
const path = require("path");

// Read Config Path
const CONFIG = JSON.parse(fs.readFileSync("config.json"))
const CONFIG_PATH = CONFIG.project_path;
const VIDEO_IN = CONFIG.input_video;

// Frame Intervals
const EVERY_N_FRAME_SET = 1;
const vid_x = 4;
const vid_y = 3;

const THUMBNAIL_WIDTH = 480;
const THUMBNAIL_HEIGHT = 360;

const CHANNEL_WIDTH = 40;
const CHANNEL_HEIGHT = 40;

const HORIZONTAL_MARGIN = 0;
const VERTICAL_MARGIN = 0;
const VERTICAL_MINOR = 0;

// Extract Video To JPG frames using direct ffmpeg command
const { exec } = require('child_process');

// Create output directory if it doesn't exist
if (!fs.existsSync(CONFIG_PATH + "/frame_output/whole_frames")) {
    fs.mkdirSync(CONFIG_PATH + "/frame_output/whole_frames", { recursive: true });
}

// Use ffmpeg command directly for best quality
const ffmpegCommand = `ffmpeg -i "video_input/${VIDEO_IN}" -vf "scale=1920:1080:flags=lanczos" -q:v 1 "${CONFIG_PATH}/frame_output/whole_frames/input_%d.jpg"`;

console.log('🎬 Extracting frames with ffmpeg...');
exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
        console.log('❌ Error extracting frames: ' + error.message);
        console.log('Make sure ffmpeg is installed and in PATH');
        return;
    }
    
    console.log('✅ Frame extraction completed!');
    
    // Get list of extracted frames
    fs.readdir(CONFIG_PATH + "/frame_output/whole_frames", (err, files) => {
        if (err) {
            console.log('Error reading frames: ' + err);
            return;
        }
        
        const frameFiles = files.filter(f => f.endsWith('.jpg')).sort((a, b) => {
            const numA = parseInt(a.match(/\d+/)[0]);
            const numB = parseInt(b.match(/\d+/)[0]);
            return numA - numB;
        });
        
        resized_frames(null, frameFiles);
    });
});

async function resized_frames(error, files)
{
    // Check for errors
    if (error) {
        console.log('Error extracting frames: ' + error);
        return;
    }

    // Check if files is null or undefined
    if (!files) {
        console.log('No files returned from frame extraction');
        return;
    }

    // Get Number of Frames
    let total_frames = files.length;

    // Resize Frames
    const PIXEL_WIDTH = THUMBNAIL_WIDTH * vid_x;
    const PIXEL_HEIGHT = THUMBNAIL_HEIGHT * vid_y;

    for(let i = 1; !(i > total_frames); ++i)
    {
        try {
            const in_path = CONFIG_PATH + "/frame_output/whole_frames/input_" + i + ".jpg";
            const out_path = CONFIG_PATH + "/frame_output/resized_frames/frame_" + i + ".jpg";
            
            // Check if file exists before reading
            if (!fs.existsSync(in_path)) {
                console.log(`⚠️ Frame ${i} not found, skipping...`);
                continue;
            }
            
            const img = await Jimp.read(in_path);

        // Resize with BEZIER for best quality
        img.resize(PIXEL_WIDTH, PIXEL_HEIGHT, Jimp.RESIZE_BEZIER);

        for(let j = 0; j < vid_x; ++j)
        {
            for(let k = 0; k < vid_y; ++k)
            {
                const sliced_out_path = CONFIG_PATH + "/frame_output/frame_parts/" + i + "";
                const thumb_path = sliced_out_path + "/" + k + "," + j + "thumb.png";
                const channel_path = sliced_out_path + "/" + k + "," + j +"channel.png";

                
                const timg = lodash.cloneDeep(img);
                const cimg = lodash.cloneDeep(img);
                timg.crop
                (
                    (j * THUMBNAIL_WIDTH),
                    (k * THUMBNAIL_HEIGHT),
                    THUMBNAIL_WIDTH,
                    THUMBNAIL_HEIGHT
                ).write(thumb_path);

                cimg.crop
                (
                    (j * THUMBNAIL_WIDTH),
                    (k * THUMBNAIL_HEIGHT) + (THUMBNAIL_HEIGHT - CHANNEL_HEIGHT),
                    CHANNEL_WIDTH,
                    CHANNEL_HEIGHT
                ).write(channel_path);
            }
        }
        } catch (err) {
            console.log(`❌ Error processing frame ${i}: ${err.message}`);
            continue;
        }
    }
    
    console.log('✅ Frame processing completed successfully!');
    console.log(`Total frames processed: ${total_frames}`);
    console.log('Ready to run play.js in the browser');
}
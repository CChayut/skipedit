(() => {
    if (window.__playbackShimInstalled) return;
    window.__playbackShimInstalled = true;

    if (!window.startPlayback) {
        window.startPlayback = function() {
            console.warn('startPlayback not ready: load script.js first.');
        };
    }

    if (!window.stopPlayback) {
        window.stopPlayback = function() {};
    }

    if (!window.resetPlayback) {
        window.resetPlayback = function() {
            if (typeof window.stopPlayback === 'function') {
                window.stopPlayback();
            }
        };
    }

    if (!window.getPlaybackFrame) {
        window.getPlaybackFrame = function() { return 0; };
    }
})();
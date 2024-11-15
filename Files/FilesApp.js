// ----------------------------------
// Emscripten things
// ----------------------------------

var progressTrack = document.getElementById('ptrack');

var Module = {
    print: (function () {
        var element = document.getElementById('output');
        if (element) element.value = ''; // clear browser cache
        return function (text) {
            if (arguments.length > 1) text = Array.prototype.slice.call(arguments).join(' ');

            console.log(text);
            if (element) {
                element.value += text + "\n";
                element.scrollTop = element.scrollHeight; // focus on bottom
            }
        };
    })(),
    setStatus: (text) => {
        if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
        if (text === Module.setStatus.last.text) return;
        var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
        var now = Date.now();
        if (m && now - Module.setStatus.last.time < 30) return; // if this is a progress update, skip it if too soon
        Module.setStatus.last.time = now;
        Module.setStatus.last.text = text;

        if (m) {
            text = m[1];
            var progressValue = parseInt(m[2]);
            var progressMax = parseInt(m[4]);

            Module.updateProgressBar(progressValue, progressMax);
        }
    },
    updateProgressBar: function (progressValue, progressMax) {
        var startTime = null;
        var initialWidth = parseFloat(progressTrack.style.width || '0');
        var targetWidth = (progressValue / progressMax) * 100;

        function animate(time) {
            if (!startTime) startTime = time;
            var progress = (time - startTime) / 300;
            if (progress >= 1) {
                progressTrack.style.width = targetWidth + '%';
            } else {

                var newWidth = initialWidth + (targetWidth - initialWidth) * progress;
                progressTrack.style.width = newWidth + '%';
                requestAnimationFrame(animate);
            }
        }
        requestAnimationFrame(animate);
    },
    totalDependencies: 0,
    monitorRunDependencies: (left) => {
        this.totalDependencies = Math.max(this.totalDependencies, left);
        Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies - left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
    }
};
Module.setStatus('Loading');
window.onerror = () => {
    progressTrack.style.width = "100%";
    progressTrack.style.backgroundColor = "var(--fds-system-critical)";
    Module.setStatus('Exception thrown, see JavaScript console');

    Module.setStatus = (text) => {
        if (text) console.error('[post-exception status] ' + text);
    };
};


let FS_Path = "/FileSystem";
const app_splashscreen = document.getElementById("application-splash");

Module['onRuntimeInitialized'] = function () {
    app_splashscreen.style.opacity = 0;

    setTimeout(() => {
        app_splashscreen.remove();
    }, 83);


    FS.mkdir('/FileSystem');
    FS.mkdir('/FileSystem/RSDKv2');

    FS_IndexedDB_Save('/FileSystem', null, true);
    FS_IndexedDB_Save('/FileSystem/RSDKv2', null, true);
    FS_IndexedDB_Load();

    FS_ChangeDirectory(FS_Path);
    FS_ChangeDirectory(FS_Path);
};


function uploadFile() {

}

function createDirectory() {

}

function FS_NavUp() {

}

function FS_ChangeDirectory(newDirPath) {

}

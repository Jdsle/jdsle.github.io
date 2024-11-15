function FS_IndexedDB_Save(path, data, isDirectory) {
    const RSDKvFS = indexedDB.open('RSDKvFS', 1);

    RSDKvFS.onupgradeneeded = function (event) {
        event.target.result.createObjectStore('files');
    };

    RSDKvFS.onsuccess = function (event) {
        const transaction = event.target.result.transaction(['files'], 'readwrite');
        const objectStore = transaction.objectStore('files');

        if (isDirectory) {
            const directory = { type: 'directory', content: {} };
            objectStore.put(directory, path);
        } else {
            objectStore.put(Array.from(data), path);
        }
    };

    RSDKvFS.onerror = function (event) {
        console.error('Error opening database:', event.target.error);
    }
}

function FS_IndexedDB_Load() {
    const RSDKvFS = indexedDB.open('RSDKvFS', 1);

    // Just incase?
    RSDKvFS.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore('files');
    };

    RSDKvFS.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(['files'], 'readonly');
        const objectStore = transaction.objectStore('files');

        objectStore.openCursor().onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
                const path = cursor.key;
                const fileData = cursor.value;
                const isDirectory = fileData.type === 'directory';

                if (isDirectory) {
                    FS.mkdir(path);
                } else {
                    FS.writeFile(path, new Uint8Array(fileData));
                }

                cursor.continue();
            }
        };
    };

    RSDKvFS.onerror = function (event) {
        console.error('Error opening database:', event.target.error);
    }
}

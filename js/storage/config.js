/**
 * Storage Configuration
 * Switch between different storage backends here
 * 
 * USAGE:
 * Change STORAGE_TYPE to switch backends:
 * - 'localStorage' : Browser localStorage (default, no setup needed)
 * - 'firebase'     : Firebase Realtime Database (requires Firebase setup)
 * 
 * SWITCHING BACKENDS:
 * 1. Change STORAGE_TYPE below
 * 2. If using Firebase, uncomment Firebase scripts in HTML files
 * 3. Configure Firebase in js/firebase-config.js
 * 4. Refresh the app
 */

// ============================================
// CHANGE THIS LINE TO SWITCH STORAGE BACKEND
// You can also override at runtime via URL, e.g.:
//   ?storage=localStorage   or   ?storage=firebase
// ============================================
const DEFAULT_STORAGE_TYPE = 'firebase';  // Options: 'localStorage', 'firebase'

// Runtime override helper
function getStorageTypeFromURL() {
    try {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const value = params.get('storage');
            if (value === 'localStorage' || value === 'firebase') {
                console.log(`🔧 Storage override detected via URL: ${value}`);
                return value;
            }
        }
    } catch (e) {
        // ignore
    }
    return null;
}

const STORAGE_TYPE = getStorageTypeFromURL() || DEFAULT_STORAGE_TYPE;
// ============================================

/**
 * Storage Factory
 * Creates and returns the appropriate storage adapter
 */
class StorageFactory {
    static async createStorage() {
        let adapter;

        switch (STORAGE_TYPE) {
            case 'firebase':
                console.log('🔧 Using Firebase storage adapter');
                adapter = new FirebaseAdapter();
                break;

            case 'localStorage':
            default:
                console.log('🔧 Using LocalStorage adapter');
                adapter = new LocalStorageAdapter();
                break;
        }

        // Initialize the adapter
        const initialized = await adapter.init();
        
        if (!initialized) {
            console.warn(`⚠️ ${adapter.getName()} initialization failed, falling back to LocalStorage`);
            adapter = new LocalStorageAdapter();
            await adapter.init();
        }

        console.log(`✅ Storage adapter ready: ${adapter.getName()}`);
        return adapter;
    }

    /**
     * Get current storage type
     * @returns {string}
     */
    static getStorageType() {
        return STORAGE_TYPE;
    }

    /**
     * Check if using cloud storage
     * @returns {boolean}
     */
    static isCloudStorage() {
        return STORAGE_TYPE === 'firebase';
    }
}


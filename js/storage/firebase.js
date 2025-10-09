/**
 * Firebase Realtime Database Adapter
 * Uses Firebase for cloud data persistence
 * Data syncs across all devices in real-time
 * 
 * SETUP REQUIRED:
 * 1. Create Firebase project at https://firebase.google.com
 * 2. Enable Realtime Database
 * 3. Update firebaseConfig in js/firebase-config.js
 * 4. Switch to this adapter in js/storage-config.js
 */

class FirebaseAdapter extends StorageAdapter {
    constructor() {
        super();
        this.db = null;
        this.ready = false;
    }

    /**
     * Initialize Firebase adapter
     */
    async init() {
        try {
            // Check if Firebase is loaded
            if (typeof firebase === 'undefined') {
                console.error('❌ Firebase SDK not loaded. Include Firebase scripts in your HTML.');
                return false;
            }

            // Check if Firebase config exists
            if (typeof firebaseConfig === 'undefined') {
                console.error('❌ Firebase config not found. Update js/firebase-config.js');
                return false;
            }

            // Initialize Firebase
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            // Get database reference
            this.db = firebase.database();
            this.ready = true;

            console.log('✅ Firebase adapter initialized');
            console.log('🔄 Real-time sync enabled');
            return true;

        } catch (error) {
            console.error('❌ Firebase initialization failed:', error);
            this.ready = false;
            return false;
        }
    }

    /**
     * Get data from Firebase
     * @param {string} key - The key to retrieve
     * @returns {Promise<any>} The data or null
     */
    async get(key) {
        try {
            if (!this.ready) {
                throw new Error('Firebase adapter not initialized');
            }

            const snapshot = await this.db.ref(key).once('value');
            return snapshot.val() || null;

        } catch (error) {
            console.error(`Error getting ${key} from Firebase:`, error);
            return null;
        }
    }

    /**
     * Set data in Firebase
     * @param {string} key - The key to store data under
     * @param {any} data - The data to store
     * @returns {Promise<void>}
     */
    async set(key, data) {
        try {
            if (!this.ready) {
                throw new Error('Firebase adapter not initialized');
            }

            await this.db.ref(key).set(data);

        } catch (error) {
            console.error(`Error setting ${key} in Firebase:`, error);
            throw error;
        }
    }

    /**
     * Delete data from Firebase
     * @param {string} key - The key to delete
     * @returns {Promise<void>}
     */
    async delete(key) {
        try {
            if (!this.ready) {
                throw new Error('Firebase adapter not initialized');
            }

            await this.db.ref(key).remove();

        } catch (error) {
            console.error(`Error deleting ${key} from Firebase:`, error);
            throw error;
        }
    }

    /**
     * Clear all Firebase data
     * WARNING: This will delete ALL data in your Firebase database!
     * @returns {Promise<void>}
     */
    async clear() {
        try {
            if (!this.ready) {
                throw new Error('Firebase adapter not initialized');
            }

            // Clear all main data nodes
            const clearPromises = [
                this.db.ref('students').remove(),
                this.db.ref('tasks').remove(),
                this.db.ref('messages').remove(),
                this.db.ref('quizzes').remove(),
                this.db.ref('quizResults').remove()
            ];

            await Promise.all(clearPromises);
            console.log('⚠️ All Firebase data cleared');

        } catch (error) {
            console.error('Error clearing Firebase:', error);
            throw error;
        }
    }

    /**
     * Check if Firebase is ready
     * @returns {boolean}
     */
    isReady() {
        return this.ready;
    }

    /**
     * Get adapter name
     * @returns {string}
     */
    getName() {
        return 'Firebase';
    }

    /**
     * Listen for real-time updates
     * @param {string} key - The key to listen to
     * @param {Function} callback - Callback function when data changes
     * @returns {Function} Unsubscribe function
     */
    onValue(key, callback) {
        if (!this.ready) {
            console.error('Firebase adapter not initialized');
            return () => {};
        }

        const ref = this.db.ref(key);
        ref.on('value', (snapshot) => {
            callback(snapshot.val());
        });

        // Return unsubscribe function
        return () => ref.off('value');
    }

    /**
     * Migrate data from localStorage to Firebase
     * Useful for initial setup
     * @returns {Promise<void>}
     */
    async migrateFromLocalStorage() {
        try {
            console.log('🔄 Migrating data from localStorage to Firebase...');

            const keys = ['students', 'tasks', 'messages', 'quizzes', 'quizResults'];
            
            for (const key of keys) {
                const data = localStorage.getItem(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    await this.set(key, parsed);
                    console.log(`✅ Migrated ${key}: ${Array.isArray(parsed) ? parsed.length : 'N/A'} items`);
                }
            }

            console.log('✅ Migration complete!');

        } catch (error) {
            console.error('❌ Migration failed:', error);
            throw error;
        }
    }
}


# Create New Firebase Project & Move Your App

## Step 1: Create the project (in browser)

The Firebase Console should have opened. If not, go to:  
**https://console.firebase.google.com/project/create**

1. Enter a **project name** (e.g. `waqf-app` or `waqf-taskmanager`)
2. Turn **Google Analytics** off if you don't need it
3. Click **Create project** → wait for setup
4. Click **Continue**

---

## Step 2: Enable Firestore

1. Left sidebar → **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for now)
4. Pick a location (e.g. **asia-south1**)
5. Click **Enable**

---

## Step 3: Enable Hosting

1. Left sidebar → **Build** → **Hosting**
2. Click **Get started**
3. Follow the steps, then click **Continue to console**

---

## Step 4: Register web app and get config

1. Click **Project Overview** → **</>** (Web)
2. App nickname: `waqf-web`
3. Click **Register app**
4. Copy the config object and keep it for Step 6

---

## Step 5: Switch your CLI to the new project

In your terminal (in the project folder):

```bash
firebase use --add
```

- Select your **new project** from the list
- When asked for an alias, press Enter (use `default`)

---

## Step 6: Update Firebase config in your app

1. Open `js/storage/firebase-config.js`
2. Replace the whole `firebaseConfig` object with the one you copied in Step 4
3. Save the file

---

## Step 7: Deploy

```bash
firebase deploy --only hosting
firebase deploy --only firestore
```

Your app will be live at:  
`https://<your-new-project-id>.web.app`

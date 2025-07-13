# Firebase Setup Guide

## Firestore Security Rules

You need to set up Firestore security rules in your Firebase Console. Go to Firestore Database > Rules and add the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Users can only read/write their own rooms
    match /rooms/{roomId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }

    // Users can only read/write their own boxes
    match /boxes/{boxId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## Collections Structure

The app will automatically create the following collections:

### users

- Document ID: User UID
- Fields:
  - uid: string
  - email: string
  - displayName: string
  - address: string
  - rooms: array
  - createdAt: timestamp
  - updatedAt: timestamp

### rooms

- Document ID: Auto-generated
- Fields:
  - userId: string (User UID)
  - name: string
  - description: string
  - boxCount: number
  - createdAt: timestamp
  - updatedAt: timestamp

### boxes (for future use)

- Document ID: Auto-generated
- Fields:
  - userId: string (User UID)
  - roomId: string
  - boxNumber: string
  - description: string
  - items: array
  - imageUrl: string
  - createdAt: timestamp
  - updatedAt: timestamp

## Setup Steps

1. Go to Firebase Console
2. Select your project
3. Go to Firestore Database
4. Click "Create database"
5. Choose "Start in test mode" (for development)
6. Select a location
7. Go to Rules tab and paste the security rules above
8. Publish the rules

## Testing

After setup, new users will be redirected to the startup page where they can:

- Add their address
- Add multiple rooms with names and descriptions
- Complete their profile setup

Once the profile is created, users will be redirected to the dashboard.

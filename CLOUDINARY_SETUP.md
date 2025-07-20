# Cloudinary Setup Guide

This guide will help you set up Cloudinary for image uploads in your Gripen Storage app, replacing Firebase Storage for more cost-effective image management.

## Why Cloudinary?

- **Cost-effective**: More generous free tier compared to Firebase Storage
- **Image optimization**: Automatic resizing, compression, and format conversion
- **CDN**: Global content delivery network for faster image loading
- **Advanced features**: Transformations, overlays, and effects
- **Better performance**: Optimized images reduce bandwidth usage
- **Browser-compatible**: Uses fetch API for client-side uploads

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [Cloudinary Console](https://cloudinary.com/console)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your Cloudinary Credentials

After logging in to your Cloudinary dashboard:

1. **Cloud Name**: Found in the dashboard header (e.g., `my-cloud-name`)
2. **API Key**: Go to Settings > Access Keys
3. **API Secret**: Also found in Settings > Access Keys
4. **Upload Preset**: Go to Settings > Upload > Upload presets

### 3. Create Upload Preset

1. In Cloudinary Console, go to **Settings** > **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Set the following:
   - **Preset name**: `gripen_storage`
   - **Signing Mode**: `Unsigned` (for client-side uploads)
   - **Folder**: `gripen-storage` (optional)
5. Click **Save**

### 4. Configure Environment Variables

1. Copy your `.env.example` to `.env`:

   ```bash
   cp env.example .env
   ```

2. Update your `.env` file with your Cloudinary credentials:

   ```env
   # Existing Firebase config...
   REACT_APP_FIREBASE_API_KEY=your-api-key-here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

   # Cloudinary Configuration (for image uploads)
   REACT_APP_CLOUDINARY_CLOUD_NAME=your-cloud-name
   REACT_APP_CLOUDINARY_API_KEY=your-api-key
   REACT_APP_CLOUDINARY_API_SECRET=your-api-secret
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=gripen_storage
   ```

### 5. No Additional Dependencies Required

The app uses the browser's built-in `fetch` API for uploads, so no additional packages are needed.

## How It Works

### Image Upload Process

1. **Client-side upload**: Images are uploaded directly from the browser to Cloudinary using fetch API
2. **Secure**: Uses unsigned uploads with preset restrictions
3. **Organized**: Images are stored in user-specific folders
4. **Optimized**: Cloudinary automatically optimizes images for web delivery

### File Structure

Images are organized in Cloudinary as:

```
gripen-storage/
├── box-images/
│   └── {user-uid}/
│       ├── box-image-1.jpg
│       ├── box-image-2.png
│       └── ...
```

### Image Optimization

The service includes automatic optimization:

- **Format**: Automatic WebP conversion for supported browsers
- **Quality**: Optimized compression (80% by default)
- **Size**: Responsive sizing available
- **CDN**: Global delivery network

## Usage Examples

### Basic Upload

```typescript
import { uploadImage } from "../services/cloudinaryService";

const handleUpload = async (file: File) => {
  try {
    const result = await uploadImage(file, "box-images/user123");
    console.log("Uploaded URL:", result.url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Optimized Image Display

```typescript
import { getOptimizedImageUrl } from "../services/cloudinaryService";

const optimizedUrl = getOptimizedImageUrl(imageUrl, {
  width: 300,
  height: 200,
  quality: 85,
  format: "webp",
});
```

## Security Considerations

1. **Upload Preset**: Configured for unsigned uploads with restrictions
2. **Folder Structure**: User-specific folders prevent cross-user access
3. **File Types**: Only image files are accepted
4. **Size Limits**: Cloudinary handles large files efficiently
5. **Client-side**: Uses browser fetch API, no server-side dependencies

## Cost Comparison

### Firebase Storage (Free Tier)

- 5GB storage
- 1GB/day download
- Additional usage: $0.026/GB storage, $0.15/GB download

### Cloudinary (Free Tier)

- 25GB storage
- 25GB/month bandwidth
- 25,000 transformations/month
- Additional usage: $0.04/GB storage, $0.04/GB bandwidth

## Migration from Firebase Storage

If you have existing images in Firebase Storage:

1. **Export**: Download images from Firebase Storage
2. **Upload**: Use the Cloudinary service to re-upload
3. **Update URLs**: Update database records with new Cloudinary URLs
4. **Cleanup**: Remove old Firebase Storage files

## Troubleshooting

### Common Issues

1. **Upload fails**: Check your upload preset configuration
2. **CORS errors**: Ensure Cloudinary domain is allowed
3. **Large files**: Cloudinary handles files up to 100MB
4. **Authentication**: Verify API credentials in environment variables

### Error Messages

- `"Upload preset not found"`: Check preset name in environment variables
- `"Invalid cloud name"`: Verify cloud name in Cloudinary dashboard
- `"File too large"`: Check file size (max 100MB for free tier)

## Support

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload API Reference](https://cloudinary.com/documentation/upload_images)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

## Next Steps

After setup:

1. Test image uploads in your app
2. Monitor Cloudinary usage in the dashboard
3. Configure additional transformations if needed
4. Set up backup and monitoring

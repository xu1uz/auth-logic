# Video Management System

This folder contains the video management functionality for courses.

## Files:

- `index.js` - Main video management utilities (read/write video names to JSON file)
- `videos-list.json` - JSON file that stores all video metadata

## Usage:

```javascript
const videoUtils = require('./videos.js');

// Get all video names
const allVideos = videoUtils.getAllVideoNames();

// Add a video name
const video = {
  id: '123',
  title: 'Introduction',
  videoFile: 'intro.mp4',
  course: 'courseId'
};
videoUtils.addVideoName(video);

// Get videos by course
const courseVideos = videoUtils.getVideosByCourse('courseId');

// Delete video from list
videoUtils.deleteVideoName('videoId');
```

## API Endpoints:

### Create Course (POST)

```
POST /api/v2/courses/addCourse
Headers: Authorization: Bearer <token>
Body: {
  "title": "Course Name",
  "description": "Description",
  "price": 100
}
```

### Get All Courses (GET)

```
GET /api/v2/courses
```

### Get Course with Videos (GET)

```
GET /api/v2/courses/:id
```

### Add Video to Course (POST)

```
POST /api/v2/courses/:courseId/videos
Headers: Authorization: Bearer <token>
Body: {
  "title": "Lesson 1",
  "videoFile": "lesson1.mp4",
  "duration": 30,
  "description": "Introduction video"
}
```

### Get All Videos for Course (GET)

```
GET /api/v2/courses/:courseId/videos
```

### Get Specific Video (GET)

```
GET /api/v2/courses/:courseId/videos/:id
```

### Update Video (PATCH)

```
PATCH /api/v2/courses/:courseId/videos/:id
Headers: Authorization: Bearer <token>
Body: {
  "title": "Updated Title",
  "duration": 45
}
```

### Delete Video (DELETE)

```
DELETE /api/v2/courses/:courseId/videos/:id
Headers: Authorization: Bearer <token>
```

## Example: Add 20 Videos to a Course

```javascript
const videoController = require('./controllers/videoController');

const videosData = [
  { title: 'Lesson 1', videoFile: 'lesson1.mp4', duration: 25 },
  { title: 'Lesson 2', videoFile: 'lesson2.mp4', duration: 30 },
  { title: 'Lesson 3', videoFile: 'lesson3.mp4', duration: 28 }
  // ... add more videos (up to 20)
];
```

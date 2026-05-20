const fs = require('fs');
const path = require('path');

const videosFilePath = path.join(__dirname, 'videos-list.json');

// ვიდეოების JSON ფაილის ინიციალიზაცია
const initializeVideosFile = () => {
  if (!fs.existsSync(videosFilePath)) {
    fs.writeFileSync(videosFilePath, JSON.stringify([], null, 2));
  }
};

// ყველა ვიდეოს ნამების წაკითხვა
const getAllVideoNames = () => {
  initializeVideosFile();
  const data = fs.readFileSync(videosFilePath, 'utf8');
  return JSON.parse(data);
};

// ვიდეოს დამატება ლისტში
const addVideoName = videoData => {
  const videos = getAllVideoNames();
  const newVideo = {
    id: videoData.id,
    title: videoData.title,
    videoFile: videoData.videoFile,
    course: videoData.course,
    createdAt: new Date().toISOString()
  };
  videos.push(newVideo);
  fs.writeFileSync(videosFilePath, JSON.stringify(videos, null, 2));
  return newVideo;
};

// ვიდეოს წაშლა ლისტიდან
const deleteVideoName = videoId => {
  const videos = getAllVideoNames();
  const filtered = videos.filter(v => v.id !== videoId);
  fs.writeFileSync(videosFilePath, JSON.stringify(filtered, null, 2));
};

// ვიდეოს ის კურსით
const getVideosByCourse = courseId => {
  const videos = getAllVideoNames();
  return videos.filter(v => v.course === courseId);
};

module.exports = {
  getAllVideoNames,
  addVideoName,
  deleteVideoName,
  getVideosByCourse,
  initializeVideosFile
};

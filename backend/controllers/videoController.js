const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/videos.json');

// In-memory data store for state persistence during runtime
let videos = [];
try {
  const rawData = fs.readFileSync(dataFilePath, 'utf8');
  videos = JSON.parse(rawData);
} catch (err) {
  console.error('Error reading initial videos.json file:', err);
  videos = [];
}

// In-memory tracking set for duplicate likes: format `${userId}:${videoId}`
const userLikes = new Set();

/**
 * GET /videos
 * Retrieves all video records
 */
const getVideos = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      count: videos.length,
      videos: videos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching videos'
    });
  }
};

/**
 * POST /like
 * Body: { videoId: "1", userId: "user123" }
 */
const likeVideo = (req, res) => {
  try {
    const { videoId, userId } = req.body;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'videoId is required'
      });
    }

    const video = videos.find(v => String(v.id) === String(videoId));

    if (!video) {
      return res.status(404).json({
        success: false,
        message: `Video with ID ${videoId} not found`
      });
    }

    const effectiveUser = userId || req.headers['x-forwarded-for'] || req.ip || 'anonymous_user';
    const likeKey = `${effectiveUser}:${videoId}`;

    // Prevent duplicate likes from the same user/identifier
    if (userLikes.has(likeKey)) {
      return res.status(200).json({
        success: true,
        videoId: String(video.id),
        likes: video.likes,
        alreadyLiked: true,
        message: 'User already liked this video'
      });
    }

    userLikes.add(likeKey);
    video.likes += 1;

    return res.status(200).json({
      success: true,
      videoId: String(video.id),
      likes: video.likes,
      alreadyLiked: false
    });
  } catch (error) {
    console.error('Error liking video:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while processing like'
    });
  }
};

/**
 * POST /share
 * Body: { videoId: "1", platform: "copy" }
 */
const shareVideo = (req, res) => {
  try {
    const { videoId, platform } = req.body;

    if (!videoId) {
      return res.status(400).json({
        success: false,
        message: 'videoId is required'
      });
    }

    const video = videos.find(v => String(v.id) === String(videoId));

    if (!video) {
      return res.status(404).json({
        success: false,
        message: `Video with ID ${videoId} not found`
      });
    }

    video.shares += 1;

    return res.status(200).json({
      success: true,
      videoId: String(video.id),
      shares: video.shares,
      platform: platform || 'copy'
    });
  } catch (error) {
    console.error('Error sharing video:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while processing share'
    });
  }
};

module.exports = {
  getVideos,
  likeVideo,
  shareVideo
};

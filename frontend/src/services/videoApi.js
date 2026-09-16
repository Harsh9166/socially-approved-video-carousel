import axios from 'axios';

// Get base URL from env or fallback to localhost:5000/api
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Generate persistent user ID for like tracking in session
const getUserId = () => {
  let userId = localStorage.getItem('socially_approved_user_id');
  if (!userId) {
    userId = 'usr_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('socially_approved_user_id', userId);
  }
  return userId;
};

export const fetchVideos = async () => {
  try {
    const response = await api.get('/videos');
    if (response.data && response.data.videos) {
      return response.data.videos;
    }
    return [];
  } catch (error) {
    // If /api/videos failed, attempt direct root fallback
    try {
      const fallbackUrl = BASE_URL.replace('/api', '');
      const response = await axios.get(`${fallbackUrl}/videos`);
      return response.data.videos || [];
    } catch (fallbackError) {
      console.error('Failed to fetch videos from API:', error);
      throw error;
    }
  }
};

export const likeVideo = async (videoId) => {
  const userId = getUserId();
  try {
    const response = await api.post('/like', { videoId: String(videoId), userId });
    return response.data;
  } catch (error) {
    console.error(`Error liking video ${videoId}:`, error);
    throw error;
  }
};

export const shareVideo = async (videoId, platform = 'copy') => {
  try {
    const response = await api.post('/share', { videoId: String(videoId), platform });
    return response.data;
  } catch (error) {
    console.error(`Error sharing video ${videoId}:`, error);
    throw error;
  }
};

export default {
  fetchVideos,
  likeVideo,
  shareVideo,
};

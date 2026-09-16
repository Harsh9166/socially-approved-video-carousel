import axios from 'axios';

// Get base URL from env or fallback to localhost:5000/api
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60 seconds timeout to accommodate Render free tier cold-start wakeups
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

export const fetchVideos = async (retries = 2) => {
  try {
    const response = await api.get('/videos');
    if (response.data && response.data.videos) {
      return response.data.videos;
    }
    return [];
  } catch (error) {
    // Retry automatically if Render backend was waking up from cold sleep
    if (retries > 0) {
      console.warn(`API call failed/timed out. Retrying (${retries} attempts left)...`);
      await new Promise(res => setTimeout(res, 2000));
      return fetchVideos(retries - 1);
    }

    // Fallback attempt to root domain if /api is omitted
    try {
      const fallbackUrl = BASE_URL.replace('/api', '');
      const response = await axios.get(`${fallbackUrl}/videos`, { timeout: 30000 });
      return response.data.videos || [];
    } catch (fallbackError) {
      console.error('Failed to fetch videos from API after retries:', error);
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

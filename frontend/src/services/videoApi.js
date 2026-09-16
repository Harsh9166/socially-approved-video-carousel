import axios from 'axios';

// Render live URL with unique suffix fallback
const LIVE_RENDER_URL = 'https://socially-approved-video-carousel-oky4.onrender.com/api';

// Get base URL from env or fallback to live Render URL / localhost
let BASE_URL = import.meta.env.VITE_API_URL || LIVE_RENDER_URL;

// Fix missing -oky4 suffix if old environment variable was passed
if (BASE_URL.includes('socially-approved-video-carousel.onrender.com') && !BASE_URL.includes('-oky4')) {
  BASE_URL = BASE_URL.replace('socially-approved-video-carousel.onrender.com', 'socially-approved-video-carousel-oky4.onrender.com');
}

// Trim trailing slash if present
if (BASE_URL.endsWith('/')) {
  BASE_URL = BASE_URL.slice(0, -1);
}

// Ensure /api path is present if pointing to live domain without /api
if (!BASE_URL.includes('/api') && !BASE_URL.includes('localhost')) {
  BASE_URL = `${BASE_URL}/api`;
}

console.log('🔗 Video API Base URL:', BASE_URL);

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // 60s timeout for cloud container cold starts
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
    if (retries > 0) {
      console.warn(`API call failed/timed out. Retrying (${retries} attempts left)...`);
      await new Promise(res => setTimeout(res, 2000));
      return fetchVideos(retries - 1);
    }

    // Direct fetch fallback to LIVE_RENDER_URL
    try {
      const response = await axios.get(`${LIVE_RENDER_URL}/videos`, { timeout: 30000 });
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
    // Direct fallback
    try {
      const response = await axios.post(`${LIVE_RENDER_URL}/like`, { videoId: String(videoId), userId });
      return response.data;
    } catch (fbErr) {
      throw error;
    }
  }
};

export const shareVideo = async (videoId, platform = 'copy') => {
  try {
    const response = await api.post('/share', { videoId: String(videoId), platform });
    return response.data;
  } catch (error) {
    console.error(`Error sharing video ${videoId}:`, error);
    // Direct fallback
    try {
      const response = await axios.post(`${LIVE_RENDER_URL}/share`, { videoId: String(videoId), platform });
      return response.data;
    } catch (fbErr) {
      throw error;
    }
  }
};

export default {
  fetchVideos,
  likeVideo,
  shareVideo,
};

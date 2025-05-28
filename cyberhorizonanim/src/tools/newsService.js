/* eslint-disable no-undef */
import axios from 'axios';

// API base URL configuration
//const API_URL = 'http://localhost:5000/api';
const API_URL = import.meta.env.VITE_API_URL;;

// Create axios instance with default configuration
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor to add auth info (simplified since no JWT tokens)
apiClient.interceptors.request.use(
    (config) => {
        // Since we're not using JWT tokens, we can pass user info if needed
        const user = localStorage.getItem('user');
        if (user) {
            config.headers['X-User-Info'] = user;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Unauthorized - clear user data
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
            // Redirect to login page if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Authentication services
export const authService = {
    login: async (username, password) => {
        try {
            const response = await apiClient.post('/auth/login', { username, password });
            if (response.data.success && response.data.user) {
                // Store user info and authentication status
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('isAuthenticated', 'true');
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        window.location.href = '/login';
    },

    isAuthenticated: () => {
        return localStorage.getItem('isAuthenticated') === 'true' && localStorage.getItem('user');
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
};

// News services
export const getNews = async (category = null, limit = null) => {
    try {
        let url = '/news';

        if (category && category !== 'all') {
            url = `/news/category/${category}`;
        }

        const response = await apiClient.get(url);
        let news = response.data;

        // Apply limit if specified
        if (limit && Array.isArray(news)) {
            news = news.slice(0, limit);
        }

        return news;
    } catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
};

export const getNewsById = async (id) => {
    try {
        // Since server doesn't have individual news endpoint, get all and filter
        const allNews = await apiClient.get('/news');
        const news = allNews.data.find(item => item.id === parseInt(id));
        if (!news) {
            throw new Error('News article not found');
        }
        return news;
    } catch (error) {
        console.error(`Error fetching news with id ${id}:`, error);
        throw error;
    }
};

export const getLatestNews = async (limit = 5) => {
    return getNews(null, limit);
};

export const getNewsByCategory = async (category, limit = null) => {
    return getNews(category, limit);
};

export const getFeaturedNews = async () => {
    try {
        const response = await apiClient.get('/news/featured');
        return response.data;
    } catch (error) {
        console.error('Error fetching featured news:', error);
        throw error;
    }
};

export const getHighlightNews = async () => {
    try {
        const response = await apiClient.get('/news/highlights');
        return response.data;
    } catch (error) {
        console.error('Error fetching highlight news:', error);
        throw error;
    }
};

export const createNews = async (newsData) => {
    try {
        const response = await apiClient.post('/news', newsData);
        return response.data;
    } catch (error) {
        console.error('Error creating news:', error);
        throw error;
    }
};

export const updateNews = async (id, newsData) => {
    try {
        const response = await apiClient.put(`/news/${id}`, newsData);
        return response.data;
    } catch (error) {
        console.error(`Error updating news with id ${id}:`, error);
        throw error;
    }
};

export const deleteNews = async (id) => {
    try {
        const response = await apiClient.delete(`/news/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting news with id ${id}:`, error);
        throw error;
    }
};

// Health check service (basic implementation since server doesn't have this endpoint)
export const checkServerHealth = async () => {
    try {
        const response = await apiClient.get('/news');
        return { status: 'online', message: 'Server is running' };
    } catch (error) {
        console.error('Server health check failed:', error);
        throw error;
    }
};

// Image utility functions
export const convertImageBufferToUrl = (imageBuffer) => {
    if (!imageBuffer || !imageBuffer.data) {
        return null;
    }

    try {
        const base64Image = btoa(
            new Uint8Array(imageBuffer.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ''
            )
        );
        return `data:image/jpeg;base64,${base64Image}`;
    } catch (error) {
        console.error('Error converting image buffer to URL:', error);
        return null;
    }
};

export const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

// Error handling utility
export const handleApiError = (error) => {
    if (error.response) {
        // Server responded with error status
        const message = error.response.data?.error || error.response.data?.message || 'Server error occurred';
        return {
            message,
            status: error.response.status,
            data: error.response.data
        };
    } else if (error.request) {
        // Request was made but no response received
        return {
            message: 'Network error - please check your connection',
            status: 0,
            data: null
        };
    } else {
        // Something else happened
        return {
            message: error.message || 'An unexpected error occurred',
            status: -1,
            data: null
        };
    }
};

// Export default object with all services
export default {
    auth: authService,
    getNews,
    getNewsById,
    getLatestNews,
    getNewsByCategory,
    getFeaturedNews,
    getHighlightNews,
    createNews,
    updateNews,
    deleteNews,
    checkServerHealth,
    convertImageBufferToUrl,
    convertFileToBase64,
    handleApiError
};
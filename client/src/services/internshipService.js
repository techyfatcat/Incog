import api from '../utils/api';

/**
 * Fetches internship listings based on search parameters
 * @param {Object} params - { query: string, location: string, remote: boolean }
 */
export const fetchInternships = async (params) => {
    try {
        const response = await api.get('/internships', { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching internships:", error);
        throw error;
    }
};
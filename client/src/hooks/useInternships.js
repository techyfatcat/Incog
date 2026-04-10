import { useState, useEffect } from 'react';
import { fetchInternships } from '../services/internshipService';

export const useInternships = (initialQuery = 'Software Engineering Intern') => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getInternships = async (query) => {
        setLoading(true);
        try {
            const data = await fetchInternships({ query });
            setInternships(data);
            setLoading(false);
        } catch (err) {
            setError("Failed to load internships. Please try again later.");
            setLoading(false);
        }
    };

    useEffect(() => {
        getInternships(initialQuery);
    }, []);

    return { internships, loading, error, refresh: getInternships };
};
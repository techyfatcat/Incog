const API =
    `${import.meta.env.VITE_API_URL}/internships`;

export const fetchInternships =
    async () => {

        const res =
            await fetch(API);

        if (!res.ok)
            throw new Error(
                "Failed fetching internships"
            );

        return res.json();

    };
const API =
    "http://localhost:5000/api/internships";

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
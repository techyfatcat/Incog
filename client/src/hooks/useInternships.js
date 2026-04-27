import { useEffect, useState }
    from "react";

import {
    fetchInternships
}
    from "../services/internshipService";

export default function useInternships() {

    const [internships, setInternships] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState(null);


    useEffect(() => {

        fetchInternships()

            .then(data => {

                setInternships(data);

                setLoading(false);

            })

            .catch(err => {

                console.error(err);

                setError(err);

                setLoading(false);

            });

    }, []);


    return {

        internships,
        loading,
        error

    };

}
import React,
{ useState }
    from "react";

import useInternships
    from "../../../hooks/useInternships";

import InternshipCard
    from "./InternshipCard";

import InternshipFilters
    from "./InternshipFilters";


export default function
    InternshipGrid() {

    const {

        internships,
        loading,
        error

    } = useInternships();


    const [filters, setFilters] =
        useState({

            location: []

        });


    const filtered =
        internships.filter(job => {

            if (
                filters.location.length &&
                !filters.location.includes(job.location)
            )
                return false;

            return true;

        });


    if (loading)
        return (
            <p className="text-sm text-gray-400">
                Loading internships...
            </p>
        );


    if (error)
        return (
            <p className="text-sm text-red-400">
                Failed loading internships
            </p>
        );


    return (

        <div className="grid lg:grid-cols-12 gap-6">


            {/* filters */}

            <div className="lg:col-span-3">

                <InternshipFilters

                    filters={filters}

                    setFilters={setFilters}

                />

            </div>



            {/* cards */}

            <div className="lg:col-span-9">

                {filtered.length === 0 ? (

                    <div className="bg-white dark:bg-[#0A0C14] border border-gray-200 dark:border-white/5 rounded-xl p-10 text-center">

                        <p className="text-sm text-gray-400">

                            No internships found

                        </p>

                    </div>

                ) : (

                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">

                        {filtered.map(job => (

                            <InternshipCard
                                key={job._id}
                                job={job}
                            />

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}
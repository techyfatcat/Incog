import Internship from "../models/internship.model.js";


// GET all internships
export const getInternships = async (req, res) => {

    try {

        const internships =
            await Internship
                .find()
                .sort({ postedAt: -1 });

        res.json(internships);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Failed to fetch internships"
        });

    }

};



// run once to insert sample data
export const seedInternships = async (req, res) => {

    try {

        const data = [

            {
                title: "SDE Intern Batch 2027",
                company: "Myntra",
                tags: ["SDE", "Backend"],
                applyUrl: "https://unstop.com/p/myntra-ramp-up-sde-internship-hiring-batch-2027-myntra-1672458"
            },

            {
                title: "Software Developer Intern",
                company: "IBM",
                tags: ["Software"],
                applyUrl: "https://careers.ibm.com/en_US/careers/JobDetail?jobId=106370"
            },

            {
                title: "ML Intern",
                company: "LSEG",
                location: "Bangalore",
                tags: ["ML", "AI"],
                applyUrl: "https://lseg.wd3.myworkdayjobs.com/Careers/job/IND-Bangalore-TowerERMZ-Infin/ML-Intern_R0118342-1"
            },

            {
                title: "AI Intern",
                company: "Auric AI",
                location: "Remote",
                tags: ["AI"],
                applyUrl: "https://auric-ai.talismatic.com/jobs/JKGPLMATQ"
            },

            {
                title: "Backend Intern",
                company: "Juspay",
                tags: ["Backend"],
                applyUrl: "https://joinus.juspay.in/?jobId=DEV-BE02"
            },

            {
                title: "Software Intern",
                company: "Cloudflare",
                location: "Remote",
                tags: ["Cloud"],
                applyUrl: "https://job-boards.greenhouse.io/cloudflare/jobs/7296923"
            }

        ];

        await Internship.insertMany(data);

        res.json({
            success: true,
            message: "Internships seeded"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Seeding failed"
        });

    }

};
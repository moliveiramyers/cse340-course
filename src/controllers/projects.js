import { getAllProjects, getUpcomingProjects, getProjectDetails } from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

export const projectsPage = async (req, res) => {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
}

export const showProjectDetailsPage = async (req, res) => {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
                return res.status(400).send("Invalid project ID");
        }
        const project = await getProjectDetails(id);
        res.render('project', { project });
}
import { getAllProjects } from "../models/projects.js";
export const projectsPage = async (req, res) => {
        const projects = await getAllProjects();
        const title = 'Service Projects';
        res.render('projects', { title, projects });
}
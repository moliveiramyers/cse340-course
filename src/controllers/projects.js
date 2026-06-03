import { body, Result, validationResult } from 'express-validator';
import { getAllProjects, getUpcomingProjects, getProjectDetails, createProject, getProjectWithCategories, updateProject } from "../models/projects.js";
import { getAllOrganizations } from "../models/organizations.js";
import { getCategoriesByProject } from "../models/categories.js";
// import { render } from 'ejs';

const projectValidation = [
        body('title')
                .trim()
                .notEmpty().withMessage('Title is required!')
                .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters!')
                .escape(),

        body('description')
                .trim()
                .notEmpty().withMessage('Description is required!')
                .isLength({ min: 3, max: 1000 }).withMessage('Description must be more then 3 and less than 1000 characters!')
                .escape(),

        body('location')
                .trim()
                .notEmpty().withMessage('Location is required!')
                .isLength({ max: 200 }).withMessage('Locantion must be less than 200 characters!')
                .escape(),
        body('date')
                .notEmpty().withMessage('Date is required!')
                .isISO8601()
                .withMessage('Please provide a valid date!')
                .toDate(),

        body('organizationId')
                .trim()
                .notEmpty().withMessage('Organization is required!')
                .isInt().withMessage('Organization must be a valid integer!')
]

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectsPage = async (req, res) => {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects';
        res.render('projects', { title, projects });
}

const showProjectDetailsPage = async (req, res) => {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
                return res.status(400).send("Invalid project ID");
        }

        const project = await getProjectWithCategories(id);

        res.render('project', { project });
}

const showNewProjectForm = async (req, res) => {
        const organizations = await getAllOrganizations();
        const title = 'Add New Service Project';

        res.render('new-project', { title, organizations });
}

const processNewProjectForm = async (req, res) => {
        const { title, description, location, date, organizationId } = req.body;

        const results = validationResult(req);
        if (!results.isEmpty()) {
                results.array().forEach((error) => {
                        req.flash('error', error.msg);
                });
                return res.redirect('/new-project');
        }

        // Create the new project in the database
        try {
                const projectId = parseInt(req.params.id);

                const updatedProjectId = await updateProject(
                        projectId,
                        title,
                        description,
                        location,
                        date,
                        organizationId
                );

                req.flash('success', 'New service project created successfully!');
                res.redirect(`/projects/${newProjectId}`)
        } catch (error) {
                console.error('Error creating new project:', error);
                req.flash('error', 'There was an error creating the service project.')
                res.redirect('/new-project');
        }
}

const showEditProjectForm = async (req, res) => {
        const projectId = parseInt(req.params.id);
        const project = await getProjectWithCategories (projectId);
        const organizations = await getAllOrganizations();

        if (!project) {
                return res.status(404).send("Project not found");
        }
        console.log(project);
        console.log(project.date);
        res.render('edit-project', { project, organizations });
}

const processEditProjectForm = async (req, res) => {
        const { title, description, location, date, organizationId } = req.body;

        const results = validationResult(req);
        if (!results.isEmpty()) {
                results.array().forEach((error) => {
                        req.flash('error', error.msg);
                });
                return res.redirect('/edit-project');
        }

        // Create the new project in the database
        try {
                const newProjectId = await createProject(title, description, location, date, organizationId);

                req.flash('success', 'New service project created successfully!');
                res.redirect(`/projects/${newProjectId}`)
        } catch (error) {
                console.error('Error creating new project:', error);
                req.flash('error', 'There was an error creating the service project.')
                res.redirect('/edit-project');
        }
}
export { projectsPage, showProjectDetailsPage, showNewProjectForm, processNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm }
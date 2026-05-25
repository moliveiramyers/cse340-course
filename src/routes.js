import express from 'express';

import { homePage } from './controllers/index.js';
import { organizationsPage, processNewOrganizationForm, showOrganizationDetailsPage, registrationValidation, showNewOrganizationForm, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { projectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { categoriesPage, categoryDetailsPage, } from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';


const router = express.Router();

router.get('/', homePage);

router.get('/organizations', organizationsPage);
router.get('/organizations/:id', showOrganizationDetailsPage);

router.get('/projects', projectsPage);
router.get('/projects/:id', showProjectDetailsPage);

router.get('/categories', categoriesPage);
router.get('/categories/:id', categoryDetailsPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

router.post(
    '/new-organization', registrationValidation,
    processNewOrganizationForm);

//UPdate Organization Info 
router.get('/edit-organization/:id', showEditOrganizationForm)
router.post('/edit-organization/:id', registrationValidation, processEditOrganizationForm)

// Test route for 500 errors
router.get('/test-error', testErrorPage);


export default router;
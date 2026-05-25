import express from 'express';

import { homePage } from './controllers/index.js';
import { organizationsPage, processNewOrganizationForm, showOrganizationDetailsPage } from './controllers/organizations.js';
import { projectsPage, showProjectDetailsPage } from './controllers/projects.js'; 
import { categoriesPage, categoryDetailsPage,  } from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

import { showNewOrganizationForm } from './controllers/new-organizations.js';

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

router.post('/new-organization', processNewOrganizationForm);

// Test route for 500 errors
router.get('/test-error', testErrorPage);


export default router;
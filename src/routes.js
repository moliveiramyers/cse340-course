import express from 'express';

import { homePage } from './controllers/index.js';
import { organizationsPage, showOrganizationDetailsPage } from './controllers/organizations.js';
import { projectsPage, showProjectDetailsPage } from './controllers/projects.js'; 
import { categoriesPage } from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

const router = express.Router();

router.get('/', homePage);

router.get('/organizations', organizationsPage);
router.get('/organizations/:id', showOrganizationDetailsPage);

router.get('/projects', projectsPage);
router.get('/projects/:id', showProjectDetailsPage);

router.get('/categories', categoriesPage);

// Test route for 500 errors
router.get('/test-error', testErrorPage);


export default router;
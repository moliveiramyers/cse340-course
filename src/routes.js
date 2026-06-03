import express from 'express';

import { homePage } from './controllers/index.js';
import { organizationsPage, processNewOrganizationForm, showOrganizationDetailsPage, registrationValidation, showNewOrganizationForm, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { projectsPage, showProjectDetailsPage, processNewProjectForm, showNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { categoriesPage, categoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, categoryValidation, processNewCategory, showEditCategoryForm , showNewCategoryForm, processEditCategory} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';


const router = express.Router();

router.get('/', homePage);

// ORGANIZATION ROUTES
router.get('/organizations', organizationsPage);
router.get('/organizations/:id', showOrganizationDetailsPage);
// new organization page
router.get('/new-organization', showNewOrganizationForm);
router.post('/new-organization', registrationValidation,processNewOrganizationForm);
//UPdate Organization Info 
router.get('/edit-organization/:id', showEditOrganizationForm);
router.post('/edit-organization/:id', registrationValidation, processEditOrganizationForm);


// PROJECT ROUTES
router.get('/projects', projectsPage);
router.get('/projects/:id', showProjectDetailsPage);
// new project
router.get('/new-project', showNewProjectForm);
router.post('/new-project', projectValidation, processNewProjectForm);
router.get('/edit-project/:id', showEditProjectForm);
router.post('/edit-project/:id', processEditProjectForm);

// Handle Categories
router.get('/categories', categoriesPage);
router.get('/categories/:id', categoryDetailsPage);
router.get('/assign-categories/:id', showAssignCategoriesForm);
router.post('/assign-categories/:id', processAssignCategoriesForm);
router.get(`/new-category`, showNewCategoryForm);
router.post(`/new-category`, categoryValidation, processNewCategory);
router.get(`/edit-category/:id`, showEditCategoryForm);
router.post(`/edit-category/:id`, categoryValidation, processEditCategory);





// Test route for 500 errors
router.get('/test-error', testErrorPage);


export default router;
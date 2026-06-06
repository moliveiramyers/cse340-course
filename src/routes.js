import express from 'express';

import { homePage } from './controllers/index.js';
import { organizationsPage, processNewOrganizationForm, showOrganizationDetailsPage, registrationValidation, showNewOrganizationForm, showEditOrganizationForm, processEditOrganizationForm } from './controllers/organizations.js';
import { projectsPage, showProjectDetailsPage, processNewProjectForm, showNewProjectForm, projectValidation, showEditProjectForm, processEditProjectForm } from './controllers/projects.js';
import { categoriesPage, categoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, categoryValidation, processNewCategory, showEditCategoryForm, showNewCategoryForm, processEditCategory } from './controllers/categories.js';

import { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, showDashboard, requireRole } from './controllers/users.js';
import { testErrorPage } from './controllers/errors.js';


const router = express.Router();

router.get('/', homePage);

// ORGANIZATION ROUTES
router.get('/organizations', organizationsPage);
router.get('/organizations/:id', showOrganizationDetailsPage);
// new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
router.post('/new-organization', requireRole('admin'), registrationValidation, processNewOrganizationForm);
//UPdate Organization Info 
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
router.post('/edit-organization/:id', requireRole('admin'), registrationValidation, processEditOrganizationForm);


// PROJECT ROUTES
router.get('/projects', projectsPage);
router.get('/projects/:id', showProjectDetailsPage);
// new project
router.get('/new-project', requireRole('admin'), showNewProjectForm);
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), processEditProjectForm);

// Handle Categories
router.get('/categories', categoriesPage);
router.get('/categories/:id', categoryDetailsPage);
router.get('/assign-categories/:id', requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:id', requireRole('admin'), processAssignCategoriesForm);
router.get(`/new-category`, requireRole('admin'), showNewCategoryForm);
router.post(`/new-category`, requireRole('admin'), categoryValidation, processNewCategory);
router.get(`/edit-category/:id`, requireRole('admin'), showEditCategoryForm);
router.post(`/edit-category/:id`, requireRole('admin'), categoryValidation, processEditCategory);

// Register routes
router.get(`/register`, showUserRegistrationForm);
router.post(`/register`, processUserRegistrationForm)

// Login/logout routes
router.get(`/login`, showLoginForm);
router.post(`/login`, processLoginForm);
router.get(`/logout`, processLogout);

// Dashboard
router.get(`/dashboard`, requireLogin, showDashboard);

// Authorization


// Test route for 500 errors
router.get('/test-error', testErrorPage);


export default router;
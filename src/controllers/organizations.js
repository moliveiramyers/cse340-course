import { body, validationResult } from 'express-validator';

import { getAllOrganizations, getOrganizationById, getProjectsByOrganization, createOrganization, updateOrganization } from "../models/organizations.js";

const registrationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters')
        .escape(),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email'),
    body('description')
        .trim()
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters')
        .notEmpty()
        .withMessage('Organization description is required')
        .escape()
]


const organizationsPage = async (req, res) => {

    const organizations = await getAllOrganizations();
    console.log(organizations);
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });

}

const showOrganizationDetailsPage = async (req, res) => {
    const id = parseInt(req.params.id);

    const organization = await getOrganizationById(id);
    const projects = await getProjectsByOrganization(id)

    res.render('organization', {
        title: organization.name,
        organization, projects
    });
};
const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', { title });
}

const processNewOrganizationForm = async (req, res) => {

    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-organization')
    }

    const { name, description, contactEmail } = req.body;
    const logoFileName = 'placeholder-logo.png';
    const organizationId = await createOrganization(name, description, contactEmail, logoFileName);

    // Set a success flash message
    req.flash('success', 'Organization added successfully!');

    res.redirect(`/organizations/${organizationId}`);
}

const showEditOrganizationForm = async (req, res) => {
    const organizationId = parseInt(req.params.id);
    const organizationDetails = await getOrganizationById(organizationId);
    const title = 'Edit Organization';
    res.render('edit-organization', { title, organizationDetails });
}

const processEditOrganizationForm = async (req, res) => {
    const results = validationResult(req);
    const organizationId = parseInt(req.params.id);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-organization/${organizationId}`)
    }

    const { name, description, contactEmail, logoFilename } = req.body;
    
    await updateOrganization(organizationId, name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization updated successfully!')
    res.redirect(`/organizations/${organizationId}`);

}

export {
    organizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm,
    registrationValidation
};
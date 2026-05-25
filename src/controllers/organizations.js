import { getAllOrganizations, getOrganizationById, getProjectsByOrganization, createOrganization } from "../models/organizations.js";
import { showNewOrganizationForm } from "./new-organizations.js";

export const organizationsPage = async (req, res) => {

    const organizations = await getAllOrganizations();
    console.log(organizations);
    const title = 'Our Partner Organizations';
    res.render('organizations', { title, organizations });

}

export const showOrganizationDetailsPage = async (req, res) => {
    const id = parseInt(req.params.id);

    const organization = await getOrganizationById(id);
    const projects = await getProjectsByOrganization(id)

    res.render('organization', {
        title: organization.name,
        organization, projects
    });
};

export const processNewOrganizationForm = async (req, res) => {
    const { name, description, contactEmail } = req.body;
    const logoFileName = 'placeholder-logo.png';
    const organizationId = await createOrganization(name, description, contactEmail, logoFileName);
    res.redirect(`/organizations/${organizationId}`);
}
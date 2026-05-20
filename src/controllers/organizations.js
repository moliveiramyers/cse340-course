import { getAllOrganizations, getOrganizationById, getProjectsByOrganization } from "../models/organizations.js";

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


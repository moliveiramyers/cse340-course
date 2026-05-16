import { getAllOrganizations } from "../models/organizations.js";

export const organizationsPage = async (req, res) => {
    
        const organizations = await getAllOrganizations();
        console.log(organizations);
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });

}
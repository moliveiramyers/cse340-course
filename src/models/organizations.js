import db from "./db.js";

const getAllOrganizations = async () => {
    const query = `
    SELECT organization_id, name, description, contact_email, logo_filename
    FROM public.organization;
    `
    const result = await db.query(query);
    return result.rows;
}

const getOrganizationById = async (id) => {
    const query = `
        SELECT
            organization_id,
            name, description,
            contact_email,
            logo_filename
        FROM organization 
        WHERE organization_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
};

const getProjectsByOrganization = async (organization_id) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date AS date,
            o.name AS organization_name,
            o.organization_id AS organization_id
        FROM service_projects sp
        JOIN organization o
        ON sp.organization_id = o.organization_id
        WHERE sp.organization_id = $1;
    `
    const result = await db.query(query, [organization_id]);
    return result.rows;
}

export {getAllOrganizations, getOrganizationById, getProjectsByOrganization};
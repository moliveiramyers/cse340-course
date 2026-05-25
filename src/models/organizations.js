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

/**
 * Creates a new organization in the database.
 * @param {string} name - The name of the organization.
 * @param {string} description - A description of the organization.
 * @param {string} contactEmail - The contact email for the organization.
 * @param {string} logoFilename - The filename of the organization's logo.
 * @returns {string} The id of the newly created organization record.
 */
const createOrganization = async (name, description, contactEmail, logoFilename) => {
    const query = `
      INSERT INTO organization (name, description, contact_email, logo_filename)
      VALUES ($1, $2, $3, $4)
      RETURNING organization_id
    `;

    const queryParams = [name, description, contactEmail, logoFilename];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create organization');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new organization with ID:', result.rows[0].organization_id);
    }

    return result.rows[0].organization_id;
};

export {getAllOrganizations, getOrganizationById, getProjectsByOrganization, createOrganization};
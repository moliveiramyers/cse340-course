import db from "./db.js";

const getAllProjects = async () => {
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
        ON sp.organization_id = o.organization_id;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {

    const currentDate = new Date().toISOString().split("T")[0]; const currentProjects = `
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date AS date,
            o.organization_id,
            o.name AS organization_name
        FROM service_projects sp
        JOIN organization o
        ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= $1
        ORDER BY sp.project_date ASC
        LIMIT $2;
    `;
    const result = await db.query(currentProjects, [currentDate, number_of_projects]);
    return result.rows;
}
const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date AS date,
            o.organization_id,
            o.name AS organization_name,
            c.category_id,
            c.name AS category_name
        FROM service_projects sp
        JOIN organization o
            ON sp.organization_id = o.organization_id
        LEFT JOIN project_categories pc
            ON sp.project_id = pc.project_id
        LEFT JOIN categories c
            ON pc.category_id = c.category_id
        WHERE sp.project_id = $1;
    `;

    const result = await db.query(query, [id]);
    return result.rows;
};

const formatProjectDetails = (rows) => {
    if (!rows || rows.length === 0) return null;

    return {
        project_id: rows[0].project_id,
        title: rows[0].title,
        description: rows[0].description,
        location: rows[0].location,
        date: rows[0].date,
        organization_name: rows[0].organization_name,
        organization_id: rows[0].organization_id,
        categories: rows
            .filter(r => r.category_id)
            .map(r => ({
                category_id: r.category_id,
                name: r.category_name
            }))
    };
};

const getProjectWithCategories = async (id) => {
    const rows = await getProjectDetails(id);
    return formatProjectDetails(rows);
};

const createProject = async (title, description, location, date, organizationId) => {
    const query = `
    INSERT INTO service_projects  (title, description, location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
    `
    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id
}

const updateProject = async (projectId, title, description, location, date, organizationId) => {
    const query = `
        UPDATE service_projects
        SET
            title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6

        RETURNING project_id;
        `;
    const values = [ title, description, location, date, organizationId, projectId];
    const result = await db.query(query, values);
    if (result.rows.length === 0) {
        throw new Error(`Project with id ${projectId} not found`);
    }
    return result.rows[0].project_id;
}

export { getAllProjects, getUpcomingProjects, getProjectDetails, createProject, getProjectWithCategories, updateProject };

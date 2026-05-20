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
    const productDetail = `
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
        WHERE sp.project_id = $1;
    `
    const result = await db.query(productDetail, [id]);
    return result.rows[0];    
}

export { getAllProjects, getUpcomingProjects, getProjectDetails };

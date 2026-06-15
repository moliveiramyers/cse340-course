import db from "./db.js";

const addVolunteer = async (userId, projectId) => {
    const query = `
    INSERT INTO volunteering (user_id, project_id)
    VALUES($1, $2)
    RETURNING volunteer_id;
    `;

    const result = await db.query(query, [userId, projectId]);
    return result.rows[0].volunteer_id;
};

const deleteVolunteer = async (userId, projectId) => {
    const query = `
    WHERE user_id = $1
    AND project_id = $2
    RETURNING volunteer_id
    `;

    const result = await db.query(query, [userId, projectId]);
    return result.rows[0]?.volunteer_id;
}

const getUserProjects = async (userId) => {
    const query = `
    SELECT
        sp.project_id,
        sp.title,
        v.date AS enrollment_date
        sp.title AS title
    FROM volunteering v
    INNER JOIN service_projects sp ON v.project_id = sp.project_id
    WHERE user_id = $1;
    ` ;
    const result = await db.query(query, [userId]);
    return result.rows;
}

const checkRegistration = async (userId, projectId) => {
    const query = `
    SELECT 1 FROM volunteering
    WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await db.query(query, [userId, projectId]);
    return result.rowCount > 0;
}

export { addVolunteer, deleteVolunteer, getUserProjects, checkRegistration }
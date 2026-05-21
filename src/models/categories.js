import db from "./db.js";

const getAllCategories = async () => {
    const query = `
        SELECT
            c.category_id,
            c.name AS category_name,
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date

        FROM service_projects sp
        JOIN project_categories pc
            ON sp.project_id = pc.project_id

        JOIN categories c
            ON pc.category_id = c.category_id
        ORDER BY c.name;
    `;

    const result = await db.query(query);
    return result.rows;
};

const getCategoryById = async (id) => {
    const query = `
    SELECT
        category_id,
        name
    FROM categories
    WHERE category_id = $1
    `
    const result = await db.query(query, [id]);
    return result.rows[0];
}

const getCategoriesByProject = async (project_id) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM categories c

        JOIN project_categories pc
            ON c.category_id = pc.category_id

        WHERE pc.project_id = $1;
    `;

    const result = await db.query(query, [project_id]);
    return result.rows;
};

const getAllProjectsByCategory = async (category_id) => {
    const query = `
    SELECT
            c.name AS category_name,
            c.category_id,
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date

        FROM service_projects sp
        JOIN project_categories pc
            ON sp.project_id = pc.project_id

        JOIN categories c
            ON pc.category_id = c.category_id
        WHERE c.category_id = $1
        ORDER BY sp.project_date;
    `
    const result = await db.query(query, [category_id]);
    return result.rows;
}

export { getAllCategories, getCategoryById, getAllProjectsByCategory, getCategoriesByProject };
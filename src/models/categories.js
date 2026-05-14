import db from "./db.js";

const getAllCategories = async () => {
    const query = `
        SELECT
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

export { getAllCategories };
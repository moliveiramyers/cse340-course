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

const assignCategoryToProject = async(projectId, categoryId) =>{
    const query = `
        INSERT INTO project_categories(project_id, category_id) VALUES ($1, $2);
    `
    await db.query(query, [projectId, categoryId]);
     
}
const updateCategoryAssignments = async (projectId, categoryIds) => {
    const deleteQuery = `
        DELETE FROM project_categories
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
}

const getAllCategoriesList = async () => {
    const query = `
        SELECT
            category_id,
            name
        FROM categories
        ORDER BY name;
    `;

    const result = await db.query(query);
    return result.rows;
};

const addNewCategory = async (name) => {
    const query = `
    INSERT INTO categories (name)
    VALUES ($1)
    RETURNING category_id;
    `
    const result = await db.query(query, [name])
    return result.rows[0].category_id;
}

const editCategory = async (categoryId, name) => {
    const query = `
    UPDATE categories
    SET name = $1
    WHERE category_id = $2
    RETURNING category_id;
    `;
    const result = await db.query(query, [name, categoryId]);
    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }
    return result.rows[0].category_id;
}


export { getAllCategories, getCategoryById, getAllProjectsByCategory, getCategoriesByProject, assignCategoryToProject, updateCategoryAssignments, getAllCategoriesList, addNewCategory, editCategory };
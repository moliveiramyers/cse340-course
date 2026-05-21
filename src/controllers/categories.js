import { getAllCategories, getCategoryById, getAllProjectsByCategory, getCategoriesByProject } from "../models/categories.js";
export const categoriesPage = async (req, res) => {
        const categories = await getAllCategories();
        
        const title = 'Categories';
        
        res.render('categories', { title, categories });
 
}


export const categoryDetailsPage = async (req, res) => {

    const id = parseInt(req.params.id);

    const category = await getCategoryById(id);

    const projects = await getAllProjectsByCategory(id);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};
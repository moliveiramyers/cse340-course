import { getAllCategories } from "../models/categories.js";
export const categoriesPage = async (req, res) => {
        const categories = await getAllCategories();
        const title = 'Categories';
        res.render('categories', { title, categories });
 
}
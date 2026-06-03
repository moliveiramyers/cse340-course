import { getAllCategories, getCategoryById, getAllProjectsByCategory, getCategoriesByProject, updateCategoryAssignments, getAllCategoriesList, addNewCategory, editCategory } from "../models/categories.js";
import { getProjectWithCategories } from "../models/projects.js";
import { body, validationResult } from 'express-validator';

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters')
        .isLength({ max: 100 }).withMessage('Category name must be less than 100 characters')
];

const categoriesPage = async (req, res) => {
    const categories = await getAllCategoriesList();

    const title = 'Categories';

    res.render('categories', { title, categories });

}

const categoryDetailsPage = async (req, res) => {

    const id = parseInt(req.params.id);

    const category = await getCategoryById(id);

    const projects = await getAllProjectsByCategory(id);

    res.render('category', {
        title: category.name,
        category,
        projects
    });
};
const showAssignCategoriesForm = async (req, res) => {
    const projectId = parseInt(req.params.id);
    const projectDetails = await getProjectWithCategories(projectId);
    const categories = await getAllCategoriesList();
    const projectCategories = await getCategoriesByProject(projectId);
    const title = 'Assign Categories to Project';
    res.render('assign-categories', {
        title: 'Assign Categories to Project',
        projectId,
        projectDetails,
        categories,
        projectCategories
    });

}
const processAssignCategoriesForm = async (req, res) => {
    const projectId = parseInt(req.params.id);
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/projects/${projectId}`);
};

const showNewCategoryForm = async (req, res) => {
    res.render('new-category');
}
const processNewCategory = async (req, res) => {
    const { name } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect('/new-category');
    }

    try {
        const categoryId = await addNewCategory(name);

        req.flash('success', 'Category created successfully!');
        res.redirect(`/categories/${categoryId}`);
    } catch (error) {
        console.error(error);
        req.flash('error', 'Error creating category');
        res.redirect('/new-category');
    }
}
const showEditCategoryForm = async (req, res) => {
    const categoryId = parseInt(req.params.id);
    const category = await getCategoryById(categoryId);
    if (!category) {
        return res.status(404).send('Category not found');
    }
    res.render('edit-category', { category })
}
const processEditCategory = async (req, res) => {
    const categoryId = parseInt(req.params.id);
    const { name } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(err => req.flash('error', err.msg));
        return res.redirect(`/edit-category/${categoryId}`);
    }

    try {
        await editCategory(categoryId, name);
        req.flash('success', 'Category updated successfully!');
        res.redirect(`/categories/${categoryId}`);

    } catch(error) {
        console.error(error);
        req.flash('error', 'Error updating category');
        res.render(`/edit-category/${categoryId}`)
    }
}

export { categoriesPage, categoryDetailsPage, showAssignCategoriesForm, processAssignCategoriesForm, processNewCategory, categoryValidation, showEditCategoryForm, showNewCategoryForm, processEditCategory }
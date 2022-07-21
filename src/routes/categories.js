import express from 'express';
import db from '../models';
const categoriesRouter = express.Router();
const { body, validationResult } = require('express-validator');
// METHOD GET

// GET ALL CATEGORIES
categoriesRouter.get('/all', async (req, res, next) => {
	try {
		let categories = await db.Categories.findAll();
		for (let i = 0; i < categories.length; i++) {
			let attributesCategory = await db.Attribute.findAll({
				attributes: { exclude: [ 'categoryID' ] },
				where: { categoryID: categories[i].categoryID }
			});
			categories[i].dataValues.attributes = attributesCategory;
			console.log(categories[i].dataValues);
		}
		res.status(200).json(categories);
	} catch (error) {
		res.status(500).json(error.message);
	}
});

// get category by categoryID
categoriesRouter.get('/:categoryID', async (req, res, next) => {
	let categoryID = req.params.categoryID;
	try {
		let category = await db.Categories.findByPk(categoryID);
		if (category) {
			let attributesCategory = await db.Attribute.findAll({
				attributes: { exclude: [ 'categoryID' ] },
				where: { categoryID: category.categoryID }
			});
			category.dataValues.attributes = attributesCategory;
			res.status(200).json(category);
		} else res.status(400).json('category not exist!');
	} catch (error) {
		res.status(500).json(error.message);
	}
});

// METHOD POST
categoriesRouter.post('/', body('name').notEmpty(), body('attributes').isArray({ min: 1 }), async (req, res, next) => {
	// validation body input
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// handle
	let name = req.body.name,
		attributes = req.body.attributes;

	try {
		let category = await db.Categories.create({ name });
		attributes.forEach(async (attr) => {
			await db.Attribute.create({ categoryID: category.categoryID, name: attr });
		});
		res.status(201).json({ ...category.dataValues, attributes });
	} catch (error) {
		return res.status(400).json('category name exited!');
	}
});
// METHOD PUT
// UPDATE NAME OF CATEGORY
categoriesRouter.put('/:categoryID', async (req, res, next) => {
	let categoryID = req.params.categoryID,
		name = req.body.name;

	let category = await db.Categories.findByPk(categoryID);
	if (category) {
		if (name) {
			await db.Categories.update({ name }, { where: { categoryID } });
		}
		// if (attribute) {
		// 	let attribute = await db.findOne({ where: { categoryID, name: attributes[i] } });
		// 	if (attribute)
		// 		await db.Attribute.update(
		// 			{ name: attribute[i] },
		// 			{ where: { attributeID: attribute.dataValues.attributeID } }
		// 		);
		// }
		let attributesOfCategory = await db.Attribute.findAll({
			attributes: { exclude: [ 'categoryID' ] },
			where: { categoryID: 8 }
		});
		res.status(201).json({ categoryID, name, attributes: attributesOfCategory });
	} else return res.status(400).json('Category not exist!');
});
// METHOD DELETE
categoriesRouter.delete('/:categoryID', async (req, res, next) => {
	let categoryID = req.params.categoryID;
	let productOfCategory = await db.Product.findOne({ where: { categoryID } });
	if (productOfCategory) return res.status(400).json('exited product using category!');
	try {
		await db.Attribute.destroy({ where: { categoryID } });
		await db.Categories.destroy({ where: { categoryID } });
		res.status(204).json('removed category!');
	} catch (error) {
		return res.status(400).json(error.message);
	}
});
//
module.exports = {
	categoriesAPI: (app) => {
		return app.use('/api/v1/categories', categoriesRouter);
	}
};

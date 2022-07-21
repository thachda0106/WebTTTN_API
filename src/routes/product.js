import express from 'express';
import db from '../models';
const productRouter = express.Router();
const { body, validationResult } = require('express-validator');
import { uploadProductImgs } from '../utils/functions';
// METHOD GET
productRouter.get('/all', async (req, res, next) => {
	try {
		let products = await db.Product.findAll();
		for (let i = 0; i < products.length; i++) {
			// product attributes
			let attributes = await db.Attribute.findAll({
				attributes: { exclude: [ 'categoryID' ] },
				where: { categoryID: products[i].dataValues.categoryID }
			});
			for (let j = 0; j < attributes.length; j++) {
				let attributeValue = await db.ProductAttribute.findOne({
					attributes: { exclude: [ 'attributeID', 'productID' ] },
					where: {
						productID: products[i].dataValues.productID,
						attributeID: attributes[j].dataValues.attributeID
					}
				});
				if (!attributeValue) {
					attributes[j].dataValues.value = null;
				} else {
					attributes[j].dataValues.value = attributeValue.dataValues.value;
				}
			}
			// product Images
			let productImages = await db.ProductImage.findAll({
				attributes: { exclude: [ 'productID' ] },
				where: { productID: products[i].dataValues.productID }
			});
			console.log(productImages);
			products[i].dataValues.attributes = attributes;
			products[i].dataValues.images = productImages;
		}
		res.status(200).json(products);
	} catch (error) {
		res.status(400).json(error.message);
	}
});
productRouter.get('/:productID', async (req, res, next) => {
	try {
		let product = await db.Product.findByPk(req.params.productID);
		if (product) {
			let attributes = await db.Attribute.findAll({
				attributes: { exclude: [ 'categoryID' ] },
				where: { categoryID: product.dataValues.categoryID }
			});
			for (let j = 0; j < attributes.length; j++) {
				let attributeValue = await db.ProductAttribute.findOne({
					attributes: { exclude: [ 'attributeID', 'productID' ] },
					where: {
						productID: product.dataValues.productID,
						attributeID: attributes[j].dataValues.attributeID
					}
				});
				if (!attributeValue) {
					attributes[j].dataValues.value = null;
				} else {
					attributes[j].dataValues.value = attributeValue.dataValues.value;
				}
			}
			let productImages = await db.ProductImage.findAll({
				attributes: { exclude: [ 'productID' ] },
				where: { productID: product.dataValues.productID }
			});
			product.dataValues.images = productImages;
			product.dataValues.attributes = attributes;
			res.status(200).json(product);
		} else res.status(400).json('product not exist!');
	} catch (error) {
		res.status(400).json(error.message);
	}
});
// METHOD POST
productRouter.post('/', uploadProductImgs.array('thumbnail', 1), async (req, res, next) => {
	let categoryID = req.body.categoryID,
		name = req.body.name,
		price = req.body.price,
		thumbnail = '/public/imgs/products/' + req.files[0].filename,
		quantity = req.body.quantity,
		description = req.body.description,
		brand = req.body.brand,
		origin = req.body.origin,
		guarantee = req.body.guarantee,
		discountPercent = req.body.discountPercent,
		dateDiscountStart = req.body.dateDiscountStart,
		dateDiscountEnd = req.body.dateDiscountEnd,
		attributes;
	try {
		attributes = JSON.parse(req.body.attributes);
	} catch (error) {
		return res.status(400).json('attributes invalid, attributes is JSON! ');
	}
	let newProduct = {
		categoryID,
		name,
		price,
		thumbnail,
		quantity,
		description,
		brand,
		origin,
		guarantee,
		discountPercent,
		dateDiscountStart,
		dateDiscountEnd
	};
	try {
		let product = await db.Product.create(newProduct);
		let productAttributes = [];
		for (let attributeID in attributes) {
			let result = await db.ProductAttribute.create({
				productID: product.productID,
				attributeID: attributeID,
				value: attributes[attributeID]
			});
			productAttributes = [ ...productAttributes, result ];
		}
		return res.status(201).json({ ...product.dataValues, productAttributes });
	} catch (error) {
		console.log(error);
		return res.status(400).json(error.message);
	}
});

// add product Images
productRouter.post('/imgs/:productID', uploadProductImgs.array('images', 10), async (req, res, next) => {
	let productID = req.params.productID,
		images = [];
	for (let file of req.files) {
		images = [ ...images, '/public/imgs/products/' + file.filename ];
	}
	try {
		let product = await db.Product.findByPk(productID);
		if (!product) return res.status(400).json('product not exist!');
		for (let img of images) {
			await db.ProductImage.create({ productID, imageURL: img });
		}
		return res.status(201).json(images);
	} catch (error) {
		return res.status(400).json(error.message);
	}
});

// METHOD PUT
// update info property of products
productRouter.put('/:productID', async (req, res, next) => {
	let updateInfo = { ...req.body },
		productID = req.params.productID;
	// let attributes = await req.body.attributes;
	// delete updateInfo.attributes;

	try {
		await db.Product.update({ ...updateInfo }, { where: { productID } });
		return res.status(201).json('update product success!');
	} catch (error) {
		console.log(error);
		return res.status(400).json(error.message);
	}
});

// update thumbnail, Images products
//
// METHOD DELETE
productRouter.delete('/:productID', async (req, res, next) => {
	let productID = req.params.productID;
	try {
		let product = await db.Product.findByPk(productID);
		if (!product) return res.status(400).json('product not exist!');
		await db.ProductAttribute.destroy({ where: { productID } });
		await db.Product.destroy({ where: { productID } });
		return res.status(204).json('deleted product!');
	} catch (error) {
		return res.status(400).json(error.message);
	}
});
//
module.exports = {
	productAPI: (app) => {
		return app.use('/api/v1/product', productRouter);
	}
};

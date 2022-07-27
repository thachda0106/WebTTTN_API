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
			// product Rating
			let productRatings = await db.ProductRating.findAll({
				attributes: { exclude: [ 'productID' ] },
				where: { productID: products[i].dataValues.productID }
			});

			let totalStar = 0;
			for (const rating of productRatings) {
				totalStar += rating.dataValues.starNumber;
			}
			if (totalStar === 0) products[i].dataValues.starNumber = 0;
			else products[i].dataValues.starNumber = (totalStar / productRatings.length).toFixed(1);
			products[i].dataValues.rating = productRatings;
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
			// product Rating
			let productRatings = await db.ProductRating.findAll({
				attributes: { exclude: [ 'productID' ] },
				where: { productID: product.dataValues.productID }
			});

			let totalStar = 0;
			for (const rating of productRatings) {
				totalStar += rating.dataValues.starNumber;
			}
			if (totalStar === 0) product.dataValues.starNumber = 0;
			else product.dataValues.starNumber = (totalStar / productRatings.length).toFixed(1);
			product.dataValues.rating = productRatings;
			product.dataValues.images = productImages;
			product.dataValues.attributes = attributes;
			res.status(200).json(product);
		} else res.status(400).json('product not exist!');
	} catch (error) {
		res.status(400).json(error.message);
	}
});

// get all product Rating for product
productRouter.get('/rating/:productID', async (req, res, next) => {
	let productID = req.params.productID;
	try {
		let productRatings = await db.ProductRating.findAll({ where: { productID } });
		res.status(200).json(productRatings);
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
// ==========================================================================
// Product Rating
// add product Images
productRouter.post('/rating', body('starNumber').isInt({ min: 1, max: 5 }), async (req, res, next) => {
	// validation body input
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	// handle
	let productID = req.body.productID,
		customerID = req.body.customerID,
		starNumber = req.body.starNumber,
		content = req.body.content;
	let productRating = { productID, customerID, starNumber, content };
	try {
		let rating = await db.ProductRating.create(productRating);
		return res.status(201).json(rating);
	} catch (error) {
		return res.status(400).json(error);
	}
});
// add comment
productRouter.post('/comment', async (req, res, next) => {
	let productID = req.body.productID,
		username = req.body.username,
		content = req.body.content;
	let newComment = { productID, username, content };
	try {
		let comment = await db.Comment.create(newComment);
		return res.status(201).json(comment);
	} catch (error) {
		return res.status(400).json(error);
	}
});
// add reply
productRouter.post('/comment/reply', async (req, res, next) => {
	let commentID = req.body.commentID,
		username = req.body.username,
		content = req.body.content;
	let newReply = { commentID, username, content };
	try {
		let reply = await db.Reply.create(newReply);
		return res.status(201).json(reply);
	} catch (error) {
		return res.status(400).json(error);
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

//update comment
productRouter.put('/comment/:commentID', async (req, res, next) => {
	let commentID = req.params.commentID,
		content = req.body.content,
		dateNow = new Date(Date.now());

	try {
		await db.Comment.update({ content, updatedAt: dateNow }, { where: { commentID } });
		return res.status(201).json('update comment success!');
	} catch (error) {
		console.log(error);
		return res.status(400).json(error.message);
	}
});
//update reply
productRouter.put('/comment/reply/:replyID', async (req, res, next) => {
	let replyID = req.params.replyID,
		content = req.body.content,
		dateNow = new Date(Date.now());

	try {
		await db.Reply.update({ content, updatedAt: dateNow }, { where: { replyID } });
		return res.status(201).json('update reply success!');
	} catch (error) {
		console.log(error);
		return res.status(400).json(error.message);
	}
});
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

//delete comment
productRouter.delete('/comment/:commentID', async (req, res, next) => {
	let commentID = req.params.commentID;
	try {
		await db.Reply.destroy({ where: { commentID } });
		await db.Comment.destroy({ where: { commentID } });
		return res.status(204).json('deleted comment!');
	} catch (error) {
		console.log(error);
		return res.status(400).json(error.message);
	}
});
//delete reply
productRouter.delete('/comment/reply/:replyID', async (req, res, next) => {
	let replyID = req.params.replyID;
	try {
		await db.Reply.destroy({ where: { replyID } });
		return res.status(204).json('deleted reply!');
	} catch (error) {
		console.log(error);
		return res.status(400).json(error.message);
	}
});
//
//
module.exports = {
	productAPI: (app) => {
		return app.use('/api/v1/product', productRouter);
	}
};

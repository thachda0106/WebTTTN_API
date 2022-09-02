import express from 'express';
import fs from 'fs';
import path from 'path';
import db from '../models';
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const op = Sequelize.Op;
const productRouter = express.Router();
const { body, validationResult } = require('express-validator');
import { uploadProductImgs, uploadImageBase64 } from '../utils/functions';
// METHOD GET

productRouter.get('/count', async (req, res, next) => {
	try {
		let products = await db.Product.findAll();
		res.status(200).json(products.length);
	} catch (error) {
		res.status(400).json(error.message);
	}
});
productRouter.get('/', async (req, res, next) => {
	let offset = req.query.range ? JSON.parse(req.query.range)[0] : 0,
		limit,
		filter;
	if (req.query.range) {
		limit = JSON.parse(req.query.range)[1] - offset;
		filter = JSON.parse(req.query.filter);
	}
	try {
		let products;
		if (req.query.range && filter.searchText) {
			products = await db.Product.findAll({ where: { productID: filter.searchText } });
			if (products.length === 0) {
				products = await db.Product.findAll({
					where: { name: { [op.substring]: filter.searchText } }
				});
			}
		} else products = await db.Product.findAll({ offset, limit, order: [ [ 'productID', 'DESC' ] ] });
		for (let i = 0; i < products.length; i++) {
			let category = await db.Categories.findByPk(products[i].dataValues.categoryID);
			products[i].dataValues.categoryName = category.dataValues.name;
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
			for (let i = 0; i < productRatings.length; i++) {
				let customer = await db.Customer.findByPk(productRatings[i].dataValues.customerID);
				productRatings[i].dataValues.customerName = customer.dataValues.fullName;
				productRatings[i].dataValues.customerAvatar = customer.dataValues.avatar;
				totalStar += productRatings[i].dataValues.starNumber;
			}
			if (totalStar === 0) products[i].dataValues.starNumber = 0;
			else products[i].dataValues.starNumber = (totalStar / productRatings.length).toFixed(1);
			let comments = await db.Comment.findAll({ where: { productID: products[i].dataValues.productID } });
			for (let i = 0; i < comments.length; i++) {
				let replies = await db.Reply.findAll({ where: { commentID: comments[i].dataValues.commentID } });
				comments[i].dataValues.replies = replies;
			}
			comments.reverse();
			// product Image
			products[i].dataValues.comments = comments;
			// product Image
			products[i].dataValues.rating = productRatings;
			products[i].dataValues.attributes = attributes;
			products[i].dataValues.images = productImages;
			products[i].dataValues.id = products[i].dataValues.productID;
		}
		res.status(200).json(products);
	} catch (error) {
		res.status(400).json(error.message);
	}
});

// get product return data for home
productRouter.get('/home', async (req, res, next) => {
	let limit = +req.query.limit;
	try {
		let categories = await db.Categories.findAll();
		let result = [];
		for (let i = 0; i <= categories.length; i++) {
			let products, categoryID, name;
			if (i == categories.length) {
				categoryID = 'discount';
				name = 'Sản phẩm khuyến mãi';
				products = await db.Product.findAll({
					where: {
						discountPercent: { [Op.gt]: 0 },
						dateDiscountStart: { [Op.lte]: new Date() },
						dateDiscountEnd: { [Op.gte]: new Date() }
					},
					offset: 0,
					limit
				});
			} else {
				categoryID = categories[i].dataValues.categoryID;
				name = categories[i].dataValues.name;
				products = await db.Product.findAll({ where: { categoryID }, offset: 0, limit });
			}
			for (let i = 0; i < products.length; i++) {
				products[i].dataValues.categoryName = name;
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
				for (let i = 0; i < productRatings.length; i++) {
					let customer = await db.Customer.findByPk(productRatings[i].dataValues.customerID);
					productRatings[i].dataValues.customerName = customer.dataValues.fullName;
					productRatings[i].dataValues.customerAvatar = customer.dataValues.avatar;
					totalStar += productRatings[i].dataValues.starNumber;
				}
				if (totalStar === 0) products[i].dataValues.starNumber = 0;
				else products[i].dataValues.starNumber = (totalStar / productRatings.length).toFixed(1);
				// product Image
				let comments = await db.Comment.findAll({ where: { productID: products[i].dataValues.productID } });
				for (let i = 0; i < comments.length; i++) {
					let replies = await db.Reply.findAll({ where: { commentID: comments[i].dataValues.commentID } });
					comments[i].dataValues.replies = replies;
				}
				comments.reverse();
				// product Image
				products[i].dataValues.comments = comments;
				products[i].dataValues.rating = productRatings;
				products[i].dataValues.attributes = attributes;
				products[i].dataValues.images = productImages;
				products[i].dataValues.id = products[i].dataValues.productID;
			}
			if (i === categories.length) {
				result = [ { categoryID, name, products }, ...result ];
			} else result = [ ...result, { categoryID, name, products } ];
		}
		return res.status(200).json(result);
	} catch (error) {
		console.log(error);
		res.status(400).json(error.message);
	}
});
// get product return data for home
productRouter.get('/search/query', async (req, res, next) => {
	let searchText = req.query.search;
	try {
		let products = await db.Product.findAll({ where: { name: { [Op.substring]: searchText } } });
		console.log(products.length);
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
			for (let i = 0; i < productRatings.length; i++) {
				let customer = await db.Customer.findByPk(productRatings[i].dataValues.customerID);
				productRatings[i].dataValues.customerName = customer.dataValues.fullName;
				productRatings[i].dataValues.customerAvatar = customer.dataValues.avatar;
				totalStar += productRatings[i].dataValues.starNumber;
			}
			if (totalStar === 0) products[i].dataValues.starNumber = 0;
			else products[i].dataValues.starNumber = (totalStar / productRatings.length).toFixed(1);
			// product Image
			let comments = await db.Comment.findAll({ where: { productID: products[i].dataValues.productID } });
			for (let i = 0; i < comments.length; i++) {
				let replies = await db.Reply.findAll({ where: { commentID: comments[i].dataValues.commentID } });
				comments[i].dataValues.replies = replies;
			}
			comments.reverse();
			// product Image
			products[i].dataValues.comments = comments;
			products[i].dataValues.rating = productRatings;
			products[i].dataValues.attributes = attributes;
			products[i].dataValues.images = productImages;
			products[i].dataValues.id = products[i].dataValues.productID;
		}

		return res.status(200).json(products);
	} catch (error) {
		console.log(error);
		res.status(400).json(error.message);
	}
});
productRouter.get('/:productID', async (req, res, next) => {
	let productID = req.params.productID;
	try {
		let product = await db.Product.findByPk(productID);
		let category = await db.Categories.findByPk(product.dataValues.categoryID);
		product.dataValues.categoryName = category.dataValues.name;
		// product attributes
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
		// product Images
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
		for (let i = 0; i < productRatings.length; i++) {
			let customer = await db.Customer.findByPk(productRatings[i].dataValues.customerID);
			productRatings[i].dataValues.customerName = customer.dataValues.fullName;
			productRatings[i].dataValues.customerAvatar = customer.dataValues.avatar;
			totalStar += productRatings[i].dataValues.starNumber;
		}
		if (totalStar === 0) product.dataValues.starNumber = 0;
		else product.dataValues.starNumber = (totalStar / productRatings.length).toFixed(1);
		// comment
		let comments = await db.Comment.findAll({ where: { productID: product.dataValues.productID } });
		for (let i = 0; i < comments.length; i++) {
			let replies = await db.Reply.findAll({ where: { commentID: comments[i].dataValues.commentID } });
			comments[i].dataValues.replies = replies;
		}
		comments.reverse();
		// product Image
		product.dataValues.comments = comments;
		product.dataValues.rating = productRatings;
		product.dataValues.attributes = attributes;
		product.dataValues.images = productImages;
		product.dataValues.id = product.dataValues.productID;
		res.status(200).json(product);
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
productRouter.post('/', async (req, res, next) => {
	let categoryID = req.body.categoryID,
		name = req.body.name,
		price = req.body.price,
		quantity = req.body.quantity,
		description = req.body.description,
		brand = req.body.brand,
		origin = req.body.origin,
		guarantee = req.body.guarantee,
		discountPercent = req.body.discountPercent,
		dateDiscountStart = req.body.dateDiscountStart,
		dateDiscountEnd = req.body.dateDiscountEnd,
		images = req.body.images,
		thumbnail =
			process.env.BACKEND_URL + '/public/imgs/products/' + uploadImageBase64(req.body.thumbnail, 'products');

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
		let attributesIDOfCategory = await db.Attribute.findAll({
			attributes: { exclude: [ 'categoryID', 'name' ] },
			where: { categoryID: categoryID }
		});
		for (let attribute of attributesIDOfCategory) {
			await db.ProductAttribute.create({
				productID: product.productID,
				attributeID: attribute.dataValues.attributeID,
				value: ''
			});
		}
		// add  new productImages
		images.forEach(async (Image) => {
			var newImageURl = process.env.BACKEND_URL + '/public/imgs/products/' + uploadImageBase64(Image, 'products');
			try {
				await db.ProductImage.create({ productID: product.productID, imageURL: newImageURl });
			} catch (error) {
				console.log(error);
				res.status(400).json(error);
			}
		});
		product.dataValues.id = product.dataValues.productID;
		return res.status(201).json({ ...product.dataValues });
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
		orderID = req.body.orderID,
		customerID = req.body.customerID,
		starNumber = req.body.starNumber,
		content = req.body.content;
	let productRating = { productID, orderID, customerID, starNumber, content };
	try {
		let rating = await db.ProductRating.create(productRating);
		return res.status(201).json(rating);
	} catch (error) {
		console.log(error);
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
	let attributes = req.body.attributes,
		productID = req.params.productID;
	// delete updateInfo.attributes;
	console.log({ body: { ...req.body } });
	// update new Thumbnail
	if (req.body.newThumbnail) {
		var newThumbnailURl =
			process.env.BACKEND_URL + '/public/imgs/products/' + uploadImageBase64(req.body.newThumbnail, 'products');
		let thumbnailOld = '/public' + req.body.thumbnail.split('public')[1];
		try {
			//delete thumbnail old
			fs.unlinkSync(path.dirname(__dirname) + thumbnailOld);
		} catch (e) {
			console.log(e.message);
		}
		req.body.thumbnail = newThumbnailURl;
	}
	// add  new productImages
	if (req.body.newImages) {
		req.body.newImages.forEach(async (Image) => {
			var newImageURl = process.env.BACKEND_URL + '/public/imgs/products/' + uploadImageBase64(Image, 'products');
			try {
				await db.ProductImage.create({ productID, imageURL: newImageURl });
			} catch (error) {
				console.log(error);
				res.status(400).json(error);
			}
		});
	}
	//delete productImage old
	try {
		let images = req.body.images;
		if (images.length === 0) await db.ProductImage.destroy({ where: { productID } });
		else {
			let ListIDImages = images.map((image) => image.id);
			await db.ProductImage.destroy({ where: { id: { [op.notIn]: ListIDImages }, productID } });
		}
	} catch (e) {
		console.log(e.message);
	}

	try {
		await db.Product.update({ ...req.body }, { where: { productID } });
		for (let attr of attributes) {
			await db.ProductAttribute.update(
				{ value: attr.value },
				{ where: { attributeID: attr.attributeID, productID } }
			);
		}

		return res.status(201).json(req.body);
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
		let check = false;
		let orderDetail = await db.OrderDetail.findAll({ where: { productID } });
		if (orderDetail.length > 0) {
			check = true;
		}
		if (check == true) {
			return res.status(400).json({ ...req.body });
		}
		await db.ProductAttribute.destroy({ where: { productID } });
		await db.ProductImage.destroy({ where: { productID } });
		await db.Product.destroy({ where: { productID } });
		return res.status(201).json({ ...req.body });
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

//delete reply
productRouter.post('/phuchoi/', async (req, res, next) => {
	let productID = req.body.productID,
		categoryID = req.body.categoryID;
	try {
		let attributesIDOfCategory = await db.Attribute.findAll({
			attributes: { exclude: [ 'categoryID', 'name' ] },
			where: { categoryID }
		});
		for (let attribute of attributesIDOfCategory) {
			await db.ProductAttribute.create({
				productID,
				attributeID: attribute.dataValues.attributeID,
				value: ''
			});
		}
		return res.status(201).json('phuc hoi !');
	} catch (error) {
		console.log(error);
		return res.status(400).json(error.message);
	}
});
//
module.exports = {
	productAPI: (app) => {
		return app.use('/api/v1/product', productRouter);
	}
};

const Item = require("../models/itemModel");

// @desc     Fetch all items
// @route    GET /api/items
// @access   Public
const getItems = async (req, res, next) => {
  try {
    const items = await Item.find({});
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc     Fetch single item
// @route    GET /api/item/:id
// @access   Public
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      res.json(item);
    } else {
      res.status(404);
      throw new Error("Item not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Delete a single item
// @route    DELETE /api/items/:id
// @access   Private/Admin
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      await item.remove();
      res.json({ message: "Item removed" });
    } else {
      res.status(404);
      throw new Error("Item not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Create a single item
// @route    Post /api/items
// @access   Private/Admin
const createItem = async (req, res, next) => {
  try {
    const item = new Item({
      name: "Sample name",
      price: 0,
      user: req.user._id,
      image: "https://dummyimage.com/200X300/145e0d/ffffff",
      genre: "Sample genre",
      author: "Sample author",
      countInStock: 0,
      numReviews: 0,
      description: "Sample description",
    });
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    next(error);
  }
};

// @desc     Update a single item
// @route    Put /api/items/:id
// @access   Private/Admin
const updateItem = async (req, res, next) => {
  try {
    const {
      name,
      price,
      genre,
      description,
      image,
      author,
      countInStock,
    } = req.body;

    const item = await Item.findById(req.params.id);

    if (item) {
      item.name = name;
      item.price = price;
      item.description = description;
      item.genre = genre;
      item.author = author;
      item.image = image;
      item.countInStock = countInStock;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404);
      throw new Error("Item not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc     Create a new review
// @route    POST /api/items/:id/reviews
// @access   Private
const createItemReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    const item = await Item.findById(req.params.id);

    if (item) {
      const alreadyReviewed = item.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        res.status(400);
        throw new Error("Item already reviewed");
      }
      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };
      item.reviews.push(review);
      item.numReviews = item.reviews.length;
      item.rating =
        item.reviews.reduce((prev, curr) => curr.rating + prev, 0) /
        item.reviews.length;

      await item.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Item not found");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getItems,
  getItemById,
  deleteItem,
  createItem,
  updateItem,
  createItemReview,
};

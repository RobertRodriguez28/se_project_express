const ClothingItem = require("../Models/clothingItem");

const BadRequestError = require("../Errors/BadRequestError");
const NotFoundError = require("../Errors/NotFoundError");
const ForbiddenError = require("../Errors/ForbiddenError");

const createItem = (req, res, next) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError("Invalid data provided for clothing item")
        );
      }
      return next(err);
    });
};
//     return res.status(400).send({ message: err.message });
//   }
//   return res.status(500).send({ message: "Error from createItem", err });
// });
// };
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};
// .catch((err) => {
// next(err);
// res.status(500).send({ message: "Error from getItems", e });
// });

const updateItem = (req, res, next) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;
  console.log(itemId, imageUrl);
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};
//   res.status(500).send({ message: "Error from updateItem", e });
// });
// };
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      if (!item.owner || item.owner.toString() !== req.user._id) {
        throw new ForbiddenError("You cannot delete another user's item");
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.status(200).send({ message: "Item deleted successfully" }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          new BadRequestError("The id string is in an invalid format")
        );
      }
      next(err);
    });
};
// return res.status(400).send({ message: "Invalid item ID format" });
//else {
// }
//   if (err.name === "DocumentNotFoundError") {
//     return res.status(404).send({ message: "Item not found" });
//   }
//   return res.status(500).send({ message: "Error from deleteItem" });

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
        //   return res.status(400).send({ message: "Invalid item ID format" });
        // }
        // if (err.name === "DocumentNotFoundError") {
        //   return res.status(404).send({ message: "Item not found" });
        // }
        // return res.status(500).send({ message: "Error from likeItem" });
      }
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
        // return res.status(400).send({ message: "Invalid item ID format" });
        // if (err.name === "DocumentNotFoundError") {
        //   return res.status(404).send({ message: "Item not found" });
        // }
        // return res.status(500).send({ message: "Error from dislikeItem" });
      }
      next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  dislikeItem,
  likeItem,
};

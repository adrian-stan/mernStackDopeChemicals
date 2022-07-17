const Cart = require("../models/Cart");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save(); ///////-------------
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  const updatedCart = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(200).json(updatedCart);
});

// DELETE
router.delete("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
  await Cart.findByIdAndDelete(req.params.id);
  res.status(200).json("The cart has been deleted!");
});

// GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  res.status(200).json(cart);
});

// // GET ALL CARTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const carts = await Cart.find();
  res.status(200).json(carts);
});

module.exports = router;

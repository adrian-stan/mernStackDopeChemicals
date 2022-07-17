const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

// CREATE
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const updatedOrder = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  res.status(200).json(updatedOrder);
});

// DELETE
router.delete("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.status(200).json("The order has been deleted!");
});

// GET USER ORDER
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.status(200).json(orders);
});

// // GET ALL CARTS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const orders = await Order.find();
  res.status(200).json(orders);
});

// GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  const income = await Order.aggregate([
    { $match: { createdAt: { $gte: previousMonth } } },
    {
      $project: {
        month: { $month: "$createdAt" },
        sales: "$amount",
      },
    },
    {
      $group: {
        _id: "$month",
        total: { $sum: "$sales" },
      },
    },
  ]);
  res.status(200).json(income);
});

module.exports = router;

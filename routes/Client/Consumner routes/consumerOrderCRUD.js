const Order = require("../models/Clients/consumer/consumerOrders");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME


// Define the route for retrieving income data
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  // Retrieve the product ID from the query parameters
  const productId = req.query.pid;

  // Get the current date and calculate the dates for the previous two months
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    // Use the aggregate function to perform aggregation on orders
    const income = await Order.aggregate([
      {
        // Filter orders created in the previous month
        $match: {
          createdAt: { $gte: previousMonth },
          // Optionally filter by productId if it is provided
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        // Project a new document with the month and sales values
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      {
        // Group the documents by month and calculate the total sales for each month
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ]);

    // Send the resulting income data in JSON format with a 200 status code
    res.status(200).json(income);
  } catch (err) {
    // Send an error response with a 500 status code if there is an error
    res.status(500).json(err);
  }
});

// Export the router object
module.exports = router;


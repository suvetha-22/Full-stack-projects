const express = require('express');
const products = require('./schema');
const router = express.Router();

// Route to submit an order
router.post("/submit", async (req, res) => {
    const { OrderId, Name, Quantity } = req.body;
    try {
        const existingOrder = await products.findOne({ OrderId });
        if (existingOrder) {
            return res.status(400).json({ message: "Order already exists" });
        }
        const newOrder = await new products({ OrderId, Name, Quantity }).save();
                res.status(201).json({ message: "Order submitted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Order submission failed", error });
    }
});

// Route to retrieve an order by OrderId
router.get("/order/:id", async (req, res) => {
    try {
        const order = await products.findOne({ OrderId: req.params.id });
        if (order) {
            res.status(200).json(order);
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving order", error});
    }
});

// Route to update an order's quantity by OrderId
router.put("/update/:id", async (req, res) => {
    try {
        const updatedOrder = await products.findOneAndUpdate(
            { OrderId: req.params.id },
            { Quantity: req.body.Quantity },
            { new: true }
        );
        if (updatedOrder) {
            res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Order update failed", error });
    }
});

// Route to retrieve all orders
router.get("/order", async (req, res) => {
    try {
        const orders = await products.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Could not retrieve orders", error });
    }
});

// Route to delete an order by OrderId
router.delete("/order/:id", async (req, res) => {
    try {
        const deletedOrder = await products.findOneAndDelete({ OrderId: req.params.id });

        if (deletedOrder) {
            res.status(200).json({ message: "Order deleted successfully", deletedOrder });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to delete order", error });
    }
});


module.exports = router;


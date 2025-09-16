const express= require("express");
const router= express.Router();
const Table= require("../Models/tableModel");
const mongoose = require("mongoose"); 
const {userVerification}= require("../Middlewares/AuthMiddlewares");

router.post("/", userVerification, async (req, res) => {
  try {
    const newEntry = new Table({ 
      ...req.body, 
      userId: req.id   // <-- attach logged-in user
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", userVerification, async (req, res) => {
  try {
    const entries = await Table.find({ userId: req.id });  // <-- only this user's data
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:id", userVerification, async (req, res) => {
  try {
    const updated = await Table.findOneAndUpdate(
      { _id: req.params.id, userId: req.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Delete multiple entries
router.post("/delete-multiple", userVerification, async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || ids.length === 0) {
      return res.status(400).json({ message: "No IDs provided" });
    }

    // Ensure ObjectIds
    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    const result = await Table.deleteMany({
      _id: { $in: objectIds },
      userId: req.id
    });

    res.json({
      message: "Entries deleted successfully",
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error("Delete-multiple error:", err);
    res.status(500).json({ message: err.message });
  }
});



//Delete single entry
router.delete("/:id", userVerification, async (req, res) => {
  try {
    const deleted = await Table.findOneAndDelete({ _id: req.params.id, userId: req.id });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

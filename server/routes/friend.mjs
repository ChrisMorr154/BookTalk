import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// Get all friends
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("friends");
    let results = await collection.find({}).toArray();
    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ message: "Error fetching friends", error });
  }
});

// Get a single friend by ID
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("friends");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) return res.status(404).send("Friend not found");
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving friend", error });
  }
});

// Create a new friend
router.post("/", async (req, res) => {
  try {
    let newFriend = {
      userID: req.body.userID,  
      friendID: req.body.friendID,  
      status: req.body.status || "pending",  
      createdAt: new Date()
    };

    let collection = await db.collection("friends");
    let result = await collection.insertOne(newFriend);
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ message: "Error adding friend", error });
  }
});

// Update a friend's status (e.g., accept or reject a request)
router.patch("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
      $set: {
        status: req.body.status  // Update status (e.g., "accepted", "rejected")
      }
    };

    let collection = await db.collection("friends");
    let result = await collection.updateOne(query, updates);

    if (result.modifiedCount === 0) return res.status(404).send("Friend request not found or already updated");
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Error updating friend request", error });
  }
});

// Delete a friend request or remove a friend
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };
    let collection = await db.collection("friends");
    let result = await collection.deleteOne(query);

    if (result.deletedCount === 0) return res.status(404).send("Friend request not found");
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ message: "Error deleting friend request", error });
  }
});

export default router;

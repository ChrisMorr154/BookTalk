import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 

const router = express.Router();

// for login
router.post("/login", async (req, res) => {
  try {
    console.log("🔍 Incoming login request:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    let collection = await db.collection("user");

    // auth via email
    const user = await collection.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("User found:", user);

    // Compare the plain text password with the hashed
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare) {
      console.log("Invalid password for:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT for an hour for exsisting user
    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET,
      { expiresIn: 3600 }
    );

    // make sure login success and token was generated for session
    console.log("Login successful for:", email);
    console.log("Generated token:", token);

    // Send user data back in response
    res.status(200).json({
      token,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
});

// Get all the users in db
router.get("/", async (req, res) => {
  try {
    let collection = await db.collection("user");
    let results = await collection.find({}).toArray();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// get profile info that is protected (can not access from browser)
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("No authorization header provided.");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    //take token
    const token = authHeader.split(" ")[1];
    console.log("Received token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    let collection = await db.collection("user");
    const user = await collection.findOne({ _id: new ObjectId(decoded.userId) });
    console.log("Queried user:", user);

    if (!user) {
      console.log("User not found in DB for id:", decoded.userId);
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      profileImage: user.profileImage || "",
      biography: user.biography || "",
      favoriteBooks: user.favoriteBooks || []
    });

  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile", error: error.message });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log("No authorization header provided.");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Received token for update:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token for update:", decoded);

    // grab updated fields
    const { profileImage, biography, favoriteBooks } = req.body;
    let updateFields = {};
    if (typeof profileImage === "string") {
      updateFields.profileImage = profileImage;
    }
    if (typeof biography === "string") {
      updateFields.biography = biography;
    }
    if (Array.isArray(favoriteBooks)) {
      updateFields.favoriteBooks = favoriteBooks;
    }

    // Update the user doc MongoDB
    let collection = await db.collection("user");
    const result = await collection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: updateFields }
    );
    console.log("Update result:", result);

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "User not found or no changes made" });
    }

    const updatedUser = await collection.findOne({ _id: new ObjectId(decoded.userId) });
    console.log("Updated user from DB:", updatedUser);

    res.status(200).json({
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      username: updatedUser.username,
      profileImage: updatedUser.profileImage || "",
      biography: updatedUser.biography || "",
      favoriteBooks: updatedUser.favoriteBooks || []
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
});

// Get a specific user by their ID
router.get("/:id", async (req, res) => {
  try {
    let collection = await db.collection("user");
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) return res.status(404).json({ message: "User not found" });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
});

// register a new user
router.post("/register", async (req, res) => {
  try {
    console.log("🔍 Incoming registration request:", req.body);

    const { firstName, lastName, username, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let collection = await db.collection("user");

    // check to see if the user is already registered, throw 400 error if so.
    const existingUser = await collection.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // have bcypt Hash the password
    const hashPass = await bcrypt.hash(password, 10);

    // Create a new user
    let newUser = {
      firstName,
      lastName,
      username,
      email,
      password: hashPass,
      profileImage: "",   
      biography: "",      
      favoriteBooks: []   
    };

    let result = await collection.insertOne(newUser);

    // create a token for a new user for an hour
    const token = jwt.sign(
      { userId: result.insertedId, email },
      process.env.JWT_SECRET,
      { expiresIn: 3600 }
    );

    res.status(201).json({ token, id: result.insertedId, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

export default router;

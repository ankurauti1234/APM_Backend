// userRoutes.js
const express = require("express");
const router = express.Router();
const {
  getUserDetails,
  getAllUsers,
  searchUsers,
  updateUserRole,
  registerUser,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Authentication of user with RBAC
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique ID for the user
 *         name:
 *           type: string
 *           description: Full name of the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           description: Email of the user
 *         role:
 *           type: string
 *           description: Role of the user (e.g., Admin, User)
 *         contact:
 *           type: string
 *           description: Contact number of the user
 *         company:
 *           type: string
 *           description: Company of the user
 *         department:
 *           type: string
 *           description: Department of the user
 *         designation:
 *           type: string
 *           description: Designation of the user
 *         employeeid:
 *           type: string
 *           description: Employee ID of the user
 */

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get("/me", authMiddleware, getUserDetails);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, getAllUsers);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Search term to search across name, username, and email
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Full name of the user
 *       - in: query
 *         name: userName
 *         schema:
 *           type: string
 *         description: Username of the user
 *       - in: query
 *         name: emailId
 *         schema:
 *           type: string
 *         description: Email ID of the user
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Role of the user (e.g., Admin, User)
 *     responses:
 *       200:
 *         description: List of users that match the search criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 */
router.get("/search", authMiddleware, searchUsers);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user (Admin functionality)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               contact:
 *                 type: string
 *               company:
 *                 type: string
 *               department:
 *                 type: string
 *               designation:
 *                 type: string
 *               employeeid:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Duplicate field error
 *       500:
 *         description: Internal server error
 */
router.post("/register", authMiddleware, roleMiddleware(["Admin"]), registerUser);

/**
 * @swagger
 * /update-role:
 *   put:
 *     summary: Update user role (Admin functionality)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to update
 *               newRole:
 *                 type: string
 *                 description: New role for the user
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       403:
 *         description: Forbidden (not an admin or attempting to change own role)
 *       500:
 *         description: Internal server error
 */
router.put("/update-role", authMiddleware, roleMiddleware(["Admin"]), updateUserRole);

/**
 * @swagger
 * /delete-user/{userId}:
 *   delete:
 *     summary: Delete a user (Admin functionality)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Cannot delete the last admin
 *       500:
 *         description: Internal server error
 */
router.delete("/delete-user/:userId", authMiddleware, roleMiddleware(["Admin"]), deleteUser);

module.exports = router;


module.exports = router;

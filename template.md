# Express API Framework Template

## 📋 Overview
This project serves as a **solid, battle-tested framework** for building Express.js APIs with MongoDB. Use this as a foundation to copy and adapt for new projects. The structure, patterns, and conventions established here ensure consistent, secure, and maintainable APIs.

---

## 🏗️ Project Structure Framework

### Required Directory Structure:
```
project-name/
├── app.js                 # Main application entry point
├── package.json           # Dependencies and scripts
├── README.md             # Project documentation
├── controllers/          # Business logic handlers
│   ├── items.js         # Item-related operations
│   └── users.js         # User-related operations
├── models/              # MongoDB schema definitions
│   ├── item.js         # Item model
│   └── user.js         # User model
├── routes/              # API route definitions
│   ├── index.js        # Main router
│   ├── items.js        # Item routes
│   └── users.js        # User routes
└── utils/               # Utility functions and constants
    └── errors.js        # HTTP status code constants
```

---

## 🎯 Naming Conventions

### File Naming:
- **Controllers:** `{resource}s.js` (e.g., `clothingItems.js`, `users.js`)
- **Models:** `{resource}.js` (e.g., `clothingItem.js`, `user.js`)
- **Routes:** `{resource}.js` or `{resource}s.js` (consistent with controllers)

### Function Naming:
- **Create:** `create{Resource}` (e.g., `createItem`, `createUser`)
- **Read All:** `get{Resources}` (e.g., `getItems`, `getUsers`)
- **Read One:** `get{Resource}` (e.g., `getItem`, `getUser`)
- **Update:** `update{Resource}` (e.g., `updateItem`, `updateUser`)
- **Delete:** `delete{Resource}` (e.g., `deleteItem`, `deleteUser`)
- **Special Actions:** `{action}{Resource}` (e.g., `likeItem`, `followUser`)

### Variable Naming:
- **Route Parameters:** `{resource}Id` (e.g., `itemId`, `userId`)
- **Request Body:** Destructure specific fields: `{ name, email, imageUrl }`
- **Owner/Creator:** Always `owner = req.user._id`

---

## 🔧 Standard Implementation Patterns

### 1. App.js Structure:
```javascript
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

// Database connection
mongoose
  .connect("mongodb://127.0.0.1:27017/your_db_name")
  .then(() => console.log("connected to DB"))
  .catch(console.error);

// Middleware
app.use(express.json());

// Temporary auth middleware (replace with real auth in production)
app.use((req, res, next) => {
  req.user = {
    _id: "507f1f77bcf86cd799439011", // Replace with JWT validation
  };
  next();
});

// Routes
app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
```

### 2. Controller Pattern:
```javascript
const Resource = require("../models/resource");
const { CREATED, SUCCESS, NOT_FOUND_ERROR, CAST_ERROR, SERVER_ERROR } = require("../utils/errors");

const createResource = (req, res) => {
  const { field1, field2 } = req.body;
  const owner = req.user._id; // NEVER from req.body
  
  Resource.create({ field1, field2, owner })
    .then((item) => res.status(CREATED).send({ data: item }))
    .catch((err) => {
      console.error(err);
      res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};

// Standard error handling for all operations with .orFail()
const getResource = (req, res) => {
  const { resourceId } = req.params;
  
  Resource.findById(resourceId)
    .orFail()
    .then((item) => res.status(SUCCESS).send({ data: item }))
    .catch((err) => {
      console.error(err);
      
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND_ERROR).send({ message: "Item not found" });
      }
      
      if (err.name === 'CastError') {
        return res.status(CAST_ERROR).send({ message: "Invalid item ID" });
      }
      
      res.status(SERVER_ERROR).send({ message: "Server error" });
    });
};
```

### 3. Route Pattern:
```javascript
const router = require("express").Router();
const {
  createResource,
  getResources,
  getResource,
  updateResource,
  deleteResource,
} = require("../controllers/resources");

// Standard CRUD routes
router.post("/", createResource);        // Create
router.get("/", getResources);           // Read all
router.get("/:resourceId", getResource); // Read one
router.put("/:resourceId", updateResource); // Update
router.delete("/:resourceId", deleteResource); // Delete

module.exports = router;
```

### 4. Model Pattern:
```javascript
const mongoose = require("mongoose");
const validator = require("validator");

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: 2,
    maxlength: 30,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Invalid URL format",
    },
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

module.exports = mongoose.model("Resource", resourceSchema);
```

---

## 🛡️ Security Requirements

### 1. Error Handling Security:
- ❌ **NEVER** send `err.message` or `err` object to frontend
- ✅ **ALWAYS** log errors server-side with `console.error(err)`
- ✅ **ALWAYS** send generic messages like `"Server error"`
- ✅ **HANDLE** specific errors (DocumentNotFoundError, CastError)

### 2. Authentication Security:
- ❌ **NEVER** trust `owner` or `userId` from `req.body`
- ✅ **ALWAYS** use `req.user._id` for ownership
- ✅ **VALIDATE** user authentication with proper middleware

### 3. Input Validation:
- ✅ Use Mongoose schema validation
- ✅ Use validator library for URLs, emails, etc.
- ✅ Destructure only needed fields from req.body

---

## 📊 HTTP Status Codes Standard

```javascript
// utils/errors.js
const SUCCESS = 200;           // OK
const CREATED = 201;           // Created
const BAD_REQUEST = 400;       // Bad Request (validation, CastError)
const UNAUTHORIZED = 401;      // Authentication required
const FORBIDDEN = 403;         // Access denied
const NOT_FOUND = 404;         // Resource not found
const SERVER_ERROR = 500;      // Internal server error

module.exports = {
  SUCCESS,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  SERVER_ERROR,
};
```

---

## 🚀 Development Standards

### Package.json Scripts:
```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "lint": "npx eslint .",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### Essential Dependencies:
```json
{
  "dependencies": {
    "express": "^5.1.0",
    "mongoose": "^8.18.1",
    "validator": "^13.15.15"
  },
  "devDependencies": {
    "eslint": "^8.57.1",
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-prettier": "^8.10.2",
    "eslint-plugin-import": "^2.32.0",
    "nodemon": "^3.1.10",
    "prettier": "^2.8.8"
  }
}
```

### API Response Standards:
```javascript
// Success responses
res.status(SUCCESS).send({ data: item });        // Single item
res.status(SUCCESS).send(items);                 // Multiple items
res.status(CREATED).send({ data: newItem });     // Created item

// Error responses
res.status(NOT_FOUND).send({ message: "Item not found" });
res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
res.status(SERVER_ERROR).send({ message: "Server error" });
```

---

## 🤖 AI Instructions

### When building APIs based on this framework:

1. **Follow exact naming conventions** for files, functions, and variables
2. **Copy the security patterns** - never expose database errors
3. **Use the same project structure** - controllers, models, routes, utils
4. **Implement consistent error handling** in all controller functions
5. **Always use `req.user._id` for ownership**, never `req.body`
6. **Follow the HTTP status code standards**
7. **Include proper input validation** in models
8. **Use the same middleware patterns** in app.js
9. **Maintain consistent API response formats**
10. **Include timestamps in all models** with `{ timestamps: true }`

### Recognition Markers:
When you see these patterns in a codebase, you'll know it's built on this framework:
- Controllers named `{resource}s.js` with CRUD functions
- Error handling with DocumentNotFoundError and CastError checks
- Owner always from `req.user._id`
- Generic "Server error" messages
- utils/errors.js with HTTP status constants
- Routes following RESTful patterns with proper HTTP methods

---

## ✅ Framework Checklist

Before considering an API complete, verify:

- [ ] Project follows exact directory structure
- [ ] All naming conventions are consistent
- [ ] Security patterns implemented (no error exposure)
- [ ] Authentication middleware properly configured
- [ ] All CRUD operations follow standard patterns
- [ ] HTTP status codes are appropriate
- [ ] Input validation is comprehensive
- [ ] Error handling is consistent across all endpoints
- [ ] API responses follow standard format
- [ ] Package.json includes all essential dependencies

---

## 🎯 Usage Instructions

1. **Copy this entire project structure** as your starting point
2. **Rename files and functions** according to your domain (items → products, users → customers, etc.)
3. **Update model schemas** for your specific data requirements
4. **Replace temporary auth middleware** with real authentication
5. **Update database connection string** for your project
6. **Follow all patterns established here** for new features

This framework ensures every API you build will be **secure, consistent, recognizable, and maintainable**. 🚀
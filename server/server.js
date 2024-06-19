import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import mysql from "mysql";

dotenv.config();

const saltRounds = parseInt(process.env.SALT_ROUNDS);
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 3000;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "web",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
  console.log("Connected to the MySQL server");
});

const ROLES = {
  GUEST: "guest",
  USER: "user",
  ADMIN: "admin",
};

const validateUserInput = (username, email, password) => {
  return username && email && password;
};

const validateLoginInput = (email, password) => {
  return email && password;
};

const handleDatabaseError = (err, res, message) => {
  console.error(message, err);
  res.status(500).json({ Error: message });
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).json({ Error: "Access denied, token missing" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ Error: "Invalid token" });
  }
};

// Middleware to verify role
const verifyRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res
        .status(403)
        .json({ Error: "Access denied, insufficient privileges" });
    }
    next();
  };
};

// Routes

// Signup route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!validateUserInput(username, email, password)) {
    console.error("Validation error: All fields are required");
    return res.status(400).json({ Error: "All fields are required" });
  }

  const sql =
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

  try {
    const hash = await bcrypt.hash(password.toString(), saltRounds);
    const values = [username, email, hash, ROLES.USER];

    db.query(sql, values, (err, result) => {
      if (err) {
        return handleDatabaseError(
          err,
          res,
          "Inserting data error in server side"
        );
      }
      console.log("Data successfully inserted:", result);
      res.status(201).json({
        Status: "Success",
        Message: "Successfully inserted the data",
      });
    });
  } catch (err) {
    handleDatabaseError(err, res, "Error hashing password");
  }
});

// Login route
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!validateLoginInput(email, password)) {
    console.error("Validation error: Both fields are required");
    return res.status(400).json({ Error: "Both fields are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, data) => {
    if (err) {
      return handleDatabaseError(err, res, "Login error in server side");
    }
    if (data.length > 0) {
      try {
        const match = await bcrypt.compare(
          password.toString(),
          data[0].password
        );
        if (match) {
          console.log("User logged in successfully");
          const username = data[0].username;
          const role = data[0].role;
          const token = jwt.sign({ username, role }, jwtSecret, {
            expiresIn: "1h",
          });
          res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
          });

          if (role === ROLES.ADMIN) {
            return res.json({ Status: "Success", Role: role, isAdmin: true });
          } else {
            // For regular users
            return res.json({ Status: "Success", Role: role, isAdmin: false });
          }
        } else {
          console.warn("Wrong password");
          return res.status(401).json({ Error: "Wrong password" });
        }
      } catch (err) {
        return handleDatabaseError(err, res, "Password match error");
      }
    } else {
      console.warn("No email existed");
      return res.status(404).json({ Error: "No email existed" });
    }
  });
});

// Admin dashboard route (accessible only by admin)
app.get(
  "/admin/dashboard",
  verifyToken,
  verifyRole(ROLES.ADMIN),
  (req, res) => {
    res.json({ Message: "Welcome to admin dashboard" });
  }
);

// Fetching all users (admin function)
app.get("/admin/users", verifyToken, verifyRole(ROLES.ADMIN), (req, res) => {
  const sql = "SELECT id, username, email, role FROM users";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).json({ Error: "Error fetching users" });
    }
    res.json(results);
  });
});

// Updating user role (admin function)
app.put(
  "/admin/users/:userId/update-role",
  verifyToken,
  verifyRole(ROLES.ADMIN),
  (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({ Error: "Role is required" });
    }

    const sql = "UPDATE users SET role = ? WHERE id = ?";

    db.query(sql, [role, userId], (err, result) => {
      if (err) {
        console.error(`Error updating role for user ${userId}:`, err);
        return res
          .status(500)
          .json({ Error: `Error updating role for user ${userId}` });
      }
      res.json({
        Status: "Success",
        Message: `Role updated for user ${userId}`,
      });
    });
  }
);

// Promote user to admin (admin function)
app.post(
  "/admin/users/:userId/promote-to-admin",
  verifyToken,
  verifyRole(ROLES.ADMIN),
  (req, res) => {
    const { userId } = req.params;

    const sql = "UPDATE users SET role = ? WHERE id = ?";
    const values = [ROLES.ADMIN, userId];

    db.query(sql, values, (err, result) => {
      if (err) {
        return handleDatabaseError(err, res, "Error promoting user to admin");
      }
      console.log(`User with id ${userId} promoted to admin`);
      res.json({
        Status: "Success",
        Message: `User with id ${userId} promoted to admin`,
      });
    });
  }
);

// Fetching all categories (admin function)
app.get(
  "/admin/categories",
  verifyToken,
  verifyRole(ROLES.ADMIN),
  (req, res) => {
    const sql = "SELECT id, name FROM categories";

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching categories:", err);
        return res.status(500).json({ Error: "Error fetching categories" });
      }
      res.json(results);
    });
  }
);

// Creating category (admin function)
app.post(
  "/admin/categories",
  verifyToken,
  verifyRole(ROLES.ADMIN),
  (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ Error: "Category name is required" });
    }

    const sql = "INSERT INTO categories (name) VALUES (?)";

    db.query(sql, [name], (err, result) => {
      if (err) {
        console.error("Error creating category:", err);
        return res.status(500).json({ Error: "Error creating category" });
      }
      res
        .status(201)
        .json({ Status: "Success", Message: "Category created successfully" });
    });
  }
);

// Events routes

// Fetching all events (admin function)
app.get("/admin/events", verifyToken, verifyRole(ROLES.ADMIN), (req, res) => {
  const sql = "SELECT id, title, category, status FROM events";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ Error: "Error fetching events" });
    }
    res.json(results);
  });
});

// Approving event (admin function)
app.put(
  "/admin/events/:eventId/approve",
  verifyToken,
  verifyRole(ROLES.ADMIN),
  (req, res) => {
    const { eventId } = req.params;

    const sql = "UPDATE events SET status = ? WHERE id = ?";
    const values = ["approved", eventId];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(`Error approving event ${eventId}:`, err);
        return res
          .status(500)
          .json({ Error: `Error approving event ${eventId}` });
      }
      res.json({
        Status: "Success",
        Message: `Event with id ${eventId} approved`,
      });
    });
  }
);

// Blocking event (admin function)
app.put(
  "/admin/events/:eventId/block",
  verifyToken,
  verifyRole(ROLES.ADMIN),
  (req, res) => {
    const { eventId } = req.params;

    const sql = "UPDATE events SET status = ? WHERE id = ?";
    const values = ["blocked", eventId];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(`Error blocking event ${eventId}:`, err);
        return res
          .status(500)
          .json({ Error: `Error blocking event ${eventId}` });
      }
      res.json({
        Status: "Success",
        Message: `Event with id ${eventId} blocked`,
      });
    });
  }
);

// Create new event (admin function)
app.post("/admin/events", verifyToken, verifyRole(ROLES.ADMIN), (req, res) => {
  const { title, category } = req.body;

  if (!title || !category) {
    return res.status(400).json({ Error: "Title and category are required" });
  }

  const sql = "INSERT INTO events (title, category, status) VALUES (?, ?, ?)";
  const values = [title, category, "pending"];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error creating event:", err);
      return res.status(500).json({ Error: "Error creating event" });
    }
    res
      .status(201)
      .json({ Status: "Success", Message: "Event created successfully" });
  });
});

// Update event (admin function)
app.put(
  "/admin/events/:eventId",
  verifyToken,
  verifyRole(ROLES.ADMIN),
  (req, res) => {
    const { eventId } = req.params;
    const { title, category } = req.body;

    if (!title || !category) {
      return res.status(400).json({ Error: "Title and category are required" });
    }

    const sql = "UPDATE events SET title = ?, category = ? WHERE id = ?";
    const values = [title, category, eventId];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(`Error updating event ${eventId}:`, err);
        return res
          .status(500)
          .json({ Error: `Error updating event ${eventId}` });
      }
      res.json({
        Status: "Success",
        Message: `Event with id ${eventId} updated`,
      });
    });
  }
);

// Delete event (admin function)
app.delete(
  "/admin/events/:eventId",
  verifyToken,
  verifyRole(ROLES.ADMIN),
  (req, res) => {
    const { eventId } = req.params;

    const sql = "DELETE FROM events WHERE id = ?";
    const values = [eventId];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(`Error deleting event ${eventId}:`, err);
        return res
          .status(500)
          .json({ Error: `Error deleting event ${eventId}` });
      }
      res.json({
        Status: "Success",
        Message: `Event with id ${eventId} deleted`,
      });
    });
  }
);

// Start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

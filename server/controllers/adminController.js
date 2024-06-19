import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = parseInt(process.env.SALT_ROUNDS);

export async function createUser(req, res, db, jwtSecret) {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({ Error: "All fields are required" });
  }

  const sql =
    "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";

  try {
    const hash = await bcrypt.hash(password.toString(), saltRounds);
    const values = [username, email, hash, "user"]; // Default role for new users

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Inserting data error in server side:", err);
        return res.status(500).json({ Error: "Error creating user" });
      }
      console.log("Data successfully inserted:", result);
      res.status(201).json({
        Status: "Success",
        Message: "Successfully inserted the data",
      });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ Error: "Error hashing password" });
  }
}

export function loginUser(req, res, db, jwtSecret) {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res
      .status(400)
      .json({ Error: "Both email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, data) => {
    if (err) {
      console.error("Login error in server side:", err);
      return res.status(500).json({ Error: "Error logging in" });
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
            return res.json({ Status: "Success", Role: role, isAdmin: false });
          }
        } else {
          console.warn("Wrong password");
          return res.status(401).json({ Error: "Wrong password" });
        }
      } catch (err) {
        console.error("Password match error:", err);
        res.status(500).json({ Error: "Error matching password" });
      }
    } else {
      console.warn("No email existed");
      res.status(404).json({ Error: "No email existed" });
    }
  });
}

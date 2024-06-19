import { createUser, loginUser } from "./controllers/userController";
import {
  getAdminDashboard,
  getAllUsers,
  promoteUserToAdmin,
  updateUserRole,
} from "./controllers/adminController";
import { verifyRole, verifyToken } from "./middlewares/authMiddleware";

const ROLES = {
  GUEST: "guest",
  USER: "user",
  ADMIN: "admin",
};

export function setupRoutes(app, db, jwtSecret) {
  // Signup route
  app.post("/signup", (req, res) => createUser(req, res, db, jwtSecret));

  // Login route
  app.post("/login", (req, res) => loginUser(req, res, db, jwtSecret));

  // Admin dashboard route (accessible only by admin)
  app.get(
    "/admin/dashboard",
    verifyToken,
    verifyRole(ROLES.ADMIN),
    (req, res) => getAdminDashboard(req, res)
  );

  // Fetching all users (admin function)
  app.get("/admin/users", verifyToken, verifyRole(ROLES.ADMIN), (req, res) =>
    getAllUsers(req, res, db)
  );

  // Updating user role (admin function)
  app.put(
    "/admin/users/:userId/update-role",
    verifyToken,
    verifyRole(ROLES.ADMIN),
    (req, res) => updateUserRole(req, res, db)
  );

  // Promoting user to admin (admin function)
  app.post(
    "/admin/users/:userId/promote-to-admin",
    verifyToken,
    verifyRole(ROLES.ADMIN),
    (req, res) => promoteUserToAdmin(req, res, db)
  );
}

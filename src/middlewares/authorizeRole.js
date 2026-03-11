import { db } from "../config/db.js";
import { roles } from "../db/schema/roles.js";
import { userRoles } from "../db/schema/userRoles.js";
import { eq } from "drizzle-orm";

export const authorizeRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      console.log("USER ID:", userId);

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const result = await db
        .select({
          roleName: roles.name,
        })
        .from(userRoles)
        .leftJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(userRoles.userId, userId));

      if (!result.length) {
        return res.status(403).json({ message: "Role not assigned" });
      }

      // ✅ normalize roles (IMPORTANT FIX)
      const userRolesList = result.map(r =>
        r.roleName?.trim().toLowerCase()
      );

      const allowed = allowedRoles.map(r => r.toLowerCase());

      console.log("USER ROLES:", userRolesList);
      console.log("ALLOWED:", allowed);

      const hasAccess = allowed.some(role =>
        userRolesList.includes(role)
      );

      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      console.error("AUTHORIZE ERROR:", err);
      return res.status(500).json({ message: "Authorization failed" });
    }
  };
};
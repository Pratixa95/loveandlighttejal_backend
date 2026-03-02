import { db } from "../config/db.js";
import { roles } from "../db/schema/roles.js";
import { userRoles } from "../db/schema/userRoles.js";
import { eq } from "drizzle-orm";

export const authorizeRole = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.userId;

      const result = await db
        .select({
          role: roles.name
        })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(userRoles.userId, userId));

      if (result.length === 0) {
        return res.status(403).json({ message: "Role not assigned" });
      }

      const userRolesList = result.map(r => r.role);

      const hasAccess = allowedRoles.some(role =>
        userRolesList.includes(role)
      );

      if (!hasAccess) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user.roles = userRolesList;
      next();
    } catch (err) {
      return res.status(500).json({ message: "Authorization failed" });
    }
  };
};

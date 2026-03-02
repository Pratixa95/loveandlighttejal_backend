import { db } from "../../config/db.js";
import { users } from "../../db/schema/users.js";
import { roles } from "../../db/schema/roles.js";
import { userRoles } from "../../db/schema/userRoles.js";
import { eq, and } from "drizzle-orm";

export const assignRoleToUser = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: "userId and role are required" });
    }

    // check user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // check role exists
    const [roleRow] = await db
      .select()
      .from(roles)
      .where(eq(roles.name, role));

    if (!roleRow) {
      return res.status(404).json({ message: "Role not found" });
    }

    // check if role already assigned
    const existing = await db
      .select()
      .from(userRoles)
      .where(
        and(
          eq(userRoles.userId, userId),
          eq(userRoles.roleId, roleRow.id)
        )
      );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Role already assigned" });
    }

    // assign role
    await db.insert(userRoles).values({
      userId,
      roleId: roleRow.id,
    });

    return res.json({
      message: "Role assigned successfully",
      userId,
      role,
    });
  } catch (err) {
  console.error("ASSIGN ROLE ERROR:", err);
  return res.status(500).json({
    message: "Failed to assign role",
    error: err.message,
  });
}
};

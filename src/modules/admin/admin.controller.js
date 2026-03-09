import { db } from "../../config/db.js"; // ✅ MISSING (ADD THIS)
import { programs } from "../../db/schema/programs.js";
import { users } from "../../db/schema/users.js";
import { roles } from "../../db/schema/roles.js";
import { userRoles } from "../../db/schema/userRoles.js";
import { eq, and } from "drizzle-orm";


// ✅ CREATE PROGRAM
export const createProgram = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "Title and price required" });
    }

    await db.insert(programs).values({
      title,
      description,
      price,
    });

    res.json({ message: "Program created successfully" });

  } catch (err) {
    console.error("CREATE PROGRAM ERROR:", err);
    res.status(500).json({
      message: "Failed to create program",
      error: err.message,
    });
  }
};


// ✅ ASSIGN ROLE (KEEP — YOUR ROUTE NEEDS THIS)
export const assignRoleToUser = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: "userId and role are required" });
    }

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [roleRow] = await db.select().from(roles).where(eq(roles.name, role));

    if (!roleRow) {
      return res.status(404).json({ message: "Role not found" });
    }

    const existing = await db
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleRow.id)));

    if (existing.length > 0) {
      return res.status(409).json({ message: "Role already assigned" });
    }

    await db.insert(userRoles).values({
      userId,
      roleId: roleRow.id,
    });

    res.json({ message: "Role assigned successfully" });

  } catch (err) {
    console.error("ASSIGN ROLE ERROR:", err);
    res.status(500).json({ message: "Failed to assign role" });
  }
};
import bcrypt from "bcryptjs";
import { db } from "../../config/db.js";
import { users } from "../../db/schema/users.js";
import { roles } from "../../db/schema/roles.js";
import { userRoles } from "../../db/schema/userRoles.js";
import { eq } from "drizzle-orm";

/**
 * Find user by email
 */
export const findUserByEmail = async (email) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result.length ? result[0] : null;
};

/**
 * ✅ Find user by ID (REQUIRED by authMiddleware)
 */
export const findUserById = async (id) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return result.length ? result[0] : null;
};

/**
 * Create new user
 */
export const createUser = async ({ firstName, lastName, email, password }) => {
  if (!password) {
    throw new Error("Password is required");
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existing.length > 0) {
    throw new Error("User already exists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      firstName,
      lastName,
      email,
      passwordHash,
    })
    .returning();

  const [customerRole] = await db
    .select()
    .from(roles)
    .where(eq(roles.name, "CUSTOMER"));

  await db.insert(userRoles).values({
    userId: newUser.id,
    roleId: customerRole.id,
  });

  return newUser;
};

/**
 * Authenticate user
 */
export const authenticateUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
};

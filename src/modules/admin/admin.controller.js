import { programs } from "../../db/schema/programs.js";

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
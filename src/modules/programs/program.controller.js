import { db } from "../../config/db.js";
import { programs } from "../../db/schema/programs.js";
import { eq } from "drizzle-orm";

/* ===============================
   CREATE PROGRAM (already done)
================================*/
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
    res.status(500).json({ message: "Failed to create program" });
  }
};

/* ===============================
   GET ALL PROGRAMS
================================*/
export const getAllPrograms = async (req, res) => {
  try {
    const data = await db.select().from(programs);
    res.json(data);
  } catch (err) {
    console.error("GET PROGRAMS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch programs" });
  }
};

/* ===============================
   GET SINGLE PROGRAM
================================*/
export const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db
      .select()
      .from(programs)
      .where(eq(programs.id, id));

    if (!data.length) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(data[0]);
  } catch (err) {
    console.error("GET PROGRAM ERROR:", err);
    res.status(500).json({ message: "Failed to fetch program" });
  }
};

/* ===============================
   UPDATE PROGRAM (ADMIN)
================================*/
export const updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;

    await db
      .update(programs)
      .set({ title, description, price })
      .where(eq(programs.id, id));

    res.json({ message: "Program updated successfully" });
  } catch (err) {
    console.error("UPDATE PROGRAM ERROR:", err);
    res.status(500).json({ message: "Failed to update program" });
  }
};

/* ===============================
   DELETE PROGRAM (ADMIN)
================================*/
export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(programs).where(eq(programs.id, id));

    res.json({ message: "Program deleted successfully" });
  } catch (err) {
    console.error("DELETE PROGRAM ERROR:", err);
    res.status(500).json({ message: "Failed to delete program" });
  }
};
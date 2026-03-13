import { db } from "../../config/db.js";
import { cohorts } from "../../db/schema/cohorts.js";
import { eq } from "drizzle-orm";

/* =========================
   CREATE COHORT (ADMIN)
========================= */
export const createCohort = async (req, res) => {
  try {
    const {
      name,
      programId,
      startDate,
      endDate,
      maxSeats,
    } = req.body;

    await db.insert(cohorts).values({
      name,
      programId,
      startDate,
      endDate,
      maxSeats,
    });

    res.json({ message: "Cohort created successfully" });

  } catch (err) {
    console.error("CREATE COHORT ERROR:", err);
    res.status(500).json({ message: "Failed to create cohort" });
  }
};

/* =========================
   GET BY PROGRAM (PUBLIC)
========================= */
export const getProgramCohorts = async (req, res) => {
  try {
    const { programId } = req.params;

    const data = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.programId, programId));

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
};

/* =========================
   ADMIN ALL COHORTS
========================= */
export const getAllCohorts = async (req, res) => {
  try {
    const data = await db.select().from(cohorts);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
};
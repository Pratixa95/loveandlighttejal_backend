import { db } from "../../config/db.js";
import { enrollments } from "../../db/schema/enrollments.js";
import { cohorts } from "../../db/schema/cohorts.js";
import { eq, and } from "drizzle-orm";

/* =========================
   CREATE ENROLLMENT
========================= */
export const createEnrollment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { cohortId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!cohortId) {
      return res.status(400).json({ message: "cohortId required" });
    }

    /* check already enrolled */
    const existing = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.cohortId, cohortId)
        )
      );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Already enrolled" });
    }

    /* check cohort */
    const cohort = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.id, cohortId));

    if (!cohort.length) {
      return res.status(404).json({ message: "Cohort not found" });
    }

    const seatsFilled = cohort[0].seats_filled;
    const maxSeats = cohort[0].max_seats;

    if (seatsFilled >= maxSeats) {
      return res.status(400).json({ message: "Cohort full" });
    }

    /* insert enrollment */
    await db.insert(enrollments).values({
      userId,
      cohortId,
    });

    /* increase seat */
    await db
      .update(cohorts)
      .set({ seats_filled: seatsFilled + 1 })
      .where(eq(cohorts.id, cohortId));

    res.json({ message: "Enrollment successful" });

  } catch (err) {
    console.error("ENROLL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
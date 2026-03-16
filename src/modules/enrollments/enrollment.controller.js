import { db } from "../../config/db.js";
import { enrollments } from "../../db/schema/enrollments.js";
import { cohorts } from "../../db/schema/cohorts.js";
import { eq, and } from "drizzle-orm";

/* =========================
   CREATE ENROLLMENT
========================= */
export const createEnrollment = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    console.log("BODY:", req.body);

    const userId = String(req.user?.id);
    const cohortId = String(req.body?.cohortId);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!cohortId) {
      return res.status(400).json({ message: "cohortId required" });
    }

    /* already enrolled check */
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

    /* fetch cohort */
    const [cohort] = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.id, cohortId));

    if (!cohort) {
      return res.status(404).json({ message: "Cohort not found" });
    }

    if (cohort.seats_filled >= cohort.max_seats) {
      return res.status(400).json({ message: "Cohort full" });
    }

    /* insert enrollment */
    await db.insert(enrollments).values({
      userId,
      cohortId,
      status: "active",
    });

    /* update seat */
    await db
      .update(cohorts)
      .set({ seats_filled: cohort.seats_filled + 1 })
      .where(eq(cohorts.id, cohortId));

    return res.json({ message: "Enrollment successful" });

  } catch (err) {
    console.error("ENROLL ERROR FINAL:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
};
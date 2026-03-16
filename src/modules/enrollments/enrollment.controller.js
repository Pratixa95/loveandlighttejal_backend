import { db } from "../../config/db.js";
import { cohorts } from "../../db/schema/cohorts.js";
import { eq, sql } from "drizzle-orm";

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
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!cohortId) {
      return res.status(400).json({
        success: false,
        message: "cohortId required",
      });
    }

    /* =========================
       CHECK ALREADY ENROLLED
    ========================== */
    const existing = await db.execute(sql`
      SELECT id FROM enrollments
      WHERE user_id = ${userId}::uuid
      AND cohort_id = ${cohortId}::uuid
    `);

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Already enrolled",
      });
    }

    /* =========================
       FETCH COHORT
    ========================== */
    const [cohort] = await db
      .select()
      .from(cohorts)
      .where(eq(cohorts.id, cohortId));

    if (!cohort) {
      return res.status(404).json({
        success: false,
        message: "Cohort not found",
      });
    }

    if (cohort.seats_filled >= cohort.max_seats) {
      return res.status(400).json({
        success: false,
        message: "Cohort full",
      });
    }

    /* =========================
       INSERT ENROLLMENT
    ========================== */
    await db.execute(sql`
      INSERT INTO enrollments (user_id, cohort_id, status)
      VALUES (${userId}::uuid, ${cohortId}::uuid, 'active')
    `);

    /* =========================
       UPDATE SEAT
    ========================== */
    await db
      .update(cohorts)
      .set({ seats_filled: cohort.seats_filled + 1 })
      .where(eq(cohorts.id, cohortId));

    return res.json({
      success: true,
      message: "Enrollment successful",
    });

  } catch (err) {
    console.error("ENROLL ERROR FINAL:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

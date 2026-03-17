import { db } from "../../config/db.js";
import { cohorts } from "../../db/schema/cohorts.js";
import { enrollments } from "../../db/schema/enrollments.js";
import { eq, and } from "drizzle-orm";

/* =========================
   CREATE ENROLLMENT
========================= */
export const createEnrollment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const cohortId = req.body?.cohortId;

    /* =========================
       VALIDATION
    ========================== */
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
       TRANSACTION (IMPORTANT)
    ========================== */
    await db.transaction(async (tx) => {

      /* 🔹 CHECK DUPLICATE */
      const existing = await tx
        .select()
        .from(enrollments)
        .where(
          and(
            eq(enrollments.userId, userId),
            eq(enrollments.cohortId, cohortId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        throw new Error("Already enrolled");
      }

      /* 🔹 FETCH COHORT */
      const [cohort] = await tx
        .select()
        .from(cohorts)
        .where(eq(cohorts.id, cohortId));

      if (!cohort) {
        throw new Error("Cohort not found");
      }

      if (cohort.seats_filled >= cohort.max_seats) {
        throw new Error("Cohort full");
      }

      /* 🔹 CREATE ENROLLMENT */
      await tx.insert(enrollments).values({
        userId,
        cohortId,
        status: "active",
      });

      /* 🔹 UPDATE SEATS */
      await tx
        .update(cohorts)
        .set({
          seats_filled: cohort.seats_filled + 1,
        })
        .where(eq(cohorts.id, cohortId));
    });

    return res.status(201).json({
      success: true,
      message: "Enrollment successful",
    });

  } catch (err) {
    console.error("ENROLL ERROR:", err.message);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
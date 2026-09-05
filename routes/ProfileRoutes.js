import express from "express";
import pool from "../db.js";
import router from "./PatientRoutes.js";

router.get("/:role/:id", async (req, res) => {
  try {
    const { role, id } = req.params;

    let query;

    if (role === "doctor") {
      query = `
        SELECT doctor_id, user_id, full_name, phone, specialization, status
        FROM doctors
        WHERE doctor_id = $1
      `;
    } else if (role === "receptionist") {
      query = `
        SELECT receptionist_id, user_id, full_name, phone, status
        FROM receptionists
        WHERE receptionist_id = $1
      `;
    } else if (role === "patient") {
      query = `
        SELECT *
        FROM patients
        WHERE patient_id = $1
      `;
    } else {
      return res.status(400).json({
        error: "Invalid role",
      });
    }

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

router.put("/:role/:id", async (req, res) => {
  try {
    const { role, id } = req.params;

    let query;
    let values;

    if (role === "doctor") {
      const { full_name, phone, specialization, status } = req.body;

      query = `
        UPDATE doctors
        SET full_name = $1,
            phone = $2,
            specialization = $3,
            status = $4
        WHERE doctor_id = $5
        RETURNING *
      `;

      values = [full_name, phone, specialization, status, id];
    } else if (role === "receptionist") {
      const { full_name, phone, status } = req.body;

      query = `
        UPDATE receptionists
        SET full_name = $1,
            phone = $2,
            status = $3
        WHERE receptionist_id = $4
        RETURNING *
      `;

      values = [full_name, phone, status, id];
    } else if (role === "patient") {
      const {
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email,
        blood_type,
        allergies,
      } = req.body;

      query = `
        UPDATE patients
        SET first_name = $1,
            last_name = $2,
            date_of_birth = $3,
            gender = $4,
            phone = $5,
            email = $6,
            blood_type = $7,
            allergies = $8
        WHERE patient_id = $9
        RETURNING *
      `;

      values = [
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email,
        blood_type,
        allergies,
        id,
      ];
    } else {
      return res.status(400).json({
        error: "Invalid role",
      });
    }

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Profile not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "Email already exists",
      });
    }

    res.status(500).json({
      error: "Server error",
    });
  }
});
export default router;

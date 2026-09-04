import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM patients");
    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM patients WHERE patient_id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Patient not found",
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

router.post("/", async (req, res) => {
  try {
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

    const result = await pool.query(
      `INSERT INTO patients
      (
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email,
        blood_type,
        allergies
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email,
        blood_type,
        allergies,
      ],
    );

    res.status(201).json(result.rows[0]);
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

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

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

    const result = await pool.query(
      `UPDATE patients
       SET first_name = $1,
           last_name = $2,
           date_of_birth = $3,
           gender = $4,
           phone = $5,
           email = $6,
           blood_type = $7,
           allergies = $8
       WHERE patient_id = $9
       RETURNING *`,
      [
        first_name,
        last_name,
        date_of_birth,
        gender,
        phone,
        email,
        blood_type,
        allergies,
        id,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Patient not found",
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

import { Router } from "express";
import { query } from "../../database/index.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
const router = Router();
const SALT_ROUNDS = 10;
router.get("/", async (req, res, next) => {
    try {
        const result = await query("SELECT * FROM users ORDER BY id");
        res.json(result.rows);
        return;
    }
    catch (err) {
        next(err);
        return;
    }
});
router.get("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const result = await query("SELECT * FROM users WHERE id = $1", [id]);
        if (!result.rows.length) {
            res.status(404).json({ message: "Not found" });
            return;
        }
        res.json(result.rows[0]);
        return;
    }
    catch (err) {
        next(err);
        return;
    }
});
router.post("/", async (req, res, next) => {
    try {
        const { fio, birth_date, email, phone, password, passport_data, is_in_db = false, is_manager = false, is_admin = false, } = req.body;
        const guid = randomUUID();
        const created_at = new Date().toISOString();
        const updated_at = created_at;
        let password_hash = null;
        if (password) {
            password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        }
        const insertQuery = `
      INSERT INTO users
      (guid, fio, birth_date, email, phone, password_hash, passport_data, is_in_db, is_manager, is_admin, created_at, updated_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      RETURNING *;
    `;
        const values = [
            guid,
            fio || null,
            birth_date || null,
            email || null,
            phone || null,
            password_hash,
            passport_data || null,
            is_in_db,
            is_manager,
            is_admin,
            created_at,
            updated_at,
        ];
        const result = await query(insertQuery, values);
        res.status(201).json(result.rows[0]);
        return;
    }
    catch (err) {
        next(err);
        return;
    }
});
router.put("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const { fio, birth_date, email, phone, password, passport_data, is_in_db, is_manager, is_admin, } = req.body;
        const updated_at = new Date().toISOString();
        const fields = [];
        const values = [];
        let idx = 1;
        if (fio !== undefined) {
            fields.push(`fio = $${idx++}`);
            values.push(fio);
        }
        if (birth_date !== undefined) {
            fields.push(`birth_date = $${idx++}`);
            values.push(birth_date);
        }
        if (email !== undefined) {
            fields.push(`email = $${idx++}`);
            values.push(email);
        }
        if (phone !== undefined) {
            fields.push(`phone = $${idx++}`);
            values.push(phone);
        }
        if (passport_data !== undefined) {
            fields.push(`passport_data = $${idx++}`);
            values.push(passport_data);
        }
        if (is_in_db !== undefined) {
            fields.push(`is_in_db = $${idx++}`);
            values.push(is_in_db);
        }
        if (is_manager !== undefined) {
            fields.push(`is_manager = $${idx++}`);
            values.push(is_manager);
        }
        if (is_admin !== undefined) {
            fields.push(`is_admin = $${idx++}`);
            values.push(is_admin);
        }
        if (password !== undefined && password !== null && password !== "") {
            const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
            fields.push(`password_hash = $${idx++}`);
            values.push(password_hash);
        }
        fields.push(`updated_at = $${idx++}`);
        values.push(updated_at);
        if (fields.length === 0) {
            res.status(400).json({ message: "No fields to update" });
            return;
        }
        const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
        values.push(id);
        const result = await query(sql, values);
        if (!result.rows.length) {
            res.status(404).json({ message: "Not found" });
            return;
        }
        res.json(result.rows[0]);
        return;
    }
    catch (err) {
        next(err);
        return;
    }
});
router.delete("/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            res.status(400).json({ message: "Invalid id" });
            return;
        }
        const result = await query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        if (!result.rows.length) {
            res.status(404).json({ message: "Not found" });
            return;
        }
        res.json({ success: true, deleted: result.rows[0] });
        return;
    }
    catch (err) {
        next(err);
        return;
    }
});
export default router;
//# sourceMappingURL=usersRouter.js.map
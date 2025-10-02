import { Router, type Request, type Response, type NextFunction } from "express";
import { query } from "../../database/index.js";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const router: Router = Router();
const SALT_ROUNDS = 10;

/**
 * GET /api/users
 */
router.get(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await query(
        "SELECT * FROM users ORDER BY created_at DESC"
      );
      res.json(result.rows);
      return;
    } catch (err) {
      next(err);
      return;
    }
  }
);

/**
 * GET /api/users/:guid
 */
router.get(
  "/:guid",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guid = req.params.guid;
      if (!guid) {
        res.status(400).json({ message: "Invalid guid" });
        return;
      }

      const result = await query("SELECT * FROM users WHERE guid = $1", [guid]);
      if (!result.rows.length) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json(result.rows[0]);
      return;
    } catch (err) {
      next(err);
      return;
    }
  }
);

/**
 * POST /api/users
 */
router.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        fio,
        birth_date,
        email,
        phone,
        password,
        role = "user", // Добавляем роль по умолчанию
      } = req.body;

      // Проверка обязательных полей
      if (!fio || !email || !password) {
        res.status(400).json({
          message: "Missing required fields: fio, email, password",
        });
        return;
      }

      const guid = randomUUID();
      const salt_password = randomUUID();

      // Определяем роли на основе выбранной роли
      const is_manager = role === "manager";
      const is_admin = role === "admin";

      // Хешируем пароль с солью
      const password_hash = await bcrypt.hash(
        password + salt_password,
        SALT_ROUNDS
      );

      const insertQuery = `
        INSERT INTO users 
        (guid, fio, birth_date, email, phone, password_hash, salt_password, is_manager, is_admin, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
        RETURNING guid, fio, birth_date, email, phone, is_manager, is_admin, created_at, updated_at;
      `;

      const values = [
        guid,
        fio,
        birth_date || null,
        email,
        phone || null,
        password_hash,
        salt_password,
        is_manager,
        is_admin,
      ];

      const result = await query(insertQuery, values);
      res.status(201).json(result.rows[0]);
      return;
    } catch (err: any) {
      if (err.code === "23505") {
        res
          .status(409)
          .json({ message: "User with this email already exists" });
        return;
      }
      next(err);
      return;
    }
  }
);

/**
 * PUT /api/users/:guid
 * Обновляет только переданные поля
 */
router.put(
  "/:guid",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guid = req.params.guid;
      if (!guid) {
        res.status(400).json({ message: "Invalid guid" });
        return;
      }

      const { fio, birth_date, email, phone, password, role } = req.body;

      // Проверяем существование пользователя
      const userExists = await query("SELECT guid FROM users WHERE guid = $1", [
        guid,
      ]);
      if (!userExists.rows.length) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const fields: string[] = [];
      const values: any[] = [];
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

      // Обработка роли
      if (role !== undefined) {
        const is_manager = role === "manager";
        const is_admin = role === "admin";
        fields.push(`is_manager = $${idx++}`);
        values.push(is_manager);
        fields.push(`is_admin = $${idx++}`);
        values.push(is_admin);
      }

      // Обработка пароля
      if (password !== undefined && password !== "") {
        const salt_password = randomUUID();
        const password_hash = await bcrypt.hash(
          password + salt_password,
          SALT_ROUNDS
        );
        fields.push(`password_hash = $${idx++}`);
        values.push(password_hash);
        fields.push(`salt_password = $${idx++}`);
        values.push(salt_password);
      }

      // Всегда обновляем updated_at
      fields.push(`updated_at = NOW()`);

      if (fields.length === 0) {
        res.status(400).json({ message: "No fields to update" });
        return;
      }

      const sql = `UPDATE users SET ${fields.join(
        ", "
      )} WHERE guid = $${idx} RETURNING guid, fio, birth_date, email, phone, is_manager, is_admin, created_at, updated_at`;
      values.push(guid);

      const result = await query(sql, values);
      res.json(result.rows[0]);
      return;
    } catch (err: any) {
      if (err.code === "23505") {
        res
          .status(409)
          .json({ message: "User with this email already exists" });
        return;
      }
      next(err);
      return;
    }
  }
);

/**
 * DELETE /api/users/:guid
 */
router.delete(
  "/:guid",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const guid = req.params.guid;
      if (!guid) {
        res.status(400).json({ message: "Invalid guid" });
        return;
      }

      const result = await query(
        "DELETE FROM users WHERE guid = $1 RETURNING guid, fio, email",
        [guid]
      );

      if (!result.rows.length) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      res.json({ success: true, deleted: result.rows[0] });
      return;
    } catch (err) {
      next(err);
      return;
    }
  }
);

export default router;

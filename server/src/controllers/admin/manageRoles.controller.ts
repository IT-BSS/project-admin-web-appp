import type { Request, Response } from "express";
import { Role } from "../../models/role/role.model";
import type { AddRoleBody, EditRoleBody, EditRoleParams } from "./paramInterfaces.roles";

export async function getAllRoles(req: Request, res: Response) {
    try {
        const roles = await Role.findAll();
        return res.status(200).json({ result: roles });

    } catch (error: any) {
        console.log("Ошибка при обработке запроса на добавление должности: ", error);
        res.status(500).json({ error: "Сервер недоступен." });
    }
}

export async function addRole(req: Request<{}, {}, AddRoleBody, {}>, res: Response) {
    try {
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: "Должно быть указано название должности." });

        const role = await Role.create({ name });

        res.status(200).json({ id: role.guid });
    } catch (error: any) {
        console.log("Ошибка при обработке запроса на добавление должности: ", error);
        res.status(500).json({ error: "Сервер недоступен." });
    }
}

export async function editRole(req: Request<EditRoleParams, {}, EditRoleBody, {}>, res: Response) {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!id) return res.status(400).json({ error: "Должен быть указан ID должности." });
        if (!name) return res.status(400).json({ error: "Должно быть указано новое название должности." });

        const role = await Role.findOne({ where: { guid: id } });
        if (!role) return res.status(404).json({ error: "Роль с указанным ID не найдена." });

        role.name = name;
        role.save();

        res.status(200).json({ success: true });
    } catch (error: any) {
        console.log("Ошибка при обработке запроса на изменение должности: ", error);
        res.status(500).json({ error: "Сервер недоступен." });
    }
}
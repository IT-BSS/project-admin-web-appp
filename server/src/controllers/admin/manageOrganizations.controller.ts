import type { Request, Response } from 'express'
import { Organization } from '../../models/organization/organization.model'
import { User } from '../../models/user/user.model'

import type { GetAllOrganizationsQuery, GetOrganizationQuery, AddOrganizationBody } from './paramInterfaces.organizations'
import { Role } from '../../models/role/role.model';
import type { AddUserToOrganizationBody, RemoveUserFromOrganizationBody, RemoveUserFromOrganizationParams } from './paramInterfaces.users';

export async function getAllOrganizations(req: Request<{}, {}, {}, GetAllOrganizationsQuery>, res: Response) {
    try {
        let { page, limit } = req.query;

        page = page || 1;
        limit = limit || 10;

        const offset = (page - 1) * limit;
        
        const { rows: organizations, count } = 
            await Organization.findAndCountAll({
                 offset, limit,
                 include: [
                    {
                        model: User,
                        as: "members", // это ДОЛЖНО совпадать с тем, как эта связь обозвана в models/associations.ts
                        through: { attributes: [ "permissions" ] },
                        include: [ { model: Role } ]
                    }
                 ]
            });
        
        res.status(200).json({
            result: organizations,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit)
            }
        });

    } catch(error: any) {
        console.error('Ошибка при обработке запроса на получение всех организаций:', error);
        res.status(500).json({ error: "Сервер недоступен. "});
    }
}

export async function getOrganization(req: Request<{}, {}, {}, GetOrganizationQuery>, res: Response){ 
    try {
        const { id } = req.query;

        let foundOrganization : Organization | null = null;

        foundOrganization = await Organization.findOne({ 
            where: {guid: id },
            include: [
                {
                    model: User,
                    as: "members", // это ДОЛЖНО совпадать с тем, как эта связь обозвана в models/associations.ts
                    through: { attributes: [ "permissions" ] },
                    include: [ { model: Role } ]
                }
                ]
             });
        
        if (!foundOrganization) return res.status(404).json({ error: "Организация не найдена!" });
        
        res.json(foundOrganization);

    } catch (error: any) {
        console.error('Ошибка при обработке запроса на получение организации:', error);
        res.status(500).json({ error: "Сервер недоступен. " });
    }
}

export async function addOrganization(req: Request<{}, {}, AddOrganizationBody, {}>, res: Response) {
    try {
        const { name, 
            description, 
            address, 
            phone, 
            email, 
            inn, 
            kpp 
        } = req.body;

        if (!name)          return res.status(400).json({ error: "Необходимо название организации." });
        if (!description)   return res.status(400).json({ error: "Необходимо описание организации." });
        if (!address)       return res.status(400).json({ error: "Необходим адрес организации." });
        if (!phone)         return res.status(400).json({ error: "Необходим телефон организации." });
        if (!email)         return res.status(400).json({ error: "Необходима электронная почта организации." });
        if (!inn)           return res.status(400).json({ error: "Необходим ИНН организации." });
        if (!kpp)           return res.status(400).json({ error: "Необходим КПП организации." });

        let organization: Organization = await Organization.create({
            name,
            description,
            address,
            phone,
            email,
            inn,
            kpp
        });

        res.status(200).json({ id: organization.guid });

    } catch (error: any) {
        console.error("Ошибка при обработке запроса на добавление организации: ", error);
        res.status(500).json({ error: "Сервер недоступен." });
    }
}

export async function addUserToOrganization(
        req: Request<{}, {}, AddUserToOrganizationBody, {}>, 
        res: Response) {
    try {
        const { userId, organizationId, roleId, permissions } = req.body;
        
        console.log(userId, organizationId, roleId);
        if (!userId || !organizationId || !roleId) {
            return res.status(400).json({ 
                error: "Должны быть предоставлены ID пользователя, ID организации и ID роли." 
            });
        }

        const user = await User.findOne({ where: { guid: userId } });
        if (!user) return res.status(404).json({ error: "Пользователь с указанным ID не найден." });

        const organization = await Organization.findOne({ where: { guid: organizationId } });
        if (!organization) return res.status(404).json({ error: "Организация с указанным ID не найдена." });

        const role = await Role.findOne({ where: { guid: roleId } });
        if (!role) return res.status(404).json({ error: "Роль с указанным ID не найдена." });

        await user.addOrganization(organization, { 
            through: { 
                roleId: role.id, 
                permissions: permissions ?? "" 
            } 
        });

        res.status(200).json({ success: true });
    } catch (error: any) {
        console.error("Ошибка при обработке запроса на добавление пользователя в организацию: ", error);
        res.status(500).json({ error: "Сервер недоступен." });
    }
}

export async function removeUserFromOrganization(
    req: Request<RemoveUserFromOrganizationParams, {}, RemoveUserFromOrganizationBody, {}>,
    res: Response) 
{
    try {
        const { id } = req.params; // GUID пользователя
        const { organizationId } = req.body;

        if (!id) return res.status(400).json({ error: "Должен быть предоставлен ID пользователя." });
        if (!organizationId) return res.status(400).json({ error: "Должен быть предоставлен ID организации." });

        const user = await User.findOne({ where: { guid: id } });
        if (!user) return res.status(404).json({ error: "Пользователь с указанным ID не найден." });

        const organization = await Organization.findOne({ where: { guid: organizationId } });
        if (!organization) return res.status(404).json({ error: "Организация с указанным ID не найдена." });

        await user.removeOrganization(organization);

        res.status(200).json({ success: true });
    } catch (error: any) {
        console.error("Ошибка при обработке запроса на удаление пользователя из организации: ", error);
        res.status(500).json({ error: "Сервер недоступен." });
    }
}
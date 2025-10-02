import type { Request, Response } from 'express'
import { Organization } from '../../models/organization/organization.model'
import type { GetAllOrganizationsQuery, GetOrganizationQuery, AddOrganizationBody } from './paramInterfaces.organizations'

export async function getAllOrganizations(req: Request<{}, {}, {}, GetAllOrganizationsQuery>, res: Response) {
    try {
        let { page, limit } = req.query;

        page = page || 1;
        limit = limit || 10;

        const offset = (page - 1) * limit;
        
        const { rows: organizations, count } = await Organization.findAndCountAll({ offset, limit });
        
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

        foundOrganization = await Organization.findOne({ where: {guid: id } });
        
        if (!foundOrganization) return res.status(404).json({ error: "Организация не найдена!" });
        
        res.json(foundOrganization);

    } catch (error: any) {
        console.error('Ошибка при обработке запроса на получение организации:', error);
        res.status(500).json({ error: "Сервер недоступен. " });
    }
}

export async function addOrganization(req: Request<{}, {}, AddOrganizationBody, {}>, res: Response) {
    try {
        const { name, description, address, phone, email, inn, kpp } = req.body;

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
    } catch (error: any) {
        console.error("Ошибка при обработке запроса на добавление организации: ", error);
        res.status(500).json({ error: "Сервер недоступен." });
    }
}
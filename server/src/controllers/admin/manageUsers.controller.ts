import type { Request, Response } from 'express'
import { User } from '../../models/user/user.model'
import type { GetUserQuery, GetAllUsersQuery, AddUserBody } from './paramInterfaces';

export async function getAllUsers(req: Request<{}, {}, {}, GetAllUsersQuery>, res: Response) {
  try {
    let { page, limit } = req.query;
    
    page = page || 1;
    limit = limit || 10;

    const offset = (page - 1) * limit;

    const { rows: users, count } = await User.findAndCountAll({ offset, limit });

    res.json({
      result: users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
    
  } catch (error: any) {
    console.error("Ошибка при обработке запроса на получение пользователя: ", error);
    return res.status(500).json({ error: 'Сервер недоступен. '});
  }
}

export async function getUser(req: Request<{}, {}, {}, GetUserQuery>, res: Response)  {
  try {
    const { login, id } = req.query;

    let foundUser: User | null = null;
    
    if (id) foundUser = await User.findOne({ where: { guid: id }});
    else if (login) foundUser = await User.findOne({ where: { login: login }});

    if (!foundUser) return res.status(404).json({ error: "Пользователь не найден." });
    
    res.json(foundUser);

  } catch (error: any) {
    console.error('Ошибка при обработке запроса на получение пользователя:', error);
    return res.status(500).json({ error: 'Сервер недоступен.' });
  }
};



export async function addUser(req: Request<{}, {}, AddUserBody, {}>, res: Response) {
  try {
    const { name, surname, middlename, 
        birthDate, 
        email, login, phone, 
        password, 
        passportData } = req.body;

        if (!name)          return res.status(400).json({ success: false, error: "Необходимо имя пользователя." });
        if (!surname)       return res.status(400).json({ success: false, error: "Необходима фамилия пользователя." });
        if (!middlename)    return res.status(400).json({ success: false, error: "Необходимо отчество пользователя." });
        if (!email)         return res.status(400).json({ success: false, error: "Необходима электронная почта пользователя." });
        if (!birthDate)      return res.status(400).json({ success: false, error: "Необходимы данные о дне рождения пользователя." });
        if (!login)         return res.status(400).json({ success: false, error: "Необходим логин пользователя." });
        if (!password)      return res.status(400).json({ success: false, error: "Необходим пароль пользователя." });
        if (!phone)         return res.status(400).json({ success: false, error: "Необходим телефон пользователя." });
        if (!passportData) return res.status(400).json({ success: false, error: "Необходимы паспортные данные пользователя." });

        let passwordHash = password; // TODO TOP PRIORITY - implement hash function
        let isBanned = false, isManager = false, isAdmin = false;
        let guid = "0";
        let user: User = await User.create({
          guid,
          name, surname, middlename, 
          birthDate, 
          email, login, phone, 
          passwordHash, 
          passportData,
          isBanned,
          isManager,
          isAdmin,
        });
      
        user.guid = user.id.toString(); // TODO PRE-TOP PRIORITY - implement correct GUID creation
        user.save();

        res.json({ success: true, id: user.guid });

  } catch(error: any) {
      console.error("Ошибка при обработке запроса на добавление пользователя: ", error);
      res.status(500).json({ error: "Сервер недоступен." });
  }
}

export async function editUser(req: Request, res: Response) {

}
import type { Request, Response } from 'express'
import { User } from '../../models/user/user.model'
import type { 
  GetUserQuery, 
  GetAllUsersQuery, 
  AddUserBody,
  EditUserBody,
  BanUserBody,
  DeleteUserParams,
  EditUserParams
} from './paramInterfaces.users';
import { hashPassword } from '../../models/user/hashPassword';

export async function getAllUsers(req: Request<{}, {}, {}, GetAllUsersQuery>, res: Response) {
  try {
    let { page, limit, role } = req.query;
    
    page = page || 1;
    limit = limit || 10;

    const offset = (page - 1) * limit;

    let where: any = {};

    if (role === "manager") where.isManager = true;
    if (role === "admin") where.isAdmin = true;

    const { rows: users, count } = await User.findAndCountAll({ offset, limit, where });

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

export async function banUser(req: Request<{}, {}, BanUserBody, {}>, res: Response) 
{
  try {
    let { id } = req. body;
    let foundUser: User | null = null;
      
      if (id) foundUser = await User.findOne({ where: { guid: id }});
      if (!foundUser) return res.status(404).json({ error: "Пользователь не найден." });
      
      foundUser.isBanned = true;
      foundUser.save();
      res.status(200);
  }
  catch(error: any)
  {
      console.error("Ошибка при обработке запроса на блокировку пользователя: ", error);
      res.status(500).json({ error: "Сервер недоступен." });
  }
}

export async function unbanUser(req: Request<{}, {}, BanUserBody, {}>, res: Response) {
  try {
    let { id } = req. body;
    let foundUser: User | null = null;
      
      if (id) foundUser = await User.findOne({ where: { guid: id }});
      if (!foundUser) return res.status(404).json({ error: "Пользователь не найден." });
      
      // Да, эта функция отличается от "banUser" только следующей строчкой кода.
      // Объединять их и городить условную "switchUserBanState" не захотелось.
      foundUser.isBanned = false; 
      foundUser.save();
      res.status(200);
  }
  catch(error: any)
  {
      console.error("Ошибка при обработке запроса на разблокировку пользователя: ", error);
      res.status(500).json({ error: "Сервер недоступен." });
  }
}

export async function addUser(req: Request<{}, {}, AddUserBody, {}>, res: Response) {
  try {
    const { name, surname, middlename, 
        birthDate, 
        email, login, phone, 
        password, 
        passportData, role } = req.body;

        if (!name)          return res.status(400).json({ error: "Необходимо имя пользователя." });
        if (!surname)       return res.status(400).json({ error: "Необходима фамилия пользователя." });
        if (!middlename)    return res.status(400).json({ error: "Необходимо отчество пользователя." });
        if (!email)         return res.status(400).json({ error: "Необходима электронная почта пользователя." });
        if (!birthDate)     return res.status(400).json({ error: "Необходимы данные о дне рождения пользователя." });
        if (!login)         return res.status(400).json({ error: "Необходим логин пользователя." });
        if (!password)      return res.status(400).json({ error: "Необходим пароль пользователя." });
        if (!phone)         return res.status(400).json({ error: "Необходим телефон пользователя." });
        if (!passportData)  return res.status(400).json({ error: "Необходимы паспортные данные пользователя." });
        
        let passwordHash = await hashPassword(password);
        let isBanned = false, isManager = role === "manager", isAdmin = role === "admin";
        let user: User = await User.create({
          name, surname, middlename, 
          birthDate, 
          email, login, phone, 
          passwordHash, 
          passportData,
          isBanned,
          isManager,
          isAdmin,
        });
        
        res.status(200).json({ id: user.guid });

  } catch (error: any) {
      console.error("Ошибка при обработке запроса на добавление пользователя: ", error);
      res.status(500).json({ error: "Сервер недоступен." });
  }
}

export async function editUser(req: Request<EditUserParams, {}, EditUserBody, {}>, res: Response) {
  try {
    const { id } = req.params;
    const { name, surname, middlename, 
        birthDate, 
        email, login, phone, 
        password, 
        passportData, isAdmin, isManager } = req.body;
    
    // Так как какие-то поля могут быть пустыми в теле запроса (т.е их не нужно обновлять),
    // было решено найти пользователя по GUID и каждое поле обновлять отдельно, если оно есть,
    // вместо того, чтобы пользоваться User.update(...).

    const user: User | null = await User.findOne({ where: { guid: id }});
    if (!user) return res.status(404).json({ error: "Пользователя с данным ID не существует." });

    if (name) user.name = name;
    if (surname) user.surname = surname;
    if (middlename) user.middlename = middlename;
    if (birthDate) user.birthDate = birthDate;
    if (email) user.email = email;
    if (login) user.login = login;
    if (phone) user.phone = phone;
    if (password) user.passwordHash = await hashPassword(password);
    if (passportData) user.passportData = passportData;
    
    user.isAdmin = isAdmin;
    user.isManager = isManager;

    await user.save();
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Ошибка при обработке запроса на изменение данных пользователя: ", error);
    res.status(500).json({ error: "Сервер недоступен. "});
  }
}

export async function deleteUser(req: Request<DeleteUserParams>, res: Response) {
  try {
    const id = req.params.id;

    if (!id) return res.status(400).json({ error: "Необходим ID пользователя." })

    let user: User | null = await User.findOne({ where: { guid: id } });

    if (!user) return res.status(404).json({ error: "Пользователь с указанным ID не найден. "});

    await user.destroy();
    
    res.status(200).json({ success: true });

  } catch (error: any) {
    console.error("Ошибка при обработке запроса на изменение данных пользователя: ", error);
    res.status(500).json({ error: "Сервер недоступен." });
  }
}
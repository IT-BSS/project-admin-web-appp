import type { Request, Response } from 'express'
import { User } from '../../models/user/user.model'

interface GetUserQuery {
  login?: string;
  id?: number;
}
export async function getUser(req: Request<{}, {}, {}, GetUserQuery>, res: Response)  {
  try {
    const { login, id } = req.query;

    let foundUser: User | null = null;
    
    if (id) foundUser = await User.findOne({ where: { guid: id }});
    else if (login) foundUser = await User.findOne({ where: { login: login }});

    if (!foundUser) return res.status(404).json({ error: "Пользователь не найден." });
    
    res.json(foundUser);

  } catch (error) {
    console.error('Ошибка при обработке запроса на получение пользователя:', error);
    return res.status(500).json({ error: 'Сервер недоступен.' });

  }
};
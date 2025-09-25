import {Router} from "express";
import {registerUser, loginUser} from "@/services/auth/authService";
const router = Router();

router.post('/register', async (req, res) =>
{
    try
    {
        const {fio, birth_date, email, phone, password} = req.body;
        const user = await registerUser(fio, birth_date, email, phone, password);
        res.status(201).send({user});
    }
    catch (e)
    {
        res.status(500).send({message: e});
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const tokens = await loginUser(email, password);
        res.json(tokens);
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
});

export default router;
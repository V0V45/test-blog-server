import express from "express";
import cors from "cors";
import { registeredUsers } from "./registeredUsers.js";
import { allPosts } from "./allPosts.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/api/postList", (req, res) => {
    res.json(allPosts);
});

app.post("/api/register", (req, res) => {
    const { name, surname, email, password } = req.body;
    const userExists = registeredUsers.some((user) => user.email === email);
    if (userExists) {
        return res.status(400).json({message: "Пользователь с таким e-mail уже существует"});
    }
    const newUser = {
        id: registeredUsers.length + 1,
        role: "user",
        email,
        password,
        name,
        surname
    };
    registeredUsers.push(newUser);
    res.json({ message: "Регистрация прошла успешно" })
});

app.post("/api/createPost", (req, res) => {
    const { content, userName, userSurname, userId } = req.body;
    const fullDateTime = new Date();
    const dateTime = fullDateTime.toDateString();
    const newPost = {
        postId: allPosts.length + 1,
        userId,
        userName: `${userName} ${userSurname}`,
        dateTime,
        content
    };
    console.log(newPost);
    allPosts.push(newPost);
    res.json(newPost);
});

app.post("/api/login", (req, res) => {
    console.log(`Попытка авторизации: ${req.body.email} ${req.body.password}`);
    const { email, password } = req.body;
    const user = registeredUsers.find((user) => user.email === email);

    if (user) {
        if (user.password === password) {
            res.json({ name: user.name, surname: user.surname, email: user.email, role: user.role, id: user.id, message: "Успешный вход" });
        } else {
            res.status(401).json({ message: "Неверный пароль" });
        }
    } else {
        res.status(404).json({ message: "Пользователь не найден" });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порте ${PORT}`);
});
import express from "express"
import mongoose from "mongoose"
import router from "./routes/UserRoutes.js";
import fileUpload from "express-fileupload";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"; // 👈 Добавили импорт CORS

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

const PORT = 5000;
const app = express()

app.use(cors()) // 👈 Подключаем CORS
app.use(express.json())
app.use(fileUpload({}))

// 👇 ЭТИ ДВЕ СТРОКИ ОТВЕЧАЮТ ЗА ФРОНТЕНД
// 1. Раздаем файлы (html, css, js) из папки public
app.use(express.static(path.resolve(__dirname, "public")))
// 2. Если пользователь зашел просто на localhost:5000, отдаем index.html
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.use('/uploads', express.static(path.resolve(__dirname, "uploads")))
app.use(router)

mongoose.connect("mongodb://localhost:27017/usersbd").then(()=>{
    console.log("Успешное подключение к БД");
}).catch((err)=>{
    console.log("Ошибка при подключении к БД: " + err );
    process.exit(1)
})

app.listen(PORT, ()=>{
    console.log("Успешное подключение сервера: " + PORT);
})
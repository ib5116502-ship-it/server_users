import fileService from "../services/fileService.js";
import User from "../models/User.js";
import hashService from "../services/hashService.js";
import tokenService from "../services/tokenService.js";

class UserController {
  // получение всех пользовталей
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(404).json("Ошибка при получении пользователей: " + err);
    }
  }

  async getUserOne(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json("Такого пользователя не существует!");
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json("Ошибка при выполнении запроса: " + err);
    }
  }

  async registration(req, res) {
    try {
      let fileName = null;

      if (req.files && req.files.avatar) {
        fileName = await fileService.saveFile(req.files.avatar);
      }

      const { name, lastName, age, email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким email уже существует" });
      }
  

      const hashPassword = await hashService.hashPassword(password);


      const newUser = await User.create({
        name,
        lastName,
        age,
        email,
        password: hashPassword,
        avatar: fileName,
      });

      res.status(200).json(newUser);
      newUser.save();
    } catch (err) {
      res.status(500).json("Ошибка при регистрации: " + err);
      console.log("Ошибка при регистрации!" + err);
    }
  }

  async authorization(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "Неверный email или пароль" });
      }

      const isPassValid = await hashService.comparePassword(
        password,
        user.password,
      );

      if (!isPassValid) {
        res.status(400).json({ message: "Неверный email или пароль" });
      }
      const token = tokenService.generateToken({
        id: user._id
      })

      return res.status(200).json({token, token,
        user: {
          id: user._id,
          email: user.email,
        }});
       
    } catch (err) {
      console.log(err);

      res.status(500).json({ message: "Ошибка при авторизации" });
    }
  }

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, lastName, age } = req.body;
      const updateUser = await User.findByIdAndUpdate(
        id,
        {
          name,
          lastName,
          age,
        },
        { new: true },
      );
      if (!updateUser) {
        res.status(404).json("Такого пользователя не существует!");
      }
      res.status(200).json(updateUser);
    } catch (err) {
      res.status(500).json("Ошибка при обновлении: " + err);
    }
  }

  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        res.status(404).json("Такого пользователя не существует!");
      }
      res.status(200).json("Пользователь успешно удален!");
    } catch (err) {
      res.status(500).json("Ошибка при выполнении запроса: " + err);
    }
  }
}

export default new UserController();

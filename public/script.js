const API = {
  register: "/registration", // 👈 Убедитесь, что эти пути совпадают с UserRoutes.js
  login: "/login",       // 👈 Убедитесь, что эти пути совпадают с UserRoutes.js
};

/* ------- Tabs ------- */
const tabs = document.querySelectorAll(".tab");
const slider = document.querySelector(".slider");
const forms = {
  login: document.getElementById("login-form"),
  register: document.getElementById("register-form"),
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const target = tab.dataset.tab;
    Object.entries(forms).forEach(([key, form]) => {
      form.classList.toggle("active", key === target);
    });
    slider.classList.toggle("right", target === "register");
  });
});

/* ------- File name preview ------- */
const avatarInput = document.getElementById("register-avatar");
const fileName = document.getElementById("file-name");
avatarInput.addEventListener("change", () => {
  fileName.textContent = avatarInput.files[0]?.name || "Выберите аватар";
});

/* ------- Helpers ------- */
function showMessage(el, text, type = "error") {
  el.textContent = text;
  el.className = `message ${type}`;
}

/* ------- Login ------- */
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("login-message");
  const btn = e.target.querySelector(".btn");
  const data = {
    email: document.getElementById("login-email").value.trim(),
    password: document.getElementById("login-password").value,
  };

  btn.disabled = true;
  showMessage(msg, "Отправка...");

  try {
    const res = await fetch(API.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Проверяем, что сервер вернул именно JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Ошибка на сервере (не JSON ответ)");
    }

    const json = await res.json();
    console.log("Ответ сервера (вход):", json);

    if (!res.ok) throw new Error(json.message || "Ошибка входа");

    showMessage(msg, "Успешный вход ✅", "success");
    
    // 👇 СОХРАНЯЕМ ТОКЕН (JWT) И ДАННЫЕ ПОЛЬЗОВАТЕЛЯ
    if (json.token) {
        localStorage.setItem("token", json.token);
    }
    if (json.user) {
        localStorage.setItem("user", JSON.stringify(json.user));
    }

    setTimeout(() => (window.location.href = "/"), 800); // Редирект на главную
  } catch (err) {
    showMessage(msg, err.message);
  } finally {
    btn.disabled = false;
  }
});

/* ------- Register ------- */
document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = document.getElementById("register-message");
  const btn = e.target.querySelector(".btn");

  const formData = new FormData();
  formData.append("name", document.getElementById("register-name").value.trim());
  formData.append("lastName", document.getElementById("register-lastName").value.trim());
  formData.append("age", document.getElementById("register-age").value.trim());
  formData.append("email", document.getElementById("register-email").value.trim());
  formData.append("password", document.getElementById("register-password").value);
  
  if (avatarInput.files[0]) formData.append("avatar", avatarInput.files[0]);

  btn.disabled = true;
  showMessage(msg, "Регистрация...");

  try {
    const res = await fetch(API.register, {
      method: "POST",
      body: formData, // multipart/form-data (не задавайте Content-Type!)
    });

    // Проверяем, что сервер вернул именно JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Ошибка на сервере (не JSON ответ)");
    }

    const json = await res.json();
    console.log("Ответ сервера (регистрация):", json);

    if (!res.ok) throw new Error(json.message || "Ошибка регистрации");

    showMessage(msg, "Аккаунт создан ✅", "success");

    // Переключаемся на форму входа
    setTimeout(() => {
      document.querySelector('.tab[data-tab="login"]').click();
      document.getElementById("login-email").value =
        document.getElementById("register-email").value;
      document.getElementById("register-form").reset();
      fileName.textContent = "Выберите аватар";
    }, 900);
  } catch (err) {
    showMessage(msg, err.message);
  } finally {
    btn.disabled = false;
  }
});
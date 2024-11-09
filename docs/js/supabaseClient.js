// Конфигурация Supabase
const SUPABASE_URL = 'https://dfvgrjkcdnlbrugkwsih.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdmdyamtjZG5sYnJ1Z2t3c2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5OTA2NjUsImV4cCI6MjA0NjU2NjY2NX0.7XZk4c0x78zPC1egRv-H-elhHhhGoSOfasiLd7cyh4k';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Функция регистрации
async function registerUser(username, password) {
  try {
    // Создание аккаунта
    const { user, error } = await supabase.auth.signUp({
      email: `${username}@example.com`,
      password: password,
    });

    if (error) throw error;

    // Если регистрация успешна, добавляем имя пользователя в базу данных
    const { data, insertError } = await supabase
      .from("users")
      .insert([{ id: user.id, username: username }]);

    if (insertError) throw insertError;

    alert("Регистрация успешна! Проверьте почту для подтверждения.");
  } catch (error) {
    console.error("Ошибка регистрации:", error.message);
    alert("Ошибка регистрации: " + error.message);
  }
}

// Функция входа
async function loginUser(username, password) {
  try {
    const email = `${username}@example.com`;
    const { user, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    alert("Вход успешен!");
    // Здесь можно добавить перенаправление на главную страницу после успешного входа
  } catch (error) {
    console.error("Ошибка входа:", error.message);
    alert("Ошибка входа: " + error.message);
  }
}

// Функция выхода из аккаунта
async function logoutUser() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    alert("Вы успешно вышли из аккаунта.");
    // Можно добавить редирект на страницу входа после выхода
  } catch (error) {
    console.error("Ошибка выхода:", error.message);
    alert("Ошибка выхода: " + error.message);
  }
}

// Функция для получения текущего пользователя
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    return user;
  } else {
    alert("Вы не авторизованы.");
    return null;
  }
}

// Функция удаления аккаунта
async function deleteUserAccount() {
  try {
    const user = await getCurrentUser();
    if (!user) return;

    // Удаление записи из таблицы users
    const { error: deleteError } = await supabase
      .from("users")
      .delete()
      .eq("id", user.id);

    if (deleteError) throw deleteError;

    // Выход из аккаунта перед удалением
    await supabase.auth.signOut();

    alert("Ваш аккаунт удален.");
  } catch (error) {
    console.error("Ошибка удаления аккаунта:", error.message);
    alert("Ошибка удаления аккаунта: " + error.message);
  }
}

// Обработчик формы регистрации
function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    alert("Пароли не совпадают.");
    return;
  }

  registerUser(username, password);
}

// Обработчик формы входа
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  loginUser(username, password);
}

// Обработчик выхода
function handleLogout(event) {
  event.preventDefault();
  logoutUser();
}

// Обработчик удаления аккаунта
function handleDeleteAccount(event) {
  event.preventDefault();
  const confirmDelete = confirm("Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.");
  if (confirmDelete) {
    deleteUserAccount();
  }
}

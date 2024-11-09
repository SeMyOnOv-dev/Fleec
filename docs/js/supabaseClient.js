// Подключение Supabase
import { createClient } from '@supabase/supabase-js';

// Инициализация клиента Supabase
const SUPABASE_URL = 'https://dfvgrjkcdnlbrugkwsih.supabase.co'; // Замените на ваш Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmdmdyamtjZG5sYnJ1Z2t3c2loIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5OTA2NjUsImV4cCI6MjA0NjU2NjY2NX0.7XZk4c0x78zPC1egRv-H-elhHhhGoSOfasiLd7cyh4k'; // Замените на ваш анонимный ключ (anon public key)
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Функция для регистрации пользователя
async function registerUser(username, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: `${username}@example.com`, // или другой способ идентификации
      password: password
    });

    if (error) {
      console.error("Ошибка регистрации:", error.message);
      alert("Ошибка регистрации: " + error.message);
      return;
    }

    const { data: userData, error: insertError } = await supabase.from("users").insert([
      { id: data.user.id, username: username }
    ]);

    if (insertError) {
      console.error("Ошибка при добавлении данных:", insertError.message);
    } else {
      console.log("Регистрация успешна:", userData);
      alert("Регистрация успешна! Проверьте почту для подтверждения.");
    }
  } catch (err) {
    console.error("Произошла ошибка:", err);
  }
}

// Функция для входа пользователя
async function loginUser(username, password) {
  try {
    const email = `${username}@example.com`;
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error("Ошибка входа:", error.message);
      alert("Ошибка входа: " + error.message);
    } else {
      console.log("Вход успешен:", data);
      alert("Вход успешен!");
    }
  } catch (err) {
    console.error("Произошла ошибка:", err);
  }
}

// Функция для выхода пользователя
async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Ошибка выхода:", error.message);
    alert("Ошибка выхода: " + error.message);
  } else {
    console.log("Выход успешен");
    alert("Вы успешно вышли из аккаунта");
  }
}

// Функция для получения текущего пользователя
function getCurrentUser() {
  return supabase.auth.getUser();
}

// Экспорт функций
export { registerUser, loginUser, logoutUser, getCurrentUser };

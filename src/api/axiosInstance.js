// src/api/axiosInstance.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:9000/api/v1',
});

// Установим токен в заголовки
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Обработка ошибок
instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Показываем уведомление
            alert('Сессия истекла. Пожалуйста, войдите снова.');

            // Удаляем токен
            localStorage.removeItem('token');

            // Через 1 секунду редиректим
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }

        return Promise.reject(error);
    }
);

export default instance;

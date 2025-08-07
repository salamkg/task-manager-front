import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        //Удаляем старый токен
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];

        try {
            const response = await axios.post('http://localhost:9000/api/auth/login', null, {
                params: {
                    username,
                    password,
                },
            });

            const token = response.data;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            navigate('/'); // или на страницу проектов
        } catch (err) {
            setError('Неверный логин или пароль');
            console.error(err);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="bg-white p-5 rounded shadow" style={{ width: '100%', maxWidth: '400px' }}>
                <h3 className="mb-4">Вход в систему</h3>
                <form onSubmit={handleLogin}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                        <label className="form-label">Логин</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Пароль</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <p className="mt-3">
                        Нет аккаунта? <a href="/register">Зарегистрироваться</a><br />
                        <a href="/forgot-password">Забыли пароль?</a>
                    </p>

                    <button type="submit" className="btn btn-primary">Войти</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;

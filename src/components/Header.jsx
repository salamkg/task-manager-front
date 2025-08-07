import React, { useState } from "react";
import {
    IconBell,
    IconSettings,
    IconUser,
    IconSearch
} from "@tabler/icons-react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";


const Header = () => {

    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const getUserId = () => {
        const token = localStorage.getItem("token");
        if (!token) return null;
        try {
            const decoded = jwtDecode(token);
            console.log(decoded);
            return decoded.id;
        } catch (error) {
            console.error("Ошибка при декодировании токена:", error);
            return null;
        }
    };


    const handleLogout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization'];
        navigate("/login");
    }

    return (
        <header className="navbar navbar-expand-md navbar-light bg-white border-bottom px-4 py-2">
            {/* Логотип */}
            <Link to="/" className="navbar-brand d-flex align-items-center">
                <span className="fs-4 fw-bold text-primary">Task Manager</span>
            </Link>

            {/* Поиск по центру */}
            <div className="mx-auto w-50 position-relative">
                <input
                    type="text"
                    className="form-control ps-5"
                    placeholder="Поиск..."
                />
                <IconSearch
                    size={18}
                    className="position-absolute top-50 start-0 translate-middle-y ms-2 text-muted"
                />
            </div>

            {/* Иконки справа */}
            <div className="d-flex align-items-center gap-3 position-relative">
                <IconBell size={22} className="cursor-pointer text-muted" />
                <IconSettings size={22} className="cursor-pointer text-muted" />

                {/* Иконка пользователя */}
                <div className="dropdown">
                    <div
                        className="cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        <IconUser size={24} className="text-muted" />
                    </div>

                    {menuOpen && (
                        <div
                            className="dropdown-menu dropdown-menu-end show mt-2"
                            style={{ position: "absolute", right: 0 }}
                        >
                            <Link
                                className="dropdown-item"
                                to={`/profile/${getUserId()}`}
                            >
                                Профиль
                            </Link>

                            <a className="dropdown-item" href="/settings">Настройки</a>
                            <div className="dropdown-divider"></div>
                            <button
                                className="dropdown-item text-danger"
                                onClick={handleLogout}>Выход</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

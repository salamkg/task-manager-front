import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    IconHeart,
    IconClock,
    IconFolder,
    IconChevronDown,
    IconPlus, IconDots
} from '@tabler/icons-react';
import axios from '../api/axiosInstance.js';

const Sidebar = () => {
    const location = useLocation();
    const [projectsOpen, setProjectsOpen] = useState(false);
    const [projects, setProjects] = useState([]);

    const menuItems = [
        {
            label: 'Для вас',
            icon: <IconHeart size={20} />,
            to: '/foryou',
        },
        {
            label: 'Недавние',
            icon: <IconClock size={20} />,
            to: '/recent',
        },
    ];

    useEffect(() => {
        axios.get('/projects')
            .then(res => {
                console.log('Загружено проектов:', res.data.length);
                setProjects(res.data);
            })
            .catch(err => {
                console.error('Ошибка загрузки проектов', err);
            });
    }, [location]);

    return (
        <div className="d-flex flex-column p-3 bg-white shadow-sm vh-100" style={{ width: '240px' }}>
            <ul className="nav nav-pills flex-column gap-2">
                {menuItems.map(({ label, icon, to }) => (
                    <li key={to} className="nav-item">
                        <Link
                            to={to}
                            className={`nav-link d-flex align-items-center gap-2 ${
                                location.pathname === to ? 'active' : ''
                            }`}
                        >
                            {icon}
                            {label}
                        </Link>
                    </li>
                ))}

                <li className="nav-item">
                    <div
                        className="nav-link d-flex align-items-center justify-content-between gap-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setProjectsOpen(!projectsOpen)}
                    >
                        <div className="d-flex align-items-center gap-2">
                            <IconFolder size={20} />
                            Проекты
                            <Link
                                to="/projects/create"
                                className="nav-link d-flex align-items-center gap-1"
                            >
                                <IconPlus size={15} />
                            </Link>
                            <Link
                                to="/settings/projects/manage"
                                className="nav-link d-flex align-items-center gap-1"
                            >
                                <IconDots size={15} />
                            </Link>

                        </div>
                        <IconChevronDown
                            size={16}
                            className={`transition-transform ${projectsOpen ? 'rotate-180' : ''}`}
                        />
                    </div>

                    {projectsOpen && (
                        <ul className="nav flex-column ps-4 pt-1">
                            {projects.map((project, index) => (
                                <li key={project.id || index} className="nav-item">
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className={`nav-link py-1 ${
                                            location.pathname === `/projects/${project.id}` ? 'active' : ''
                                        }`}
                                    >
                                        {project.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

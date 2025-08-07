import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {IconDots, IconStar} from "@tabler/icons-react";
import axios from "../api/axiosInstance.js";

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState('');
    const [productFilter, setProductFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProjects();
    }, [search, productFilter, categoryFilter, page]);

    const fetchProjects = () => {
        axios.get('/projects', {
            params: {
                search,
                product: productFilter,
                category: categoryFilter,
                page,
                size: 10,
            }
        })
        .then(res => {
            setProjects(res.data);
            setTotalPages(res.data.totalPages);
        })
        .catch(err => {
            console.error('Ошибка при загрузке проектов:', err);
        });
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1>Управление проектами</h1>
                <Link to="/projects/create" className="btn btn-primary">Создать проект</Link>
            </div>

            <div className="row mb-3">
                <div className="col-md-4 mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Поиск по проектам"
                        value={search}
                        onChange={(e) => {
                            setPage(0);
                            setSearch(e.target.value);
                        }}
                    />
                </div>
                <div className="col-md-4 mb-2">
                    <select
                        className="form-select"
                        value={productFilter}
                        onChange={(e) => {
                            setPage(0);
                            setProductFilter(e.target.value);
                        }}
                    >
                        <option value="">Все продукты</option>
                        <option value="ProductA">Product A</option>
                        <option value="ProductB">Product B</option>
                    </select>
                </div>
                <div className="col-md-4 mb-2">
                    <select
                        className="form-select"
                        value={categoryFilter}
                        onChange={(e) => {
                            setPage(0);
                            setCategoryFilter(e.target.value);
                        }}
                    >
                        <option value="">Все категории</option>
                        <option value="Business">Бизнес</option>
                        <option value="Tech">Технологии</option>
                        <option value="Internal">Внутренние</option>
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-light">
                        <tr>
                            <th></th>
                            <th>Имя</th>
                            <th>Ключ</th>
                            <th>Тип</th>
                            <th>Руководитель</th>
                            <th>Категория</th>
                            <th>Обновление задачи</th>
                            <th>URL проекта</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td><IconStar size={18} className="text-warning" /></td>
                                <td><Link to={`/projects/${project.id}`}>{project.name}</Link></td>
                                <td>{project.key}</td>
                                <td>{project.type}</td>
                                <td>{project.lead?.name || '—'}</td>
                                <td>{project.category}</td>
                                <td>{project.lastTaskUpdated || '—'}</td>
                                <td><IconDots size={15} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-center mt-3">
                <nav>
                    <ul className="pagination">
                        <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>Назад</button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                            <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => setPage(i)}>{i + 1}</button>
                            </li>
                        ))}
                        <li className={`page-item ${page + 1 >= totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>Вперёд</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default ProjectsPage;

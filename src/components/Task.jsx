import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../api/axiosInstance.js";
import {IconLink, IconX } from "@tabler/icons-react";

export default function TaskPage() {
    const { key } = useParams();
    const [task, setTask] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingDesc, setIsEditingDesc] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedDesc, setEditedDesc] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        axios.get(`/boards/tasks/${key}`).then((res) => setTask(res.data));
    }, [key]);

    const handleRename = () => {
        axios
            .put(`/boards/tasks/${task.id}/rename`, null, {
                params: { newName: editedName },
            })
            .then((res) => {
                setTask(res.data);
                setIsEditingName(false);
            });
    };

    const handleEdit = () => {
        axios
            .put(`/boards/tasks/${task.id}/edit`, null, {
                id: task.id,
                name: task.name,
                description: task.description,
                boardColumnDTO: task.boardColumnDTO,
                assignee: task.assignee,
            })
            .then((res) => {
                setTask(res.data);
                setIsEditing(false);
            });
    };

    const fullTaskUrl = window.location.href;
    if (!task) return <div className="text-center">Загрузка...</div>;

    return (
        <div className="container py-4">
            {/* Навигация */}
            <nav className="mb-3 text-muted small">
                <Link to="/projects">Проекты</Link> /{" "}
                <Link to={`/projects/${task.projectId}`}>{task.projectName}</Link> /{" "}
                <span className="fw-bold">{task.key}</span>
                <button
                    className="btn btn-sm btn-light ms-2"
                    onClick={() => navigator.clipboard.writeText(fullTaskUrl)}
                >
                    <IconLink size={16} />
                </button>
            </nav>

            {/* Название задачи */}
            <div className="d-flex align-items-center mb-3">
                {isEditingName ? (
                    <>
                        <input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="form-control me-2 w-50"
                        />
                        <button className="btn btn-primary me-2" onClick={handleRename}>Ок</button>
                        <button className="btn btn-outline-secondary" onClick={() => setIsEditingName(false)}>Отмена</button>
                    </>
                ) : (
                    <h1 className="h3 mb-0 cursor-pointer" onClick={() => {
                        setEditedName(task.name);
                        setIsEditingName(true);
                    }}>{task.name}</h1>
                )}
            </div>

            {/* Описание */}
            <div className="mb-4">
                <h5>Описание</h5>
                {isEditingDesc ? (
                    <>
                        <textarea
                            className="form-control mb-2"
                            value={editedDesc}
                            onChange={(e) => setEditedDesc(e.target.value)}
                        />
                        <button className="btn btn-primary me-2" onClick={() => {
                            setTask({ ...task, description: editedDesc });
                            setIsEditingDesc(false);
                        }}>Ок</button>
                        <button className="btn btn-outline-secondary" onClick={() => setIsEditingDesc(false)}>Отмена</button>
                    </>
                ) : (
                    <p
                        className="text-muted cursor-pointer"
                        onClick={() => {
                            setEditedDesc(task.description);
                            setIsEditingDesc(true);
                        }}
                    >
                        {task.description || "Добавить описание..."}
                    </p>
                )}
            </div>

            {/* Подзадачи и связанные задачи */}
            <div className="mb-4">
                <h5>Подзадачи</h5>
                <button className="btn btn-outline-primary mt-2">Добавить подзадачу</button>
            </div>

            <div className="mb-4">
                <h5>Привязанные задачи</h5>
                <button className="btn btn-outline-primary mt-2">Добавить связанную задачу</button>
            </div>

            {/* Активность и вкладки */}
            <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Активность</h5>
                    <button className="btn btn-sm btn-light"><IconX size={16} /></button>
                </div>

                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <button className="nav-link active">Комментарии</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link">История</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link">Журнал работ</button>
                    </li>
                </ul>

                {/* Комментарии */}
                <div className="mb-3 d-flex">
                    <img src="/avatars/user.png" alt="avatar" className="rounded-circle me-3" width="40" height="40" />
                    <textarea className="form-control" placeholder="Напишите комментарий..." />
                </div>

                {comments.map((comment, i) => (
                    <div key={i} className="d-flex mb-3">
                        <img src="/avatars/user.png" alt="avatar" className="rounded-circle me-3" width="40" height="40" />
                        <div>
                            <strong>{comment.user.firstname}</strong>
                            <div className="small text-muted">10 минут назад</div>
                            <p className="mb-1">{comment.text}</p>
                            <div className="small text-muted d-flex gap-2">
                                <button className="btn btn-link p-0 me-2">ответить</button>
                                <button className="btn btn-link p-0 me-2">лайк</button>
                                <button className="btn btn-link p-0 me-2">реакция</button>
                                <button className="btn btn-link p-0 me-2">изменить</button>
                                <button className="btn btn-link p-0">удалить</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

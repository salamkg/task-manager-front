import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IconCheck, IconX, IconPencil } from "@tabler/icons-react";
import { useNavigate } from 'react-router-dom';

const TaskList = ({ boardId, columnId }) => {
    const [tasks, setTasks] = useState([]);
    const [creating, setCreating] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [editTaskId, setEditTaskId] = useState(null);
    const [editName, setEditName] = useState(null);
    const [hoveredTaskId, setHoveredTaskId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTasks();
    }, [boardId, columnId]);

    const startEditing = (task) => {
        setEditTaskId(task.id);
        setEditName(task.name);
    };

    const cancelEditing = () => {
        setEditTaskId(null);
        setEditName('');
    };

    const saveEditedName = (taskId) => {
        if (!editName.trim()) return;

        axios.put(`http://localhost:9000/api/v1/boards/tasks/${taskId}/rename?newName=${encodeURIComponent(editName)}`)
            .then(() => {
                setEditTaskId(null);
                setEditName('');
                fetchTasks();
            })
            .catch(err => {
                console.error('Ошибка при переименовании задачи:', err);
            });
    };

    const fetchTasks = () => {
        axios.get(`http://localhost:9000/api/v1/boards/${boardId}/tasks`)
            .then(res => {
                const allTasks = res.data || [];
                const filtered = allTasks.filter(task =>
                    task.boardColumnDTO?.id === columnId
                );
                setTasks(filtered);
            })
            .catch(err => {
                console.error(`Ошибка при загрузке задач для board ${boardId}:`, err);
            });
    };

    const handleCreateTask = () => {
        if (!newTaskName.trim()) return;

        const formData = new FormData();
        formData.append('boardColumnId', columnId);
        formData.append('name', newTaskName);

        axios.post(`http://localhost:9000/api/v1/boards/${boardId}/create`, formData)
            .then(() => {
                setNewTaskName('');
                setCreating(false);
                fetchTasks();
            })
            .catch(err => {
                console.error('Ошибка при создании задачи:', err);
            });
    };

    return (
        <div className="card-body">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className={`border rounded p-2 mb-2 transition-all ${hoveredTaskId === task.id ? 'border-primary bg-light cursor-pointer' : ''}`}
                    onMouseEnter={() => setHoveredTaskId(task.id)}
                    onMouseLeave={() => setHoveredTaskId(null)}
                    onClick={() => navigate(`/tasks/${task.key}`)}>
                    <div className="fw-bold">

                        {editTaskId === task.id ? (
                            <div className="d-flex align-items-center">
                                <input
                                    type="text"
                                    className="form-control form-control-sm me-2"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEditedName(task.id);
                                        if (e.key === 'Escape') cancelEditing();
                                    }}
                                    autoFocus
                                />
                                <IconCheck
                                    className="text-success cursor-pointer me-2"
                                    onClick={() => saveEditedName(task.id)}
                                />
                                <IconX
                                    className="text-danger cursor-pointer"
                                    onClick={cancelEditing}
                                />
                            </div>
                        ) : (
                            <div
                                className="fw-bold cursor-pointer"
                                onClick={() => startEditing(task)}
                            >
                                {task.name}

                                {hoveredTaskId === task.id && (
                                    <IconPencil
                                        size={16}
                                        className="ms-2 text-muted"
                                    />
                                )}
                            </div>
                        )}

                    </div>
                    <div className="text-muted small d-flex justify-content-between align-items-center mt-1">
                        <span>{task.key}</span>
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee?.name || 'U')}&size=32&background=random`}
                            alt="аватар"
                            className="rounded-circle"
                            width={24}
                            height={24}
                        />
                    </div>
                </div>
            ))}

            {creating ? (
                <div className="mt-2">
                    <input
                        type="text"
                        className="form-control form-control-sm mb-1"
                        placeholder="Введите название задачи"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateTask();
                            if (e.key === 'Escape') {
                                setNewTaskName('');
                                setCreating(false);
                            }
                        }}
                        autoFocus
                    />
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={handleCreateTask}
                    >
                        Создать
                    </button>
                    <button
                        className="btn btn-sm btn-secondary ms-2"
                        onClick={() => {
                            setCreating(false);
                            setNewTaskName('');
                        }}
                    >
                        Отмена
                    </button>
                </div>
            ) : (
                <button
                    className="btn btn-sm btn-outline-primary w-100 mt-2"
                    onClick={() => setCreating(true)}
                >
                    + Создать
                </button>
            )}
        </div>
    );
};

export default TaskList;

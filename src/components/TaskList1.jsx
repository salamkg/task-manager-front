// src/components/TaskList1.jsx
import React, { useState } from 'react';
import {IconDotsVertical, IconUser, IconEdit, IconTrash, IconClock, IconPlus} from '@tabler/icons-react';

const TaskCard = ({ task }) => {
    const [showOptions, setShowOptions] = useState(false);
    const toggleOptions = () => setShowOptions(!showOptions);

    return (
        <div className="card mb-2 p-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{task.name}</h6>
                <div className="position-relative">
                    <button className="btn btn-sm btn-light" onClick={toggleOptions}>
                        <IconDotsVertical size={18} />
                    </button>
                    {showOptions && (
                        <div className="position-absolute end-0 mt-1 bg-white border rounded shadow-sm p-2">
                            <button className="dropdown-item">Редактировать</button>
                            <button className="dropdown-item">Удалить</button>
                            <button className="dropdown-item">Копировать</button>
                            <button className="dropdown-item">Переместить</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-2 text-muted small">{task.description}</div>
            <div className="d-flex justify-content-between align-items-center mt-2">
                <span className="badge bg-secondary">TSKL-{task.id}</span>
                <div className="d-flex align-items-center">
                    <IconUser size={16} className="me-1" />
                    <span title={`исполнитель: ${task.executor}`}>{task.executor}</span>
                </div>
            </div>
        </div>
    );
};

const TaskListCard = ({ list, onRename }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(list.name);

    const handleRename = () => {
        onRename(list.id, newName);
        setIsEditing(false);
    };

    return (
        <div className="card p-3 shadow-sm">
            <div className="mb-2">
                {isEditing ? (
                    <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={handleRename}
                        autoFocus
                    />
                ) : (
                    <h5
                        onClick={() => setIsEditing(true)}
                        style={{ cursor: 'pointer' }}
                    >
                        {list.name}
                    </h5>
                )}
            </div>
            {list.tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
            <button className="btn btn-sm btn-outline-primary mt-2">
                + Добавить задачу
            </button>
        </div>
    );
};

const TaskList1 = () => {
    const [lists, setLists] = useState([
        {
            id: 1,
            name: 'Новые задачи',
            tasks: [
                {
                    id: '001',
                    name: 'Сделать верстку',
                    description: 'Разметить карточки задач',
                    executor: 'Иванов И.И.'
                }
            ]
        },
        // Добавьте ещё 3 списка
    ]);

    const handleRenameList = (listId, newName) => {
        setLists(prev =>
            prev.map(list =>
                list.id === listId ? { ...list, name: newName } : list
            )
        );
    };

    return (
        <div className="row g-3">
            {lists.map((list) => (
                <div key={list.id} className="col-md-3">
                    <TaskListCard list={list} onRename={handleRenameList} />
                </div>
            ))}
            <div className="col-md-3">
                <button className="btn btn-outline-secondary w-100 h-100 d-flex align-items-center justify-content-center">
                    <IconPlus size={20} className="me-2" /> Добавить список
                </button>
            </div>
        </div>
    );
};

export default TaskList1;

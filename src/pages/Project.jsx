import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { IconDots, IconShare, IconPlus } from '@tabler/icons-react';
import TaskList from "../components/TaskList.jsx";
import DeleteColumnModal from '../components/DeleteColumnModal.jsx';
import ProjectDeleteModal from "../components/ProjectDeleteModal.jsx";
import AllTasks from "../components/AllTasks.jsx";

const Project = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [columns, setColumns] = useState([]);
    const [activeTab, setActiveTab] = useState('board');
    const [showShare, setShowShare] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showAddColumnInput, setShowAddColumnInput] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [columnToDelete, setColumnToDelete] = useState(null);
    const [selectedTargetId, setSelectedTargetId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`http://localhost:9000/api/v1/projects/${project.id}/delete`);
            setShowModal(false);
            // можно обновить список проектов тут
        } catch (err) {
            console.error(err);
            alert('Ошибка при удалении проекта');
        }
    };



    const handleDeleteClick = (column) => {
        setColumnToDelete(column);
        const otherColumns = columns.filter(c => c.id !== column.id);
        setSelectedTargetId(otherColumns[0]?.id || null);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:9000/api/v1/boards/columns/${columnToDelete.id}/remove`, {
                params: {
                    newId: selectedTargetId,
                }
            });
            setColumns(prev => prev.filter(c => c.id !== columnToDelete.id));
            setShowDeleteModal(false);
        } catch (err) {
            console.error("Ошибка при удалении колонки:", err);
        }
    };


    useEffect(() => {
        axios.get(`http://localhost:9000/api/v1/projects/boards/${projectId}`)
            .then(res => {
                setProject(res.data);
                const boards = res.data.boards || [];

                // Загружаем все колонки для всех boards
                Promise.all(
                    boards.map(board =>
                        axios.get(`http://localhost:9000/api/v1/boards/${board.id}/columns`)
                            .then(colRes => ({
                                boardId: board.id,
                                columns: colRes.data
                            }))
                    )
                ).then(allColumnsData => {
                    // Собираем колонки в единый массив
                    const allColumns = allColumnsData.flatMap(item =>
                        item.columns.map(col => ({ ...col, boardId: item.boardId }))
                    );
                    setColumns(allColumns);
                }).catch(err => {
                    console.error('Ошибка при загрузке колонок:', err);
                });
            })
            .catch(err => {
                console.error('Ошибка при загрузке проекта:', err);
            });
    }, [projectId]);


    const renderTabContent = () => {
        if (activeTab === 'board') {
            return (
                <div className="d-flex gap-3 overflow-auto px-1">
                    {columns.map((column) => (
                        <div key={column.id} className="card" style={{ minWidth: '300px', maxWidth: '300px' }}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h5 className="m-0">{column.name}</h5>
                                <div className="dropdown">
                                    <button className="btn btn-sm btn-light" data-bs-toggle="dropdown">
                                        <IconDots size={16} />
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="#">Редактировать</a></li>
                                        <li>
                                            <button className="dropdown-item" onClick={() => handleDeleteClick(column)}>
                                                Удалить!
                                            </button>
                                        </li>
                                        <li><a className="dropdown-item" href="#">Архивировать</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="card-body">
                                <TaskList
                                    boardId={column.boardId}
                                    columnId={column.id}
                                    projectKey={project.key}
                                />
                            </div>
                        </div>
                    ))}
                    <div className="card border-success" style={{ minWidth: '300px', maxWidth: '300px' }}>
                        <div className="card-body d-flex align-items-center justify-content-center">
                            {showAddColumnInput ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (!newColumnName.trim()) return;

                                        const boardId = columns[0]?.boardId;
                                        axios.post(`http://localhost:9000/api/v1/boards/${boardId}/createColumn`, null, {
                                            params: { name: newColumnName }
                                        })
                                            .then(res => {
                                                const newColumn = { ...res.data, boardId }; // добавляем boardId вручную
                                                setColumns(prev => [...prev, newColumn]);
                                                setNewColumnName('');
                                                setShowAddColumnInput(false);
                                            })
                                            .catch(err => {
                                                console.error('Ошибка при создании колонки:', err);
                                            });
                                    }}
                                    className="w-100"
                                >
                                    <input
                                        type="text"
                                        value={newColumnName}
                                        onChange={(e) => setNewColumnName(e.target.value)}
                                        className="form-control form-control-sm mb-2"
                                        placeholder="Название списка"
                                        autoFocus
                                    />
                                    <div className="d-flex justify-content-between">
                                        <button type="submit" className="btn btn-sm btn-success">Добавить</button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => {
                                                setShowAddColumnInput(false);
                                                setNewColumnName('');
                                            }}
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <button
                                    className="btn btn-sm btn-success rounded-circle"
                                    style={{ width: '36px', height: '36px' }}
                                    onClick={() => setShowAddColumnInput(true)}
                                    title="Добавить колонку"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTab === 'archived') return <div className="p-3">
            <AllTasks
                boardId={project.boards[0]?.id}
                projectKey={project.key}
            />
        </div>;
        if (activeTab === 'backlog') return <div className="p-3">Бэклог</div>;
        return null;
    };

    if (!project) return <div className="p-4">Загрузка проекта...</div>;

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-3">
                    <h1 className="m-0">{project.name}</h1>
                    <div className="position-relative">
                        <button className="btn btn-light btn-sm" onClick={() => setShowMenu(!showMenu)}>
                            <IconDots size={18} />
                        </button>
                        {showMenu && (
                            <ul className="position-absolute bg-white border rounded shadow-sm p-2" style={{ top: '100%', left: 0, zIndex: 10 }}>
                                <li className="dropdown-item">
                                    <Link to={`/projects/${project.id}`}> Настройки проекта </Link>
                                </li>
                                <button className="btn btn-sm btn-danger" onClick={() => setShowModal(true)}>
                                    Удалить
                                </button>

                                <li className="dropdown-item">Дублировать</li>
                            </ul>
                        )}
                    </div>

                    <div className="position-relative">
                        <button className="btn btn-light btn-sm" onClick={() => setShowShare(!showShare)}>
                            <IconShare size={18} /> Поделиться
                        </button>
                        {showShare && (
                            <div className="position-absolute bg-white border rounded shadow-sm p-3" style={{ top: '100%', left: 0, zIndex: 10, minWidth: '250px' }}>
                                <h6>Поделитесь проектом</h6>
                                <input type="text" placeholder="Введите email" className="form-control form-control-sm mb-2" />
                                <button className="btn btn-sm btn-primary w-100">Поделиться</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="d-flex align-items-center gap-3 border-bottom pb-2 mb-3">
                <button className={`btn btn-sm ${activeTab === 'board' ? 'btn-primary' : 'btn-light'}`} onClick={() => setActiveTab('board')}>Доска</button>
                <button className={`btn btn-sm ${activeTab === 'archived' ? 'btn-primary' : 'btn-light'}`} onClick={() => setActiveTab('archived')}>Все задачи</button>
                <button className={`btn btn-sm ${activeTab === 'backlog' ? 'btn-primary' : 'btn-light'}`} onClick={() => setActiveTab('backlog')}>Бэклог</button>
                <button className="btn btn-sm btn-success ms-auto d-flex align-items-center gap-1">
                    <IconPlus size={16} /> Добавить
                </button>
            </div>

            {renderTabContent()}

            <DeleteColumnModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                columnName={columnToDelete?.name || ''}
                newLocations={columns.filter(c => c.id !== columnToDelete?.id)}
                selectedTargetId={selectedTargetId}
                setSelectedTargetId={setSelectedTargetId}
                onConfirm={handleConfirmDelete}
            />

            <ProjectDeleteModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDeleteConfirm}
            />

        </div>
    );

};

export default Project;

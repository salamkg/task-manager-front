import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { IconDots } from '@tabler/icons-react';

const AllTasks = ({boardId}) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        if (!boardId) return;

        axios.get(`http://localhost:9000/api/v1/boards/${boardId}/tasks`)
            .then(res => {
                const all = res.data;
                console.log(all);
                setTasks(all);
            })
            .catch(err => {
                console.error('Ошибка загрузки задач:', err);
            });
    }, [boardId]);

    return (
        <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Задача</th>
                    <th>Исполнитель</th>
                    <th>Автор</th>
                    <th>Приоритет</th>
                    <th>Статус</th>
                    <th>Решение</th>
                    <th>Создано</th>
                    <th>Обновлено</th>
                    <th>Срок</th>
                    <th>
                        <span title="Дополнительно">+</span>
                    </th>
                </tr>
                </thead>
                <tbody>
                {tasks.map((task) => (
                    <tr key={task.id}>
                        <td>
                            <input type="checkbox" />
                        </td>
                        <td>
                            <Link to={`/tasks/${task.key}`}>
                                {task.key}: {task.name}
                            </Link>
                        </td>
                        <td>{task.executor?.name || '-'}</td>
                        <td>{task.creator?.name || '-'}</td>
                        <td>{task.priority || '-'}</td>
                        <td>{task.status || '-'}</td>
                        <td>{task.resolution || '-'}</td>
                        <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(task.updatedAt).toLocaleDateString()}</td>
                        <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                        <td>
                            <button className="btn btn-sm btn-light">
                                <IconDots size={16} />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllTasks;

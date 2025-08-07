// src/pages/TasksPage.jsx
import React, { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import { fetchTasks } from '../services/taskService';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [sort, setSort] = useState('name');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await fetchTasks(sort);
            setTasks(data);
            setLoading(false);
        } catch (e) {
            setError(e.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
    }, [sort]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Список задач</h2>
                <select
                    className="form-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="name">По названию</option>
                    <option value="id">По айди</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <div className="spinner-grow text-blue" role="status"></div>
                </div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : tasks.length > 0 ? (
                <div className="grid gap-4">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </div>
            ) : (
                <p className="text-muted">Нет задач</p>
            )}
        </div>
    );
};

export default TasksPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateProject = () => {
    const [name, setName] = useState('');
    const [key, setKey] = useState('');
    const [type, setType] = useState('KANBAN'); // default
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:9000/api/v1/projects/create', {
                name,
                key,
                type,
            });
            console.log(response.data);

            const projectId = response.data.id;
            navigate(`/projects/${projectId}`);
        } catch (err) {
            console.error('Ошибка при создании проекта', err);
        }
    };

    return (
        <div className="container mt-5">
            <h3>Создание проекта</h3>
            <form onSubmit={handleSubmit} className="mt-3">
                <div className="mb-3">
                    <label className="form-label">Название *</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Ключ *</label>
                    <input
                        type="text"
                        className="form-control"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Вид проекта *</label>
                    <select
                        className="form-select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="KANBAN">Kanban</option>
                        <option value="AGILE">Agile</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary me-2">Создать проект</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Отмена</button>
            </form>
        </div>
    );
};

export default CreateProject;

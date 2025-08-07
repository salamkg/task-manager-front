import React, { useState } from 'react';
import { IconDots, IconShare, IconPlus } from '@tabler/icons-react';

const Project = () => {
    const [activeTab, setActiveTab] = useState('board');
    const [showShare, setShowShare] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'board':
                return <div className="p-3">Контент доски задач</div>;
            case 'archived':
                return <div className="p-3">Архивированные задачи</div>;
            case 'backlog':
                return <div className="p-3">Бэклог</div>;
            default:
                return null;
        }
    };

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-3">
                    <h1 className="m-0">Проект 1</h1>

                    <div className="position-relative">
                        <button className="btn btn-light btn-sm" onClick={() => setShowMenu(!showMenu)}>
                            <IconDots size={18} />
                        </button>
                        {showMenu && (
                            <ul className="position-absolute bg-white border rounded shadow-sm p-2" style={{ top: '100%', left: 0, zIndex: 10 }}>
                                <li className="dropdown-item">Редактировать</li>
                                <li className="dropdown-item">Удалить</li>
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
                <button className={`btn btn-sm ${activeTab === 'archived' ? 'btn-primary' : 'btn-light'}`} onClick={() => setActiveTab('archived')}>Архив</button>
                <button className={`btn btn-sm ${activeTab === 'backlog' ? 'btn-primary' : 'btn-light'}`} onClick={() => setActiveTab('backlog')}>Бэклог</button>
                <button className="btn btn-sm btn-success ms-auto d-flex align-items-center gap-1">
                    <IconPlus size={16} /> Добавить
                </button>
            </div>

            {renderTabContent()}
        </div>
    );
};

export default Project;

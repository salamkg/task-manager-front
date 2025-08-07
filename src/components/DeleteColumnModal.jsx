import React from 'react';

const DeleteColumnModal = ({ show, onClose, columnName, newLocations, onConfirm, selectedTargetId, setSelectedTargetId }) => {
    if (!show) return null;

    return (
        <div className="modal modal-blur fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Удаление колонки «{columnName}»</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p>Выберите новую колонку, куда переместить задачи из «{columnName}»:</p>
                        <select className="form-select" value={selectedTargetId} onChange={(e) => setSelectedTargetId(Number(e.target.value))}>
                            {newLocations.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="button" className="btn btn-danger" onClick={onConfirm}>
                            Удалить и переместить задачи
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteColumnModal;

import React from 'react';

const ProjectDeleteModal = ({ show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <>
            {/* Затемнённый фон */}
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />

            {/* Модальное окно */}
            <div
                className="modal d-block"
                tabIndex="-1"
                role="dialog"
                style={{ zIndex: 1050 }}
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content shadow">
                        <div className="modal-header">
                            <h5 className="modal-title">Переместить в корзину?</h5>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={onClose}
                            ></button>
                        </div>

                        <div className="modal-body">
                            <p>
                                Проект со всеми задачами, компонентами Jira, вложениями и версиями будет доступен в корзине в течение <strong>60 дней</strong>. Затем он будет <span className="text-danger fw-bold">безвозвратно удалён</span>.
                            </p>
                            <p className="text-muted mb-0">
                                Только <strong>администраторы Jira</strong> могут восстановить проект из корзины.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onClose}
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={onConfirm}
                            >
                                Переместить
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectDeleteModal;

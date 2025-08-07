// src/components/TaskCard.jsx
const TaskCard = ({ task }) => {
    return (
        <div className="border p-3 rounded shadow-sm bg-white">
            <h3 className="text-lg font-semibold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
        </div>
    );
};

export default TaskCard;
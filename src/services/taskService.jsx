// src/services/taskService.js
export const fetchTasks = async (sort = 'name') => {
    const res = await fetch(`http://localhost:9000/api/lists/tasks?sort=${sort}`);
    if (!res.ok) {
        throw new Error("Ошибка загрузки задач");
    }
    return await res.json();
};

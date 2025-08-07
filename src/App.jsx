import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import TasksPage from './pages/TasksPage';
import './App.css';
import Layout from "./components/Layout.jsx";
import Project from "./pages/Project.jsx";
import CreateProject from "./components/CreateProject.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import axios from "axios";
import Profile from "./components/Profile.jsx";
import Task from "./components/Task.jsx";
import ProjectsPage from "./components/ProjectsPage.jsx";

function AppWrapper() {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

// Выделим логику по роутингу в отдельный компонент
function AppRoutes() {
    const location = useLocation();

    // Если это login, не оборачиваем в Layout
    const isLoginPage = location.pathname === '/login';

    return (
        <Routes>
            {isLoginPage ? (
                <Route path="/login" element={<LoginPage />} />
            ) : (
                <Route
                    path="*"
                    element={
                        <Layout>
                            <Routes>
                                <Route path="/tasks" element={<TasksPage />} />
                                <Route path="/tasks/:key" element={<Task />} />

                                <Route path="/settings/projects/manage" element={<ProjectsPage />} />
                                <Route path="/projects/:projectId" element={<Project />} />
                                <Route path="/projects/create" element={<CreateProject />} />
                                <Route path="/profile/:id" element={<Profile />} />
                                <Route path="*" element={<div className="p-4">Страница не найдена</div>} />
                            </Routes>
                        </Layout>
                    }
                />
            )}
        </Routes>
    );
}

export default AppWrapper;

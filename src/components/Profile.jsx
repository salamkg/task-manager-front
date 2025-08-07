import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance.js";
import { useParams } from "react-router-dom";
import { IconMapPin, IconMail, IconPlus } from "@tabler/icons-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const Profile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [avatarImage, setAvatarImage] = useState(null);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        axios.get(`/people/${id}`)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.error("Ошибка при получении данных пользователя:", err);
            });

        axios.get(`/people/${id}/logs`)
            .then((res) => {
                console.log(res.data);
                setLogs(res.data);
            })
            .catch((err) => {
                console.error("Ошибка при получении логов пользователя:", err);
            });

    }, [id]);


    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) setCoverImage(URL.createObjectURL(file));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) setAvatarImage(URL.createObjectURL(file));
    };

    if (!user) return <div>Загрузка...</div>;

    return (
        <div>
            {/* Cover image */}
            <div className="relative h-64 w-full bg-gray-300 group cursor-pointer">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt="Cover"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500">Нет обложки</span>
                    </div>
                )}
                <label className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg cursor-pointer">
                    Изменить обложку
                    <input type="file" onChange={handleCoverChange} className="hidden" />
                </label>
            </div>

            {/* Контент: делим на левую и правую часть */}
            <div className="flex flex-col lg:flex-row gap-6 mt-4 px-4">
                {/* Левая колонка */}
                <div className="col-md-4">
                    {/* Аватар */}
                    <div className="relative w-32 h-32 mx-auto -mt-16">
                        <img
                            src={avatarImage || "https://via.placeholder.com/150"}
                            alt="Avatar"
                            className="rounded-full border-4 border-white w-full h-full object-cover"
                        />
                        <label className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-sm cursor-pointer rounded-full">
                            Загрузить
                            <input type="file" onChange={handleAvatarChange} className="hidden" />
                        </label>
                    </div>

                    {/* Имя пользователя */}
                    <div className="text-center mt-3">
                        <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                        <p className="text-sm text-gray-500">{user.username}</p>
                    </div>

                    {/* Управление аккаунтом */}
                    <div className="text-center mt-4">
                        <button className="btn btn-outline-primary w-100 mb-3">
                            Управление аккаунтом
                        </button>
                    </div>

                    {/* Сведения */}
                    <div className="mt-6 space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Сведения</h3>
                            <div className="flex items-center text-gray-700">
                                <IconMapPin className="mr-2" size={18} />
                                Ваше местоположение
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-1">Контактные данные</h3>
                            <div className="flex items-center text-gray-700">
                                <IconMail className="mr-2" size={18} />
                                {user.username}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg mb-1">Команды</h3>
                            <button className="btn btn-sm btn-outline-secondary">
                                <IconPlus className="mr-2" size={18} />
                                Создать команду
                            </button>
                        </div>
                    </div>
                </div>

                {/* Правая колонка */}
                <div className="col-md-8">
                    {/* История */}
                    <div>
                        <h3 className="text-lg font-semibold mb-2">История</h3>
                        <div className="bg-white rounded shadow p-4">
                            <div className="bg-white rounded shadow p-4 space-y-4">
                                {logs.length === 0 ? (
                                    <p className="text-gray-500">История пуста</p>
                                ) : (
                                    logs.map((log) => (
                                        <div key={log.id} className="border-b pb-2">
                                            <p className="font-semibold">
                                                {log.entityType === "TASK" ? "Название задачи" : "Объект"} #{log.entityId}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {log.entityType.toLowerCase()}.{log.entityId} | Вы{" "}
                                                {log.activityType === "CREATE" && "создали"}
                                                {log.activityType === "UPDATE" && "обновили"}
                                                {log.activityType === "DELETE" && "удалили"} эту работу{" "}
                                                {format(new Date(log.changedAt), "d MMMM yyyy г.", { locale: ru })}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <button className="mt-2 text-blue-600 hover:underline">
                                Посмотреть все
                            </button>
                        </div>
                    </div>

                    {/* Места, где вы работаете */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Места, где вы работаете</h3>
                        <div className="bg-white rounded shadow p-4">
                            <ul className="list-disc list-inside text-gray-700">
                                <li>Проект A</li>
                                <li>Проект B</li>
                                <li>Проект C</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

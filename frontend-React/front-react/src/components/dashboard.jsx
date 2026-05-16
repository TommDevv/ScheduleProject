import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, whoami } from '../api/auth.service';
import { request } from '../api/http';
import './dashboard.css';
import UserDropdown from './user-dropdown';

const WEEK_DAYS = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
];

const HOUR_SLOTS = Array.from({ length: 13 }, (_, index) => `${String(index + 7).padStart(2, '0')}:00`);

const emptyTaskForm = {
    day: 'Lunes',
    title: '',
    startTime: '08:00',
    endTime: '09:00',
    details: '',
};

function timeToMinutes(value) {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
}

function rangesOverlap(firstStart, firstEnd, secondStart, secondEnd) {
    return firstStart < secondEnd && secondStart < firstEnd;
}

function mapHorarioApiToAgenda(horario) {
    return {
        id: horario.id_horario,
        day: horario.dia,
        title: horario.titulo,
        startTime: horario.hora_inicio.slice(0, 5),
        endTime: horario.hora_fin.slice(0, 5),
        details: horario.descripcion || '',
    };
}

export default function Dashboard() {
    const [registros, setRegistros] = useState([]);
    const [datosUsuario, setDatosUsuario] = useState({
        nickname: '',
        documento: '',
        nombre: '',
    });
    const [agenda, setAgenda] = useState([]);
    const [agendaFormVisible, setAgendaFormVisible] = useState(false);
    const [agendaForm, setAgendaForm] = useState(emptyTaskForm);
    const [agendaMessage, setAgendaMessage] = useState('');

    const navigate = useNavigate();

    const checkAuth = async () => {
        try {
            const auth = await whoami();

            if (auth) {
                setDatosUsuario({
                    nickname: auth.nickname,
                    documento: auth.documento,
                    nombre: auth.nombre,
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    async function loadData() {
        try {
            const data = await request('listarRegistros/', { method: 'GET' });
            setRegistros(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function loadAgenda() {
        try {
            const data = await request('horarios/', { method: 'GET' });
            setAgenda(data.map(mapHorarioApiToAgenda));
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        checkAuth();
        loadData();
        loadAgenda();
    }, []);

    useEffect(() => {
        console.log(registros);
        console.log(datosUsuario);
    }, [registros, datosUsuario]);

    const agendaByDay = useMemo(() => {
        return WEEK_DAYS.reduce((accumulator, day) => {
            accumulator[day] = agenda.filter((task) => task.day === day);
            return accumulator;
        }, {});
    }, [agenda]);

    const handleTaskChange = (event) => {
        const { name, value } = event.target;
        setAgendaForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const resetAgendaForm = () => {
        setAgendaForm(emptyTaskForm);
        setAgendaMessage('');
    };

    const handleAddTask = (event) => {
        event.preventDefault();

        const startMinutes = timeToMinutes(agendaForm.startTime);
        const endMinutes = timeToMinutes(agendaForm.endTime);

        if (endMinutes <= startMinutes) {
            setAgendaMessage('La hora final debe ser mayor que la hora de inicio.');
            return;
        }

        const hasOverlap = agenda.some((task) => {
            if (task.day !== agendaForm.day) {
                return false;
            }

            const existingStart = timeToMinutes(task.startTime);
            const existingEnd = timeToMinutes(task.endTime);

            return rangesOverlap(startMinutes, endMinutes, existingStart, existingEnd);
        });

        if (hasOverlap) {
            setAgendaMessage('Ese horario ya tiene una tarea asignada y no puede solaparse.');
            return;
        }

        request('horarios/', {
            method: 'POST',
            body: {
                dia: agendaForm.day,
                titulo: agendaForm.title.trim(),
                hora_inicio: agendaForm.startTime,
                hora_fin: agendaForm.endTime,
                descripcion: agendaForm.details.trim(),
            },
        })
            .then((createdHorario) => {
                setAgenda((current) => [...current, mapHorarioApiToAgenda(createdHorario)]);
                setAgendaMessage('Horario agregado correctamente.');
                setAgendaFormVisible(false);
                setAgendaForm(emptyTaskForm);
            })
            .catch((error) => {
                setAgendaMessage(error.message);
            });
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await request('horarios/', {
                method: 'DELETE',
                body: {
                    id_horario: taskId,
                },
            });

            setAgenda((current) => current.filter((task) => task.id !== taskId));
            setAgendaMessage('Horario eliminado correctamente.');
        } catch (error) {
            setAgendaMessage(error.message);
        }
    };

    const handleCloseSession = () => {
        logout();
        navigate('/');
    };

    return (
        <section className="dashboard-page">
            <div className="navbar">
                <div className="navbar-brand">
                    <h2 className="michroma-regular">Gestión de Agenda Semanal</h2>
                </div>
                <div className="navbar-user-dropdown">
                    <UserDropdown nombre={datosUsuario.nombre} documento={datosUsuario.documento} onLogout={handleCloseSession} />
                </div>
            </div>

            <main className="dashboard-content">
                <section className="dashboard-summary">
                    <div>
                        <p className="dashboard-kicker">Usuario autenticado</p>
                        <h2>{datosUsuario.nombre || 'Pendiente de carga'}</h2>
                        <p className="dashboard-description">
                            Debajo verás la agenda semanal. Los horarios se cargarán desde tu sesión activa y podrás acceder a ellos desde cualquier dispositivo iniciando sesión.
                        </p>
                    </div>
                    <div className="dashboard-stats">
                        <article>
                            <span>Tareas agendadas</span>
                            <strong>{agenda.length}</strong>
                        </article>
                    </div>
                </section>

                <section className="agenda-section">
                    <div className="agenda-header">
                        <div>
                            <p className="dashboard-kicker">Agenda semanal</p>
                            <h3>Tabla de días y horarios</h3>
                        </div>
                        <button type="button" className="agenda-action-button" onClick={() => setAgendaFormVisible((current) => !current)}>
                            Añadir horario general
                        </button>
                    </div>

                    {agendaFormVisible && (
                        <form className="agenda-form" onSubmit={handleAddTask}>
                            <div className="agenda-form-grid">
                                <label>
                                    Día
                                    <select name="day" value={agendaForm.day} onChange={handleTaskChange}>
                                        {WEEK_DAYS.map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Tarea diaria
                                    <input
                                        type="text"
                                        name="title"
                                        value={agendaForm.title}
                                        onChange={handleTaskChange}
                                        placeholder="Ej. Revisión de inventario"
                                        required
                                    />
                                </label>
                                <label>
                                    Hora de inicio
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={agendaForm.startTime}
                                        onChange={handleTaskChange}
                                        required
                                    />
                                </label>
                                <label>
                                    Hora final
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={agendaForm.endTime}
                                        onChange={handleTaskChange}
                                        required
                                    />
                                </label>
                                <label className="agenda-form-full-width">
                                    Descripción opcional
                                    <textarea
                                        name="details"
                                        value={agendaForm.details}
                                        onChange={handleTaskChange}
                                        placeholder="Observaciones o detalles adicionales"
                                        rows="3"
                                    />
                                </label>
                            </div>

                            <div className="agenda-form-actions">
                                <button type="submit">Guardar horario</button>
                                <button type="button" className="secondary-button" onClick={resetAgendaForm}>
                                    Limpiar
                                </button>
                            </div>
                            {agendaMessage && <p className="agenda-feedback">{agendaMessage}</p>}
                        </form>
                    )}

                    <div className="agenda-table-wrapper">
                        <table className="agenda-table">
                            <thead>
                                <tr>
                                    <th>Horario</th>
                                    {WEEK_DAYS.map((day) => (
                                        <th key={day}>{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {HOUR_SLOTS.map((hourSlot) => {
                                    const slotStart = timeToMinutes(hourSlot);
                                    const slotEnd = slotStart + 60;

                                    return (
                                        <tr key={hourSlot}>
                                            <th scope="row">{hourSlot}</th>
                                            {WEEK_DAYS.map((day) => {
                                                const task = agendaByDay[day].find((item) => {
                                                    const taskStart = timeToMinutes(item.startTime);
                                                    const taskEnd = timeToMinutes(item.endTime);
                                                    return taskStart < slotEnd && taskEnd > slotStart;
                                                });

                                                const isTaskStartCell = task && timeToMinutes(task.startTime) === slotStart;

                                                return (
                                                    <td key={`${day}-${hourSlot}`}>
                                                        {task ? (
                                                            <div className="agenda-cell-task">
                                                                <strong>{task.title}</strong>
                                                                <span>{task.startTime} - {task.endTime}</span>
                                                                {isTaskStartCell && (
                                                                    <button
                                                                        type="button"
                                                                        className="agenda-delete-button"
                                                                        onClick={() => handleDeleteTask(task.id)}
                                                                    >
                                                                        Eliminar
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="agenda-empty-slot">Sin tareas</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
            <footer className="dashboard-footer">
                <p>© Tomás Alejandro Delgado Ortíz - 2026</p>
            </footer>
        </section>
    );
}

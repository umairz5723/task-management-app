import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import TaskSideBar from '../../components/TaskSideBar/TaskSideBar.jsx';
import TaskList from '../../components/TaskList/TaskList.jsx';
import Quote from '../../components/Quote/Quote.jsx';
import styles from './TasksPage.module.css';
import AddIcon from '@mui/icons-material/Add';

export default function TaskPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [urgencyFilter, setUrgencyFilter] = useState('All Levels');
    const [progressFilter, setProgressFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [resetFiltersTrigger, setResetFiltersTrigger] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/signin');
        }
    }, [currentUser, navigate]);

    const fetchTasks = async (urgency = urgencyFilter, progress = progressFilter) => {
        if (!currentUser) return;

        const url = new URL('http://localhost:3000/api/tasks');

        if (urgency !== 'All Levels') {
            url.searchParams.append('urgency', urgency);
        }

        if (progress !== 'All') {
            const progressParam = progress === 'In Progress' ? 'Inprogress' : 'Completed';
            url.searchParams.append('progress', progressParam);
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Unable to fetch tasks", error);
        }
    };

    // Fetch tasks when filters change
    useEffect(() => {
        fetchTasks();
    }, [urgencyFilter, progressFilter]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        fetchTasks(); // Refresh tasks after closing modal
    };

    const handleResetFilters = () => {
        setResetFiltersTrigger(prev => !prev);
    };

    return (
        <div className={styles['tasks-page-container']}>
            <div className={styles['tasks-sidebar-container']}>
                <TaskSideBar 
                    setUrgencyFilter={setUrgencyFilter} 
                    setProgressFilter={setProgressFilter}
                    setTasks={setTasks}
                    resetFiltersTrigger={resetFiltersTrigger}
                />
            </div>

            <div className={styles['tasks-area-container']}>
                <Quote />
                <div className={styles['tasks-area-buttons']}>
                    <button 
                        className={styles['add-task-button']}
                        onClick={openModal}
                    >
                        <AddIcon /> Add a Task
                    </button>
                </div>

                <TaskList 
                    urgencyFilter={urgencyFilter} 
                    progressFilter={progressFilter} 
                    setUrgencyFilter={setUrgencyFilter} 
                    setProgressFilter={setProgressFilter} 
                    isModalOpen={isModalOpen}
                    openModal={openModal}
                    closeModal={closeModal}
                    tasks={tasks}
                    fetchTasks={fetchTasks}
                />
            </div>
        </div>
    );
}
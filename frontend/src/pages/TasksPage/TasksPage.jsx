import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import TaskSideBar from '../../components/TaskSideBar/TaskSideBar.jsx';
import Task from '../../components/Task/Task.tsx';
import AddTaskModal from '../../components/AddTaskModal/AddTaskModal.jsx';
import Quote from '../../components/Quote/Quote.jsx';
import styles from './TasksPage.module.css';
import AddIcon from '@mui/icons-material/Add';

export default function TaskPage() {
    const navigate = useNavigate();
    const { currentUser, displayName } = useAuth();
    console.log("Current User:", currentUser);
    console.log("Display Name:", displayName);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [progressFilter, setProgressFilter] = useState('All');
    const [urgencyFilter, setUrgencyFilter] = useState('All Levels');
    const [noResults, setNoResults] = useState(false); // State to manage no results message

    useEffect(() => {
        if (!currentUser) {
            navigate('/signin');
        }
    }, [currentUser, navigate]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const fetchTasks = async (urgency, progress) => {
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
            console.log("Unable to fetch tasks", error);
        }
    }

    // Trigger fetching whenever urgency or progress filters change
    useEffect(() => {
        fetchTasks(urgencyFilter, progressFilter);
    }, [urgencyFilter, progressFilter]);

    // Function to handle task updates from sidebar
    const handleUpdateTasks = (taskList) => {
        setTasks(taskList);
        setNoResults(taskList.length === 0); // Set noResults based on the task list length
    };

    return (
        <div className={styles['tasks-page-container']}>
            <div className={styles['tasks-sidebar-container']}>
                <TaskSideBar 
                    setUrgencyFilter={setUrgencyFilter} 
                    setProgressFilter={setProgressFilter}
                    setTasks={handleUpdateTasks} // Pass the handler to update tasks
                />
            </div>

            <div className={styles['tasks-area-container']}>
                <Quote />
                <div className={styles['tasks-area-buttons']}>
                    <button 
                        className={styles['add-task-button']}
                        onClick={openModal} >
                        <AddIcon /> Add a Task
                    </button>
                </div>

                <div className={styles['tasks-display-container']}>
                    {noResults ? ( // Check if there are no results
                        <p>No results found for your search.</p>
                    ) : (
                        tasks.map((task) => (
                            <Task
                                key={task.id}
                                title={task.title}
                                description={task.description}
                                urgency={task.urgency}
                                date={task.date}
                                completed={task.completed}
                            />
                        ))
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className={styles['modal-overlay']}>
                    <AddTaskModal 
                        onClose={closeModal} 
                        refreshTasks={(urgency, progress) => fetchTasks(urgency, progress)} 
                    />
                </div>
            )}
        </div>
    );
}

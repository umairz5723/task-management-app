import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/authContext';
import Task from '../../components/Task/Task.tsx';
import AddTaskModal from '../../components/AddTaskModal/AddTaskModal.jsx';
import styles from './TaskList.module.css';

export default function TaskList({ 
    urgencyFilter, 
    progressFilter, 
    setUrgencyFilter, 
    setProgressFilter, 
    isModalOpen, 
    openModal, 
    closeModal 
}) {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [noResults, setNoResults] = useState(false);

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
            setNoResults(data.length === 0); // Update noResults state
        } catch (error) {
            console.log("Unable to fetch tasks", error);
        }
    };

    // Trigger fetching whenever urgency or progress filters change
    useEffect(() => {
        if (currentUser) {
            fetchTasks(urgencyFilter, progressFilter);
        }
    }, [urgencyFilter, progressFilter, currentUser]);

    return (
        <div className={styles['tasks-display-container']}>
            {noResults ? (
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

            {isModalOpen && (
                <div className={styles['modal-overlay']}>
                    <AddTaskModal onClose={closeModal} refreshTasks={fetchTasks} />
                </div>
            )}
        </div>
    );
}

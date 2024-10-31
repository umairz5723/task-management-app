import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/authContext';
import { useNavigate } from 'react-router-dom';
import TaskSideBar from '../../components/TaskSideBar/TaskSideBar.jsx';
import TaskList from '../../components/TaskList/TaskList.jsx'; // Import your new TaskList component
import Quote from '../../components/Quote/Quote.jsx';
import styles from './TasksPage.module.css';
import AddIcon from '@mui/icons-material/Add';

export default function TaskPage() {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [urgencyFilter, setUrgencyFilter] = useState('All Levels');
    const [progressFilter, setProgressFilter] = useState('All');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/signin');
        }
    }, [currentUser, navigate]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className={styles['tasks-page-container']}>
            <div className={styles['tasks-sidebar-container']}>
                <TaskSideBar 
                    setUrgencyFilter={setUrgencyFilter} 
                    setProgressFilter={setProgressFilter}
                />
            </div>

            <div className={styles['tasks-area-container']}>
                <Quote />
                <div className={styles['tasks-area-buttons']}>
                    <button 
                        className={styles['add-task-button']}
                        onClick={openModal} // Open the modal
                    >
                        <AddIcon /> Add a Task
                    </button>
                </div>

                <TaskList 
                    urgencyFilter={urgencyFilter} 
                    progressFilter={progressFilter} 
                    setUrgencyFilter={setUrgencyFilter} 
                    setProgressFilter={setProgressFilter} 
                    isModalOpen={isModalOpen} // Pass the modal state
                    openModal={openModal} // Pass the function to open the modal
                    closeModal={closeModal} // Pass the function to close the modal
                />
            </div>
        </div>
    );
}

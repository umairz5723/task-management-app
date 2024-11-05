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
    closeModal,
    tasks,
    fetchTasks
}) {
    const { currentUser } = useAuth();
    const noResults = tasks.length === 0;

    return (
        <div className={styles['tasks-display-container']}>
            {noResults ? (
                <p>No results found for your search.</p>
            ) : (
                tasks.map((task) => (
                    <Task
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        urgency={task.urgency}
                        date={task.date}
                        completed={task.completed}
                        refreshTasks={fetchTasks}
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
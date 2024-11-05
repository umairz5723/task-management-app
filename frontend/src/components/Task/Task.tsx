import React, { useState } from 'react';
import styles from "./Task.module.css";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditTaskModal from '../EditTaskModal/EditTaskModal';
import DeleteConfirmationModal from '../DeleteConfirmModal/DeleteConfirmModal';

export default function Task({ 
    title, 
    description, 
    urgency, 
    date, 
    completed, 
    id, 
    refreshTasks 
}) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const formattedDate = new Date(date).toLocaleDateString();

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const handleComplete = async () => {
        setIsCompleting(true);
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${id}/complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to complete task');
            }

            // Refresh the task list to show the updated state
            await refreshTasks('All Levels', 'All');
        } catch (error) {
            console.error('Error completing task:', error);
            // Optionally show an error message to the user
        } finally {
            setIsCompleting(false);
        }
    };

    return (
        <>
            <div className={styles['task-card']}>
                <div className={styles['task-title']}>{title}</div>
                <div className={styles['task-desc']}>{description}</div>
                
                <div className={styles['task-urgency-progress-container']}>
                    <div className={`${styles['tasks-urgency']} ${styles[`task-urgency-${urgency.toLowerCase()}`]}`}>
                        {urgency}
                    </div>
                    <div className={`${styles['tasks-progress']} ${completed ? styles['progress-completed'] : styles['progress-in-progress']}`}>
                        {completed ? 'Completed' : 'In Progress'}
                    </div>
                </div>
                
                <div className={styles['task-urgency']}>Added: {formattedDate}</div>
                
                <div className={styles['task-actions']}>
                    <button onClick={handleEdit}>
                        <EditIcon /> Edit
                    </button>   
                    <button onClick={handleDelete}>
                        <DeleteIcon /> Delete
                    </button>   
                    {!completed && (
                        <button 
                            className={`${styles['complete-button']} ${isCompleting ? styles['completing'] : ''}`}
                            onClick={handleComplete}
                            disabled={isCompleting}
                        >
                            <CheckCircleIcon /> 
                            {isCompleting ? 'Completing...' : 'Mark Complete'}
                        </button>
                    )}
                </div>
            </div>

            {showEditModal && (
                <EditTaskModal
                    onClose={() => setShowEditModal(false)}
                    refreshTasks={refreshTasks}
                    task={{
                        id,
                        title,
                        description,
                        urgency,
                        completed,
                        date
                    }}
                />
            )}

            {showDeleteModal && (
                <DeleteConfirmationModal
                    onClose={() => setShowDeleteModal(false)}
                    refreshTasks={refreshTasks}
                    task={{
                        id,
                        title
                    }}
                />
            )}
        </>
    );
}
import React, { useState } from 'react';
import styles from "./Task.module.css";
import { TaskProps } from './TasksTypes';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddTaskModal from '../AddTaskModal/AddTaskModal';

interface ExtendedTaskProps extends TaskProps {
    refreshTasks: (urgencyFilter: string, progressFilter: string) => void;
    taskId: string;
}

export default function Task({ 
    taskId,
    title, 
    description, 
    urgency, 
    date, 
    completed,
    refreshTasks 
}: ExtendedTaskProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const formattedDate = new Date(date).toLocaleDateString();

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
    };

    const handleUpdateTask = async (
        updatedTitle: string, 
        updatedDescription: string, 
        updatedUrgency: 'High' | 'Medium' | 'Low'
    ) => {
        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    description: updatedDescription,
                    urgency: updatedUrgency
                }),
            });

            if (response.ok) {
                setIsEditModalOpen(false);
                refreshTasks('All Levels', 'All');
            } else {
                console.error('Failed to update task');
            }
        } catch (error) {
            console.error('Error updating task:', error);
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
                    <button>
                        <DeleteIcon /> Delete
                    </button>  
                    {!completed && (
                        <button className={styles['complete-button']}>
                            <CheckCircleIcon /> Mark Complete
                        </button>
                    )}
                </div>
            </div>

            {isEditModalOpen && (
                <AddTaskModal
                    onClose={handleCloseModal}
                    refreshTasks={refreshTasks}
                    initialTitle={title}
                    initialDescription={description}
                    urgency={urgency}
                    isEditing={true}
                    taskId={taskId}
                    onUpdate={handleUpdateTask}
                />
            )}
        </>
    );
}
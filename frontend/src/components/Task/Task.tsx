import React from 'react';
import styles from "./Task.module.css";
import { TaskProps } from './TasksTypes';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import Check icon

export default function Task({ title, description, urgency, date, completed }: TaskProps) {
    const formattedDate = new Date(date).toLocaleDateString();

    return (
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
                <button>
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
    );
}

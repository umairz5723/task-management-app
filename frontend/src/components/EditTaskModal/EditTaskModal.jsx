// EditTaskModal.jsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../AddTaskModal/ModalStyles.module.css";

export default function EditTaskModal({ onClose, refreshTasks, task }) {
    const [taskTitle, setTaskTitle] = useState(task.title);
    const [taskDescription, setTaskDescription] = useState(task.description);
    const [urgency, setUrgency] = useState(task.urgency);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        console.log('Attempting to update task:', { id: task.id, title: taskTitle }); // Add this debug log

        try {
            if (taskTitle.length < 1 || taskTitle.length > 50) {
                throw new Error("Task title must be between 1 and 50 characters.");
            }

            if (taskDescription.length < 1 || taskDescription.length > 100) {
                throw new Error("Task description must be between 1 and 100 characters.");
            }

            const response = await fetch(`http://localhost:3000/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: taskTitle,
                    description: taskDescription,
                    urgency
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update task');
            }
            
            await refreshTasks('All Levels', 'All');
            onClose();
        } catch (error) {
            console.error('Error updating task:', error);
            setError(error.message || 'Failed to update task');
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    ✖ 
                </button>
                <form className={styles.addTaskForm} onSubmit={handleSubmit}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    <label>
                        Task Title:
                        <small>(Max 50 characters)</small>
                        <input 
                            type="text" 
                            placeholder="What's your task?"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </label>
        
                    <label>
                        Task Description:
                        <small>(Max 150 characters)</small>
                        <input 
                            type="text" 
                            placeholder="What's this task about?"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            disabled={isSubmitting}
                        />
                    </label>
        
                    <label>
                        Urgency Level:
                        <select 
                            value={urgency}
                            onChange={(e) => setUrgency(e.target.value)}
                            disabled={isSubmitting}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </label>
        
                    <button 
                        type="submit" 
                        id="edit-task-submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Updating...' : 'Update task'}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
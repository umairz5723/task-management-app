// AddTaskModal.tsx
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./ModalStyles.module.css";

export default function AddTaskModal({ onClose, refreshTasks }) {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [urgency, setUrgency] = useState('Low');

    // Close modal when clicking escape key
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.keyCode === 27) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    // Handle overlay click
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (taskTitle.length < 1 || taskTitle.length > 50) {
            alert("Task title must be between 1 and 50 characters.");
            return;
        }

        if (taskDescription.length < 1 || taskDescription.length > 100) {
            alert("Task description must be between 1 and 100 characters.");
            return;
        }
        
        if(taskTitle && taskDescription && urgency){
            try {
                const response = await fetch('http://localhost:3000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: taskTitle,
                        description: taskDescription,
                        urgency
                    }),
                });
                if(response.ok){
                    setTaskTitle('');
                    setTaskDescription('');
                    setUrgency('Low');
                    onClose(); 
                    refreshTasks('All Levels', 'All');
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return createPortal(
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    ✖ 
                </button>
        
                <form className={styles.addTaskForm} onSubmit={handleSubmit}>
                    <label>Task Title:
                        <small>(Max 50 characters)</small>
                        <input 
                            type="text" 
                            placeholder="What's your task?"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                        />
                    </label>
        
                    <label>Task Description:
                        <small>(Max 150 characters)</small>
                        <input 
                            type="text" 
                            placeholder="What's this task about?"
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                        />
                    </label>
        
                    <label>Urgency Level:
                        <select 
                            value={urgency} 
                            onChange={(e) => setUrgency(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </label>
        
                    <button type="submit" id="add-task-submit-btn">Add this task!</button>
                </form>
            </div>
        </div>,
        document.body
    );
}
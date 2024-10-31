import { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import styles from "./AddTaskModal.module.css";

export default function AddTaskModal({ 
    onClose, 
    refreshTasks, 
    initialTitle = '', 
    initialDescription = '', 
    urgency = 'Low',
    isEditing = false,
    taskId,
    onUpdate
}) {
    const [taskTitle, setTaskTitle] = useState(initialTitle);
    const [taskDescription, setTaskDescription] = useState(initialDescription);
    const [taskUrgency, setTaskUrgency] = useState(urgency);

    useEffect(() => {
        // Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        setTaskTitle(initialTitle);
        setTaskDescription(initialDescription);
        setTaskUrgency(urgency);
    }, [initialTitle, initialDescription, urgency]);

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

        if (isEditing && onUpdate) {
            // Handle editing existing task
            onUpdate(taskTitle, taskDescription, taskUrgency);
        } else {
            // Handle adding new task
            try {
                const response = await fetch('http://localhost:3000/api/tasks', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: taskTitle,
                        description: taskDescription,
                        urgency: taskUrgency
                    }),
                });

                if (response.ok) {
                    setTaskTitle('');
                    setTaskDescription('');
                    setTaskUrgency('Low');
                    onClose();
                    refreshTasks('All Levels', 'All');
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    // Render the modal in a portal
    return createPortal(
        <div className={styles.modalOverlay}>
            <div className={styles['add-task-modal-container']}>
                <button className={styles['close-button']} onClick={onClose}>
                    ✖
                </button>

                <form className={styles['add-task-form']} onSubmit={handleSubmit}>
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
                            value={taskUrgency}
                            onChange={(e) => setTaskUrgency(e.target.value)}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </label>

                    <button type="submit" id="add-task-submit-btn">
                        {isEditing ? 'Update task' : 'Add this task!'}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}
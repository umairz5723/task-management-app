export interface TaskProps {
  id: string;
  title: string;
  description: string;
  urgency: string;
  date: string;
  completed: boolean;
  refreshTasks: (urgencyFilter: string, progressFilter: string) => void;
}

export interface EditTaskModalProps {
  onClose: () => void;
  refreshTasks: (urgencyFilter: string, progressFilter: string) => void;
  task: {
      id: string;
      title: string;
      description: string;
      urgency: string;
      date: string;
      completed: boolean;
  };
}
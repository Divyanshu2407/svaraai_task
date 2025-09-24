'use client';

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '@/services/taskService';
import { Task } from '@/types/task';
import Card from '@/components/Card';
import Modal from '@/components/Modal';
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragEndEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';

function Droppable({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return <div ref={setNodeRef}>{children}</div>;
}

function Draggable({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, attributes, listeners } = useDraggable({ id });
  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

type Column = 'todo' | 'in-progress' | 'done';
const columnTitles: Record<Column, string> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

export default function KanbanBoard() {
  const { token } = useAuth();
  const params = useParams();
  const projectId = params?.projectId as string | undefined;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTaskTitle, setModalTaskTitle] = useState('');
  const [modalTaskPriority, setModalTaskPriority] = useState<'low' | 'medium' | 'high'>('low');
  const [modalTaskDeadline, setModalTaskDeadline] = useState('');

  const loadTasks = async () => {
    if (!token || !projectId) return;
    try {
      const res = await getTasks(token, projectId);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [token, projectId]);

  const sensors = useSensors(useSensor(PointerSensor));

  const columns: Record<Column, Task[]> = { todo: [], 'in-progress': [], done: [] };
  tasks.forEach((task) => {
    if (task.status === 'todo' || task.status === 'in-progress' || task.status === 'done') {
      columns[task.status].push(task);
    }
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-400';
      case 'low':
        return 'bg-green-400';
      default:
        return 'bg-gray-400';
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !active) return;

    const taskId = active.id.toString();
    const newStatus = over.id.toString() as Column;
    const task = tasks.find((t) => t._id === taskId);
    if (!task || task.status === newStatus) return;

    const updatedTasks = tasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t));
    setTasks(updatedTasks);

    if (token && projectId) {
      try {
        await updateTask(token, projectId, taskId, { status: newStatus });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleStatusOrPriorityChange = async (task: Task, newStatus: Column, newPriority?: string) => {
    if (!token || !projectId) return;
    const updates: Partial<Task> = { status: newStatus };
    if (newPriority) updates.priority = newPriority;

    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, ...updates } : t)));

    try {
      await updateTask(token, projectId, task._id, updates);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!token || !projectId) return;
    try {
      await deleteTask(token, projectId, task._id);
      setTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async () => {
    if (!token || !projectId) return;
    if (!modalTaskTitle || !modalTaskDeadline) return alert('Title and deadline required');

    try {
      await createTask(token, projectId, {
        title: modalTaskTitle,
        status: 'todo',
        priority: modalTaskPriority,
        deadline: new Date(modalTaskDeadline).toISOString(),
      });
      setModalTaskTitle('');
      setModalTaskDeadline('');
      setModalTaskPriority('low');
      setIsModalOpen(false);
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalTaskTitle('');
    setModalTaskDeadline('');
    setModalTaskPriority('low');
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-lg text-gray-500">Loading tasks...</span>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700">Kanban Board</h1>

      <input
        type="text"
        placeholder="Search tasks..."
        className="border p-2 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Task
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Create Task">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Title"
            value={modalTaskTitle}
            onChange={(e) => setModalTaskTitle(e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={modalTaskPriority}
            onChange={(e) => setModalTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={modalTaskDeadline}
            onChange={(e) => setModalTaskDeadline(e.target.value)}
            className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTask}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {(['todo', 'in-progress', 'done'] as Column[]).map((col) => (
            <Droppable key={col} id={col}>
              <div className="flex-1 min-w-[300px] bg-white border border-gray-200 p-4 rounded-xl shadow-md flex flex-col">
                <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b border-gray-100 pb-2">
                  {columnTitles[col]}
                </h2>
                <div className="flex flex-col gap-4">
                  {columns[col]
                    .filter((t) => filteredTasks.includes(t))
                    .map((task) => (
                      <Draggable key={task._id} id={String(task._id)}>
                        <Card className="p-4 rounded-lg shadow flex flex-col justify-between bg-gray-50 hover:shadow-lg transition cursor-grab border border-gray-200">
                          <div>
                            <h3 className="font-bold mb-1 text-gray-800">{task.title}</h3>
                            <p className="text-xs text-gray-500 mb-2">
                              Deadline: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <span
                              className={`px-2 py-1 text-white text-xs rounded font-semibold ${getPriorityColor(
                                task.priority
                              )}`}
                            >
                              {task.priority.toUpperCase()}
                            </span>
                            <select
                              value={task.priority}
                              onChange={(e) =>
                                handleStatusOrPriorityChange(task, task.status, e.target.value)
                              }
                              className="ml-2 px-1 rounded border border-gray-300 text-xs"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
                            <button
                              onClick={() => handleDeleteTask(task)}
                              className="text-red-500 text-xs ml-2"
                            >
                              Delete
                            </button>
                          </div>
                        </Card>
                      </Draggable>
                    ))}
                  {columns[col].length === 0 && (
                    <div className="text-gray-400 text-center py-8 italic">No tasks</div>
                  )}
                </div>
              </div>
            </Droppable>
          ))}
        </div>
      </DndContext>
    </div>
  );
}
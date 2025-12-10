'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './globals.css';

export default function Home() {
  const router = useRouter();
  const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editText, setEditText] = useState('');
    const [userEmail, setUserEmail] = useState('');

    // Check authentication and fetch todos on component mount
    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        if (!user) {
            router.push('/login');
            return;
        }
        
        try {
            const userData = JSON.parse(user);
            setUserEmail(userData.email || '');
        } catch (e) {
            console.error('Error parsing user data:', e);
            router.push('/login');
            return;
        }
        
        fetchTodos();
    }, [router]);

    const fetchTodos = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch('/api/todos');
            const data = await response.json();

            if (data.success) {
                setTodos(data.data);
            } else {
                setError(data.error || 'Failed to fetch todos');
            }
        } catch (err) {
            setError('Failed to connect to server');
            console.error('Error fetching todos:', err);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();

        if (!newTodo.trim()) {
            setError('Please enter a todo');
            return;
        }

        try {
            setError('');
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTodo }),
            });

            const data = await response.json();

            if (data.success) {
                setTodos([data.data, ...todos]);
                setNewTodo('');
            } else {
                setError(data.error || 'Failed to create todo');
            }
        } catch (err) {
            setError('Failed to create todo');
            console.error('Error creating todo:', err);
        }
    };

    const toggleTodo = async (id, completed) => {
        try {
            setError('');
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !completed }),
            });

            const data = await response.json();

            if (data.success) {
                setTodos(todos.map(todo =>
                    todo._id === id ? data.data : todo
                ));
            } else {
                setError(data.error || 'Failed to update todo');
            }
        } catch (err) {
            setError('Failed to update todo');
            console.error('Error updating todo:', err);
        }
    };

    const startEdit = (id, title) => {
        setEditingId(id);
        setEditText(title);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const saveEdit = async (id) => {
        if (!editText.trim()) {
            setError('Todo title cannot be empty');
            return;
        }

        try {
            setError('');
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editText }),
            });

            const data = await response.json();

            if (data.success) {
                setTodos(todos.map(todo =>
                    todo._id === id ? data.data : todo
                ));
                setEditingId(null);
                setEditText('');
            } else {
                setError(data.error || 'Failed to update todo');
            }
        } catch (err) {
            setError('Failed to update todo');
            console.error('Error updating todo:', err);
        }
    };

    const deleteTodo = async (id) => {
        if (!confirm('Are you sure you want to delete this todo?')) {
            return;
        }

        try {
            setError('');
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                setTodos(todos.filter(todo => todo._id !== id));
            } else {
                setError(data.error || 'Failed to delete todo');
            }
        } catch (err) {
            setError('Failed to delete todo');
            console.error('Error deleting todo:', err);
        }
    };

    const deleteAllTodos = async () => {
        if (!confirm(`Are you sure you want to delete all ${todos.length} todos? This action cannot be undone!`)) {
            return;
        }

        try {
            setError('');
            const response = await fetch('/api/todos', {
                method: 'DELETE',
            });

            const data = await response.json();

            if (data.success) {
                setTodos([]);
            } else {
                setError(data.error || 'Failed to delete all todos');
            }
        } catch (err) {
            setError('Failed to delete all todos');
            console.error('Error deleting all todos:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/login');
    };

    const stats = {
        total: todos.length,
        completed: todos.filter(t => t.completed).length,
        pending: todos.filter(t => !t.completed).length,
    };

  return (
    <div className="container">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1 className="app-title">✓ Todoist</h1>
            <p className="app-subtitle">Organize your work and life, finally.</p>
          </div>
          <div className="user-section">
            <span className="user-email">{userEmail}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>            <div className="todo-card">
                {error && <div className="error">{error}</div>}

                <div className="top-actions">
                    <form onSubmit={addTodo} className="add-todo-form">
                        <input
                            type="text"
                            className="todo-input"
                            placeholder="Add a task..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            disabled={loading}
                            id="new-todo-input"
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            id="add-todo-btn"
                        >
                            ➕ Add Todo
                        </button>
                    </form>
                    {todos.length > 0 && (
                        <button
                            className="btn btn-danger-all"
                            onClick={deleteAllTodos}
                            disabled={loading}
                            id="delete-all-btn"
                        >
                            🗑️ Delete All ({todos.length})
                        </button>
                    )}
                </div>

                {!loading && todos.length > 0 && (
                    <div className="stats">
                        <div className="stat-item">
                            <span className="stat-value" id="total-count">{stats.total}</span>
                            <span className="stat-label">Total</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value" id="completed-count">{stats.completed}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value" id="pending-count">{stats.pending}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="loading">Loading todos...</div>
                ) : todos.length === 0 ? (
                    <div className="empty-state" id="empty-state">
                        <div className="empty-icon">✓</div>
                        <div className="empty-text">Your peace of mind is priceless</div>
                        <div className="empty-subtext">Add your first task to get started</div>
                    </div>
                ) : (
                    <ul className="todos-list" id="todos-list">
                        {todos.map((todo) => (
                            <li
                                key={todo._id}
                                className={`todo-item ${todo.completed ? 'completed' : ''}`}
                                data-todo-id={todo._id}
                            >
                                <input
                                    type="checkbox"
                                    className="todo-checkbox"
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo._id, todo.completed)}
                                    id={`checkbox-${todo._id}`}
                                />

                                <div className="todo-content">
                                    {editingId === todo._id ? (
                                        <input
                                            type="text"
                                            className="todo-edit-input"
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveEdit(todo._id);
                                                if (e.key === 'Escape') cancelEdit();
                                            }}
                                            autoFocus
                                            id={`edit-input-${todo._id}`}
                                        />
                                    ) : (
                                        <span className="todo-text">{todo.title}</span>
                                    )}
                                </div>

                                <div className="todo-actions">
                                    {editingId === todo._id ? (
                                        <>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => saveEdit(todo._id)}
                                                id={`save-btn-${todo._id}`}
                                            >
                                                ✓ Save
                                            </button>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={cancelEdit}
                                                id={`cancel-btn-${todo._id}`}
                                            >
                                                ✕ Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => startEdit(todo._id, todo.title)}
                                                id={`edit-btn-${todo._id}`}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => deleteTodo(todo._id)}
                                                id={`delete-btn-${todo._id}`}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

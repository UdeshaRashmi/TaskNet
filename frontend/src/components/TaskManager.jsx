import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Badge, Modal } from 'react-bootstrap';
import { tasksAPI, categoriesAPI } from '../services/api';
import { autoCapitalize, validateCapitalization, getCapitalizationError } from '../utils/validation';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]); // Add back the categories state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  // Load tasks and categories on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksResponse, categoriesResponse, statsResponse] = await Promise.all([
        tasksAPI.getAll(),
        categoriesAPI.getAll(),
        tasksAPI.getStats()
      ]);
      
      setTasks(tasksResponse.data.data?.tasks || []);
      setCategories(categoriesResponse.data.data?.categories || []);
      setStats(statsResponse.data.data?.overall || {
        total: 0,
        completed: 0,
        pending: 0,
        overdue: 0
      });
      
      // Create default categories if none exist
      if (categoriesResponse.data.data?.categories && categoriesResponse.data.data.categories.length === 0) {
        await categoriesAPI.createDefaults();
        const updatedCategories = await categoriesAPI.getAll();
        setCategories(updatedCategories.data.data?.categories || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Error loading data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // CREATE: Add new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }

    // Validate title capitalization
    if (!validateCapitalization(newTask.title)) {
      setError(getCapitalizationError('Task title'));
      return;
    }

    try {
      setError('');
      console.log('Creating task with data:', newTask);
      
      // Clean up the task data - remove empty category
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        dueDate: newTask.dueDate
      };
      
      // Only include category if it's not empty
      if (newTask.category && newTask.category.trim() !== '') {
        taskData.category = newTask.category;
      }
      
      console.log('Cleaned task data:', taskData);
      
      const response = await tasksAPI.create(taskData);
      console.log('Task created successfully:', response.data);
      setTasks([...tasks, response.data.data.task]);
      setNewTask({ 
        title: '', 
        description: '', 
        priority: 'medium', 
        dueDate: '', 
        category: '' 
      });
      await loadData(); // Reload stats
    } catch (error) {
      console.error('Error adding task:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.message || 'Error adding task. Please try again.';
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        setError('Cannot connect to server. Please ensure the backend server is running on http://localhost:5000');
      } else if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        setError('Authentication failed. Please login again.');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        setError(errorMessage);
      }
    }
  };

  // READ: Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'completed' && task.status === 'completed') ||
                         (filter === 'pending' && task.status === 'pending');
    
    return matchesSearch && matchesFilter;
  });

  // UPDATE: Start editing task
  const startEdit = (task) => {
    setEditingTask({ 
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  // UPDATE: Save edited task
  const saveEdit = async () => {
    if (!editingTask || !editingTask.title.trim()) {
      setError('Task title is required');
      return;
    }

    // Validate title capitalization
    if (!validateCapitalization(editingTask.title)) {
      setError(getCapitalizationError('Task title'));
      return;
    }

    try {
      setError('');
      const response = await tasksAPI.update(editingTask._id, editingTask);
      setTasks(tasks.map(task => 
        task._id === editingTask._id ? response.data.data.task : task
      ));
      setShowEditModal(false);
      setEditingTask(null);
      await loadData(); // Reload stats
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Error updating task. Please try again.');
    }
  };

  // UPDATE: Toggle task completion
  const toggleComplete = async (id) => {
    try {
      const task = tasks.find(t => t._id === id);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      const response = await tasksAPI.update(id, { status: newStatus });
      setTasks(tasks.map(task => 
        task._id === id ? response.data.data.task : task
      ));
      await loadData(); // Reload stats
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Error updating task status. Please try again.');
    }
  };

  // DELETE: Remove task
  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await tasksAPI.delete(id);
        setTasks(tasks.filter(task => task._id !== id));
        await loadData(); // Reload stats
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Error deleting task. Please try again.');
      }
    }
  };

  // DELETE: Clear completed tasks
  const clearCompleted = async () => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    if (completedTasks.length === 0) return;

    if (window.confirm(`Are you sure you want to clear all ${completedTasks.length} completed tasks?`)) {
      try {
        await Promise.all(completedTasks.map(task => tasksAPI.delete(task._id)));
        setTasks(tasks.filter(task => task.status !== 'completed'));
        await loadData(); // Reload stats
      } catch (error) {
        console.error('Error clearing completed tasks:', error);
        setError('Error clearing completed tasks. Please try again.');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return 'bi-exclamation-triangle-fill';
      case 'high': return 'bi-arrow-up-circle-fill';
      case 'medium': return 'bi-dash-circle-fill';
      case 'low': return 'bi-arrow-down-circle-fill';
      default: return 'bi-flag-fill';
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <p>Loading your tasks...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
      />

      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="text-center text-white">
            <h1 className="display-4 fw-bold mb-3">Welcome to TaskNest</h1>
            <p className="lead">Organize your tasks efficiently and boost your productivity</p>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow">
            <Card.Body>
              <i className="bi bi-list-task text-primary fs-1 mb-2"></i>
              <h3 className="text-primary">{stats.total || 0}</h3>
              <p className="text-muted mb-0">Total Tasks</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow" style={{ border: '1px solid rgba(25, 135, 84, 0.25)' }}>
            <Card.Body>
              <i className="bi bi-check-circle-fill text-success fs-1 mb-2"></i>
              <h3 className="text-success">{stats.completed || 0}</h3>
              <p className="text-muted mb-0">Completed</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow">
            <Card.Body>
              <i className="bi bi-clock text-warning fs-1 mb-2"></i>
              <h3 className="text-warning">{stats.pending || 0}</h3>
              <p className="text-muted mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="text-center border-0 shadow">
            <Card.Body>
              <i className="bi bi-graph-up text-info fs-1 mb-2"></i>
              <h3 className="text-info">{stats.overdue || 0}</h3>
              <p className="text-muted mb-0">Overdue</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Add Task Card */}
      <Card className="shadow border-0 mb-4">
        <Card.Body>
          <h5 className="card-title d-flex align-items-center mb-4">
            <i className="bi bi-plus-circle text-primary me-2"></i>
            Add New Task
          </h5>
          <Form onSubmit={addTask}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Task Title *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter task title..."
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: autoCapitalize(e.target.value)})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Priority</Form.Label>
                  <Form.Select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description..."
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
            </Form.Group>
            <Button 
              type="submit" 
              className="px-4"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none' }}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add Task
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Tasks List Card */}
      <Card className="shadow border-0">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <h5 className="card-title d-flex align-items-center mb-2 mb-md-0">
              <i className="bi bi-list-check text-primary me-2"></i>
              Your Tasks ({filteredTasks.length})
              {filter === 'all' && stats.completed > 0 && (
                <span className="badge bg-success ms-2">
                  <i className="bi bi-check-circle-fill me-1"></i>
                  {stats.completed} completed
                </span>
              )}
            </h5>
            
            <div className="d-flex flex-wrap gap-2">
              <InputGroup style={{ width: '250px' }}>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              <div className="btn-group">
                <Button
                  variant={filter === 'all' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={filter === 'pending' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === 'completed' ? 'success' : 'outline-success'}
                  size="sm"
                  onClick={() => setFilter('completed')}
                >
                  <i className="bi bi-check-circle-fill me-1"></i>
                  Completed
                </Button>
              </div>

              {stats.completed > 0 && (
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={clearCompleted}
                >
                  <i className="bi bi-trash me-1"></i>
                  Clear Completed
                </Button>
              )}
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox display-1 text-muted mb-3"></i>
              <h5 className="text-muted">No tasks found</h5>
              <p className="text-muted">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter' 
                  : 'Add your first task to get started!'}
              </p>
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map(task => (
                <Card 
                  key={task._id} 
                  className={`mb-3 border-start-${getPriorityColor(task.priority)} border-start-4 ${task.status === 'completed' ? 'bg-light border-success border-opacity-25' : ''}`}
                  style={task.status === 'completed' ? { borderLeftWidth: '4px' } : {}}
                >
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col md={8}>
                        <div className="d-flex align-items-start">
                          <Form.Check
                            type="checkbox"
                            checked={task.status === 'completed'}
                            onChange={() => toggleComplete(task._id)}
                            className="me-3 mt-1"
                          />
                          <div className="flex-grow-1">
                            <h6 className={`mb-1 ${task.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}`}>
                              {task.status === 'completed' && (
                                <i className="bi bi-check-circle-fill text-success me-2" style={{ fontSize: '1.2em' }}></i>
                              )}
                              {task.title}
                              <Badge 
                                bg={getPriorityColor(task.priority)} 
                                className="ms-2"
                              >
                                <i className={`bi ${getPriorityIcon(task.priority)} me-1`}></i>
                                {task.priority}
                              </Badge>
                            </h6>
                            {task.description && (
                              <p className={`mb-2 small ${task.status === 'completed' ? 'text-muted' : ''}`}>{task.description}</p>
                            )}
                            <div className={`d-flex gap-3 small ${task.status === 'completed' ? 'text-muted' : 'text-muted'}`}>
                              {task.dueDate && (
                                <span>
                                  <i className="bi bi-calendar-event me-1"></i>
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                              <span>
                                <i className="bi bi-clock me-1"></i>
                                Created: {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col md={4} className="text-end">
                        <div className="d-flex gap-2 justify-content-end">
                          <Button
                            variant={task.status === 'completed' ? "warning" : "success"}
                            size="sm"
                            onClick={() => toggleComplete(task._id)}
                            title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
                          >
                            <i className={`bi ${task.status === 'completed' ? 'bi-arrow-counterclockwise' : 'bi-check-lg'}`}></i>
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => startEdit(task)}
                            title="Edit task"
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => deleteTask(task._id)}
                            title="Delete task"
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square text-primary me-2"></i>
            Edit Task
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingTask && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Task Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({...editingTask, title: autoCapitalize(e.target.value)})}
                  required
                />
              </Form.Group>
              
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Priority</Form.Label>
                    <Form.Select
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={saveEdit}
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none' }}
          >
            <i className="bi bi-check-lg me-2"></i>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TaskManager;

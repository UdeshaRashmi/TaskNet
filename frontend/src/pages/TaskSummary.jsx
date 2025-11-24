import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, ProgressBar, Table, Badge, Spinner } from 'react-bootstrap';
import { 
  Analytics,
  TrendingUp,
  Schedule,
  CheckCircle,
  Pending,
  Error
} from '@mui/icons-material';
import { tasksAPI } from '../services/api';

const TaskSummary = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [priorityStats, setPriorityStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [weeklyPerformance, setWeeklyPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTaskStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await tasksAPI.getStats();
      
      if (response.data.success) {
        const stats = response.data.data.overall;
        const priorityData = response.data.data.byPriority;
        const activities = response.data.data.recentActivities || [];
        const avgCompletionTime = response.data.data.averageCompletionTime || 'N/A';
        const productivityTrend = response.data.data.productivityTrend || '0%';
        const weeklyData = response.data.data.weeklyPerformance || [];
        
        setSummaryData({
          totalTasks: stats.total || 0,
          completed: stats.completed || 0,
          inProgress: stats.inProgress || 0,
          pending: stats.pending || 0,
          cancelled: stats.cancelled || 0,
          overdue: stats.overdue || 0,
          completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
          averageCompletionTime: avgCompletionTime,
          productivityTrend: productivityTrend
        });
        
        // Transform priority data for display
        const priorityTransform = priorityData.map(item => ({
          priority: item._id.charAt(0).toUpperCase() + item._id.slice(1), // Capitalize first letter
          count: item.count,
          color: getPriorityColor(item._id)
        }));
        
        setPriorityStats(priorityTransform);
        setRecentActivities(activities);
        setWeeklyPerformance(weeklyData);
      }
    } catch (err) {
      console.error('Error fetching task stats:', err);
      setError('Failed to load task statistics. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaskStats();
  }, [fetchTaskStats]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'danger';
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'secondary';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'completed': return <CheckCircle className="text-success" />;
      case 'created': return <TrendingUp className="text-primary" />;
      case 'in progress': return <Schedule className="text-warning" />;
      case 'pending': return <Pending className="text-info" />;
      default: return <Error className="text-danger" />;
    }
  };

  const getActionVariant = (action) => {
    switch (action) {
      case 'completed': return 'success';
      case 'created': return 'primary';
      case 'in progress': return 'warning';
      case 'pending': return 'info';
      default: return 'danger';
    }
  };

  if (loading) {
    return (
      <Container className="py-4 fade-in">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <Spinner animation="border" variant="primary" />
          <span className="ms-3">Loading task summary...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4 fade-in">
        <Card className="custom-card">
          <Card.Body>
            <div className="text-center">
              <Error className="text-danger mb-3" sx={{ fontSize: 40 }} />
              <h4 className="text-danger">{error}</h4>
              <button className="btn btn-primary mt-3" onClick={fetchTaskStats}>
                Try Again
              </button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  if (!summaryData) {
    return (
      <Container className="py-4 fade-in">
        <Card className="custom-card">
          <Card.Body>
            <div className="text-center">
              <h4>No task data available</h4>
              <p className="text-muted">Start creating tasks to see your summary</p>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4 fade-in">
      <Row className="justify-content-center">
        <Col lg={10}>
          {/* Header Section */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold text-white mb-3">Task Summary</h1>
            <p className="lead text-light">
              Comprehensive overview of your productivity and task performance
            </p>
          </div>

          {/* Key Metrics */}
          <Row className="mb-4">
            <Col md={3} className="mb-3">
              <Card className="custom-card text-center h-100">
                <Card.Body>
                  <Analytics className="text-primary mb-3" sx={{ fontSize: 40 }} />
                  <h3 className="text-primary">{summaryData.totalTasks}</h3>
                  <p className="text-muted mb-0">Total Tasks</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="custom-card text-center h-100">
                <Card.Body>
                  <CheckCircle className="text-success mb-3" sx={{ fontSize: 40 }} />
                  <h3 className="text-success">{summaryData.completed}</h3>
                  <p className="text-muted mb-0">Completed</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="custom-card text-center h-100">
                <Card.Body>
                  <TrendingUp className="text-warning mb-3" sx={{ fontSize: 40 }} />
                  <h3 className="text-warning">{summaryData.inProgress}</h3>
                  <p className="text-muted mb-0">In Progress</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} className="mb-3">
              <Card className="custom-card text-center h-100">
                <Card.Body>
                  <Pending className="text-info mb-3" sx={{ fontSize: 40 }} />
                  <h3 className="text-info">{summaryData.pending}</h3>
                  <p className="text-muted mb-0">Pending</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Progress and Stats */}
            <Col md={8} className="mb-4">
              <Card className="custom-card h-100">
                <Card.Body>
                  <h5 className="mb-4">Completion Progress</h5>
                  
                  <div className="mb-4">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Overall Completion Rate</span>
                      <strong>{summaryData.completionRate}%</strong>
                    </div>
                    <ProgressBar 
                      now={summaryData.completionRate} 
                      variant="primary"
                      style={{ height: '10px' }}
                    />
                  </div>

                  <Row className="text-center">
                    <Col md={4} className="mb-3">
                      <div className="p-3 bg-light rounded">
                        <h4 className="text-primary mb-1">{summaryData.averageCompletionTime}</h4>
                        <small className="text-muted">Avg. Completion Time</small>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="p-3 bg-light rounded">
                        <h4 className={`mb-1 ${summaryData.productivityTrend.startsWith('+') ? 'text-success' : summaryData.productivityTrend.startsWith('-') ? 'text-danger' : 'text-muted'}`}>
                          {summaryData.productivityTrend}
                        </h4>
                        <small className="text-muted">Productivity Trend</small>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="p-3 bg-light rounded">
                        <h4 className="text-warning mb-1">
                          {summaryData.totalTasks > 0 ? (summaryData.completed / summaryData.totalTasks * 5).toFixed(1) : '0'}/5
                        </h4>
                        <small className="text-muted">Efficiency Score</small>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Priority Distribution */}
            <Col md={4} className="mb-4">
              <Card className="custom-card h-100">
                <Card.Body>
                  <h5 className="mb-4">Priority Distribution</h5>
                  {priorityStats.map((stat, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>
                          <Badge bg={stat.color} className="me-2">
                            {stat.priority}
                          </Badge>
                        </span>
                        <span>{stat.count} tasks</span>
                      </div>
                      <ProgressBar 
                        now={summaryData.totalTasks > 0 ? (stat.count / summaryData.totalTasks) * 100 : 0} 
                        variant={stat.color}
                        style={{ height: '6px' }}
                      />
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Activities */}
          <Card className="custom-card">
            <Card.Body>
              <h5 className="mb-4">Recent Activities</h5>
              {recentActivities.length > 0 ? (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Task</th>
                      <th>Status</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((activity, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            {getActionIcon(activity.action)}
                            <span className="ms-2">{activity.task}</span>
                          </div>
                        </td>
                        <td>
                          <Badge bg={getActionVariant(activity.action)}>
                            {activity.action}
                          </Badge>
                        </td>
                        <td className="text-muted">{activity.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">No recent activities found</p>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Weekly Performance */}
          <Card className="custom-card mt-4">
            <Card.Body>
              <h5 className="mb-4">Weekly Performance</h5>
              <Row>
                {weeklyPerformance.map((day, index) => (
                  <Col key={index} className="text-center">
                    <div className="mb-2">
                      <small className="text-muted">{day.day}</small>
                    </div>
                    <div 
                      className="bg-primary rounded mx-auto"
                      style={{ 
                        width: '20px', 
                        height: `${day.count > 0 ? (day.count / Math.max(...weeklyPerformance.map(d => d.count)) * 80 + 20) : 20}px`,
                        maxHeight: '100px'
                      }}
                    ></div>
                    <small className="text-muted mt-2 d-block">
                      {day.count}
                    </small>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TaskSummary;
const mongoose = require('mongoose');

const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: `Invalid ${paramName} format` 
      });
    }
    
    next();
  };
};

const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({ 
      message: 'Invalid pagination parameters. Page must be >= 1, limit must be between 1 and 100' 
    });
  }
  
  req.pagination = {
    page,
    limit,
    skip: (page - 1) * limit
  };
  
  next();
};

const validateTaskStatus = (req, res, next) => {
  const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
  const status = req.body?.status || req.query?.status;
  
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ 
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }
  
  next();
};

const validatePriority = (req, res, next) => {
  const validPriorities = ['low', 'medium', 'high', 'urgent'];
  const priority = req.body?.priority || req.query?.priority;
  
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ 
      message: `Invalid priority. Must be one of: ${validPriorities.join(', ')}` 
    });
  }
  
  next();
};

module.exports = {
  validateObjectId,
  validatePagination,
  validateTaskStatus,
  validatePriority
};


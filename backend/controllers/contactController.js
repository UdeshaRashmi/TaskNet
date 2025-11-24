const Contact = require('../models/Contact');

// CREATE: Submit a new contact message
const createContact = async (req, res) => {
  try {
    const contactData = {
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      priority: req.body.priority || 'normal'
    };

    // Add user ID if authenticated
    if (req.user) {
      contactData.user = req.user.id;
    }

    const contact = await Contact.create(contactData);

    res.status(201).json({
      success: true,
      message: 'Contact message submitted successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Create contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact message',
      error: error.message
    });
  }
};

// READ: Get all contact messages (with filters and pagination)
const getContacts = async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const { page, limit, skip } = req.pagination;

    // Build filter object
    const filter = {};

    // If user is authenticated and not admin, show only their messages
    if (req.user && !req.user.isAdmin) {
      filter.user = req.user.id;
    }

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const contacts = await Contact.find(filter)
      .populate('user', 'name email')
      .populate('resolvedBy', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Contact.countDocuments(filter);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contact messages',
      error: error.message
    });
  }
};

// READ: Get single contact message by ID
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('user', 'name email')
      .populate('resolvedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Check if user has permission to view this contact
    if (req.user && !req.user.isAdmin && contact.user?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this contact message'
      });
    }

    res.json({
      success: true,
      data: { contact }
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contact message',
      error: error.message
    });
  }
};

// UPDATE: Update contact message (for admin or user editing their own)
const updateContact = async (req, res) => {
  try {
    const contactId = req.params.id;

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Check permissions
    if (req.user && !req.user.isAdmin && contact.user?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to update this contact message'
      });
    }

    // Regular users can only update certain fields if status is still pending
    if (req.user && !req.user.isAdmin) {
      if (contact.status !== 'pending') {
        return res.status(403).json({
          success: false,
          message: 'Cannot update contact message that is already being processed'
        });
      }

      // Only allow updating specific fields for regular users
      const allowedUpdates = ['name', 'email', 'subject', 'message', 'priority'];
      const updates = {};
      allowedUpdates.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      Object.assign(contact, updates);
    } else {
      // Admin can update all fields
      Object.assign(contact, req.body);

      // If status changed to resolved, set resolvedAt and resolvedBy
      if (req.body.status === 'resolved' && contact.status !== 'resolved') {
        contact.resolvedAt = new Date();
        contact.resolvedBy = req.user.id;
      }
    }

    await contact.save();

    await contact.populate('user', 'name email');
    await contact.populate('resolvedBy', 'name email');

    res.json({
      success: true,
      message: 'Contact message updated successfully',
      data: { contact }
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact message',
      error: error.message
    });
  }
};

// DELETE: Delete contact message
const deleteContact = async (req, res) => {
  try {
    const contactId = req.params.id;

    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Check permissions - only admin or message owner can delete
    if (req.user && !req.user.isAdmin && contact.user?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this contact message'
      });
    }

    await Contact.findByIdAndDelete(contactId);

    res.json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message',
      error: error.message
    });
  }
};

// Get contact statistics
const getContactStats = async (req, res) => {
  try {
    const filter = {};

    // If user is authenticated and not admin, show only their stats
    if (req.user && !req.user.isAdmin) {
      filter.user = req.user.id;
    }

    const stats = await Contact.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
        }
      }
    ]);

    const priorityStats = await Contact.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        overall: stats[0] || {
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          closed: 0
        },
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get contact statistics',
      error: error.message
    });
  }
};

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats
};

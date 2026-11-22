const rateLimit = require('express-rate-limit');

// General API Rate Limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

// Stricter limiter for public Enquiry / Contact Form submissions to stop spam
const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // max 10 enquiries per 15 mins per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Enquiry submission limit reached. Please wait a few minutes before submitting another enquiry.',
  },
});

// Admin login brute force limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // max 10 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
});

module.exports = {
  generalLimiter,
  enquiryLimiter,
  loginLimiter,
};

const checkLoggedIn = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Please log in to access this operation.' });
    }
    
    next();
  };
  
  module.exports = checkLoggedIn;
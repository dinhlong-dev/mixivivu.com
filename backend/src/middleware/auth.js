const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Lấy token từ header
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Please log in' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Xác thực token
    req.user = decoded;  // Gán thông tin user vào request
    next();  // Tiếp tục xử lý route
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

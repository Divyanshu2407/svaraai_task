const authService = require('../services/authService');

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await authService.signup({ name, email, password });
  res.status(201).json({ id: user._id, name: user.name, email: user.email });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login({ email, password });
  res.json(result); // { token, user }
};

module.exports = { signup, login };

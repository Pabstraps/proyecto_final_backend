const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await userRepository.getUserByEmail(email);
      if (user) return res.status(400).json({ msg: 'El email ya existe' });
      if (password.length < 6) return res.status(400).json({ msg: 'El password debe tener al menos 6 caracteres' });

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = {
        name,
        email,
        password: passwordHash,
      };

      const savedUser = await userRepository.createUser(newUser);

      const accessToken = createAccessToken({ id: savedUser._id });
      const refreshToken = createRefreshToken({ id: savedUser._id });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/user/refresh_token',
      });

      return res.json({ accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userRepository.getUserByEmail(email);
      if (!user) return res.status(400).json({ msg: 'El usuario no existe' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Credenciales incorrectas' });

      const accessToken = createAccessToken({ id: user._id });
      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        path: '/user/refresh_token',
      });

      return res.json({ accessToken });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('refreshToken', { path: '/user/refresh_token' });
      res.json({ msg: 'Sesión cerrada' });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token) return res.status(400).json({ msg: 'Inicie sesión o regístrese' });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
        if (error) return res.status(400).json({ msg: 'Inicie sesión o regístrese' });

        const accessToken = createAccessToken({ id: user.id });
        return res.json({ accessToken });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await userRepository.getUserById(req.user.id, '-password');
      if (!user) return res.status(400).json({ msg: 'El usuario no existe' });

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '5d' });
};

module.exports = userController;

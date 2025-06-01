const dbConnect = require('./_db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
  await dbConnect();
  const { method, body } = req;

  if (method === 'POST') {
    const { type, name, email, password, identity } = body;

    if (type === 'signup') {
      try {
        const hashed = await bcrypt.hash(password, 10);
        await new User({ name, email, password: hashed, identity }).save();
        return res.status(201).json({ message: 'User created' });
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }

    if (type === 'login') {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return res.json({ token, user });
    }
  }

  res.status(405).end();
};

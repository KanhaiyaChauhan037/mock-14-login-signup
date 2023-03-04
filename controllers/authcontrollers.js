const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateToken } = require('../utils/helpers');

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user in the database
    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Redirect the user to the sign in route
    res.redirect('/signin');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    // Compare the passwords using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    // Generate a JWT token and store it in local storage
    const token = generateToken(user);
    res.cookie('token', token, { httpOnly: true, secure: true, maxAge: 3600000 }); // 1 hour expiry
    res.status(200).json({ message: 'Login Successful', user: { email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

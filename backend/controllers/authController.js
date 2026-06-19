import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  try {
    // 1. Extract the new district field from the request body
    const { name, phone, email, password, role, department, district } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Save the district to the database when creating the user
    const user = await User.create({
      name,
      phone,
      email,
      password,
      role: role || 'Citizen',
      department: department || null,
      // Only assign the district if the role is an Officer
      district: role === 'Officer' ? district : null 
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        phone: user.phone, 
        email: user.email,
        role: user.role,
        department: user.department,
        district: user.district, // 3. Return the district in the response
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone, 
        email: user.email,
        role: user.role,
        department: user.department,
        district: user.district, // Make sure login also returns the district
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// pages/api/login.js
import { connectToDatabase } from '../../db';
import User from '../../models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { email, password } = req.body;
        try {
            // Establish connection to MongoDB
            const { db } = await connectToDatabase();

            // Find the user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User not found', status: '400' });
            }

            // Compare the provided password with the hashed password stored in the database
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password', status: '401' });
            }

            return res.status(200).json({ message: 'Login successful', status: '200', role: user.role });
        } catch (error) {
            console.error('Error logging in:', error);
            return res.status(500).json({ message: 'Internal Server Error', status: '500' });
        }
    }

    return res.status(405).json({ message: 'Method Not Allowed', status: '405' });
}

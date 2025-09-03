const User = require('../../models/AuthModel/Auth.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Signup = async (req, res) => {
     
    try { 
        const { name, mobileNo, email, password, confirmPassword } = req.body;  

        if(!name || !mobileNo || !email || !password || !confirmPassword){
            return res.status(400).json({ success:false,message: 'Please enter all fields' });
        };

        if (password !== confirmPassword) {
            return res.status(400).json({ success:false,message: 'Passwords do not match' });
        };

        // Check if user already exists
        let user = await User.findOne({ email,mobileNo });
        if (user) {
            return res.status(400).json({ success:false,message: 'User already exists' });
        }
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Create new user
        user = new User({
            name,
            mobileNo,
            email,
            password: hashedPassword
        });
        await user.save();
        return res.status(200).json({ success:true ,message: 'User registered successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success:false,message: 'Failed to register User' });
    }
};

const Login = async (req, res) => {
    const { email, password } = req.body; 
    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success:false,message: 'Email not found' });
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success:false, message: 'Invalid Password' });
        }
        // Generate JWT token
        const payload = {
           id: user._id,   // use MongoDB ObjectId
             email: user.email
         };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success:true,message:"logged in successfully",token,userId:user._id,email:user.email,name:user.name });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success:false,message: 'Failed to login' });
    }
}
module.exports = { Signup, Login };
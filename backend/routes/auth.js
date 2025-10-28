import express from 'express'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js';
import jwt from 'jsonwebtoken' 

//Let use the router to create a mini express app to handle the routes separatley
//This include routes like register, login,logout etc...  
const router = express.Router();

//Lets start with register route 
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    //Ask user to fill all the fields
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }
        //to verify if the user exists already
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        //create account if not found
        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);
        res.status(201).json({id: user._id, username: user.username, email: user.email, token,})

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }

})


// Here is the Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the filed" });
        }

        //check the email field in our database to find a matching user
        const user = await User.findOne({email});

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json ({ message: "Invalid credentials"});
        }

        const token = generateToken(user._id);
        res.status(200).json({id: user._id, username: user.username, email: user.email, token, })

    } catch {
        res.status(500).json({ message: "Server error" });
    }
})


//So this is for the currently log in user info
router.get("/me", protect, async (req, res) => {
  try {
    res.status(200).json(req.user); // already password in middleware
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});


//We should also generate out jwt tokens
const generateToken = (id) => {
    return jwt.sign({id} , process.env.JWT_SECRET, {expiresIn: "30d"})
}


export default router;
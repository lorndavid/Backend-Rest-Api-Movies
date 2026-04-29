import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
const register = async (req, res) => {
  const { name, email, password } = req.body;
  //check if user already exists

  const userExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //create user
  const user = await prisma.user.create({
    data: {
      name, 
      email,
      password: hashedPassword,
    },
  });

  //generate token
  const token = generateToken(user.id, res);

  res.status(201).json({
    status: "success",
    data: {
      user : {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: token,
    },
  });

};

const login = async (req, res) => {
  const { email, password } = req.body;
  //check if user exists
  const user = await prisma.user.findUnique({
    where: { email: email },
  });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  //check if password is correct
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  //generate token
  const token = generateToken(user.id , res);


  res.status(200).json({
    status: "success",
    data: { 
      user: {
        id: user.id,
        email: user.email,
      },
      token: token,
    },
  });

};

const logout = async (req, res) => {
  res.cookie("jwt","", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully"
  });
};

export { register , login , logout };
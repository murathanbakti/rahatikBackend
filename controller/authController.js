const bcrypt = require("bcrypt");
const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await UserModel.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ username, password: hashedPassword });
        await newUser.save();

        res.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res
                .status(401)
                .json({
                    response: null,
                    messages: [
                        { code: "1", message: "Invalid username or password" },
                    ],
                });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res
                .status(401)
                .json({
                    response: null,
                    messages: [
                        { code: "1", message: "Invalid username or password" },
                    ],
                });
        }

        const token = generateToken(user.username);

        res.json({
            response: { token },
            messages: [{ code: "0", message: "OK" }],
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            response: null,
            messages: [{ code: "1", message: "Internal Server Error" }],
        });
    }
};

const generateToken = (username) => {
    const payload = { username };
    const secretKey = "your-secret-key"; // Güvenli bir anahtar kullanmalısınız
    const options = { expiresIn: "1h" }; // Token'ın geçerliliği (1 saat)

    return jwt.sign(payload, secretKey, options);
};

const logout = (req, res) => {
    req.session.destroy();
    res.json({ message: "Logout successful" });
};


module.exports = { register, login, logout };

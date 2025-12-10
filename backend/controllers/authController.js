const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/userAuthModel")

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const userData = new User({ name, email, password: hashedPassword })
        await userData.save()

        return res.status(201).json({ success: true, message: "User registered successfully...", userData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const isMatch = await bcrypt.compare(password, existingUser.password)

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        const accessToken = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_ACCESS_SECRETE_KEY, { expiresIn: "5m" })
        const refreshToken = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_REFRESH_SECRETE_KEY, { expiresIn: "7d" })

        existingUser.refreshToken = refreshToken
        await existingUser.save()

        res.cookie("refreshToken", refreshToken, {
            domain: "localhost",
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        })

        res.status(200).json({ success: true, message: "Login successfully", existingUser, accessToken, refreshToken })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.refreshToken = async (req, res) => {
    try {
        // console.log(req.cookies);
        const token = req.cookies.refreshToken

        if (!token) {
            return res.status(401).json({ success: false, message: "refresh token not found" })
        }
        const dbToken = await User.findOne({ refreshToken: token });
        if (!dbToken) {
            return res.status(400).status({ success: false, message: "refresh token is invalid" })
        }

        jwt.verify(token, process.env.JWT_REFRESH_SECRETE_KEY, (error, user) => {
            if (error) {
                return res.status(401).json({ success: false, message: "invalid refresh token" })
            }
            const newAccessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_ACCESS_SECRETE_KEY, { expiresIn: "5m" })
            res.json({ success: true, accessToken: newAccessToken })
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }

}

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.refreshToken

        if (!token) {
            return res.status(401).json({ message: false, message: "token not found" })
        }
        await User.updateOne({ refreshToken: token }, { $unset: { refreshToken: "" } })

        res.clearCookie("refreshToken", { path: "/" })
        res.status(200).json({ success: true, message: "Logout successful" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

exports.profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        // console.log(user);
        res.json(user);
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
};
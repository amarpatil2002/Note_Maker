const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const User = require("../models/userAuthModel")
const https = require('https')
const querystring = require('querystring')

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const user = await User.findOne({ email })
        if (user) {
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

        // console.log(email,password);
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        if(user.loginType === "google"){
            return res.status(400).json({success:false,message:"you can login using gmail"})
        }

       // console.log(user);
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_ACCESS_SECRETE_KEY, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_REFRESH_SECRETE_KEY, { expiresIn: "1d" })

        user.refreshToken = refreshToken
        await user.save()

        // console.log(user);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/"
        })

        res.status(200).json({ success: true, message: "Login successfully", user, accessToken })

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

        const userRecord = await User.findOne({ refreshToken: token });
        if (!userRecord) {
            return res.status(400).status({ success: false, message: "refresh token is invalid" })
        }

        jwt.verify(token, process.env.JWT_REFRESH_SECRETE_KEY, async(error, user) => {
            if (error) {
                userRecord.refreshToken = null
                await userRecord.save()
                res.clearCookie("refreshToken" , {
                    httpOnly:true,
                    sameSite:"lax",
                    secure:false,
                    path:'/'
                })

                return res.status(401).json({ success: false, message: "invalid refresh token" })
            }
            const newAccessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_ACCESS_SECRETE_KEY, { expiresIn: "15m" })
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

exports.revokeGoogle = async (req, res) => {
    try {
        // Try to identify user: prefer req.user (access token), otherwise use refresh cookie
        let userRecord = null;
        if (req.user?.id) {
            userRecord = await User.findById(req.user.id);
        } else if (req.cookies?.refreshToken) {
            userRecord = await User.findOne({ refreshToken: req.cookies.refreshToken });
        }

        if (!userRecord) {
            return res.status(400).json({ success: false, message: 'User not found or no refresh token' });
        }

        const refreshToken = userRecord.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'No refresh token to revoke' });
        }

        // call Google revoke endpoint with the refresh token
        const postData = querystring.stringify({ token: refreshToken });
        const options = {
            hostname: 'oauth2.googleapis.com',
            path: '/revoke',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const revokeReq = https.request(options, (revokeRes) => {
            let body = '';
            revokeRes.on('data', (chunk) => (body += chunk));
            revokeRes.on('end', async () => {
                // remove refreshToken locally and clear cookie regardless of provider response
                userRecord.refreshToken = undefined;
                await userRecord.save();
                res.clearCookie('refreshToken', { path: '/' });

                if (revokeRes.statusCode === 200) {
                    return res.json({ success: true, message: 'Google token revoked and logged out' });
                }

                return res.status(400).json({ success: false, message: 'Failed to revoke token at provider', providerCode: revokeRes.statusCode, body });
            });
        });

        revokeReq.on('error', async (err) => {
            userRecord.refreshToken = undefined;
            await userRecord.save();
            res.clearCookie('refreshToken', { path: '/' });
            return res.status(500).json({ success: false, message: 'Failed to call provider revoke endpoint' });
        });

        revokeReq.write(postData);
        revokeReq.end();
    } catch (error) {
        console.log('revokeGoogle error', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

exports.dashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        // console.log(user);
        res.status(200).json({success:true , user});
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
    }
};
const User = require('../User/User');

const Verify = async (req, res) => {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email, verification: verificationCode });
    if (user) {
        user.verification = 1;
        await user.save();
        res.status(200).json(user);
    } else {
        res.status(400).json({ message: 'Invalid verification code.' });
    }
};

module.exports = Verify;
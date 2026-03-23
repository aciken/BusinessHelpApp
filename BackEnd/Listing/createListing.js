const Listing = require('./Listing');
const User = require('../User/User');

module.exports = async (req, res) => {
    const { userId, title, category, description, price, reward, location, images } = req.body;

    if (!userId || !title || !category || !price || !reward) {
        return res.status(400).json({ error: 'userId, title, category, price, and reward are required' });
    }

    try {
        const listing = await Listing.create({
            userId,
            title,
            category,
            description: description || '',
            price: parseFloat(String(price).replace(/[^0-9.]/g, '')),
            reward: parseFloat(String(reward).replace(/[^0-9.]/g, '')),
            location: location || '',
            images: images || [],
            status: 'pending',
        });

        // Add listing ID to user's myListings array
        await User.findByIdAndUpdate(userId, { $push: { myListings: listing._id.toString() } });

        res.status(201).json(listing);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create listing' });
    }
};

const Listing = require('./Listing');

module.exports = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const listings = await Listing.find({ userId }).sort({ createdAt: -1 });
        res.json(listings);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
};

const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const scraper = require('./scraper');
const NewsItem = require('../models/newsItem');

router.get('/dashboard', async (req, res) => {
  try {
    const newsItems = await NewsItem.find({ isRead: false }).sort({ postedOn: -1 });
    res.status(200).json(newsItems);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/markAsRead/:id', async (req, res) => {
  const newsItemId = req.params.id;

  try {
    const newsItem = await NewsItem.findById(newsItemId);
    if (newsItem) {
      newsItem.isRead = true;
      await newsItem.save();
      res.status(200).json({ message: 'News item marked as read successfully' });
    } else {
      res.status(404).json({ error: 'News item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  const newsItemId = req.params.id;

  try {
    await NewsItem.findByIdAndDelete(newsItemId);
    res.status(200).json({ message: 'News item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.use('/auth', authRoutes);

module.exports = router;

const mongoose = require('./db');

const newsItemSchema = new mongoose.Schema({
  url: { type: String, required: true },
  hackerNewsUrl: { type: String, required: true },
  postedOn: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  isRead: { type: Boolean, default: false },
});

const NewsItem = mongoose.model('NewsItem', newsItemSchema);

module.exports = NewsItem;

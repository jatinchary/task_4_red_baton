const axios = require('axios');
const cheerio = require('cheerio');
const NewsItem = require('../models/newsItem');

const scrapeAndStore = async () => {
  const pagesToScrape = 3;
  const hackerNewsUrl = 'https://news.ycombinator.com/';

  for (let page = 1; page <= pagesToScrape; page++) {
    try {
      const response = await axios.get(`${hackerNewsUrl}?p=${page}`);
      const $ = cheerio.load(response.data);

      $('.athing').each(async function (index, element) {
        const title = $(element).find('.title > a').text();
        const url = $(element).find('.title > a').attr('href');
        const hackerNewsUrl = `${hackerNewsUrl}${$(element).find('.title > a').attr('href')}`;
        const upvotes = parseInt(
          $(element).next().find('.score').text().replace(/[^0-9]/g, ''),
          10
        );
        const comments = parseInt(
          $(element).next().find('a:contains("comment")').text().replace(/[^0-9]/g, ''),
          10
        );

        const existingNewsItem = await NewsItem.findOne({ hackerNewsUrl });

        if (existingNewsItem) {
          // Update upvotes and comments if news item already exists
          existingNewsItem.upvotes = upvotes;
          existingNewsItem.comments = comments;
          await existingNewsItem.save();
        } else {
          // Add new news item to the database
          await NewsItem.create({
            title,
            url,
            hackerNewsUrl,
            upvotes,
            comments,
          });
        }
      });
    } catch (error) {
      console.error('Error scraping and storing news items:', error);
    }
  }
};

module.exports = scrapeAndStore;


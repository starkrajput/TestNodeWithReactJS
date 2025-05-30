// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('build'));

// Initialize SQLite database
const dbPath = path.join(__dirname, 'database', 'news.db');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    image BLOB,
    author TEXT,
    published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_featured BOOLEAN DEFAULT 0,
    is_highlight BOOLEAN DEFAULT 0,
    is_latest BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin'
  );

  -- Insert default admin user if not exists
  INSERT OR IGNORE INTO users (username, password, role)
  VALUES ('cyberadmin', 'Test@123', 'admin');
`);

// Initialize with sample data if news table is empty
const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get();
if (newsCount.count === 0) {
    const sampleNews = [
        {
            title: "Breaking: Major Political Development Unfolds",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            category: "politics",
            author: "John Doe",
            is_featured: 1,
            is_highlight: 1,
            is_latest: 1
        },
        {
            title: "Championship Final: Thrilling Sports Victory",
            content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
            category: "sports",
            author: "Jane Smith",
            is_featured: 1,
            is_highlight: 0,
            is_latest: 1
        },
        {
            title: "Revolutionary Tech Innovation Announced",
            content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
            category: "technology",
            author: "Mike Johnson",
            is_featured: 0,
            is_highlight: 1,
            is_latest: 0
        }
    ];

    const insertNews = db.prepare(`
        INSERT INTO news (title, content, category, author, is_featured, is_highlight, is_latest)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    sampleNews.forEach(news => {
        insertNews.run(
            news.title,
            news.content,
            news.category,
            news.author,
            news.is_featured,
            news.is_highlight,
            news.is_latest
        );
    });
}

// Helper function to convert base64 to buffer
const base64ToBuffer = (base64String) => {
    if (!base64String) return null;
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
};

// Helper function to convert buffer to base64
const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
};

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const user = db
            .prepare('SELECT id, username, role FROM users WHERE username = ? AND password = ?')
            .get(username, password);

        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// News endpoints - SPECIFIC ROUTES FIRST (order matters!)

// Get featured news
app.get('/api/news/featured', (req, res) => {
    try {
        const news = db
            .prepare('SELECT * FROM news WHERE is_featured = 1 ORDER BY published_date DESC')
            .all();

     //   console.log('Featured news query result:', news); // Debug log

        // Convert image buffers to base64
        const newsWithImages = news.map(item => ({
            ...item,
            image: bufferToBase64(item.image)
        }));

        res.json(newsWithImages);
    } catch (error) {
        console.error('Get featured news error:', error);
        res.status(500).json({ error: 'Failed to fetch featured news' });
    }
});

// Get highlight news
app.get('/api/news/highlights', (req, res) => {
    try {
        const news = db
            .prepare('SELECT * FROM news WHERE is_highlight = 1 ORDER BY published_date DESC')
            .all();

      //  console.log('Highlight news query result:', news); // Debug log

        // Convert image buffers to base64
        const newsWithImages = news.map(item => ({
            ...item,
            image: bufferToBase64(item.image)
        }));

        res.json(newsWithImages);
    } catch (error) {
        console.error('Get highlight news error:', error);
        res.status(500).json({ error: 'Failed to fetch highlight news' });
    }
});

// Get latest news
app.get('/api/news/latests', (req, res) => {
    try {
        const news = db
            .prepare('SELECT * FROM news WHERE is_latest = 1 ORDER BY published_date DESC')
            .all();

       // console.log('Latest news query result:', news); // Debug log

        // Convert image buffers to base64
        const newsWithImages = news.map(item => ({
            ...item,
            image: bufferToBase64(item.image)
        }));

        res.json(newsWithImages);
    } catch (error) {
        console.error('Get latest news error:', error);
        res.status(500).json({ error: 'Failed to fetch latest news' });
    }
});

// Get news by category
app.get('/api/news/category/:category', (req, res) => {
    try {
        const { category } = req.params;
        const news = db
            .prepare('SELECT * FROM news WHERE category = ? ORDER BY published_date DESC')
            .all(category);

        const newsWithImages = news.map(item => ({
            ...item,
            image: bufferToBase64(item.image)
        }));

        res.json(newsWithImages);
    } catch (error) {
        console.error('Get news by category error:', error);
        res.status(500).json({ error: 'Failed to fetch news by category' });
    }
});

// Get all news
app.get('/api/news', (req, res) => {
    try {
        const news = db
            .prepare('SELECT * FROM news ORDER BY published_date DESC')
            .all();

        // Convert image buffers to base64 for client
        const newsWithImages = news.map(item => ({
            ...item,
            image: bufferToBase64(item.image)
        }));

        res.json(newsWithImages);
    } catch (error) {
        console.error('Get news error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Get single news by ID - PARAMETERIZED ROUTES LAST
app.get('/api/news/:id', (req, res) => {
    try {
        const { id } = req.params;
        const news = db
            .prepare('SELECT * FROM news WHERE id = ?')
            .get(id);

        if (!news) {
            return res.status(404).json({ error: 'News not found' });
        }

        // Convert image buffer to base64
        news.image = bufferToBase64(news.image);

        res.json(news);
    } catch (error) {
        console.error('Get news by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Create news
app.post('/api/news', (req, res) => {
    try {
        const { title, content, category, image, author, is_featured, is_highlight, is_latest } = req.body;

        // Convert base64 image to buffer
        const imageBuffer = base64ToBuffer(image);

        const stmt = db.prepare(`
            INSERT INTO news (title, content, category, image, author, is_featured, is_highlight, is_latest)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const result = stmt.run(
            title,
            content,
            category,
            imageBuffer,
            author || null,
            is_featured ? 1 : 0,
            is_highlight ? 1 : 0,
            is_latest ? 1 : 0
        );

        const newNews = db
            .prepare('SELECT * FROM news WHERE id = ?')
            .get(result.lastInsertRowid);

        // Convert image buffer to base64 for response
        newNews.image = bufferToBase64(newNews.image);

        res.status(201).json(newNews);
    } catch (error) {
        console.error('Create news error:', error);
        res.status(500).json({ error: 'Failed to create news' });
    }
});

// Update news
app.put('/api/news/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, image, author, is_featured, is_highlight, is_latest } = req.body;

        // Check if news exists
        const existingNews = db.prepare('SELECT * FROM news WHERE id = ?').get(id);
        if (!existingNews) {
            return res.status(404).json({ error: 'News not found' });
        }

        // Handle image - if new image provided, convert to buffer, otherwise keep existing
        let imageBuffer = existingNews.image;
        if (image !== undefined) {
            imageBuffer = image ? base64ToBuffer(image) : null;
        }

        const stmt = db.prepare(`
            UPDATE news 
            SET title = ?, content = ?, category = ?, image = ?, author = ?, is_featured = ?, is_highlight = ?, is_latest = ?
            WHERE id = ?
        `);

        const result = stmt.run(
            title,
            content,
            category,
            imageBuffer,
            author || null,
            is_featured ? 1 : 0,
            is_highlight ? 1 : 0,
            is_latest ? 1 : 0,
            id
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'News not found' });
        }

        const updatedNews = db
            .prepare('SELECT * FROM news WHERE id = ?')
            .get(id);

        // Convert image buffer to base64 for response
        updatedNews.image = bufferToBase64(updatedNews.image);

        res.json(updatedNews);
    } catch (error) {
        console.error('Update news error:', error);
        res.status(500).json({ error: 'Failed to update news' });
    }
});

// Delete news
app.delete('/api/news/:id', (req, res) => {
    try {
        const { id } = req.params;

        const result = db
            .prepare('DELETE FROM news WHERE id = ?')
            .run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'News not found' });
        }

        res.json({ success: true, message: 'News deleted successfully' });
    } catch (error) {
        console.error('Delete news error:', error);
        res.status(500).json({ error: 'Failed to delete news' });
    }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create database directory if it doesn't exist
const fs = require('fs');
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database path: ${dbPath}`);
});


/*// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('build'));

// Initialize SQLite database
const dbPath = path.join(__dirname, 'database', 'news.db');
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    image BLOB,
    author TEXT,
    published_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_featured BOOLEAN DEFAULT 0,
    is_highlight BOOLEAN DEFAULT 0,
    is_latest BOOLEAN DEFAULT 0

  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin'
  );

  -- Insert default admin user if not exists
  INSERT OR IGNORE INTO users (username, password, role)
  VALUES ('cyberadmin', 'Test@123', 'admin');
`);

// Initialize with sample data if news table is empty
const newsCount = db.prepare('SELECT COUNT(*) as count FROM news').get();
if (newsCount.count === 0) {
    const sampleNews = [
        {
            title: "Breaking: Major Political Development Unfolds",
            content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            category: "politics",
            author: "John Doe",
            is_featured: 1,
            is_highlight: 1,
            is_latest: 1
        },
        {
            title: "Championship Final: Thrilling Sports Victory",
            content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
            category: "sports",
            author: "Jane Smith",
            is_featured: 1,
            is_highlight: 0,
            is_latest: 1
        },
        {
            title: "Revolutionary Tech Innovation Announced",
            content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
            category: "technology",
            author: "Mike Johnson",
            is_featured: 0,
            is_highlight: 1,
            is_latest: 0
        }
    ];

    const insertNews = db.prepare(`
        INSERT INTO news (title, content, category, author, is_featured, is_highlight,is_latest)
        VALUES (?, ?, ?, ?, ?, ?,?)
    `);

    sampleNews.forEach(news => {
        insertNews.run(
            news.title,
            news.content,
            news.category,
            news.author,
            news.is_featured,
            news.is_highlight,
            news.is_latest
        );
    });
}

// Helper function to convert base64 to buffer
const base64ToBuffer = (base64String) => {
    if (!base64String) return null;
    const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
};

// Helper function to convert buffer to base64
const bufferToBase64 = (buffer) => {
    if (!buffer) return null;
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
};

// Authentication endpoint
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    try {
        const user = db
            .prepare('SELECT id, username, role FROM users WHERE username = ? AND password = ?')
            .get(username, password);

        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// News endpoints
// Get all news
app.get('/api/news', (req, res) => {
    try {
        const news = db
            .prepare('SELECT * FROM news ORDER BY published_date DESC')
            .all();

        // Convert image buffers to base64 for client
        const newsWithImages = news.map(item => ({
            ...item,
            image: bufferToBase64(item.image)
        }));

        res.json(newsWithImages);
    } catch (error) {
        console.error('Get news error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Get single news by ID
app.get('/api/news/:id', (req, res) => {
    try {
        const { id } = req.params;
        const news = db
            .prepare('SELECT * FROM news WHERE id = ?')
            .get(id);

        if (!news) {
            return res.status(404).json({ error: 'News not found' });
        }

        // Convert image buffer to base64
        news.image = bufferToBase64(news.image);

        res.json(news);
    } catch (error) {
        console.error('Get news by ID error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

// Get news by category

// Put specific routes FIRST
app.get('/api/news/category/:category', (req, res) => {
    try {
        const { category } = req.params;
        const news = db
            .prepare('SELECT * FROM news WHERE category = ? ORDER BY published_date DESC')
            .all(category);

        const newsWithImages = news.map(item => ({
            ...item,
            image: bufferToBase64(item.image)
        }));

        res.json(newsWithImages);
    } catch (error) {
        console.error('Get news by category error:', error);
        res.status(500).json({ error: 'Failed to fetch news by category' });
    }
});

// Put parameterized routes AFTER
app.get('/api/news/:id', (req, res) => {
    // ... existing code
});

// Get featured news
app.get('/api/news/featured', (req, res) => {
    try {
        const news = db
            .prepare('SELECT * FROM news WHERE is_featured = 1 ORDER BY published_date DESC')
            .all();

        // Convert image buffers to base64
        const newsWithImages = news.map(item => ({
            ...item,
            image: bufferToBase64(item.image)
        }));

        res.json(newsWithImages);
    } catch (error) {
        console.error('Get featured news error:', error);
        res.status(500).json({ error: 'Failed to fetch featured news' });
    }
});

// Get highlight news
app.get('/api/news/highlights', (req, res) => {
    try {
        const news = db
            .prepare('SELECT * FROM news WHERE is_highlight = 1 ORDER BY published_date DESC')
            .all();

        // Convert image buffers to base64
        const newsWithImages = news.map(item => ({
            ...item,
            image: bufferToBase64(item.image)
        }));

        res.json(newsWithImages);
    } catch (error) {
        console.error('Get highlight news error:', error);
        res.status(500).json({ error: 'Failed to fetch highlight news' });
    }
});
// Get latest news
app.get('/api/news/latests', (req, res) => {
    try {
        const news = db
            .prepare('SELECT * FROM news WHERE is_latest = 1 ORDER BY published_date DESC')
            .all();

        // Convert image buffers to base64
        const newsWithImages = news.map(item => ({
            ...item,
            image: bufferToBase64(item.image)
        }));

        res.json(newsWithImages);
    } catch (error) {
        console.error('Get latest news error:', error);
        res.status(500).json({ error: 'Failed to fetch latest news' });
    }
});

// Create news
app.post('/api/news', (req, res) => {
    try {
        const { title, content, category, image, author, is_featured, is_highlight,is_latest } = req.body;

        // Convert base64 image to buffer
        const imageBuffer = base64ToBuffer(image);

        const stmt = db.prepare(`
            INSERT INTO news (title, content, category, image, author, is_featured, is_highlight,is_latest)
            VALUES (?, ?, ?, ?, ?, ?, ?,?)
        `);

        const result = stmt.run(
            title,
            content,
            category,
            imageBuffer,
            author || null,
            is_featured ? 1 : 0,
            is_highlight ? 1 : 0,
            is_latest ? 1:0

        );

        const newNews = db
            .prepare('SELECT * FROM news WHERE id = ?')
            .get(result.lastInsertRowid);

        // Convert image buffer to base64 for response
        newNews.image = bufferToBase64(newNews.image);

        res.status(201).json(newNews);
    } catch (error) {
        console.error('Create news error:', error);
        res.status(500).json({ error: 'Failed to create news' });
    }
});

// Update news
app.put('/api/news/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, category, image, author, is_featured, is_highlight } = req.body;

        // Check if news exists
        const existingNews = db.prepare('SELECT * FROM news WHERE id = ?').get(id);
        if (!existingNews) {
            return res.status(404).json({ error: 'News not found' });
        }

        // Handle image - if new image provided, convert to buffer, otherwise keep existing
        let imageBuffer = existingNews.image;
        if (image !== undefined) {
            imageBuffer = image ? base64ToBuffer(image) : null;
        }

        const stmt = db.prepare(`
            UPDATE news 
            SET title = ?, content = ?, category = ?, image = ?, author = ?, is_featured = ?, is_highlight = ?, is_latest=?
            WHERE id = ?
        `);

        const result = stmt.run(
            title,
            content,
            category,
            imageBuffer,
            author || null,
            is_featured ? 1 : 0,
            is_highlight ? 1 : 0,
            is_latest ? 1:0,
            id
        );

        if (result.changes === 0) {
            return res.status(404).json({ error: 'News not found' });
        }

        const updatedNews = db
            .prepare('SELECT * FROM news WHERE id = ?')
            .get(id);

        // Convert image buffer to base64 for response
        updatedNews.image = bufferToBase64(updatedNews.image);

        res.json(updatedNews);
    } catch (error) {
        console.error('Update news error:', error);
        res.status(500).json({ error: 'Failed to update news' });
    }
});

// Delete news
app.delete('/api/news/:id', (req, res) => {
    try {
        const { id } = req.params;

        const result = db
            .prepare('DELETE FROM news WHERE id = ?')
            .run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'News not found' });
        }

        res.json({ success: true, message: 'News deleted successfully' });
    } catch (error) {
        console.error('Delete news error:', error);
        res.status(500).json({ error: 'Failed to delete news' });
    }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Create database directory if it doesn't exist
const fs = require('fs');
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database path: ${dbPath}`);
});*/
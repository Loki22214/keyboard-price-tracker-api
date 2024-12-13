// Import dependencies
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./keyboards.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});


// API Endpoints

// Get all products
app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Get all products sorted by price (lowest to highest or highest to lowest)
app.get('/products/sort', (req, res) => {
    const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
    db.all(`SELECT * FROM products ORDER BY price ${order}`, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Search products by title
app.get('/products/search', (req, res) => {
    const title = req.query.title;
    if (!title) {
        return res.status(400).json({ error: 'Title query parameter is required.' });
    }

    const query = 'SELECT * FROM products WHERE name LIKE ?';
    const searchTerm = `%${title}%`;

    db.all(query, [searchTerm], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.post('/products', (req, res) => {
    const { name, price, url} = req.body;
    if (!title || !price) {
        return res.status(400).json({ error: 'Title and price are required.' });
    }
    const query = 'INSERT INTO products (name, price, url) VALUES (?, ?, ?)';
    db.run(query, [name, price, url || null], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json({ id: this.lastID });
        }
    });
});

app.delete('/products/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Product not found.' });
        } else {
            res.json({ message: 'Product deleted successfully.' });
        }
    });
});

app.patch('/products/:id', (req, res) => {
    const { title, price, description } = req.body;
    const id = req.params.id;

    let updates = [];
    if (title) updates.push(`title = '${title}'`);
    if (price) updates.push(`price = ${price}`);
    if (description) updates.push(`description = '${description}'`);

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update.' });
    }

    const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
    db.run(query, [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (this.changes === 0) {
            res.status(404).json({ error: 'Product not found.' });
        } else {
            res.json({ message: 'Product updated successfully.' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

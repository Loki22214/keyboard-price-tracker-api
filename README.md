# Keyboard Price Tracker API

## Overview
`Keyboard Price Tracker API` is an Express.js application that provides endpoints to access and manipulate keyboard product data stored in a SQLite database.

## Features
- Fetch all keyboard products.
- Sort products by price (ascending or descending).
- Search for products by name.

## Endpoints
### 1. Get All Products
**`GET /products`**  
Returns all keyboard products in the database.

### 2. Sort Products by Price
**`GET /products/sort?order=[asc|desc]`**  
Sorts products by price, either ascending (`asc`) or descending (`desc`).

### 3. Search Products by Title
**`GET /products/search?title=[keyword]`**  
Searches for products by title using the provided keyword.

## Technologies
- **Node.js**
- **Express.js**
- **SQLite**

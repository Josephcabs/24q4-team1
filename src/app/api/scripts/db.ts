import fs from "fs";
import path from "path";
import Database, { Database as SQLiteDatabase } from "better-sqlite3";
import { Item } from "@/types/item";
import axios from "axios";

let db: SQLiteDatabase|null  = null;

  function getDatabaseConnection(): SQLiteDatabase {
  if (!db) {
    const dbPath = path.resolve("src/app/api/scripts", "../../../../data/database.db");

    // Ensure the database directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(dbPath);

    initializeTables(db);
  }
  return db;
}
function initializeTables(db:SQLiteDatabase){
const items = `
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    images TEXT,
    category TEXT,
    stock INTEGER NOT NULL,
    rating REAL,
    discountPercentage REAL,
    brand TEXT,
    sku TEXT,
    warrantyInformation TEXT,
    shippingInformation TEXT,
    reviews TEXT
  )
`;
db.exec(items);

const cart = `
  CREATE TABLE IF NOT EXISTS cart(
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT NOT NULL
)
`
db.exec(cart);

const history = `
  CREATE TABLE IF NOT EXISTS history(
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL, 
    quantity INTEGER NOT NULL, 
    image TEXT NOT NULL
  )
`
db.exec(history);
}

async function fetchDataAndStore() {
  const db = getDatabaseConnection();
  try {
    const response = await axios.get('https://dummyjson.com/products?limit=0');

    const items = response.data.products;

    if (!Array.isArray(items)) {
      throw new Error("The 'products' field is not an array or is missing.");
    }

    const insertData = db.prepare(`
      INSERT OR IGNORE INTO items (
        id, title, description, price, images, category, stock, rating,
        discountPercentage, brand, sku, warrantyInformation, shippingInformation, reviews
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    items.forEach((item: Item) => {
      try {
        const price = parseFloat(item.price.toString());
        if (isNaN(price)) {
          throw new Error(`Invalid price value for item with id ${item.id}`);
        }

        insertData?.run(
          item.id,
          item.title,
          item.description,
          price,
          item.images ? JSON.stringify(item.images) : null,
          item.category ?? null,
          item.stock,
          item.rating ?? null,
          item.discountPercentage ?? null,
          item.brand ?? null,
          item.sku ?? null,
          item.warrantyInformation ?? null,
          item.shippingInformation ?? null,
          item.reviews ? JSON.stringify(item.reviews) : null
        );

        console.log(`Inserted item with ID: ${item.id}`);
      } catch (err) {
        console.error(`Error inserting item with ID: ${item.id}`, err);
      }
    });

    console.log('Data fetched from API and inserted into the database successfully!');
  } catch (error) {
    console.error('Error fetching or inserting data:', error);
  }
}
fetchDataAndStore();

export default getDatabaseConnection;
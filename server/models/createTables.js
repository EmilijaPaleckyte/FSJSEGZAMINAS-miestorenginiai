const mysql = require("mysql2/promise");

const createTables = async () => {
  const Users = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') NOT NULL
    );
  `;

  const Categories = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    );
  `;

  const Events = `
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category_id INT NOT NULL,
      time DATETIME NOT NULL,
      place VARCHAR(255) NOT NULL,
      photo VARCHAR(255),
      user_id INT NOT NULL,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  const Ratings = `
    CREATE TABLE IF NOT EXISTS ratings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      user_id INT NOT NULL,
      rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
      FOREIGN KEY (event_id) REFERENCES events(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  try {
    const connection = await mysql.createConnection({
      host: "localhost",
      user: "root", 
      password: "root",
      database: "web", 
    });

    await connection.query(Users);
    await connection.query(Categories);
    await connection.query(Events);
    await connection.query(Ratings);

    console.log("All tables have been created.");
    await connection.end();
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

createTables();
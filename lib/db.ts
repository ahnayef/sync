import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;


if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.error('❌ Missing required database configuration. Please check your environment variables.');
    process.exit(1);
}


const db = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD || '',
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});


db.getConnection()
    .then((connection) => {
        console.log('✅ Database connection established successfully');
        console.log(`Connected to MySQL database: ${DB_NAME} as user: ${DB_USER} on host: ${DB_HOST}`);
        connection.release();
    })
    .catch((error) => {
        console.error('❌ Failed to connect to the database:', error);
        process.exit(1);
    });

export default db;
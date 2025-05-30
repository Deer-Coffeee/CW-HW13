import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3500;

export const pool = mysql.createPool({

host: process.env.DB_HOST,

port: process.env.DB_PORT ? +process.env.DB_PORT : 3306,

database: process.env.DB_NAME,

user: process.env.DB_USER,

password: process.env.DB_PASSWORD || '',
});

//Bookstore db connection
const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    password: "password",
    port: 5433,
    database: "bookstore"
})

module.exports = pool;
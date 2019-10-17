const mysql = require('mysql')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tonton',
    timezone: 'UTC'
})

module.exports = {
    sqlDB: conn
}
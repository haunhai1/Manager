const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quan_ly_du_an'
};

const db = mysql.createConnection(dbConfig);

db.connect(err => {
  if (err) {
    console.error('Lỗi kết nối:', err);
    return;
  }
  console.log('Đã kết nối database!');
});

module.exports = db;
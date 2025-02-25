const db = require("./database");
const exp = require("express");
const app = exp();
const port = 3000;
var cors = require("cors");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const JWT_SECRET = '2025'; // Khóa bí mật cho JWT
const multer = require('multer');
const path = require('path');

// Cấu hình multer - Di chuyển phần này lên trước các routes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
//tải file hình ảnh lên
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // Giới hạn file 5MB
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Chỉ chấp nhận file ảnh!'), false)
    }
  }
});

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(exp.json());
app.use(exp.urlencoded({ extended: true }));
app.use('/uploads', exp.static('uploads'));

app.get("/", (req, res) => {
  res.json("{'message': 'API NodeJS Assignment'}");
});
//other path
app.get("/du_an", function (req, res) {
  let sql = `SELECT id, ten_du_an, ngay_start, tien, leader, thanh_vien
        FROM du_an ORDER BY ngay_start desc`;
  db.query(sql, function (err, data) {
    if (err) res.json({ message: err });
    else res.json(data);
  });
});

app.get("/du_an/:id", function (req, res) {
  let id = req.params.id;
  if (isNaN(id) == true) return res.json({ message: "Dự án không tồn tại" });
  let sql = `SELECT id, ten_du_an, ngay_start, tien, leader, thanh_vien
        FROM du_an WHERE id=? ORDER BY ngay_start desc`;
  db.query(sql, id, function (err, data) {
    if (err) res.json({ message: err });
    else if (data.length == 0) res.json({ message: "Dự án không có" });
    else res.json(data[0]);
  });
});

//Phần này là để lấy thông tin từ sql rồi hiển thị ra chi tiết nhân viên
app.get("/nhan_vien", function (req, res) {
  let sql = `SELECT id, ho , ten, ngay_sinh, phai, khu_vuc,hinh_anh FROM nhan_vien`;
  db.query(sql, function (err, data) {
    if (err) res.json({ message: err });
    else res.json(data);
  });
});

app.get("/nhan_vien/chi_tiet/:id", function (req, res) {
  let id = req.params.id;
  if (isNaN(id) == true) return res.json({ message: "Nhân viên không tồn tại" }); //khi không tìm mấy dữ liệu từ csdl thì sẽ báo lỗi
  let sql = `SELECT id, ho, ten, ngay_sinh, phai, khu_vuc, hinh_anh, mo_ta
        FROM nhan_vien WHERE id=?`;
  db.query(sql, id, function (err, data) {
    if (err) res.json({ message: err });
    else if (data.length == 0) res.json({ message: "Nhân viên không có" });
    else res.json(data[0]);
  });
});

//tương tự hiển thị danh sách task, cũng lấy từ csdl có sẵn
app.get("/task", function (req, res) {
  let sql = `
    SELECT t.id, t.ten_task, t.mo_ta, t.nhan_vien_id, t.status, t.priority, d.ten_du_an 
    FROM task t
    JOIN du_an d ON t.du_an_id = d.id
  `;
  db.query(sql, function (err, data) {
    if (err) res.json({ message: err });
    else res.json(data);
  });
});

app.get("/task/:id", function (req, res) {
  let id = req.params.id;
  if (isNaN(id) == true) return res.json({ message: "Task không tồn tại" });
  let sql = `SELECT id, ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority
        FROM task WHERE id=?`;
  db.query(sql, id, function (err, data) {
    if (err) res.json({ message: err });
    else if (data.length == 0) res.json({ message: "Task không có" });
    else res.json(data[0]);
  });
});

//Thêm dự án 
app.post("/du_an", function (req, res) {
  let { ten_du_an, ngay_start, tien, leader, thanh_vien } = req.body;
  console.log(req.body, thanh_vien.join(","));
  let sql = "INSERT INTO du_an SET ten_du_an=?,ngay_start=?,tien=?,leader=?, thanh_vien=?";
  console.log(sql);
  db.query(sql, [ten_du_an, ngay_start, tien, leader, thanh_vien.join(",")],
    (err, d) => {
      if (err) res.json({ "Thong Bao": "Loi khi chen du an: " + err });
      else res.json({ "Thong Bao": "Da chen xong du an" });
    }
  );
});
// cập nhật dự án 
app.put("/du_an/:id", function (req, res) {
  let data = req.body;
  let id = req.params.id;
  let { ten_du_an, ngay_start, tien, leader, thanh_vien } = req.body;
  let sql =
    "UPDATE du_an SET ten_du_an=?,ngay_start=?,tien=?,leader=?, thanh_vien=? WHERE id=?";
  db.query(
    sql,
    [ten_du_an, ngay_start, tien, leader, thanh_vien.join(","), id],
    (err, d) => {
      if (err) res.json({ "Thong Bao": "Loi khi cap nhat du an: " + err });
      else res.json({ "Thong Bao": "Da cap nhat xong du an" });
    }
  );
});
//xóa dự án 
app.delete("/du_an/:id", function (req, res) {
  let id = req.params.id;
  let { ten_du_an, ngay_start, tien, leader, thanh_vien } = req.body;
  let sql = "DELETE FROM du_an WHERE id = ?";
  db.query(sql, id, (err, d) => {
    if (err) res.json({ "Thong Bao": "Loi khi xoa du an: " + err });
    else res.json({ "Thong Bao": "Da xoa xong du an" });
  });
});


//--------------------------------PHẦN NHÂN VIÊN---------------------------------------------------//
// API thêm nhân viên
app.post("/nhan_vien", upload.single('hinh_anh'), function (req, res) {
  try {
    let { ho, ten, ngay_sinh, phai, khu_vuc, mo_ta } = req.body;
    let hinh_anh = req.file ? `/uploads/${req.file.filename}` : null;

    // Kiểm tra dữ liệu đầu vào
    if (!ho || !ten || !ngay_sinh || phai === undefined || !khu_vuc) {
      return res.status(400).json({
        "Thong Bao": "Vui lòng điền đầy đủ thông tin bắt buộc"
      });
    }

    let sql = "INSERT INTO nhan_vien (ho, ten, ngay_sinh, phai, khu_vuc, hinh_anh, mo_ta) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(sql, [ho, ten, ngay_sinh, phai, khu_vuc, hinh_anh, mo_ta], (err, result) => {
      if (err) {
        console.error("Lỗi khi thêm nhân viên:", err);
        return res.status(500).json({
          "Thong Bao": "Lỗi khi thêm nhân viên: " + err.message
        });
      }

      res.json({
        "Thong Bao": "Đã thêm thành công nhân viên với ID: " + result.insertId,
        "hinh_anh": hinh_anh
      });
    });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({
      "Thong Bao": "Lỗi server khi xử lý yêu cầu"
    });
  }
});
//cập nhật chi tiết nhân viên
app.put("/nhan_vien/:id", upload.single('hinh_anh'), function (req, res) {
  try {
    let id = req.params.id;
    let { ho, ten, ngay_sinh, phai, khu_vuc, mo_ta } = req.body;//họ tên
    let hinh_anh = req.file ? `/uploads/${req.file.filename}` : null;//cái này là để hiển thị ra ảnh nhân viên

    // Kiểm tra dữ liệu đầu vào
    if (!ho || !ten || !ngay_sinh || phai === undefined || !khu_vuc) {
      return res.status(400).json({
        "Thong Bao": "Vui lòng điền đầy đủ thông tin bắt buộc"
      });
    }

    let sql, params;
    
    if (hinh_anh) {
      // Nếu có upload ảnh mới
      sql = "UPDATE nhan_vien SET ho=?, ten=?, ngay_sinh=?, phai=?, khu_vuc=?, hinh_anh=?, mo_ta=? WHERE id=?";
      params = [ho, ten, ngay_sinh, phai, khu_vuc, hinh_anh, mo_ta, id];
    } else {
      // Nếu không thay đổi ảnh
      sql = "UPDATE nhan_vien SET ho=?, ten=?, ngay_sinh=?, phai=?, khu_vuc=?, mo_ta=? WHERE id=?";
      params = [ho, ten, ngay_sinh, phai, khu_vuc, mo_ta, id];
    }

    db.query(sql, params, (err, result) => {
      if (err) {
        console.error("Lỗi khi cập nhật nhân viên:", err); //cứ điền thiếu cái j là nó lỗi 
        return res.status(500).json({
          "Thong Bao": "Lỗi khi cập nhật nhân viên: " + err.message
        });
      }

      res.json({
        "Thong Bao": "Đã cập nhật thành công nhân viên",
        "hinh_anh": hinh_anh
      });
    });
  } catch (error) { //không thêm cũng được
    console.error("Lỗi server:", error);
    res.status(500).json({
      "Thong Bao": "Lỗi server khi xử lý yêu cầu"
    });
  }
});
//xóa nhân viên
app.delete("/nhan_vien/:id", function (req, res) {
  let id = req.params.id;
  let sql = "DELETE FROM nhan_vien WHERE id=?";
  db.query(sql, id, (err, d) => {
    if (err) res.json({ "Thong Bao": "Loi khi xoa nhan vien: " + err });
    else res.json({ "Thong Bao": "Da xoa xong nhan vien" });
  });
});



//--------------------------------PHẦN TASK---------------------------------------------------//
//HIỂN THỊ DANH SÁCH TASK
app.get("/task", function (req, res) {
  let sql = `
    SELECT t.id, t.ten_task, t.mo_ta, t.nhan_vien_id, t.status, t.priority, d.ten_du_an 
    FROM task t
    JOIN du_an d ON t.du_an_id = d.id
  `;
  db.query(sql, function (err, data) {
    if (err) res.json({ message: err });
    else res.json(data);
  });
});

app.get("/task/:id", function (req, res) {
  let id = req.params.id;
  if (isNaN(id) == true) return res.json({ message: "Task không tồn tại" });
  let sql = `SELECT id, ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority FROM task WHERE id=? `;
  db.query(sql, id, function (err, data) {
    if (err) res.json({ message: err });
    else if (data.length == 0) res.json({ message: "Task không có" });
    else res.json(data[0]);
  });
});

//thêm task
app.post('/task', function (req, res) {
  let { ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority } = req.body;
  let sql = "INSERT INTO task SET ten_task=?, du_an_id=?, nhan_vien_id=?, mo_ta=?, status=?, priority=?";
  db.query(sql, [ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority], (err, d) => {
    if (err) res.json({ 'Thông báo': "Lỗi khi chèn task: " + err });
    else res.json({ "Thông báo": "Đã chèn xong task" });
  });
});

//cập nhật task
app.put('/task/:id', function (req, res) {
  let data = req.body;
  let id = req.params.id;
  let { ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority } = req.body;
  let sql = "UPDATE task SET ten_task=?, du_an_id=?, nhan_vien_id=?, mo_ta=?, status=?, priority=? WHERE id=?";
  db.query(sql, [ten_task, du_an_id, nhan_vien_id, mo_ta, status, priority, id], (err, d) => {
    if (err) res.json({ 'Thông báo': "Lỗi khi cập nhật task: " + err });
    else res.json({ "Thông báo": "Đã cập nhật task" });
  });
});

//xóa task
app.delete('/task/:id', function (req, res) {
  let id = req.params.id;
  let sql = `DELETE FROM task WHERE id=?`;
  db.query(sql, id, (err, d) => {
    if (err) res.json({ 'Thông báo': "Lỗi khi xóa nhân viên: " + err });
    else res.json({ "Thông báo": "Đã xóa nhân viên" });
  });
});

//Đăng ký
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    // Kiểm tra username đã tồn tại chưa
    db.query('SELECT * FROM nguoi_dung WHERE username = ?', [username],
      async (err, results) => {
        if (err) {
          console.error('Lỗi truy vấn database:', err);
          return res.status(500).json({ message: 'Lỗi server khi kiểm tra username' });
        }

        if (results && results.length > 0) {
          return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
        }

        try {
          // Mã hóa password
          const hashedPassword = await bcrypt.hash(password, saltRounds);

          // Thêm user mới
          db.query(
            'INSERT INTO nguoi_dung (username, password, email) VALUES (?, ?, ?)',
            [username, hashedPassword, email],
            (insertErr, result) => {
              if (insertErr) {
                console.error('Lỗi khi thêm user:', insertErr);
                return res.status(500).json({ message: 'Lỗi server khi tạo tài khoản' });
              }
              res.status(201).json({ message: 'Đăng ký thành công' });
            }
          );
        } catch (hashError) {
          console.error('Lỗi khi mã hóa password:', hashError);
          return res.status(500).json({ message: 'Lỗi server khi xử lý mật khẩu' });
        }
      });
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng ký' });
  }
});
//--------------------------------PHẦN BẢO VỆ (ĐĂNG NHẬP VÀO MỚI CHO PHÉP THAO TÁC)---------------------------------------------------//
//Đăng nhập
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    db.query('SELECT * FROM nguoi_dung WHERE username = ?', [username],
      async (err, results) => {
        if (err) {
          console.error('Lỗi truy vấn database:', err);
          return res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
        }

        if (!results || results.length === 0) {
          return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }

        const user = results[0];

        try {
          const match = await bcrypt.compare(password, user.password);

          if (match) {
            // Tạo JWT token
            const token = jwt.sign(
              {
                userId: user.id,
                username: user.username
              },
              JWT_SECRET,
              { expiresIn: '1h' }
            );

            res.json({
              idToken: token,
              expiresIn: 3600, // 1 giờ tính bằng giây
              message: 'Đăng nhập thành công'
            });
          } else {
            res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
          }
        } catch (compareError) {
          console.error('Lỗi khi so sánh password:', compareError);
          res.status(500).json({ message: 'Lỗi server khi xác thực' });
        }
      });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Lỗi server khi đăng nhập' });
  }
});

// Middleware verifyToken
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    return res.status(401).json({ message: 'Không tìm thấy token' });
  }

  const token = bearerHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token không hợp lệ' });
  }
};

// Ví dụ route được bảo vệ bằng JWT
app.get('/protected-route', verifyToken, (req, res) => {
  res.json({
    message: 'Bạn đã truy cập thành công route được bảo vệ',
    user: req.user
  });
});

// Áp dụng middleware cho route đổi mật khẩu
app.post('/change-password', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.userId;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
  }

  try {
    // Lấy thông tin user từ database
    db.query('SELECT * FROM nguoi_dung WHERE id = ?', [userId], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Lỗi server' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
      }

      // Mã hóa mật khẩu mới
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Cập nhật mật khẩu
      db.query(
        'UPDATE nguoi_dung SET password = ? WHERE id = ?',
        [hashedNewPassword, userId],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ message: 'Lỗi khi cập nhật mật khẩu' });
          }
          res.json({ message: 'Đổi mật khẩu thành công' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server' });
  }
});


// Route contact
var nodemailer = require('nodemailer');
// Lấy dữ liệu gmail
app.get('/contact', function(req, res) {
  res.render('contact');
  mess: req.flash('mess');
});
// Gửi email
app.post('/contact/send', function(req, res) {
  const { firstName, lastName, email, subject, message } = req.body;
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'phantrunghauntn2@gmail.com',
      pass: 'uoyf cqaf woqi dshz'
    }
  });

  var mailOptions = {
    from: '"Contact Form" <phantrunghauntn2@gmail.com>', // Tài khoản gửi cố định
    to: 'phantrunghauntn2@gmail.com',
    replyTo: email, // Email của người dùng để nhận phản hồi
    subject: `New Contact Form: ${subject}`,
    html: `
      <h3>Thông tin liên hệ mới</h3>
      <ul>
        <li>Họ và tên: ${firstName} ${lastName}</li>
        <li>Email người gửi: ${email}</li>
        <li>Chủ đề: ${subject}</li>
        <li>Nội dung: ${message}</li>
      </ul>
    `
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Gửi email thất bại' });
    } else {
      console.log('Email sent: ' + info.response);
      res.json({ success: true, message: 'Gửi email thành công' });
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Ung dung dang chay voi port ${port}`);
});


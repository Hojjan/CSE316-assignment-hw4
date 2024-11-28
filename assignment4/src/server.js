const express = require('express');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3001;
const jwt = require("jsonwebtoken");


// CORS 설정 (React에서 요청을 허용하기 위함)
app.use(cors());

app.use(express.json());

cloudinary.config({
  cloud_name: "dgou2evcb",
  api_key: "872698482192992",
  api_secret: "8R05iBI5XgJ4xE2lvXVPWDpVdfw",
});

const upload = multer({ dest: "uploads/" });

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hochan2001!', // 실제 비밀번호로 변경
  database: 'cse316hw'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
}); 

app.post("/api/user/uploadProfileImage", upload.single("image"), async (req, res) => {
  const { userId } = req.body; // 클라이언트에서 전송된 userId
  const file = req.file;

  if (!file || !userId) {
      return res.status(400).json({ error: "Missing file or userId" });
  }

  try {
      // Cloudinary에 이미지 업로드
      const result = await cloudinary.uploader.upload(file.path, {
          folder: "user_profile_images",
      });

      const imageUrl = result.secure_url;

      // MySQL에 URL 업데이트
      const updateQuery = "UPDATE user SET img_src = ? WHERE id = ?";
      db.query(updateQuery, [imageUrl, userId], (err, results) => {
          if (err) {
              console.error("Error updating user image in database:", err);
              return res.status(500).json({ error: "Database error during image update" });
          }

          res.status(200).json({
              message: "Profile image uploaded and saved successfully!",
              imageUrl,
          });
      });
  } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      res.status(500).json({ error: "Failed to upload image" });
  }
});


// 데이터 조회 API for cse316hw schema의 facilities table
app.get('/api/facilities', (req, res) => {
  const query = 'SELECT * FROM cse316hw.facilities';
  db.query(query, (err, results) => {
    if (err) {res.status(500).json();} 
    else {res.json(results);}
  });
});

// 데이터 조회 API for reservation table
app.get('/api/reservation', (req, res) => {
  const query = 'SELECT * FROM cse316hw.reservation';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reservation data:', err);
      res.status(500).json({ error: 'Failed to retrieve reservations' });
    } else {
      res.status(200).json(results);
    }
  });
});

app.post("/api/user/updatePassword", async (req, res) => {
  const { userId, hashedPassword } = req.body;

  if (!userId || !hashedPassword) {
      return res.status(400).json({ error: "User ID and new password are required." });
  }

  try {
      //const hashedPassword = hashutil("your-salt", newPassword); // 비밀번호 해싱
      const query = "UPDATE user SET password = ? WHERE id = ?";
      db.query(query, [hashedPassword, userId], (err, result) => {
          if (err) {
              console.error("Error updating password:", err);
              return res.status(500).json({ error: "Failed to update password." });
          }

          res.status(200).json({ message: "Password updated successfully!" });
      });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Server error." });
  }
});


// 데이터 전송 for cse316hw schema의 reservation table
app.post('/api/reservation', (req, res) => {
  const { facility, date, numPeople, suny, purpose, src, location, user } = req.body;
  //const user = "Hochan Jun"
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to start transaction' });
    }

    const query = `
      INSERT INTO reservation 
      (reservation_date, user_number, is_suny, purpose, reservation_name, user_name, location, image_src) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [date, numPeople, suny, purpose, facility, user, location, src], (err, result) => {
      if (err) {
        // 오류 발생 시 트랜잭션 롤백
        return db.rollback(() => {
          res.status(500).json({ error: 'Failed to save reservation', details: err.message });
        });
      }

      // 성공 시 커밋
      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Failed to commit transaction' });
          });
        }
        res.status(200).json({ message: 'Reservation successful!' });
      });
    });
  });

});

app.delete('/api/reservation/:id', (req, res) => {
  const reservationId = req.params.id;
  
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ error: 'Failed to start transaction' });
    }

    const query = 'DELETE FROM reservation WHERE id = ?';

    db.query(query, [reservationId], (err, result) => {
      if (err) {
        console.error('Error deleting reservation:', err);
        return db.rollback(() => {
          res.status(500).json({ error: 'Failed to delete reservation' });
        });
      }
      
      if (result.affectedRows === 0) {
        // 삭제할 레코드가 없는 경우 롤백 및 404 응답
        return db.rollback(() => {
          res.status(404).json({ message: 'No reservation found with the given ID' });
        });
      }

      // 성공적으로 삭제되었을 경우 커밋
      db.commit((err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Failed to commit transaction' });
          });
        }
        console.log(`Deleted reservation with ID: ${reservationId}`); // 삭제 확인 로그
        res.status(200).json({ message: 'Reservation deleted successfully' });
      });
    });
  });
});


const SECRET_KEY = "hochan2001";

// 회원가입 처리
app.post("/api/user", (req, res) => {
  console.log("Request body: ", req.body);

  const { action, email, password, username } = req.body;
  const checkEmailQuery = "SELECT * FROM user WHERE email_address = ?";

  if(action === "signup"){
    // 이메일 중복 확인
    
    db.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
        return res.status(500).json({ err: "Database error during email check." });
      }

      if (results.length > 0) {
        return res.status(400).json({ error: "Email already exists." });
      }

      // 사용자 추가
      const insertUserQuery = "INSERT INTO user (email_address, password, username) VALUES (?, ?, ?)";
      db.query(insertUserQuery, [email, password, username], (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Database error during user insertion." });
        }
        const userId = results.insertId;
        const token = jwt.sign({ id: userId, email }, SECRET_KEY, { expiresIn: "1h" });

        res.status(201).json({ message: "User registered successfully!" , token,});
      });
    });
  }
  else if(action === "signin"){
    db.query(checkEmailQuery, [email], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal server error." });
      }

      // 이메일이 존재하지 않는 경우
      if (results.length === 0) {
          return res.status(404).json({ error: "Wrong email." });
      }

      // 비밀번호 검증
      const user = results[0]; // DB에서 가져온 사용자 정보
      if (password !== user.password) {
        return res.status(401).json({ error: "Wrong password." });
      }

      const token = jwt.sign({ id: user.id, email }, SECRET_KEY, { expiresIn: "10s" });

      res.status(200).json({ message: "Sign in successful!", userId: user.id, token, });
    });
  }
  else {
    res.status(400).json({ error: "Invalid action." });
  }
});

app.get("/api/user/profile", (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
  }

  const query = "SELECT email_address, password, username, img_src FROM user WHERE id = ?";
  db.query(query, [userId], (err, results) => {
      if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Failed to fetch profile image" });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
      }
      const account = results[0];
      res.status(200).json({ email_address: account.email_address, password: account.password, username: account.username, img_src: account.img_src});
  });
});


// 서버 시작
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



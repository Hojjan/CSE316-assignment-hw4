const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
const port = 3001;


// CORS 설정 (React에서 요청을 허용하기 위함)
app.use(cors());

app.use(express.json());

// MySQL 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hochan2001!', // 실제 비밀번호로 변경
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }

  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS cse316hw`;
  db.query(createDatabaseQuery, (err) => {
    if (err) {
      console.error('Error creating database:', err);
    } else {
      console.log('Database created or already exists');

      // 데이터베이스 선택
      db.changeUser({ database: 'cse316hw' }, (err) => {
        if (err) {
          console.error('Error switching to database:', err);
        } else {
          console.log('Using database cse316hw');

          // 필요한 테이블 생성 (예시)
          const createFacilitiesTableQuery = `
            CREATE TABLE IF NOT EXISTS facilities (
              id INT AUTO_INCREMENT PRIMARY KEY,
              facility_name VARCHAR(45) NOT NULL,
              facility_desc VARCHAR(45) NOT NULL,
              img_src VARCHAR(225) NOT NULL,
              available_days VARCHAR(45) NOT NULL,
              min_capacity VARCHAR(45) NOT NULL,
              max_capacity VARCHAR(45) NOT NULL,
              location VARCHAR(45) NOT NULL,
              suny_flag VARCHAR(45) NOT NULL
            );`;
          
          const createReservationTableQuery = `
            CREATE TABLE IF NOT EXISTS reservation (
              id INT AUTO_INCREMENT PRIMARY KEY,
              reservation_date VARCHAR(45) NOT NULL,
              user_number VARCHAR(45) NOT NULL,
              is_suny VARCHAR(45) NOT NULL,
              purpose VARCHAR(45),
              reservation_name VARCHAR(45) NOT NULL,
              user_name VARCHAR(45) NOT NULL,
              location VARCHAR(45),
              image_src VARCHAR(255)
            );`;

            const createUserTableQuery =`
            CREATE TABLE IF NOT EXISTS user (
              id INT AUTO_INCREMENT PRIMARY KEY,
              email_address VARCHAR(255) UNIQUE NOT NULL,
              password VARCHAR(255) NOT NULL,
              username VARCHAR(255) NOT NULL
            );`;

            db.query(createFacilitiesTableQuery, (err) => {
              if (err) {
                console.error('Error creating facilities table:', err);
              } else {
                console.log('Facilities table updated');
              }
            });
            
            db.query(createReservationTableQuery, (err) => {
              if (err) {
                console.error('Error creating reservation table:', err);
              } else {
                console.log('Reservation table updated');
              }
            });
            
            db.query(createUserTableQuery, (err) => {
              if (err) {
                console.error('Error creating user table:', err);
              } else {
                console.log('User table updated');
              }
            });
              
            const insertFacilityDataQuery = `
            INSERT INTO facilities (facility_name, facility_desc, img_src, available_days, min_capacity, max_capacity, location, suny_flag)
            VALUES
              ('Gym', 'A place used for physical activity', 'https://res.cloudinary.com/dgou2evcb/image/upload/v1731084023/gym_s7esxc.jpg', 'Mon, Tue, Wed, Thu, Fri, Sat, Sun', '1', '5','A101', 'False'),
              ('Auditorium', 'A place for large events', 'https://res.cloudinary.com/dgou2evcb/image/upload/v1731084023/auditorium_v8gbsn.jpg', 'Mon, Tue, Wed, Thu', '10', '40','A234', 'False'),
              ('Swimming Pool', 'A place for physical activity', 'https://res.cloudinary.com/dgou2evcb/image/upload/v1731084023/pool_k7jri5.jpg', 'Sat, Sun', '1', '8','B403', 'False'),
              ('Seminar Room', 'A place for large meetings', 'https://res.cloudinary.com/dgou2evcb/image/upload/v1731084023/seminar_biuopm.jpg', 'Mon, Wed, Fri', '10', '30','B253', 'False'),
              ('Conference Room', 'A place for small but important meetings', 'https://res.cloudinary.com/dgou2evcb/image/upload/v1731084023/conference_ghcqca.jpg', 'Mon, Tue, Wed, Thu, Fri', '1', '10', 'C1033', 'True'),
              ('Library', 'A quiet place', 'https://res.cloudinary.com/dgou2evcb/image/upload/v1731084023/library_e2kkdf.jpg', 'Mon, Tue, Wed, Thu, Fri, Sat, Sun', '1', '20', 'A1011', 'True');
              `;
              db.query(insertFacilityDataQuery, (err, result) => {
                if (err) {
                  console.error('Error inserting data into facilities table:', err);
                } else {
                  console.log('Data inserted into facilities table:', result);
                }
              });
        }
      });
    }
  });
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

// 데이터 전송 for cse316hw schema의 reservation table
app.post('/api/reservation', (req, res) => {
  const { facility, date, numPeople, suny, purpose, src, location } = req.body;
  const user = "Hochan Jun";
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

        res.status(201).json({ message: "User registered successfully!" });
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
      console.log("user password: ", user.password);
      console.log("password: ", password);
      if (password !== user.password) {
        return res.status(401).json({ error: "Wrong password." });
      }
      res.status(200).json({ message: "Sign in successful!" });
    });
  }
  else {
    res.status(400).json({ error: "Invalid action." });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});



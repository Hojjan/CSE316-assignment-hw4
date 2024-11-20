const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
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
  database: 'cse316hw' // 실제 데이터베이스 이름으로 변경
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
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

// 데이터 조회 API for reservations table
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

// 서버 시작
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
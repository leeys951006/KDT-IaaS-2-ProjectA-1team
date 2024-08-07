# create_db.py (데이터 삽입 추가)
import sqlite3
import os

# 데이터베이스 파일 경로 설정
db_path = 'last.db'

# 기존 데이터베이스 파일이 있으면 삭제 (테스트 용도)
if os.path.exists(db_path):
    os.remove(db_path)

try:
    # 데이터베이스 연결
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 테이블 생성
    cursor.execute('''
    CREATE TABLE table1 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        품명 TEXT,
        가격 INTEGER
    )
    ''')

    # 데이터 삽입
    cursor.execute("INSERT INTO table1 (품명, 가격) VALUES ('테스트 품명', 1000)")

    conn.commit()
    print("Table created and data inserted successfully.")
except sqlite3.Error as e:
    print(f"An error occurred: {e}")
finally:
    conn.close()

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sqlite3
from routers import table_router, data_router, create_table_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_PATH = os.path.join(os.path.dirname(__file__), '정호연.db')

class VerifyRequest(BaseModel):
    id: str
    password: str

class UpdateColumnsRequest(BaseModel):
    table: str
    columns: List[str]

@app.post("/login")
def verify_user(request: VerifyRequest):
    print('login')
    conn = sqlite3.connect(DATABASE_PATH)
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id FROM adminData WHERE id = ? AND password = ?",
        (request.id, request.password)
    )
    row = cursor.fetchone()
    conn.close()

    if row:
        return True
    else:
        return False

app.include_router(table_router)
app.include_router(data_router)
app.include_router(create_table_router)

class UpdateTableRequest(BaseModel):
    table: str
    data: list

@app.post("/updateTable")
def update_table(request: UpdateTableRequest):
    print(f"Received update request for table: {request.table}")
    print(f"Data to update: {request.data}")
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        primary_key = list(request.data[0].keys())[0]  # 첫 번째 키를 기본 키로 가정

        for row in request.data:
            set_clause = ', '.join([f'"{key}" = ?' for key in row.keys() if key != primary_key])
            values = [row[key] for key in row.keys() if key != primary_key] + [row[primary_key]]
            update_sql = f'UPDATE "{request.table}" SET {set_clause} WHERE "{primary_key}" = ?'
            print(f"Executing SQL: {update_sql} with values {values}")
            cursor.execute(update_sql, values)
        
        conn.commit()
        print("Database commit successful")
        conn.close()

        return {"message": "테이블 데이터 업데이트 완료"}
    except sqlite3.Error as e:
        print(f"SQLite error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"데이터 업데이트 중 오류 발생: {str(e)}")
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"알 수 없는 오류 발생: {str(e)}")

@app.post("/updateColumns")
def update_columns(request: UpdateColumnsRequest):
    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        # 현재 테이블의 기존 열 이름 가져오기
        cursor.execute(f'PRAGMA table_info("{request.table}")')
        existing_columns = [info[1] for info in cursor.fetchall()]

        # 기존 열 이름과 새로운 열 이름 비교
        for i, column in enumerate(request.columns):
            if i < len(existing_columns):
                if column != existing_columns[i]:
                    cursor.execute(f'ALTER TABLE "{request.table}" RENAME COLUMN "{existing_columns[i]}" TO "{column}"')
            else:
                cursor.execute(f'ALTER TABLE "{request.table}" ADD COLUMN "{column}" TEXT')

        conn.commit()
        conn.close()

        return {"message": "열 업데이트 완료"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"열 업데이트 중 오류 발생: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"알 수 없는 오류 발생: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("dbServer:app", host="0.0.0.0", port=8080, reload=True)

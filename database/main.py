# main.py
from fastapi import FastAPI
import sqlite3

app = FastAPI()

def get_db_connection():
    conn = sqlite3.connect('last.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/items")
def read_items():
    conn = get_db_connection()
    items = conn.execute('SELECT * FROM table1').fetchall()
    conn.close()
    return [dict(item) for item in items]

import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import pooling, Error

load_dotenv(dotenv_path="/home/ubuntu/Origin_Respository/.env")

connection_pool = pooling.MySQLConnectionPool(
    pool_name = os.getenv("DBpool"),
    pool_size = 5,
    host=os.getenv("DBhost"),
    user=os.getenv("DBuser"),
    password=os.getenv("DBpw"),
    database=os.getenv("DB")
)
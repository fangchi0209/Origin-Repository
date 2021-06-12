import json
import ssl
import traceback
import mysql.connector
from module.connectMysql import connection_pool
from flask import Flask, jsonify, render_template, request, abort, session, redirect, Blueprint
from mysql.connector import pooling, Error

bookingApi = Blueprint("bookingApi", __name__)


@bookingApi.route("/booking", methods=["GET", "POST", "DELETE"])
def bookingPage():
    mydb = connection_pool.get_connection()
    mycursor = mydb.cursor(buffered=True)

    try:
        if "memberEmail" in session:

            if request.method == "POST":

                result = request.get_json()
                # print(result)
                bookingId = result["attractionId"]
                date = result["date"]
                time = result["time2"]
                price = result["price"]
                email = session["memberEmail"]
                # print(email)

                if result["date"]:
                    mycursor.execute(
                    "INSERT INTO booking (booking_date, booking_time, booking_price, booking_id, member_email) VALUES (%s, %s, %s, %s, %s)", (date, time, price, bookingId, email))
                    mydb.commit()
                    mydb.close()
                    return jsonify({
                        "ok": True,
                    }), 200
                else:
                    mydb.close()
                    return jsonify({
                        "error": True,
                        "message": "請選取日期"
                    }), 400

            if request.method == "GET":
                bookingEmail = session["memberEmail"]
                mycursor.execute(
                    "SELECT * FROM booking WHERE member_email = '%s' ORDER BY id DESC LIMIT 1" % (bookingEmail)
                )
                bookingData = mycursor.fetchone()
                # print(bookingData)

                if bookingData != None:
                    attId = bookingData[4]
                    mycursor.execute(
                        "SELECT * FROM information WHERE id = '%s'" % (attId))
                    bookingInfoResult = mycursor.fetchone()
                    mydb.close()
                    return jsonify({
                        "data": {
                            "attraction": {
                                "id": bookingInfoResult[0],
                                "name": bookingInfoResult[1],
                                "address": bookingInfoResult[4],
                                "image": bookingInfoResult[9].split(",")[0]
                            },
                            "date": bookingData[1],
                            "time": bookingData[2],
                            "price": bookingData[3]
                        }
                    }), 200
                else:
                    mydb.close()
                    return jsonify({
                        "error": True,
                        "message": "目前沒有任何待預訂的行程"

                    })

            if request.method == "DELETE":
                deleteEmail = session["memberEmail"]
                mycursor.execute(
                    "DELETE FROM booking WHERE member_email = '%s'" % (
                        deleteEmail)
                )
                mydb.commit()
                mydb.close()
                return jsonify({
                    "ok": True
                }), 200
            else:
                mydb.close()
                return jsonify({
                    "error": True
                })

        else:
            mydb.close()
            return jsonify({
                "error": True,
                "message": "請先登入"
            }), 403

    except:
        mydb.close
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500
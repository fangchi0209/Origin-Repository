import json
import ssl
import traceback
import mysql.connector
import requests
import os
from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request, abort, session, redirect
from mysql.connector import pooling, Error


# import urllib.request as request

# ssl._create_default_https_context = ssl._create_unverified_context

load_dotenv()

connection_pool = pooling.MySQLConnectionPool(
    pool_name = os.getenv("DBpool"),
    pool_size = 5,
    host=os.getenv("DBhost"),
    user=os.getenv("DBuser"),
    password=os.getenv("DBpw"),
    database=os.getenv("DB")
)

app = Flask(__name__, static_folder="static_data", static_url_path="/")
app.config["JSON_AS_ASCII"] = False
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.secret_key = os.getenv("secretKey")

# Pages


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/attraction/<id>")
def attraction(id):
    return render_template("attraction.html")


@app.route("/booking")
def booking():
    if "memberEmail" in session:
        return render_template("booking.html")
    else:
        return redirect("/")


@app.route("/thankyou")
def thankyou():
    if "memberEmail" in session:
        return render_template("thankyou.html")
    else:
        return redirect("/")


@app.route("/api/attractions", methods=["GET"])
def findPage():
    mydb = connection_pool.get_connection()
    mycursor = mydb.cursor(buffered=True)

    if request.args.get("keyword") == None:
        searchPage = int(request.args["page"])
        perpage = 12
        showPic = searchPage*perpage
        mycursor.execute(
            "SELECT * FROM information LIMIT %s, %s", (showPic, perpage))
        result = mycursor.fetchall()
        page_pic = []
        if not result:
            abort(500)
        for info in result:
            if searchPage < 26:
                next_page = searchPage+1
            else:
                next_page = None
            data_dictionary = {
                "id": info[0],
                "name": info[1],
                "category": info[2],
                "description": info[3],
                "address": info[4],
                "transport": info[5],
                "mrt": info[6],
                "latitude": info[7],
                "longitude": info[8],
                "images": info[9].split(",")
            }
            data = data_dictionary.copy()
            page_pic.append(data)
        
        mydb.close()

        return json.dumps({"nextPage": next_page, "data": page_pic}, ensure_ascii=False)

    else:
        searchWord = "%" + request.args["keyword"] + "%"
        searchPage = int(request.args["page"])
        mycursor.execute(
            "SELECT COUNT(*) FROM information WHERE name LIKE '%s'" % (searchWord))
        total = mycursor.fetchone()
        total = (int(total[0]))//12
        searchPage = int(request.args["page"])
        mycursor.execute(
            f"SELECT * FROM information WHERE name LIKE '%s' LIMIT 12 OFFSET {searchPage*12}" % (searchWord))
        result = mycursor.fetchall()
        # print (result)
        # return ("yes")
        page_pic = []
        if not result:
            abort(500)
        for info in result:
            if searchPage < total:
                next_page = searchPage+1
            else:
                next_page = None
            data_dictionary = {
                "id": info[0],
                "name": info[1],
                "category": info[2],
                "description": info[3],
                "address": info[4],
                "transport": info[5],
                "mrt": info[6],
                "latitude": info[7],
                "longitude": info[8],
                "images": info[9].split(",")
            }
            data = data_dictionary.copy()
            page_pic.append(data)

        mydb.close()

        return json.dumps({"nextPage": next_page, "data": page_pic}, ensure_ascii=False)


@app.route("/api/attraction/<attractionId>")
def findId(attractionId):
    mydb = connection_pool.get_connection()
    mycursor = mydb.cursor(buffered=True)

    try:
        mycursor.execute(
            "SELECT * FROM information WHERE id = '%s'" % (attractionId))
        searchId = mycursor.fetchone()
        # print(type(searchId))
        if searchId != None:
            mydb.close()
            a = {"data": {
                "id": searchId[0],
                "name": searchId[1],
                "category": searchId[2],
                "description": searchId[3],
                "address": searchId[4],
                "transport": searchId[5],
                "mrt": searchId[6],
                "latitude": searchId[7],
                "longitutde": searchId[8],
                "images": searchId[9].split(",")
            }}
            return json.dumps()
        else:
            mydb.close()
            return json.dumps({"error": True,
                               "message": "請輸入正確的ID"}), 400

    except:
        return json.dumps({"error": True,
                           "message": "請輸入正確的關鍵字"}), 500


@app.errorhandler(500)
def error_500(error):
    response = {
        "error": True,
        "message": "請輸入正確的關鍵字"
    }
    return jsonify(response), 500


@app.route("/api/user", methods=["GET", "POST", "PATCH", "DELETE"])
def loginPage():
    mydb = connection_pool.get_connection()
    mycursor = mydb.cursor(buffered=True)

    if request.method == "PATCH":
        data = request.get_json()
        sqlEmail = data.get('email')
        sqlPassword = data['password']
        mycursor.execute(
            "SELECT * FROM member WHERE email = '%s'" % (sqlEmail))
        loginResult = mycursor.fetchone()
        try:
            if loginResult != None:
                if sqlPassword == loginResult[3]:
                    session["memberEmail"] = loginResult[2]
                    session["memberName"] = loginResult[1]
                    mydb.close()
                    return jsonify({
                        "data": {
                            "id": loginResult[0],
                            "name": loginResult[1],
                            "email": loginResult[2]
                        }
                    }), 200
                else:
                    mydb.close()
                    return jsonify({
                        "error": True,
                        "message": "密碼錯誤"
                    }), 400

        except:
            mydb.close()
            return jsonify({
                "error": True,
                "message": "無此帳號"
            }), 500

    elif request.method == "POST":
        data = request.get_json()
        sqlName = data['name']
        sqlEmail = data['email']
        sqlPassword = data['password']
        mycursor.execute(
            "SELECT * FROM member WHERE email = '%s'" % (sqlEmail))
        registerResult = mycursor.fetchone()

        try:
            if registerResult == None:
                if len(sqlName) == 0 or len(sqlEmail) == 0 or len(sqlPassword) == 0:
                    mydb.close()
                    return jsonify({
                        "error": True,
                        "message": "請填妥所有資料"
                    }), 400
                else:
                    mycursor.execute(
                        "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)", (sqlName, sqlEmail, sqlPassword))
                    mydb.commit()
                    mydb.close()
                    return jsonify({
                        "ok": True,
                        "message": "註冊成功, 請重新登入"
                    }), 200

            else:
                mydb.close()
                return jsonify({
                    "error": True,
                    "message": "註冊失敗, Email重複註冊",
                }), 400

        except:
            mydb.close()
            return jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
            }), 500

    elif request.method == "GET":
        if "memberEmail" in session:
            mydb.close()
            return jsonify({
                "data": True,
            })
        else:
            mydb.close()
            return jsonify({
                "data": None,
            })

    elif request.method == "DELETE":
        session.pop("memberEmail", None)
        mydb.close()
        return jsonify({
            "ok": True,
        })


@app.route("/api/booking", methods=["GET", "POST", "DELETE"])
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


@app.route("/api/orders", methods=["POST"])
def orders():
    mydb = connection_pool.get_connection()
    mycursor = mydb.cursor(buffered=True)

    data = request.get_json()
    prime = data["prime"]
    price = data["order"]["price"].split(" ")[1]
    urlId = data["order"]["trip"]["attraction"]["id"]
    date = data["order"]["trip"]["date"]
    time = data["order"]["trip"]["time"]
    name = data["order"]["contact"]["name"]
    phone = data["order"]["contact"]["phone"]
    email = data["order"]["contact"]["email"]

    try:
        if "memberEmail" in session:

            header = {
                "content-type": "application/json",
                "x-api-key": os.getenv("partnerKey")
            }

            body = {
                "prime": prime,
                "partner_key": os.getenv("partnerKey"),
                "merchant_id": "Fangchi_CTBC",
                "details": json.dumps({
                    "id": urlId,
                    "date": date,
                    "time": time
                }),
                "amount": price,
                "cardholder": {
                    "phone_number": phone,
                    "name": name,
                    "email": email,
                },
            }

            r = requests.post("https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime",
                              data=json.dumps(body), headers=header)
            result = json.loads(r.text)
            # print(result)

            session["transactionId"] = result["bank_transaction_id"]

            if result["status"] == 0:
                mydb.close()
                return jsonify({
                    "data": {
                        "number": result["bank_transaction_id"],
                        "payment": {
                            "status": 0,
                            "message": "付款成功"
                        }
                    }
                }), 200
            else:
                mydb.close()
                return jsonify({
                    "error": True,
                    "message": "訂單建立失敗"
                })
        else:
            mydb.close()
            return jsonify({
                "error": True,
                "message": "未登入系統, 拒絕存取"
            }), 403
    except:
        mydb.close()
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }), 500


@app.route("/api/order/<orderNumber>", methods=["GET"])
def orderNumber(orderNumber):

    mydb = connection_pool.get_connection()
    mycursor = mydb.cursor(buffered=True)

    header = {
        "content-type": "application/json",
        "x-api-key": os.getenv("partnerKey")
    }

    body = {
        "partner_key": os.getenv("partnerKey"),
        "filters": {
            "bank_transaction_id": orderNumber,
        }
    }

    x = requests.post("https://sandbox.tappaysdk.com/tpc/transaction/query",
                      data=json.dumps(body), headers=header)
    res = json.loads(x.text)
    # print(res)

    transactionDic = res["trade_records"][0]
    print(transactionDic)

    # theOne = next(
    #     item for item in transactionList if item["bank_transaction_id"] == orderNumber)
    # print(theOne)

    orderId = json.loads(transactionDic["details"])["id"]
    mycursor.execute("SELECT * FROM information WHERE id = '%s'" % (orderId))
    orderResult = mycursor.fetchone()
    # print(orderResult)

    bookingDelete = session["memberEmail"]
    mycursor.execute(
        "DELETE FROM booking WHERE member_email = '%s'" % (bookingDelete)
    )
    mydb.commit()
    if "memberEmail" in session:
        mydb.close()
        return jsonify({
            "data": {
                "price": transactionDic["amount"],
                "trip": {
                    "id": orderId,
                    "name": orderResult[1],
                    "address": orderResult[4],
                    "image": orderResult[9].split(",")[0]
                },
                "date": json.loads(transactionDic["details"])["date"],
                "time": json.loads(transactionDic["details"])["time"]
            },
            "contact": {
                "name": transactionDic["cardholder"]["name"],
                "email": transactionDic["cardholder"]["email"],
                "phone": transactionDic["cardholder"]["phone_number"]
            },
            "status": transactionDic["record_status"]
        }), 200

    else:
        mydb.close()
        return jsonify({
            "error": True,
            "message": "未登入系統，拒絕存取"
        }), 403


app.run(host="0.0.0.0", port=3000, debug=True)

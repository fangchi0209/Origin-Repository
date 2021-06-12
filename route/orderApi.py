import json
import ssl
import traceback
import mysql.connector
import requests
import os
from module.connectMysql import connection_pool
from flask import Flask, jsonify, request, session, Blueprint
from mysql.connector import pooling, Error

ordersApi = Blueprint("ordersApi", __name__)
orderApi = Blueprint("orderApi", __name__)


@ordersApi.route("/orders", methods=["POST"])
def orders():
    mydb = connection_pool.get_connection()
    mycursor = mydb.cursor(buffered=True)

    data = request.get_json()
    # print(data)
    prime = data["prime"]
    price = data["order"]["price"]
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
                "merchant_id": os.getenv("merchantId"),
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
            print(result)

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


@orderApi.route("/order/<orderNumber>", methods=["GET"])
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
    # print(transactionDic)

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

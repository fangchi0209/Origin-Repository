import json
import ssl
import traceback
import mysql.connector
from module.connectMysql import connection_pool
from flask import Flask, jsonify, render_template, request, abort, session, redirect, Blueprint
from mysql.connector import pooling, Error

attractionsApi = Blueprint("attractionsApi", __name__)
attractionApi = Blueprint("attractionApi", __name__)


@attractionsApi.route("/attractions", methods=["GET"])
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

@attractionApi.route("/attraction/<attractionId>")
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
            return json.dumps({"data": {
                "id": searchId[0],
                "name": searchId[1],
                "category": searchId[2],
                "description": searchId[3],
                "address": searchId[4],
                "transport": searchId[5],
                "mrt": searchId[6],
                "latitude": searchId[7],
                "longitude": searchId[8],
                "images": searchId[9].split(",")
            }})
        else:
            mydb.close()
            return json.dumps({"error": True,
                               "message": "請輸入正確的ID"}), 400

    except:
        return json.dumps({"error": True,
                           "message": "請輸入正確的關鍵字"}), 500


@attractionsApi.errorhandler(500)
def error_500(error):
    response = {
        "error": True,
        "message": "請輸入正確的關鍵字"
    }
    return jsonify(response), 500

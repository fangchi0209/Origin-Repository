import json
import ssl
import traceback
import mysql.connector
from flask import Flask, jsonify, render_template, request, abort, session, redirect


# import urllib.request as request

# ssl._create_default_https_context = ssl._create_unverified_context


mydb = mysql.connector.connect(
    host="127.0.0.1",
    user="debian-sys-maint",
    password="exgi5qGqkOVES8BL",
    database="attractions"
)

mycursor = mydb.cursor(buffered=True)




app=Flask(__name__, static_folder = "static_data", static_url_path = "/")
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.secret_key ="aaa"

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")

@app.route("/api/attractions", methods=["GET"])
def findPage():
	if request.args.get("keyword") == None:
		searchPage = int(request.args["page"])
		perpage = 12
		showPic = searchPage*perpage
		mycursor.execute("SELECT * FROM information LIMIT %s, %s", (showPic,perpage))
		result=mycursor.fetchall()
		page_pic = []
		if not result:
			abort(500)
		for info in result:
			if searchPage <26:
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

		return json.dumps({"nextPage": next_page, "data":page_pic}, ensure_ascii=False)

	else:
		searchWord = "%" + request.args["keyword"] + "%" 
		searchPage = int(request.args["page"])
		mycursor.execute("SELECT COUNT(*) FROM information WHERE name LIKE '%s'" % (searchWord))
		total=mycursor.fetchone()
		total=(int(total[0]))//12
		searchPage = int(request.args["page"])
		mycursor.execute(f"SELECT * FROM information WHERE name LIKE '%s' LIMIT 12 OFFSET {searchPage*12}" %(searchWord))
		result=mycursor.fetchall()
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

		return json.dumps({"nextPage": next_page, "data":page_pic}, ensure_ascii=False)

@app.route("/api/attraction/<attractionId>")
def findId(attractionId):
	try:
		mycursor.execute("SELECT * FROM information WHERE id = '%s'" % (attractionId))
		searchId = mycursor.fetchone()
		# print(type(searchId))
		if searchId != None:
			return json.dumps({"data":{
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
			}})
		else:
			return json.dumps({"error": True,
			"message": "請輸入正確的ID"}),400

	except:
		return json.dumps({"error": True,
			"message": "請輸入正確的關鍵字"}),500

@app.errorhandler(500)
def error_500(error):
	response = {
			"error": True,
			"message": "請輸入正確的關鍵字"
		}
	return jsonify(response), 500

	
@app.route("/api/user", methods=["GET", "POST", "PATCH", "DELETE"])
def loginPage():

	if request.method == "PATCH":
		data = request.get_json()
		sqlEmail = data.get('email')
		sqlPassword = data ['password']
		mycursor.execute ("SELECT * FROM member WHERE email = '%s'" % (sqlEmail))
		loginResult = mycursor.fetchone()
		try:
			if loginResult != None:
				if sqlPassword == loginResult[3]:
					session["memberEmail"] = loginResult[2]
					session["memberName"] = loginResult[1]
					return jsonify ({
						"data": {
							"id": loginResult[0],
							"name": loginResult[1],
							"email": loginResult[2]
						}
					}), 200
				else:
					return jsonify ({
						"error": True,
						"message": "密碼錯誤"
					}), 400

		except:
			return jsonify ({
				"error": True,
				"message": "無此帳號"
			}), 500

	elif request.method == "POST":
		data = request.get_json()
		sqlName = data['name']
		sqlEmail = data['email']
		sqlPassword = data ['password']
		mycursor.execute ("SELECT * FROM member WHERE email = '%s'" % (sqlEmail))
		registerResult = mycursor.fetchone()

		try:
			if registerResult == None:
				if len(sqlName)==0 or len(sqlEmail)==0 or len(sqlPassword)==0:
					return jsonify({
						"error": True,
						"message": "請填妥所有資料"
					}),400
				else:
					mycursor.execute("INSERT INTO member (name, email, password) VALUES (%s, %s, %s)", (sqlName, sqlEmail, sqlPassword))
					mydb.commit()
					return jsonify({
						"ok": True,
						"message": "註冊成功, 請重新登入"
					}),200

			else:
				return jsonify ({
					"error": True,
					"message": "註冊失敗, Email重複註冊",
					}),400
				
			
		except:
			return jsonify ({
				"error": True,
				"message": "伺服器內部錯誤"
			}),500

	elif request.method == "GET":
		if "memberEmail" in session:
			return jsonify({
				"data": True,
			})
		else:
			return jsonify({
				"data": None,
			})

	elif request.method == "DELETE":
		session.pop("memberEmail", None)
		session.pop("date", None)
		return jsonify({
			"ok": True,
		})

@app.route("/api/booking", methods=["GET", "POST", "DELETE"])
def bookingPage():

	try:
		if "memberEmail" in session:

			if request.method == "POST":

				result = request.get_json()
				print(result)
				attractionId = result["attractionId"]
				session["id"] = attractionId
				date = result["date"]
				session ["date"] = date
				time = result["time2"]
				session ["time"] = time
				price = result["price"]
				session ["price"] = price

				if result["date"]:
					return jsonify({
					"ok": True,
				}),200
				else:
					return jsonify({
						"error": True,
						"message": "請選取日期"
					}),400

			if request.method == "GET":
				if "date" in session:
					sqlId = session["id"]
					mycursor.execute("SELECT * FROM information WHERE id = '%s'" % (sqlId))
					bookingResult=mycursor.fetchone()
					# print(bookingResult)
					return jsonify({
						"data": {
							"attraction": {
							"id": bookingResult[0],
							"name": bookingResult[1],
							"address": bookingResult[4],
							"image": bookingResult[9].split(",")
							},
							"date": session["date"],
							"time": session["time"],
							"price": session["price"]
						}
					}),200
				else:
					return jsonify({
						"error": True,
						"message": "目前沒有任何待預訂的行程"

					})

			if request.method == "DELETE":
				session.pop("date", None)
				return jsonify({
					"ok": True
				}),200
			else:
				return jsonify({
					"error": True
				})

		else:
			return jsonify({
				"error": False,
				"message": "請先登入"
			}),403

	except:
		return jsonify({
			"error": True,
			"message": "伺服器內部錯誤"
			}),500






app.run(host="0.0.0.0", port=3000,debug=True)

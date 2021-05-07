import json
import ssl
import traceback
import mysql.connector
from flask import Flask, jsonify, render_template, request, abort


# import urllib.request as request

# ssl._create_default_https_context = ssl._create_unverified_context


mydb = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="mydog8229",
    database="attractions"
)

mycursor = mydb.cursor(buffered=True)





app=Flask(__name__, static_folder = "static_data", static_url_path = "/")
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

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
		print(type(searchId))
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

	


app.run(host="127.0.0.1", port=3000,debug=True)

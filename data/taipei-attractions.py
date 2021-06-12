import json, os, mysql.connector
from dotenv import load_dotenv
from mysql.connector import pooling, Error

load_dotenv()

connection_pool = pooling.MySQLConnectionPool(
    pool_name = attractionInfo,
    pool_size = 5,
    host=os.getenv("DBhost"),
    user=os.getenv("DBuser"),
    password=os.getenv("DBpw"),
    database=os.getenv("DB")
)
mydb = connection_pool.get_connection()
mycursor = mydb.cursor(buffered=True)

filename = "taipei-attractions.json"
with open (filename) as file:
    data = json.load(file)

landlist = data["result"]["results"]
# print(data["result"]["results"][0]["stitle"])
# print(data["result"]["results"][0])


for x in landlist:
    getInfo = x["info"]
    getStitle = x["stitle"]
    getMRT = x["MRT"]
    getCAT2 = x["CAT2"]
    getFile = x["file"].split("http")
    resFile = []
    for fileUrl in getFile:
        suff_string = str(fileUrl)
        suff_list = ("jpg", "JPG", "PNG", "png")
        result = suff_string.endswith(suff_list)
        if result == True:
            resFile.append("http"+suff_string)
        else:
            continue
    # resFile = str(resFile)
    separator = ","
    resFile=separator.join(resFile)   
    # print(separator.join(resFile)) 
    getXbody = x["xbody"]
    getAddress = x["address"]
    getLongitude = x["longitude"]
    getLatitude = x["latitude"]
    mycursor.execute("INSERT INTO information (name, category, description, address, transport, mrt, latitude, longitude, images) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",(getStitle, getCAT2, getXbody, getAddress, getInfo, getMRT, getLatitude, getLongitude, resFile))
    mydb.commit()

    mydb.close()



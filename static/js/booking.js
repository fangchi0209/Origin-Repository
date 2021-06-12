bookingInfo()

let deleteBtn = document.getElementById("deleteBtn")

deleteBtn.onclick = () => {
    bookingDelete()
}

let url_id;

async function bookingInfo() {

    await fetch("/api/booking", {
        method: "GET"
    })

    .then(response => {
            return response.json()
        })
        .then(res => {
            if (res.error == true) {
                // console.log(res.message)
                document.getElementById("main").style.display = "none"
                document.getElementById("noDataSection").style.display = "block"
                document.getElementById("noData").innerHTML = res.message
            } else {
                document.getElementById("main").style.display = "block"
                document.getElementById("noDataSection").style.display = "none"
                document.getElementById("name").innerHTML = res.data.attraction.name
                document.getElementById("date").innerHTML = res.data.date
                document.getElementById("fee").innerHTML = "新台幣" + "&nbsp" + res.data.price + "&nbsp" + "元"
                document.getElementById("place").innerHTML = res.data.attraction.address
                document.getElementById("tourPic").style.backgroundImage = "url('" + res.data.attraction.image + "')"
                document.getElementById("ps").innerHTML = "新台幣" + "&nbsp" + res.data.price + "&nbsp" + "元"
                url_id = res.data.attraction.id
                if (res.data.time == "morning") {
                    document.getElementById("time").innerHTML = "上午 9 點到下午 4 點"
                } else {
                    document.getElementById("time").innerHTML = "下午 3 點到晚上 10 點"
                }
            }
        })
}

async function bookingDelete() {
    await fetch("/api/booking", {
        method: "DELETE"
    })

    .then(respond => {
            return respond.json()
        })
        .then(data => {
            if (data.ok == true) {
                document.getElementById("main").style.display = "none"
                document.getElementById("noDataSection").style.display = "block"
                document.getElementById("noData").innerHTML = "目前沒有任何待預訂的行程"
            }
        })
}
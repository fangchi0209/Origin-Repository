
let album = document.getElementById('album');
let site = document.getElementById('site');
let description_info = document.getElementById('description_info')
let location_info = document.getElementById('location_info')
let traffic_info = document.getElementById('traffic_info')
let src = window.location.href;
let src_id = src.split("/")[4];
let newLeft = 0;
let prev = document.getElementById("prev");
let next = document.getElementById("next");
let width_p = 0;
let attractionId;
let length_pic = 0;


checkProcess()
showOneData(src_id);
handleClick("1")
handleClick("早上 9 點到下午 4 點")



async function showOneData(attractionId) {

    await fetch("/api/attraction/" + `${attractionId}`)
        .then(response => {
            return response.json();
        }).then(result => {
            displayInfo(result);
            length_pic = result.data.images.length

        })
    function displayInfo(result) {
        let r = result.data;

        let attraction_name = document.createTextNode(r.name);
        let attraction_mrt = document.createTextNode(r.mrt);
        let attraction_des = document.createTextNode(r.description);
        let attraction_address = document.createTextNode(r.address);
        let attraction_traffic = document.createTextNode(r.transport);
        let attraction_cat = document.createTextNode(r.category);

        let attraction_mrt_cat = attraction_cat.nodeValue + "&nbsp" + "at" + "&nbsp" + attraction_mrt.nodeValue
        // console.log(attraction_mrt_cat)

        let name_tag = document.createElement("div");
        let place_tag = document.createElement("div");
        place_tag.innerHTML = attraction_mrt_cat;
        let des_tag = document.createElement("div");
        let address_tag = document.createElement("div");
        let traffic_tag = document.createElement("div");

        let img_group = []

        for (let n = 0; n < r.images.length; n++) {
            let img_tag = document.createElement("img");
            img_tag.src = r.images[n];
            img_tag.classList.add("img")
            // console.log(img_tag)
            img_group.push(img_tag)
            // console.log(img_group)
        }

        for (let i = 0; i < img_group.length; i++) {
            album.appendChild(img_group[i])
            // console.log(album)
        }

        // img_tag.style.backgroundImage = "url('" + r.images[0] + "')";

        name_tag.classList.add("attraction_name");
        place_tag.classList.add("place")
        des_tag.classList.add("description")
        address_tag.classList.add("content_location")
        traffic_tag.classList.add("content_traffic")

        name_tag.appendChild(attraction_name);
        // place_tag.appendChild(attraction_mrt)
        des_tag.appendChild(attraction_des);
        address_tag.appendChild(attraction_address);
        traffic_tag.appendChild(attraction_traffic);


        site.appendChild(name_tag);
        site.appendChild(place_tag);
        description_info.appendChild(des_tag);
        location_info.appendChild(address_tag);
        traffic_info.appendChild(traffic_tag);



    }
}


function handleClick(value_total) {

    if (value_total == "早上 9 點到下午 4 點") {
        document.getElementById("total_1").style.display = '';
        document.getElementById("total_2").style.display = 'none'
    } else {
        document.getElementById("total_1").style.display = 'none';
        document.getElementById("total_2").style.display = ''
    }
}

let id = 1;

function catch_size(b) {
    if (window.innerWidth > 1199) {
        width_p = -540
        if (id === 1) {
            newLeft = 540
        } else {
            newLeft = -540 * (id - 1)
        }
        // console.log(newLeft)
    } else {
        width_p = -340
        if (id === 1) {
            newLeft = 340
        } else {
            newLeft = -340 * (id - 1)
        }
        // console.log(newLeft)
    }
    animate_right(width_p, b)
}

catch_size(true)



window.addEventListener("resize", function () {
    catch_size(false)
});



function windowSize() {

    next.addEventListener("click", (e) => {

        e.preventDefault()
        animate_right(width_p, true);
        // id++
        // console.log(id)

    })


    prev.addEventListener("click", (e) => {

        e.preventDefault()
        animate_left(-width_p, true);
        // id--

    })

}


function animate_right(offset, b) {

    if (b && length_pic && newLeft <= offset * (length_pic - 1)) {
        newLeft = -width_p;
        // id=0
    }
    if (b || id === 1) {
        newLeft = newLeft + offset;
    }
    id = parseInt(newLeft / offset) + 1
    album.style.left = newLeft + 'px';
    // console.log(offset)
    // console.log(id)
}

function animate_left(offset, b) {
    if (b && length_pic && newLeft === 0) {
        newLeft = -offset * length_pic;
    }
    if (b || id === 1) {
        newLeft = newLeft + offset;
    }
    id = parseInt(newLeft / -offset) + 1
    album.style.left = newLeft + 'px';

    // console.log(id)
}


windowSize();





let memberBox_login = document.getElementById("memberBox_login");
let memberBox_register = document.getElementById("memberBox_register");
let loginBox = document.getElementById("loginBox");
let registerBox = document.getElementById("registerBox");
let bg = document.getElementById("bg");
// 點選並彈出登入視窗和遮蓋層
let closeBtn1 = document.getElementById("closeBtn1");
let closeBtn2 = document.getElementById("closeBtn2");
let adminBtn = document.getElementById("adminBtn");
let bgBtn = document.getElementById("bgBtn")
let logBtn = document.getElementById("logBtn")
let regBtn = document.getElementById("regBtn")
let logoutBtn = document.getElementById("logoutBtn")
let tourBtn = document.getElementById("tourBtn")

adminBtn.onclick = function () {
    memberBox_login.style.display = "block";
    loginBox.style.display = "block";
    bg.style.display = "block";
    return false;
}

bgBtn.onclick = function () {
    memberBox_login.style.display = "none";
    memberBox_register.style.display = "none";
    loginBox.style.display = "none";
    registerBox.style.display = "none";
    bg.style.display = "none";
    return false;
}

closeBtn1.onclick = function () {
    memberBox_login.style.display = "none";
    memberBox_register.style.display = "none";
    loginBox.style.display = "none";
    registerBox.style.display = "none";
    bg.style.display = "none";
    return false;
}

closeBtn2.onclick = function () {
    memberBox_login.style.display = "none";
    memberBox_register.style.display = "none";
    loginBox.style.display = "none";
    registerBox.style.display = "none";
    bg.style.display = "none";
    return false;
}

logBtn.onclick = function () {
    memberBox_login.style.display = "none";
    memberBox_register.style.display = "block";
    loginBox.style.display = "none";
    registerBox.style.display = "block";
    bg.style.display = "block";
    return false;
}

regBtn.onclick = function () {
    memberBox_login.style.display = "block";
    memberBox_register.style.display = "none";
    loginBox.style.display = "block";
    registerBox.style.display = "none";
    bg.style.display = "block";
    return false;
}

logoutBtn.onclick = () => {
    deleteProcess()
}

tourBtn.onclick = () => {
    if (document.getElementById("logoutBtn").style.display == "block") {
        window.location = "/booking"
    } else {
        document.getElementById("memberBox_login").style.display = "block"
        document.getElementById("loginBox").style.display = "block"
        document.getElementById("bg").style.display = "block"
    }
}


document.getElementById("registerBox").onclick = (r) => {
    r.preventDefault()
}



async function loginProcess(e) {

    e.preventDefault()

    await fetch("/api/user", {
        method: "PATCH",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            email: document.getElementById("logEmail").value,
            password: document.getElementById("logPassword").value,
        })
    })

        .then(response => {
            return response.json()
        })
        .then(data => {
            // console.log(data)
            if (data.error == true) {
                document.getElementById("failLogin").style.display = "block";
                document.getElementById("failLogin").innerHTML = data.message;
            } else {
                location.reload()
            }
        })

        .catch(function (error) {
            document.getElementById("failLogin").style.display = "block";
            document.getElementById("failLogin").innerHTML = "無此帳號";
        });
}

async function registerProcess() {

    await fetch("/api/user", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            name: document.getElementById("regName").value,
            email: document.getElementById("regEmail").value,
            password: document.getElementById("regPassword").value,
        }),
    })
        .then(response => {
            return response.json()
        })
        .then(data => {
            if (data.error == true) {
                document.getElementById("fail").innerHTML = data.message
            } else {
                document.getElementById("fail").innerHTML = data.message
            }
        })
        .catch(function (error) {
            document.getElementById("fail").style.display = "block";
            document.getElementById("fail").innerHTML = "伺服器內部錯誤";
        });

}

async function checkProcess() {
    await fetch("/api/user", { method: "GET" })

        .then(response => {
            return response.json()
        })
        .then(res => {
            console.log(res)
            if (res.data == true) {
                document.getElementById("adminBtn").style.display = "none";
                document.getElementById("logoutBtn").style.display = "block";
                document.getElementById("tourBtn").style.display = "block"
            } else {
                document.getElementById("adminBtn").style.display = "block";
                document.getElementById("logoutBtn").style.display = "none";
                document.getElementById("tourBtn").style.display = "block"
            }
        })
}




async function deleteProcess() {
    await fetch("/api/user", {
        method: "DELETE",
        headers: {
            "content-type": "application/json"
        },
    })

        .then(response => {
            return response.json()
        })
        .then(result => {
            if (result.ok == true) {
                location.reload()
            }
        })
}



document.getElementById("bookingInfo").onclick = (u) => {
    u.preventDefault()
}


async function bookProcedure() {

    let NT = 0
    let dayTimeValue = document.querySelector('input[name="dayTime"]:checked').value
    if (dayTimeValue == "早上 9 點到下午 4 點") {
        NT = document.getElementsByClassName('total_1')[0].innerHTML
    } else {
        NT = document.getElementsByClassName('total_1')[1].innerHTML
    }

    let db = {
        attractionId: src_id,
        date: document.getElementById("calendar").value,
        time2: dayTimeValue,
        price: NT
    }

    await fetch("/api/booking", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(db)
    })
        .then(response => {
            // console.log(response.status)
            if (response.status === 403) {
                document.getElementById("memberBox_login").style.display = "block"
                document.getElementById("loginBox").style.display = "block"
                document.getElementById("bg").style.display = "block"
            }
            return response.json()
        })
        .then(data => {
            if (data.error == true) {
                document.getElementById("failLogin").innerHTML = data.message
            }
            else {
                window.location = '/booking'
            }
        })
}





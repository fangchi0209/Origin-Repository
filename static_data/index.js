
let start_page = 0
let isMouseAtBottom = false
let content = document.getElementById('content');


checkProcess()
search_page(start_page)



async function search_page(item) {
    let keyword;
    keyword = document.getElementById("searchKeyword").value
    let data;
    let cur_page = 0
    isMouseAtBottom = true;
    src = "api/attractions?page="
    if (item != null & keyword.length != 0) {
        src += `${start_page}&keyword=${keyword}`
    } else (
        src += `${start_page}`
    )

    // console.log(src)
    await fetch(src)
        .then(response => {
            return response.json();
        }).then(r => {

            next_page = r.nextPage
            data = r.data;
            // console.log(data)
            find_pic(data, cur_page, data.length)

        }).catch(function (error) {
            // console.log(error)                 
            content.innerHTML = "查無資料"

        });




    function find_pic(data_source, cur, lat) {
        for (let n = cur; n < lat; n++) {
            let info_name = document.createTextNode(data_source[n].name);
            let station_name = document.createTextNode(data_source[n].mrt);
            let cat_name = document.createTextNode(data_source[n].category);
            let url_link = "/attraction/" + data_source[n].id
            // console.log(url_link)


            let info_tag = document.createElement("div");
            let img_tag = document.createElement("div");
            let station_tag = document.createElement("div");
            let cat_tag = document.createElement("div");
            let box_tag = document.createElement("div");
            let url_tag = document.createElement("a");

            img_tag.style.backgroundImage = "url('" + data_source[n].images[0] + "')";

            info_tag.classList.add("attractions_text");
            img_tag.classList.add("attractions_img");
            station_tag.classList.add("station");
            cat_tag.classList.add("cat");
            box_tag.classList.add("box");
            url_tag.classList.add("attractions_url")

            url_tag.href = url_link;
            // console.log(url_tag)
            info_tag.appendChild(info_name);
            station_tag.appendChild(station_name);
            cat_tag.appendChild(cat_name);

            url_tag.appendChild(img_tag);
            url_tag.appendChild(info_tag);
            url_tag.appendChild(station_tag);
            url_tag.appendChild(cat_tag);
            box_tag.appendChild(url_tag);
            content.appendChild(box_tag);
            // console.log(box_tag)
        }
        isMouseAtBottom = false;
    }
}


window.addEventListener("scroll", () => {
    if (next_page != null) {
        // console.log(document.documentElement.scrollHeight)
        // console.log(window.innerHeight)

        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        // console.log(scrolled)

        if (Math.ceil(scrolled) === scrollable) {

            if (isMouseAtBottom == false) {
                isMouseAtBottom = true;
                start_page = next_page;
                // console.log(start_page)
                search_page(start_page)
            }
        }
    }
})


let searchBtn = document.getElementById("searchBtn")
searchBtn.addEventListener("click", () => {
    content.innerHTML = ""
    start_page = 0
    search_page(start_page)

})

let memberBox_login = document.getElementById("memberBox_login");
let memberBox_register = document.getElementById("memberBox_register");
let loginBox = document.getElementById("loginBox");
let registerBox = document.getElementById("registerBox");
let bg = document.getElementById("bg");
// 點選並彈出登入視窗和遮蓋層
let closeBtn1 = document.getElementById("closeBtn1")
let closeBtn2 = document.getElementById("closeBtn2")
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


document.getElementById("registerBox").onclick = (e) => {
    e.preventDefault()
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
            console.log(data)
            if (data.error == true) {
                document.getElementById("failLogin").style.display = "block";
                document.getElementById("failLogin").innerHTML = data.message
            } else {
                window.location = '/'
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
            document.getElementById("tourBtn").style.display = "block"
            if (res.data == true) {
                document.getElementById("adminBtn").style.display = "none";
                document.getElementById("logoutBtn").style.display = "block";
            } else {
                document.getElementById("adminBtn").style.display = "block";
                document.getElementById("logoutBtn").style.display = "none";
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
                window.location = '/'
            }
        })
}


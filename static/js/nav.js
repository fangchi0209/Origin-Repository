checkProcess()

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


adminBtn.onclick = function() {
    memberBox_login.style.display = "block";
    loginBox.style.display = "block";
    bg.style.display = "block";
    return false;
}

bgBtn.onclick = function() {
    memberBox_login.style.display = "none";
    memberBox_register.style.display = "none";
    loginBox.style.display = "none";
    registerBox.style.display = "none";
    bg.style.display = "none";
    return false;
}

closeBtn1.onclick = function() {
    memberBox_login.style.display = "none";
    memberBox_register.style.display = "none";
    loginBox.style.display = "none";
    registerBox.style.display = "none";
    bg.style.display = "none";
    return false;
}

closeBtn2.onclick = function() {
    memberBox_login.style.display = "none";
    memberBox_register.style.display = "none";
    loginBox.style.display = "none";
    registerBox.style.display = "none";
    bg.style.display = "none";
    return false;
}

logBtn.onclick = function() {
    memberBox_login.style.display = "none";
    memberBox_register.style.display = "block";
    loginBox.style.display = "none";
    registerBox.style.display = "block";
    bg.style.display = "block";
    return false;
}

regBtn.onclick = function() {
    memberBox_login.style.display = "block";
    memberBox_register.style.display = "none";
    loginBox.style.display = "block";
    registerBox.style.display = "none";
    bg.style.display = "block";
    return false;
}

logoutBtn.onclick = () => {
    logoutProcess()
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

    .catch(function(error) {
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
        .catch(function(error) {
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

async function logoutProcess() {
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
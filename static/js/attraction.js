
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


showOneData(src_id);
handleClick("morning")



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
            img_group.push(img_tag)
        }

        for (let i = 0; i < img_group.length; i++) {
            let imgLink = img_group[i]
            console.log(imgLink)
            himg = imgLink.replace("http", "https")
            album.appendChild(himg)
            // console.log(album)
        }

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

    if (value_total == "morning") {
        document.getElementById("total_1").style.display = 'block';
        document.getElementById("total_2").style.display = 'none'
    } else {
        document.getElementById("total_1").style.display = 'none';
        document.getElementById("total_2").style.display = 'block'
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
    })


    prev.addEventListener("click", (e) => {

        e.preventDefault()
        animate_left(-width_p, true);
    })

}


function animate_right(offset, b) {

    if (b && length_pic && newLeft <= offset * (length_pic - 1)) {
        newLeft = -width_p;
    }
    if (b || id === 1) {
        newLeft = newLeft + offset;
    }
    id = parseInt(newLeft / offset) + 1
    album.style.left = newLeft + 'px';
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
}
windowSize();


var today = new Date().toISOString().split('T')[0]; 
 
document.getElementsByName("calendar")[0].setAttribute('min', today);


document.getElementById("bookingInfo").onclick = (u) => {
    u.preventDefault()
}


async function bookProcedure() {

    let NT = 0
    let dayTimeValue = document.querySelector('input[name="dayTime"]:checked').value
    if (dayTimeValue == "morning") {
        NT = 2000
    } else {
        NT = 2500
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
                document.getElementById("notice").innerHTML = data.message
            }
            else {
                window.location = '/booking'
                document.getElementById("notice").style.display = "none"
            }
        })
}





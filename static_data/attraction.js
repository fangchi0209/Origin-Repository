
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

// let id = 1;


window.onload = function () {
    showOneData(src_id);
    handleClick("1")
}


let attractionId;

let length_pic = 0;

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

        let name_tag = document.createElement("div");
        let place_tag = document.createElement("div");
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
        place_tag.appendChild(attraction_mrt)
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

    if (value_total == "1") {
        document.getElementById("total_1").style.display = '';
        document.getElementById("total_2").style.display = 'none'
    } else {
        document.getElementById("total_1").style.display = 'none';
        document.getElementById("total_2").style.display = ''
    }
}

function catch_size(){
    if(window.innerWidth>800){
        width_p=-540
        newLeft=540
    }else {
        width_p=-340
        newLeft=340
    }
    animate_right(width_p)
}

catch_size()



window.addEventListener("resize", function() {
    catch_size()
});



function windowSize() {

    next.addEventListener("click", (e) => {

        e.preventDefault()
        animate_right(width_p);
        // id++
        // console.log(id)

    })


    prev.addEventListener("click", (e) => {

        e.preventDefault()
        animate_left(-width_p);
        // id--

    })

}



// next.addEventListener("click",(e)=>{

//     e.preventDefault()
//     animate_right(-540);

// })


// prev.addEventListener("click",(e)=>{

//     e.preventDefault()
//     animate_left(540);

// })



function animate_right(offset) {

    if (length_pic && newLeft <= offset * (length_pic - 1)) {
        newLeft = -width_p;
        // id=0
    }
    newLeft = newLeft + offset;
    album.style.left = newLeft + 'px';
}

function animate_left(offset) {
    if (newLeft === 0) {
        newLeft = width_p;
    }
    newLeft = newLeft + offset;
    album.style.left = newLeft + 'px';
    console.log(newLeft)
}


windowSize();






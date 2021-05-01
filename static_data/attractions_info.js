
let start_page = 0
let isMouseAtBottom = false
let content = document.getElementById('content');

window.onload = function () {
    search_page(start_page)
}

let keyword;

async function search_page(item) {
    let data;
    let cur_page = 0
    isMouseAtBottom = true;
    src="api/attractions?page="
    console.log(item,keyword)
    if (item != null & keyword!=null){
        src+=`${start_page}&keyword=${keyword}`
    }else (
        src+=`${start_page}`
    )

        console.log(src)
    await fetch(src)
        .then(response => {
            return response.json();
        }).then(r => {

            next_page = r.nextPage
            data = r.data;
            // console.log(data)
            find_pic(data, cur_page, data.length)
        }).catch(function(error) {    
            console.log(error)                 
            content.innerHTML="查無資料"

          });




    function find_pic(data_source, cur, lat) {
        for (let n = cur; n < lat; n++) {
            let info_name = document.createTextNode(data_source[n].name);
            let station_name = document.createTextNode(data_source[n].mrt);
            let cat_name = document.createTextNode(data_source[n].category)

            let info_tag = document.createElement("div");
            let img_tag = document.createElement("div");
            let station_tag = document.createElement("div");
            let cat_tag = document.createElement("div");
            let box_tag = document.createElement("div");

            img_tag.style.backgroundImage = "url('" + data_source[n].images[0] + "')";

            info_tag.classList.add("attractions_text");
            img_tag.classList.add("attractions_img");
            station_tag.classList.add("station");
            cat_tag.classList.add("cat");
            box_tag.classList.add("box");

            info_tag.appendChild(info_name);
            station_tag.appendChild(station_name);
            cat_tag.appendChild(cat_name);

            box_tag.appendChild(img_tag);
            box_tag.appendChild(info_tag);
            box_tag.appendChild(station_tag);
            box_tag.appendChild(cat_tag);
            content.appendChild(box_tag);
            // console.log(box_tag)
        }
        isMouseAtBottom = false;
    }
}


window.addEventListener("scroll", () =>{
    if (next_page != null) {

        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;

        if (Math.ceil(scrolled) === scrollable) {

            if (isMouseAtBottom == false){
                isMouseAtBottom=true;
                start_page = next_page;
                console.log(start_page)

                search_page(start_page)
            }
        }
    }
})




let btn = document.getElementById("btn")
btn.addEventListener("click",()=>{
    content.innerHTML=""
    start_page=0
    keyword=document.getElementById("searchKeyword").value;
    search_page(start_page)

})

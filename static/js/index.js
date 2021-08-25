
let start_page = 0
let isMouseAtBottom = false
let content = document.getElementById('content');

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

            let info_tag = document.createElement("div");
            let img_tag = document.createElement("div");
            let station_tag = document.createElement("div");
            let cat_tag = document.createElement("div");
            let mrt_cat_tag = document.createElement("div");
            let box_tag = document.createElement("div");
            let url_tag = document.createElement("a");

            img_tag.style.backgroundImage = "url('" + data_source[n].images[0].replace('http', 'https') + "')";

            info_tag.classList.add("attractions_text");
            img_tag.classList.add("attractions_img");
            station_tag.classList.add("station");
            cat_tag.classList.add("cat");
            mrt_cat_tag.classList.add("MrtCat")
            box_tag.classList.add("box");
            url_tag.classList.add("attractions_url")

            url_tag.href = url_link;
            info_tag.appendChild(info_name);
            station_tag.appendChild(station_name);
            cat_tag.appendChild(cat_name);

            mrt_cat_tag.appendChild(station_tag);
            mrt_cat_tag.appendChild(cat_tag);
            url_tag.appendChild(img_tag);
            url_tag.appendChild(info_tag);
            url_tag.appendChild(mrt_cat_tag);
            box_tag.appendChild(url_tag);
            content.appendChild(box_tag);
        }
        isMouseAtBottom = false;
    }
}


window.addEventListener("scroll", () => {
    if (next_page != null) {

        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY + 1;
        // console.log(scrollable)
        // console.log(scrolled)

        if (Math.ceil(scrolled) >= scrollable) {

            if (isMouseAtBottom == false) {
                isMouseAtBottom = true;
                start_page = next_page;
                search_page(start_page)
            }
        }
    }
})

let searchBtn = document.getElementById("searchBtn")
searchBtn.addEventListener("click", (e) => {
    e.preventDefault()
    content.innerHTML = ""
    start_page = 0
    search_page(start_page)

})

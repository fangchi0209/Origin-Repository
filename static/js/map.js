let attSite = window.location.href;
let site_id = attSite.split("/")[4];
let mymap;
let marker;
let popup;




async function attractionsite(attractionId) {
    await fetch("/api/attraction/" + `${attractionId}`)
        .then(response => {
            return response.json()
        }).then(res => {
            console.log(res)
            latitude = res.data.latitude
            longitude = res.data.longitude

            mymap = L.map("mapid").setView([latitude, longitude], 15);
            L.tileLayer('https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg', {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
                maxZoom: 18
            }).addTo(mymap);

            marker = L.marker([latitude, longitude]).addTo(mymap);
            marker.bindPopup("<b>哈囉, 我在這!</b>").openPopup();
            
        })
}

attractionsite(site_id)



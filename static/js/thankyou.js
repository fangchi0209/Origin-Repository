let url = window.location.href;
let url_transactionId = url.split("=")[1];
let orderNumber;

confirmationProcess(url_transactionId)


document.getElementById("copyAction").addEventListener("click", function() {
    let copyNumber = document.getElementById("confirmId")
    let range = document.createRange()
    range.selectNode(copyNumber)
    window.getSelection().addRange(range)
    document.execCommand("Copy")
})


async function confirmationProcess(orderNumber) {
    await fetch("/api/order/" + `${orderNumber}`)
        .then(response => {
            return response.json();
        }).then(res => {
            console.log(res)
            if (res.error == true) {
                window.location = '/'
            } else {
                document.getElementById("confirmId").innerHTML = orderNumber
                document.getElementById("date").innerHTML = res.data.date
                document.getElementById("time").innerHTML = res.data.time
                document.getElementById("place").innerHTML = res.data.trip.name
                document.getElementById("address").innerHTML = res.data.trip.address
                document.getElementById("fee").innerHTML = "新台幣" + "&nbsp" + res.data.price + "&nbsp" + "元"
                document.getElementById("tourPic").style.backgroundImage = "url('" + res.data.trip.image + "')";
            }
        })
}
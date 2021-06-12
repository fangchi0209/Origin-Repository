TPDirect.setupSDK(20419, 'app_C453RMj4nEQ60S0kuDnJtBTiWA8hjFRSeaFipx38uxvRKZtWitq0Nlt7qt5c', 'sandbox')

var fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: '後三碼'
    }
}

TPDirect.card.setup({
    fields: fields,
    styles: {
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})

TPDirect.card.onUpdate(function(update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    submitButton = document.getElementById("btnn")
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        submitButton.setAttribute('disabled', true)
    }
})

function onSubmit(event) {
    event.preventDefault()
    let name = document.getElementById("contactName").value
    let email = document.getElementById("contactEmail").value
    let phone = document.getElementById("contactNo").value


    if (name === "" || email === "" || phone === "") {
        document.getElementById("notComplete").innerHTML = "請輸入聯絡資訊"
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        console.log(result)
        if (result.status !== 0) {
            document.getElementById("notComplete").innerHTML = "請確認付款資訊是否正確"
        } else {
            // alert('get prime 成功，prime: ' + result.card.prime)

            fetch("/api/orders", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify({
                        "prime": result.card.prime,
                        "order": {
                            "price": document.getElementById("fee").innerHTML.split("&nbsp;")[1],
                            "trip": {
                                "attraction": {
                                    "id": url_id,
                                    "name": document.getElementById("name").innerHTML,
                                    "address": document.getElementById("place").innerHTML,
                                    "image": document.getElementById("tourPic").innerHTML,
                                },
                                "date": document.getElementById("date").innerHTML,
                                "time": document.getElementById("time").innerHTML,
                            },
                            "contact": {
                                "name": document.getElementById("contactName").value,
                                "email": document.getElementById("contactEmail").value,
                                "phone": document.getElementById("contactNo").value,
                            }
                        }
                    })
                })
                .then(response => {
                    return response.json()
                })
                .then(res => {
                    console.log(res)
                    document.getElementById("processing").style.display = "block"
                    transactionId = res.data.number
                    url_thankyou = "/thankyou?number=" + transactionId
                    window.location = url_thankyou
                })
        }
    })

}
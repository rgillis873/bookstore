function checkOrderId(){
    orderid = document.getElementById('orderid').value
	orderid_json = {}
    orderid_json['orderid'] = orderid

	req = new XMLHttpRequest();
	req.onreadystatechange = function() {
        console.log(req.readyState)
        console.log(req.status)
		if(req.readyState==4 && req.status == 200){
			shipping_info = JSON.parse(req.responseText);
			//document.appendChild(response.exists)
            console.log(shipping_info)
		}else if(this.status == 404){
            console.log('No order id')
        }
	}
    url = '/tracking/'+orderid
	req.open("GET", url);
	req.send();
}

function getTrackingPage(){
    action_src = "/tracking/" + document.getElementsByName("orderid")[0].value
    tracking_form = document.getElementById('tracking_form')
    tracking_form.action = action_src 
}

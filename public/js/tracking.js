//Set the correct page destination for the order tracking
function getTrackingPage(){
    action_src = "/tracking/" + document.getElementsByName("orderid")[0].value
    tracking_form = document.getElementById('tracking_form')
    tracking_form.action = action_src 
}
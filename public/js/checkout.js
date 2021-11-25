//Sets shipping info to same as billing when checkbox is checked
function setShippingValues(){
    checked = document.getElementById("shipCheck").checked;
    
    document.getElementById("inputFirstNameS").value = checked ? document.getElementById("inputFirstNameB").value : "";
    document.getElementById("inputLastNameS").value = checked ? document.getElementById("inputLastNameB").value : "";
    document.getElementById("inputEmailS").value = checked ? document.getElementById("inputEmailB").value : "";
    document.getElementById("inputPhoneS").value = checked ? document.getElementById("inputPhoneB").value : "";
    document.getElementById("inputAddressS").value = checked ? document.getElementById("inputAddressB").value : "";
    document.getElementById("inputAddress2S").value = checked ? document.getElementById("inputAddress2B").value : "";
    document.getElementById("inputCityS").value = checked ? document.getElementById("inputCityB").value : "";
    document.getElementById("inputProvinceS").value = checked ? document.getElementById("inputProvinceB").value : "";
    document.getElementById("inputPostalS").value = checked ? document.getElementById("inputPostalB").value : "";
    document.getElementById("inputCountryS").value = checked ? document.getElementById("inputCountryB").value : "";
}

if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(function(position){
    console.log('latitude:', position.coords.latitude, 'Longitude:', position.coords.longitude)
    document.getElementById("latitude").value = position.coords.latitude;
    document.getElementById("longitude").value = position.coords.longitude;
    });
} else {
    console.log('geolocation not available');
}
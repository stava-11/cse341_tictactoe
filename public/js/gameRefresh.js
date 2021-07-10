if ( window.history.replaceState ) {
    window.history.replaceState( null, null, '/playGame');
}

window.setTimeout(function(){ document.location.reload(true); }, 15000); // this is to refresh the page every 15 seconds

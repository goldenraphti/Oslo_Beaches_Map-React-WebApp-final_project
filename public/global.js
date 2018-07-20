function gm_authFailure() {

    console.log('gmap authentification failed, starting the plan B ;)')

    document.getElementById('gmap-fail-alternative').setAttribute('class', 'flex');
    document.getElementById('map').setAttribute('class', 'hidden');
    
};
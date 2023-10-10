$('#fid').ready(function() {
    const params = new URLSearchParams(window.location.href);
    $('#fid')[0].textContent += params.get('fid');
});
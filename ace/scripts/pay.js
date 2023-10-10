$('#amount').ready(function () {
    const params = new URLSearchParams(window.location.href);

    // if they are not supposed to be here
    if (!params.has('a')) {
        window.location.assign('https://kratos23.com')
    }

    $('#amount')[0].textContent = '₹' + params.get('a');
});

$('body').ready(function () {
    $('#file').val("")
})

$('.fid').ready(function () {
    const params = new URLSearchParams(window.location.href);

    // if they are not supposed to be here
    if (!params.has('fid')) {
        window.location.assign('https://kratos23.com')
    }

    $('.fid')[0].textContent += params.get('fid');
    $('#form_id').attr('value', params.get('fid'));
})

function uploadButton() {
    let files = $('#file')[0].files;
    if (files.length == 0) {
        $('#file').click();
    } else {
        $('#ss_form').submit()
    }
}
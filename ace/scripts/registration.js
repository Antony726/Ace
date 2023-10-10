function getCookie(key) {
    let c = document.cookie
        .split('; ')
        .find((row) => row.startsWith(`${key}=`))
        ?.split('=')[1];

    if (!c) {
        return "";
    }
    return atob(c);
}

function setCookie(key, value) {
    document.cookie = `${key}=${btoa(value)}; max-age=172800; path='/'; samesite=lax;`;
}

function getRegistrationList() {
    return getCookie('registration_list').split(' ');
}

function isEventCodeAdded(eventCode) {
    return getRegistrationList().includes(eventCode)
}

function idempotentAppendRegistrationList(eventTitle) {
    let ckey = 'registration_list';
    let c = getCookie(ckey);
    if (c == "") {
        setCookie(ckey, eventTitle);
        return;
    }
    if (!c.includes(eventTitle)) {
        setCookie(ckey, `${c} ${eventTitle}`);
    }
}

function removeRegistrationListItem(eventCode) {
    let reg = getCookie('registration_list');
    reg = reg.replace(eventCode, '').replace('  ', ' ').trim()
    setCookie('registration_list', reg)
}

function registerClick(i) {
    let card = document.getElementById(`card${i}`);
    let cardName = card.getElementsByClassName('eventName')[0].textContent;
    let codeName = cardName.toLowerCase().replaceAll("'", "").replaceAll('-', ' ').replaceAll(' ', '_');
    let regButton = document.getElementById(`regButton${i}`);

    if (isEventCodeAdded(codeName)) {
        removeRegistrationListItem(codeName)

        regButton.getElementsByClassName('reg-button-label')[0].textContent = "Add to Registration";
        regButton.classList.add('reg-button-active')
        regButton.classList.remove('reg-button-inactive')

        let icon = card.getElementsByClassName('fa-check')[0];
        icon.classList.add('fa-arrow-right-long')
        icon.classList.remove('fa-check');
    } else {
        idempotentAppendRegistrationList(codeName);
        
        regButton.getElementsByClassName('reg-button-label')[0].textContent = "Added to Registration";
        regButton.classList.remove('reg-button-active')
        regButton.classList.add('reg-button-inactive')
        
        let icon = card.getElementsByClassName('fa-arrow-right-long')[0];
        icon.classList.remove('fa-arrow-right-long')
        icon.classList.add('fa-check');

        $('#regModal').css('display', 'flex')
        $('#regModal').find('.event-name')[0].textContent = cardName;
    }
}
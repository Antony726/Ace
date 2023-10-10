let _eventCount;
async function fetchEventCount() {
  if (_eventCount) {
    return _eventCount
  }

  let res = await fetch('https://storage.googleapis.com/kratos23.com/events/count');
  if (res.ok) {
    _eventCount = Number((await res.text()));
    return _eventCount;
  } else {
    console.error("Error fetching event count. ", res);
  }
}

let _eventList = [];
async function fetchEventList() {
  if (_eventList.length !== 0)
    return _eventList;

  let promises = [];
  let count = await fetchEventCount();
  for (let i = 0; i < count; i++) {
    ;promises.push(axios.get(`https://storage.googleapis.com/kratos23.com/events/event${i}.json`))
  }

  _eventList = (await Promise.all(promises)).map((x) => x.data)
  return _eventList;
}

$('body').on('ready', loadEventCards());

async function loadEventCards() {
  // Only do card loading in the main page. 
  // This module is linked in registration page too, for the fetchEventList() and fetchEventCount fns()
  if (document.location.pathname !== "/")
    return;

  let count = await fetchEventCount();
  let events = await fetchEventList();

  // Iterate over all events
  for (let i = 0; i < count; i++) {
    let event = events[i];

    // Per team price display exceptions
    const perTeam = ["Paper Presentation", "Murder Mystery", "Code Play", "Futsal"]
    let fee;
    if (event.content.teamBased.toLowerCase() !== 'solo' && !perTeam.includes(event.content.name)) {
      fee = '' + (event.content.fee / (event.content.teamSize.split('-')[1] ? event.content.teamSize.split('-')[1] : event.content.teamSize)).toPrecision(2) + ' Per Head'
    } else {
      fee = event.content.fee + ' Per Team'
    }

    // Online / Offline reg based button content changes
    let registerLogo, regHandler, regButtonLabel;
    let buttonClasses = "reg-button reg-button-active"
    if (event.content.onlineRegistration) {
      registerLogo = 'fa-solid fa-arrow-right-long'
      regHandler = `registerClick(${i})`
      regButtonLabel = "Add to registration"
    } else {
      registerLogo = 'fa-solid fa-building-columns'
      regHandler = ''
      regButtonLabel = "On spot Registraion"
    }

    // GForm(online) event exceptions
    if (event.type == "online") {
      regHandler = `location.href='${event.gform}'`
      regButtonLabel = "Fill Out Google Form"
    }

    // Registration closing exceptions
    let eventCode = event.content.name.toLowerCase().replaceAll("'", "").replaceAll('-', ' ').replaceAll(' ', '_')
    const closedEvents = ['futsal', 'paper_presentation', 'bug_off', 'css_wars',
      'futsal', 'cine_quiz', 'gaming_valorant', 'pair_programming', 'murder_mystery', 'squid_game', 'gaming_fifa', 'code_play','channel_surfing']
    if (closedEvents.includes(eventCode)) {
      removeRegistrationListItem(eventCode)
      registerLogo = 'fa-solid fa-ban'
      regHandler = ""
      regButtonLabel = "Registration Closed for Event"
      buttonClasses = buttonClasses.replace("reg-button-active", "reg-button-inactive")
    }

    $(`#${event.category}Page`).find(`#${event.type}`)[0].innerHTML +=
      `<div class="card "  id="card${i}">
        <div class="cardContent" >
          <div class="cardImage" id="cardImage${i}" >
            <h1 class="eventName">${event.content.name}</h1>
            <div class="icon">
              <img src="${event.content.image}"/>
            </div>
            <i id="plus${i}" onclick="setTimeout(function(){triggerDisplay(${i})}, 300); $('.transform').toggleClass('transform-active-another');" class="plus transform fa fa-plus"></i>
            <div class="details" id="details${i}">
              <div class="tag">₹${fee}</div>
              <div class="tag">${event.content.teamBased}</div>
              <div class="tag">${event.content.teamSize.length <= 2 ? event.content.teamSize + "v" + event.content.teamSize : event.content.teamSize + " Members"}</div>
            </div>
            <div id="regButton${i}" class="${buttonClasses}" onclick="${regHandler}" >
              <div class="reg-button-label">${regButtonLabel}</div>
              <i id="buttonIcon" class="${registerLogo}"></i>
            </div>
            <div class="vl" id="vl${i}"></div>
          </div>
          <div class="bText" id="bText${i}">
            <p class="content" id="content${i}">${event.content.description}</p>
            <p class="contact">👤 ${event.content.contact}</p>
          </div>
          <div class="cardRules" id="cardRules${i}">
            <h3>Rules</h3>
            <scroller>
              ${event.content.rules.map((x) => `<p>- ${x}</p>`).reduce((p, c, a) => p + c)}
            </scroller>
          </div>
        </div>
        <i id="upArrow${i}" onclick="reset(${i})" class="upArrow fa fa-caret-up fa-2x" style="display: none;"></i>
      </div>`;

    // Change added event cards' buttons to reflect that
    if (isEventCodeAdded(eventCode)) {
      let card = document.getElementById(`card${i}`);
      let regButton = document.getElementById(`regButton${i}`);
      regButton.getElementsByClassName('reg-button-label')[0].textContent = "Added to Registration";
      regButton.classList.remove('reg-button-active')
      regButton.classList.add('reg-button-inactive')

      let icon = card.getElementsByClassName('fa-arrow-right-long')[0];
      icon.classList.remove('fa-arrow-right-long')
      icon.classList.add('fa-check');
    }
  }
}
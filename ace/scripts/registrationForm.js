const apiURI = "https://api.kratos23.com"
// const apiURI = "http://localhost:3555"

const namePattern = "^[A-Za-z]+((\\s)?(('|-|\\.)?([A-Za-z])+))*\\s*?$"
const emailPattern = "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$"
const mobilePattern = "^[0-9]{10}$"

function truncateString(str, size) {
  if (str.length > size - 3 + 1) {
    let slice = str.slice(0, size)
    if (slice[slice.length - 1] == '.') {
      return slice.concat('..');
    } else {
      return slice.concat('...');
    }
  } else {
    return str;
  }
}

function toCodeName(titleName) {
  return titleName.toLowerCase().replaceAll("'", "").replaceAll('-', ' ').replaceAll(' ', '_');
}

function toTitleNameList(codeNameList) {
  return codeNameList.map((x) => x.toLowerCase().replace('_', ' ').split(' ').map((x) => x.charAt(0).toUpperCase() + x.slice(1)).reduce((a, x) => a + ' ' + x));
}

async function getChosenSoloEventTitleList() {
  let allEvents = await fetchEventList();
  let soloEvents = [];
  let chosenEventCodes = getRegistrationList();

  for (let i = 0; i < allEvents.length; i++) {
    if (allEvents[i].content.teamBased.toLowerCase() === "solo" && chosenEventCodes.includes(toCodeName(allEvents[i].content.name))) {
      soloEvents.push(allEvents[i].content.name);
    }
  }
  return soloEvents;
}

async function getChosenTeamEventDetailsList() {
  let allEvents = await fetchEventList();
  let teamEvents = [];
  let chosenEventCodes = getRegistrationList();
  for (let i = 0; i < allEvents.length; i++) {
    if (allEvents[i].content.teamBased.toLowerCase() !== "solo" && chosenEventCodes.includes(toCodeName(allEvents[i].content.name))) {
      teamEvents.push(allEvents[i]);
    }
  }

  return teamEvents;
}

$('event-list').ready(() => {
  loadSoloEventList();
});

async function loadSoloEventList() {
  let elist = document.getElementsByClassName('event-list')[0];
  let soloList = await getChosenSoloEventTitleList();

  for (let i = 0; i < soloList.length; i++) {
    elist.innerHTML += `<div class="event-list-item">${soloList[i]}</div>`
  }

  let eventCount = (await getChosenSoloEventTitleList()).length + (await getChosenTeamEventDetailsList()).length
  if (eventCount == 0) {
    $('.section-header').find('h3')[0].innerHTML = "No Events";
    $('.section-header').find('h4')[0].innerHTML = "You haven't added any events";
    $('.section-header').find('h5')[0].innerHTML = "Add events from the home page's cards"
    $('.section-header').find('h5').after($('#soloFormNext'));
    $('#soloFormNext').css('align-self', 'center')
    $('#soloFormNext')[0].innerHTML = "Home";
    $('#soloFormNext').attr('onclick', "window.location.assign('https://kratos23.com')")
    $('form').remove()
    $('.form-title').remove()
    $('.form-title-hr').remove()
    return;
  }

  if (soloList.length === 0) {
    elist.innerHTML += `<div class="event-list-item" style="background: var(--kratos-grey-lighter); color: var(--kratos-white-dull);">None</div>`
  }
}

$('input').on("keydown change", function () {
  this.setCustomValidity('')
  this.reportValidity();
});

$('#formName').on('invalid', function (ev) {
  this.setCustomValidity('Please enter a valid name! (Only Alphabets and whitespaces)')
})

$('#formCollege').on('invalid', function (ev) {
  this.setCustomValidity('Please enter a valid name! (Only Alphabets and whitespaces)')
})

$('#formEmail').on('invalid', function (ev) {
  this.setCustomValidity('Please enter a valid Email address!')
})

$('#formMobile').on('invalid', function (ev) {
  // this.setCustomValidity('Please enter a valid, 10 digit, Indian phone number')
})

let formData = {}
let teamEvIndex = -1;

async function toTeamEvents() {

  const name = document.getElementById('formName');
  const email = document.getElementById('formEmail');
  const clg = document.getElementById('formCollege');
  const mobile = document.getElementById('formMobile');

  if (!(name.reportValidity() && email.reportValidity() && clg.reportValidity() && mobile.reportValidity())) {
    return // form is not valid
  }

  $("#soloFormNext").attr('disabled', '')

  // Get all the previous pages values to store in object
  for (let i = 0; i < 4; i++) {
    formData[$('#soloForm').find('input')[i].name] = $('#soloForm').find('input')[i].value;
  }
  formData['solo_events'] = (await getChosenSoloEventTitleList()).map((x) => toCodeName(x));

  let teamEvents = await getChosenTeamEventDetailsList();
  formData['team_events'] = (await getChosenTeamEventDetailsList()).map((x) => toCodeName(x.content.name))
  $('#soloSection').remove()
  if (teamEvents.length === 0) {
    await toFinalPage();
  } else {
    teamEvIndex += 1;
    $('#blockQuote').after(`
      <div class="section" id="teamSection${teamEvIndex}">
        <div class="section-header">
          <h3>Team Events</h3>
          <h4>Registering for 
            <span class="team-event-title">${teamEvents[teamEvIndex].content.name}</span>
          </h4>
          <div class="image-container">
            <img src="${teamEvents[teamEvIndex].content.image}"/>
          </div>
        </div>

        <div class="form-title">Team's Details</div>
        <div class="form-title-hr"></div>

        <form id="teamForm${teamEvIndex}">
          <div>
          <label>College</label>
          <input id="formCollege" type="text" name="college_name" placeholder="e.g. SRM IST Ramapuram"
            value="${formData.college_name}" pattern="${namePattern}" minlength="3" required />
          </div>
          <div>
            <label>Leader's Email</label>
            <input id="formEmail" type="text" name="email" value="${formData.email}" placeholder="e.g. user@example.com" autocomplete="email" pattern="${emailPattern}" required/>
          </div >
          <div>
            <label>Leader's Phone Number</label>
            <input id="formMobile" type="text" name="mobile" value="${formData.mobile}" placeholder="e.g. 1234567890" autocomplete="mobile" pattern="${mobilePattern}" required/>
          </div>
          <div style="margin-bottom: 2em;">
          <label>Leader's Full Name</label>
          <input id="formName" type="text" name="full_name" value="${formData.full_name}" placeholder="e.g. Joe Mama" autocomplete="name" size="30" required pattern="${namePattern}" required/>
          </div>
          <button id='teamFormNext${teamEvIndex}' type="button" class="next-button" onclick="nextTeamSection()">Next</button>
        </form>
      </div> `);

    let lowerBound;
    let upperBound;
    if (teamEvents[teamEvIndex].content.teamSize.includes('-')) {
      // variable team size
      lowerBound = teamEvents[teamEvIndex].content.teamSize.split("-")[0];
      upperBound = teamEvents[teamEvIndex].content.teamSize.split("-")[1];
    } else {
      // fixed team size
      lowerBound = teamEvents[teamEvIndex].content.teamSize;
      upperBound = teamEvents[teamEvIndex].content.teamSize;
    }

    for (let i = 1; i < upperBound; i++) {
      $(`#teamFormNext${teamEvIndex}`).before(`
        <div>
          <label>Member ${i}'s Full Name
            <span style="color: var(--kratos-grey-lightest);">
              ${i + 1 > lowerBound ? " (Optional)" : ""}
            </span>
          </label>
          <input id="formMemberName${i}" type="text" name="member${i}_full_name" placeholder="e.g. Joe Mama" size="30"
            pattern="${namePattern}"/>
        </div >
      `);
    }

    // Set the minimum team size based mandatory fields
    for (let i = 1; i + 1 <= lowerBound; i++) {
      $(`#formMemberName${i}`).attr("required", "")
    }

    $('input').on("keydown change", function () {
      this.setCustomValidity('')
      this.reportValidity();
    });

    $("html, body").animate(
      { scrollTop: $("#blockQuote").position().top },
      "fast"
    );


  }
}

async function nextTeamSection() {

  let inputs = $(`#teamForm${teamEvIndex}`).find('input');
  let isValid = true;
  for (let inp of inputs) {
    // For required fields and optional fields that are non-empty
    if (inp.required || inp.value !== "") {
      let validity = inp.checkValidity();
      if (!validity)
        inp.setCustomValidity('Please enter a valid input')
      isValid = isValid && inp.reportValidity();
    }
  }
  if (!isValid) {
    return; // form section invalid
  }
  $(`#teamFormNext${teamEvIndex}`).attr('disabled', '')

  let teamEvents = await getChosenTeamEventDetailsList();
  formData[toCodeName(teamEvents[teamEvIndex].content.name)] = {}; // create the subobject for this event's data
  for (let i = 0; i < $(`#teamForm${teamEvIndex}`).find('input').length; i++) {
    formData[toCodeName(teamEvents[teamEvIndex].content.name)][$(`#teamForm${teamEvIndex}`).find('input')[i].name] = $(`#teamForm${teamEvIndex}`).find('input')[i].value;
  }
  $(`#teamSection${teamEvIndex}`).remove();

  let lowerBound;
  let upperBound;
  if (teamEvents[teamEvIndex].content.teamSize.includes('-')) {
    // variable team size
    lowerBound = teamEvents[teamEvIndex].content.teamSize.split("-")[0];
    upperBound = teamEvents[teamEvIndex].content.teamSize.split("-")[1];
  } else {
    // fixed team size
    lowerBound = teamEvents[teamEvIndex].content.teamSize;
    upperBound = teamEvents[teamEvIndex].content.teamSize;
  }

  // normalize the member name fields (add empty ones, as form is required to have all 3)
  for (let i = upperBound; i < 4; i++) {
    formData[toCodeName(teamEvents[teamEvIndex].content.name)][`member${i}_full_name`] = ""
  }

  // go to next page
  if (teamEvIndex === teamEvents.length - 1) {
    await toFinalPage();
  } else {
    teamEvIndex += 1;
    $('#blockQuote').after(`
      <div class="section" id="teamSection${teamEvIndex}">
        <div class="section-header">
          <h3>Team Events</h3>
          <h4>Registering for 
            <span class="team-event-title">${teamEvents[teamEvIndex].content.name}</span>
          </h4>
          <div class="image-container">
            <img src="${teamEvents[teamEvIndex].content.image}"/>
          </div>
        </div>

        <div class="form-title">Team's Details</div>
        <div class="form-title-hr"></div>

        <form id="teamForm${teamEvIndex}">
          <div>
          <label>College</label>
          <input id="formCollege" type="text" name="college_name" placeholder="e.g. SRM IST Ramapuram"
            value="${formData.college_name}" pattern="${namePattern}" minlength="3" required />
          </div>
          <div>
            <label>Leader's Email</label>
            <input id="formEmail" type="text" name="email" value="${formData.email}" placeholder="e.g. user@example.com" autocomplete="email" pattern="${emailPattern}" required/>
          </div >
          <div>
            <label>Leader's Phone Number</label>
            <input id="formMobile" type="text" name="mobile" value="${formData.mobile}" placeholder="e.g. 1234567890" autocomplete="mobile" pattern="${mobilePattern}" required/>
          </div>
          <div style="margin-bottom: 2em;">
          <label>Leader's Full Name</label>
          <input id="formName" type="text" name="full_name" value="${formData.full_name}" placeholder="e.g. Joe Mama" autocomplete="name" size="30" required pattern="${namePattern}" required/>
          </div>
          <button id='teamFormNext${teamEvIndex}' type="button" class="next-button" onclick="nextTeamSection()">Next</button>
        </form>
      </div> `);

    let lowerBound;
    let upperBound;
    if (teamEvents[teamEvIndex].content.teamSize.includes('-')) {
      // variable team size
      lowerBound = teamEvents[teamEvIndex].content.teamSize.split("-")[0];
      upperBound = teamEvents[teamEvIndex].content.teamSize.split("-")[1];
    } else {
      // fixed team size
      lowerBound = teamEvents[teamEvIndex].content.teamSize;
      upperBound = teamEvents[teamEvIndex].content.teamSize;
    }

    for (let i = 1; i < upperBound; i++) {
      $(`#teamFormNext${teamEvIndex}`).before(`
        <div>
          <label>Member ${i}'s Full Name${i <= upperBound - 1 ? "" : " (Optional)"}</label>
          <input id="formMemberName${i}" type="text" name="member${i}_full_name" placeholder="e.g. Joe Mama" size="30"
            pattern="${namePattern}" value="${formData[formData.team_events[teamEvIndex - 1]][`member${i}_full_name`]}"/>
        </div >
      `);
    }

    // Set the minimum team size based mandatory fields
    for (let i = 1; i + 1 <= lowerBound; i++) {
      $(`#formMemberName${i}`).attr("required", "")
    }

    $('input').on("keydown change", function () {
      this.setCustomValidity('')
      this.reportValidity();
    });

    $("html, body").animate(
      { scrollTop: $("#blockQuote").position().top },
      "fast"
    );
  }
}

let totalAmount = 0;

async function removeEvent(ev) {
  let allEvents = await fetchEventList();
  // Not sure how reliable this expression is going to be
  // in the case where the event src is not img, but the containing div instead by accident
  let cardTopElement = ev.target.parentElement.parentElement;
  let titleElement = cardTopElement.getElementsByClassName('event-title')[0]
  let eventCode = toCodeName(titleElement.textContent);

  // modify displayed fee (only indicative anyways)
  let eventFee = Number(allEvents.find((v) => toCodeName(v.content.name) == eventCode).content.fee)
  totalAmount -= eventFee;
  $('#totalAmount')[0].innerHTML = `Total: <span style="font-size: 1.5em;">₹${totalAmount}</span>`

  // modify form data
  let chosenEvents = (await getChosenSoloEventTitleList())
  let isSoloEvent = chosenEvents.map((x) => toCodeName(x)).includes(eventCode);
  if (isSoloEvent) {
    formData.solo_events = formData.solo_events.filter((x) => x !== eventCode)
  } else {
    formData.team_events = formData.team_events.filter((x) => x !== eventCode)
    delete formData[eventCode]
  }

  // remove from cookies
  removeRegistrationListItem(eventCode);

  $(`#${eventCode}`).remove()
}

async function toFinalPage() {
  $(`teamFormNext${teamEvIndex}`).attr('disabled', '')
  $('#blockQuote').after(`
  <div class="section" id="reviewSection">
    <div class="section-header">
      <h3>Review & Pay</h3>
    </div>
    
    <div class="form-title">Solo Events</div>
    <div id="soloEventsTitle" class="form-title-hr"></div>

    <div class="form-title">Team Events</div>
    <div id="teamEventsTitle" class="form-title-hr"></div>

    <div id="totalAmount" class='total-amount'></div>
    <div class='total-amount' style="font-size:1em;">Payment for Paper Presentation will be required later, <strong>only from the shortlisted teams</strong></div> <!-- TODO: Remove -->
    <button id='submitAndPay' type="button" class="submit-button" onclick="submitAndPay()">Submit And Pay</button>
  </div>
  `);



  let allEvents = await fetchEventList();
  if (formData.solo_events.length === 0) {
    $('#soloEventsTitle').after(`<div class="event-list-item" style="background: var(--kratos-grey-lighter); color: var(--kratos-white-dull);">None</div>`)
  } else {
    for (let i = 0; i < formData.solo_events.length; i++) {
      let fee = allEvents.find((v) => toCodeName(v.content.name) == toCodeName(formData.solo_events[i])).content.fee;
      totalAmount += fee
      $('#soloEventsTitle').after(`
        <div id='${toCodeName(formData.solo_events[i])}' class='review-solo-event-top'> 
          <div class='event-title'>${toTitleNameList([formData.solo_events[i]])[0] == 'Css' ? 'CSS' : toTitleNameList([formData.solo_events[i]])[0]}</div>
          <div class='fee'>₹${fee}</div>
          <div class='remove-button' onclick="removeEvent(event)">
            <img src="https://storage.googleapis.com/kratos23.com/images/close.png" />
          </div>
        </div>
    `);
    }
  }

  let teamEvents = await getChosenTeamEventDetailsList();
  for (let i = teamEvents.length - 1; i >= 0; i--) {
    let fee = teamEvents[i].content.fee
    totalAmount += fee
    let event_code = toCodeName(teamEvents[i].content.name);
    $('#teamEventsTitle').after(`
      <div class="review-team-event" id='${event_code}'>
        <div class='review-team-event-top'>
          <div class='event-title'>${teamEvents[i].content.name}</div>
          <div class='fee'>₹${fee}</div>
          <div class='remove-button' onclick="removeEvent(event)">
            <img src="https://storage.googleapis.com/kratos23.com/images/close.png" />
          </div>
        </div>
        <div class='review-team-event-details'>
          <div class="team-names">
            <div class="label">Team</div>  
            <div id="leaderName${i}" style="margin-left: -2em">
              👑 ${truncateString(formData[event_code]['full_name'], 15)}
            </div>

          </div>
          <div class="contacts">
            <div class="label">Email</div>  
            <div class="contact-detail">${truncateString(formData[event_code]['email'], 18)}</div>
            <div class="label">Mobile</div>
            <div class="contact-detail">${formData[event_code]['mobile']}</div>
          </div>
        </div>
      </div>
    `);

    let lowerBound;
    let upperBound;
    if (teamEvents[teamEvIndex].content.teamSize.includes('-')) {
      // variable team size
      lowerBound = teamEvents[teamEvIndex].content.teamSize.split("-")[0];
      upperBound = teamEvents[teamEvIndex].content.teamSize.split("-")[1];
    } else {
      // fixed team size
      lowerBound = teamEvents[teamEvIndex].content.teamSize;
      upperBound = teamEvents[teamEvIndex].content.teamSize;
    }

    for (let j = 1; j < upperBound; j++) {
      $(`#leaderName${i}`).after(`
      <div>
        ${truncateString(formData[event_code][`member${j}_full_name`], 15)}
      </div>
      `);
    }
  }

  $('#totalAmount')[0].innerHTML = `Total: <span style="font-size: 1.5em;">₹${totalAmount}</span>`
}

function onclickotherCollege() {
  $("#otherOption").addClass('switch-active')
  $("#easwariOption").removeClass('switch-active')
  $("#formCollege").css('display', 'block')
  $(".college-switch").css({
    'min-height': 'auto',
    'font-size': '.8em'
  })
  $("#formCollege").attr('value', '')

}

function onclickEaswari() {
  $("#otherOption").removeClass('switch-active')
  $("#easwariOption").addClass('switch-active')
  $("#formCollege").css('display', 'none')
  $(".college-switch").css({
    'min-height': '3em',
    'font-size': '1em'
  })
  $("#formCollege").attr('value', 'Easwari Engineering College')
}

async function submitAndPay() {
  $('#submitAndPay').attr('disabled', 'disabled')
  setTimeout(() => { $('#submitAndPay').attr('disabled', 'disabled') }, 5000);
  let subRes = await axios.post(apiURI + '/submit', formData);

  if (isMobileDevice()) {
    document.location.assign(`${location.origin}/pay?&a=${subRes.data.amount}&fid=${subRes.data.form_id}`)
  } else {
    document.location.assign(`${location.origin}/pay?&a=${subRes.data.amount}&fid=${subRes.data.form_id}`)
  }
}

function isMobileDevice() {
  let check = false;
  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
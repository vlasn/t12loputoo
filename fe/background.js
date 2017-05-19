let slack = ""
let person = ""

function initialCheck() {
    chrome.storage.sync.get('slack', function(result){
      if (!result.slack) chrome.runtime.sendMessage({msg: "fatality", data: ["Please navigate to the options page and set up your Slack user and person ID!"]});
      else {slack= result.slack}
    })
  chrome.storage.sync.get('person', function(result){
      if (!result.person) chrome.runtime.sendMessage({msg: "fatality", data: ["Please navigate to the options page and set up your Slack user and person ID!"]});
      else {
        person = result.person
      }
  })
}

function attemptSubmit(title, description, boType, boData, zdUrl) {
  if(title && description && boType && boData && zdUrl) {
    let data = {
      title: title,
      description: description,
      person_id: person, //Person ID in support engineers' pipeline,
      from: slack, //slack username
      boType: boType,
      boData: boData,
      zdValue: zdUrl
    }

    fetch("http://67.205.162.167/api/request", {
      method: "post",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      if(data !== "ok") {
        chrome.runtime.sendMessage({msg: "xhr_error", data: data});
      } else {
        chrome.runtime.sendMessage({msg: "xhr_success", data: "Case submitted!"});
      }
    })
    .catch(error => {
      chrome.runtime.sendMessage({msg: "xhr_error", data: ["Something's gone wrong :( \n", JSON.stringify(error)]});
    })
  } else {
       chrome.runtime.sendMessage({msg: "xhr_error", data: ["Please make sure all fields are filled!"]});
  }
}
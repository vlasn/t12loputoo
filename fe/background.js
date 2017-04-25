var set = function(key, value) {
  return localStorage.setItem(key, JSON.stringify(value));
}
var get = function(key) {
  return JSON.parse(localStorage.getItem(key));
}

var instantiate = function(slack, pd, api) {
  chrome.storage.sync.set({
    slack: slack,
    userId: pd,
    apiRoot: api
  }, function() {
    message("Settings saved!")
  });
}
function checkOptions() {
  if(true) {
    return true
  }
}

function attemptSubmit(title, description, boType, boData, zdUrl){            
  if(title && description && boType && boData && zdUrl) {
    var payload = JSON.stringify({
      title: title,
      description: description,
      person_id: 5, //Person ID in support engineers' pipeline,
      from: "@veljo", //slack username
      boType: boType,
      boData: boData,
      zdValue: zdUrl
    });


    var xhr = new XMLHttpRequest();   // new HttpRequest instance 
    xhr.open("POST", "http://localhost:3000/request");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status==200) {
        var res = JSON.parse(xhr.response);
        if(res!=="ok"){
          chrome.runtime.sendMessage({msg: "xhr_error", data: res});
        } else {
          chrome.runtime.sendMessage({msg: "xhr_success", data: "Case submitted!"});
        }
      }
    }
    xhr.onerror = function(e) {
       chrome.runtime.sendMessage({msg: "xhr_error", data: "Something's gone wrong :("});
    }
    xhr.send(payload);
    




  } else {
      return "Failure"
  }
}
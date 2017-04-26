document.addEventListener('DOMContentLoaded', function() {
    var grab = function(id) {
      return document.getElementById(id);
    }

    var url = ""
    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        url = tabs[0].url;
        if(!url.includes("pipedrive.zendesk.com/agent/tickets/")) {
          grab("supportbot-wrapper").innerHTML = "<div class='error__body'>Please re-open this window in Zendesk!</div>";
        }
    });

    var title = grab("form-title"),
    description = grab("form-description"),
    boType = document.querySelector('input[name="bo-type"]:checked');
    boData = grab("form-bo-info");


    //Adding keyup listeners and fetching from local storage
    title.onkeyup = function() {
      localStorage.setItem("title", title.value)
    }
    if(localStorage.hasOwnProperty("title")){
      title.value = localStorage.getItem("title");
    }
    description.onkeyup = function() {
      localStorage.setItem("description", description.value)
    }
    if(localStorage.hasOwnProperty("description")){
      description.value = localStorage.getItem("description");
    }
    boData.onkeyup = function() {
      localStorage.setItem("boData", boData.value)
    }
    if(localStorage.hasOwnProperty("boData")){
      boData.value = localStorage.getItem("boData");
    }

    var cancelBtn = grab('cancel');
    cancelBtn.addEventListener('click', function() {
      window.close();
    }, false);
    var clrBtn = grab("clear")
    clrBtn.addEventListener("click", function(){
      localStorage.clear();
      title.value = "";
      description.value="";
      boData.value="";
    })
    var sendBtn = grab("confirm")
    sendBtn.addEventListener("click", function(){
        console.log("Tried submitting");
        chrome.extension.getBackgroundPage().attemptSubmit(title.value, description.value, document.querySelector('input[name="bo-type"]:checked').value, boData.value, url)      
    })

    chrome.runtime.onMessage.addListener(
      function(request, sender, sendResponse) {
      console.log(request);
        if (request.msg === "xhr_success") {
          grab("error-wrapper").innerHTML = 
            "<div class='success__body'> "+request.data+"</div>";
          grab("error-wrapper").className = "show";
        }

        if(request.msg === "xhr_error") {
          var list = "<ul class='error__list'>";
          for(var i=0; i<request.data.length;i++) {
            list += "<li>"+request.data[i]+"</li>"
          }
          list += "</ul>";
          grab("error-wrapper").className = "show";
          grab("error-target").innerHTML = list;
        }
        
    }
  );




}, false);
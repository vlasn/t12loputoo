document.addEventListener('DOMContentLoaded', function() {
    var grab = function(id) {
        return document.getElementById(id);
    }


    grab("save").addEventListener("click", function(){
        chrome.storage.sync.set(
            {
                'slack': grab("slack-username").value, 
                'person': grab("person-id").value
            });
    }, function() {
        /*grab("error-wrapper").innerHTML = 
            "<div class='success__body'> Settings successfully updated! </div>";
          grab("error-wrapper").className = "show";*/
          console.log("Updated");
    });

    grab("cancel").addEventListener("click", function(){window.close()});
});
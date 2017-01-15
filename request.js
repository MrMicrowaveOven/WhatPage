

function validateInput() {
  var keyword = document.getElementById("keyword").value.toLowerCase();
  var parameters = document.getElementById("parameters").value;
  parameters = parameters.toLowerCase().split(" ").join("+");
  if (keyword.length === 0 || parameters.length === 0 ) {
    document.getElementById("response").innerHTML
      = "Must have keyword and search parameters.";
  } else {
    document.getElementById("keyword").disabled = "true";
    document.getElementById("parameters").disabled = "true";
    requestForNthPage(keyword, parameters);
  }
}

function requestForNthPage(keyword, searchParameters) {
  var timesChecked = document.getElementById("timesChecked");
  timesChecked.value = parseInt(timesChecked.value) + 1;
  if (timesChecked.value > 10) {
    console.log("Beyond the 10th page");
    return;
  }
  var links = [];
  // keyword = "google";
  $.ajax({
    type: "GET",
    url: "https://www.googleapis.com/customsearch/v1",
    data: {
        key: "AIzaSyD7nKgEWQCBHw1uGJOEvXN-ae4cMeOMXuE",
        cx: "012667598935678745968:ixjc-b6xzre",
        fields: "items(link),queries",
        q: searchParameters,
        start: (timesChecked.value - 1) * 10 + 1
    },
    success: function (res) {
        // console.log("Starting at " + res.queries.request[0].startIndex);
        res.items.forEach(function (item) {
          links.push(item.link);
        });
        checkLinks(links, keyword, searchParameters);
    },
    error: function (xhr, status, error) {
      console.log(xhr);
      console.log(status);
      console.log(error);
      if (xhr.status === 403) {
        document.getElementById("response").innerHTML
          = "Sorry, ran out of pings for today :(";
      } else {
        document.getElementById("response").innerHTML = "Error #" + xhr.status;
      }
    }
  });
}

function checkLinks(links, keyword, searchParameters) {
  var timesChecked = document.getElementById("timesChecked").value;
  var found = false;
  links.forEach(function (link, ind) {
    if(found === false){
      var numCheck = (timesChecked - 1) * 10 + 1 + ind;
      // console.log("Checking " + numCheck
        // + " for " + keyword.toLowerCase());
      // console.log(link.toLowerCase());
      if (link.toLowerCase().indexOf(keyword) !== -1) {
        document.getElementById("response").innerHTML =
          "'" + keyword + "' is in result "
          + numCheck + " when searching '" + searchParameters + "'.";
        document.getElementById("keepGoing").style.visibility = "hidden";
        found = true;

      }
    }
  });
  if(found === false){
    askForNextStep(keyword, searchParameters);
  }
}

function askForNextStep(keyword, parameters) {
  var first
    = (parseInt(document.getElementById("timesChecked").value) - 1) * 10 + 1;
  var last = first + 9;
  document.getElementById("response").innerHTML =
    "I've checked results " + first + " through " + last +
    ".  Shall I keep looking?";
  document.getElementById("keepGoing").style.visibility = "visible";
}

function keepGoing() {
  validateInput(document.getElementById("timesChecked").value + 1);
}

function reset() {
  document.getElementById("keepGoing").style.visibility = "hidden";
  document.getElementById("keyword").disabled = "";
  document.getElementById("parameters").disabled = "";
  document.getElementById("response").innerHTML = "";
  document.getElementById("timesChecked").value = 0;
}

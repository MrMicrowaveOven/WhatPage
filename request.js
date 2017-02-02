function search() {
  document.getElementById("storageResponse").innerHTML = "";
  document.getElementById("timesChecked").value = 0;
  document.getElementById("storeResults").style.display = "none";
  document.getElementById("storeResults").disabled = "true";
  validateInput();
}

function getInput() {
  var parameters = document.getElementById("parameters").value.toLowerCase();
  parameters = parameters.split(" ").join("+");
  var keyword = document.getElementById("keyword").value.toLowerCase();
  return [parameters, keyword];
}


function validateInput() {
  var inputs = getInput();
  var parameters = inputs[0];
  var keyword =  inputs[1];
  if (keyword.length === 0 || parameters.length === 0 ) {
    document.getElementById("response").innerHTML
      = "Must have search terms and url.";
  } else {
    disableFields();
    requestForNthPage(keyword, parameters);
  }
}

function getTimesChecked() {
  return document.getElementById("timesChecked");
}

function disableFields() {
  document.getElementById("keyword").disabled = "true";
  document.getElementById("parameters").disabled = "true";
}

function requestForNthPage(keyword, searchParameters) {
  var timesChecked = getTimesChecked();
  timesChecked.value = parseInt(timesChecked.value) + 1;
  if (timesChecked.value > 10) {
    document.getElementById("response").innerHTML =
      "Beyond the 10th page.  Sorry, that's as far as I can go.";
    return;
  }
  var links = [];
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
        res.items.forEach(function (item) {
          links.push(item.link);
        });
        checkLinks(links, keyword, searchParameters);
    },
    error: function (xhr, status, error) {
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
  var timesChecked = getTimesChecked().value;
  var found = false;
  links.forEach(function (link, ind) {
    if(found === false){
      var numCheck = (timesChecked - 1) * 10 + 1 + ind;
      // console.log("Checking " + numCheck
        // + " for " + keyword.toLowerCase());
      // console.log(link.toLowerCase());
      if (link.toLowerCase().indexOf(keyword) !== -1) {
        document.getElementById("response").innerHTML =
          "'" + keyword + "' is result "
          + numCheck + " when searching '" + searchParameters + "'.";

        document.getElementById("storeResults").style.display = "block";
        document.getElementById("storeResults").disabled = "";
        document.getElementById("keepGoing").style.display = "none";
        document.getElementById("keyword").disabled = "";
        document.getElementById("parameters").disabled = "";
        found = true;

      }
    }
  });
  if(found === false){
    askForNextStep(keyword, searchParameters);
  }
}

function askForNextStep(keyword, parameters) {
  var timesChecked = getTimesChecked().value;
  var first
    = (parseInt(timesChecked) - 1) * 10 + 1;
  var last = first + 9;
  document.getElementById("response").innerHTML =
    "I've checked page " + timesChecked + ", which contains results " +
    first + " through " + last + ".  Shall I keep looking?";
  document.getElementById("keepGoing").style.display = "block";
  document.getElementById("search").disabled = "true";
}

function keepGoing() {
  validateInput();
}

function storeResults() {
  var searchTerms = document.getElementById("parameters");
  var url = document.getElementById("keyword");

  var params = {
    searchTerms: searchTerms,
    url: url
  };
  $.ajax({
    type: "POST",
    url: "https://whatpage-af2c1.firebaseio.com/.json",
    data: JSON.stringify(params),
    success: function (res) {
      console.log(res);
      document.getElementById("storageResponse").innerHTML =
      "Data stored!";
      document.getElementById("storeResults").disabled = "true";
    },
    error: function (xhr, status, error) {
      document.getElementById("storageResponse").innerHTML =
      "Data storage error. " + xhr + ":" + status + ":" + error;
      console.log(xhr);
      console.log(status);
      console.log(error);
    }
  });
}

function reset() {
  document.getElementById("storageResponse").innerHTML = "";
  document.getElementById("keepGoing").style.display = "none";
  document.getElementById("storeResults").style.display = "none";
  document.getElementById("keyword").disabled = "";
  document.getElementById("parameters").disabled = "";
  document.getElementById("search").disabled = "";
  document.getElementById("response").innerHTML = "";
  document.getElementById("timesChecked").value = 0;
}

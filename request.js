

function makeRequest(n) {
  var keyword = document.getElementById("keyword").value.toLowerCase();
  document.getElementById("keyword").disabled = "true";
  document.getElementById("parameters").disabled = "true";
  var parameters = document.getElementById("parameters").value.toLowerCase().split(" ").join("+");
  if (keyword.length === 0 || parameters.length === 0 ) {
    document.getElementById("response").innerHTML = "Must have keyword and search parameters.";
  } else {
    request_for_nth_page(n, keyword, parameters);
  }
}

function request_for_nth_page(n, keyword, parameters) {
  document.getElementById("timesChecked").value = parseInt(document.getElementById("timesChecked").value) + 1;
  if(n>10){
    console.log("Beyond the 10th page");
    return;
  }
  var found = false;
  var links = [];
  var searchParameters = parameters.toLowerCase().split(" ").join("+");
  // keyword = "google";
  $.ajax({
    type: "GET",
    url: "https://www.googleapis.com/customsearch/v1",
    data: {
        key: "AIzaSyD7nKgEWQCBHw1uGJOEvXN-ae4cMeOMXuE",
        cx: "012667598935678745968:ixjc-b6xzre",
        fields: "items(link),queries",
        q: searchParameters,
        count: 100,
        start: (n - 1) * 10 + 1
    },
    success: function (res) {
        console.log("Starting at " + res.queries.request[0].startIndex);
        res.items.forEach(function (item) {
          links.push(item.link);
        });
        links.forEach(function (link, ind) {
          var numCheck = (n - 1) * 10 + 1 + ind;
          console.log("Checking " + numCheck);
          console.log(link);
          if (link.indexOf(keyword) !== -1) {
            document.getElementById("response").innerHTML = numCheck;
            found = true;
          }
        });
        if(found === false){
          askForNextStep(n, keyword, parameters);
        }
    },
    error: function (xhr, status, error) {
      console.log(xhr);
      console.log(status);
      console.log(error);
      if (xhr.status === 403) {
        document.getElementById("response").innerHTML = "Sorry, ran out of pings for today :(";
      } else {
        document.getElementById("response").innerHTML = "Error #" + xhr.status;
      }
    }
  });

}
function askForNextStep(n, keyword, parameters) {
  var first = n;
  var last = n + 9;
  document.getElementById("response").innerHTML =
    "I've checked results " + first + "through " + last +
    ".  Shall I keep looking?";
  document.getElementById("keepGoing").style.visibility = "visible";
}

function keepGoing() {

}

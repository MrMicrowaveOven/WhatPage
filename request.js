

function makeRequest() {
  var keyword = document.getElementById("keyword").value;
  var parameters = document.getElementById("parameters").value;
  $.ajax({
    type: "GET",
    url: "https://www.googleapis.com/customsearch/v1",
    data: {
        key: "AIzaSyD7nKgEWQCBHw1uGJOEvXN-ae4cMeOMXuE",
        cs: "012667598935678745968:ixjc-b6xzre",
        fields: "items(title)",
        q: "custom+email"
    },
    success: function (res) {
        document.getElementById("response").innerHTML = res;
    }
});
}

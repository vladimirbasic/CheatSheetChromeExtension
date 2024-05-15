// Function to send data to localhost:8888
function sendData() {
  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    var tab = tabs[0];
    var url = tab.url;
    var title = tab.title;
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      function: getSelectedHtml
    }, function (results) {
      if (results[0].result !== "") {
        var html = results[0].result;
        // Now you can send this data to your server
        sendDataToServer(url, title, html);
      } else {
        console.error('No results found');
      }
    });
  });
}

function getSelectedHtml() {
  var html = "";
  if (typeof window.getSelection != "undefined") {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var container = document.createElement("div");
      for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      html = container.innerHTML;
    }
  } else if (typeof document.selection != "undefined") {
    if (document.selection.type === "Text") {
      html = document.selection.createRange().htmlText;
    }
  }
  return html;
}

// Function to send data to server
function sendDataToServer(url, title, html) {
  // Use fetch or other AJAX methods to send data to your server
  // Example:
  fetch('http://localhost:8888/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url,
      title: title,
      html: html
    })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data sent successfully:', data);
    })
    .catch(error => {
      console.error('Error sending data:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  // Your code here
  document.getElementById('sendDataBtn').addEventListener('click', function () {
    // When button is clicked, call sendData function
    sendData();
  });
});

function pulseInit() {
  if (!window.WebSocket) {
    alert("WebSocket not supported by this browser!");
  } else {
    var ws = new WebSocket("ws://localhost:8080/stats");
    ws.onopen = function() {
      console.log("websocket open");
    };
    ws.onclose = function() {
      console.log("websocket close");
    };
    ws.onerror = function(e) {
      console.log("websocket error error='" + e + "'");
    };
    ws.onmessage = function(m) {
      if (m.data) {
        var stat = JSON.parse(m.data);
        var stat_key = stat[0];
        var stat_val = stat[1];
        console.log("websocket message stat_key=" + stat_key);
        if (stat_key == "events_per_second") {
          $("#events_per_second").html(stat_val);
        }
        if (stat_key == "nginx_requests_per_second") {
          $("#nginx_requests_per_second").html(stat_val);
        }
      }
    };
  }
}

$(document).ready(pulseInit);

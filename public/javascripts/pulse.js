function pulseInit() {
  var buffer_size = 60;
  var events_per_second_buffer = [];
  var nginx_requests_per_second_buffer = [];

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
          if (events_per_second_buffer.length == buffer_size) {
            events_per_second_buffer.shift();
          }
          events_per_second_buffer.push(stat_val);
          $("#events_per_second_scalar").html(stat_val);
          $("#events_per_second_sparkline").sparkline(events_per_second_buffer, {chartRangeMin: 0, spotColor: false, minSpotColor: false, maxSpotColor: false, width: 100, height: 60});
        }
        if (stat_key == "nginx_requests_per_second") {
          if (nginx_requests_per_second_buffer.length == buffer_size) {
            nginx_requests_per_second_buffer.shift();
          }
          nginx_requests_per_second_buffer.push(stat_val);
          $("#nginx_requests_per_second_scalar").html(stat_val);
          $("#nginx_requests_per_second_sparkline").sparkline(nginx_requests_per_second_buffer, {chartRangeMin: 0, spotColor: false, minSpotColor: false, maxSpotColor: false, width: 100, height: 60});
        }
      }
    };
  }
}

$(document).ready(pulseInit);

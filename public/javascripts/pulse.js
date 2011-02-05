function pulse_init() {
  var sparkline_opts = {chartRangeMin: 0, spotColor: false, minSpotColor: false, maxSpotColor: false, width: 150, height: 60};
  var buffer_size = 100;
  var buffers = {};

  if (!window.WebSocket) {
    alert("WebSocket not supported by this browser!");
  } else {
    var ws = new WebSocket("ws://localhost:8080/stats");
    ws.onopen =  function()  { console.log("websocket open"); };
    ws.onclose = function()  { console.log("websocket close") };
    ws.onerror = function(e) { console.log("websocket error error='" + e + "'"); };
    ws.onmessage = function(m) {
      if (m.data) {
        var stat = JSON.parse(m.data);
        var stat_key = stat[0];
        var stat_val = stat[1];
        console.log("websocket message stat_key=" + stat_key);
        var scalar_id = "#" + stat_key + "_scalar";
        var sparkline_id = "#" + stat_key + "_sparkline";
        if ($(scalar_id) != null) {
          if (buffers[stat_key] == null) {
            buffers[stat_key] = [];
          }
          if (buffers[stat_key].length == buffer_size) {
            buffers[stat_key].shift();
          }
          buffers[stat_key].push(stat_val);
          $(sparkline_id).sparkline(buffers[stat_key], sparkline_opts);
          $(scalar_id).html(stat_val);
        }
      }
    };
  }
}

$(document).ready(pulse_init);

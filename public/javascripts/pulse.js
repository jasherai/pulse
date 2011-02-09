function pulse_init() {
  var sparkline_opts = {chartRangeMin: 0, spotColor: false, minSpotColor: false, maxSpotColor: false, width: 150, height: 60};

  if (!window.WebSocket) {
    alert("WebSocket not supported by this browser!");
  } else {
    var ws = new WebSocket(pulse_websocket_url);
    ws.onopen =  function()  { console.log("websocket open"); };
    ws.onclose = function()  { console.log("websocket close") };
    ws.onerror = function(e) { console.log("websocket error error='" + e + "'"); };
    ws.onmessage = function(m) {
      if (m.data) {
        var stat = JSON.parse(m.data);
        var stat_key = stat[0];
        var stat_buff = stat[1];
        var stat_val = stat_buff[stat_buff.length - 1];
        var scalar_id = "#" + stat_key + "_scalar";
        var sparkline_id = "#" + stat_key + "_sparkline";
        if ($(scalar_id) != null) {
          $(sparkline_id).sparkline(stat_buff, sparkline_opts);
          $(scalar_id).html(stat_val);
        }
      }
    };
  }
}

$(document).ready(pulse_init);

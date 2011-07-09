function pulseUpdate() {
  var sparklineOpts = {chartRangeMin: 0, spotColor: false, minSpotColor: false, maxSpotColor: false, width: 210, height: 90};

  $.get("/stats", function(stats) {
    for (var statName in stats) {
      var statBuff = stats[statName];
      var statVal = statBuff[statBuff.length - 1];
      var scalarId = "#" + statName + "-scalar";
      var sparklineId = "#" + statName + "-sparkline";
      if ($(scalarId) != null) {
        $(sparklineId).sparkline(statBuff, sparklineOpts);
        $(scalarId).html(Math.round(statVal));
      }
    }
  });
}

function pulseInit() {
  pulseUpdate();
  setInterval(pulseUpdate, 500);
}

$(document).ready(pulseInit);

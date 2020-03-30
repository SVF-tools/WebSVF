function showLines() {
        
        document.querySelector('#show-lines-button').innerHTML = 'Add Lines';
        
        lines.forEach(function(line) {
          var start = document.getElementById(line.start),
            end = document.getElementById(line.end);

          if (start !== null && end !== null) {
            line.obj = new LeaderLine(start, end, {
        /*    Add/Change Options here for altering the Leader-Lines */
              color: 'rgba(255, 127, 80, 0.35)',
              size: 2,
              //path: "straight",
              //startPlug: "disc",
              //startPlugSize: 1.2,
              startSocket: "right",
              //endPlug: "arrow3",
              endPlug: "behind",
              endPlugSize: 1.2,
              endSocket: "right"

            });
          }
        });

        ref_lines.forEach(function(line) {
          var start = document.getElementById(line.start),
            end = document.getElementById(line.end);

          if (start !== null && end !== null) {
            line.obj = new LeaderLine(start, end, {
        /*    Add/Change Options here for altering the Leader-Lines */
              color: 'rgba(255, 255, 255, 0.25)',
              size: 2,
              //path: "straight",
              startPlug: "disc",
              //startPlugSize: 1.2,
              startSocket: "left",
              //endPlug: "arrow3",
              endPlug: "arrow2",
              endPlugSize: 1.2,
              endSocket: "right"

            });
          }
        });

        
}
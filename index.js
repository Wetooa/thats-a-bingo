$(function () {
  $("#show_card").hide();

  $("#enter-code").on("click", function () {
    let code = $("#code-input").val();

    $.get(
      `http://www.hyeumine.com/getcard.php?bcode=${code}`,
      function (data, status) {
        data = JSON.parse(data);
        console.log(data);
        if (data) {
          $("#get_card").hide();
          $("#show_card").fadeIn();
          $("#game-header").text(`Game Code: ${code}`);

          for (const letter of "BINGO") {
            let res = `<div class="letter-line">
                        <span class="cell letter-cell">${letter}</span>`;
            for (const num of data.card[letter]) {
              res += `<span class="cell">${num}</span>`;
            }
            res += "</div>";
            $("#output").append(res);
          }
        } else {
          alert(`Code ${code} not found!`);
        }
      }
    );
  });
});

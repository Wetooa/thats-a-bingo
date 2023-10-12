$(function () {
  $("#show_card").hide();

  $("#win").hide();
  $("#lose").hide();

  let code;
  let current_card;

  function getCard(withNewCode = false) {
    $.ajax({
      method: "GET",
      url: `http://www.hyeumine.com/getcard.php?bcode=${code}`,
      success: function (data, status) {
        try {
          data = JSON.parse(data);
          current_card = data;

          if (!current_card) throw new Error(`Code ${code} not found!`);

          $("#game-header").html(`Game Code: <u>${code}</u>`);
          $("#game-token").html(
            `Playcard Token: <u>${current_card.playcard_token}</u>`
          );

          if (withNewCode) {
            $("#get_card").fadeOut();
            setTimeout(() => {
              $("#show_card").fadeIn();
            }, 600);
          }
          let res = "";

          for (const letter of "BINGO") {
            res += `<div class="letter-line">
                      <span class="cell">${letter}</span>`;
            for (const num of current_card.card[letter]) {
              res += `<span class="cell">${num}</span>`;
            }
            res += "</div>";
          }

          $("#output").html(res);
          $(".letter-line > span:not(:first-child)").on("click", function () {
            $(this).toggleClass("clicked");
          });
        } catch (e) {
          alert(e.message);
        }
      },
    });
  }

  $("#enter-code").on("click", function () {
    code = $("#code-input").val();
    getCard(true);
  });

  $("#reload").on("click", function () {
    getCard();
  });

  $("#change-code").on("click", function () {
    $("#show_card").fadeOut();
    setTimeout(() => {
      $("#get_card").fadeIn();
    }, 600);
  });

  $("#check-winning").on("click", function () {
    $.ajax({
      method: "GET",
      url: `http://www.hyeumine.com/checkwin.php?playcard_token=${current_card.playcard_token}`,
      success: function (data, status) {
        if (data) {
          $("#win").slideDown();
          setTimeout(() => {
            $("#win").slideUp();
          }, 2000);
        } else {
          $("#lose").slideDown();
          setTimeout(() => {
            $("#lose").slideUp();
          }, 2000);
        }
      },
    });
  });
});

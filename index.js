$(function () {
  $("#show_card").hide();

  $("#win").hide();
  $("#lose").hide();

  let code;
  let current_card;

  function handleMouseMoveEvent(e) {
    const { currentTarget: target } = e;

    const rect = target.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  $(".body-container").on("mousemove", function (e) {
    handleMouseMoveEvent(e);
  });

  function getCard(withNewCode = false) {
    try {
      if (!code) throw new Error("Please enter valid code!");

      $.ajax({
        method: "GET",
        url: `http://www.hyeumine.com/getcard.php?bcode=${code}`,
        success: function (data, _) {
          data = JSON.parse(data);
          current_card = data;

          if (!current_card) throw new Error(`Code ${code} not found!`);

          $("#game-header").html(`GAME CODE: <u>${code}</u>`);
          $("#game-token").html(`TOKEN: <u>${current_card.playcard_token}</u>`);

          if (withNewCode) {
            $("#get_card").fadeOut();
            setTimeout(() => {
              $("#show_card").fadeIn();
            }, 600);
          }

          let res = "";

          for (const letter of "BINGO") {
            res += `<div class="letter-line">
                      <span class="header-cell">${letter}</span>`;
            for (const num of current_card.card[letter]) {
              res += `<span class="cell">${num}</span>`;
            }
            res += "</div>";
          }

          $("#output").html(res);
          $(".letter-line > span:not(:first-child)").on("click", function () {
            $(this).toggleClass("clicked");
          });

          $(".cell").on("mousemove", function (e) {
            handleMouseMoveEvent(e);
          });
        },
      });
    } catch (e) {
      alert(e.message);
    }
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

  $("#open-dashboard").on("click", function () {
    window.location.href = `http://www.hyeumine.com/bingodashboard.php?bcode=${code}`;
  });
});

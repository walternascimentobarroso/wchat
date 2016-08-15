var app;
$(document).ready(function () {
    return app.init();
});
app = {
    api_key: "dc6zaTOxFJmzC",
    init: function () {
        return this.bind_events();
    },
    bind_events: function () {
        return $(document).on("submit", "#chat", function (e) {
            app.send_message();
            app.move_scroll();
            return e.preventDefault();
        });
    },
    move_scroll: function () {
        $(".messages").animate({scrollTop: $(".messages")[0].scrollHeight}, 3000);
    },
    send_message: function () {
        var msg;
        msg = $(".text").val().trim();
        if (msg) {
            $(".text").val("");
            $(".messages").append("<div class='message'><div class='you'>" + msg + "</div></div>");
            return this.check(msg);
        }
    },
    ajax_request: function (msg) {
        $.ajax({
            method: "POST",
            url: "http://localhost:5000/chatterbot/api/v1.0/question",
            data: {question: msg},
            success: function (result) {
                if(result.answer === "")
                    return app.bot_post("Não entendi :'( ");
                return app.bot_post(result.answer);
            }
        });
    },
    check: function (msg) {
        var keyword;
        if (msg.substring(0, 15) === "manda um gif de") {
            keyword = msg.substring(16);
            keyword = keyword.replace(/[ ]/g, "+");
            return this.get_gif(keyword);
        } else {
            return this.ajax_request(msg);
        }
    },
    bot_post: function (msg) {
        return $(".messages").append("<div class='message'><div class='bot'>" + msg + "</div></div>");
    },
    get_gif: function (keyword) {
        return $.get("http://api.giphy.com/v1/gifs/search?q=" + keyword + "&api_key=" + this.api_key, function (data) {
            var index;
            if (data.data.length === 0) {
                return app.bot_post("Sorry I can't find any gif for that :(");
            } else {
                index = Math.floor(Math.random() * ((data.data.length - 1) - 0 + 1) + 0);
                return app.bot_post("<img src='" + data.data[index].images.fixed_height.url + "' alt='' />");
            }
        });
    }
};

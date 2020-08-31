window.onload = function () {
    responsive();
    open_url();
}
window.onresize = function () {
    responsive();
}
//webpage responsive
function responsive() {
    var header_height = document.querySelector("header").offsetHeight;
    var app_height = document.querySelector("html").clientHeight;
    var rest_height = app_height - header_height;
    document.querySelector("webview").style.height = rest_height + "px";
}

 function open_url(){

    $(document).ready(function () {


        $("#submit-form").submit(function (event) {
            event.preventDefault();
            var user_input = $(".search").val();
            var webview = $("webview");
            $(webview).attr("src", user_input);
            
            //return false;
        });
    });
 }
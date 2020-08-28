// window.onload = function(){
//     responsive();
//     open_url();
// }
// window.onresize = function(){
//     responsive();
// }
// //webpage responsive
// function responsive(){
//     var header_height = document.querySelector("header").offsetHeight;
//     var app_height = document.querySelector("html").clientHeight;
//     var rest_height = app_height - header_height;
//     document.querySelector("webview").style.height = rest_height+"px";
// }

// //open url
// function open_url(){
//     $("form").submit(function(){
//         var url = $(".search").val();
//         var webview = $("webview");
//         webview.attr("src",url);
//         return false;
//     });
// }
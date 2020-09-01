const{remote} = require('electron');
window.onload = function () {
    responsive();
    open_url();
    backward();
    forward();
    page_loader();
    download();
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

        });
    });
 }

 //page loader
 function page_loader(){
        var webview = document.querySelector("webview");
        webview.addEventListener("did-start-loading",function(){
            $(".load").addClass("loader");
        });

        webview.addEventListener("did-finish-load",function(){
            $(".load").removeClass("loader");
            display_url();
        });
 }

 //display url 
function display_url(){
        var webview = document.querySelector("webview");
        $(".search").val(webview.getURL());
}

//backward
function backward(){
    $(".back").click(function(){
        var webview = document.querySelector("webview");
        webview.goBack();
    });
}

//forward
function forward(){
    $(".forward").click(function(){
        var webview = document.querySelector("webview");
        webview.goForward();
    });
}

//download
function download(){
        var app_window = remote.getCurrentWindow();
        app_window.webContents.session.on('will-download',function(event,file_details){
            $(".file-name").html(file_details.getFilename());
            file_details.on('updated',function(event,status){
                    if(status == "progressing")
                    {
                        if(file_details.isPaused())
                        {
                            $(".progress-bar").html("Download pause please resume");
                        }
                        else{
                            var total_size = (file_details.getTotalBytes()/1024/1024).toFixed(2);
                            var download = (file_details.getReceivedBytes()/1024/1024).toFixed(2);
                            $(".file-size").html(download+"mb / "+total_size+"mb");
                            var percent = Math.floor((download*100)/total_size);
                            $(".progress-bar").css({
                                width : percent+"%"
                            });
                            $(".progress-bar").html(percent+"%");
                        }
                    }
                    else if(status == "interrupted")
                    {
                        $(".progress-bar").html("Download interrupted please retry");
                    }
            });
            file_details.once('done',function(event,status){
                    if(status == completed)
                    {
                        $(".progress-bar").html("Download complete");
                    }
                    else{
                        $(".progress-bar").html("Download failed");
                    }
            });
        });
}
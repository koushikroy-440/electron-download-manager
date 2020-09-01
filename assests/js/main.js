const{remote,shell} = require('electron');
const push = require('node-notifier');
window.onload = function () {
    responsive();
    open_url();
    backward();
    forward();
    page_loader();
    download();
    push.notify({
        title: "UPDATE NOTICE",
        message : "PLEASE UPDATE THE APP",
        sound : true 
    });
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
        app_window.on('minimize',function(){
            app_window.setProgressBar(100); 
        });
        app_window.webContents.session.on('will-download',function(event,file_details){
            // $(".file-name").html(file_details.getFilename());
            var file_name = document.createElement("span");
            file_name.className = "file-name";
            file_name.innerHTML = file_details.getFilename();
            $(".download-box").append(file_name);

            var flex_box = document.createElement("div");
            flex_box.className = "d-flex";
            $(".download-box").append(flex_box);

            var progress_box = document.createElement("div");
            progress_box.className = "progress mt-2";
            progress_box.style.width = "90%";
            flex_box.append(progress_box);

            var progress_bar = document.createElement("div");
            progress_bar.className = "progress-bar progress-bar-striped progress-bar-animated";
            progress_box.append(progress_bar);
            var progress_bar_length = document.getElementsByClassName("progress-bar").length;
            progress_bar.id = "progress-bar-"+progress_bar_length;

            var pause_icon = document.createElement("i");
            pause_icon.className = "fa fa-pause-circle";
            pause_icon.style.margin = "7px";
            pause_icon.id = "pause-"+progress_bar_length;
            flex_box.append(pause_icon);

            var close_icon = document.createElement("i");
            close_icon.className = "fa fa-times-circle";
            close_icon.style.margin = "7px";
            close_icon.id = "cancel-"+progress_bar_length;
            flex_box.append(close_icon);

            var folder_open = document.createElement("i");
            folder_open.className = "fa fa-folder-open file-location d-none";
            folder_open.style.fontSize = "20px";
            folder_open.title = "open file location";
            folder_open.id = "folder-"+progress_bar_length;
            $(".download-box").append(folder_open);

            var file_size = document.createElement("span");
            file_size.className = "file-size float-right";
            file_size.id = "file-size-"+progress_bar_length;
            $(".download-box").append(file_size);
            var br = document.createElement("br");
            $(".download-box").append(br);

            file_details.on('updated',function(event,status){
                $("#"+folder_open.id).attr("path",file_details.getSavePath());
                    if(status == "progressing")
                    {
                        if(file_details.isPaused())
                        {
                            $("#"+progress_bar.id).html("Download pause please resume");
                            $("#"+pause_icon.id).removeClass("fa fa-pause-circle");
                            $("#"+pause_icon.id).addClass("fa fa-play-circle");
                            $("#"+pause_icon.id).click(function(){
                                file_details.resume();
                            });
                            $("#"+close_icon.id).click(function(){
                                file_details.cancel();
                            });
                        }
                        else{
                            $("#"+pause_icon.id).removeClass("fa fa-play-circle");
                            $("#"+pause_icon.id).addClass("fa fa-pause-circle");
                            $("#"+pause_icon.id).click(function(){
                                file_details.pause();
                            });
                            $("#"+close_icon.id).click(function(){
                                file_details.cancel();
                            });
                            var total_size = (file_details.getTotalBytes()/1024/1024).toFixed(2);
                            var download = (file_details.getReceivedBytes()/1024/1024).toFixed(2);
                            $("#"+file_size.id).html(download+"mb / "+total_size+"mb");
                            var percent = Math.floor((download*100)/total_size);
                            $("#"+progress_bar.id).css({
                                width : percent+"%"
                            });
                            $("#"+progress_bar.id).html(percent+"%");
                        }
                    }
                    else if(status == "interrupted")
                    {
                        $("#"+progress_bar.id).html("Download interrupted please retry");
                    }
            });
            file_details.once('done',function(event,status){
                    if(status == completed)
                    {
                        $("#"+progress_bar.id).html("Download complete");
                        $("#"+folder_open.id).removeClass("d-none");
                        $("#"+folder_open.id).on("click",function(){
                            app_window.minimize();
                            var downloaded_path = $(this).attr("path");
                            shell.showItemInFolder(downloaded_path);
                        });
                    }
                    else{
                        $("#"+progress_bar.id).html("Download failed");
                    }
            });
        });
}
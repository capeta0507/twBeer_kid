var share_url = '';
var pic_code = '';

window.fbAsyncInit = function () {
    FB.init({
        appId: '594956418126262',
        cookie: true,
        xfbml: true,
        version: 'v7.0'
    });

    // FB.AppEvents.logPageView();

//    FB.getLoginStatus(function (response) { // Called after the JS SDK has been initialized.
//        statusChangeCallback(response); // Returns the login status.
//    });

};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/zh_TW/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));


function checkFbLoginStatus(response) {
    if (response.status === 'connected') {
        ProfileAPI();
    } else {
        FB.login(function (response) {
            if (response.status === 'connected') {
                ProfileAPI();
                console.log('facebook connected');
            } else {
                console.log('facebook not connected');
            }
        }, {scope: 'public_profile,email'});

    }
}


function ProfileAPI() {

    FB.api('/me', "GET", {fields: 'name,email,picture'}, function (response) {
        // document.getElementById('profile').innerHTML = JSON.stringify(response);
        var userid = response.id;
        var username = response.name;

        createSharePic(userid, username);
    });
}


function createSharePic(userid, username) {

    var base_img;

    if (getQuest == '1') {
        if (getGender == 'man') {
            base_img = '1_a';
        } else {
            base_img = '1_b';
        }
    } else {
        base_img = getQuest;
    }

//    console.log(userid);

    var photo_url = 'https://graph.facebook.com/' + userid + '/picture?type=large';
    
    //結果頁
    var cvs_result = document.getElementById("myResult");
    var result_context = cvs_result.getContext('2d');

    var result_bg = new Image();
    result_bg.onload = function () {
        result_context.drawImage(result_bg, 0, 0, 600, 315);

        var fb_pic = new Image();
        fb_pic.crossOrigin = "Anonymous"
        fb_pic.onload = function () {
            result_context.drawImage(fb_pic, 427, 48, 70, 70);

            result_context.fillStyle = "#FFF";
            result_context.textAlign = "center";
            result_context.font = "normal normal 600 10px Microsoft YaHei";
            result_context.fillText(username, 462, 131);


        }
        fb_pic.src = photo_url;

    }
    result_bg.src = 'img/share_bg/result/' + base_img + '.jpg';
    
    //分享用
    var cvs_fb = document.getElementById("cvs-fb");
    var fb_context = cvs_fb.getContext('2d');

    var fb_Share_bg = new Image();
    fb_Share_bg.onload = function () {
        fb_context.drawImage(fb_Share_bg, 0, 0, 600, 315);

        var fb_pic = new Image();
        fb_pic.crossOrigin = "Anonymous"
        fb_pic.onload = function () {
            fb_context.drawImage(fb_pic, 427, 48, 70, 70);

            fb_context.fillStyle = "#FFF";
            fb_context.textAlign = "center";
            fb_context.font = "normal normal 600 10px Microsoft YaHei";
            fb_context.fillText(username, 462, 131);

            submitForm();

        }
        fb_pic.src = photo_url;

    }
    fb_Share_bg.src = 'img/share_bg/' + base_img + '.jpg';
    
    
    

}

function submitForm() {

    var cvs_fb = document.getElementById("cvs-fb");
    //上傳
    var fbFileDataURL = cvs_fb.toDataURL('image/jpeg');

    var formData = new FormData();
    formData.append('pic_fbshare', fbFileDataURL);


    $.ajax({
        type: "POST",
        url: "API/upload_image.php",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function (response) {
            pic_code = response.code;
//            share_url = 'https://www.twbeer-classic2020.tw/demo/share.php?code=' + response.code
            share_url = 'https://www.twbeer-classic2020.tw/share.php?code=' + response.code

            $('.loading-block').fadeOut(500, function () {
                $('.result-block').fadeIn(500);
            });
//            recordPlayCount(pic_code, gender, answer);

//            alert('上傳成功');

        },
        error: function (error) {
            alert('上傳失敗');
        },
        complete: function (response) {}
    });


}



function fb_share() {
    // facebook share dialog
    FB.ui({
        method: 'share',
        href: share_url,
        hashtag: "#台灣啤酒",
    }, function (response) {
        if (response && !response.error_message) {
            alert('分享成功');
        } else {
            alert('分享至FACEBOOK失敗');
        }

    });

}

function statusChangeCallback(response) {
    //                console.log('statusChangeCallback');
    console.log(response);
    if (response.status === 'connected') {
        console.log('登入中');
//        fbLoginStatus = true;
//        $("#FB_login").hide(function () {
//            $("#FB_logout").show();
//        });

    } else {
        console.log('未登入');
//        fbLoginStatus = false;
//        $("#FB_logout").hide(function () {
//            $("#FB_login").show();
//        });
    }
}

function trackDoneQuiz(pic_code, gender, answer) {

    var data = {'pic_code': pic_code, 'gender': gender, 'q1_answer': answer};
 
    $.ajax({
        type: "POST",
        url: "API/track_Done_Quiz.php",
        data: data,
        dataType: 'json',
        success: function (response) {
            if (response.status == 1) {
                console.log('紀錄成功');
            } else {
                console.log(response.msg);
            }
        },
        error: function (error) {
            console.log('紀錄錯誤');
        },
        complete: function (response) {
        }
    });


}

function trackFbShare(pic_code, share_status) {

    var data = {'pic_code': pic_code, 'share_status': share_status};

    $.ajax({
        type: "POST",
        url: "API/track_fb_share.php",
        data: data,
        dataType: 'json',
        success: function (response) {
            if (response.status == 1) {
                console.log('紀錄成功');
            } else {
                console.log(response.msg);
            }
        },
        error: function (error) {
            console.log('紀錄錯誤');
        },
        complete: function (response) {
        }
    });

}

//track
function trackVoiceClick(no) {

    var data = {'no': no};

    $.ajax({
        type: "POST",
        url: "API/track_voice_click.php",
        data: data,
        dataType: 'json',
        success: function (response) {
            if (response.status == 1) {
                console.log('紀錄成功');
            } else {
                console.log(response.msg);
            }
        },
        error: function (error) {
            console.log('紀錄錯誤');
        },
        complete: function (response) {
        }
    });

}


function trackStartQuiz() {

    var data = {};

    $.ajax({
        type: "POST",
        url: "API/track_start_Quiz.php",
        data: data,
        dataType: 'json',
        success: function (response) {
            if (response.status == 1) {
                console.log('紀錄成功');
            } else {
                console.log(response.msg);
            }
        },
        error: function (error) {
            console.log('紀錄錯誤');
        },
        complete: function (response) {
        }
    });

}



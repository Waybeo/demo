$(document).ready(function () {
    var telInput = $("#normalMobile");
    $.get("http://ipinfo.io", function (response) {
        telInput.intlTelInput({
            defaultCountry: response.country.toLowerCase()
        });
    }, "jsonp");

    /*Loading screen Timer js*/

    var timerlimit = 5;
    var interval = setInterval(function () {
        timerlimit--;
        if (timerlimit) {
            $(".timermsg").html(timerlimit);
        } else {
            $('.loadingmsg').html('Now, try to close this window');
            $('.exitwatch').css('display', 'inherit');
            clearInterval(interval);
        }
    }, 1000);

    //Init exitintent
    Waybeo.CTC.Init({
        exitIntent: {
            aggressive: true,
            timer: 5,
            trigger: showExitPopup
        }
    });
    $('.wbf-close').click(function () {
        $('.wbf-screen').removeClass('active');
        $('.wbf-window').removeClass('active');
        $('.wbf-actions').addClass('active');
        $('.retrybutton').css('display', 'inherit');
        $('.wbf-container').removeClass('active').delay('600').queue(function () {
            $.dequeue(this);
            clearStatusExit();
            if (timer) {
                timer = null;
            }
        });
    });

    $('#normalCallMe').click(function () {
        var _phone = $.trim($("#normalMobile").val()).replace('+', '').replace(' ', '');
        makecall(_phone);
        $('.wbf-container').addClass('connecting');
    });

});

function showExitPopup() {
    console.log('hai');
    //Trigger for abandoned visitor popup
    $('.wbf-screen').addClass('active');
    $('.wbf-container').addClass('active');
}

function clearStatusExit() {
    $('.wbf-container').removeClass('connecting')
            .removeClass('connected')
            .removeClass('verifying')
            .removeClass('verification-success')
            .removeClass('failed')
            .removeClass('in-progress')
            .removeClass('completed')
            .removeClass('ended')
            .removeClass('agent-busy')
            .removeClass('oops')
            .removeClass('timer');
}

Waybeo.CTC.Init({
    hash: '55a650a2c572d'
});

function makecall(_phone) {
    Waybeo.CTC.MakeCall({
        'hash': '55a650a2c572d',
        'route_hash': '55a64035e22c0',
        'callerid_hash': '55a650a2c7f4a',
        'contact_number': _phone
    }, eventCallBack);
}

var captcha = '', timer = '';
function eventCallBack(event, data) {
    clearStatusExit();
    switch (event) {
        case 'CAPTCHA':
            captcha = data.code;
            $('.wbf-container').addClass('connecting');
            break;
        case 'ORIGINATE_ERROR':
            $('.wbf-container').addClass('wbf-livemsg-oops');
            break;
        case 'DIALING':
            $('.wbf-container').addClass('connected');
            break;
        case 'VERIFICATION_IN_PROGRESS':
            $('.wbf-container').addClass('verifying');
            $('.wbf-verificationcode').text(captcha);
            break;
        case 'VERIFIED':
            $('.wbf-container').addClass('verification-success');
            setTimeout(function () {
                $('.wbf-container').removeClass('verification-success');
                $('.wbf-container').addClass('in-progress');
            }, 1000);
            setStatusTimer();
            break;
        case 'AGENT_BUSY':
            $('.wbf-container').addClass('agent-busy');
            break;
        case 'INPROGRESS':
            $('.wbf-container').addClass('in-progress');
            setStatusTimer();
            break;
        case 'COMPLETED':
            $('.wbf-container').addClass('completed');
            clearInterval(timer);
            break;
        default:
            $('.wbf-container').addClass('in-progress');
            break;
    }
}

function setStatusTimer() {
    if (!timer) {
        var statusTime = 0;
        timer = setInterval(function () {
            statusTime++;
            var sec = statusTime % 60;
            var min = Math.floor(statusTime / 60);
            var hour = Math.floor(min / 60);
            min = min % 60;
            if (!Math.floor(sec / 10))
                sec = '0' + sec;
            if (!Math.floor(min / 10))
                min = '0' + min;
            if (!Math.floor(hour / 10))
                hour = '0' + hour;
            $('.timer').text(hour + ':' + min + ':' + sec)
        }, 1000);
    }
}

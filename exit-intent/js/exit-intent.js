$(document).ready(function () {
    var telInput = $("#exitMobile");
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
            //Init exitintent
            Waybeo.CTC.Init({
                exitIntent: {
                    aggressive: true,
                    timer: 0,
                    trigger: showExitPopup
                }
            });
        }
    }, 1000);

    $('#reset').click(function () {
        $('#status').removebounzd();
        $('#name, #phone, #email').val(' ');
    });

    $('.wbp-actions .yesconnect').click(function () {
        $(this).parent().removeClass('active');
        $('.wbp-window').addClass('active');
    });
    $('.wbp-actions .noconnect').click(function () {
        $('.wbp-screen').removeClass('active');
        $('.wbp-container').removeClass('active');
        $('.wbp-window').removeClass('active');
        $('.wbp-actions').addClass('active');
        $('.retrybutton').css('display', 'inherit');
        $('.wbp-container').removeClass('active').delay('600').queue(function () {
            $.dequeue(this);
            clearStatusExit();
        });
    });
    $('.wbp-close').click(function () {
        $('.wbp-screen').removeClass('active');
        $('.wbp-window').removeClass('active');
        $('.wbp-actions').addClass('active');
        $('.retrybutton').css('display', 'inherit');
        $('.wbp-container').removeClass('active').delay('600').queue(function () {
            $.dequeue(this);
            clearStatusExit();
            if (timer) {
                timer = null;
            }
        });
    });

    $('#exitCallMe').click(function () {
	    var _phone = $.trim($("#exitMobile").val()).replace('+', '').replace(' ', '');
		makecall(_phone);
	    $('.wbp-container').addClass('connecting');
    });

});

function showExitPopup() {
    //Trigger for abandoned visitor popup
    $('.wbp-screen').addClass('active');
    $('.wbp-container').addClass('active');
}

function clearStatusExit() {
    $('.wbp-container').removeClass('connecting')
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
    hash: '5587b29fa3c7b'
});

function makecall(_phone) {
    Waybeo.CTC.MakeCall({
        'hash': '5587b29fa3c7b',
        'route_hash': 'nit22331thin123',
        'callerid_hash': '5587b29fc3e29',
        'contact_number': _phone
    }, eventCallBack);
}

var captcha = '', timer = '';
function eventCallBack(event, data) {
    clearStatusExit();
    switch (event) {
        case 'CAPTCHA':
            captcha = data.code;
            $('.wbp-container').addClass('connecting');
            break;
        case 'ORIGINATE_ERROR':
            $('.wbp-container').addClass('wbp-livemsg-oops');
            break;
        case 'DIALING':
            $('.wbp-container').addClass('connected');
            break;
        case 'VERIFICATION_IN_PROGRESS':
            $('.wbp-container').addClass('verifying');
            $('.wbp-verificationcode').text(captcha);
            break;
        case 'VERIFIED':
            $('.wbp-container').addClass('verification-success');
            setTimeout(function () {
                $('.wbp-container').removeClass('verification-success');
                $('.wbp-container').addClass('in-progress');
            }, 1000);
            setStatusTimer();
            break;
        case 'AGENT_BUSY':
            $('.wbp-container').addClass('agent-busy');
            break;
        case 'INPROGRESS':
            $('.wbp-container').addClass('in-progress');
            setStatusTimer();
            break;
        case 'COMPLETED':
            $('.wbp-container').addClass('completed');
            clearInterval(timer);
            break;
        default:
            $('.wbp-container').addClass('in-progress');
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

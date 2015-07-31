$(document).ready(function () {
    var telInput = $("#timerMobile");
    $.get("http://ipinfo.io", function (response) {
        telInput.intlTelInput({
            defaultCountry: response.country.toLowerCase()
        });
    }, "jsonp");
    $('.themeselector').change(function () {
        $('.themeselector option').each(function () {
            $('.wbpb-container').removeClass($(this).val());
        });
        $('.wbpb-container').addClass($(this).val());
    }).trigger("change");

    /*Loading screen Timer js*/
    var timerlimit = 5;
    var interval = setInterval(function () {
        timerlimit--;
        if (timerlimit) {
            $(".timermsg").html(timerlimit);
        } else {
            $('.wbpb-mastercontainer').addClass('active');
            $('.wbpb-container').addClass('active');
            $('.loadingmsg').html('Loaded');
            $('.retrybutton').css('display', 'inherit');
            clearInterval(interval);
        }
    }, 1000);
    $('#reset').click(function () {
        $('#status').removebounzd();
        $('#name, #phone, #email').val(' ');
    });
    $('.wbpb-close').click(function () {
        $('.wbpb-container').removeClass('active').delay('600').parent().removeClass('active').queue(function () {
            $.dequeue(this);
            clearStatusbottom();
            if (timer) {
                timer = null;
            }
        });
    });
    $('#reset').click(function () {
        $('#status').removebounzd();
        $('#name, #phone, #email').val(' ');
    });
    $('#timerCallMe').click(function () {
        var _phone = $.trim($("#timerMobile").val()).replace('+', '').replace(' ', '');
        makecall(_phone);
        $('.wbpb-container').addClass('connecting');
    });
});

function clearStatusbottom() {
    $('.wbpb-container').removeClass('connecting')
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
    clearStatusbottom();
    switch (event) {
        case 'CAPTCHA':
            captcha = data.code;
            $('.wbpb-container').addClass('connecting');
            break;
        case 'ORIGINATE_ERROR':
            $('.wbpb-container').addClass('wbpb-livemsg-oops');
            break;
        case 'DIALING':
            $('.wbpb-container').addClass('connected');
            break;
        case 'VERIFICATION_IN_PROGRESS':
            $('.wbpb-container').addClass('verifying');
            $('.wbpb-verificationcode').text(captcha);
            break;
        case 'VERIFIED':
            $('.wbpb-container').addClass('verification-success');
            setTimeout(function () {
                $('.wbpb-container').removeClass('verification-success');
                $('.wbpb-container').addClass('in-progress');
            }, 1000);
            setStatusTimer();
            break;
        case 'AGENT_BUSY':
            $('.wbpb-container').addClass('agent-busy');
            break;
        case 'INPROGRESS':
            $('.wbpb-container').addClass('in-progress');
            setStatusTimer();
            break;
        case 'COMPLETED':
            $('.wbpb-container').addClass('completed');
            clearInterval(timer);
            break;
        case 'ERROR':
            $('.wbf-container').addClass('oops');
            clearInterval(timer);
            break;
        default:
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

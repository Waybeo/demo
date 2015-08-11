$(document).ready(function () {
    var telInput = $("#hellobarMobile");
    $.get("http://ipinfo.io", function (response) {
        telInput.intlTelInput({
            defaultCountry: response.country.toLowerCase()
        });
    }, "jsonp");
    $('.themeselector').change(function () {
        $('.themeselector option').each(function () {
            $('.wbh-container').removeClass($(this).val());
        });
        $('.wbh-container').addClass($(this).val());
    }).trigger("change");
    $('#reset').click(function () {
        $('#status').removebounzd();
        $('#name, #phone, #email').val(' ');
    });
    $('.clickmehello').click(function () {
        $('.wbh-container').addClass('active');
    });
    $('.wbh-close').click(function () {
        $('.wbh-container').removeClass('active').delay(300).queue(function () {
            $.dequeue(this);
            if (timer) {
                timer = null;
            }
            clearStatusHead();
        });
    });
    $('#hellobarCallMe').click(function () {
        var _phone = $.trim($("#hellobarMobile").val()).replace('+', '').replace(' ', '');
        makecall(_phone);
        $('.wbh-container').addClass('connecting');
    });
});

function clearStatusHead() {
    $('.wbh-container').removeClass('connecting')
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
    hash: '55a650a2c572d',
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
    console.log(event);
    clearStatusHead();
    switch (event) {
        case 'CAPTCHA':
            captcha = data.code;
            $('.wbh-container').addClass('connecting');
            break;
        case 'ORIGINATE_ERROR':
            $('.wbh-container').addClass('wbh-livemsg-oops');
            break;
        case 'DIALING':
            $('.wbh-container').addClass('connected');
            break;
        case 'VERIFICATION_IN_PROGRESS':
            $('.wbh-container').addClass('verifying');
            $('.wbh-verificationcode').text(captcha);
            break;
        case 'VERIFIED':
            $('.wbh-container').addClass('verification-success');
            setTimeout(function () {
                $('.wbh-container').removeClass('verification-success');
                $('.wbh-container').addClass('in-progress');
            }, 1000);
            setStatusTimer();
            break;
        case 'AGENT_BUSY':
            $('.wbh-container').addClass('agent-busy');
            break;
        case 'INPROGRESS':
            $('.wbh-container').addClass('in-progress');
            setStatusTimer();
            break;
        case 'COMPLETED':
            $('.wbh-container').addClass('completed');
            clearInterval(timer);
            break;
        case 'VALIDATION_ERROR':
            if (data.errorCode && data.errorCode == 902) {
                $('.wbh-formerror').show();
            }
            clearInterval(timer);
            break;
        case 'ORIGINATE_ERROR':
            $('.wbh-container').addClass('oops');
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

$(document).ready(function () {
    var telInput = $("#slideoutMobile");
    $.get("http://ipinfo.io", function (response) {
        telInput.intlTelInput({
            defaultCountry: response.country.toLowerCase()
        });
    }, "jsonp");

    $('.themeselector').change(function () {
        $('.themeselector option').each(function () {
            $('.wbs-container').removeClass($(this).val());
        });
        $('.wbs-container').addClass($(this).val());
    }).trigger("change");
    $('#reset').click(function () {
        $('#status').removebounzd();
        $('#name, #phone, #email').val(' ');
    });

    $('.wbs-switch').click(function () {
        $('.wbs-container').toggleClass('active');
        if (!$('.wbs-container').hasClass('active')) {
            $(this).delay(300).queue(function () {
                $.dequeue(this);
                clearStatusSlide();
                if (timer) {
                    timer = null;
                }
            });
        }
    });

    $('#slideoutCallMe').click(function () {
        makecall();
    });

});

function clearStatusSlide() {
    $('.wbs-container').removeClass('connecting')
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

function makecall() {
    var optionValue = $("#wctcprojectId").val();
    if (optionValue == "Location X") {
        var dynamicRoute = '55a674991948b';
    } else if (optionValue == "Location Y") {
        var dynamicRoute = '55a674c7d02ce';
    } else {
        var dynamicRoute = '';
    }
    var _phone = $.trim($("#slideoutMobile").val()).replace('+', '').replace(' ', '');
    Waybeo.CTC.MakeCall({
        'hash': '55a650a2c572d',
        'route_hash': dynamicRoute,
        'callerid_hash': '55a650a2c7f4a',
        'contact_number': _phone,
        'optional_params': {
            "Name": $("#wctcname").val(),
            "Email": $("#wctcemail").val(),
            "Project": $("#wctcprojectId").val()

        }

    }, eventCallBack);
    $('.wbs-container').addClass('connecting');
}

var captcha = '', timer = '';
function eventCallBack(event, data) {
    clearStatusSlide();
    switch (event) {
        case 'CAPTCHA':
            captcha = data.code;
            $('.wbs-container').addClass('connecting');
            break;
        case 'ORIGINATE_ERROR':
            $('.wbs-container').addClass('wbs-livemsg-oops');
            break;
        case 'DIALING':
            $('.wbs-container').addClass('connected');
            break;
        case 'VERIFICATION_IN_PROGRESS':
            $('.wbs-container').addClass('verifying');
            $('.wbs-verificationcode').text(captcha);
            break;
        case 'VERIFIED':
            $('.wbs-container').addClass('verification-success');
            setTimeout(function () {
                $('.wbs-container').removeClass('verification-success');
                $('.wbs-container').addClass('in-progress');
            }, 1000);
            setStatusTimer();
            break;
        case 'AGENT_BUSY':
            $('.wbs-container').addClass('agent-busy');
            break;
        case 'INPROGRESS':
            $('.wbs-container').addClass('in-progress');
            setStatusTimer();
            break;
        case 'COMPLETED':
            $('.wbs-container').addClass('completed');
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

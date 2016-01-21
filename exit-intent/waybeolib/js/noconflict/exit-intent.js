//Init Form fields
(function($) {
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

        $('#normalCallMe').click(function () {
            var _phone = $.trim($("#normalMobile").val()).replace('+', '').replace(' ', '');
            $('.wbp-container').addClass('connecting');
            makecallExit(_phone);
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
        hash: '55a650a2c572d'
    });

    function makecallExit(_phone) {
        Waybeo.CTC.MakeCall({
            'hash': '55a650a2c572d',
            'route_hash': '55a64035e22c0',
            'callerid_hash': '55a650a2c7f4a',
            'contact_number': _phone
        }, eventCallBackExit);
    }

    var captcha = '', timer = '';
    function eventCallBackExit(event, data) {
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
            case 'VALIDATION_ERROR':
                if (data.errorCode && data.errorCode == 902) {
                    $('.wbp-formerror').show();
                }
                clearInterval(timer);
                break;
            case 'ORIGINATE_ERROR':
                $('.wbp-container').addClass('oops');
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
})(jq191);
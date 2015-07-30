Read Me


================================


For testing the examples with actual calls, you need to edit hellobar.js file and replace xxxxxx with actual values for the following variables. 

To get the actual values, login to apps.waybeo.com and check your campaign configurations.



Waybeo.CTC.Init({
    hash: 'xxxxxxxxxxxxxxxxxx'
});

function makecall() {
    var _phone = $.trim($("#mobile").val()).replace('+', '').replace(' ', '');
    Waybeo.CTC.MakeCall({
        'hash': 'xxxxxxxxxxxxxxxxxx',
        'route_hash': 'xxxxxxxxxxxxxxxxxx',
        'callerid_hash': 'xxxxxxxxxxxxxxxxxx',
        'contact_number': _phone
    }, eventCallBack);
    $('.wbp-container').addClass('connecting');
}



Contact Waybeo Support for any queries you may have. 

Waybeo Inc.



$(document).ready(function() {
    
// document.getElementById('thefield').value = 'value';

// $('#textarea1').keyup(function() {
 //   $('#textarea2').val( $('#textarea1').val() );
// });


    

 //$('#redeemFromBtn').submit(function(e) {
 //   e.preventDefault();
 //
 //   e.stopImmediatePropagation();
 // 
 //  TXAjax();
 ////    $('#contractfields').unbind('submit');
 // });
 //

function TXAjax() {
  
	  var TXLoad = [];
      var TX = "";
  TXLoad[0] = redeem.addr;
 // TXLoad[1] =


  doTXAjax(TXLoad);					
 
 
	function doTXAjax(txLoad) {
		
		var jsn, ajax;
					
	    jsn = JSON.stringify(txLoad);
 	
		//object = JSON.stringify({first: 'obj_item1', second: 'obj_item2', third: 'obj_item3'});
		//			
		////Pass the values to the AJAX request and specify function arg for 'done' callback
		ajax = theTXAjax(jsn);
		ajax.done(processReturnTX);
		ajax.fail(function( jqXHR, textStatus, errorThrown) {
				//Output error information
		});
    }
    
function theTXAjax(jsn) { console.log(jsn);
  	return $.ajax({

      url: 'https://checkabid.com/btc/tx.php',
      beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("Token"));
                console.log(localStorage.getItem("Token"));
            },
 //  contentType: 'application/json',
 //  dataType: 'json',
    processTakeURLData: false,
	 data: jsn,
// data: JSON.stringify(urls),
//    data: { js_array: arr },
	  type: "POST",
	  cache: false,
      error: function(xhr, desc, err) {
    },
	  success: function(msg) {
//   console.log("got it done!");
	  }
    }); // end $.ajax return call
}         // end of theAjax
}   // end of Ajax()
 
	function processReturnTX(returnedstuff /*}textStatus, jqXHR*/) {
// console.log(returnedstuff);
//  var response = returnedstuff;
var response = JSON.parse(returnedstuff);
//	console.log("this here is the JSONparsed response:");
// console.log(response);
if (response.noMatch == true) {
  Swal.fire({
  position: 'center',
  type: 'warning',
  title: 'This redeem script has no history in this sytem. Please start a new transaction from scratch or process it elsewhere!',
  showConfirmButton: false,
  timer: 1500
});
$('#newTransaction').removeClass('show').addClass('hidden').fadeOut();
}
if (response.noDeal == true) {
  Swal.fire({
  position: 'center',
  type: 'warning',
  title: 'The contract (Meeting of the minds/checksums) is missing. Please start a new contract from scratch or process it elsewhere!',
  showConfirmButton: false,
  timer: 1500
});
$('#newTransaction').removeClass('show').addClass('hidden').fadeOut();
}
if (response.concluded == true) {
  Swal.fire({
  position: 'center',
  type: 'warning',
  title: 'This transaction has been concluded and is final. There is no more you can do with this redeem script.',
  showConfirmButton: false,
  timer: 1500
});
$('#newTransaction').removeClass('show').addClass('hidden').fadeOut();
}

    }
});

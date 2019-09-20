$(document).ready(function() {
    
// document.getElementById('thefield').value = 'value';

// $('#textarea1').keyup(function() {
 //   $('#textarea2').val( $('#textarea1').val() );
// });





 $('#contractfields').submit(function(e) {
    e.preventDefault();

    e.stopImmediatePropagation();
  
    sigsAjax();
 //    $('#contractfields').unbind('submit');
 });
 

function sigsAjax() {
// console.log(offer);
// Get everything necessary:
// Signed TX
// MSaddress / Redeem.addr ?



  
	  var sigsLoad = [];
      var sig = "";
      


  doSigAjax(sigsLoad);					
 

 
 
	function doSigAjax(sigsLoad) {
		
		
		var jsn, ajax;
					
	    jsn = JSON.stringify(sigsLoad);
  
	
		//object = JSON.stringify({first: 'obj_item1', second: 'obj_item2', third: 'obj_item3'});
		//			
		////Pass the values to the AJAX request and specify function arg for 'done' callback
		ajax = theSigAjax(jsn);
		ajax.done(processReturnSigs);
		ajax.fail(function( jqXHR, textStatus, errorThrown) {
				//Output error information
		});
    }
    
function theSigAjax(jsn) { console.log(jsn);
  	return $.ajax({

      url: 'https://checkabid.com/btc/sigs.php',
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
 
	function processReturnSigs(returnedstuff /*}textStatus, jqXHR*/) {
// console.log(returnedstuff);
//  var response = returnedstuff;
var response = JSON.parse(returnedstuff);
//	console.log("this here is the JSONparsed response:");
// console.log(response);
if (response.noMatch == true) {
  Swal.fire({
  position: 'center',
  type: 'warning',
  title: 'Checksums don\'t match! Please try again and/or talk to your counterparty!',
  showConfirmButton: false,
  timer: 1500
});
$('#newTransaction').removeClass('show').addClass('hidden').fadeOut();
}   
offer2Area = response.data.offerData;
offer2Checksum = response.data.checksumData;
// console.log(offer2Area);
 if (offer2Area)  {$('#offer2Area').val(offer2Area);}
 if (offer2Checksum)  {$('#checksum2').val(offer2Checksum);}

// if (($('#checksum2').val()) == ($('#checksum1').val())) {
//  $('#Agreement').removeClass('hidden').show();
// }
if (($('#checksum2').val()) == ($('#checksum1').val())) {
  Swal.fire({
  type: 'success',
  title: 'CheckSums are a Match! Both contract parties are now in agreement. Please continue below:',
  showConfirmButton: false,
  timer: 1500
});
$('#newTransaction').removeClass('hidden').show();
}        
// Example only:
// if (badWurst === true) {Swal("The eBay item URL wasn't accepted by the server!\nPlease check the page you're submitting this off of! Then try again!")}
// if (badSenf === true) {alert("Die URL-Addresse des Senfes wurde vom Server nicht akzeptiert!\nBitte korrigieren Sie und dann versuchen Sie's nochmal!")}

    }
});

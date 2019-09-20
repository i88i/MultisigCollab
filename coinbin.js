$(document).ready(function() {

if (!window.indexedDB) {
	alert("IndexedDB is not supported! Sorry, your browser is too old! Some features are not supported!");
}

// localforage.clear()

//  how to update single array element:
//  localforage.getItem(MSstring).then(function (item) {
//  item[3] = offer;
//  localforage.setItem(MSstring, item );
//  });
var oldOffer = "";



  localforage.keys().then(function (keys)  {

  var oldMSigs = $('#oldMSigs');
  oldMSigs.html('');

  for (var i = 0; i < keys.length; i++) {
    oldMSigs.append('<label>&nbsp &nbsp<input type="radio" name="keys" value="' + keys[i] + '" /> ' + keys[i] + '</label>');
  }
 }).catch(function(err) {
     console.log(err);
}); 
  


$('#changeMS').val("");                     
$('#oldMSigs').on('change', 'input', function() {
  var elem = $(this);
  if (elem.is(':checked')) {
$('#changeMS').val(elem.val());

  }
});
var MSstring = "";
var MSarray = [];
var RedeemScript = "";

$("#oldMSbutton").on('click', function() {
	MSstring = $('#changeMS').val();
	MSrehab(MSstring);
 });

 //$(".show_hide_unfinished").click(function() {
 //    $("#unfinishedMS").toggle()
 // });
 
 
 $(".show_hide_initiation").click(function() {
    // $("#initiation").toggle();

 $("#initiation").removeClass ('hidden').addClass('show').fadeIn();
  $('#verifyR').removeClass('show').addClass('hidden').fadeOut();
  $('#contract').removeClass('show').addClass('hidden').fadeOut();
  $('#newTransaction').removeClass('show').addClass('hidden').fadeOut();
  $('#verifyTX').removeClass('show').addClass('hidden').fadeOut();
  $('#sign').removeClass('show').addClass('hidden').fadeOut();
  $('#verifySig').removeClass('show').addClass('hidden').fadeOut();
  $('#sign1').removeClass('show').addClass('hidden').fadeOut();
  $('#broadcast').removeClass('show').addClass('hidden').fadeOut();
});



function MSrehab(MSstring)  {
	localforage.getItem(MSstring).then(function(value) {
 oldJWT = value[0];
 oldMSredeem = value[1];
 oldOffer = value[2];
 console.log(oldJWT);
 console.log(oldMSredeem);
 oldMSaddress = MSstring;
 MSaddress = oldMSaddress;
 localStorage.setItem('Token', oldJWT);
 localStorage.setItem('MSaddress', oldMSaddress);
 localStorage.setItem('MSredeem', oldMSredeem);
 RedeemScript = oldMSredeem;
 $("#initiation").removeClass('show').addClass('hidden').fadeOut();
 	$("#verifyRScript").val("");
 localforage.getItem(MSstring).then(function(value) { oldOffer = value[2];
	$('#offer1Area').val(oldOffer);
										});
//	$('#offer2Area').val("(Please click Submit to get the current offer!)");
  
 
 $("#verifyR").removeClass ('hidden').addClass('show').fadeIn(); 
 window.location = "#verifyR";
 decodeRedeemScript();
 $("#nullData").val("");
 $('#newTransaction').removeClass('show').addClass('hidden').fadeOut();
 
}).catch(function(err) {
    console.log(err);
});
	

}  // end MSrehab


	/* new -> address code */

	if($("#newKeysBtn").is(":checked")){
		// check if something is in local storage.
		if(localStorage && localStorage.getItem('newBitcoinAddress')){
			$("#newPubKey2").val("");   //////////////////////////////////////////////////////
			$("#newPubKey3").val("");
//			$("#verifyScript").val("");
//			console.log(localStorage.getItem('newBitcoinAddress'));
			$("#newBitcoinAddress").val(localStorage.getItem('newBitcoinAddress'));
//			$("#newPubKey, #newPubKey2").val(localStorage.getItem('newPubKey'));
            $("#newPubKey, #newPubKey1").val(localStorage.getItem('newPubKey'));
			$("#newPrivKey").val(localStorage.getItem('newPrivKey'));
		} else {		
		// if nothing is in local storage:
		coinjs.compressed = true;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
		var s = ($("#newBrainwallet").is(":checked")) ? $("#brainwallet").val() : null;
		var coin = coinjs.newKeys(s);
		$("#newPubKey2").val("");   //////////////////////////////////////////////////////
		$("#newPubKey3").val("");
		$("#verifyRScript").val("");
		$("#newBitcoinAddress").val(coin.address);
//		$("#newPubKey2").closest("div").find("label").css({"color": "red", "border": "2px solid red"});
//		$("#newPubKey2").closest("label").remove();

		$("#newPubKey, #newPubKey1").attr("title", "YOUR OWN Public Key").val(coin.pubkey); ///////////// creates Tooltip
//		$("#newPubKey, #newPubKey2").attr("title", "YOUR OWN Public Key").val(coin.pubkey).prev().append("This is your label");

		$("#newPrivKey").val(coin.wif);
		
		var nBA = $("#newBitcoinAddress").val();
		var nPK = $("#newPubKey").val();
	//	console.log(nPK);
		var nPrivK= "(It's irretrievably gone! You saved this elsewhere as we urged you to. If you haven't, you're going to have to start from scratch and reset your keys:)";

		// then store them in local storage (except PrivKey)
		localStorage.setItem('newBitcoinAddress', nBA);
		localStorage.setItem('newPubKey', nPK);
		// get token, store party
	var payload = [];
	payload[0] = localStorage.getItem("newPubKey");

	
		localStorage.setItem('newPrivKey', nPrivK);
		}
		
	$('#checksum2').val("");
	$('#offer2Area').val("");
	$("#redeemFrom").val("");
	};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	

	/* new -> multisig code */
   function newMultiSigAddress()  {
	
//	$("#newMultiSigAddress").click(function(){                          //////////////// Submit button made into function instead

		$("#multiSigData").removeClass('show').addClass('hidden').fadeOut();
		$("#multisigPubKeys .pubkey").parent().removeClass('has-error');
		$("#releaseCoins").parent().removeClass('has-error');
		$("#multiSigErrorMsg").hide();

		if((isNaN($("#releaseCoins option:selected").html())) || ((!isNaN($("#releaseCoins option:selected").html())) && ($("#releaseCoins option:selected").html()>$("#multisigPubKeys .pubkey").length || $("#releaseCoins option:selected").html()*1<=0 || $("#releaseCoins option:selected").html()*1>8))){
			$("#releaseCoins").parent().addClass('has-error');
			$("#multiSigErrorMsg").html('<span class="glyphicon glyphicon-exclamation-sign"></span> Minimum signatures required is greater than the amount of public keys provided').fadeIn();
			return false;
		}

		var keys = [];                                                          // These will be the keys for multisig
		
		
		$.each($("#multisigPubKeys .pubkey"), function(i,o){
			if(coinjs.pubkeydecompress($(o).val())){
				keys.push($(o).val());                                          // it scrolls through to push the keys
				$(o).parent().removeClass('has-error');
			} else {
				$(o).parent().addClass('has-error');
			}

		});
		
		////// build second part of json array, to be merged later ///////////////////////////////////////
///////////////////////	MSaddress, MSredeem    ////////////////////////////////////////////
		
		
		
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//					    console.log(keys);
////// validating set of 3:
	//	keys = $.unique(keys);
		function hasDuplicates(keys) {
    return (new Set(keys)).size !== keys.length;
}
		if (keys.length<3 || hasDuplicates(keys))  {	
		
			$("#releaseCoins").parent().addClass('has-error');
			$("#multiSigErrorMsg").html('<span class="glyphicon glyphicon-exclamation-sign"></span> Error: There must be three public keys and they must be valid and unique! Please check your entry!').fadeIn();
			return false;
		}
			
						
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

		if(($("#multisigPubKeys .pubkey").parent().hasClass('has-error')==false) && $("#releaseCoins").parent().hasClass('has-error')==false){
//			var sigsNeeded = $("#releaseCoins option:selected").html();
			var sigsNeeded = 2;   ///////////////////////////////////////////////////////////////////
			var multisig =  coinjs.pubkeys2MultisigAddress(keys, sigsNeeded);      // This takes the keys and submits them for processing
			$("#multiSigData .address").val(multisig['address']);
			var MSaddress = ($("#multiSigData .address").val());
			localStorage.setItem('MSaddress', MSaddress);  //////////////////////////////////////////
				//				var nBA = $("#newBitcoinAddress").val();
            $("#verifyR").removeClass ('hidden').addClass('show').fadeIn(); 
			$("#multiSigData .script").val(multisig['redeemScript']);
			
			var MSredeem = ($("#multiSigData .script").val());

			$("#multiSigData .scriptUrl").val(document.location.origin+''+document.location.pathname+'?verify='+multisig['redeemScript']+'#verifyR');
			//   $("#multiSigData").removeClass('hidden').addClass('show').fadeIn(); // Removed, so the green area won't show up anymore
			$("#releaseCoins").removeClass('has-error');
		} else {
			$("#multiSigErrorMsg").html('<span class="glyphicon glyphicon-exclamation-sign"></span> Error: One or more public keys are missing or invalid!').fadeIn();
		}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	////////////////////////////////////     Assemble and Submit JSON here:

//	console.log(keys[0]);
//	console.log(keys[1]);
//	console.log(keys[2]);
	
						    keys[3] = MSaddress;
							keys[4] = MSredeem;
//	console.log(keys[3]);  // jot
//	console.log(keys[4]);				
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////         Construct offer in DB after Collab is confirmed/returned. Then show offer areas.
// if (!localStorage.getItem("Token"))						
//	{ doAjax(); }

	doAjax();

	function doAjax() {
		
		
		var array, ajax;
					
		
          array = JSON.stringify(keys);
//		 console.log(array);  // this is what is being sent out
	
		ajax = collabsAjax(array);
		
		ajax.done(processData);
		ajax.fail(function( jqXHR, textStatus, errorThrown) {
				//Output error information
		});
	
}


function collabsAjax(arr) {
	return $.ajax({
      url: 'https://checkabid.com/btc/collabs.php',
	  //	  crossorigin: 'anonymous',
      type: 'POST',
   //    contentType: 'application/json',
     dataType: 'json',
  processData: false,
	data: arr,
//  data: JSON.stringify(keys),
   //  data: { js_array: arr },
	  cache: false,
      error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      },
  success: function(msg) {
//     console.log(msg);
	  }
    }); // end ajax call
	
}		
// This takes care of data once returned from Server:
	function processData(returnedstuff) {
 //  console.log(returnedstuff);
	var response = returnedstuff;
	
	var JWT = response.data.jwt;
		if (JWT) {
			localStorage.setItem("Token", JWT);
				}
//	var response = JSON.parse(returnedstuff);
//	console.log("this here is the JSONparsed response:");
//   console.log(response);



	
	if(response.newEntry) {
			// use MSredeem from above, and process through Verify form;
//					console.log("this here is the original, unreturned MSredeem:");
//  console.log(MSredeem);
//					console.log("this here is the original, unreturned MSaddress:");
//  console.log(MSaddress);
AddressMS = MSaddress;
RedeemScript = MSredeem;

if (JWT) {
	MSarray = [JWT, MSredeem];
	localforage.setItem(MSaddress, MSarray);
	}
$("#verifyRScript").val("");
			decodeRedeemScript();                // calls verification form result

   }
		  
		  
	if (response.newEntry == false && response.reuseError == false) {
			//take retrieved data.keyset.MSredeem, compare again with original and then process it through Verify Form;
//			console.log("this here is the returned MSredeem:");
//		console.log(response.data.keyset['MSredeem']);
//	console.log("this here is the returned MSaddress:");
//	console.log(response.data.keyset['MSaddress']);

MSredeem = response.data.keyset['MSredeem'];
RedeemScript = MSredeem;
MSaddress = response.data.keyset['MSaddress'];
AddressMS =  MSaddress;

if (JWT) {
	MSarray = [JWT, MSredeem];
	localforage.setItem(MSaddress, MSarray);
	}

$("#verifyRScript").val("");
			decodeRedeemScript();                // calls verification form result
			
    	}
		
		
	if (response.reuseError == true) {
// console.log("This would be a double entry");
$("#multiSigErrorMsg").html('<span class="glyphicon glyphicon-exclamation-sign"></span> Error: The Public Key you entered has been used before. Please correct or start over from scratch!').fadeIn();
$("#verifyRScript").val("");
RedeemScript = "Oops!! The Public Key you entered has been used before. Please correct or start from scratch.";

			decodeRedeemScript();                // calls verification form result

// Display an error message with all options.

	}
			window.location = "#verifyR";

	}	

		
////////////////////////////////////////////////////////////////////////////////////////////////////
	}   /// ends function newMultiSigAddress
		  var TXLoad = [];
		
	function TXAjax(sigOne) {
  
  RedAddr = localStorage.getItem("RedAddr")

// console.log(RedAddr);
  TXLoad[0] = RedAddr;
  if (sigOne) {TXLoad[1] = sigOne}
  
  doTXAjax(TXLoad);					
 
 	function doTXAjax(TXLoad) {
		
		var jsn, ajax;
					
	    jsn = JSON.stringify(TXLoad);
 	
		//object = JSON.stringify({first: 'obj_item1', second: 'obj_item2', third: 'obj_item3'});
		//			
		////Pass the values to the AJAX request and specify function arg for 'done' callback
		ajax = theTXAjax(jsn);
		ajax.done(processReturnTX);
		ajax.fail(function( jqXHR, textStatus, errorThrown) {
				//Output error information
		});
    }
    
function theTXAjax(jsn) { //   console.log(jsn);
  	return $.ajax({

      url: 'https://checkabid.com/btc/tx.php',
      beforeSend: function(xhr){
                xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("Token"));
  //              console.log(localStorage.getItem("Token"));
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
var Sig = response.data.Sig;
// var Checksum = response.data.Checksum;

if (Sig) {
$('#verifySig').removeClass('hidden').show();
$('#verifySigScript').val(Sig);
decodeSignatureScript();
$('#sign1').removeClass('hidden').show();
}

// if (Checksum) {
// $('#checksum2').val(Checksum);
// }

if (response.noMatch == true) {
  Swal.fire({
  position: 'center',
  type: 'warning',
  title: 'This redeem script has no history in this sytem. Please start a new transaction from scratch or process it elsewhere!',
  showConfirmButton: false,
  timer: 2500
});
$('#newTransaction').removeClass('show').addClass('hidden').fadeOut();
}
if (response.noDeal == true) {
  Swal.fire({
  position: 'center',
  type: 'warning',
  title: 'The contract (Meeting of the minds/checksums) is missing or has been changed. Please check with the other party!',
  showConfirmButton: false,
  timer: 2500
});
$('#newTransaction').removeClass('show').addClass('hidden').fadeOut();
}
if (response.concluded == true) {
  Swal.fire({
  position: 'center',
  type: 'warning',
  title: 'This transaction has been concluded and is final. There is no more you can do with this redeem script. Please refer to your own records.',
  showConfirmButton: false,
  timer: 2500
});
$('#newTransaction').removeClass('show').addClass('hidden').fadeOut();
}

    }
	
	
	$("#mediatorList").change(function(){
		var data = ($(this).val()).split(";");
		$("#mediatorPubkey").val(data[0]);
		$("#mediatorEmail").val(data[1]);
		$("#mediatorFee").val(data[2]);
	}).change();

	$("#mediatorAddKey").ready(function(){
				$("#newPubKey2").attr("title", "Mediator PubKey").val($("#mediatorPubkey").val()).fadeOut().fadeIn();
				$("#mediatorClose").click();
	});

			
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	$("#otherpartyAddKey").click(function(){
     		$("#newPubKey3").attr("title", "Your Contract Partner's PubKey").val($("#otherpartyPubkey").val()).fadeOut().fadeIn();
			$("#otherpartyClose").click();
			$("#otherpartyPubkey").val("");

			newMultiSigAddress();       // This will get the multisig stuff done plus Ajax etc....  
//			$("#pubkeyalert").fadeOut();

	});
	
	
	$("#resetKeys").ready(function(){           // reset keys
		$("#resetKeys").click(function(){
			localStorage.clear();
			location.reload();
			$('.phoenix-off').phoenix('remove');
			$('.phoenix-btc').phoenix('remove');
			$('#checksum2').val("");
			$('#offer2Area').val("");
			$("#redeemFrom").val("");
		})
	
		
//		location.reload();
	});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////	
	$("#yourownAddKey").click(function(){
		var count = 0;
		var len = $(".pubkeyRemove").length;
		if(len<14){
			$.each($("#multisigPubKeys .pubkey"),function(i,o){
				if($(o).val()==''){
					$(o).val($("#yourownPubkey").val()).fadeOut().fadeIn();
					console.log();
					$("#yourownClose").click();
					return false;
				} else if(count==len){
					$("#multisigPubKeys .pubkeyAdd").click();
					$("#yourownAddKey").click();
					return false;
				}
				count++;
			});

			$("#yourownClose").click();
		}
	});

	
	/* new -> transaction code */

$("#arbitrationFee").val("");
$("#sellerPay").val("");
// $("#buyerRefund").val("");
$("#facilitatorFee").val("");
$("#nulldataAmount").val("");
$("#Arbitrator").val("");
$("#Seller").val("");
$("#Buyer").val("");
$("#Facilitator").val("");
$("#nullData").val("");
$("#verifyTXScript").val("");
$("#verifySigScript").val("");


	$(".refundShowHide").click(function() {
	
		var newRow = '<div class="row recipient refund" id="refundRow"><div class="col-xs-4"><p><font color="green">Address of Recipient of Adjustment Amount:</font><input id="Buyer" type="text" class="form-control address" placeholder=1></div><div class="col-xs-2"><font color="green">Adjustment Amount:</font><input id="buyerRefund" type="text" class="form-control amount" value = "0.00" placeholder="0.00"></div><div class="col-xs-2">USD $:<input id="returnUSD" type="text" class="form-control amount" placeholder="0.00" readonly></div><div class="col-xs-4"></div></p></div>'
		if ($(".refund").length) {
		$(".refund").remove(); redeemFromBtn();
		} else {  $("#recipients").prepend(newRow); redeemFromBtn();
		}
	});   // toggle and run redeemFromBtn() every time



	$("#inputs .txidAdd").click(function(){                           
		var clone = '<div class="row inputs"><br>'+$(this).parent().parent().html()+'</div>';
		$("#inputs").append(clone);
		$("#inputs .txidClear:last").remove();
		$("#inputs .glyphicon-plus:last").removeClass('glyphicon-plus').addClass('glyphicon-minus');
		$("#inputs .glyphicon-minus:last").parent().removeClass('txidAdd').addClass('txidRemove');
		$("#inputs .txidRemove").unbind("");
		$("#inputs .txidRemove").click(function(){
			$(this).parent().parent().fadeOut().remove();
			totalInputAmount();
		});
		$("#inputs .row:last input").attr('disabled',false);

		$("#inputs .txIdAmount").unbind("").change(function(){
			totalInputAmount();
		}).keyup(function(){
			totalInputAmount();
		});

	});
///////////////////------------------------------------------------------------
	
	$("#transactionBtn").click(function(){
	validateOutputAmount();
	redeemFromBtn(transactionBtn);	
	setTimeout(function(){
	transactionBtn();	
	}, 1000);           /// cheap hack
	
//	redeemFromBtn(CallTransactionBtn);
//	console.log("redeem function called");
//	function CallTransactionBtn() {
//		transactionBtn();
//		console.log("transaction callback called");
//	}
//	CallTransactionBtn();
	});
	
	
	
	function transactionBtn() {
		var tx = coinjs.transaction();
		var estimatedTxSize = 10; // <4:version><1:txInCount><1:txOutCount><4:nLockTime>

		$("#transactionCreate, #transactionCreateStatus").addClass("hidden");

		//if(($("#nLockTime").val()).match(/^[0-9]+$/g)){
		//	tx.lock_time = $("#nLockTime").val()*1;
		//}

		$("#inputs .row").removeClass('has-error');

		$('#putTabs a[href="#txinputs"], #putTabs a[href="#txoutputs"]').attr('style','');

		$.each($("#inputs .row"), function(i,o){
			if(!($(".txId",o).val()).match(/^[a-f0-9]+$/i)){
				$(o).addClass("has-error");
			} else if((!($(".txIdScript",o).val()).match(/^[a-f0-9]+$/i)) && $(".txIdScript",o).val()!=""){
				$(o).addClass("has-error");
			} else if (!($(".txIdN",o).val()).match(/^[0-9]+$/i)){
				$(o).addClass("has-error");
			}

			if(!$(o).hasClass("has-error")){
				var seq = null;
				if($("#txRBF").is(":checked")){
					seq = 0xffffffff-2;
				}

				var currentScript = $(".txIdScript",o).val();
				if (currentScript.match(/^76a914[0-9a-f]{40}88ac$/)) {
					estimatedTxSize += 147
				} else if (currentScript.match(/^5[1-9a-f](?:210[23][0-9a-f]{64}){1,15}5[1-9a-f]ae$/)) {
					// <74:persig <1:push><72:sig><1:sighash> ><34:perpubkey <1:push><33:pubkey> > <32:prevhash><4:index><4:nSequence><1:m><1:n><1:OP>
					var scriptSigSize = (parseInt(currentScript.slice(1,2),16) * 74) + (parseInt(currentScript.slice(-3,-2),16) * 34) + 43
					// varint 2 bytes if scriptSig is > 252
					estimatedTxSize += scriptSigSize + (scriptSigSize > 252 ? 2 : 1)
				} else {
					// underestimating won't hurt. Just showing a warning window anyways.
					estimatedTxSize += 147
				}

				tx.addinput($(".txId",o).val(), $(".txIdN",o).val(), $(".txIdScript",o).val(), seq);
			} else {
				$('#putTabs a[href="#txinputs"]').attr('style','color:#a94442;');
			}
		});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		$("#recipients .row").removeClass('has-error');

		$.each($("#recipients .row"), function(i,o){               ////////////////////////// //// RETRIEVE recipients
			var a = ($(".address",o).val());
			var ad = coinjs.addressDecode(a);
			if(((a!="") && (ad.version == coinjs.pub || ad.version == coinjs.multisig)) && $(".amount",o).val()!=""){ // address
				// P2SH output is 32, P2PKH is 34
				estimatedTxSize += (ad.version == coinjs.pub ? 34 : 32)
				tx.addoutput(a, $(".amount",o).val());
			} else if (((a!="") && ad.version === 42) && $(".amount",o).val()!=""){ // stealth address
				// 1 P2PKH and 1 OP_RETURN with 36 bytes, OP byte, and 8 byte value
				estimatedTxSize += 78
				tx.addstealth(ad, $(".amount",o).val());
			} else if (((($("#opReturn").is(":checked")) && a.match(/^[a-f0-9]+$/ig)) && a.length<160) && (a.length%2)==0) { // data
				estimatedTxSize += (a.length / 2) + 1 + 8
				tx.adddata(a);
			} else { // neither address nor data
				$(o).addClass('has-error');
				$('#putTabs a[href="#txoutputs"]').attr('style','color:#a94442;');
			}
		});


		if(!$("#recipients .row, #inputs .row").hasClass('has-error')){
			$("#verifyTXScript").val("");
			$("#verifyTX").removeClass ('hidden').addClass('show').fadeIn();
			$("#verifyTXScript").val(tx.serialize());                   // instead of green area take directly to verify
			$('#sign').removeClass('hidden').show();
		//	$("#transactionCreate .txSize").html(tx.size());
// console.log($("#verifyTXScript").val(tx.serialize()));
			// $("#transactionCreate").removeClass("hidden");
			decodeTransactionScript();
				
			
			// Check fee against hard 0.01 as well as fluid 200 satoshis per byte calculation.
			if($("#transactionFee").val()>=0.01 || $("#transactionFee").val()>= estimatedTxSize * 200 * 1e-8){
				$("#modalWarningFeeAmount").html($("#transactionFee").val());
				$("#modalWarningFee").modal("show");
			}
		} else {
			$("#transactionCreateStatus").removeClass("hidden").html("One or more inputs or outputs are invalid").fadeOut().fadeIn();
		}
	}

	$(".txidClear").click(function(){
		$("#inputs .row:first input").attr('disabled',false);
		$("#inputs .row:first input").val("");
		totalInputAmount();
	});

	$("#inputs .txIdAmount").unbind("").change(function(){
		totalInputAmount();
	}).keyup(function(){
		totalInputAmount();
	});

	

	/* code for the qr code scanner */

	$(".qrcodeScanner").click(function(){
		if ((typeof MediaStreamTrack === 'function') && typeof MediaStreamTrack.getSources === 'function'){
			MediaStreamTrack.getSources(function(sourceInfos){
				var f = 0;
				$("select#videoSource").html("");
				for (var i = 0; i !== sourceInfos.length; ++i) {
					var sourceInfo = sourceInfos[i];
					var option = document.createElement('option');
					option.value = sourceInfo.id;
					if (sourceInfo.kind === 'video') {
						option.text = sourceInfo.label || 'camera ' + ($("select#videoSource options").length + 1);
						$(option).appendTo("select#videoSource");
 					}
				}
			});

			$("#videoSource").unbind("change").change(function(){
				scannerStart()
			});

		} else {
			$("#videoSource").addClass("hidden");
		}
		scannerStart();
		$("#qrcode-scanner-callback-to").html($(this).attr('forward-result'));
	});

	function scannerStart(){
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || false;
		if(navigator.getUserMedia){
			if (!!window.stream) {
				$("video").attr('src',null);
				window.stream.stop();
  			}

			var videoSource = $("select#videoSource").val();
			var constraints = {
				video: {
					optional: [{sourceId: videoSource}]
				}
			};

			navigator.getUserMedia(constraints, function(stream){
				window.stream = stream; // make stream available to console
				var videoElement = document.querySelector('video');
				videoElement.src = window.URL.createObjectURL(stream);
				videoElement.play();
			}, function(error){ });

			QCodeDecoder().decodeFromCamera(document.getElementById('videoReader'), function(er,data){
				if(!er){
					var match = data.match(/^bitcoin\:([13][a-z0-9]{26,33})/i);
					var result = match ? match[1] : data;
					$(""+$("#qrcode-scanner-callback-to").html()).val(result);
					$("#qrScanClose").click();
				}
			});
		} else {
			$("#videoReaderError").removeClass("hidden");
			$("#videoReader, #videoSource").addClass("hidden");
		}
	}

	/* redeem from button code */

	$("#redeemFromBtn").click(function()  {
		redeemFromBtn();
	});		
		
	$("#recalculateBtn").click(function()  {
		redeemFromBtn();
	});
	
	function redeemFromBtn()  {
		
		var redeem = redeemingFrom($("#redeemFrom").val());
		
		localStorage.setItem("RedAddr", redeem.addr);
		TXAjax();

		$("#redeemFromStatus, #redeemFromAddress").addClass('hidden');

		if(redeem.from=='multisigAddress'){
			$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> You should use the redeem script, not the multisig address!');
			return false;
		}

		if(redeem.from=='other'){
			$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> The address or multisig redeem script you have entered is invalid');
			return false;
		}

		if($("#clearInputsOnLoad").is(":checked")){
			$("#inputs .txidRemove, #inputs .txidClear").click();
		}

		$("#redeemFromBtn").html("Please wait, loading...").attr('disabled',true);

		var host = $(this).attr('rel');


	//	if(host=='blockr.io_bitcoinmainnet'){
		//	listUnspentBlockrio_BitcoinMainnet(redeem);
		//} else if(host=='chain.so_litecoin'){
		//	listUnspentChainso_Litecoin(redeem);
		//}  else if(host=='chain.so_dogecoin'){
		//	listUnspentChainso_Dogecoin(redeem);
		//}  else if(host=='cryptoid.info_carboncoin'){
		//	listUnspentCryptoidinfo_Carboncoin(redeem);
		//} else {
			listUnspentDefault(redeem);
	//	}

		//if($("#redeemFromStatus").hasClass("hidden")) {
		//	// An ethical dilemma: Should we automatically set nLockTime?
		//	if(redeem.from == 'redeemScript' && redeem.decodedRs.type == "hodl__") {
		//		$("#nLockTime").val(redeem.decodedRs.checklocktimeverify);
		//	} else {
		//		$("#nLockTime").val(0);
		//	}
		//}

	};

	/* function to determine what we are redeeming from */
	function redeemingFrom(string){
		var r = {};
		var decode = coinjs.addressDecode(string);
		if(decode.version == coinjs.pub){ // regular address
			r.addr = string;
			r.from = 'address';
			r.isMultisig = false;
		} else if (decode.version == coinjs.priv){ // wif key
			var a = coinjs.wif2address(string);
			r.addr = a['address'];
			r.from = 'wif';
			r.isMultisig = false;
		} else if (decode.version == coinjs.multisig){ // multisig address
			r.addr = '';
			r.from = 'multisigAddress';
			r.isMultisig = false;
		} else {
			var script = coinjs.script();
			var decodeRs = script.decodeRedeemScript(string);
			if(decodeRs){ // redeem script
				r.addr = decodeRs['address'];
				r.from = 'redeemScript';
				r.decodedRs = decodeRs;
				r.isMultisig = true; // not quite, may be hodl
			} else { // something else
				r.addr = '';
				r.from = 'other';
				r.isMultisig = false;
			}
		}
		return r;
	}
	
	// Retrieve values from web
	
		
	/* mediator payment code for when you used a public key */
	function mediatorPayment(redeem){

		if(redeem.from=="redeemScript"){

			$('#recipients .row[rel="'+redeem.addr+'"]').parent().remove();

			$.each(redeem.decodedRs.pubkeys, function(i, o){
				$.each($("#mediatorList option"), function(mi, mo){               /////////Go through mediator list to find pubkey//////////

					var ms = ($(mo).val()).split(";");

					var pubkey = ms[0]; // mediators pubkey
					var fee = ms[2]*1; // fee in a percentage
					var payto = coinjs.pubkey2address(pubkey); // pay to mediators address

	//				if(o==pubkey){ console.log(o); };// matched a mediators pubkey? 


  $.getJSON("https://bitcoinfees.earn.com/api/v1/fees/recommended", function(result){ 
//        console.log(result.halfHourFee);
				var optiFee = (result.halfHourFee * 470) * 0.00000001;     // transaction size in bytes
            	$("#transactionFee").val(optiFee);
				$("#txFee").html((optiFee).toFixed(8));
 $.getJSON(" https://apiv2.bitcoinaverage.com/constants/exchangerates/global", function(result){
        var rate = 1 / (result.rates.BTC.rate);
		var amount = (result.rates.BTC.rate) * 0.1;
        var facilitatorFee = (result.rates.BTC.rate) * 0.1;
		var refund = "";
// retrieveAjax();

	//					var amount = ((fee*$("#totalInput").html())/100).toFixed(8);
	//					$("#recipients .mediator_"+pubkey+" .amount:first").attr('disabled',(((amount*1)==0)?false:true)).val(amount).attr('title','Arbitration fee for '+$(mo).html());
					$("#Arbitrator").val(payto).attr('readonly',true).attr('title','Arbitrator address for '+$(mo).html());
                     
					var facilitatorAddress = "1JuyanqX9f4fQK9jWCEecY4FUMKHhQibi6";
					$("#Facilitator").val(facilitatorAddress).attr('readonly',true).attr('title','Facilitator address for '+$(mo).html());
                       //                      $("#facilitatorFee").val(facilitatorFee).attr('title','Facilitator Bonus');
		//			console.log(offer2Checksum);
		//			console.log($('#checksum2').val());
    				$("#nullData").val($('#checksum2').val()).attr('readonly',true).attr('title','Checksum for Mutual Contract Agreement');
// setTimeout(function(){
$("#arbitrationFee").val(amount).attr('title','Arbitration basic fee for '+$(mo).html());
 $("#facilitatorFee").val(facilitatorFee).attr('readonly',true).attr('title','Facilitator Bonus');
var allFees = parseFloat($("#arbitrationFee").val())+parseFloat($("#facilitatorFee").val())+parseFloat($("#transactionFee").val()); // +parseFloat($("#buyerRefund").val());
// quickview =  $("#sellerPay").val(parseFloat(totalInput) - parseFloat(allFees));
refund = parseFloat($("#buyerRefund").val());
if (refund) {
allFees = allFees + refund;
}
$("#sellerPay").val($("#totalInput").html()-parseFloat(allFees));

// }, 2000);
// buyerRefund, sellerPay, transactionFee
// returnUSD, priceUSD, txFeeUSD

$("#priceUSD").val(Math.round($("#sellerPay").val()*rate*100)/100);				
$("#txFeeUSD").val(Math.round($("#transactionFee").val()*rate*100)/100);
$("#returnUSD").val(Math.round($("#buyerRefund").val()*rate*100)/100);

 });
  }); // End of web retrievals
//					}; // end pubkey stuff
				});
			});

			validateOutputAmount();
		}
	}

	/* global function to add outputs to page */
	function addOutput(tx, n, script, amount) {
		if(tx){
			if($("#inputs .txId:last").val()!=""){
				$("#inputs .txidAdd").click();
			}

			$("#inputs .row:last input").attr('disabled',true);

			var txid = ((tx).match(/.{1,2}/g).reverse()).join("")+'';

			$("#inputs .txId:last").val(txid);
			$("#inputs .txIdN:last").val(n);
			$("#inputs .txIdAmount:last").val(amount);
			$("#inputs .txIdScript:last").val(script);
		}
	}

	/* default function to retrieve unspent outputs*/	
	function listUnspentDefault(redeem) {
		var tx = coinjs.transaction();
		tx.listUnspent(redeem.addr, function(data){
			if(redeem.addr) {
				$("#redeemFromAddress").removeClass('hidden').html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <h4><a href="https://chain.so/address/BTC/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a> </font></h4>');
	
		
	localforage.getItem(redeem.addr).then(function(value) {
    // This code runs once the value has been loaded
    // from the offline store.
//   console.log(value);
}).catch(function(err) {
    // This code runs if there were any errors
    console.log(err);
});

				
//			if (redeem.addr != AddressMS) {
//					TXAjax(redeem);
//				} else { TXAjax(AddressMS); }


				$.each($(data).find("unspent").children(), function(i,o){
					var tx = $(o).find("tx_hash").text();
					var n = $(o).find("tx_output_n").text();
					var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : $(o).find("script").text();
					var amount = (($(o).find("value").text()*1)/100000000).toFixed(8);

					addOutput(tx, n, script, amount);
				});
			}

			$("#redeemFromBtn").html("Load/Refresh").attr('disabled',false);
			totalInputAmount();

			mediatorPayment(redeem);
		});
	}

	/* retrieve unspent data from blockrio for mainnet */
	function listUnspentBlockrio_BitcoinMainnet(redeem){
		$.ajax ({
			type: "POST",
			url: "https://btc.blockr.io/api/v1/address/unspent/"+redeem.addr+"?unconfirmed=1",
			dataType: "json",
			error: function(data) {
				$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs!');
			},
			success: function(data) {
				if((data.status && data.data) && data.status=='success'){
					$("#redeemFromAddress").removeClass('hidden').html('<span class="glyphicon glyphicon-info-sign"></span> Retrieved unspent inputs from address <a href="https://btc.blockr.io/address/info/'+redeem.addr+'" target="_blank">'+redeem.addr+'</a>');
					for(var i in data.data.unspent){
						var o = data.data.unspent[i];
						var tx = o.tx;
						var n = o.n;
						var script = (redeem.isMultisig==true) ? $("#redeemFrom").val() : o.script;
						var amount = o.amount;
						addOutput(tx, n, script, amount);
					}
				} else {
					$("#redeemFromStatus").removeClass('hidden').html('<span class="glyphicon glyphicon-exclamation-sign"></span> Unexpected error, unable to retrieve unspent outputs.');
				}
			},
			complete: function(data, status) {
				$("#redeemFromBtn").html("Load").attr('disabled',false);
				totalInputAmount();
			}
		});
	}

	/* math to calculate the inputs and outputs */

	function totalInputAmount(){
		$("#totalInput").html('0.00');
		$.each($("#inputs .txIdAmount"), function(i,o){
			if(isNaN($(o).val())){
				$(o).parent().addClass('has-error');
			} else {
				$(o).parent().removeClass('has-error');
				var f = 0;
				if(!isNaN($(o).val())){
					f += $(o).val()*1;
				}
				$("#totalInput").html((($("#totalInput").html()*1) + (f*1)).toFixed(8));
			}
		});
		totalFee();
	}

	function validateOutputAmount(){
		$("#recipients .amount").unbind('');
		$("#recipients .amount").keyup(function(){
			if(isNaN($(this).val())){
				$(this).parent().addClass('has-error');
			} else {
				$(this).parent().removeClass('has-error');
				var f = 0;
				$.each($("#recipients .amount"),function(i,o){
					if(!isNaN($(o).val())){
						f += $(o).val()*1;
					}	
					
				});
				$("#totalOutput").html((f).toFixed(8));
				var totalOutput = $("#totalOutput").html();
				var txFee = $("#txFee").html();
				$("#sellerPay").html((f).toFixed(8));
				$("#totalOut").html(parseFloat(totalOutput)+parseFloat(txFee));
				var totalOut = $("#totalOut").html();  // not needed at this point
								
			}
			totalFee();
		}).keyup();
	}

	function totalFee(){
		var fee = (($("#totalInput").html()*1) - ($("#totalOutput").html()*1)).toFixed(8);
// console.log(fee);
//		$("#transactionFee").val((fee>0)?fee:'0.00');
	}

	$("#optionsCollapse").click(function(){
		if($("#optionsAdvanced").hasClass('hidden')){
			$("#glyphcollapse").removeClass('glyphicon-collapse-down').addClass('glyphicon-collapse-up');
			$("#optionsAdvanced").removeClass("hidden");
		} else {
			$("#glyphcollapse").removeClass('glyphicon-collapse-up').addClass('glyphicon-collapse-down');
			$("#optionsAdvanced").addClass("hidden");
		}
	});

	/* broadcast a transaction */

	$("#rawSubmitBtn").click(function(){
		rawSubmitDefault(this);
	});

	// broadcast transaction via coinbin (default)
	function rawSubmitDefault(btn){ 
		var thisbtn = btn;		
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: coinjs.host+'?uid='+coinjs.uid+'&key='+coinjs.key+'&setmodule=bitcoin&request=sendrawtransaction',
			data: {'rawtx':$("#rawTransaction").val()},
			dataType: "xml",
			error: function(data) {
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(" There was an error submitting your request, please try again").prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
			},
                        success: function(data) {
				$("#rawTransactionStatus").html(unescape($(data).find("response").text()).replace(/\+/g,' ')).removeClass('hidden');
				if($(data).find("result").text()==1){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger');
					$("#rawTransactionStatus").html('txid: '+$(data).find("txid").text());
					// remove rawSubmitBtn (no need, tells if in blockchain), call TXAjax to send txid and enter date under Concluded, return Sweetalert, enter link to chain.so on txid.
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span> ');
				}
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}


	// broadcast transaction via blockr.io (mainnet)
	function rawSubmitBlockrio_BitcoinMainnet(thisbtn){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: "https://btc.blockr.io/api/v1/tx/push",
			data: {"hex":$("#rawTransaction").val()},
			dataType: "json",
			error: function(data) {
				var obj = $.parseJSON(data.responseText);
				var r = ' ';
				r += (obj.data) ? obj.data : '';
				r += (obj.message) ? ' '+obj.message : '';
				r = (r!='') ? r : ' Failed to broadcast'; // build response 
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
			},
                        success: function(data) {
				if((data.status && data.data) && data.status=='success'){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' Txid: '+data.data);
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
				}				
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}

	// broadcast transaction via blockr.io (mainnet)
	function rawSubmitChainso_BitcoinMainnet(thisbtn){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: "https://chain.so/api/v2/send_tx/BTC/",
			data: {"tx_hex":$("#rawTransaction").val()},
			dataType: "json",
			error: function(data) {
				var obj = $.parseJSON(data.responseText);
				var r = ' ';
				r += (obj.data.tx_hex) ? obj.data.tx_hex : '';
				r = (r!='') ? r : ' Failed to broadcast'; // build response 
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
			},
                        success: function(data) {
				if(data.status && data.data.txid){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' Txid: '+data.data.txid);
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
				}				
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}

	// broadcast transaction via blockcypher.com (mainnet)
	function rawSubmitblockcypher_BitcoinMainnet(thisbtn){ 
		$(thisbtn).val('Please wait, loading...').attr('disabled',true);
		$.ajax ({
			type: "POST",
			url: "https://api.blockcypher.com/v1/btc/main/txs/push",
			data: JSON.stringify({"tx":$("#rawTransaction").val()}),
			error: function(data) {
				var obj = $.parseJSON(data.responseText);
				var r = ' ';
				r += (obj.error) ? obj.error : '';
				r = (r!='') ? r : ' Failed to broadcast'; // build response 
				$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(r).prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
			},
                        success: function(data) {
				if((data.tx) && data.tx.hash){
					$("#rawTransactionStatus").addClass('alert-success').removeClass('alert-danger').removeClass("hidden").html(' Txid: '+data.tx.hash);
				} else {
					$("#rawTransactionStatus").addClass('alert-danger').removeClass('alert-success').removeClass("hidden").html(' Unexpected error, please try again').prepend('<span class="glyphicon glyphicon-exclamation-sign"></span>');
				}
			},
			complete: function(data, status) {
				$("#rawTransactionStatus").fadeOut().fadeIn();
				$(thisbtn).val('Submit').attr('disabled',false);				
			}
		});
	}


	/* verify script code */
//	$("#verifyBtn").click(function(){
    function  verifyBtn(){                            ///////////////////////////////////////// instead of a default click event
		$(".verifyData").addClass("hidden");  // find out what kind of string - we already know this
		$("#verifyStatus").hide();      // hide/show "unable to decode"
		if(!decodeRedeemScript()){
			if(!decodeTransactionScript() || !decodeSignatureScript()){
				if(!decodePrivKey()){
					if(!decodePubKey()){
						if(!decodeHDaddress()){
							$("#verifyStatus").removeClass('hidden').fadeOut().fadeIn();
						}
					}
				}
			}
		}
	}
	//	});

	function decodeRedeemScript(){
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////
		$("#verifyRScript").val(RedeemScript);  // Fills in form
		console.log(RedeemScript);
		console.log($("#verifyRScript").val());
//		if (($("#redeemFrom").val()) == "")	{	$("#redeemFrom").val(RedeemScript);
		$("#redeemFrom").val(RedeemScript);
		redeemFromBtn();
//		}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		var script = coinjs.script();
		var decode = script.decodeRedeemScript($("#verifyRScript").val());   
		if(decode){
			$("#verifyRsDataMultisig").addClass('hidden');
			$("#verifyRsDataHodl").addClass('hidden');

			if(decode.type == "multisig__") {
				$("#verifyRsDataMultisig .multisigAddress").val(decode['address']);
				$("#verifyRsDataMultisig .signaturesRequired").html(decode['signaturesRequired']);
				$("#verifyRsDataMultisig table tbody").html("");
				for(var i=0;i<decode.pubkeys.length;i++){
					var pubkey = decode.pubkeys[i];
					var address = coinjs.pubkey2address(pubkey);
//input {display: block !important; padding: 0 !important; margin: 0 !important; border: 0 !important; width: 100% !important; border-radius: 0 !important; line-height: 1 !important;}
// td {margin: 0 !important; padding: 0 !important;}
					// $('<tr><td width="30%"><input type="text" class="form-control" value="'+address+'" readonly></td><td><input type="text" class="form-control" value="'+pubkey+'" readonly></td></tr>').appendTo("#verifyRsDataMultisig table tbody");
					$('<tr><td width="30%">'+address+'</td><td>'+pubkey+'</td></tr>').appendTo("#verifyRsDataMultisig table tbody");
				}
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataMultisig").removeClass('hidden');
				$("#contract").removeClass('hidden');
				$(".verifyLink").attr('href','?verify='+$("#verifyRScript").val());
				return true;
			} else if(decode.type == "hodl__") {
				var d = $("#verifyRsDataHodl .date").data("DateTimePicker");
				$("#verifyRsDataHodl .address").val(decode['address']);
				$("#verifyRsDataHodl .pubkey").val(coinjs.pubkey2address(decode['pubkey']));
				$("#verifyRsDataHodl .date").val(decode['checklocktimeverify'] >= 500000000? moment.unix(decode['checklocktimeverify']).format("MM/DD/YYYY HH:mm") : decode['checklocktimeverify']);
				$("#verifyRsData").removeClass("hidden");
				$("#verifyRsDataHodl").removeClass('hidden');
				$(".verifyLink").attr('href','?verify='+$("#verifyScript").val());
				return true;
			}
		}
			
		return false;
	}

	function countValidSigs() {
		var tx = coinjs.transaction();
		try {
			var decode = tx.deserialize($("#signedData textarea").val());
		$.each(decode.ins, function(i,o){
				var s = decode.extractScriptKey(i);
				var count = s['signatures'];
				if (count > 0){
					$(".sigBad").html("");
		//			$(".sigGd").html("Signature accepted!");
					$("#signedData").removeClass('hidden');
				sigOne = $("#signedData textarea").val();
			    TXAjax(sigOne);
				} else { $(".sigBad").html("Signature not a Match!");
						$("#signedData").addClass('hidden');
						}
		});
	} catch(e) {
				return false;
			}
		}
		
	function countValidSigs1() {
		var tx = coinjs.transaction();
		try {
			var decode = tx.deserialize($("#rawTransaction").val());
		$.each(decode.ins, function(i,o){
				var s = decode.extractScriptKey(i);
				var count = s['signatures'];
				if (count > 1){
					$(".sigBad1").html("");
		//			$(".sigGd").html("Signature accepted!");
					$("#broadcast").removeClass('hidden');
				sigTwo = $("#rawTransaction").val();
		//	    TXAjax(sigTwo);
				} else { $(".sigBad1").html("Signature not a Match!");
						$("#broadcast").addClass('hidden');
						}
		});
	} catch(e) {
				return false;
			}
		}
	
	function decodeTransactionScript(){
		var tx = coinjs.transaction();
		try {
			var decode = tx.deserialize($("#verifyTXScript").val());
		//	console.log(decode);
			$("#verifyTransactionData .transactionVersion").html(decode['version']);
			$("#verifyTransactionData .transactionSize").html(decode.size()+' <i>bytes</i>');
			$("#verifyTransactionData .transactionLockTime").html(decode['lock_time']);
			$("#verifyTransactionData .transactionRBF").hide();
			$("#verifyTransactionData").removeClass("hidden");
			$("#verifyTransactionData tbody").html("");

			var h = '';
			$.each(decode.ins, function(i,o){
				var s = decode.extractScriptKey(i);
				console.log(s['signatures']);
				
				h += '<tr>';
				h += '<td><input class="form-control" type="text" value="'+o.outpoint.hash+'" readonly></td>';
				h += '<td class="col-xs-1">'+o.outpoint.index+'</td>';
				h += '<td class="col-xs-2"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
				h += '<td class="col-xs-1"> <span class="glyphicon glyphicon-'+((s.signed=='true')?'ok':'remove')+'-circle"></span>';
			//	if(s['type']=='multisig' && s['signatures']>=1){
					h += ' '+s['signatures'];
			//		console.log(s['signatures']);
			//	}
				h += '</td>';
				h += '<td class="col-xs-1">';
				if(s['type']=='multisig'){                       // just to get number of sigs required
					var script = coinjs.script();
					var rs = script.decodeRedeemScript(s.script);
					h += rs['signaturesRequired']+' of '+rs['pubkeys'].length;
		//			$(".sigsReqOf").html("Signatures are required of</b>");
					
				} else {
					h += '<span class="glyphicon glyphicon-remove-circle"></span>';
				}
				h += '</td>';
				h += '</tr>';

				//debug
				if(parseInt(o.sequence)<(0xFFFFFFFF-1)){
					$("#verifyTransactionData .transactionRBF").show();
				}
			});

			$(h).appendTo("#verifyTransactionData .ins tbody");

			h = '';
			$.each(decode.outs, function(i,o){

				if(o.script.chunks.length==2 && o.script.chunks[0]==106){ // OP_RETURN

					var data = Crypto.util.bytesToHex(o.script.chunks[1]);
					var dataascii = hex2ascii(data);

					if(dataascii.match(/^[\s\d\w]+$/ig)){
						data = dataascii;
					}

					h += '<tr>';
					h += '<td><input type="text" class="form-control" value="(OP_RETURN) '+data+'" readonly></td>';
					h += '<td class="col-xs-1">'+(o.value/100000000).toFixed(8)+'</td>';
			//		h += '<td class="col-xs-2"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
					h += '</tr>';
				} else {

					var addr = '';
					if(o.script.chunks.length==5){
						addr = coinjs.scripthash2address(Crypto.util.bytesToHex(o.script.chunks[2]));
					} else {
						var pub = coinjs.pub;
						coinjs.pub = coinjs.multisig;
						addr = coinjs.scripthash2address(Crypto.util.bytesToHex(o.script.chunks[1]));
						coinjs.pub = pub;
					}

					h += '<tr>';
					h += '<td><input class="form-control" type="text" value="'+addr+'" readonly></td>';
					h += '<td class="col-xs-1">'+(o.value/100000000).toFixed(8)+'</td>';
				//	h += '<td class="col-xs-2"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
					h += '</tr>';
				}
			});
			$(h).appendTo("#verifyTransactionData .outs tbody");

			$(".verifyLink").attr('href','?verify='+$("#verifyTXScript").val());
			return true;
		} catch(e) {
			return false;
		}
	}

	function decodeSignatureScript(){
		var tx = coinjs.transaction();
		try {
			var decode = tx.deserialize($("#verifySigScript").val());
		//	console.log(decode);
			
			$("#verifySignatureData").removeClass("hidden");
			$("#verifySignatureData tbody").html("");

			var h = '';
			$.each(decode.ins, function(i,o){
				var s = decode.extractScriptKey(i);
//				console.log(s['signatures']);
				
				h += '<tr>';
				h += '<td><input class="form-control" type="text" value="'+o.outpoint.hash+'" readonly></td>';
				h += '<td class="col-xs-1">'+o.outpoint.index+'</td>';
				h += '<td class="col-xs-2"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
				h += '<td class="col-xs-1"> <span class="glyphicon glyphicon-'+((s.signed=='true')?'ok':'remove')+'-circle"></span>';
			//	if(s['type']=='multisig' && s['signatures']>=1){
					h += ' '+s['signatures'];
			//		console.log(s['signatures']);
			//	}
				h += '</td>';
				h += '<td class="col-xs-1">';
				if(s['type']=='multisig'){                       // just to get number of sigs required
					var script = coinjs.script();
					var rs = script.decodeRedeemScript(s.script);
					h += rs['signaturesRequired']+' of '+rs['pubkeys'].length;
		//			$(".sigsReqOf").html("Signatures are required of</b>");
					
				} else {
					h += '<span class="glyphicon glyphicon-remove-circle"></span>';
				}
				h += '</td>';
				h += '</tr>';

				//debug
				if(parseInt(o.sequence)<(0xFFFFFFFF-1)){
					$("#verifySignatureData .signatureRBF").show();
				}
			});

			$(h).appendTo("#verifySignatureData .ins tbody");

			h = '';
			$.each(decode.outs, function(i,o){

				if(o.script.chunks.length==2 && o.script.chunks[0]==106){ // OP_RETURN

					var data = Crypto.util.bytesToHex(o.script.chunks[1]);
					var dataascii = hex2ascii(data);

					if(dataascii.match(/^[\s\d\w]+$/ig)){
						data = dataascii;
					}

					h += '<tr>';
					h += '<td><input type="text" class="form-control" value="(OP_RETURN) '+data+'" readonly></td>';
					h += '<td class="col-xs-1">'+(o.value/100000000).toFixed(8)+'</td>';
			//		h += '<td class="col-xs-2"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
					h += '</tr>';
				} else {

					var addr = '';
					if(o.script.chunks.length==5){
						addr = coinjs.scripthash2address(Crypto.util.bytesToHex(o.script.chunks[2]));
					} else {
						var pub = coinjs.pub;
						coinjs.pub = coinjs.multisig;
						addr = coinjs.scripthash2address(Crypto.util.bytesToHex(o.script.chunks[1]));
						coinjs.pub = pub;
					}

					h += '<tr>';
					h += '<td><input class="form-control" type="text" value="'+addr+'" readonly></td>';
					h += '<td class="col-xs-1">'+(o.value/100000000).toFixed(8)+'</td>';
				//	h += '<td class="col-xs-2"><input class="form-control" type="text" value="'+Crypto.util.bytesToHex(o.script.buffer)+'" readonly></td>';
					h += '</tr>';
				}
			});
			$(h).appendTo("#verifySignatureData .outs tbody");

			$(".verifyLink").attr('href','?verify='+$("#verifySigScript").val());
			return true;
		} catch(e) {
			return false;
		}
	}



	function hex2ascii(hex) {
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	}

	function decodePrivKey(){
		var wif = $("#verifyScript").val();
		if(wif.length==51 || wif.length==52){
			try {
				var w2address = coinjs.wif2address(wif);
				var w2pubkey = coinjs.wif2pubkey(wif);
				var w2privkey = coinjs.wif2privkey(wif);

				$("#verifyPrivKey .address").val(w2address['address']);
				$("#verifyPrivKey .pubkey").val(w2pubkey['pubkey']);
				$("#verifyPrivKey .privkey").val(w2privkey['privkey']);
				$("#verifyPrivKey .iscompressed").html(w2address['compressed']?'true':'false');

				$("#verifyPrivKey").removeClass("hidden");
				return true;
			} catch (e) {
				return false;
			}
		} else {
			return false;
		}
	}

	function decodePubKey(){
		var pubkey = $("#verifyScript").val();
		if(pubkey.length==66 || pubkey.length==130){
			try {
				$("#verifyPubKey .address").val(coinjs.pubkey2address(pubkey));
				$("#verifyPubKey").removeClass("hidden");
				$(".verifyLink").attr('href','?verify='+$("#verifyScript").val());
				return true;
			} catch (e) {
				return false;
			}
		} else {
			return false;
		}
	}

	
	/* sign code */

	$("#signBtn").click(function(){
		var wifkey = $("#signPrivateKey");
		
		$("#verifyTXScript").val()
		script = $("#verifyTXScript");    

		if(coinjs.addressDecode(wifkey.val())){
			$(wifkey).parent().removeClass('has-error');
		} else {
			$(wifkey).parent().addClass('has-error');
		}

		if((script.val()).match(/^[a-f0-9]+$/ig)){
			$(script).parent().removeClass('has-error');
		} else {
			$(script).parent().addClass('has-error');
		}

		if($("#sign .has-error").length==0){
			$("#signedDataError").addClass('hidden');
			try {
				var tx = coinjs.transaction();
				var t = tx.deserialize(script.val());

				var signed = t.sign(wifkey.val());
				$("#signedData textarea").val(signed);
				$("#signedData .txSize").html(t.size());
				$("#signedData").removeClass('hidden').fadeIn();
				countValidSigs();
			} catch(e) {
				// console.log(e);
			}
		} else {
			$("#signedDataError").removeClass('hidden');
			$("#signedData").addClass('hidden');
		    $(".sigBad").html("");
		}
	});

	$("#signBtn1").click(function(){
		var wifkey = $("#signPrivateKey1");
		$("#verifySigScript").val();
		script = $("#verifySigScript");

		if(coinjs.addressDecode(wifkey.val())){
			$(wifkey).parent().removeClass('has-error');
		} else {
			$(wifkey).parent().addClass('has-error');
		}

		if((script.val()).match(/^[a-f0-9]+$/ig)){
			$(script).parent().removeClass('has-error');
		} else {
			$(script).parent().addClass('has-error');
		}

		if($("#sign1 .has-error").length==0){
			$("#signedDataError1").addClass('hidden');
			try {
				var tx = coinjs.transaction();
				var t = tx.deserialize(script.val());

				var signed = t.sign(wifkey.val());
				$("#broadcast").removeClass('hidden');
				$("#rawTransaction").val(signed);
	///			$("#signedData1 .txSize").html(t.size());
				$("#rawTransaction").removeClass('hidden').fadeIn();
				countValidSigs1();
			} catch(e) {
				// console.log(e);
			}
		} else {
			$("#signedDataError1").removeClass('hidden');
			$("#rawTransaction").addClass('hidden');
			$("#broadcast").addClass('hidden');
		    $(".sigBad1").html("");
		}
	});

	/* page load code */

	function _get(value) {
		var dataArray = (document.location.search).match(/(([a-z0-9\_\[\]]+\=[a-z0-9\_\.\%\@]+))/gi);
		var r = [];
		if(dataArray) {
			for(var x in dataArray) {
				if((dataArray[x]) && typeof(dataArray[x])=='string') {
					if((dataArray[x].split('=')[0].toLowerCase()).replace(/\[\]$/ig,'') == value.toLowerCase()) {
						r.push(unescape(dataArray[x].split('=')[1]));
					}
				}
			}
		}
		return r;
	}

	var _getBroadcast = _get("broadcast");
	if(_getBroadcast[0]){
		$("#rawTransaction").val(_getBroadcast[0]);
		$("#rawSubmitBtn").click();
		window.location.hash = "#broadcast";
	}

	var _getVerify = _get("verify");
	if(_getVerify[0]){
		$("#verifyScript").val(_getVerify[0]);
		verifyBtn();
	//	$("#verifyBtn").click();
		window.location.hash = "#verify";
		}
	
//	window.location.hash = "#contract";

	$(".qrcodeBtn").click(function(){
		$("#qrcode").html("");
		var thisbtn = $(this).parent().parent();
		var qrstr = false;
		var ta = $("textarea",thisbtn);

		if(ta.length>0){
			var w = (screen.availWidth > screen.availHeight ? screen.availWidth : screen.availHeight)/3;
			var qrcode = new QRCode("qrcode", {width:w, height:w});
			qrstr = $(ta).val();
			if(qrstr.length > 1024){
				$("#qrcode").html("<p>Sorry the data is too long for the QR generator.</p>");
			}
		} else {
			var qrcode = new QRCode("qrcode");
			qrstr = "bitcoin:"+$('.address',thisbtn).val(); // || ("bitcoin:"+$('.pubkey',thisbtn).val());   // added pubkey didn't work
		}

		if(qrstr){
			qrcode.makeCode(qrstr);
		}
	});

	$('input[title!=""], abbr[title!=""]').tooltip({'placement':'bottom'});

	if (location.hash !== ''){
		$('a[href="' + location.hash + '"]').tab('show');
	}

	$(".showKey").click(function(){
		$("input[type='password']",$(this).parent().parent()).attr('type','text');
	});
	
	$("#homeBtn").click(function(e){
		e.preventDefault();
		history.pushState(null, null, '#home');
		$("#header .active, #content .tab-content").removeClass("active");
		$("#home").addClass("active");
	});

	$('a[data-toggle="tab"]').on('click', function(e) {
		e.preventDefault();
		if(e.target){
			history.pushState(null, null, '#'+$(e.target).attr('href').substr(1));
		}
	});

	window.addEventListener("popstate", function(e) {
		var activeTab = $('[href=' + location.hash + ']');
		if (activeTab.length) {
			activeTab.tab('show');
		} else {
			$('.nav-tabs a:first').tab('show');
		}
	});
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//	for(i=1;i<2;i++){
//		$(".pubkeyAdd").click();
//	}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
	validateOutputAmount();

	/* settings page code */

	$("#coinjs_pub").val('0x'+(coinjs.pub).toString(16));
	$("#coinjs_priv").val('0x'+(coinjs.priv).toString(16));
	$("#coinjs_multisig").val('0x'+(coinjs.multisig).toString(16));

	$("#coinjs_hdpub").val('0x'+(coinjs.hdkey.pub).toString(16));
	$("#coinjs_hdprv").val('0x'+(coinjs.hdkey.prv).toString(16));	

	$("#settingsBtn").click(function(){

		// log out of openwallet
		$("#walletLogout").click();

		$("#statusSettings").removeClass("alert-success").removeClass("alert-danger").addClass("hidden").html("");
		$("#settings .has-error").removeClass("has-error");

		$.each($(".coinjssetting"),function(i, o){
			if(!$(o).val().match(/^0x[0-9a-f]+$/)){
				$(o).parent().addClass("has-error");
			}
		});

		if($("#settings .has-error").length==0){

			coinjs.pub =  $("#coinjs_pub").val()*1;
			coinjs.priv =  $("#coinjs_priv").val()*1;
			coinjs.multisig =  $("#coinjs_multisig").val()*1;

			coinjs.hdkey.pub =  $("#coinjs_hdpub").val()*1;
			coinjs.hdkey.prv =  $("#coinjs_hdprv").val()*1;

			configureBroadcast();
			configureGetUnspentTx();

			$("#statusSettings").addClass("alert-success").removeClass("hidden").html("<span class=\"glyphicon glyphicon-ok\"></span> Settings updates successfully").fadeOut().fadeIn();	
		} else {
			$("#statusSettings").addClass("alert-danger").removeClass("hidden").html("There is an error with one or more of your settings");	
		}
	});

	$("#coinjs_coin").change(function(){

		var o = ($("option:selected",this).attr("rel")).split(";");

		// deal with broadcasting settings
		if(o[5]=="false"){
			$("#coinjs_broadcast, #rawTransaction, #rawSubmitBtn, #openBtn").attr('disabled',true);
			$("#coinjs_broadcast").val("coinb.in");			
		} else {
			$("#coinjs_broadcast").val(o[5]);
			$("#coinjs_broadcast, #rawTransaction, #rawSubmitBtn, #openBtn").attr('disabled',false);
		}

		// deal with unspent output settings
		if(o[6]=="false"){
			$("#coinjs_utxo, #redeemFrom, #redeemFromBtn, #openBtn, .qrcodeScanner").attr('disabled',true);			
			$("#coinjs_utxo").val("coinb.in");
		} else {
			$("#coinjs_utxo").val(o[6]);
			$("#coinjs_utxo, #redeemFrom, #redeemFromBtn, #openBtn, .qrcodeScanner").attr('disabled',false);
		}

		// deal with the reset
		$("#coinjs_pub").val(o[0]);
		$("#coinjs_priv").val(o[1]);
		$("#coinjs_multisig").val(o[2]);
		$("#coinjs_hdpub").val(o[3]);
		$("#coinjs_hdprv").val(o[4]);

		// hide/show custom screen
		if($("option:selected",this).val()=="custom"){
			$("#settingsCustom").removeClass("hidden");
		} else {
			$("#settingsCustom").addClass("hidden");
		}
	});

	function configureBroadcast(){
		var host = $("#coinjs_broadcast option:selected").val();
		$("#rawSubmitBtn").unbind("");
		if(host=="blockr.io_litecoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitBlockrio_litecoin(this)
			});
		} else if(host=="blockr.io_bitcoinmainnet"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitBlockrio_BitcoinMainnet(this);
			});
		} else if(host=="chain.so_bitcoinmainnet"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitChainso_BitcoinMainnet(this);
			});
		} else if(host=="chain.so_dogecoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitchainso_dogecoin(this);
			});
		} else if(host=="blockcypher_bitcoinmainnet"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitblockcypher_BitcoinMainnet(this);
			});
		} else if(host=="cryptoid.info_carboncoin"){
			$("#rawSubmitBtn").click(function(){
				rawSubmitcryptoid_Carboncoin(this);
			});
		} else {
			$("#rawSubmitBtn").click(function(){
				rawSubmitDefault(this); // revert to default
			});
		}
	}

	function configureGetUnspentTx(){
		$("#redeemFromBtn").attr('rel',$("#coinjs_utxo option:selected").val());
	}

	/* capture mouse movement to add entropy */
	var IE = document.all?true:false // Boolean, is browser IE?
	if (!IE) document.captureEvents(Event.MOUSEMOVE)
	document.onmousemove = getMouseXY;
	function getMouseXY(e) {
		var tempX = 0;
		var tempY = 0;
		if (IE) { // If browser is IE
			tempX = event.clientX + document.body.scrollLeft;
			tempY = event.clientY + document.body.scrollTop;
		} else {
			tempX = e.pageX;
			tempY = e.pageY;
		};

		if (tempX < 0){tempX = 0};
		if (tempY < 0){tempY = 0};
		var xEnt = Crypto.util.bytesToHex([tempX]).slice(-2);
		var yEnt = Crypto.util.bytesToHex([tempY]).slice(-2);
		var addEnt = xEnt.concat(yEnt);

		if ($("#entropybucket").html().indexOf(xEnt) == -1 && $("#entropybucket").html().indexOf(yEnt) == -1) {
			$("#entropybucket").html(addEnt + $("#entropybucket").html());
		};

		if ($("#entropybucket").html().length > 128) {
			$("#entropybucket").html($("#entropybucket").html().slice(0, 128))
		};

		return true;
	};
});

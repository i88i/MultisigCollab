$(document).ready(function() {

if($("#retrieveOnly").is(":checked")){
	
	retrieveAjax();
	
}

// function contractFieldsSubmit() {
$("#contractFieldsSubmit").click(function(){
     		
			contractAjax();       // This will get the multisig stuff done plus Ajax etc....  
//			$("#pubkeyalert").fadeOut();

	});
/////////////--------------------------------------------------------------------------------------------------------------------------------
	function retrieveAjax(){
		var terms = [];
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	////////////////////////////////////     Assemble and Submit JSON here:
	MSredeem = "5221021b6fe18e6d6b399a76736afa9afe8f4cd135a090956145595f514ce1757da605210347d782d14958ac6643eb87d4fa201889573d3a8dda66deeb4c68a1b0653c757521034b981a8f9f50994a6565c401daabb5533e2e24f5003ad7bae060b0cfcbde70b753ae";
	
						    terms[0] = MSredeem;
							
						
		doRetrieveAjax();					
								

	//				    console.log(JSON.stringify(keys));

	function doRetrieveAjax() {
		
		
		var array, ajax;
					
		//Hardcoded data values for demonstration purposes
		//value = 'A string';  
          array = JSON.stringify(terms);
		  
	
		//object = JSON.stringify({first: 'obj_item1', second: 'obj_item2', third: 'obj_item3'});
		//			
		////Pass the values to the AJAX request and specify function arg for 'done' callback
		ajax = theRetrieveAjax(array);
		ajax.done(processRetrieveData);
		ajax.fail(function( jqXHR, textStatus, errorThrown) {
				//Output error information
		});
	
}


function theRetrieveAjax(arr) {
	return $.ajax({
      url: 'https://checkabid.com/btc/retrieve.php',
  //  contentType: 'application/json',
  //   dataType: 'json',
  processRetrieveData: false,
	 data: arr,
 //data: JSON.stringify(keys),
   //  data: { js_array: arr },
	  type: "POST",
	  cache: false,
      error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      },
	  success: function(msg) {
      console.log(msg);
	  }
    }); // end ajax call
	
}		
// This takes care of data once returned from Server:
	function processRetrieveData(returnedstuff /*textStatus, jqXHR*/) {
//    console.log(returnedstuff);
//	var response = returnedstuff;
	var response = JSON.parse(returnedstuff);
//	console.log("this here is the JSONparsed response (contract):");
//    console.log(response);



freshContract = response.data['contractData'];
freshChecksum = response.data['checksumData'];
$("#contractArea").val(freshContract);
$("#checksum").val(freshChecksum);

console.log(freshContract);
// localStorage.setItem('contractAreaLS', freshContract);

//  console.log(freshContract);
//  console.log(localStorage.getItem ('contractAreaLS'));
//  contractAreaLS = localStorage.getItem ('contractAreaLS');
  
//  localStorage.setItem('contractAreaLS', freshContract);
//		localStorage.setItem('checksumLS', checksum);
// oldContract = localStorage.getItem('contractAreaLS');
// // $("#contractArea").val(freshContract);
// console.log(freshContract);
//  console.log(oldContract);
//  console.log(contractAreaLS);
//if (oldContract != contractAreaLS){
// $("#contractWarning").html('<span class="glyphicon glyphicon-exclamation-sign"></span>Warning! By proceeding you are irreversably agreeing to the following contract. Please edit it if you need to make changes. It will be resubmitted until both parties agree.').fadeIn();
//					   
////			return false;
//
// // console.log("oldcontract is different from what's stored in LocalStorage");
////
//
//}
	}
	}

////////////////------------------------------------------------------------------------------------------
///////////////---------------------------------------------------------------------------------------------------------------

	
	
	function contractAjax(){
		var terms = [];
		///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	////////////////////////////////////     Assemble and Submit JSON here:
	MSredeem = "5221021b6fe18e6d6b399a76736afa9afe8f4cd135a090956145595f514ce1757da605210347d782d14958ac6643eb87d4fa201889573d3a8dda66deeb4c68a1b0653c757521034b981a8f9f50994a6565c401daabb5533e2e24f5003ad7bae060b0cfcbde70b753ae";
	
						    terms[0] = MSredeem;
							
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//////////////////////////////           Add contract here:
	
            
			
			var contractArea = ($("#contractArea").val());
			var checksum = ($("#checksum").val());
			
							
							terms[1] = contractArea;
	                        terms[2] = checksum;				
 
//   console.log(sellerEmail);
  //      localStorage.setItem('contractAreaLS', contractArea);
//		localStorage.setItem('checksumLS', checksum);
		

							
		doContractAjax();					
								

	//				    console.log(JSON.stringify(keys));

	function doContractAjax() {
		
		
		var array, ajax;
					
		//Hardcoded data values for demonstration purposes
		//value = 'A string';  
          array = JSON.stringify(terms);
		  
	
		//object = JSON.stringify({first: 'obj_item1', second: 'obj_item2', third: 'obj_item3'});
		//			
		////Pass the values to the AJAX request and specify function arg for 'done' callback
		ajax = theContractAjax(array);
		ajax.done(processContractData);
		ajax.fail(function( jqXHR, textStatus, errorThrown) {
				//Output error information
		});
	
}


function theContractAjax(arr) {
	return $.ajax({
      url: 'https://checkabid.com/btc/contract.php',
  //  contentType: 'application/json',
  //   dataType: 'json',
  processContractData: false,
	 data: arr,
 //data: JSON.stringify(keys),
   //  data: { js_array: arr },
	  type: "POST",
	  cache: false,
      error: function(xhr, desc, err) {
        console.log(xhr);
        console.log("Details: " + desc + "\nError:" + err);
      },
	  success: function(msg) {
      console.log(msg);
	  }
    }); // end ajax call
	
}		
// This takes care of data once returned from Server:
	function processContractData(returnedstuff /*textStatus, jqXHR*/) {
//    console.log(returnedstuff);
//	var response = returnedstuff;
	var response = JSON.parse(returnedstuff);
//	console.log("this here is the JSONparsed response (contract):");
//    console.log(response);

if (response.contractMatch == true) {
	console.log("the contract entry matches or is new");
}
if (response.contractMatch == false) {
	console.log("the contract has been altered");
}
$("#contractWarning").hide();
freshContract = response.data['contractData'];
freshChecksum = response.data['checksumData'];

$("#contractArea").val(freshContract);
$("#checksum").val(freshChecksum);



console.log(freshContract);
localStorage.setItem('contractAreaLS', freshContract);

//  console.log(freshContract);
//  console.log(localStorage.getItem ('contractAreaLS'));
  contractAreaLS = localStorage.getItem ('contractAreaLS');
  
//  localStorage.setItem('contractAreaLS', freshContract);
//		localStorage.setItem('checksumLS', checksum);
// oldContract = localStorage.getItem('contractAreaLS');
$("#contractArea").val(freshContract);
console.log(freshContract);
//  console.log(oldContract);
//  console.log(contractAreaLS);
//if (oldContract != contractAreaLS){
// $("#contractWarning").html('<span class="glyphicon glyphicon-exclamation-sign"></span>Warning! By proceeding you are irreversably agreeing to the following contract. Please edit it if you need to make changes. It will be resubmitted until both parties agree.').fadeIn();
//					   
////			return false;
//
// // console.log("oldcontract is different from what's stored in LocalStorage");
////
//
//}
	}
	}
})
$(function () {

	$("#switch").on('click', function() {
		//console.log($("#unitsToSwitch").html());
		if ($("#unitsToSwitch").html() === "decimal feet") {
			$("#unitsToSwitch").html('feet/inches');
		} else {
			$("#unitsToSwitch").html('decimal feet');
		}
		$("#panelDecimal").toggle(300);
		$("#panelFtIn").toggle(300);
		$(".results").hide();
	})

	$("#calc1").on('click', function() {
		var ft1 = $("#feet1").val();
		var in1 = $("#inches1").val();
		var ft2 = $("#feet2").val();
		var in2 = $("#inches2").val();

		var valid = true, notSingleInput = true;

		if (ft1 === "" && in1 === "" || ft2 === "" && in2 === "") {
			notSingleInput = false;
			var inputOn1 = ft1 != "";
		}

		if (notSingleInput || inputOn1) {var decFt1 = splitInches(ft1, in1, valid);}
		if (notSingleInput || !inputOn1) {var decFt2 = splitInches(ft2, in2, valid);}

		if (notSingleInput) {
			if (isNaN(decFt1) || isNaN(decFt2)) {
			valid = false;
			}
		} else {
			if (inputOn1) {
				valid = isNaN(decFt1) ? false : true;
			} else {
				valid = isNaN(decFt2) ? false : true;
			}
		}
		

		var resultStr;
		if (valid && notSingleInput) {
			var difference = Math.abs(decFt1-decFt2);

			var diffFtIn = convertDecToFrac(difference);
			difference = Math.round(difference*1000)/1000;

			resultStr = $("#feet1").val() + "' " + $("#inches1").val() + "\" - "
				+ $("#feet2").val() + "' " + $("#inches2").val() + "\" = " + difference 
				+ "' or " + diffFtIn;
		} else if (valid) {
			var result = inputOn1 ? decFt1 : decFt2;
			result = Math.round(result*1000)/1000;

			resultStr = inputOn1 ? ($("#feet1").val() + "' " + $("#inches1").val() + "\" = " + result + "'") 
							: ($("#feet2").val() + "' " + $("#inches2").val() + "\" = " + result + "'");
		} else {
			resultStr = "invalid input";
		}

		$("#resultsFtIn").html(resultStr).parent().show(100);
	})

	$("#calc2").on('click', function() {
		var dec1 = $("#dec1").val();
		var dec2 = $("#dec2").val();

		var valid = true, notSingleInput = true;

		if (dec1 === "" || dec2 === "") {
			notSingleInput = false;
			var inputOn1 = dec1 != "";
		}

		if (notSingleInput || inputOn1) {dec1 = parseFloat(dec1);}
		if (notSingleInput || !inputOn1) {dec2 = parseFloat(dec2);}

		if (isNaN(dec1) || isNaN(dec2)) {
			valid = false;
		}

		var resultStr;

		if (valid && notSingleInput) {
			var difference = Math.abs(dec1-dec2);

			var diffFtIn = convertDecToFrac(difference);
			difference = Math.round(difference*1000)/1000;

			resultStr = $("#dec1").val() + "' " + " - "	+ $("#dec2").val() + "' " 
				+ " = " + difference + "' or " + diffFtIn;
		} else if (valid) {
			var result = inputOn1 ? dec1 : dec2;

			var diffFtIn = convertDecToFrac(result);
			result = Math.round(result*1000)/1000;

			resultStr = result + "' = " + diffFtIn;
		} else {
			resultStr = "invalid input";
		}

		$("#resultsDecimal").html(resultStr).parent().show(100);
	})

	$("#openRef").on('click', function() {
		if ($("#openRefTxt").html() === "Open") {
			$("#openRefTxt").html('Close');
		} else {
			$("#openRefTxt").html('Open');
		}
		$(".ref").slideToggle(300);
	})

	$("#clear").on('click', function() {
		$("input").val("");
		$(".results").hide();
	})

	$(".precision").on('click', function() {
		var precision = $(this).html();
		$("#currPrecision").html(precision);
	})

});

function splitInches(feet, inches, valid) {
	var inchesRe = /\s|\//;
	var inchesArr = inches.split(inchesRe);
	var numFt = parseInt(feet);
	var decIn, decFt;

	if (inchesArr.length === 1) {
		decIn = parseInt(inches);
		decFt = numFt + (decIn / 12);
	} else if (inchesArr.length === 2) {
		decIn = parseInt(inchesArr[0]) / parseInt(inchesArr[1]);
		decFt = numFt = (decIn / 12);
	} else if (inchesArr.length === 3) {
		decIn = parseInt(inchesArr[0]) + (parseInt(inchesArr[1]) / parseInt(inchesArr[2]));
		decFt = numFt + (decIn / 12);
	} else {
		valid = false;
	}
	return decFt;
}

function convertDecToFrac(decimal) {

	var feet = Math.floor(decimal);
	var inches = Math.floor((decimal - feet) * 12);
	var inchesFrac = ((decimal - feet) * 12) - inches;
	var precision;
	switch ($("#currPrecision").html()) {
		case ("No fractions"):
			precision = 0; break;
		case ("1/2"):
			precision = 1; break;
		case ("1/4"):
			precision = 2; break;
		case ("1/8"):
			precision = 3; break;
		case ("1/16"): default:
			precision = 4; break;
	}

	var inchesFracStr, num = 0, den = 0;
	decimal = Math.round(decimal*1000)/1000;

	if (precision > 0 && !(inchesFrac === 0)) {
		if (inchesFrac >= 0.5) { // 1/2
			num += 1;
			den += 2;
			inchesFrac -= 0.5;
		}
		if (precision > 1 && inchesFrac >= 0.25) { // 1/4
			num > 0 ? num = (num * 2) + 1 : num += 1;
			den > 0 ? den *= 2 : den += 4;
			inchesFrac -= 0.25
		}
		if (precision > 2 && inchesFrac >= 0.125) { // 1/8
			if (num > 0 && den > 0) {
				if (den === 2) {
					num = (num * 4) + 1;
					den *= 4;
				} else {
					num = (num * 2) + 1;
					den *= 2;
				}
			} else {
				num += 1;
				den += 8;
			}
			inchesFrac -= 0.125;
		}
		if (precision > 3 && inchesFrac >= 0.0625) { // 1/16
			if (num > 0 && den > 0) {
				if (den === 2) {
					num = (num * 8) + 1;
					den *= 8;
				} else if (den === 4) {
					num = (num * 4) + 1;
					den *= 4;
				} else if (den === 8) {
					num = (num * 2) + 1;
					den *= 2;
				} 
			} else {
				num += 1;
				den += 16;
			}
		}
	}

	if (num+den != 0) {
		inchesFracStr = inches + " " + num + "/" + den;
	} else {
		inchesFracStr = inches;
	}

	return feet + "' " + inchesFracStr + "\"";
}
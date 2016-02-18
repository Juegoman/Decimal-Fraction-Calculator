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

		var valid = true;

		var decFt1 = splitInches(ft1, in1, valid);
		var decFt2 = splitInches(ft2, in2, valid);

		if (isNaN(decFt1) || isNaN(decFt2)) {
			valid = false;
		}

		var resultStr;
		if (valid) {
			var difference = Math.abs(decFt1-decFt2);

			var diffFtIn = convertDecToFrac(difference);
			difference = Math.round(difference*1000)/1000;

			resultStr = $("#feet1").val() + "' " + $("#inches1").val() + "\" - "
				+ $("#feet2").val() + "' " + $("#inches2").val() + "\" = " + difference 
				+ "' or " + diffFtIn;
		} else {
			resultStr = "invalid input";
		}

		$("#resultsFtIn").html(resultStr).parent().show(100);
	})

	$("#calc2").on('click', function() {
		var dec1 = $("#dec1").val();
		var dec2 = $("#dec2").val();

		var valid = true;

		dec1 = parseFloat(dec1);
		dec2 = parseFloat(dec2);

		if (isNaN(dec1) || isNaN(dec2)) {
			valid = false;
		}

		var resultStr;

		if (valid) {
			var difference = Math.abs(dec1-dec2);

			var diffFtIn = convertDecToFrac(difference);
			difference = Math.round(difference*1000)/1000;

			resultStr = $("#dec1").val() + "' " + " - "	+ $("#dec2").val() + "' " 
				+ " = " + difference + "' or " + diffFtIn;
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
});

function splitInches(feet, inches, valid) {
	var inchesRe = /\s|\//;
	var inchesArr = inches.split(inchesRe);
	var numFt = parseInt(feet);
	var decIn, decFt;

	if (inchesArr.length === 1) {
		decIn = parseInt(inches);
		decFt = numFt + (decIn / 12);
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

	var inchesFracStr, num = 0, den = 0;
	decimal = Math.round(decimal*1000)/1000;

	if (!(inchesFrac === 0)) {
		if (inchesFrac >= 0.5) { // 1/2
			num += 1;
			den += 2;
			inchesFrac -= 0.5;
		}
		if (inchesFrac >= 0.25) { // 1/4
			num > 0 ? num = (num * 2) + 1 : num += 1;
			den > 0 ? den *= 2 : den += 4;
			inchesFrac -= 0.25
		}
		if (inchesFrac >= 0.125) { // 1/8
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
		if (inchesFrac >= 0.0625) { // 1/16
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
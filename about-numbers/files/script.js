// =========================================================================
// define global variables and functions ===================================

let inputElem = document.querySelector("input");
let table = document.querySelector("table");
inputElem.value = "";

// =========================================================================
// insert table data =======================================================

inputElem.addEventListener("input", function(e) {
	if(Number(inputElem.value) && inputElem.value.length > 0){
		setTable();
	} else {
		for(let i = 1; i < table.children[0].children.length; i++) {
			let thisTD = table.children[0].children[i].children[1];
			thisTD.innerHTML = "";
		}
	}
});

function setTable() {
	function setAyaCount() {
		let ayaCount = document.querySelector("#ayaCount");
		if(inputElem.value > 0 && inputElem.value < 287) {
			let ayaCounter = 0;
			for(let i = 0; i < suraLength.length; i++) {
				if(suraLength[i] >= inputElem.value) {
					ayaCounter += 1;
				}
			}
			ayaCount.innerHTML = ayaCounter;
		} else {
			ayaCount.innerHTML = "";
		}
	}
	setAyaCount();

	function setSuraName() {
		let suraName = document.querySelector("#suraName");
		if(inputElem.value > 0 && inputElem.value < 115) {
			let thisSuraNmae = suraElements[inputElem.value - 1].getAttribute("name");
			suraName.innerHTML = thisSuraNmae;
		} else {
			suraName.innerHTML = "";
		}
	}
	setSuraName();

	function getFixedAyas() {
		let fixedAyas = document.querySelector("#fixedAyas");
		let fixedAyasArray = "";
		for(let i = 0; i < suraLength.length; i++) {
			if(suraLength[i] == inputElem.value) {
				fixedAyasArray += suraElements[i].getAttribute("name") + "(سورهٔ" + getArabicNum(i + 1) + ")" + " ";
			}
		}
		if(fixedAyasArray != "") {
			fixedAyas.innerHTML = fixedAyasArray;
		} else {
			fixedAyas.innerHTML = "";
		}
	}
	getFixedAyas();

	function getSameSuraAya() {
		let sameSuraAya = document.querySelector("#sameSuraAya");
		if(suraElements[inputElem.value - 1] && suraElements[inputElem.value - 1].children.length >= inputElem.value) {
			let thisAya = suraElements[inputElem.value - 1].children[inputElem.value - 1].getAttribute("text");
			sameSuraAya.innerHTML = thisAya;
		} else {
			sameSuraAya.innerHTML = "";
		}
	}
	getSameSuraAya();

	function getQRValueNumber() {
		let QR_numberValue = document.querySelector("#QR-numberValue");
		let chosenRoots = "";
		for(let i = 0; i < quranRoots_numberValue.length; i++) {
			if(quranRoots_numberValue[i] == inputElem.value) {
				chosenRoots += rootElements[i].getAttribute("r") + " ";
			}
		}
		if(chosenRoots != "") {
			QR_numberValue.innerHTML = chosenRoots;
		} else {
			QR_numberValue.innerHTML = "";
		}
	}
	getQRValueNumber();

	function getRelatedLetter() {
		let relatedLetter = document.querySelector("#relatedLetter");
		let chosenLetter = "";
		for(let i = 0; i < abjad_numbers.length; i++) {
			if(abjad_numbers[i] == inputElem.value) {
				chosenLetter = abjad_letters[i];
				break;
			}
		}
		if(chosenLetter != "") {
			relatedLetter.innerHTML = chosenLetter;
		} else {
			relatedLetter.innerHTML = "";
		}
	}
	getRelatedLetter();


}

// =========================================================================
// reading quran xml data ==================================================

parser = new DOMParser();
xmlDoc = parser.parseFromString(innerXML,"text/xml");

// =========================================================================
// defining global variables and functions =================================

// xml elements which contain sura data:
let suraElements = xmlDoc.querySelectorAll('quran sura');
// xml elements which contain data for all available quranic roots (according to database of this websites):
let rootElements = xmlDoc.querySelectorAll('quran r');
// number of ayas in each sura:
let suraLength = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
// arabic numbers:
let arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
// the drop-down list of sura names (where user can choose a sura from):
let suraSelector = document.getElementById("suraSelector");
let suraSelector_2 = document.getElementById("suraSelector_2");
// the drop-down list of specific numbers (where user can choose a aya number from):
let ayaSelector = document.getElementById("ayaSelector");
// in this division all quranic roots will be shown:
let rootDivision_left = document.getElementById("rootDivision_left");
// in this division all chosen roots will be shown:
let rootDivision_right = document.getElementById("rootDivision_right");
// this function converts default english number to arabic numbers (returns string):
function getArabicNum(num) {
    num = num.toString();
    let arabicNum = ""
    for(let i = 0; i < num.length; i++) {
        arabicNum = arabicNum + arabicNumbers[Number(num[i])];
    }
    return arabicNum;
}
// translation checkboxes:
let Ghomshei_trans_checkBox = document.querySelector("#Ghomshei_trans");
let Fooladvand_trans_checkBox = document.querySelector("#Fooladvand_trans");
let Gharaati_trans_checkBox = document.querySelector("#Gharaati_trans");
let transCheckBoxes = document.querySelector("#suraSelection").querySelectorAll("input");
let inputElement = document.getElementById("input");
let addRange = document.querySelectorAll(".add-more-aya");

// =========================================================================
// preparing quran ayas (main function) ====================================

// this function prepares and returns any specified range of ayas within specified sura.

function prepareQuran(sura, ayaStart, ayaEnd, showBismillah, mergeBismillah) {
    if(ayaStart == undefined) {ayaStart = 1}; // ---> if starting aya is not specified set it to 1
    if(ayaEnd == undefined) {ayaEnd = suraLength[sura - 1]} // ---> if ending aya is not specified prepare the whole sura
    if(showBismillah == undefined) {showBismillah = true}; // ---> if having bismillah at the beginning of sura is not specified, lets have it
    if(mergeBismillah == undefined ) {mergeBismillah = false} // ---> if merging bismillah with first aya is not specified, don't do it
    // .....................................................................
    // merging bismillah with first aya (if is specified) ..................
    if(mergeBismillah == true && sura != 1 && sura != 9) {
        let bismillahAya_text = suraElements[0].querySelector("aya").getAttribute("text");
        let firstAyahElement = suraElements[sura - 1].querySelector("aya");
        let firstAyah_text = firstAyahElement.getAttribute("text");
        let firstAyahWithBismillah_text = bismillahAya_text + " " + firstAyah_text;
        // store aya text to some attribute so we can restore it to initial value later:
        firstAyahElement.setAttribute("initial_text", firstAyah_text);
        // change the value for aya text to merged text:
        firstAyahElement.setAttribute("text", firstAyahWithBismillah_text);
        // repeat above process for quran roots:
        let bismillahAya_roots = suraElements[0].querySelector("aya").getAttribute("roots");
        let firstAyah_roots = firstAyahElement.getAttribute("roots");
        let firstAyahWithBismillah_roots = bismillahAya_roots + " " + firstAyah_roots;
        // store aya roots to some attribute so we can restore it to initial value later:
        firstAyahElement.setAttribute("initial_roots", firstAyah_roots);
        // change the value for aya roots to merged root text:
        firstAyahElement.setAttribute("roots", firstAyahWithBismillah_roots);
        // set "merged" attribute to yes so later we can know whether it has been merged or not:
        firstAyahElement.setAttribute("merged", "yes");
    }
    // this is the main fragment ---> all paragraphs will be appended to this fragment:
    let fragment = document.createDocumentFragment();
    // .....................................................................
    // prepare and add bismillah to the beginning of sura ..................
    if(sura != 1 && sura != 9 && showBismillah == true && ayaStart == 1) {
        let pElement_bismillah = document.createElement("p");
        bismillahWords = suraElements[0].querySelector("aya").getAttribute("text").split(" ");
        bismillahRoots = suraElements[0].querySelector("aya").getAttribute("roots").split(" ");
        // bismillahTrans = suraElements[0].querySelector("aya").getAttribute("trans");
        bismillahTrans = "به نام خداوند بخشندهٔ مهربان"
        // loop through each word of bismillah aya and put it in span elements:
        for(let i = 0; i < bismillahWords.length; i++) {
        	let spanElement_word = document.createElement("span");
        	let thisWord_Text = document.createTextNode(bismillahWords[i]);
            let bsp = document.createTextNode(" ");
            // ...
            let spanElement_root = document.createElement("span");
            spanElement_root.setAttribute("class", "tooltip");
            let thisWord_root = document.createTextNode(bismillahRoots[i]);
            spanElement_root.appendChild(thisWord_root);
            // ...
            spanElement_word.appendChild(thisWord_Text);
            spanElement_word.appendChild(spanElement_root);
            pElement_bismillah.appendChild(spanElement_word);
            pElement_bismillah.appendChild(bsp);
        }
        // add translation for bismillah aya
        let brElement = document.createElement("br");
        pElement_bismillah.appendChild(brElement); // ---> line break between aya and translation
        let spanElement_trans = document.createElement("span");
        spanElement_trans.setAttribute("class", "translate");
        let textNode_trans = document.createTextNode(bismillahTrans);
        spanElement_trans.appendChild(textNode_trans);
        pElement_bismillah.appendChild(spanElement_trans);
        fragment.appendChild(pElement_bismillah);
    }
    // .....................................................................
    // prepare ayas in specified range .....................................
    for(let i = ayaStart; i < ayaEnd + 1; i++) { // ---> loop through given range of ayas
        let pElement_thisAya = document.createElement("p");
        thisAyaWords = suraElements[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("text").split(" ");
        // fixing inconsistency in aya 37:130
        if(i == 130 && sura == 37) {
            // putting two words in one span tag, so it will be treated as a single word.
            thisAyaWords = [ "سَلَامٌ", "عَلَى", "إِلْ يَاسِينَ" ];
        }
        thisAyaRoots = suraElements[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("roots").split(" ");
        // loop through each word of this aya and put it in span Element:
        for(let j = 0; j < thisAyaWords.length; j++) {
        	// preparing span element for this root:
            let spanElement_thisRoot = document.createElement("span");
            spanElement_thisRoot.setAttribute("class", "tooltip");
            if(thisAyaRoots[j].indexOf("|") != -1) { // --> if this root has multiple roots: 
            	let multiRoots = thisAyaRoots[j].split("|");
            	for(let k = 0; k < multiRoots.length; k++) {
            		let bsp = document.createTextNode(" ");
            		let aElement = document.createElement("a");
                    // get the index of this root
                    let RootIndex = "";
                    for(let l = 0; l < rootElements.length; l++) {  // ---> finding related xml information Element of this root
                        if(rootElements[l].getAttribute("r") == multiRoots[k]) {
                            RootIndex = l;
                        }
                    }
                    aElement.setAttribute("onclick", "chooseThisRoot('" + RootIndex + "')");
            		aElement.style.cursor = "pointer";
            		aElement.appendChild(document.createTextNode(multiRoots[k]));
            		spanElement_thisRoot.appendChild(bsp);
            		spanElement_thisRoot.appendChild(aElement);
            	}
            }else {	// ---> if this root is a single root: 
            	let aElement = document.createElement("a");
            	aElement.appendChild(document.createTextNode(thisAyaRoots[j]));
                // get the index of this root
                let RootIndex = "";
                for(let l = 0; l < rootElements.length; l++) {  // ---> finding related xml information Element of this root
                    if(rootElements[l].getAttribute("r") == thisAyaRoots[j]) {
                        RootIndex = l;
                    }
                }
                // ...
            	aElement.setAttribute("onclick", "chooseThisRoot('" + RootIndex + "')");
                aElement.style.cursor = "pointer";
            	spanElement_thisRoot.appendChild(aElement);
            }
			// preparing span element for this word:
            let spanElement_thisWord = document.createElement("span");
            spanElement_thisWord.style.position = "relative";
            spanElement_thisWord.setAttribute("data-root", thisAyaRoots[j]);
            let thisWord = document.createTextNode(thisAyaWords[j]);
            let bsp = document.createTextNode(" ");
            // ...
            spanElement_thisWord.appendChild(thisWord);
            spanElement_thisWord.appendChild(spanElement_thisRoot);
			// ...
            pElement_thisAya.appendChild(spanElement_thisWord);
            pElement_thisAya.appendChild(bsp);
        }
        // .................................................................
        // add sura name and aya number ....................................
        let spanElement_address = document.createElement("span");
        spanElement_address.setAttribute("title", getArabicNum(suraElements[sura - 1].getAttribute("index")) + ":" + getArabicNum(i));
        let thisAyaAddress = document.createTextNode("﴿" + suraElements[sura - 1].getAttribute("name") + " " + getArabicNum(i) + "﴾");
        // setting id attribute:
        let spanElement_id = suraElements[sura - 1].getAttribute("index") + ":" + i;
        spanElement_address.setAttribute("id", spanElement_id);
        // setting a click handler for revealing the aya in its sura:
        spanElement_address.setAttribute("onclick", "revealInSura(" + "'" + spanElement_id + "'" + ")");
        // appending and styling:
        spanElement_address.appendChild(thisAyaAddress);
        spanElement_address.setAttribute("class", "ayaAddress")
        spanElement_address.style.color = "#0D4D00";
        spanElement_address.style.fontSize = "80%"
        spanElement_address.style.cursor = "pointer";
        pElement_thisAya.appendChild(spanElement_address);
        // .................................................................
        // add aya translation .............................................
        // this fragment holds translations:
        let fragment_translation = document.createDocumentFragment();
        let chosenTrans = 0;
        let setTrans = 0;
        for(let k = 0; k < transCheckBoxes.length; k++) {
        	if(transCheckBoxes[k].checked == true){chosenTrans += 1};
        }
        if(Fooladvand_trans_checkBox.checked == true && chosenTrans == 1) {
        	thisAyaTrans = suraElements[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("trans");
        	thisAyaTrans = document.createTextNode(thisAyaTrans);
        	fragment_translation.appendChild(thisAyaTrans);
        } else {
        	if(Ghomshei_trans_checkBox.checked == true){
        		let GhomsheiTranslation = suraTranslations_Ghomshei[sura - 1].children[i - 1].getAttribute('text');
        		if(chosenTrans == 1) {
        			GhomsheiTranslation = document.createTextNode(GhomsheiTranslation);
        		} else {
        			GhomsheiTranslation = document.createTextNode("قمشه‌ای: " + GhomsheiTranslation);
        		}
        		fragment_translation.appendChild(GhomsheiTranslation);
        		setTrans += 1;
        		if(setTrans != chosenTrans) {fragment_translation.appendChild(document.createElement("br"))};
        	}
        	if(Fooladvand_trans_checkBox.checked == true) {
        		let FooladvandTranslation = suraElements[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("trans");
        		FooladvandTranslation = document.createTextNode("فولادوند: " + FooladvandTranslation);
        		fragment_translation.appendChild(FooladvandTranslation);
        		setTrans += 1;
        		if(setTrans != chosenTrans) {fragment_translation.appendChild(document.createElement("br"))};
        	}
        	if(Gharaati_trans_checkBox.checked == true){
        		let GharaatiTranslation = suraTranslations_Gharaati[sura - 1].children[i - 1].getAttribute('text');
        		if(chosenTrans == 1) {
        			GharaatiTranslation = document.createTextNode(GharaatiTranslation);
        		} else {
        			GharaatiTranslation = document.createTextNode("قرائتی: " + GharaatiTranslation);
        		}
        		fragment_translation.appendChild(GharaatiTranslation);
        	}
        }
        let brElement_trans = document.createElement("br"); // ---> line break between aya and translation
        pElement_thisAya.appendChild(brElement_trans);
        let spanElement_trans = document.createElement("span");
        spanElement_trans.setAttribute("class", "translate");
        // spanElement_trans.innerHTML = "فولادوند: " + thisAyaTrans;
        spanElement_trans.appendChild(fragment_translation);
        pElement_thisAya.appendChild(spanElement_trans);
        // .................................................................
        // append each paragraph to the fragment .........................
        fragment.appendChild(pElement_thisAya);
    }
    // .....................................................................
    // unmerge bismillah from first aya if it's merged ...................
    let firstAyah = suraElements[sura - 1].querySelector("aya");
    if(firstAyah.getAttribute("merged") == "yes") {
        firstAyah.setAttribute("text", firstAyah.getAttribute("initial_text"));
        firstAyah.setAttribute("roots", firstAyah.getAttribute("initial_roots"));
        firstAyah.setAttribute("merged", "no");
    }
    // .....................................................................
    // return fragment .....................................................
    return fragment // --> return fragment to whoever called this function.
}

// =========================================================================
// responsive items in sura text ===========================================

// this function sets event listeners for tooltips:
function setEventHandlers() {
	let currentAyas = ayaDivision.children;
	for(let i = 0; i < currentAyas.length; i++) {
		let thisAyaChilds = currentAyas[i].children;
		for(let j = 0; j < thisAyaChilds.length; j++) {
			if(thisAyaChilds[j].getAttribute("data-root")) {
				thisAyaChilds[j].addEventListener("mouseover", function(e) {
		            let tooltip = e.target.children[0];
		            tooltip.style.display = "inline";
		        });
		        thisAyaChilds[j].addEventListener("mouseleave", function(e) {
		            let tooltip = e.target.children[0];
		            tooltip.style.display = "none";
		        });
			}
		}
	}
}

function chooseThisRoot(rootIndex) {
	let currentURL = document.URL;
    if(currentURL.indexOf("#") != -1) {
        currentURL = currentURL.slice(0, currentURL.indexOf("#"));
    }
    window.open(currentURL + "#" + rootIndex);
}

function revealInSura(ayaId) {
    let currentURL = document.URL;
    if(currentURL.indexOf("#") != -1) {
        currentURL = currentURL.slice(0, currentURL.indexOf("#"));
    }
    window.open(currentURL + "#" + ayaId);
}

// =========================================================================
// print sura ==============================================================

// this function creates the options of drop-down list of sura names (where user can choose a sura from)
function setSuraOptions() {
    for(let i = 0; i < suraElements.length; i++) {
        let thisSuraName = suraElements[i].getAttribute("name");
        let thisSuraNum = getArabicNum(i + 1);
        let option = document.createElement("option");
        let thisOptionText = thisSuraNum + ") " + thisSuraName;
        option.text = thisOptionText;
        option.value = i + 1;
        suraSelector.add(option);
    }
}
setSuraOptions();

let lastChosenAyas = "";

// when the user chooses a sura this functions will be called and that sura will be printed on the page:
function printSura() {
    let thisSuraNum = suraSelector.options[suraSelector.selectedIndex].value;
    ayaDivision.innerHTML = "";
    ayaDivision.appendChild(prepareQuran(Number(thisSuraNum), undefined, undefined, true, false));
    lastChosenAyas = ayaDivision.innerHTML;
    setEventHandlers();
    // clearing root search box:
    arrayStore.length = 0;
    rootDivision_left.innerHTML = "";
    //rootDivision_left.innerHTML = rootDivisionInitial_left;
    rootBox_setInitial_chosen();
    rootDivision_right.innerHTML = "";
    inputElement.value = "";
    // aya addresses shouldn't be clickable:
    let ayaAddresses = document.getElementsByClassName("ayaAddress");
    for(let k = 0; k < ayaAddresses.length; k++) {
        ayaAddresses[k].removeAttribute("onclick");
        ayaAddresses[k].style.cursor = "auto";
    }
}

// =========================================================================
// print ayas by number ====================================================

function setAyaOptions() {
    for(let i = 0; i < 286; i++) {
        let thisNum = getArabicNum(i + 1);
        let option = document.createElement("option");
        let thisOptionText = "آیات شماره " + thisNum;
        option.text = thisOptionText;
        option.value = i + 1;
        ayaSelector.add(option);
    }
}
setAyaOptions();

//this function prints ayas based on chosen number
function printAyasByNumber() {
    let num = Number(ayaSelector.options[ayaSelector.selectedIndex].value);
    ayaDivision.innerHTML = "";
    for(let i = 0; i < suraLength.length; i++) {
        if(suraLength[i] >= num) {
            let thisAya = prepareQuran(i + 1, num, num, false, false).children[0];
            ayaDivision.appendChild(thisAya);
        }
    }
    lastChosenAyas = ayaDivision.innerHTML;
    setEventHandlers();
    rootBox_setInitial_chosen();
}

// =========================================================================
// add more ayas ===========================================================

function chooseSura(e) {
    let thisSura = e.target.value;
    if(thisSura < 115 && thisSura > 0) {
        addRange[1].options.length = 0;
        addRange[2].options.length = 0;
        let lastAya = suraLength[thisSura - 1];
        for(let i = 1 ; i <= lastAya; i++) {
            let thisOption = document.createElement("option");
            thisOption.text = i;
            thisOption.value = i;
            addRange[1].add(thisOption);
        }
        addRange[1].addEventListener("click",function() {
            addRange[2].options.length = 0
            for(let i = addRange[1].value ; i <= lastAya; i++) {
                let thisOption = document.createElement("option");
                thisOption.text = i;
                thisOption.value = i;
                addRange[2].add(thisOption);
            }
        });
    }
    if(addRange[0].value == "") {addRange[1].options.length = 0}
}

addRange[0].addEventListener("keyup",chooseSura);
addRange[0].addEventListener("change",chooseSura);

function printAyasByRange() {
    ayaDivision.appendChild(prepareQuran(Number(addRange[0].value), Number(addRange[1].value), Number(addRange[2].value), false, false));
    rootBox_setInitial_chosen();
    lastChosenAyas = ayaDivision.innerHTML;
    setEventHandlers();
}

// =========================================================================
// preparing ayas which contain specific root ==============================

// this function prepares ayas which contain specified root
function getAyaByRoot(thisroot) {
    let thisroot_xmlInfoElement;
    for(i = 0; i < rootElements.length; i++) {  // ---> finding related xml information Element of this root
        if(rootElements[i].getAttribute("r") == thisroot) {
            thisroot_xmlInfoElement = rootElements[i]
        }
    }
    // parsing the text node of xml <a> Element
    // these data contain the exact address (index) of the root in quran:
    let involvedAyas_xmlElements = thisroot_xmlInfoElement.querySelector("a").textContent;
    involvedAyas_xmlElements = involvedAyas_xmlElements.split("#");
    // crating a fragment to hold ayas paragraph Elements:
    let involedAyas_fragment = document.createDocumentFragment();
    // this is a counter for numbering the roots (the occurance number of this root from the begining of quran):
    let counter_rootOccurance = 1;
    // this is a counter for while loop:
    let counter_while = 0;
    // looping through ayas which contain this root and calling PrintQuran function for each to get the aya paragraph:
    while(counter_while < involvedAyas_xmlElements.length) {
    	let details = ""
        // assigning the index of this occurance to a variable:
            // the format of xml Element indexes are "number.number.number"
            // first number is sura number, second number is aya number and third numbet is word index:
        let thisOccuranceInfo = involvedAyas_xmlElements[counter_while].split(".");
        let thisInvolvedSura_num = Number(thisOccuranceInfo[0]); // ---> sura number
        let thisInvolvedAyah_num = Number(thisOccuranceInfo[1]); // ---> aya number
        let thisInvolvedWord = thisOccuranceInfo[2]; // ---> word number (index)
        // calling prepareQuran function passing each address to it to get the paragraph Element of that aya:
        let thisInvolvedAyah_pElement = prepareQuran(thisInvolvedSura_num, thisInvolvedAyah_num, thisInvolvedAyah_num, false, true).children[0];
        // .................................................................
        // styling and numbering ...........................................
        // changing the color of root words:
        if(!isNaN(thisInvolvedWord)) { // ---> if this aya has only one root in it:
            thisInvolvedAyah_pElement.children[thisInvolvedWord - 1].style.color = "red"; 
            // setting the root occurance nubmer............................
            let spanElement_rootOccurance = document.createElement("span");
            spanElement_rootOccurance.setAttribute("class", "rootOccurance");
            // the br Element which is located betwen aya text and translation:
            let brElementPosition = thisInvolvedAyah_pElement.children[thisInvolvedAyah_pElement.children.length - 2];
            // the text which shows the root occurance nubmer:
            let text_rootOccurance = " " + "---" + " " + "ریشه «" + thisroot + "» شماره" + "\u202F" + getArabicNum(counter_rootOccurance);
            let textNode_rootOccurance = document.createTextNode(text_rootOccurance);
            spanElement_rootOccurance.appendChild(textNode_rootOccurance);
            // inserting the elment before br Element:
            thisInvolvedAyah_pElement.insertBefore(spanElement_rootOccurance, brElementPosition);
            // incrementing counter for next use (for counting next oocurance of root):
            counter_rootOccurance = counter_rootOccurance + 1;
        } else { // ---> if this aya has multiple roots in it
            // spliting multiple roots to single roots:
            let thisInvolvedWords = thisInvolvedWord.split(",");
            // setting the root occurance nubmer............................
            let spanElement_rootOccurance = document.createElement("span");
            spanElement_rootOccurance.setAttribute("class", "rootOccurance");
            let brElementPosition = thisInvolvedAyah_pElement.children[thisInvolvedAyah_pElement.children.length - 2];
            let multiNumbers = "";
            // looping through aya words to indicate and style the root words:
            for(let j = 0; j < thisInvolvedWords.length; j++) {
                thisInvolvedAyah_pElement.children[Number(thisInvolvedWords[j] - 1)].style.color = "red";
                // multiple numbers (root occurance numbers) will be assigned to this string:
                multiNumbers = multiNumbers + getArabicNum(counter_rootOccurance) + " و ";
                // incrementing counter for next use (for counting next oocurance of root):
                counter_rootOccurance = counter_rootOccurance + 1;
            }
            multiNumbers = multiNumbers.slice(0, -3); // ---> removing extra " و " from the end
            // this is the text wich shows the root occurance nubmer:
            let text_rootOccurance = " " + "---" + " " + "ریشه «" + thisroot + "» شماره" + "\u202F" + multiNumbers;
            let textNode_rootOccurance = document.createTextNode(text_rootOccurance);
            spanElement_rootOccurance.appendChild(textNode_rootOccurance);
            thisInvolvedAyah_pElement.insertBefore(spanElement_rootOccurance, brElementPosition);
        }
        // adding "*" ......................................................
        // adding asterisk between first aya and merged bismillah
        // we add this asterisk after styling so it doesn't get styled:
        if(thisInvolvedSura_num != 1 && thisInvolvedSura_num != 9 && thisInvolvedAyah_num == 1) {
            // inserting asterisk between merged bismillah and the aya:
            let asterisk = document.createTextNode("* ");
            thisInvolvedAyah_pElement.insertBefore(asterisk, thisInvolvedAyah_pElement.children[4]);
    	}
        // appending this paragraph Element to fragment:
        involedAyas_fragment.appendChild(thisInvolvedAyah_pElement);
        // incrementing counter for next use (for getting next involved aya):
        counter_while += 1;
    }
    // returning fragment to whoever called this function
    // first element of returned array is the fragment and second element is the xml info of chosen root:
    arrayToReturn = [involedAyas_fragment, thisroot_xmlInfoElement];
    return arrayToReturn;
}

// document.body.appendChild(getAyaByRoot("و")[0]);

// =========================================================================
// search your root ========================================================

//this block of code handles the input Element where users can search for a root in:

// .........................................................................
// equalizing different farsi and arebic letters ...........................

// some arabic letters are different from farsi letters.
// here we let user choose a root using farsi letters.

// storing all available roots in an array:
availableRoots_arabic = [];
for(let i = 0; i < rootElements.length; i++) {
    availableRoots_arabic[i] = rootElements[i].getAttribute("r");
}

let alternativeLetters_arabic = ["ك", "ي", "ى", "أ", "إ", "ؤ", "ة"];
let alternativeLetters_farsi = ["ک", "ی", "ی", "ا", "ا", "و", "ه"];
let availableRoots_farsi = [];

// converting arabic letters to farsi in all available root words:
for(let i = 0; i < availableRoots_arabic.length; i++) {
    thisWord = "";
    for(let j = 0; j < availableRoots_arabic[i].length; j++) {
        switch(availableRoots_arabic[i][j]) {
            case alternativeLetters_arabic[0]:
                thisWord = thisWord + alternativeLetters_farsi[0];
                break;
            case alternativeLetters_arabic[1]:
                thisWord = thisWord + alternativeLetters_farsi[1];
                break;
            case alternativeLetters_arabic[2]:
                thisWord = thisWord + alternativeLetters_farsi[2];
                break;
            case alternativeLetters_arabic[3]:
                thisWord = thisWord + alternativeLetters_farsi[3];
                break;
            case alternativeLetters_arabic[4]:
                thisWord = thisWord + alternativeLetters_farsi[4];
                break;
            case alternativeLetters_arabic[5]:
                thisWord = thisWord + alternativeLetters_farsi[5];
                break;
            case alternativeLetters_arabic[6]:
                thisWord = thisWord + alternativeLetters_farsi[6];
                break;
            default:
                thisWord = thisWord + availableRoots_arabic[i][j];
        }
    }
    availableRoots_farsi[i] = thisWord;
}

// .........................................................................
// root selection ..........................................................

// in this division ayas will be shown:
let ayaDivision = document.getElementById("ayaDivision");
let whole_radioButton = document.querySelector("#whole");
let chosen_radioButton = document.querySelector("#chosen");
let rootDivisionInitial_left = "";

function rootBox_setInitial_whole() {
    let ulElement = document.createElement("ul");
    for(let i = 0; i < availableRoots_arabic.length; i++) {
        // this list:
        let thisLi = document.createElement("li");
        // this root text:
        let aElement_thisRoot = document.createElement("a");
        let href_aElement = "javascript:rootDistributor('" + availableRoots_arabic[i] + "')";
        aElement_thisRoot.setAttribute("href", href_aElement);
        let thisRoot = document.createTextNode(availableRoots_arabic[i]);
        aElement_thisRoot.appendChild(thisRoot);
        // number of ayas which contain this root (in whole quran):
        let spaneElement_howManyAyas = document.createElement("span");
        spaneElement_howManyAyas.setAttribute("class", "howManyAyas");
        let howManyAyas = rootElements[i].querySelector("a").textContent.split("#").length;
        howManyAyas = getArabicNum(howManyAyas);
        let bsp_2 = document.createTextNode(" ");
        howManyAyas = document.createTextNode(howManyAyas);
        spaneElement_howManyAyas.appendChild(howManyAyas);
        thisLi.appendChild(aElement_thisRoot);
        thisLi.appendChild(spaneElement_howManyAyas);
        thisLi.appendChild(bsp_2);
        
        thisLi.setAttribute("id", availableRoots_farsi[availableRoots_arabic.indexOf(availableRoots_arabic[i])]);
        ulElement.appendChild(thisLi);
    }
    rootDivision_left.appendChild(ulElement);
    rootDivisionInitial_left = rootDivision_left.innerHTML;
}

function rootBox_setInitial_chosen() {
    let pElements_ayaBox = ayaDivision.getElementsByTagName("p"); // ---> current ayas on page
    if(pElements_ayaBox.length == 0){return false};
    // =====================================================================
    // create an array from all roots in all ayas in ayaDivision ===========
    function getRootArray_ayaDivision () {
        let rootArray_ayaDivision = [];
        // crating a root array of this aya ................................
        for(let l = 0; l < pElements_ayaBox.length; l++){
            let rootArray_thisAya = [];
            let spanElements_thisPtag = pElements_ayaBox[l].children;
            let counter_while = 0;
            // get the right span Elements:
            while(spanElements_thisPtag[counter_while].getAttribute("data-root")) {
                let thisAyaRoot = spanElements_thisPtag[counter_while].getAttribute("data-root");
                if(thisAyaRoot.indexOf("|") != -1){
                    thisAyaRoot = thisAyaRoot.split("|");
                }
                rootArray_thisAya.push(thisAyaRoot);
                counter_while += 1;
            }
            rootArray_ayaDivision.push(rootArray_thisAya);
        }
        return rootArray_ayaDivision;
    }
    let rootArray_ayaDivision = getRootArray_ayaDivision();

    // =====================================================================
    // creating master root array ==========================================    
    function allAvailableRoots_ayaBox() {
        let rootArray_ayaDivision = getRootArray_ayaDivision();
        // removing duplicate elements from each aya and pushing it in "master root array":
        let rootsMasterArray = [];
        for(let i = 0; i < rootArray_ayaDivision.length; i++){
            let thisAyaRoots = [];
            for(let j = 0; j < rootArray_ayaDivision[i].length; j++){
                if(typeof rootArray_ayaDivision[i][j] == "string") {
                    thisAyaRoots.push(rootArray_ayaDivision[i][j]);
                }else{
                    for(let k = 0; k < rootArray_ayaDivision[i][j].length; k++){
                        thisAyaRoots.push(rootArray_ayaDivision[i][j][k]);
                    }
                }
            }
            let thisAyaRoots_unique = thisAyaRoots.filter(function(item, pos) {
                return thisAyaRoots.indexOf(item) == pos;
            })
            // pushing all elements to rootsMasterArray:
            for(let l = 0; l < thisAyaRoots_unique.length; l++){
                rootsMasterArray.push(thisAyaRoots_unique[l]);
            }
        }
        return rootsMasterArray;
    }
    let allRoots_toGather = allAvailableRoots_ayaBox();

    // =====================================================================
    // prepare all available roots to gather ===============================
    // improve array of available roots which can be gathered in one aya with specifed root
    function allRoots_toGather_improve(allRoots_toGather) {
        var map = allRoots_toGather.reduce(function(prev, cur) {
            prev[cur] = (prev[cur] || 0) + 1;
            return prev;
        }, {});
        let allRoots_toGather_roots = Object.keys(map).sort(function(a,b){return map[a]-map[b]}).reverse()
        let allRoots_toGather_occurance = Object.values(map).sort(function(a, b){return b-a});
        allRoots_toGather = [allRoots_toGather_roots, allRoots_toGather_occurance];
        return allRoots_toGather
    }
    allRoots_toGather = allRoots_toGather_improve(allRoots_toGather);
    // =====================================================================
    // set rootBox =========================================================
    function setRootBox() {
        rootDivision_left.innerHTML = ""
        let ulElement = document.createElement("ul");
        for(let i = 0; i < allRoots_toGather[0].length; i++) {
            // this list:
            let thisLi = document.createElement("li");
            // this root text:
            let aElement_thisRoot = document.createElement("a");
            let href_aElement = "javascript:rootDistributor('" + allRoots_toGather[0][i] + "', true)";
            aElement_thisRoot.setAttribute("href", href_aElement);
            let thisRoot = document.createTextNode(allRoots_toGather[0][i]);
            aElement_thisRoot.appendChild(thisRoot);
            // number of ayas which contain this root (in whole quran):
            let spaneElement_howManyAyas = document.createElement("span");
            spaneElement_howManyAyas.setAttribute("class", "howManyAyas");
            let howManyAyas = allRoots_toGather[1][i];
            howManyAyas = getArabicNum(howManyAyas);
            let bsp_2 = document.createTextNode(" ");
            howManyAyas = document.createTextNode(howManyAyas);
            spaneElement_howManyAyas.appendChild(howManyAyas);
            thisLi.appendChild(aElement_thisRoot);
            thisLi.appendChild(spaneElement_howManyAyas);
            thisLi.appendChild(bsp_2);
            
            thisLi.setAttribute("id", availableRoots_farsi[availableRoots_arabic.indexOf(availableRoots_arabic[i])]);
            ulElement.appendChild(thisLi);
        }
        rootDivision_left.appendChild(ulElement);
        rootDivisionInitial_left = rootDivision_left.innerHTML;
    }
    setRootBox();
}

whole_radioButton.onclick = function() {
    rootDivision_left.innerHTML = "";
    rootDivision_right.innerHTML = "";
    ayaDivision.innerHTML = "";
    rootBox_setInitial_whole();
    inputElement.disabled = false;
}
chosen_radioButton.onclick = function() {
    rootDivision_left.innerHTML = "";
    rootDivision_right.innerHTML = "";
    ayaDivision.innerHTML = "";
    inputElement.disabled = true;
}
inputElement.disabled = true;

// =========================================================================
// comprehensive review ====================================================

let colorPalettes =[["rgb(228,139,38)", "rgb(65,187,125)",  "rgb(120,87,156)"],
                    ["rgb(250,73,102)", "rgb(178,131,107)", "rgb(88,157,162)"]];
let moreColors = ['rgb(255,102,51)', 'rgb(0,179,230)', 'rgb(230,179,51)', 'rgb(51,102,230)', 'rgb(153,153,102)',
                  'rgb(179,77,77)', 'rgb(128,179,0)', 'rgb(102,128,179)', 'rgb(255,26,102)', 'rgb(230,51,26)',
                  'rgb(179,102,204)', 'rgb(77,128,0)', 'rgb(179,51,0)', 'rgb(204,128,204)', 'rgb(102,102,77)',
                  'rgb(153,26,255)', 'rgb(230,102,255)', 'rgb(77,179,255)', 'rgb(26,179,153)', 'rgb(230,102,179)',
                  'rgb(51,153,26)', 'rgb(77,128,102)', 'rgb(153,153,51)', 'rgb(255,51,128)', 'rgb(204,204,0)',
                  'rgb(77,128,204)', 'rgb(153,0,179)', 'rgb(230,77,102)', 'rgb(77,179,128)', 'rgb(255,77,77)',
                  'rgb(102,102,255)'];
let randomColors = [];
let arrayStore = [];

// .........................................................................
// .........................................................................

function comprehensiveReview(nextRoot, randomColor){
    if(arrayStore.length > 0){
        randomColor = randomColors[arrayStore.length];
    }
    // =====================================================================
    // global ==============================================================
    let pElements_ayaBox = ayaDivision.getElementsByTagName("p"); // ---> current ayas on page
    let randomColor_opacity = "rgba(" + randomColor.slice(4, randomColor.length - 1) + ", 0.3)";
    let backgroundTag = "radial-gradient(circle, " + randomColor_opacity + ", rgba(243,248,177, 0.1)";
    // =====================================================================
    // create an array from all roots in all ayas in ayaDivision ===========
    function getRootArray_ayaDivision () {
        let rootArray_ayaDivision = [];
        // crating a root array of this aya ................................
        for(let l = 0; l < pElements_ayaBox.length; l++){
            let rootArray_thisAya = [];
            let spanElements_thisPtag = pElements_ayaBox[l].children;
            let counter_while = 0;
            // get the right span Elements:
            while(spanElements_thisPtag[counter_while].getAttribute("data-root")) {
                let thisAyaRoot = spanElements_thisPtag[counter_while].getAttribute("data-root");
                if(thisAyaRoot.indexOf("|") != -1){
                    thisAyaRoot = thisAyaRoot.split("|");
                }
                rootArray_thisAya.push(thisAyaRoot);
                counter_while += 1;
            }
            rootArray_ayaDivision.push(rootArray_thisAya);
        }
        return rootArray_ayaDivision;
    }
    let rootArray_ayaDivision = getRootArray_ayaDivision();
    // =====================================================================
    // create index of new root in current ayas ============================
    function getIndex_newRoot(nextRoot, rootArray_ayaDivision) {
        let newRoot_ayaIndex = [];
        for(let t = 0; t < rootArray_ayaDivision.length; t++){
            let thisAyaRoots_array = rootArray_ayaDivision[t];
            for(let m = 0; m < thisAyaRoots_array.length; m++){
                // cheking single roots:
                if(typeof thisAyaRoots_array[m] == "string") {
                    if(thisAyaRoots_array[m] == nextRoot) {
                        newRoot_ayaIndex.push([t,m]);
                    }
                } else { // ---> cheking multi roots
                    for(let n = 0; n < thisAyaRoots_array[m].length; n++) {
                        if(thisAyaRoots_array[m][n] == nextRoot) {
                            newRoot_ayaIndex.push([t,m]);
                        }
                    }
                }
            }
        }
        return newRoot_ayaIndex;
    }
    let nweRootIndex_inAyaDivision = getIndex_newRoot(nextRoot, rootArray_ayaDivision);
    // =====================================================================
    // rearranging ayas considering new root ===============================    
    function rearrangeAyaBox(nweIndex) {
        let newFragment = document.createDocumentFragment();
        // choosing ayas that contain new root .............................
        let counter_outerWhile = 0;
        while(counter_outerWhile < nweIndex.length) {
            pElements_chosen = pElements_ayaBox[nweIndex[counter_outerWhile][0]].cloneNode(true);
            pElements_chosen_spanElements = pElements_chosen.children;
            // styling new root ............................................
            pElements_chosen_spanElements[nweIndex[counter_outerWhile][1]].style.color = randomColor;
            pElements_chosen_spanElements[nweIndex[counter_outerWhile][1]].style.backgroundImage = backgroundTag;
            let counter_innerWhile = counter_outerWhile;
            // check if next index exists and relates to this aya
            if(nweIndex[counter_innerWhile + 1]){
                while(nweIndex[counter_innerWhile][0] == nweIndex[counter_innerWhile + 1][0]) {
                    pElements_chosen_spanElements[nweIndex[counter_innerWhile + 1][1]].style.color = randomColor;
                    pElements_chosen_spanElements[nweIndex[counter_innerWhile + 1][1]].style.backgroundImage = backgroundTag;
                    counter_innerWhile += 1;
                    // if we are done, break out:
                    if(!nweIndex[counter_innerWhile] || !nweIndex[counter_innerWhile + 1]){break};
                }
            }
            counter_outerWhile = counter_innerWhile + 1;
            newFragment.appendChild(pElements_chosen);
        }
        ayaDivision.innerHTML = "";
        ayaDivision.appendChild(newFragment);
    }    
    rearrangeAyaBox(nweRootIndex_inAyaDivision);
    // =====================================================================
    // creating master root array ==========================================    
    function allAvailableRoots_ayaBox() {
        let rootArray_ayaDivision = getRootArray_ayaDivision();
        // removing duplicate elements from each aya and pushing it in "master root array":
        let rootsMasterArray = [];
        for(let i = 0; i < rootArray_ayaDivision.length; i++){
            let thisAyaRoots = [];
            for(let j = 0; j < rootArray_ayaDivision[i].length; j++){
                if(typeof rootArray_ayaDivision[i][j] == "string") {
                    thisAyaRoots.push(rootArray_ayaDivision[i][j]);
                }else{
                    for(let k = 0; k < rootArray_ayaDivision[i][j].length; k++){
                        thisAyaRoots.push(rootArray_ayaDivision[i][j][k]);
                    }
                }
            }
            let thisAyaRoots_unique = thisAyaRoots.filter(function(item, pos) {
                return thisAyaRoots.indexOf(item) == pos;
            })
            // pushing all elements to rootsMasterArray:
            for(let l = 0; l < thisAyaRoots_unique.length; l++){
                rootsMasterArray.push(thisAyaRoots_unique[l]);
            }
        }
        return rootsMasterArray;
    }
    let allRoots_toGather = allAvailableRoots_ayaBox();

    // =====================================================================
    // prepare all available roots to gather ===============================
    // improve array of available roots which can be gathered in one aya with specifed root
    function allRoots_toGather_improve(allRoots_toGather) {
        var map = allRoots_toGather.reduce(function(prev, cur) {
            prev[cur] = (prev[cur] || 0) + 1;
            return prev;
        }, {});
        let allRoots_toGather_roots = Object.keys(map).sort(function(a,b){return map[a]-map[b]}).reverse()
        let allRoots_toGather_occurance = Object.values(map).sort(function(a, b){return b-a});
        allRoots_toGather = [allRoots_toGather_roots, allRoots_toGather_occurance];
        return allRoots_toGather
    }
    allRoots_toGather = allRoots_toGather_improve(allRoots_toGather);

    function setRootBox_right(root) {
        let pElement = document.createElement("p");
        // ...
        let spanElement_chosenRoot = document.createElement("span");
        spanElement_chosenRoot.style.color = randomColor;
        spanElement_chosenRoot.style.fontWeight = "900";
        let initialRoot = document.createTextNode(root); 
        spanElement_chosenRoot.appendChild(initialRoot);
        // ...
        let spanElement_closebtn = document.createElement("span");
        spanElement_closebtn.setAttribute("class", "close");
        let closebtn = document.createTextNode("\u00D7");
        spanElement_closebtn.appendChild(closebtn);
        // ...
        let aElement = document.createElement("a");
        let jsCall = "javascript:remove(" + arrayStore.length + ")";
        aElement.setAttribute("href", jsCall);
        aElement.appendChild(spanElement_closebtn);
        // ...
        pElement.appendChild(aElement);
        pElement.appendChild(spanElement_chosenRoot);
        // ...
        rootDivision_right.appendChild(pElement);
    }

    function setRootBox_left(root) {
        let fragment = document.createDocumentFragment();
        let ulElement = document.createElement("ul");
        for(let s = 0; s < allRoots_toGather[0].length; s++){
            let liElement = document.createElement("li");
            let thisRoot = allRoots_toGather[0][s];
            let thisRoot_occurance = allRoots_toGather[1][s];
            liElement.setAttribute("id", availableRoots_farsi[availableRoots_arabic.indexOf(thisRoot)]);
            // ...
            let aElement_root = document.createElement("a");
            aElement_root.setAttribute("href", "javascript:gatherMe('" + thisRoot + "')");
            let spanElement_occurance = document.createElement("span");
            spanElement_occurance.setAttribute("class", "howManyAyas");
            let textNode_root = document.createTextNode(thisRoot);
            let textNode_occurance = document.createTextNode(getArabicNum(thisRoot_occurance));
            aElement_root.appendChild(textNode_root);
            spanElement_occurance.appendChild(textNode_occurance);
            let bsp = document.createTextNode(" ");
            liElement.appendChild(aElement_root);
            liElement.appendChild(spanElement_occurance);
            liElement.appendChild(bsp);
            // ...
            ulElement.appendChild(liElement);
        }
        fragment.appendChild(ulElement);
        // getting ul Element index and removing it:
        rootDivision_left.innerHTML = "";
        if(ayaDivision.childNodes.length > 1) {
            rootDivision_left.appendChild(fragment);
        }
    }

    // remove this chosen root and previous chosen roots from the array:
    function setGatherableRoots() {
        // remove current chosen root:
        let rootIndex = allRoots_toGather[0].indexOf(nextRoot);
        if(rootIndex != -1) {
            allRoots_toGather[0].splice(rootIndex, 1);
            allRoots_toGather[1].splice(rootIndex, 1);
        }
        // remove previous chosen roots:
        if(arrayStore.length > 0) {
            for(let q = 0; q < arrayStore.length; q++){
                let rootIndex = allRoots_toGather[0].indexOf(arrayStore[q][3]);
                if(rootIndex != -1) {
                    allRoots_toGather[0].splice(rootIndex, 1);
                    allRoots_toGather[1].splice(rootIndex, 1);
                }
            }
        }
        setRootBox_left(nextRoot);
        setRootBox_right(nextRoot);
    }
    setGatherableRoots();

    let ayaDivision_clone = ayaDivision.innerHTML;
    let rootDivision_left_clone = rootDivision_left.innerHTML;
    let rootDivision_right_clone = rootDivision_right.innerHTML
    let thisIteration = [ayaDivision_clone,rootDivision_left_clone, rootDivision_right_clone, nextRoot];
    arrayStore.push(thisIteration);
    // cleare "allRoots_toGather":
    allRoots_toGather[0].length = 0;
    allRoots_toGather[1].length = 0;
    inputElement.value = "";
}

function ayaDivision_setInitial(root, root_essentials) {
    ayaDivision.innerHTML = "";
    ayaDivision.appendChild(root_essentials[0]);
}

// this function chooses first 6 main colors randomly and storing it to "randomColors" array:
function createRandomColors() {
    randomColors.length = 0;
    let paletteIndex = [];
    while(paletteIndex.length < colorPalettes.length) {
        let randomNum = Math.floor(Math.random() * colorPalettes.length);
        if(paletteIndex.indexOf(randomNum) == -1) {
            paletteIndex.push(randomNum);
        }
    }
    for(let i = 0; i < paletteIndex.length; i++) {
        let colorIndex = [];
        while(colorIndex.length < colorPalettes[0].length) {
            let randomNum = Math.floor(Math.random() * colorPalettes[0].length);
            if(colorIndex.indexOf(randomNum) == -1) {
                colorIndex.push(randomNum);
            }
        }
        for(let j = 0; j < colorIndex.length; j++) {
            randomColors.push(colorPalettes[paletteIndex[i]][colorIndex[j]]);
        }
    }
    // add more random colors to "randomColors" array:
    let moreColors_random = [];
    while(moreColors_random.length < moreColors.length) {
        let randomNum = Math.floor(Math.random() * moreColors.length);
        let thisRandomColor = moreColors[randomNum];
        if(moreColors_random.indexOf(thisRandomColor) == -1) {
            moreColors_random.push(thisRandomColor);
            randomColors.push(thisRandomColor);
        }
    }
}

function remove(index) {
    inputElement.value = "";
    if(index + 1 == arrayStore.length) {
        if(index + 1 > 1) {
            arrayStore.splice(-1,1);
            ayaDivision.innerHTML = "";
            ayaDivision.innerHTML = arrayStore[arrayStore.length - 1][0];
            rootDivision_left.innerHTML = "";
            rootDivision_left.innerHTML = arrayStore[arrayStore.length - 1][1];
            rootDivision_right.innerHTML = "";
            rootDivision_right.innerHTML = arrayStore[arrayStore.length - 1][2];
        } else {
            arrayStore.length = 0;
            ayaDivision.innerHTML = "";
            if(chosen_radioButton.checked == true) {ayaDivision.innerHTML = lastChosenAyas};
            rootDivision_left.innerHTML = "";
            rootDivision_left.innerHTML = rootDivisionInitial_left;
            rootDivision_right.innerHTML = "";
        }
    }
    if(index + 1 < arrayStore.length) {
        let childRoots = [];
        // store child roots:
        for(let i = (index + 1) ; i < arrayStore.length; i++) {
            childRoots.push(arrayStore[i][3]);
        }
        if(index == 0) {
            arrayStore.length = 0;
            ayaDivision.innerHTML = "";
            rootDivision_left.innerHTML = "";
            rootDivision_left.innerHTML = rootDivisionInitial_left;
            rootDivision_right.innerHTML = "";
            if(chosen_radioButton.checked == true) {
                ayaDivision.innerHTML = lastChosenAyas;
                rootDistributor(childRoots[0], true);
            } else{
            rootDistributor(childRoots[0]);
            }
            for(let k = 1; k < childRoots.length; k++) {
                gatherMe(childRoots[k]);
            }
        } else {
            arrayStore.length = index;
            ayaDivision.innerHTML = "";
            ayaDivision.innerHTML = arrayStore[arrayStore.length - 1][0];
            rootDivision_left.innerHTML = "";
            rootDivision_left.innerHTML = arrayStore[arrayStore.length - 1][1];
            rootDivision_right.innerHTML = "";
            rootDivision_right.innerHTML = arrayStore[arrayStore.length - 1][2];
            for(let j = 0; j < childRoots.length; j++) {
                gatherMe(childRoots[j]);
            }
        }
    }
    setEventHandlers();
}

function gatherMe(root) {
    comprehensiveReview(root, null);
    setEventHandlers();
}

function rootDistributor(root, chosen){
    let root_essentials = "";
    if(!chosen || chosen == undefined) {root_essentials = getAyaByRoot(root)};
    createRandomColors();
    let randomColor = randomColors[0];
    if(!chosen || chosen == undefined) {ayaDivision_setInitial(root, root_essentials)};
    arrayStore.length = 0; // ---> clearing arrayStore
    inputElement.value = "";
    comprehensiveReview(root, randomColor);
    setEventHandlers();
}

function search() {
    console.log(arrayStore[0]);
    console.log(arrayStore.length);
    if(inputElement.value != "" && inputElement.value != undefined && inputElement.value != null) {
        if(arrayStore.length > 0){
            rootDivision_left.innerHTML = "";
            rootDivision_left.innerHTML = arrayStore[arrayStore.length - 1][1];
        } else {
            rootDivision_left.innerHTML = "";
            rootDivision_left.innerHTML = rootDivisionInitial_left;
        }
        let ulElement = document.createElement("UL");
        let value = inputElement.value;
        let availableRoots_li = rootDivision_left.getElementsByTagName("UL")[0].childNodes;
        for(let i = 0; i < availableRoots_li.length; i++) {
            let thisAvaiableRoot = availableRoots_li[i].getAttribute("ID");
            let counter = 0;
            for(let j = 0; j < value.length; j++) {
                if(value[j] == thisAvaiableRoot[j]) {counter += 1};
            }
            if(counter == value.length){
                let availableRoots_clone = availableRoots_li[i].cloneNode(true);
                ulElement.appendChild(availableRoots_clone);
            }
        }
        rootDivision_left.innerHTML = "";
        rootDivision_left.appendChild(ulElement);
    } else {
        if(arrayStore.length > 0){
            rootDivision_left.innerHTML = "";
            rootDivision_left.innerHTML = arrayStore[arrayStore.length - 1][1];
        } else {
            rootDivision_left.innerHTML = "";
            rootDivision_left.innerHTML = rootDivisionInitial_left;
        }
    }
}

// =========================================================================
// responsive translation change ===========================================

function changeTranslation() {
	let fragment_translation = document.createDocumentFragment();
	let chosenTrans = 0;
	let setTrans = 0;
	for(let k = 0; k < transCheckBoxes.length; k++) {
		if(transCheckBoxes[k].checked == true){chosenTrans += 1};
	}
	// set new translations:
	let currentAyas = ayaDivision.children;
	for(let i = 0; i < currentAyas.length; i++) {
		if(currentAyas[i].getElementsByClassName("ayaAddress")[0]) {
			let currentAyaId = currentAyas[i].getElementsByClassName("ayaAddress")[0].id.split(":");
			// cleare current translation:
			currentAyas[i].getElementsByClassName("translate")[0].innerHTML = "";
			// set new translations:
			if(Ghomshei_trans_checkBox.checked == true){
				let GhomsheiTranslation = suraTranslations_Ghomshei[currentAyaId[0] - 1].children[currentAyaId[1] - 1].getAttribute('text');
				if(chosenTrans == 1) {
					GhomsheiTranslation = document.createTextNode(GhomsheiTranslation);
				} else {
					GhomsheiTranslation = document.createTextNode("قمشه‌ای: " + GhomsheiTranslation);
				}
				fragment_translation.appendChild(GhomsheiTranslation);
				setTrans += 1;
				if(setTrans != chosenTrans) {fragment_translation.appendChild(document.createElement("br"))};
			}
			if(Fooladvand_trans_checkBox.checked == true) {
				let FooladvandTranslation = suraElements[currentAyaId[0] - 1].getElementsByTagName("aya")[currentAyaId[1] - 1].getAttribute("trans");
				if(chosenTrans == 1) {
					FooladvandTranslation = document.createTextNode(FooladvandTranslation);
				} else {
					FooladvandTranslation = document.createTextNode("فولادوند: " + FooladvandTranslation);
				}
				fragment_translation.appendChild(FooladvandTranslation);
				setTrans += 1;
				if(setTrans != chosenTrans) {fragment_translation.appendChild(document.createElement("br"))};
			}
			if(Gharaati_trans_checkBox.checked == true){
				let GharaatiTranslation = suraTranslations_Gharaati[currentAyaId[0] - 1].children[currentAyaId[1] - 1].getAttribute('text');
				if(chosenTrans == 1) {
					GharaatiTranslation = document.createTextNode(GharaatiTranslation);
				} else {
					GharaatiTranslation = document.createTextNode("قرائتی: " + GharaatiTranslation);
				}
				fragment_translation.appendChild(GharaatiTranslation);
			}
			currentAyas[i].getElementsByClassName("translate")[0].appendChild(fragment_translation);
		}
	}
}

function checkBoxListener() {
	for(let i = 0; i < transCheckBoxes.length; i++) {
		transCheckBoxes[i].addEventListener("change", changeTranslation);
	}
}
checkBoxListener();

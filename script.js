// =========================================================================
// reading quran xml file ==================================================

if (window.XMLHttpRequest) {    // ---> code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp = new XMLHttpRequest();
} else {  // ---> code for IE6, IE5
  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.open("GET","quran-simple.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;

// =========================================================================
// defining global variables and functions =================================

let suraTags = xmlDoc.getElementsByTagName("quran")[0].getElementsByTagName("sura");

// tags which contain all available quranic roots (acording to database of this websites):
let rootTags = xmlDoc.getElementsByTagName("quran")[0].getElementsByTagName("r");

// number of ayas in each sura:
let suraLength = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];

let arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

// this function converts defult english number to arabic numbers (as string):
function getArabicNum(num) {
    num = num.toString();
    arabicNum = ""
    for(let i = 0; i < num.length; i++) {
        arabicNum = arabicNum + arabicNumbers[Number(num[i])];
    }
    return arabicNum;
}

// this is where all quran ayas will be shown:
let printingArea = document.getElementById("printingArea");

// this is the div tag which user can choose a root from:
let widget = document.getElementsByClassName("ui-widget")[0];

// =========================================================================
// preparing quran ayas (main function) ====================================

// this function prints any specified range of ayas within specified sura.
// for each aya it creates a paragraph tag that holds all parts of that aya including aya text, sura name, aya number, translation...
// this function first seprates any aya text to individual words and puts each in span tags and sets a title attribute for each span.
// the title attribute for each span holds the root (roots) of the word within span tag.
// so when user hovers over any word of quran text, the root of that word will be shown.
// then all span tags will be appended to the paragraph tag.
// then it puts the name of sura and the number of aya to other span tag and appends that to the paragraph tag too.
// farsi translation also will be stored in other span tag and will be appended to paragraph tag with a line break (br tag) before.
// when each paragraph tag of each aya is ready, all will be appended to a fragment.
// that fragment will be returned to whoever called this function.

function printQuran(sura, ayaStart, ayaEnd, showBismillah, mergeBismillah) {
    if(ayaStart  == undefined) {ayaStart = 1};   // ---> if starting aya is not specified set it to 1
    if(ayaEnd  == undefined) {ayaEnd = suraLength[sura - 1]} // ---> if ending aya is not specified print all ayas to the end of sura
    if(showBismillah == undefined) {showBismillah = true}; // ---> if having bismillah at the begining of sura is not specified, lets have it
    if(mergeBismillah == undefined ) {mergeBismillah = false}  // ---> if meginging bismillah with first aya is not specified, don't do it
    // .....................................................................
    // meging bismillah with first aya (if is specified) ...................
    if(mergeBismillah == true && sura != 1 && sura != 9) {
        let bismillahAya_text = suraTags[0].getElementsByTagName("aya")[0].getAttribute("text");
        let firstAyah_text = suraTags[sura - 1].getElementsByTagName("aya")[0].getAttribute("text");
        let firstAyahWithBismillah_text = bismillahAya_text + " " + firstAyah_text;
        // storing aya text to title attribute so we can restore it to initial value later:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("initial_text", firstAyah_text);
        // changing the value from aya text to aya text plus bismillah text:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("text", firstAyahWithBismillah_text);
        // setting "merged" attribute to yes so later we can know whether it has been merged or not:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("merged", "yes");

        let bismillahAya_roots = suraTags[0].getElementsByTagName("aya")[0].getAttribute("roots");
        let firstAyah_roots = suraTags[sura - 1].getElementsByTagName("aya")[0].getAttribute("roots");
        let firstAyahWithBismillah_roots = bismillahAya_roots + " " + firstAyah_roots;
        // storing aya roots to title attribute so we can restore it to initial value later:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("initial_roots", firstAyah_roots);
        // changing the value from aya roots to aya roots plus bismillah roots:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("roots", firstAyahWithBismillah_roots);
        // setting "merged" attribute to yes so later we can know whether it has been merged or not:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("merged", "yes");
    }
    // this is the main fragment. all paragraphs will be appended to this fragment:
    let fragment = document.createDocumentFragment();
    // .....................................................................
    // adding bismillah to the begining of sura ............................
    if(sura != 1 && sura != 9 && showBismillah == true && ayaStart == 1) {
        let pTag_bism = document.createElement("p");
        bismillahWords = suraTags[0].getElementsByTagName("aya")[0].getAttribute("text").split(" ");
        bismillahRoots = suraTags[0].getElementsByTagName("aya")[0].getAttribute("roots").split(" ");
        bismillahTrans = suraTags[0].getElementsByTagName("aya")[0].getAttribute("trans");
        // looping through each word of bismillah aya and puting it in span tags:
        for(k = 0; k < bismillahWords.length; k++) {
            let spanTag_bism = document.createElement("span");
            spanTag_bism.setAttribute("title", bismillahRoots[k]);  // ---> setting the root of each word as title value
            let thisWord_bism = document.createTextNode(bismillahWords[k] + " ");
            spanTag_bism.appendChild(thisWord_bism);
            pTag_bism.appendChild(spanTag_bism);
        }
        // adding trasnlation for bismillah aya
        let brTag_bism = document.createElement("br");
        pTag_bism.appendChild(brTag_bism);  // ---> line break between aya and translation
        let spanTag_bism_trans = document.createElement("span");
        spanTag_bism_trans.setAttribute("class", "translate");
        let textNode_bism_trans = document.createTextNode(bismillahTrans);
        spanTag_bism_trans.appendChild(textNode_bism_trans);
        pTag_bism.appendChild(spanTag_bism_trans);
        fragment.appendChild(pTag_bism);
    }
    // .....................................................................
    // preparing ayas in specified range ...................................
    for(i = ayaStart; i < ayaEnd + 1; i++) {    // ---> looping through given range of ayas
        let pTag = document.createElement("p");
        thisAyaWords = suraTags[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("text").split(" ");
        thisAyaRoots = suraTags[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("roots").split(" ");
        thisAyaTrans = suraTags[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("trans");
        // looping through each word of this aya and puting it in span tags:
        for(j = 0; j < thisAyaWords.length; j++) {
            let spanTag = document.createElement("span");
            spanTag.setAttribute("title", thisAyaRoots[j]);  // ---> setting the root of each word as title value
            let thisWord = document.createTextNode(thisAyaWords[j] + " ");
            spanTag.appendChild(thisWord);
            pTag.appendChild(spanTag);
        }
        // .................................................................
        // adding sura name and aya number .................................
        let spanTag_address = document.createElement("span");
        let thisAyaAddress = document.createTextNode("﴿" + suraTags[sura - 1].getAttribute("name") + " " + getArabicNum(i) + "﴾");
        spanTag_address.appendChild(thisAyaAddress);
        spanTag_address.style.color = "#0D4D00";
        spanTag_address.style.fontSize = "80%"
        pTag.appendChild(spanTag_address);
        // .................................................................
        // adding aya translation ..........................................
        let brTag_trans = document.createElement("br");
        pTag.appendChild(brTag_trans);
        let spanTag_trans = document.createElement("span");
        spanTag_trans.setAttribute("class", "translate");
        thisAyaTrans = document.createTextNode(thisAyaTrans);
        spanTag_trans.appendChild(thisAyaTrans);
        pTag.appendChild(spanTag_trans);
        // .................................................................
        // appendig each paragraph to the fragment .........................
        fragment.appendChild(pTag);
    }
    // .....................................................................
    // unmerging bismillah from first aya if it's merged ...................
    let firstAyah = suraTags[sura - 1].getElementsByTagName("aya")[0];
    let firstAyah_roots = suraTags[sura - 1].getElementsByTagName("aya")[0];
    if(firstAyah.getAttribute("merged") == "yes") {
        firstAyah.setAttribute("text", firstAyah.getAttribute("initial_text"));
        firstAyah.setAttribute("merged", "no");
        firstAyah_roots.setAttribute("roots", firstAyah.getAttribute("initial_roots"));
        firstAyah_roots.setAttribute("merged", "no");
    }
    // .....................................................................
    // returning fragment ..................................................
    return fragment // --> returning fragment to whoever called this function.
}

// =========================================================================
// html suras click ========================================================

function printSura(num) {
    printingArea.innerHTML = "";    // ---> clearing printing area if it's not
    if(widget.lastChild.tagName == "SPAN") { // ---> clearing root details it's not
        widget.removeChild(widget.lastChild);
    }
    printingArea.appendChild(printQuran(num, undefined, undefined, true, false));  
}

// =========================================================================
// show this root in ayas ==================================================

// this function prints ayas which contain specified root

function getAyaByRoot(thisroot) {
    let thisroot_xmlInfoTag = "";
    for(i = 0; i < rootTags.length; i++) {  // ---> finding related xml information tag of this root
        if(rootTags[i].getAttribute("r") == thisroot) {
            thisroot_xmlInfoTag = rootTags[i]
        }
    }
    // address tags which contains the exact address of the root in quran:
    let involvedAyas_xmlTags = thisroot_xmlInfoTag.getElementsByTagName("a");
    // crating a fragment to hold ayas paragraph tags:
    let involedAyas_fragment = document.createDocumentFragment();
    // this is a counter for numbering the roots (the occurance number of this root from the begining of quran) :
    let rootOccuranceCounter = 1;
    // this is a counter for while loop:
    let counter_1 = 0;
    // looping through ayas which contain this root and calling PrintQuran function for each to get the aya paragraph:
    while(counter_1 < involvedAyas_xmlTags.length) {
        let thisInvolvedSura = Number(involvedAyas_xmlTags[counter_1].getAttribute("s")); // ---> sura number
        let thisInvolvedAyah = Number(involvedAyas_xmlTags[counter_1].getAttribute("a")); // ---> aya number
        let thisInvolvedWord = involvedAyas_xmlTags[counter_1].getAttribute("w"); // ---> word number
        // calling printQuran function passing each address to it to get the paragraph tag of that aya:
        let thisInvolvedAyah_pTag = printQuran(thisInvolvedSura, thisInvolvedAyah, thisInvolvedAyah, false, true).childNodes[0];
        // .................................................................
        // styling and numbering ...........................................
        // changing the color of root words:
        if(!isNaN(thisInvolvedWord)) { // ---> if this aya has only one root in it:
            thisInvolvedAyah_pTag.childNodes[thisInvolvedWord - 1].style.color = "red";
            // setting the root occurance nubmer............................
            let spanTag_rootOccurance = document.createElement("span");
            spanTag_rootOccurance.setAttribute("class", "rootOccurance");
            // this is the br tag which is located betwen aya text and translation:
            let brTagPosition = thisInvolvedAyah_pTag.childNodes[thisInvolvedAyah_pTag.childNodes.length - 2];
            // this is the text wich shows the root occurance nubmer:
            let text_rootOccurance = " " + "---" + " " + "ریشه شماره"  + " " + getArabicNum(rootOccuranceCounter);
            let textNode_rootOccurance = document.createTextNode(text_rootOccurance);
            spanTag_rootOccurance.appendChild(textNode_rootOccurance);
            // inserting the elment before br tag:
            thisInvolvedAyah_pTag.insertBefore(spanTag_rootOccurance, brTagPosition);
            // incrementing counter for next use (for counting next oocurance of root):
            rootOccuranceCounter = rootOccuranceCounter + 1;
            // adding "*" ..................................................
            // adding asterisk between first aya and merged bismillah
            if(thisInvolvedSura != 1 && thisInvolvedSura != 9 && thisInvolvedAyah == 1) {
                // inserting asterisk between merged bismillah and the aya:
                let asterisk = document.createTextNode("* ");
                thisInvolvedAyah_pTag.insertBefore(asterisk, thisInvolvedAyah_pTag.childNodes[4]);
            }
        } else { // ---> if this aya has multiple roots in it
            // spliting multiple roots to single roots:
            let thisInvolvedWords = thisInvolvedWord.split(",");
            // setting the root occurance nubmer............................
            let spanTag_rootOccurance = document.createElement("span");
            spanTag_rootOccurance.setAttribute("class", "rootOccurance");
            let brTagPosition = thisInvolvedAyah_pTag.childNodes[thisInvolvedAyah_pTag.childNodes.length - 2];
            let multiNumbers = "";
            // looping through aya words to indicate and style the root words:
            for(j = 0; j < thisInvolvedWords.length; j++) {
                thisInvolvedAyah_pTag.childNodes[Number(thisInvolvedWords[j]) - 1].style.color = "red";
                // multiple numbers (root occurance numbers) will be assigned to this string:
                multiNumbers = multiNumbers + getArabicNum(rootOccuranceCounter) + " و ";
                // incrementing counter for next use (for counting next oocurance of root):
                rootOccuranceCounter = rootOccuranceCounter + 1;
            }
            multiNumbers = multiNumbers.slice(0, -3); // ---> removing extra " و " from the end
            // this is the text wich shows the root occurance nubmer:
            let text_rootOccurance = " " + "---" + " " + "ریشه شماره"  + " " + multiNumbers;
            let textNode_rootOccurance = document.createTextNode(text_rootOccurance);
            spanTag_rootOccurance.appendChild(textNode_rootOccurance);
            thisInvolvedAyah_pTag.insertBefore(spanTag_rootOccurance, brTagPosition);
            // adding "*" ..................................................
            // adding asterisk between first aya and merged bismillah
            // we add this asterisk after styling so it doesn't get styled:
            if(thisInvolvedSura != 1 && thisInvolvedSura != 9 && thisInvolvedAyah == 1) {
                // inserting asterisk between merged bismillah and the aya:
                let asterisk = document.createTextNode("* ");
                thisInvolvedAyah_pTag.insertBefore(asterisk, thisInvolvedAyah_pTag.childNodes[4]);
            }
        }
        // appending this paragraph tag to fragment:
        involedAyas_fragment.appendChild(thisInvolvedAyah_pTag);
        // incrementing counter for next use (for getting next involved aya):
        counter_1 += 1;
    }
    // returning fragment to whoever called this function
    arrayToReturn = [involedAyas_fragment, thisroot_xmlInfoTag];
    return arrayToReturn;
}

// =========================================================================
// choose your root ========================================================

// .........................................................................
// equalizing different farsi and arebic words .............................
availableRoots_arabic = [];
// storing all available roots in this array:
for(i = 0; i < rootTags.length; i++) {
    availableRoots_arabic[i] = rootTags[i].getAttribute("r")
}

let differentAlpha_arabic = ["ك", "ي", "ى", "إ", "إ", "ؤ", "ة"];
let differentAlpha_farsi = ["ک", "ی", "ی", "ا", "ا", "و", "ه"];
let availableRoots_farsi = [];

// converting arabic letters to farsi in all available root words:
for(i = 0; i < availableRoots_arabic.length; i++) {
    thisWord = "";
    for(j = 0; j < availableRoots_arabic[i].length; j++) {
        switch(availableRoots_arabic[i][j]) {
            case differentAlpha_arabic[0]:
                thisWord = thisWord + differentAlpha_farsi[0];
                break;
            case differentAlpha_arabic[1]:
                thisWord = thisWord + differentAlpha_farsi[1];
                break;
            case differentAlpha_arabic[2]:
                thisWord = thisWord + differentAlpha_farsi[2];
                break;
            case differentAlpha_arabic[3]:
                thisWord = thisWord + differentAlpha_farsi[3];
                break;
            case differentAlpha_arabic[4]:
                thisWord = thisWord + differentAlpha_farsi[4];
                break;
            case differentAlpha_arabic[5]:
                thisWord = thisWord + differentAlpha_farsi[5];
                break;
            case differentAlpha_arabic[6]:
                thisWord = thisWord + differentAlpha_farsi[6];
                break;
            default:
                thisWord = thisWord + availableRoots_arabic[i][j];
        }
    }
    availableRoots_farsi[i] = thisWord;
}

// jQuery UI Autocomplete - Scrollable results at https://jqueryui.com/autocomplete/#maxheight

$( function() {
var availableTags = availableRoots_farsi;
$( "#tags" ).autocomplete({
  source: availableTags
});
} );

// =========================================================================
// print ayas by chosen root ===============================================

function printAyaByRoot() {
    printingArea.innerHTML = "";    // ---> clearing printing area if it's not
    if(widget.lastChild.tagName == "SPAN") { // ---> clearing root details if it's not
        widget.removeChild(widget.lastChild);
    }
    
    let inputTag = document.getElementById("tags");
    let chosenRoot = inputTag.value;
    if(availableRoots_arabic.indexOf(chosenRoot) == -1){   // ---> converting letters back to arabic
        chosenRoot = availableRoots_arabic[availableRoots_farsi.indexOf(chosenRoot)];
    }
    // calling main function which returns ayas containing this root
    let returned = getAyaByRoot(chosenRoot);
    // puting the result on the page:
    printingArea.appendChild(returned[0]);
    // .....................................................................
    // adding details about this root ......................................
    let spanTag_details = document.createElement("span");
    spanTag_details.setAttribute("class", "detail");
    let thisRoot_aTags = returned[1].getElementsByTagName("a").length;
    let thisRoot_occuranceNumber = returned[1].getAttribute("o");
    let details = "ریشه «" + chosenRoot + "» " + getArabicNum(thisRoot_occuranceNumber) + " بار در " + getArabicNum(thisRoot_aTags) + " آیه از قرآن آمده است"
    details = document.createTextNode(details);
    spanTag_details.appendChild(details);
    widget.appendChild(spanTag_details);
}

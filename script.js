// =========================================================================
// reading quran xml file ==================================================

// quran xml file has "aya" tags with:
    // "index" attribute which holds aya number
    // "text" attribute which holds the aya text
    // "roots" attribute which holds the root of words
    // "trans" attribute which holds farsi translation of aya
// all "aya" tags are wraped in "sura" tags with:
    // "index" attribute which hodls sura number
    // "name" attribute which hodls sura name

if (window.XMLHttpRequest) {    // ---> code for IE7+, Firefox, Chrome, Opera, Safari
  xmlhttp = new XMLHttpRequest();
} else {  // ---> code for IE6, IE5
  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xmlhttp.open("GET","quran-simple.xml",false);
xmlhttp.send();
xmlDoc=xmlhttp.responseXML;

// =========================================================================
// defining global variables ===============================================

let suraTags = xmlDoc.getElementsByTagName("quran")[0].getElementsByTagName("sura");
let suraLength = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
let arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
let printingArea = document.getElementById("printingArea");

// =========================================================================
// printing quran ==========================================================

// this function prints any specified range of ayas within specified sura.
// for each aya it creates a paragraph tag that holds all elements of that aya including aya text, sura name aya number, translation...
// this function first seprates any aya text to individual words and puts each in span tags and sets title attribute for each span.
// the title attribute for each span holds the root (roots) of the word within span tag.
// so when user hovers over any word of quran text, the root of that word will be shown.
// then all span tags will be appended to paragraph tag.
// then it puts the name of sura and the number of aya to other span tag and appends that to the paragraph tag.
// farsi translation also will be stored in other span tag and will be appended to paragraph tag with a line break (br tag) before.
// when each paragraph tag of each aya is ready, all will be appended to a fragment.
// that fragment will be ruturned to whoever called this function.
function printQuran(sura, ayaStart, ayaEnd, bismillah) {
    if(!ayaStart) {ayaStart = 1};   // ---> if starting aya is not specified set it to 1
    if(!ayaEnd) {ayaEnd = suraLength[sura - 1]} // ---> if ending aya is not specified print all ayas to the end of sura
    if(!bismillah) {bismillah = true}; // ---> if having bismillah at the begining of sura is not specified, lets have it
    let fragment = document.createDocumentFragment();
    // '---> above fragment holds final result and at last will be ruturned to whoever called this function.
    // .....................................................................
    // adding bismillah to the begining of sura ............................
    if(sura != 1 && sura != 9 && bismillah == true && ayaStart == 1) {  // ---> if it is not sura 1 and it is not sura 9
        let pTag_bism = document.createElement("p");
        bismillahWords = suraTags[0].getElementsByTagName("aya")[0].getAttribute("text").split(" ");    // ---> separating bismillah aya to words
        bismillahRoots = suraTags[0].getElementsByTagName("aya")[0].getAttribute("roots").split(" ");   // ---> also for roots
        bismillahTrans = suraTags[0].getElementsByTagName("aya")[0].getAttribute("trans");
        for(k = 0; k < bismillahWords.length; k++) {    // ---> looping through each word of bismillah aya and puting it in span tags
            let spanTag_bism = document.createElement("span");
            spanTag_bism.setAttribute("title", bismillahRoots[k]);  // ---> setting root of each word as title attribute
            let thisWord_bism = document.createTextNode(bismillahWords[k] + " ");
            spanTag_bism.appendChild(thisWord_bism);
            pTag_bism.appendChild(spanTag_bism);
        }
        // adding trasnlation for bismillah aya
        let brTag_bism = document.createElement("br");
        pTag_bism.appendChild(brTag_bism);  // ---> line break between aya and translation
        let spanTag_bism = document.createElement("span");
        spanTag_bism.setAttribute("class", "translate");
        bismTrans_textNode = document.createTextNode(bismillahTrans);
        spanTag_bism.appendChild(bismTrans_textNode);
        pTag_bism.appendChild(spanTag_bism);
        fragment.appendChild(pTag_bism);
    }
    // .....................................................................
    // preparing ayas in specified range ...................................
    for(i = ayaStart; i < ayaEnd + 1; i++) {    // ---> looping through given range of ayas
        let pTag = document.createElement("p");
        thisAyaWords = suraTags[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("text").split(" ");
        thisAyaRoots = suraTags[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("roots").split(" ");
        thisAyaTrans = suraTags[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("trans");
        for(j = 0; j < thisAyaWords.length; j++) {
            let spanTag = document.createElement("span");
            spanTag.setAttribute("title", thisAyaRoots[j]);
            let thisWord = document.createTextNode(thisAyaWords[j] + " ");
            spanTag.appendChild(thisWord);
            pTag.appendChild(spanTag);
        }
        // .................................................................
        // converting english numbers to acabic numbers ....................
        ayaNumber = i;
        ayaNumber_arabic = "";
        for(j = 0; j < ayaNumber.toString().length; j++) {
            ayaNumber_arabic = ayaNumber_arabic + arabicNumbers[ayaNumber.toString()[j]];
        }
        // .................................................................
        // adding sura name and aya number .................................
        let spanTag_address = document.createElement("span");
        let thisAyaAddress = document.createTextNode("﴿" + suraTags[sura - 1].getAttribute("name") + " " + ayaNumber_arabic + "﴾");
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
    return fragment // --> ruturning fragment to whoever called this function.
}

// =========================================================================
// .... ====================================================================

function printSura(num) {
    printingArea.innerHTML = "";    // ---> clearing printing area if it's not
    printingArea.appendChild(printQuran(num));  
}

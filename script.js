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
// part 2 ==================================================================

let divTag_buttonBox = document.getElementById("buttonBox");
let divTag_compBoxParent = document.getElementById("compBoxParent");
let divTag_ayaBox = document.getElementById("ayaBox");
let divTag_comprehensiveBox;
let divTag_rootBox = document.getElementById("rootBox");
let arrayStore = [];
let colorArray = ['#FF6633', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#B34D4D',
		  '#80B300', '#6680B3',
		  '#FF1A66', '#E6331A',
		  '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', 
		  '#4D8066', '#999933',
		  '#FF3380', '#CCCC00', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#6666FF'];

function comprehensiveReview(nextRoot, remove, randomColor, root_essentials){
    if(arrayStore.length > 0){
        randomColor = colorArray[Math.floor(Math.random()*colorArray.length)];   
    }
    // =====================================================================
    // global ==============================================================
    let pTags_ayaBox = divTag_ayaBox.getElementsByTagName("p"); // ---> current ayas on page
    let backgroundTag = "radial-gradient(circle, #d9df89, #f3f8b1)";
    // =====================================================================
    // creating root array for all ayas in ayaBox ==========================
    function getRootArray_ayaBox () {
        let rootArray_ayaBox = [];
        // crating a root array of this aya ................................
        for(let l = 0; l < pTags_ayaBox.length; l++){
            let rootArray_thisAya = [];
            let spanTags_thisPtag = pTags_ayaBox[l].getElementsByTagName("span");
            let counter_while = 0;
            while(spanTags_thisPtag[counter_while].getAttribute("title") != null) {
                let thisAyaRoot = spanTags_thisPtag[counter_while].getAttribute("title");
                if(thisAyaRoot.indexOf("|") != -1){
                    thisAyaRoot = thisAyaRoot.split("|");
                }
                rootArray_thisAya.push(thisAyaRoot);
                counter_while += 1;
            }
            rootArray_ayaBox.push(rootArray_thisAya);
        }
        return rootArray_ayaBox;
    }
    let rootArray_ayaBox = getRootArray_ayaBox();
    
    // =====================================================================
    // creating index of new root in current ayas ==========================
    function getIndex_newRoot(nextRoot, rootArray_ayaBox) {
        let newRoot_ayaIndex = [];
        for(let t = 0; t < rootArray_ayaBox.length; t++){
            let thisAyaRoots_array = rootArray_ayaBox[t];
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
    let nweRootIndex_inAyaBox = getIndex_newRoot(nextRoot, rootArray_ayaBox);
    
    // =====================================================================
    // rearranging ayas considering new root ===============================    
    function rearrangeAyaBox(nweIndex) {
        let newFragment = document.createDocumentFragment();
        // choosing ayas that contain new root .............................
        let counter_outerWhile = 0;
        while(counter_outerWhile < nweIndex.length) {
            pTags_chosen = pTags_ayaBox[nweIndex[counter_outerWhile][0]].cloneNode(true);
            pTags_chosen_spanTags = pTags_chosen.getElementsByTagName("span");
            // styling new root ............................................
            pTags_chosen_spanTags[nweIndex[counter_outerWhile][1]].style.color = randomColor;
            pTags_chosen_spanTags[nweIndex[counter_outerWhile][1]].style.backgroundImage = backgroundTag;
            let counter_innerWhile = counter_outerWhile;
            // check if next index exists and relates to this aya
            if(nweIndex[counter_innerWhile + 1]){
                while(nweIndex[counter_innerWhile][0] == nweIndex[counter_innerWhile + 1][0]) {
                    pTags_chosen_spanTags[nweIndex[counter_innerWhile + 1][1]].style.color = randomColor;
                    pTags_chosen_spanTags[nweIndex[counter_innerWhile + 1][1]].style.backgroundImage = backgroundTag;
                    counter_innerWhile += 1;
                    // if we are done, break out:
                    if(!nweIndex[counter_innerWhile] || !nweIndex[counter_innerWhile + 1]){break};
                }
            }
            counter_outerWhile = counter_innerWhile + 1;
            newFragment.appendChild(pTags_chosen);
        }
        divTag_ayaBox.innerHTML = "";
        divTag_ayaBox.appendChild(newFragment);
    }    
    rearrangeAyaBox(nweRootIndex_inAyaBox);
    
    // =====================================================================
    // creating master root array ==========================================    
    function allAvailableRoots_ayaBox() {
        let rootArray_ayaBox = getRootArray_ayaBox();
        // removing duplicate elements from each aya and pushing it in "master root array":
        let rootsMasterArray = [];
        for(let i = 0; i < rootArray_ayaBox.length; i++){
            let thisAyaRoots = [];
            for(let j = 0; j < rootArray_ayaBox[i].length; j++){
                if(typeof rootArray_ayaBox[i][j] == "string") {
                    thisAyaRoots.push(rootArray_ayaBox[i][j]);
                }else{
                    for(let k = 0; k < rootArray_ayaBox[i][j].length; k++){
                        thisAyaRoots.push(rootArray_ayaBox[i][j][k]);
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
    // preparing all available roots to gather =============================
    // improving array of available roots which can be gathered in one aya with specifed root
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
    
    function setGetherableRoots() {
        // removing this chosen root and previous chosen roots from the array:
        // removing current chosen root
        let rootIndex = allRoots_toGather[0].indexOf(nextRoot);
        if(rootIndex != -1) {
            allRoots_toGather[0].splice(rootIndex, 1);
            allRoots_toGather[1].splice(rootIndex, 1);
        }
        // removing previous chosen roots
        if(arrayStore.length > 0) {
            for(let q = 0; q < arrayStore.length; q++){
                let rootIndex = allRoots_toGather[0].indexOf(arrayStore[q][3]);
                if(rootIndex != -1) {
                    allRoots_toGather[0].splice(rootIndex, 1);
                    allRoots_toGather[1].splice(rootIndex, 1);
                }
            }
        }
        
        let pTag_comprehensiveBox = document.getElementById("pTag_comprehensiveBox");
        let fragment = document.createDocumentFragment();
        for(let s = 0; s < allRoots_toGather[0].length; s++){
            let thisRoot = allRoots_toGather[0][s];
            let thisRoot_occurance = allRoots_toGather[1][s];
            
            let spanTag_root = document.createElement("a");
            spanTag_root.setAttribute("href", "javascript:gatherMe('" + thisRoot + "')");
            let spanTag_occurance = document.createElement("span");
            let spanTag_delimiter = document.createElement("span");
            let textNode_root = document.createTextNode(thisRoot);
            let textNode_occurance = document.createTextNode(" (" + getArabicNum(thisRoot_occurance) + ")");
            let textNode_delimiter = document.createTextNode(" | ");
            spanTag_root.appendChild(textNode_root);
            spanTag_occurance.appendChild(textNode_occurance);
            spanTag_delimiter.appendChild(textNode_delimiter);
            fragment.appendChild(spanTag_root);
            fragment.appendChild(spanTag_occurance);
            if(s != allRoots_toGather[0].length - 1) {fragment.appendChild(spanTag_delimiter)};
        }
        divTag_comprehensiveBox.innerHTML = "";
        // preparing titile ................................................
        let spanTag_whichRoots = document.createElement("span");
        spanTag_whichRoots.style.color = randomColor;
        let whichRoot = document.createTextNode(" «" + nextRoot + "» ");
        spanTag_whichRoots.appendChild(whichRoot);
        pTag_comprehensiveBox.insertBefore(spanTag_whichRoots , pTag_comprehensiveBox.childNodes[0]);
        let lastSpan = pTag_comprehensiveBox.childNodes[pTag_comprehensiveBox.childNodes.length - 1];
        if(divTag_ayaBox.getElementsByTagName("p").length < 2 && lastSpan.getAttribute("id") != "singleRoot") {
            singleAya_text = "ریشه های بالا تنها در یک آیه از قرآن در کنار یکدیگر آمده اند";
            singleAya_textNode = document.createTextNode(singleAya_text);
            singleAya_spanTag = document.createElement("span");
            singleAya_spanTag.appendChild(singleAya_textNode);
            // removing last span
            pTag_comprehensiveBox.removeChild(lastSpan);
            pTag_comprehensiveBox.appendChild(singleAya_spanTag);
            divTag_comprehensiveBox.appendChild(pTag_comprehensiveBox);
        } else{
            divTag_comprehensiveBox.appendChild(pTag_comprehensiveBox);
            if(lastSpan.getAttribute("id") != "singleRoot") {
                divTag_comprehensiveBox.appendChild(fragment);
            }
        }
    }
    setGetherableRoots();

    let divTag_ayaBox_clone = divTag_ayaBox.innerHTML;
    let divTag_comprehensiveBox_clone = divTag_comprehensiveBox.innerHTML;
    let thisIteration = [divTag_ayaBox_clone, divTag_comprehensiveBox_clone, "", nextRoot];
    arrayStore.push(thisIteration);
    // test:
    allRoots_toGather[0].length = 0;
    allRoots_toGather[1].length = 0;
}

function gatherMe(root) {
    comprehensiveReview(root, "no");
}

function remove() {
    if(arrayStore.length > 1) {
        arrayStore.splice(-1,1);
        divTag_ayaBox.innerHTML = "";
        divTag_ayaBox.innerHTML = arrayStore[arrayStore.length - 1][0];
        divTag_comprehensiveBox.innerHTML = "";
        divTag_comprehensiveBox.innerHTML = arrayStore[arrayStore.length - 1][1];
    }
}

function comprehensiveBox_setInitial(root, randomColor) {
    divTag_comprehensiveBox.innerHTML = ""; // ---> clearing the box
    let pTags_ayaBox = divTag_ayaBox.getElementsByTagName("p"); // ---> number of ayas
    let pTag_comprehensiveBox = document.createElement("p");
    pTag_comprehensiveBox.setAttribute("id", "pTag_comprehensiveBox");
    if(pTags_ayaBox.length > 1){ // ---> if we have more than one aya
        let brTag = document.createElement("br");
        let spanTag = document.createElement("span");
        spanTag.setAttribute("id", "notes");
        let text = "ریشه (ریشه های) بالا در کنار ریشه های زیر به تعداد مشخص شده در آیات قرآن آمده اند. با انتخاب هر کدام، آیات مورد نظر در کادر زیر به نمایش در می آید ";
        let textNode_text = document.createTextNode(text);
        spanTag.appendChild(textNode_text);
        
        pTag_comprehensiveBox.appendChild(brTag);
        pTag_comprehensiveBox.appendChild(spanTag);
        divTag_comprehensiveBox.appendChild(pTag_comprehensiveBox);
    }else {
        let brTag = document.createElement("br");
        let spanTag = document.createElement("span");
        spanTag.setAttribute("id", "singleRoot");
        let text = "این ریشه تنها در یک آیه از قرآن آمده است";
        let textNode = document.createTextNode(text);
        spanTag.appendChild(textNode);
        
        pTag_comprehensiveBox.appendChild(brTag);
        pTag_comprehensiveBox.appendChild(spanTag);
        divTag_comprehensiveBox.appendChild(pTag_comprehensiveBox);
    }
}

function ayaBox_setInitial(root, root_essentials) {
    divTag_ayaBox.innerHTML = "";
    divTag_ayaBox.appendChild(root_essentials[0]);
}

function printDetails(root, root_essentials, randomColor) {
    if(divTag_buttonBox.getElementsByTagName("p").length > 0) { // ---> clearing root details if it's not
        divTag_buttonBox.removeChild(divTag_buttonBox.lastChild);
    }
    // adding details about this root:
    let pTag_details = document.createElement("p");
    pTag_details.style.display = "inline";
    pTag_details.setAttribute("class", "detail");
    let spanTag1_details = document.createElement("span");
    let spanTag2_details = document.createElement("span");
    spanTag2_details.style.color = randomColor;
    let spanTag3_details = document.createElement("span");
    let thisRoot_aTags = root_essentials[1].getElementsByTagName("a").length;
    let thisRoot_occuranceNumber = root_essentials[1].getAttribute("o");
    let details1 = "ریشه";
    let details2 = " «" + root + "» ";
    let details3 = getArabicNum(thisRoot_occuranceNumber) + " بار در " + getArabicNum(thisRoot_aTags) + " آیه از قرآن آمده است";
    details1 = document.createTextNode(details1);
    details2 = document.createTextNode(details2);
    details3 = document.createTextNode(details3);
    spanTag1_details.appendChild(details1);
    spanTag2_details.appendChild(details2);
    spanTag3_details.appendChild(details3);
    pTag_details.appendChild(spanTag1_details);
    pTag_details.appendChild(spanTag2_details);
    pTag_details.appendChild(spanTag3_details);
    divTag_buttonBox.appendChild(pTag_details);
}

function createcomprehensiveBox(){
    // create paragraph
    let pTag = document.createElement("p");
    pTag.setAttribute("id", "comprehensiveReview_title");
    let pTag_text = "بررسی جامع:";
    pTag_text = document.createTextNode(pTag_text);
    pTag.appendChild(pTag_text);
    // create link
    let aTag = document.createElement("a");
    aTag.setAttribute("href", "javascript:remove()");
    aTag.setAttribute("id", "removeRoot");
    let aTag_text = "حذف انتخاب قبلی";
    aTag_text = document.createTextNode(aTag_text);
    aTag.appendChild(aTag_text);
    // create div
    let divTag = document.createElement("div");
    divTag.setAttribute("id", "comprehensiveBox");
    // appending:
    compBoxParent.appendChild(pTag);
    compBoxParent.appendChild(aTag);
    compBoxParent.appendChild(divTag);
    // assigning:
    divTag_comprehensiveBox = document.getElementById("comprehensiveBox");
}

function comprehensiveReview_distributor(root){
    let root_essentials = getAyaByRoot(root);
    let randomColor = colorArray[Math.floor(Math.random()*colorArray.length)];
    if(!document.getElementById("comprehensiveBox")) { // ---> if elements dos not exist
        createcomprehensiveBox();
    }
    printDetails(root, root_essentials, randomColor);
    ayaBox_setInitial(root, root_essentials);
    comprehensiveBox_setInitial(root, "no", randomColor, root_essentials);
    arrayStore.length = 0; // ---> clearing arrayStore
    comprehensiveReview(root, "no" , randomColor);
    divTag_compBoxParent.style.display = "block";
}

function indicateChosenRoot(root, typed) {
    // indicating chosen root ..............................................
    let inputTag = document.getElementById("tags");
    let chosenRoot = inputTag.value;
    if(typed == "yes") { // ---> if user typed the root (input tag value)
        // converting letters back to arabic:
        if(availableRoots_arabic.indexOf(chosenRoot) == -1){
            chosenRoot = availableRoots_arabic[availableRoots_farsi.indexOf(chosenRoot)];
        }
        root = chosenRoot;
    }
    comprehensiveReview_distributor(root);
}

function setRootBox() {
    for(let i = 0; i < availableRoots_arabic.length; i++) {
        let thisRoot_textNote = document.createTextNode(availableRoots_arabic[i]);
        let delimiter_textNote = document.createTextNode(" | ");
        let aTag = document.createElement("a");
        aTag.appendChild(thisRoot_textNote);
        let href_aTag = "javascript:indicateChosenRoot('" + availableRoots_arabic[i] + "')";
        aTag.setAttribute("href", href_aTag);
        rootBox.appendChild(aTag);
        if(i != availableRoots_arabic.length - 1) { // ---> if this is not last item, add delimiter
            rootBox.appendChild(delimiter_textNote);
        }
    }
}
setRootBox();

// =========================================================================
// print sura ==============================================================

let suraSelect = document.getElementById("suraSelect");

function setSuraOptions() {
    for(let i =0; i < suraTags.length; i++) {
        let thisSuraName = suraTags[i].getAttribute("name");
        let thisSuraNum = getArabicNum(i + 1);
        let option = document.createElement("option");
        let thisOptionText = thisSuraNum + ") " + thisSuraName;
        option.text = thisOptionText
        option.value = i + 1;
        suraSelect.add(option);
    }
}

setSuraOptions();

function printSura() {
    // clearing:
    if(divTag_buttonBox.getElementsByTagName("p").length > 0) {
        divTag_buttonBox.removeChild(divTag_buttonBox.lastChild);
    }
    divTag_compBoxParent.innerHTML = "";
    // appending:
    let thisSuraNum = suraSelect.options[suraSelect.selectedIndex].value;
    divTag_ayaBox.innerHTML = "";
    divTag_ayaBox.appendChild(printQuran(Number(thisSuraNum), undefined, undefined, true, false));  
}

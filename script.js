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

// xml tags which contain sura data:
let suraTags = xmlDoc.getElementsByTagName("quran")[0].getElementsByTagName("sura");
// xml tags which contain data for all available quranic roots (acording to database of this websites):
let rootTags = xmlDoc.getElementsByTagName("quran")[0].getElementsByTagName("r");
// number of ayas in each sura:
let suraLength = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
// arabic numbers:
let arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
// the  drop-down list of sura names (where user can choose a sura from):
let suraSelector = document.getElementById("suraSelector");
// this function converts defult english number to arabic numbers (as string):
function getArabicNum(num) {
    num = num.toString();
    arabicNum = ""
    for(let i = 0; i < num.length; i++) {
        arabicNum = arabicNum + arabicNumbers[Number(num[i])];
    }
    return arabicNum;
}
let rootBox_left_parent = document.getElementById("rootBox_left_parent");
let rootBox_left = document.getElementById("rootBox_left");
let rootBox_right = document.getElementById("rootBox_right");

// =========================================================================
// preparing quran ayas (main function) ====================================

// this function prints any specified range of ayas within specified sura.
// for each aya it creates a paragraph tag that holds all parts of that aya
// each paragraph tag includes aya text, sura name, aya number and farsi translation.
// this function first seprates each aya text to single words and puts each in a span tag.
// span tags contain a title attribute which holds the root of the word within span tag.
// so when user hovers over any word of quran text, the root of that word will be shown.
// then all span tags will be appended to the paragraph tag.
// the name of sura and the number of aya will be appended to paragraph as another span tag.
// farsi translation also will be appended to paragraph as span tag with a line break (br tag) before.
// when all paragraph tags of all ayas are ready, they will be appended to a fragment.
// that fragment will be returned to whoever called this function.

function printQuran(sura, ayaStart, ayaEnd, showBismillah, mergeBismillah) {
    if(ayaStart  == undefined) {ayaStart = 1}; // ---> if starting aya is not specified set it to 1
    if(ayaEnd  == undefined) {ayaEnd = suraLength[sura - 1]} // ---> if ending aya is not specified print the whole sura
    if(showBismillah == undefined) {showBismillah = true}; // ---> if having bismillah at the begining of sura is not specified, lets have it
    if(mergeBismillah == undefined ) {mergeBismillah = false} // ---> if merging bismillah with first aya is not specified, don't do it
    // .....................................................................
    // merging bismillah with first aya (if is specified) ...................
    if(mergeBismillah == true && sura != 1 && sura != 9) {
        let bismillahAya_text = suraTags[0].getElementsByTagName("aya")[0].getAttribute("text");
        let firstAyah_text = suraTags[sura - 1].getElementsByTagName("aya")[0].getAttribute("text");
        let firstAyahWithBismillah_text = bismillahAya_text + " " + firstAyah_text;
        // storing aya text to title attribute so we can restore it to initial value later:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("initial_text", firstAyah_text);
        // changing the value for aya text to merged text:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("text", firstAyahWithBismillah_text);
        // setting "merged" attribute to yes so later we can know whether it has been merged or not:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("merged", "yes");
        // repeating above process for the text of quran roots:
        let bismillahAya_roots = suraTags[0].getElementsByTagName("aya")[0].getAttribute("roots");
        let firstAyah_roots = suraTags[sura - 1].getElementsByTagName("aya")[0].getAttribute("roots");
        let firstAyahWithBismillah_roots = bismillahAya_roots + " " + firstAyah_roots;
        // storing aya roots to title attribute so we can restore it to initial value later:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("initial_roots", firstAyah_roots);
        // changing the value for aya roots to merged root text:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("roots", firstAyahWithBismillah_roots);
        // setting "merged" attribute to yes so later we can know whether it has been merged or not:
        suraTags[sura - 1].getElementsByTagName("aya")[0].setAttribute("merged", "yes");
    }
    // this is the main fragment. all paragraphs will be appended to this fragment:
    let fragment = document.createDocumentFragment();
    // .....................................................................
    // adding bismillah to the begining of sura ............................
    
    // this function doen't print any aya on page unless sets the root of each word of aya text.
    // so this block of code first seprates bismillah aya to individual words and puts each in span tag.
    // each span tag will have a title attribute which holds the root of the word within span tag.
    
    if(sura != 1 && sura != 9 && showBismillah == true && ayaStart == 1) {
        let pTag_bismillah = document.createElement("p");
        bismillahWords = suraTags[0].getElementsByTagName("aya")[0].getAttribute("text").split(" ");
        bismillahRoots = suraTags[0].getElementsByTagName("aya")[0].getAttribute("roots").split(" ");
        bismillahTrans = suraTags[0].getElementsByTagName("aya")[0].getAttribute("trans");
        // looping through each word of bismillah aya and puting it in span tags:
        for(let k = 0; k < bismillahWords.length; k++) {
            let spanTag_bismillah = document.createElement("span");
            // setting the root of each word as title value:
            spanTag_bismillah.setAttribute("title", bismillahRoots[k]);
            let thisWord_bismillah = document.createTextNode(bismillahWords[k]);
            let bsp = document.createTextNode(" ");
            spanTag_bismillah.appendChild(thisWord_bismillah);
            pTag_bismillah.appendChild(spanTag_bismillah);
            pTag_bismillah.appendChild(bsp);
        }
        // adding trasnlation for bismillah aya
        let brTag_bismillah = document.createElement("br");
        pTag_bismillah.appendChild(brTag_bismillah); // ---> line break between aya and translation
        let spanTag_bismillah_trans = document.createElement("span");
        spanTag_bismillah_trans.setAttribute("class", "translate");
        let textNode_bismillah_trans = document.createTextNode(bismillahTrans);
        spanTag_bismillah_trans.appendChild(textNode_bismillah_trans);
        pTag_bismillah.appendChild(spanTag_bismillah_trans);
        fragment.appendChild(pTag_bismillah);
    }
    // .....................................................................
    // preparing ayas in specified range ...................................
    for(let i = ayaStart; i < ayaEnd + 1; i++) { // ---> looping through given range of ayas
        let pTag_thisAya = document.createElement("p");
        thisAyaWords = suraTags[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("text").split(" ");
        thisAyaRoots = suraTags[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("roots").split(" ");
        thisAyaTrans = suraTags[sura - 1].getElementsByTagName("aya")[i - 1].getAttribute("trans");
        // looping through each word of this aya and puting it in span tag:
        for(let j = 0; j < thisAyaWords.length; j++) {
            let spanTag_thisWord = document.createElement("span");
            // setting the root of each word as title value:
            spanTag_thisWord.setAttribute("title", thisAyaRoots[j]);
            let thisWord = document.createTextNode(thisAyaWords[j]);
            let bsp = document.createTextNode(" ");
            spanTag_thisWord.appendChild(thisWord);
            pTag_thisAya.appendChild(spanTag_thisWord);
            pTag_thisAya.appendChild(bsp);
        }
        // .................................................................
        // adding sura name and aya number .................................
        let spanTag_address = document.createElement("span");
        let thisAyaAddress = document.createTextNode("﴿" + suraTags[sura - 1].getAttribute("name") + " " + getArabicNum(i) + "﴾");
        spanTag_address.appendChild(thisAyaAddress);
        spanTag_address.style.color = "#0D4D00";
        spanTag_address.style.fontSize = "80%"
        pTag_thisAya.appendChild(spanTag_address);
        // .................................................................
        // adding aya translation ..........................................
        let brTag_trans = document.createElement("br"); // ---> line break between aya and translation
        pTag_thisAya.appendChild(brTag_trans);
        let spanTag_trans = document.createElement("span");
        spanTag_trans.setAttribute("class", "translate");
        thisAyaTrans = document.createTextNode(thisAyaTrans);
        spanTag_trans.appendChild(thisAyaTrans);
        pTag_thisAya.appendChild(spanTag_trans);
        // .................................................................
        // appendig each paragraph to the fragment .........................
        fragment.appendChild(pTag_thisAya);
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
// print sura ==============================================================

// when the user chooses a sura these functions will be called and that sura will be printed on the page:

//this function creates the options of drop-down list - which shows sura names -
function setSuraOptions() {
    for(let i = 0; i < suraTags.length; i++) {
        let thisSuraName = suraTags[i].getAttribute("name");
        let thisSuraNum = getArabicNum(i + 1);
        let option = document.createElement("option");
        let thisOptionText = thisSuraNum + ") " + thisSuraName;
        option.text = thisOptionText;
        option.value = i + 1;
        suraSelector.add(option);
    }
}
setSuraOptions();

function printSura() {
    let thisSuraNum = suraSelector.options[suraSelector.selectedIndex].value;
    ayaBox.innerHTML = "";
    ayaBox.appendChild(printQuran(Number(thisSuraNum), undefined, undefined, true, false));
    // clearing root search box:
    arrayStore.length = 0;
    rootBox_left.innerHTML = "";
    rootBox_left.innerHTML = rootBoxInitial_left;
    rootBox_right.innerHTML = "";
    inputTag.value = "";
}

// =========================================================================
// preparing ayas which contain specific root ================================

// this function prepares ayas which contain specified root
// the words that are created from that root will be shown in red color
// all aya paragraphs will be appended to a document fragment
// that fragment will be returned to whoever called this function.

function getAyaByRoot(thisroot) {
    let thisroot_xmlInfoTag;
    for(i = 0; i < rootTags.length; i++) {  // ---> finding related xml information tag of this root
        if(rootTags[i].getAttribute("r") == thisroot) {
            thisroot_xmlInfoTag = rootTags[i]
        }
    }
    // parsing the text node of xml <a> tag
    // these data contain the exact address (index) of the root in quran:
    let involvedAyas_xmlTags = thisroot_xmlInfoTag.getElementsByTagName("a")[0].textContent;
    involvedAyas_xmlTags = involvedAyas_xmlTags.split("#");
    // crating a fragment to hold ayas paragraph tags:
    let involedAyas_fragment = document.createDocumentFragment();
    // this is a counter for numbering the roots (the occurance number of this root from the begining of quran):
    let counter_rootOccurance = 1;
    // this is a counter for while loop:
    let counter_while = 0;
    // looping through ayas which contain this root and calling PrintQuran function for each to get the aya paragraph:
    while(counter_while < involvedAyas_xmlTags.length) {
        // assigning the index of this occurance to a variable:
            // the format of xml tag indexes are "number.number.number"
            // first number is sura number, second number is aya number and third numbet is word index:
        let thisOccuranceInfo = involvedAyas_xmlTags[counter_while].split(".");
        let thisInvolvedSura_num = Number(thisOccuranceInfo[0]); // ---> sura number
        let thisInvolvedAyah_num = Number(thisOccuranceInfo[1]); // ---> aya number
        let thisInvolvedWord = thisOccuranceInfo[2]; // ---> word number (index)
        // calling printQuran function passing each address to it to get the paragraph tag of that aya:
        let thisInvolvedAyah_pTag = printQuran(thisInvolvedSura_num, thisInvolvedAyah_num, thisInvolvedAyah_num, false, true).childNodes[0];
        // .................................................................
        // styling and numbering ...........................................
        // changing the color of root words:
        if(!isNaN(thisInvolvedWord)) { // ---> if this aya has only one root in it:
            thisInvolvedAyah_pTag.childNodes[(thisInvolvedWord * 2) - 2].style.color = "red"; 
            // setting the root occurance nubmer............................
            let spanTag_rootOccurance = document.createElement("span");
            spanTag_rootOccurance.setAttribute("class", "rootOccurance");
            // the br tag which is located betwen aya text and translation:
            let brTagPosition = thisInvolvedAyah_pTag.childNodes[thisInvolvedAyah_pTag.childNodes.length - 2];
            // the text which shows the root occurance nubmer:
            let text_rootOccurance = " " + "---" + " " + "ریشه «" + thisroot + "» شماره" + "\u202F" + getArabicNum(counter_rootOccurance);
            let textNode_rootOccurance = document.createTextNode(text_rootOccurance);
            spanTag_rootOccurance.appendChild(textNode_rootOccurance);
            // inserting the elment before br tag:
            thisInvolvedAyah_pTag.insertBefore(spanTag_rootOccurance, brTagPosition);
            // incrementing counter for next use (for counting next oocurance of root):
            counter_rootOccurance = counter_rootOccurance + 1;
            // adding "*" ..................................................
            // adding asterisk between first aya and merged bismillah
            if(thisInvolvedSura_num != 1 && thisInvolvedSura_num != 9 && thisInvolvedAyah_num == 1) {
                // inserting asterisk between merged bismillah and the aya:
                let asterisk = document.createTextNode("* ");
                thisInvolvedAyah_pTag.insertBefore(asterisk, thisInvolvedAyah_pTag.childNodes[8]);
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
            for(let j = 0; j < thisInvolvedWords.length; j++) {
                thisInvolvedAyah_pTag.childNodes[(Number(thisInvolvedWords[j])) * 2 - 2].style.color = "red";
                // multiple numbers (root occurance numbers) will be assigned to this string:
                multiNumbers = multiNumbers + getArabicNum(counter_rootOccurance) + " و ";
                // incrementing counter for next use (for counting next oocurance of root):
                counter_rootOccurance = counter_rootOccurance + 1;
            }
            multiNumbers = multiNumbers.slice(0, -3); // ---> removing extra " و " from the end
            // this is the text wich shows the root occurance nubmer:
            let text_rootOccurance = " " + "---" + " " + "ریشه «" + thisroot + "» شماره" + "\u202F" + multiNumbers;
            let textNode_rootOccurance = document.createTextNode(text_rootOccurance);
            spanTag_rootOccurance.appendChild(textNode_rootOccurance);
            thisInvolvedAyah_pTag.insertBefore(spanTag_rootOccurance, brTagPosition);
            // adding "*" ..................................................
            // adding asterisk between first aya and merged bismillah
            // we add this asterisk after styling so it doesn't get styled:
            if(thisInvolvedSura_num != 1 && thisInvolvedSura_num != 9 && thisInvolvedAyah_num == 1) {
                // inserting asterisk between merged bismillah and the aya:
                let asterisk = document.createTextNode("* ");
                thisInvolvedAyah_pTag.insertBefore(asterisk, thisInvolvedAyah_pTag.childNodes[8]);
            }
        }
        // appending this paragraph tag to fragment:
        involedAyas_fragment.appendChild(thisInvolvedAyah_pTag);
        // incrementing counter for next use (for getting next involved aya):
        counter_while += 1;
    }
    // returning fragment to whoever called this function
    // first element of returned array is the fragment and second element is the xml info of chosen root:
    arrayToReturn = [involedAyas_fragment, thisroot_xmlInfoTag];
    return arrayToReturn;
}

// =========================================================================
// search your root ========================================================

//this block of code handles the input tag where user can search for a root in:

// .........................................................................
// equalizing different farsi and arebic letters ...........................

// some arabic letters are different from farsi letters.
// here we let user choose a root using farsi letters.
// first we compare users input (typed root) with quran roots in farsi letters,
// then after indicating desire root, we convert letters back to arabic,
// so now we can call functions by arabic root word.

// storing all available roots in an array:
availableRoots_arabic = [];
for(i = 0; i < rootTags.length; i++) {
    availableRoots_arabic[i] = rootTags[i].getAttribute("r")
}

let alternativeLetters_arabic = ["ك", "ي", "ى", "إ", "إ", "ؤ", "ة"];
let alternativeLetters_farsi = ["ک", "ی", "ی", "ا", "ا", "و", "ه"];
let availableRoots_farsi = [];

// converting arabic letters to farsi in all available root words:
for(i = 0; i < availableRoots_arabic.length; i++) {
    thisWord = "";
    for(j = 0; j < availableRoots_arabic[i].length; j++) {
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

let rootBoxInitial_left = "";
function rootBox_setInitial() {
    let ulTag = document.createElement("ul");
    for(let i = 0; i < availableRoots_arabic.length; i++) {
        // this list
        let thisLi = document.createElement("li");
        // this root text:
        let aTag_thisRoot = document.createElement("a");
        let href_aTag = "javascript:rootDistributor('" + availableRoots_arabic[i] + "')";
        aTag_thisRoot.setAttribute("href", href_aTag);
        let thisRoot = document.createTextNode(availableRoots_arabic[i]);
        aTag_thisRoot.appendChild(thisRoot);
        // number of ayas which contain this root (in whole quran)
        let spanTag_howManyAyas = document.createElement("span");
        spanTag_howManyAyas.setAttribute("class", "howManyAyas");
        let howManyAyas = rootTags[i].getElementsByTagName("a")[0].textContent.split("#").length;
        howManyAyas = getArabicNum(howManyAyas);
        let bsp_2 = document.createTextNode(" ");
        howManyAyas = document.createTextNode(howManyAyas);
        spanTag_howManyAyas.appendChild(howManyAyas);
        thisLi.appendChild(aTag_thisRoot);
        thisLi.appendChild(spanTag_howManyAyas);
        thisLi.appendChild(bsp_2);
        
        thisLi.setAttribute("id", availableRoots_farsi[availableRoots_arabic.indexOf(availableRoots_arabic[i])]);
        ulTag.appendChild(thisLi);
    }
    rootBox_left.appendChild(ulTag);
    rootBoxInitial_left = rootBox_left.innerHTML;
}
rootBox_setInitial()

// =========================================================================
// comprehensive review ====================================================

let inputTag = document.getElementById("input");
let ayaBox = document.getElementById("ayaBox");
let colorPalettes =[["rgb(228,139,38)", "rgb(65,187,125)",  "rgb(120,87,156)"],
                    ["rgb(250,73,102)", "rgb(178,131,107)", "rgb(88,157,162)"]];
let moreColors = ['rgb(255,102,51)', 'rgb(0,179,230)', 'rgb(230,179,51)', 'rgb(51,102,230)', 'rgb(153,153,102)',
                  'rgb(179,77,77)', 'rgb(128,179,0)', 'rgb(102,128,179)', 'rgb(255,26,102)', 'rgb(230,51,26)',
                  'rgb(179,102,204)', 'rgb(77,128,0)', 'rgb(179,51,0)', 'rgb(204,128,204)', 'rgb(102,102,77)',
                  'rgb(153,26,255)', 'rgb(230,102,255)', 'rgb(77,179,255)', 'rgb(26,179,153)', 'rgb(230,102,179)',
                  'rgb(51,153,26)', 'rgb(77,128,102)', 'rgb(153,153,51)', '#rgb(255,51,128)', 'rgb(204,204,0)',
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
    let pTags_ayaBox = ayaBox.getElementsByTagName("p"); // ---> current ayas on page
    // let backgroundTag = "radial-gradient(circle, #d9df89, #f3f8b1)";
    let randomColor_opacity = "rgba(" + randomColor.slice(4, randomColor.length - 1) + ", 0.3)";
    let backgroundTag = "radial-gradient(circle, " + randomColor_opacity + ", rgba(243,248,177, 0.1)";
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
        if(newRoot_ayaIndex.length == 0) {found = false}
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
        ayaBox.innerHTML = "";
        ayaBox.appendChild(newFragment);
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

    function setRootBox_right(root) {
        let pTag = document.createElement("p");

        let spanTag_chosenRoot = document.createElement("span");
        spanTag_chosenRoot.style.color = randomColor;
        spanTag_chosenRoot.style.fontWeight = "900";
        let initialRoot = document.createTextNode(root); 
        spanTag_chosenRoot.appendChild(initialRoot);

        let spanTag_closebtn = document.createElement("span");
        spanTag_closebtn.setAttribute("class", "close");
        let closebtn = document.createTextNode("\u00D7");
        spanTag_closebtn.appendChild(closebtn);

        let aTag = document.createElement("a");
        let jsCall = "javascript:remove(" + arrayStore.length + ")";
        aTag.setAttribute("href", jsCall);
        aTag.appendChild(spanTag_closebtn);

        pTag.appendChild(aTag);
        pTag.appendChild(spanTag_chosenRoot);

        rootBox_right.appendChild(pTag);
    }
    
    function setRootBox_left(root) {
        let fragment = document.createDocumentFragment();
        let ulTag = document.createElement("ul");
        for(let s = 0; s < allRoots_toGather[0].length; s++){
            let liTag = document.createElement("li");
            let thisRoot = allRoots_toGather[0][s];
            let thisRoot_occurance = allRoots_toGather[1][s];
            liTag.setAttribute("id", availableRoots_farsi[availableRoots_arabic.indexOf(thisRoot)]);
            
            let aTag_root = document.createElement("a");
            aTag_root.setAttribute("href", "javascript:gatherMe('" + thisRoot + "')");
            let spanTag_occurance = document.createElement("span");
            spanTag_occurance.setAttribute("class", "howManyAyas");
            let textNode_root = document.createTextNode(thisRoot);
            let textNode_occurance = document.createTextNode(getArabicNum(thisRoot_occurance));
            aTag_root.appendChild(textNode_root);
            spanTag_occurance.appendChild(textNode_occurance);
            let bsp = document.createTextNode(" ");
            liTag.appendChild(aTag_root);
            liTag.appendChild(spanTag_occurance);
            liTag.appendChild(bsp);
            
            ulTag.appendChild(liTag);
        }
        fragment.appendChild(ulTag);
        // getting ul tag index and removing it:
        rootBox_left.innerHTML = "";
        if(ayaBox.childNodes.length > 1) {
            rootBox_left.appendChild(fragment);
        }
    }
    
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
        setRootBox_left(nextRoot);
        setRootBox_right(nextRoot);
    }
    setGetherableRoots();

    let ayaBox_clone = ayaBox.innerHTML;
    let rootBox_left_clone = rootBox_left.innerHTML;
    let rootBox_right_clone = rootBox_right.innerHTML
    let thisIteration = [ayaBox_clone,rootBox_left_clone, rootBox_right_clone, nextRoot];
    arrayStore.push(thisIteration);
    // clearing "allRoots_toGather":
    allRoots_toGather[0].length = 0;
    allRoots_toGather[1].length = 0;
    inputTag.value = "";
}

function remove(index) {
    inputTag.value = "";
    if(index + 1 == arrayStore.length) {
        if(index + 1 > 1) {
            arrayStore.splice(-1,1);
            ayaBox.innerHTML = "";
            ayaBox.innerHTML = arrayStore[arrayStore.length - 1][0];
            rootBox_left.innerHTML = "";
            rootBox_left.innerHTML = arrayStore[arrayStore.length - 1][1];
            rootBox_right.innerHTML = "";
            rootBox_right.innerHTML = arrayStore[arrayStore.length - 1][2];
        } else {
            arrayStore.length = 0;
            ayaBox.innerHTML = "";
            rootBox_left.innerHTML = "";
            rootBox_left.innerHTML = rootBoxInitial_left;
            rootBox_right.innerHTML = "";
        }
    }
    if(index + 1 < arrayStore.length) {
        let childRoots = []
        // storing child roots:
        for(let i = (index + 1) ; i < arrayStore.length; i++) {
            childRoots.push(arrayStore[i][3]);
        }
        if(index == 0) {
            arrayStore.length = 0;
            ayaBox.innerHTML = "";
            rootBox_left.innerHTML = "";
            rootBox_left.innerHTML = rootBoxInitial_left;
            rootBox_right.innerHTML = "";
            rootDistributor(childRoots[0]);
            for(let k = 1; k < childRoots.length; k++) {
                gatherMe(childRoots[k]);
            }
        }else {
            arrayStore.length = index;
            ayaBox.innerHTML = "";
            ayaBox.innerHTML = arrayStore[arrayStore.length - 1][0];
            rootBox_left.innerHTML = "";
            rootBox_left.innerHTML = arrayStore[arrayStore.length - 1][1];
            rootBox_right.innerHTML = "";
            rootBox_right.innerHTML = arrayStore[arrayStore.length - 1][2];
            for(let j = 0; j < childRoots.length; j++) {
                gatherMe(childRoots[j]);
            }
        }
    }
}

function gatherMe(root) {
    comprehensiveReview(root, null);
}

function ayaBox_setInitial(root, root_essentials) {
    ayaBox.innerHTML = "";
    ayaBox.appendChild(root_essentials[0]);
}

function createRandomColors() {
    // choosing first 6 main colors randomly and storing it to "randomColors" array:
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

function rootDistributor(root){
    let root_essentials = getAyaByRoot(root);
    createRandomColors();
    let randomColor = randomColors[0];
    ayaBox_setInitial(root, root_essentials);
    arrayStore.length = 0; // ---> clearing arrayStore
    inputTag.value = "";
    comprehensiveReview(root, randomColor);
}

function search() {
    if(inputTag.value != "" && inputTag.value != undefined && inputTag.value != null) {
        if(arrayStore.length > 0){
            rootBox_left.innerHTML = "";
            rootBox_left.innerHTML = arrayStore[arrayStore.length - 1][1];
        } else {
            rootBox_left.innerHTML = "";
            rootBox_left.innerHTML = rootBoxInitial_left;
        }
        let ulTag = document.createElement("UL");
        let value = inputTag.value
        let availableRoots_li = rootBox_left.getElementsByTagName("UL")[0].childNodes;
        for(let i = 0; i < availableRoots_li.length; i++) {
            let thisAvaiableRoot = availableRoots_li[i].getAttribute("ID")
            let counter = 0;
            for(let j = 0; j < value.length; j++) {
                if(value[j] == thisAvaiableRoot[j]) {counter += 1};
            }
            if(counter == value.length){
                let availableRoots_clone = availableRoots_li[i].cloneNode(true);
                ulTag.appendChild(availableRoots_clone);
            }
        }
        rootBox_left.innerHTML = "";
        rootBox_left.appendChild(ulTag);
    } else {
        if(arrayStore.length > 0){
            rootBox_left.innerHTML = "";
            rootBox_left.innerHTML = arrayStore[arrayStore.length - 1][1];
        } else {
            rootBox_left.innerHTML = "";
            rootBox_left.innerHTML = rootBoxInitial_left;
        }
    }
}

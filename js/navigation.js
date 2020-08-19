const URLHashStructure = ["localization", "subpage"];
const languages = ["en", "cz"];
const subpages = ["projects", "resume", "about_me", "contact"];
let currentSubpage = subpages[0];
let currentLanguage = languages[0];
let initialized = false;
let mouseOnPage = false;

/*initialize website based on URL hash input*/
initFromURL();
/*detect when the back or forward button was pressed so we can reload from URL hash*/
document.onmouseover = function(){ mouseOnPage = true; }
document.onmouseleave = function(){ mouseOnPage = false; }
window.onhashchange = function(){
    if(!mouseOnPage) initFromURL();
}

/*graphical navigation functions*/

function localize(language){
    if (languages.includes(language)){
        hideSubpage();
        //hide all unused languages
        document.querySelectorAll("[lang]:not(:lang(" + language + "))").forEach(function (node){
            node.style.display = "none";
        });
        //show the new language
        document.querySelectorAll("[lang]:lang(" + language + ")").forEach(function (node){
            node.style.display = "unset";
        });
        //hide old language button
        document.querySelector("[lang]:lang(" + currentLanguage + ")" + " .B-" + currentLanguage).classList.remove("currentButton");
        //show new language button
        document.querySelector("[lang]:lang(" + language + ")" + " .B-" + language).classList.add("currentButton");
        currentLanguage = language;
        loadSubpage(currentSubpage);
    }
}

function loadSubpage(subpage){
    if (subpages.includes(subpage)){
        //hide the current subpage
        hideSubpage();
        //show the new subpage in the current language
        document.querySelector("[lang]:lang(" + currentLanguage + ")" + " ." + subpage).style.display = "inline-block";
        //add activeButton class to the new subpage button
        document.querySelector("[lang]:lang(" + currentLanguage + ")" + " .B-" + subpage).classList.add("currentButton");
        currentSubpage = subpage;
        if(initialized) URLupdate();
    }
}

function hideSubpage(){
    //hide the current subpage in the current language
    document.querySelector("[lang]:lang(" + currentLanguage + ")" + " ." + currentSubpage).style.display = "none";
    //remove activeButton class from current subpage button
    document.querySelector("[lang]:lang(" + currentLanguage + ")" + " .B-" + currentSubpage).classList.remove("currentButton");
}

/*URL management*/

function initFromURL(){
    initialized = false;
    /*startup localization*/
    let localizationParameter = getURLHashParameter(URLHashStructure.indexOf("localization"));
    for (lang = 0; lang < languages.length; lang++){
        if (localizationParameter == (languages[lang])){
            localize(languages[lang]);
            break;
        }
        else if (lang == languages.length - 1) localize(languages[0]);
    }
    /*startup subpage load*/
    let subpageParameter = getURLHashParameter(URLHashStructure.indexOf("subpage"));
    for (subP = 0; subP < subpages.length; subP++){
        if (subpageParameter == subpages[subP]){
            loadSubpage(subpages[subP]);
            break;
        }
        else if (subP == subpages.length - 1) loadSubpage(subpages[0]);
    }
    /*initialize url hash with the current parameters*/
    URLInit();
    initialized = true;
}

function getURLHashParameter(parameterIndex){
    let URLread = window.location.href;
    let hashString = "";
    let hashReached = false;
    for (i = 0; i < URLread.length; i++){
        if(hashReached)
            hashString += URLread[i];
        if(URLread[i] == "#")
            hashReached = true;
    }
    if(parameterIndex < hashString.split("/").length)
        return hashString.split("/")[parameterIndex];
    else return "";
}

function getBaseURL(){
    baseURL = window.location.href;
    if (baseURL.includes("index.html"))
        baseURL = baseURL.substring(0, baseURL.indexOf("index.html") + 10);
    else{
        baseURL = baseURL.substring(0, baseURL.indexOf(".com") + 4);
        baseURL += "/";
    }
    return baseURL;
}

function URLInit(){
    location.replace(getBaseURL() + "#" + currentLanguage + "/" + currentSubpage);
}

function URLupdate(){
    location.assign(getBaseURL() + "#" + currentLanguage + "/" + currentSubpage);
}

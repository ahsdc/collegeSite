/* -------------------------------------------------- *\
|---            Variables and Parameters            ---|

'mobileUiThreshold'
___________________

The Mobile UI will load after the
value for window.innerWidth goes below
'mobileUiThreshold'.

\* -------------------------------------------------- */
var commonDBData = undefined;
var mobileUiThreshold = 700;
var siteName = "bakedSiteName";
var navData = [
    {logo: true, src: "/logo.png"},
];
var ftrData = [
    {
        text: "Site Related",
        iconUrl: "/logo.png",
        subOpts: [
            {
                text: "Admin Page",
                matSym: "settings",
                link: "/admin"
            }
        ]
    },
];


/* -------------------------------------------------- *\
|---                    Firebase                    ---|
\* -------------------------------------------------- */
const firebaseConfig = {
    apiKey: "AIzaSyD0NoujK6-q5zRz74iMTCYlRJcadlH0o3E",
    authDomain: "ahsdc-website.firebaseapp.com",
    projectId: "ahsdc-website",
    storageBucket: "ahsdc-website.firebasestorage.app",
    messagingSenderId: "408557587019",
    appId: "1:408557587019:web:8b1367c0359aa56fe95bce",
    measurementId: "G-X71YTVLKD6"
};
const app = firebase.initializeApp(firebaseConfig);
const analytics = firebase.analytics(app);
const db = firebase.firestore();



/* -------------------------------------------------- *\
|---                      Random                    ---|
\* -------------------------------------------------- */
function ce(type, opts={}, children=[]){
    let elem = document.createElement(type);
    Object.assign(elem, opts);
    for (index in children){elem.append(children[index]);}
    return elem;
}
function matSym(id, opts={}){return ce("span", Object.assign(opts, {className: "material-symbols-outlined", innerText: id}))}
function escapeHTML(str){return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#039;");}
function parseMD(str){
    try{return ce("div", {className: "md", parseSuccess: true, innerHTML: marked.parse(escapeHTML(str))});}
    catch(e){return ce("div", {className: "md", parseSuccess: false, innerText: str});}
}


/* -------------------------------------------------- *\
|---   HELP RELATING THE NAV. (The Top Floaty Bit)  ---|

Maybe ToDo: Maybe update the thing to use ce

The Logo at the Center will automatically be populated with
image found the following URL: "/logo.png"

navData = [
    {text: "Option Ichi", link: "#a", subOpts: []},

    {text: "Option Ni"},
    
    {logo: true, src: "/logo.png"},

    {
        text: "Option San",
        link: "#b",
        subOpts: [
            {
                text: "Sub-Option C",
                link: "#c"
            },
            {
                text: "Sub-Option D",
                link: "#d"
            },
            {
                text: "Sub-Option E",
                link: "/"
            },
        ]
    },

    {text: "Option 4", subOpts: [{}]}
]
createNav(navData)

\* -------------------------------------------------- */
function createHdr(pageData, navData, loadCover=true, forceMobile=false){
    let logoURL="/logo.png";
    for (i in navData){if(navData[i].logo){logoURL=navData[i].src;console.log(logoURL)}}
    
    if (forceMobile || window.innerWidth < mobileUiThreshold){
        let hdrCont = document.getElementById("hdrCont");
        hdrCont.innerHTML = "";
        hdrCont.append(
            ce("div", {id: "hdr"}, [
                ce("div", {id: "drwrCont"}, [
                    ce("div", {id: "drwrBlnk", onclick: function(){document.getElementById("drwrCont").style.display="none";}}),
                    ce("div", {id: "drwr"}, [
                        ce("div", {id: "drwrTop"}, ["Pages", matSym("close", {
                            className: "material-symbols-outlined",
                            onclick: function(){document.getElementById("drwrCont").style.display="none";}
                        })]),
                        ce("div", {id: "drwrBody"}, function(navData){
                            let returnVal = [];
                            for (index1 in navData){
                                if (!navData[index1].logo){
                                    let drwrOpts = ce("span");
                                    drwrOpts.className = "drwrOpts rBtn";
                                    drwrOpts.append(navData[index1].text);
                                    if (typeof(navData[index1].link)=='string'){
                                        drwrOpts.rLink = navData[index1].link;
                                        drwrOpts.onclick = function(){location.href = this.rLink;}
                                    }
                                    returnVal.push(drwrOpts);

                                    if (typeof(navData[index1]["subOpts"]) == "object"){
                                        for (index2 in navData[index1]["subOpts"]){
                                            let drwrSubOpts = ce("span");
                                            drwrSubOpts.className = "drwrSubOpts rBtn";
                                            drwrSubOpts.append(matSym("open_in_new"), navData[index1]["subOpts"][index2].text);
                                            if (typeof(navData[index1]["subOpts"][index2].link)=='string'){
                                                drwrSubOpts.rLink = navData[index1]["subOpts"][index2].link;
                                                drwrSubOpts.onclick = function(){location.href = this.rLink;}
                                            }
                                            returnVal.push(drwrSubOpts);
                                        }
                                    }
                                }
                            }
                            return returnVal;
                        }(navData)),
                    ])
                ]),
                ce("div",{id: "drwrBtn", className: "rBtn", onclick: function(){document.getElementById("drwrCont").style.display="block";}}, [matSym("menu")]),
                ce("div", {id: "pageIdent"}, [
                    ce("a", {href: "/"}, [ce("img", {id: "pageLogo", src: logoURL})]),
                    ce("div", {}, [
                        ce("div", {id: "pageText", innerText: pageData.text || siteName}),
                        ce("div", {id: "pageSubText", innerText: pageData.subText || siteName})
                    ])
                ]), ce("div", {id: "nav"}, function(navData){
                    let returnVal = [];
                    for (index1 in navData){
                        returnVal.push(ce("div", {"className": "navLn1Opts rBtn", innerText: navData[index1].text}));
                        if(typeof(navData[index1].link)=='string'){
                            returnVal[index1].rLink = navData[index1].link;
                            returnVal[index1].onclick = function(){location.href = this.rLink;}
                        }
                        if (typeof(navData[index1].subOpts) == "object"){
                            returnVal[index1].append(matSym("expand_more"));
                            returnVal[index1].onclick = function(){
                                document.getElementById("drwrCont").style.display="block";
                            }
                        }
                        if(navData[index1].logo){
                            delete returnVal[index1];
                        }
                    }
                    return returnVal;
                }(navData)),
                ce("div", {id: loadCover?"hdrImg":"hdrImg_"}, [ce("div", {id: loadCover?"hdrImgBlurOverlay":"hdrImgBlurOverlay_"})])
            ])
        );
        hdrCont.append(ce("style", {}, [`
                /* hdr */
                #hdr{display:flex;flex-direction:column;align-items:center;}

                /* PageIdent */
                #pageIdent{display:flex;flex-direction:column;align-items:center;margin: 0px 15px}
                #pageLogo{height:100px;width:100px;margin:20px 0px 0px 0px;border-radius:50%;border:solid 2px;border-color:var(--color30Shade);cursor:pointer;background:linear-gradient(180deg, #F5F5F5 0%, #a5a5a5 100%);box-shadow: var(--color60) 0px 0px 20px 0px, var(--color60) 0px 0px 5px 0px}
                #pageText{margin-top:10px;font-size:25px;font-weight:600;text-align:center;color:var(--color10);}
                #pageSubText{margin-top:10px;margin-bottom:15px;font-size:18px;text-align:center;color:var(--color10Tint);}

                /* Drwr */
                #drwrBtn{height:40px;width:40px;position:absolute;top:20px;left:15px;display:flex;justify-content:center;align-items:center;background:#00000080;border-color:#ffffff25;}
                #drwrCont{display:none;position:fixed;z-index:3;height:100%;width:100%;background:#00000020;color:var(--color30);}
                #drwrBlnk{position:absolute;width:80px;height:100%;right:0px}
                #drwr{position:relative;right:80px;padding-left:80px;height:100%;background:#00000080;backdrop-filter:blur(10px);border-right:solid #ffffff25 2px;}
                #drwrTop{display:flex;justify-content:space-between;align-items:center;padding:5px 10px;font-size:25px;font-weight:600;}
                #drwrTop .material-symbols-outlined{padding:8px 0px;font-size:40px;}
                #drwrBody{display:flex;flex-direction:column;overflow-y:auto;overflow-x:none;padding:0px 10px;}
                #drwrBody .material-symbols-outlined{font-size:14px;max-width:14px;margin-right:5px;position:relative;top:2px}
                .drwrOpts{font-weight:600;font-size:16px;color:var(--color30);margin-top:10px;}
                .drwrSubOpts{font-weight:400;font-size:14px;color:var(--color30Shade);margin-left:25px;margin-top:10px;}

                /* nav */
                #nav{display:flex;flex-direction:row;justify-content:safe center;width:100%;padding:8px 0px;background: var(--color60);overflow-x:auto;}
                #nav .material-symbols-outlined{font-size: 18px;max-width: 18px;}
                .navLn1Opts{display:flex;justify-content:center;align-items:center;margin:0px 0px 0px 8px;color:var(--color30);font-weight:400;font-size:14px;}

                /* NavImage */
                #hdrImg{background:url("${pageData.image}");background-repeat:no-repeat;background-position:center;background-size:contain;backdrop-filter:blur(200px);max-width:100%;min-width:100%;max-height:200px;min-height:200px;}
                #hdrImgBlurOverlay{background:url("${pageData.image}");background-repeat:no-repeat;background-position:center;background-size:contain;backdrop-filter:blur(200px);max-width:100%;min-width:100%;max-height:200px;min-height:200px;}
        `]));

    }else{
        let hdrCont = document.getElementById("hdrCont");
        hdrCont.innerHTML = "";
        hdrCont.append(
            ce("div", {id: "hdr"}, [
                ce("div", {id: "pageIdent"}, [
                    ce("a", {href: "/"}, [ce("img", {id: "pageLogo", src: logoURL})]),
                    ce("div", {}, [
                        ce("div", {id: "pageText", innerText: pageData.text || siteName}),
                        ce("div", {id: "pageSubText", innerText: pageData.subText || siteName})
                    ])
                ]),
                ce("div", {id: "nav", onmouseleave: function(){let navLn2=document.getElementById("navLn2");navLn2.innerHTML="";navLn2.style.marginBottom="0px";navLn2.style.marginTop="0px";navLn2.style.display="none";}}, [
                    ce("div", {id: "navLn1"}, function(navData){

                        let returnVal = [];
                        for (index1 in navData){
                            returnVal.push(ce("div", {"className": "navLn1Opts rBtn", innerText: navData[index1].text}));
                            if (typeof(navData[index1].link)=='string'){
                                returnVal[index1].rLink = navData[index1].link;
                                returnVal[index1].onclick = function(){location.href = this.rLink;}
                                
                                if(navData[index1].link!="#"){
                                    let parsedURL = new URL(ce("a", {href: navData[index1].link}).href);
                                    if (window.location.pathname=="/allArticle/"){
                                        if (new URLSearchParams(window.location.search).get("boardID")==new URLSearchParams(parsedURL.search).get("boardID")){
                                            returnVal[index1].className=returnVal[index1].className+" rBtnActv";
                                        }
                                    }else if(window.location.pathname=="/article/"){
                                        if (new URLSearchParams(window.location.search).get("artclID")==new URLSearchParams(parsedURL.search).get("artclID")){
                                            returnVal[index1].className=returnVal[index1].className+" rBtnActv";
                                        }
                                    }else if (window.location.pathname==parsedURL.pathname){
                                        returnVal[index1].className=returnVal[index1].className+" rBtnActv";
                                    }
                                }
                            }
                            if (typeof(navData[index1].subOpts) == "object"){
                                returnVal[index1].append(matSym("expand_more"));
                                returnVal[index1].subOpts=navData[index1]["subOpts"];
                                returnVal[index1].onmouseenter = function(){
                                    let navLn2=document.getElementById("navLn2");
                                    navLn2.innerHTML = "";navLn2.style.marginBottom = "15px";navLn2.style.marginTop = "10px";navLn2.style.display = "flex";
                                    for (index2 in this.subOpts){
                                        let navLn2Opts = ce("span", {className: "navLn2Opts rBtn"}, [matSym("open_in_new"), this.subOpts[index2].text]);
                                        if (typeof(this.subOpts[index2].link)=='string'){
                                            navLn2Opts.rLink = this.subOpts[index2].link;
                                            navLn2Opts.onclick = function(){location.href = this.rLink;}
                            
                                            if(this.subOpts[index2].link!="#"){
                                                let parsedURL = new URL(ce("a", {href: this.subOpts[index2].link}).href);
                                                if (window.location.pathname=="/allArticle/"){
                                                    if (new URLSearchParams(window.location.search).get("boardID")==new URLSearchParams(parsedURL.search).get("boardID")){
                                                        navLn2Opts.className=navLn2Opts.className+" rBtnActv";
                                                    }
                                                }else if(window.location.pathname=="/article/"){
                                                    if (new URLSearchParams(window.location.search).get("artclID")==new URLSearchParams(parsedURL.search).get("artclID")){
                                                        navLn2Opts.className=navLn2Opts.className+" rBtnActv";
                                                    }
                                                }else if (window.location.pathname==parsedURL.pathname){
                                                    navLn2Opts.className=navLn2Opts.className+" rBtnActv";
                                                }
                                            }
                                        }
                                        navLn2.append(navLn2Opts);
                                    }
                                }
                            }else{
                                returnVal[index1].onmouseenter = function(){
                                    navLn2.innerHTML = "";navLn2.style.marginBottom = "0px";navLn2.style.marginTop = "0px";navLn2.style.display = "none";
                                }
                            }
                            if(navData[index1].logo){
                                delete returnVal[index1];
                            }
                        }
                        return returnVal;

                    }(navData)),
                    ce("div", {id: "navLn2"})
                ]),
                ce("div", {id: loadCover?"hdrImg":"hdrImg_"}, [ce("div", {id: loadCover?"hdrImgBlurOverlay":"hdrImgBlurOverlay_"})])
            ])
        );
        hdrCont.append(
            ce("style", {}, [`
                /* hdr */
                #hdr{display:flex;flex-direction:column;align-items:center;}

                /* PageIdent */
                #pageIdent{display:flex;flex-direction:row;align-items:center;margin: 0px 15px}
                #pageLogo{height: 112px;width: 112px;border-radius: 50%;border:solid 2px;border-color:var(--color30Shade);cursor: pointer;background: linear-gradient(180deg, #F5F5F5 0%, #a5a5a5 100%);box-shadow: var(--color60) 0px 0px 20px 0px, var(--color60) 0px 0px 5px 0px;margin: 10px 10px 10px 0px}
                #pageText{margin-top: 30px;font-size: 35px;font-weight: 600;text-align: center;color: var(--color10);}
                #pageSubText{margin-top: 10px;margin-bottom: 30px;font-size: 25px;text-align: center;color: var(--color10Tint);}
                
                /* nav */
                #nav{display:flex;flex-direction:column;padding:30px 0px;width:100%;background: var(--color60);}
                #navLn1{display:flex;flex-direction:row;justify-content:safe center;width:100%;overflow-x:auto;}
                #navLn2{display:flex;flex-direction:column;overflow-x:auto;margin: 0px 100px}
                .navLn1Opts{color:var(--color30);font-weight:400;font-size:20px;display:flex;justify-content:center;align-items:center;margin:0px 0px 0px 8px;}
                .navLn2Opts{display:flex;justify-content:center;align-items:center;margin:10px 0px 0px 0px;}
                #navLn2 .material-symbols-outlined{font-size: 17px;max-width: 17px;margin-right: 5px;position: relative;top: 2px;}
                .rBtnActv{font-weight: 600;background: #00000080;transition: ease-out 200ms;color: var(--color10)}

                /* NavImage */
                #hdrImg{background:url("${pageData.image}");background-repeat:no-repeat;background-position:center;background-size:contain;backdrop-filter:blur(200px);max-width:100%;min-width:100%;max-height:250px;min-height:250px;}
                #hdrImgBlurOverlay{background:url("${pageData.image}");background-repeat:no-repeat;background-position:center;background-size:contain;backdrop-filter:blur(200px);max-width:100%;min-width:100%;max-height:250px;min-height:250px;}
            `])
        );
    }
}



/* -------------------------------------------------- *\
|---          HELP RELATING THE OverPage.           ---|
\* -------------------------------------------------- */

function createOP(title, bodyDom){
    document.getElementById("overPage").innerHTML = "";
    document.getElementById("overPage").append(
        ce("div", {className: "OPCard"}, [
            ce("div", {className: "OPTopBar"}, [
                title,
                matSym("close", {className: "rBtn material-symbols-outlined", onclick: function(){document.getElementById("overPage").style.display = "none";}})
            ]),
            bodyDom
        ])
    );
    document.getElementById("overPage").style.display = "flex";
}



/* -------------------------------------------------- *\
|---         HELP RELATING THE Notice Box.          ---|

artclData = {
    title: "",
    boardID: "",
    artclID: "",
    date: 0,
    body: "",
    images: ["URL", "URL"]
}
createArticle(navData)

ToDo: Expand images when clicked/tapped upon.
ToDo: Create the "Share" area. (Below Images)
ToDo: Implement something like **MarkDown** for innerText.

\* -------------------------------------------------- */
function createArticle(artclData){
    let dateObj = new Date(artclData.date);

    return ce("div", {className: "artcl"}, [
        ce("div", {className: "artclTop"}, [
            ce("div", {className: "rSectTitle"}, [matSym("newspaper", {style: "margin-right: 5px;"}), ce("span", {innerText: artclData.title})]),
            ce("div", {className: "rSectGrayTxt"}, [matSym("schedule", {style: "margin-right: 5px;"}), ce("b", {innerText: "Date:", style: "margin-right: 5px;"}), ce("span", {innerText: `${dateObj.getDate()}/${dateObj.getMonth()}/${dateObj.getFullYear()}`})]),
            ce("div", {className: "rSectGrayTxt"}, [matSym("fingerprint", {style: "margin-right: 5px;"}), ce("b", {innerText: "WebID:", style: "margin-right: 5px;"}), ce("span", {innerText: artclData.artclID})]),
        ]),
        ce("div", {className: "artclDiv artclBody", style: "overflow-x: auto"}, [parseMD(artclData.body)]),
        ce("div", {className: "artclDiv"}, [
            ce("hr"),
            ce("div", {className: "rSectGrayTxt"}, [matSym("photo", {style: "margin-right: 5px;"}), ce("span", {innerText: "Images"})]),
            ce("div", {className: "artclImgCont"}, function(){
                let retVal=[];
                for(index in artclData.images){
                    retVal.push(ce("img", {src: artclData.images[index], onclick: function(){createOP("Image", ce("img", {src: this.src, style:"max-height: 85vh;max-width: 90vw"}));}}));
                }
                return retVal;
            }()),
        ]),
        ce("div", {className: "artclDiv"}, [
            ce("hr"),
            ce("div", {className: "rSectGrayTxt"}, [matSym("share", {style: "margin-right: 5px;"}), ce("span", {innerText: "Share"})]),
            ce("div", {className: "artclShare"}, [
                ce("div", {className: "rBtn", onclick: function(){window.open(`${window.location.origin}/article/?boardID=${artclData.boardID||""}&artclID=${artclData.artclID||""}`, "_blank");}}, [matSym("link")]),
                ce("div", {className: "rBtn", onclick: function(){}}, [matSym("mail")]),
            ]),
        ]),
    ]);
}

function createArtclCard(artclData){
    let dateO = new Date(artclData.date);
    let body = ce("div", {className: "rCardBody"});
    if (typeof(artclData.images) == "object"){
        if(artclData.images.length > 0){
            body.append(ce("img", {src: artclData.images[0]}));
        }else{
            body.append(parseMD(artclData.body));
        }
    }else{
        body.append(parseMD(artclData.body));
    }
    return ce("div", {className: "rCard", onclick: function(){location.href = `/article/?boardID=Notice&artclID=${artclData.artclID}`;}}, [
        ce("div", {classList: "rCardTtl", innerText: artclData.title}),
        ce("div", {className: "rCardDate"}, [matSym("schedule", {style: "margin-right:5px;"}), ce("span", {}, [ce("b", {}, ["Date: "]), `${dateO.getDate()}/${dateO.getMonth()}/${dateO.getFullYear()}`])]),
        body
    ]);
}


/* -------------------------------------------------- *\
|---          HELP RELATING THE prsnCard.           ---|

prsnData = {
    name: "",
    post: "",
    image: "",
    body: "",
    prsnID: ""
}
createPrsnCard(prsnData)

\* -------------------------------------------------- */

function createPrsnCard(prsnData){
    return ce("div", {className: "prsnCard"}, [
        ce("div", {className: "prsnCardBGTop"}),
        ce("div", {className: "prsnCardFG"}, [
            ce("div", {className: "prsnCardName", innerText: prsnData.name}),
            ce("div", {className: "prsnCardPost"}, [matSym("work", {style: "margin-right:5px;"}), ce("span", {}, ["Post:", ce("b",{innerText: prsnData.post, style: "margin-left:5px"})])]),
            ce("img", {className: "prsnCardImg", src: prsnData.image}),
            ce("div", {className: "prsnCardBody"}, [parseMD(prsnData.body)]),
            ce("div", {className: "prsnCardID"}, [matSym("fingerprint", {style: "margin-right:5px;"}), ce("span", {}, [ce("b", {}, ["WebID: "]), prsnData.prsnID])]),
        ])
    ]);
}



/* -------------------------------------------------- *\
|---           HELP RELATING THE Footer.            ---|

ftrData = [
    {
        text: "Section Title 1",
        matSym: "photo",
        subOpts: [
            {
                text: "Ftr Link 1",
                matSym: "link",
                link: "#FtrLink1"
            },
            {
                text: "Ftr Link 2",
                iconUrl: "/logo.png",
                link: "#FtrLink2"
            },
            {
                text: "Ftr Link 3",
                link: "#FtrLink3"
            },
        ]
    },
    {
        text: "Section Title 2",
        iconUrl: "/logo.png",
        subOpts: []
    },
    {
        text: "Section Title 3",
        subOpts: [
            {
                text: "Ftr Link 4",
                matSym: "open_in_new",
                link: "#FtrLink4"
            },
        ]
    },
    {
        subOpts: [
            {
                text: "Ftr Link 5",
                iconUrl: "/logo.png",
                link: "#FtrLink5"
            },
        ]
    }
];
createFtr(ftrData)

\* -------------------------------------------------- */

function createFtr(ftrData){
    let ftrCont = document.getElementById("ftrCont");
    ftrCont.innerHTML = "";

    let ftrColCont = ce("div", {className: "ftrColCont"});
    for (ftrColIndex in ftrData){
        let ftrCol = ce("div", {className: "ftrCol"});

        if (ftrData[ftrColIndex].text){
            if (ftrData[ftrColIndex].matSym){
                ftrCol.append(ce("div", {className: "ftrColTtl"}, [
                    ce("span", {className: "material-symbols-outlined", style: "margin-right:5px;", innerText: ftrData[ftrColIndex].matSym}),
                    ce("span", {innerText: ftrData[ftrColIndex].text})
                ]));
            }
            else if(ftrData[ftrColIndex].iconUrl){
                ftrCol.append(ce("div", {className: "ftrColTtl"}, [
                    ce("img", {src: ftrData[ftrColIndex].iconUrl}),
                    ce("span", {innerText: ftrData[ftrColIndex].text})
                ]));
            }
            else{
                ftrCol.append(ce("div", {className: "ftrColTtl"}, [
                    ce("span", {innerText: ftrData[ftrColIndex].text})
                ]));
            }
        }else{
            ftrCol.append(ce("div", {className: "ftrColTtl"}));
        }

        for (ftrItemIndex in ftrData[ftrColIndex].subOpts){
            if (ftrData[ftrColIndex].subOpts[ftrItemIndex].matSym){
                ftrCol.append(ce("a", {className: "rSectGrayTxt", href: ftrData[ftrColIndex].subOpts[ftrItemIndex].link}, [
                    ce("span", {className: "material-symbols-outlined", style: "margin-right:5px;", innerText: ftrData[ftrColIndex].subOpts[ftrItemIndex].matSym}),
                    ce("span", {innerText: ftrData[ftrColIndex].subOpts[ftrItemIndex].text})
                ]));
            }
            else if(ftrData[ftrColIndex].subOpts[ftrItemIndex].iconUrl){
                ftrCol.append(ce("a", {className: "rSectGrayTxt", href: ftrData[ftrColIndex].subOpts[ftrItemIndex].link}, [
                    ce("img", {src: ftrData[ftrColIndex].subOpts[ftrItemIndex].iconUrl}),
                    ce("span", {innerText: ftrData[ftrColIndex].subOpts[ftrItemIndex].text})
                ]));
            }else{
                ftrCol.append(ce("a", {className: "rSectGrayTxt", href: ftrData[ftrColIndex].subOpts[ftrItemIndex].link}, [
                    ce("span", {innerText: ftrData[ftrColIndex].subOpts[ftrItemIndex].text})
                ]));
            }
        }
        
        ftrColCont.append(ftrCol);
    }

    ftrCont.append(ce("div", {className: "pageCenA"}, [ce("div", {className: "pageCenB"}, [
        ftrColCont,
        ce("div", {style: "display:flex;flex-wrap:wrap;justify-content:space-between;"}, [
            ce("span", {className: "rSectGrayTxt", style: "margin:5px 20px;", innerText: "Copyright © All rights reserved"}),
            ce("span", {className: "rSectGrayTxt", style: "margin:5px 20px;", innerText: "Developed by Isfar Tausif"}),
        ])
    ])]));
}



/* -------------------------------------------------- *\
|---                    Page Init                   ---|
\* -------------------------------------------------- */
function loadCommonData(callback){
    db.collection("siteData").doc("common").get().then((ref)=>{
        commonDBData = ref.data();
        callback();
    });
}
function initPage(arg={pageName: undefined, noSubNavImage: false, subNavImage: undefined, onCommonLoad: undefined, extraCSS: undefined}){
    loadCommonData(()=>{
        // Set Colors
        try{commonDBData.colors.color10}catch(e){commonDBData = Object(commonDBData);commonDBData["colors"]={};}
        let commonCSSExtra = ce("style");
        commonCSSExtra.append(`
            :root{
                --color10: ${commonDBData.colors.color10 || "#ff4466"};
                --color10Tint: ${commonDBData.colors.color10Tint || "#ffaabb"};
                --color30: ${commonDBData.colors.color30 || "#ffffff"};
                --color30Shade: ${commonDBData.colors.color30Shade || "#b5b5b5"};
                --color60: ${commonDBData.colors.color60 || "#151515"};
                --color60Tint: ${commonDBData.colors.color60Tint || "#202020"};
                --colorGreen: ${commonDBData.colors.colorGreen || "#10f060"};
                --mobileUiThreshold: ${mobileUiThreshold}px;
            }
            @media only screen and (max-width: ${mobileUiThreshold}px){
                #subNavImg{max-height: 150px;min-height: 150px;}#subNavImgBlurOverlay{max-height: 150px;min-height: 150px;}#subNavTxt{font-size: 25px;}#subNavSubTxt{font-size: 18px;}
            }
        `, arg.extraCSS);
        document.head.append(commonCSSExtra);
    
        // Set Page Title
        document.getElementsByTagName("head")[0].append(ce("title", {}, [`${arg.pageName || ""} - ${commonDBData.siteName || siteName}`]));
  
        // Load Header
        createHdr(
            {
                text: commonDBData.siteName || siteName,
                subText: arg.pageName || "",
                image: arg.subNavImage || Object(Object(commonDBData.pinnedPhotos)[Math.floor(Math.random() * (Object(commonDBData.pinnedPhotos).length)) || 0]).url
            },
            commonDBData.navData || navData,
            !arg.noSubNavImage
        );
    
        // Load Footer
        createFtr(commonDBData.ftrData || ftrData);

        // OnLoad Callback
        if (typeof(arg.onCommonLoad) == 'function'){arg.onCommonLoad();}
    });
}
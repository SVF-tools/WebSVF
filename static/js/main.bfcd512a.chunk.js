(this["webpackJsonplanding-page"]=this["webpackJsonplanding-page"]||[]).push([[0],[,function(e){e.exports=JSON.parse('{"demo":{"link":"https://websvf.top/","password":"Vincent_2020"},"carousel":[{"heading":"Code Anywhere","subHeading":"with our Online Code Editor","description":"Our online code editor powered by VSCode Online allows you to work on your projects anywhere.","extendedDescription":"Hosted on scalable AWS Servers means you can compile and computer faster than even your local machine.","image":"vscode_online_carousel.png","active":"active"},{"heading":"Visualize Your Projects","subHeading":"as 3D Forced Graphs","description":"Dive into code analysis with ease using our React powered 3D Forced Graph Analysis","extendedDescription":"Every file including external libraries are represented as nodes clustered in groups following the project heirarchy","image":"Forced-Graph_carousel.png","active":""},{"heading":"Deep Bug Search","subHeading":"Using SVF\'s Code Analysis","description":"With the click of a button, analyse your entire project for compile and runtime errors","extendedDescription":"as well as highlight potential points of failure within indvidual files","image":"bug_carousel_alt_2_480.png","active":""}],"icons":[{"icon":"far fa-file-code","heading":"C++ Project Support","content":"Upload you C++ project onto our online code editor and compile and run it on our secured server"},{"icon":"fas fa-project-diagram","heading":"Visualize your Data in 3D","content":"In a single click Web-SVF can compile your project and visualize as a 3D Forced graph with interacable nodes within our editor"},{"icon":"fas fa-bug","heading":"Bug Analysis","content":"One click can analyse you project for bugs and potential points of failure, highlighting them in the 3D forced graph as well as generate a detailed Bug Report."}],"install-banner":{"callToAction":"Setup your own local instance of","subHeading":"in a few simple steps:"},"videos":[{"title":"Setup and Test WebSVF","description":"Get started with setting up WebSVF and using it with a sample C Project.","youtube-link":"https://www.youtube.com/embed/ArzYCh7vOU0","icon":"fab fa-ubuntu"},{"title":"WebSVF-frontend User Guide","description":"An overview of the WebSVF-frontend and WebSVF-frontend-server and how to use them to get started with WebSVF.","youtube-link":"https://www.youtube.com/embed/ybl9vLaBeE8","icon":"fas fa-cogs"},{"title":"WebSVF-codemap-extension User Guide","description":"A step by step guide taking you through the WebSVF\'s codemap-extension and all of its features.","youtube-link":"https://www.youtube.com/embed/3f2VE1nvC0I","icon":"fas fa-laptop-code"}],"contributors":{"heading":"This project would not have been possible without our core contributors...","developers":[{"name":"Tianyang Guan","link":"https://github.com/spcidealacm/","image":"Tianyang_Guan.jpg","university":"University of Technology Sydney","university-link":"https://www.uts.edu.au/"},{"name":"Akshat Kaushik","link":"https://github.com/akshatsinghkaushik","image":"Akshat_Kaushik.jpg","university":"University of Technology Sydney","university-link":"https://www.uts.edu.au/"},{"name":"Zicheng Qu","link":"https://github.com/ZichengQu","image":"Zicheng_Qu.jpg","university":"University of Technology Sydney","universityLink":"https://www.uts.edu.au/"},{"name":"Jiachen Liu","link":"https://github.com/JIACHENLIU09","image":"Jiachen_Liu.jpg","university":"University of Technology Sydney","universityLink":"https://www.uts.edu.au/"},{"name":"Prashant Shrestha","link":"https://github.com/sthprashant","image":"Prashant_Shrestha.jpg","university":"University of Technology Sydney","universityLink":"https://www.uts.edu.au/"},{"name":"Lee","link":"https://github.com/zexiliudai","image":"Lee.jpg","university":"University of Technology Sydney","universityLink":"https://www.uts.edu.au/"},{"name":"Wei","link":"https://github.com/winoooops","image":"Wei.jpg","university":"University of Technology Sydney","universityLink":"https://www.uts.edu.au/"},{"name":"Zeren Yu","link":"https://github.com/yukinsnow","image":"Zeren_Yu.jpg","university":"University of Technology Sydney","universityLink":"https://www.uts.edu.au/"}],"supervisors":[{"name":"Dr Qirun Zhang","link":"http://helloqirun.github.io/","image":"Qirun-Zhang.jpg","position":"Assistant Professor","university":"Georgia Institute of Technology","universityLink":"http://www.gatech.edu/"},{"name":"Dr Yulei Sui","link":"https://yuleisui.github.io/","image":"Yulei-Sui.jpg","position":"Senior Lecturer","university":"University of Technology Sydney","universityLink":"https://www.uts.edu.au/"}]},"signUpBanner":{"heading":"Ready to get started?","buttonText":"Sign up now!"},"footer":{"navigation":[{"title":"About","link":"#navbar"},{"title":"Contact","link":"#navbar"},{"title":"Terms of Use","link":"#navbar"},{"title":"Privacy Policy","link":"#navbar"}],"icons":[{"icon":"fas fa-cloud-upload-alt","link":"#navbar"},{"icon":"fab fa-github","link":"https://github.com/SVF-tools/WebSVF"},{"icon":"fas fa-code-branch","link":"https://github.com/SVF-tools/WebSVF/fork"}]}}')},,,,,,,,,function(e,t,a){e.exports=a(23)},,,,,function(e,t,a){},,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(9),i=a.n(l),s=(a(15),function(){return r.a.createElement("nav",{className:"navbar navbar-light bg-light static-top"},r.a.createElement("div",{id:"navbar",className:"container"},r.a.createElement("a",{className:"navbar-brand",href:"#navbar"},r.a.createElement("h1",{style:{fontWeight:"bold",color:"black",fontSize:"2em",fontFamily:"Electrolize"},data:"WebSVF"},"WebSVF")),r.a.createElement("a",{className:"btn btn-primary",href:"#header-top"},"Sign Up")))}),c=a(4),o=(a(17),{apiKey:"AIzaSyC8Yufy9Z69MaeXbnmFLX8SOu51ZpyWkTA",authDomain:"web-test-email.firebaseapp.com",databaseURL:"https://web-test-email.firebaseio.com",projectId:"web-test-email",storageBucket:"web-test-email.appspot.com",messagingSenderId:"709401871584",appId:"1:709401871584:web:a9a1108f3530e3b9c67c85"}),m=(a(20),function(e){var t=e.link,a=e.password,l=Object(n.useRef)(),i=Object(n.useRef)();return Object(n.useEffect)((function(){c.initializeApp(o);var e=c.database().ref("signup-email");l.current.addEventListener("submit",(function a(n){n.preventDefault(),function(t){e.push().set({email:t})}((r="header-email",document.getElementById(r).value)),l.current.reset(),i.current.style.display="block";var r;return setTimeout((function(){window.open(t,"_blank")}),5e3),setTimeout((function(){i.current.style.display="none"}),3e4),function(){l.current.removeEventListener("submit",a)}}))}),[t]),r.a.createElement("header",{id:"header-top",className:"masthead text-white text-center"},r.a.createElement("div",{className:"overlay"}),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-xl-12 mx-auto"},r.a.createElement("h1",{className:"mb-5 masthead-heading"},r.a.createElement("div",{className:"title"},"Web-SVF:"),"Online Code Analysis Platform powered by",r.a.createElement("br",null),r.a.createElement("a",{className:"link",href:"https://github.com/SVF-tools/SVF",target:"_blank",rel:"noopener noreferrer"},"SVF-Tools"),r.a.createElement("br",null),r.a.createElement("br",null),"Sign Up to stay updated on the latest develepments")),r.a.createElement("div",{className:"col-md-10 col-lg-8 col-xl-7 mx-auto"},r.a.createElement("form",{id:"signupform",ref:l},r.a.createElement("div",{className:"form-row"},r.a.createElement("div",{className:"col-12 col-md-9 mb-2 mb-md-0"},r.a.createElement("input",{type:"email",id:"header-email",className:"form-control form-control-lg",placeholder:"Enter your email...",required:!0})),r.a.createElement("div",{className:"col-12 col-md-3"},r.a.createElement("button",{type:"submit",className:"btn btn-block btn-lg btn-primary"},"Sign Up!"))))),r.a.createElement("div",{id:"alertsignup",ref:i,className:"col-md-10 col-lg-8 col-xl-7 mx-auto"},r.a.createElement("div",{className:"alert mt-1"},r.a.createElement("span",{className:"closebtn",onClick:function(){i.current.style.display="none"}},"\xd7"),r.a.createElement("br",null),r.a.createElement("p",null,"Email added to Mailing List."),r.a.createElement("p",null,"Demo website is opening in a new tab...",r.a.createElement("br",null),"If the demo page does not open automatically after 5 seconds,"," ",r.a.createElement("a",{href:t,target:"_blank",rel:"noopener noreferrer"},"click here")),r.a.createElement("p",{className:"highlight"},"Password:"),r.a.createElement("p",{className:"password"},a))))))}),u=function(e){var t=e.heading,a=e.icon,n=e.content;return r.a.createElement("div",{className:"col-lg-4"},r.a.createElement("div",{className:"features-icons-item mx-auto mb-5 mb-lg-0 mb-lg-4"},r.a.createElement("div",{className:"features-icons-icon d-flex"},r.a.createElement("i",{className:"".concat(a," m-auto text-primary")})),r.a.createElement("h3",null,t),r.a.createElement("p",{className:"lead mb-0"},n)))},d=function(e){var t=e.icons;return r.a.createElement("section",{className:"features-icons bg-light text-center"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row"},t.map((function(e){return r.a.createElement(u,{key:e.heading,heading:e.heading,icon:e.icon,content:e.content})})))))},p=function(e){var t=e.children;return r.a.createElement("div",{id:"myCarousel",className:"carousel slide carousel-fade","data-ride":"carousel"},r.a.createElement("div",{className:"carousel-inner"},t),r.a.createElement("a",{className:"carousel-control-prev",href:"#myCarousel",role:"button","data-slide":"prev"},r.a.createElement("span",{className:"carousel-control-prev-icon","aria-hidden":"true"}),r.a.createElement("span",{className:"sr-only"},"Previous")),r.a.createElement("a",{className:"carousel-control-next",href:"#myCarousel",role:"button","data-slide":"next"},r.a.createElement("span",{className:"carousel-control-next-icon","aria-hidden":"true"}),r.a.createElement("span",{className:"sr-only"},"Next")))},h=function(e){var t=e.heading,a=e.subHeading,n=e.desc,l=e.extDesc,i=e.image,s=e.active;return r.a.createElement("div",{className:"carousel-item ".concat(s)},r.a.createElement("div",{className:"mask flex-center"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row align-items-center"},r.a.createElement("div",{className:"col-md-7 col-12 order-md-1 order-2"},r.a.createElement("h4",null,t," ",r.a.createElement("br",null),a),r.a.createElement("p",null,n," ",r.a.createElement("br",null),l),r.a.createElement("a",{href:"https://github.com/SVF-tools/WebSVF",target:"_blank",rel:"noopener noreferrer"},r.a.createElement("i",{className:"fab fa-github fa-fw"}),"Find Out More")),r.a.createElement("div",{className:"col-md-5 col-12 order-md-2 order-1"},r.a.createElement("img",{src:"img/".concat(i),className:"mx-auto",alt:"slide"}))))))},g=(a(21),function(e){var t=e.carousel;return r.a.createElement(p,null,t.map((function(e,t){return r.a.createElement(h,{key:t,heading:e.heading,subHeading:e.subHeading,desc:e.description,extDesc:e.extendedDescription,image:e.image,active:e.active})})))}),v=(a(22),function(e){var t=e.callToAction,a=e.subHeading;return r.a.createElement("section",{className:"install-banner"},r.a.createElement("div",{className:"features-icons-icon d-flex"},r.a.createElement("i",{className:"fas fa-server m-auto icon"})),r.a.createElement("br",null),r.a.createElement("h1",null,t),r.a.createElement("h1",{className:"highlight"},"Web-SVF"),r.a.createElement("h2",null,a))}),b=function(e){var t=e.heading,a=e.desc,n=e.order,l=e.icon;return r.a.createElement("div",{className:"col-lg-5 order-lg-".concat(n," my-auto showcase-text")},r.a.createElement("div",{className:"features-icons text-center"},r.a.createElement("div",{className:"features-icons-item mx-auto"},r.a.createElement("div",{className:"features-icons-icon d-flex"},r.a.createElement("i",{className:"".concat(l," m-auto text-primary")}))),r.a.createElement("h2",null,t),r.a.createElement("p",{className:"lead mb-0"},a)))},f=function(e){var t=e.title,a=e.link,n=e.order;return r.a.createElement("div",{className:"col-lg-7 order-lg-".concat(n," text-white showcase-img embed-responsive embed-responsive-16by9")},r.a.createElement("iframe",{title:t,src:a,frameBorder:"0",allow:"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",allowFullScreen:!0}))},E=function(e){var t=e.videos;return r.a.createElement("section",{className:"showcase"},r.a.createElement("div",{className:"container-fluid p-0"},t.map((function(e,t){return t%2===0?r.a.createElement("div",{key:t,className:"row no-gutters"},r.a.createElement(b,{title:e.title,desc:e.description,order:1,icon:e.icon}),r.a.createElement(f,{title:e.title,link:e["youtube-link"],order:2})):r.a.createElement("div",{key:t,className:"row no-gutters"},r.a.createElement(b,{title:e.title,desc:e.description,order:2,icon:e.icon}),r.a.createElement(f,{title:e.title,link:e["youtube-link"],order:1}))}))))},y=function(e){var t=e.contributors;return r.a.createElement("section",{className:"testimonials text-center bg-light"},r.a.createElement("div",{className:"container"},r.a.createElement("h2",{className:"mb-5"},t.heading),function(){for(var e=t.developers.length%4,a=[],n=[],l=0;l<t.developers.length-e;++l){if(a.length<4){var i=r.a.createElement("div",{key:l,className:"col-xl-3"},r.a.createElement("div",{className:"testimonial-item mx-auto mb-5 mb-xl-4"},r.a.createElement("a",{href:"".concat(t.developers[l].link),target:"_blank",rel:"noopener noreferrer"},r.a.createElement("img",{className:"img-fluid rounded-circle mb-3",src:"img/".concat(t.developers[l].image),alt:""})),r.a.createElement("h5",null,t.developers[l].name),r.a.createElement("p",{className:"font-weight-light mb-0"},r.a.createElement("strong",null,"Developer"),r.a.createElement("br",null),r.a.createElement("a",{href:"".concat(t.developers[l].universityLink),target:"_blank",rel:"noopener noreferrer"},t.developers[l].university))));a.push(i)}if(4===a.length){var s=r.a.createElement("div",{key:l,className:"row pb-3"},a);n.push(s),a=[]}}if(e>0){a=[];for(var c=t.developers.length-e;c<t.developers.length;++c){var o=12/e,m=r.a.createElement("div",{key:c,className:"col-xl-".concat(o)},r.a.createElement("div",{className:"testimonial-item mx-auto mb-5 mb-xl-4"},r.a.createElement("a",{href:"".concat(t.developers[c].link),target:"_blank",rel:"noopener noreferrer"},r.a.createElement("img",{className:"img-fluid rounded-circle mb-3",src:"img/".concat(t.developers[c].image),alt:""})),r.a.createElement("h5",null,t.developers[c].name),r.a.createElement("p",{className:"font-weight-light mb-0"},r.a.createElement("strong",null,"Developer"),r.a.createElement("br",null),r.a.createElement("a",{href:"".concat(t.developers[c].universityLink),target:"_blank",rel:"noopener noreferrer"},t.developers[c].university))));a.push(m)}var u=r.a.createElement("div",{className:"row pb-3"},a);n.push(u)}return n}(),function(){for(var e=t.supervisors.length%4,a=[],n=[],l=0;l<t.supervisors.length-e;++l){if(console.log(l),a.length<4){var i=r.a.createElement("div",{key:l,className:"col-xl-3"},r.a.createElement("div",{className:"testimonial-item mx-auto mb-5 mb-xl-4"},r.a.createElement("a",{href:"".concat(t.supervisors[l].link)},r.a.createElement("img",{className:"img-fluid rounded-circle mb-3",src:"img/".concat(t.supervisors[l].image),alt:""})),r.a.createElement("h5",null,t.supervisors[l].name),r.a.createElement("p",{className:"font-weight-light mb-0"},"Project Supervisor ",r.a.createElement("br",null),r.a.createElement("strong",{style:{fontWeight:"600"}},t.supervisors[l].position," ",r.a.createElement("br",null),r.a.createElement("a",{href:"".concat(t.supervisors[l].universityLink),target:"_blank",rel:"noopener noreferrer"},t.supervisors[l].university)))));a.push(i)}if(4===a.length){var s=r.a.createElement("div",{className:"row pb-3"},a);n.push(s),a=[]}}if(e>0){a=[];for(var c=t.supervisors.length-e;c<t.supervisors.length;++c){var o=12/e,m=r.a.createElement("div",{key:c,className:"col-xl-".concat(o)},r.a.createElement("div",{className:"testimonial-item mx-auto mb-5 mb-xl-4"},r.a.createElement("a",{href:"".concat(t.supervisors[c].link)},r.a.createElement("img",{className:"img-fluid rounded-circle mb-3",src:"img/".concat(t.supervisors[c].image),alt:""})),r.a.createElement("h5",null,t.supervisors[c].name),r.a.createElement("p",{className:"font-weight-light mb-0"},"Project Supervisor ",r.a.createElement("br",null),r.a.createElement("strong",{style:{fontWeight:"600"}},t.supervisors[c].position," ",r.a.createElement("br",null),r.a.createElement("a",{href:"".concat(t.supervisors[c].universityLink),target:"_blank",rel:"noopener noreferrer"},t.supervisors[c].university)))));a.push(m)}var u=r.a.createElement("div",{key:n.length+1,className:"row pb-3"},a);n.push(u)}return n}()))},w=function(e){var t=e.heading,a=(e.placeholder,e.buttonText);return r.a.createElement("section",{className:"call-to-action text-white text-center"},r.a.createElement("div",{className:"overlay"}),r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-xl-12 mx-auto"},r.a.createElement("h2",{className:"mb-4"},t),r.a.createElement("form",null,r.a.createElement("button",{type:"submit",onClick:function(){return window.location.href="#signupform"},style:{maxWidth:"250px"},className:"btn btn-block btn-lg btn-primary mx-auto"},a))),r.a.createElement("div",{className:"col-md-10 col-lg-8 col-xl-3 mx-auto"}))))},N=function(e){var t=e.navigation,a=e.icons;return r.a.createElement("footer",{className:"footer bg-light"},r.a.createElement("div",{className:"container"},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-lg-6 h-100 text-center text-lg-left my-auto"},r.a.createElement("ul",{className:"list-inline mb-2"},t.map((function(e,t){return 0!==t?r.a.createElement(r.a.Fragment,{key:t},r.a.createElement("li",{className:"list-inline-item"},"\u22c5"),r.a.createElement("li",{className:"list-inline-item"},r.a.createElement("a",{href:"".concat(e.link)},e.title))):r.a.createElement(r.a.Fragment,{key:t},r.a.createElement("li",{className:"list-inline-item"},r.a.createElement("a",{href:"".concat(e.link)},e.title)))}))),r.a.createElement("p",{id:"site-yr",className:"text-muted small mb-4 mb-lg-0"},"\xa9"," SVF-Tools ".concat((new Date).getFullYear(),". All Rights Reserved."))),r.a.createElement("div",{className:"col-lg-6 h-100 text-center text-lg-right my-auto"},r.a.createElement("ul",{className:"list-inline mb-0"},a.map((function(e,t){return r.a.createElement("li",{key:t,className:"list-inline-item mr-3"},r.a.createElement("a",{href:"".concat(e.link),target:"_blank",rel:"noopener noreferrer"},r.a.createElement("i",{className:"".concat(e.icon," fa-2x fa-fw")})))})))))))},k=a(1),x=function(){return r.a.createElement("div",null,r.a.createElement(s,null),r.a.createElement(m,{link:k.demo.link,password:k.demo.password}),r.a.createElement(g,{carousel:k.carousel}),r.a.createElement(d,{icons:k.icons}),r.a.createElement(v,{callToAction:k["install-banner"].callToAction,subHeading:k["install-banner"].subHeading}),r.a.createElement(E,{videos:k.videos}),r.a.createElement(y,{contributors:k.contributors}),r.a.createElement(w,{heading:k.signUpBanner.heading,placeholder:k.signUpBanner.placeholder,buttonText:k.signUpBanner.buttonText}),r.a.createElement(N,{navigation:k.footer.navigation,icons:k.footer.icons}))};i.a.render(r.a.createElement(x,null),document.querySelector("#root"))}],[[10,1,2]]]);
//# sourceMappingURL=main.bfcd512a.chunk.js.map
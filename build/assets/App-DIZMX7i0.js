var ke=Object.defineProperty;var _e=(n,s,e)=>s in n?ke(n,s,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[s]=e;var o=(n,s,e)=>_e(n,typeof s!="symbol"?s+"":s,e);import{_ as Oe,u as Q,a as Ye,r as P,j as f,B as I,I as Ee,T as se,l as Pe,s as Le,b as le,c as He,g as H,d as C,e as Ie,f as Ce,h as Ne,i as Fe,k as qe,F as ve,m as Be,n as We,o as de,p as Re,O as je}from"./index-Dv6g3rr8.js";import{t as c,c as D,m as he,a as fe,b as q,d as ye,g as G,s as R,e as Ae,f as Qe,h as N,i as we,j as me,k as Ge,l as pe,n as xe,o as j,p as ze,w as ae,q as Xe,r as Ue,u as Ve,v as Ze,T as $e,A as Ke,M as Je,x as A,S as Se,L as et}from"./Avatar-RbDUqXci.js";function z(n,s){const e=+c(n);return D(n,e+s)}function tt(n,s){return z(n,s*1e3)}function rt(n,s){return z(n,s*he)}function nt(n,s){return z(n,s*fe)}function st(n,s){const e=s*7;return q(n,e)}function at(n,s){return ye(n,s*12)}function oe(n){const s=c(n);return s.setHours(23,59,59,999),s}function ot(n,s){var l,u,w,M;const e=G(),t=(s==null?void 0:s.weekStartsOn)??((u=(l=s==null?void 0:s.locale)==null?void 0:l.options)==null?void 0:u.weekStartsOn)??e.weekStartsOn??((M=(w=e.locale)==null?void 0:w.options)==null?void 0:M.weekStartsOn)??0,r=c(n),a=r.getDay(),i=(a<t?-7:0)+6-(a-t);return r.setDate(r.getDate()+i),r.setHours(23,59,59,999),r}function ie(n){const s=c(n),e=s.getFullYear();return s.setFullYear(e+1,0,0),s.setHours(23,59,59,999),s}function it(n){return c(n).getDate()}function ge(n){const s=c(n),e=s.getFullYear(),t=s.getMonth(),r=D(n,0);return r.setFullYear(e,t+1,0),r.setHours(0,0,0,0),r.getDate()}function ct(n){return c(n).getHours()}function ut(n){return c(n).getMinutes()}function lt(n){return c(n).getMonth()}function dt(n){return c(n).getSeconds()}function ht(n){return c(n).getMilliseconds()}function ft(n){return c(n).getFullYear()}function B(n,s){const e=c(n),t=c(s);return e.getTime()>t.getTime()}function W(n,s){const e=c(n),t=c(s);return+e<+t}function yt(n,s){const e=c(n),t=c(s);return+e==+t}function wt(n,s){const e=R(n),t=R(s);return+e==+t}function mt(n,s){const e=c(n),t=c(s);return e.getFullYear()===t.getFullYear()}function pt(n,s){const e=c(n),t=c(s);return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()}function ce(n){const s=c(n);return s.setMinutes(0,0,0),s}function xt(n,s){const e=ce(n),t=ce(s);return+e==+t}function gt(){return Object.assign({},G())}function Tt(n,s){const e=s instanceof Date?D(s,0):new s(0);return e.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),e.setHours(n.getHours(),n.getMinutes(),n.getSeconds(),n.getMilliseconds()),e}const bt=10;class Te{constructor(){o(this,"subPriority",0)}validate(s,e){return!0}}class Dt extends Te{constructor(s,e,t,r,a){super(),this.value=s,this.validateValue=e,this.setValue=t,this.priority=r,a&&(this.subPriority=a)}validate(s,e){return this.validateValue(s,this.value,e)}set(s,e,t){return this.setValue(s,e,this.value,t)}}class Mt extends Te{constructor(){super(...arguments);o(this,"priority",bt);o(this,"subPriority",-1)}set(e,t){return t.timestampIsSet?e:D(e,Tt(e,Date))}}class h{run(s,e,t,r){const a=this.parse(s,e,t,r);return a?{setter:new Dt(a.value,this.validate,this.set,this.priority,this.subPriority),rest:a.rest}:null}validate(s,e,t){return!0}}class kt extends h{constructor(){super(...arguments);o(this,"priority",140);o(this,"incompatibleTokens",["R","u","t","T"])}parse(e,t,r){switch(t){case"G":case"GG":case"GGG":return r.era(e,{width:"abbreviated"})||r.era(e,{width:"narrow"});case"GGGGG":return r.era(e,{width:"narrow"});case"GGGG":default:return r.era(e,{width:"wide"})||r.era(e,{width:"abbreviated"})||r.era(e,{width:"narrow"})}}set(e,t,r){return t.era=r,e.setFullYear(r,0,1),e.setHours(0,0,0,0),e}}const x={month:/^(1[0-2]|0?\d)/,date:/^(3[0-1]|[0-2]?\d)/,dayOfYear:/^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,week:/^(5[0-3]|[0-4]?\d)/,hour23h:/^(2[0-3]|[0-1]?\d)/,hour24h:/^(2[0-4]|[0-1]?\d)/,hour11h:/^(1[0-1]|0?\d)/,hour12h:/^(1[0-2]|0?\d)/,minute:/^[0-5]?\d/,second:/^[0-5]?\d/,singleDigit:/^\d/,twoDigits:/^\d{1,2}/,threeDigits:/^\d{1,3}/,fourDigits:/^\d{1,4}/,anyDigitsSigned:/^-?\d+/,singleDigitSigned:/^-?\d/,twoDigitsSigned:/^-?\d{1,2}/,threeDigitsSigned:/^-?\d{1,3}/,fourDigitsSigned:/^-?\d{1,4}/},O={basicOptionalMinutes:/^([+-])(\d{2})(\d{2})?|Z/,basic:/^([+-])(\d{2})(\d{2})|Z/,basicOptionalSeconds:/^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,extended:/^([+-])(\d{2}):(\d{2})|Z/,extendedOptionalSeconds:/^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/};function g(n,s){return n&&{value:s(n.value),rest:n.rest}}function y(n,s){const e=s.match(n);return e?{value:parseInt(e[0],10),rest:s.slice(e[0].length)}:null}function Y(n,s){const e=s.match(n);if(!e)return null;if(e[0]==="Z")return{value:0,rest:s.slice(1)};const t=e[1]==="+"?1:-1,r=e[2]?parseInt(e[2],10):0,a=e[3]?parseInt(e[3],10):0,i=e[5]?parseInt(e[5],10):0;return{value:t*(r*fe+a*he+i*Ae),rest:s.slice(e[0].length)}}function be(n){return y(x.anyDigitsSigned,n)}function p(n,s){switch(n){case 1:return y(x.singleDigit,s);case 2:return y(x.twoDigits,s);case 3:return y(x.threeDigits,s);case 4:return y(x.fourDigits,s);default:return y(new RegExp("^\\d{1,"+n+"}"),s)}}function F(n,s){switch(n){case 1:return y(x.singleDigitSigned,s);case 2:return y(x.twoDigitsSigned,s);case 3:return y(x.threeDigitsSigned,s);case 4:return y(x.fourDigitsSigned,s);default:return y(new RegExp("^-?\\d{1,"+n+"}"),s)}}function X(n){switch(n){case"morning":return 4;case"evening":return 17;case"pm":case"noon":case"afternoon":return 12;case"am":case"midnight":case"night":default:return 0}}function De(n,s){const e=s>0,t=e?s:1-s;let r;if(t<=50)r=n||100;else{const a=t+50,i=Math.trunc(a/100)*100,l=n>=a%100;r=n+i-(l?100:0)}return e?r:1-r}function Me(n){return n%400===0||n%4===0&&n%100!==0}class _t extends h{constructor(){super(...arguments);o(this,"priority",130);o(this,"incompatibleTokens",["Y","R","u","w","I","i","e","c","t","T"])}parse(e,t,r){const a=i=>({year:i,isTwoDigitYear:t==="yy"});switch(t){case"y":return g(p(4,e),a);case"yo":return g(r.ordinalNumber(e,{unit:"year"}),a);default:return g(p(t.length,e),a)}}validate(e,t){return t.isTwoDigitYear||t.year>0}set(e,t,r){const a=e.getFullYear();if(r.isTwoDigitYear){const l=De(r.year,a);return e.setFullYear(l,0,1),e.setHours(0,0,0,0),e}const i=!("era"in t)||t.era===1?r.year:1-r.year;return e.setFullYear(i,0,1),e.setHours(0,0,0,0),e}}class Ot extends h{constructor(){super(...arguments);o(this,"priority",130);o(this,"incompatibleTokens",["y","R","u","Q","q","M","L","I","d","D","i","t","T"])}parse(e,t,r){const a=i=>({year:i,isTwoDigitYear:t==="YY"});switch(t){case"Y":return g(p(4,e),a);case"Yo":return g(r.ordinalNumber(e,{unit:"year"}),a);default:return g(p(t.length,e),a)}}validate(e,t){return t.isTwoDigitYear||t.year>0}set(e,t,r,a){const i=Qe(e,a);if(r.isTwoDigitYear){const u=De(r.year,i);return e.setFullYear(u,0,a.firstWeekContainsDate),e.setHours(0,0,0,0),N(e,a)}const l=!("era"in t)||t.era===1?r.year:1-r.year;return e.setFullYear(l,0,a.firstWeekContainsDate),e.setHours(0,0,0,0),N(e,a)}}class Yt extends h{constructor(){super(...arguments);o(this,"priority",130);o(this,"incompatibleTokens",["G","y","Y","u","Q","q","M","L","w","d","D","e","c","t","T"])}parse(e,t){return F(t==="R"?4:t.length,e)}set(e,t,r){const a=D(e,0);return a.setFullYear(r,0,4),a.setHours(0,0,0,0),we(a)}}class Et extends h{constructor(){super(...arguments);o(this,"priority",130);o(this,"incompatibleTokens",["G","y","Y","R","w","I","i","e","c","t","T"])}parse(e,t){return F(t==="u"?4:t.length,e)}set(e,t,r){return e.setFullYear(r,0,1),e.setHours(0,0,0,0),e}}class Pt extends h{constructor(){super(...arguments);o(this,"priority",120);o(this,"incompatibleTokens",["Y","R","q","M","L","w","I","d","D","i","e","c","t","T"])}parse(e,t,r){switch(t){case"Q":case"QQ":return p(t.length,e);case"Qo":return r.ordinalNumber(e,{unit:"quarter"});case"QQQ":return r.quarter(e,{width:"abbreviated",context:"formatting"})||r.quarter(e,{width:"narrow",context:"formatting"});case"QQQQQ":return r.quarter(e,{width:"narrow",context:"formatting"});case"QQQQ":default:return r.quarter(e,{width:"wide",context:"formatting"})||r.quarter(e,{width:"abbreviated",context:"formatting"})||r.quarter(e,{width:"narrow",context:"formatting"})}}validate(e,t){return t>=1&&t<=4}set(e,t,r){return e.setMonth((r-1)*3,1),e.setHours(0,0,0,0),e}}class Lt extends h{constructor(){super(...arguments);o(this,"priority",120);o(this,"incompatibleTokens",["Y","R","Q","M","L","w","I","d","D","i","e","c","t","T"])}parse(e,t,r){switch(t){case"q":case"qq":return p(t.length,e);case"qo":return r.ordinalNumber(e,{unit:"quarter"});case"qqq":return r.quarter(e,{width:"abbreviated",context:"standalone"})||r.quarter(e,{width:"narrow",context:"standalone"});case"qqqqq":return r.quarter(e,{width:"narrow",context:"standalone"});case"qqqq":default:return r.quarter(e,{width:"wide",context:"standalone"})||r.quarter(e,{width:"abbreviated",context:"standalone"})||r.quarter(e,{width:"narrow",context:"standalone"})}}validate(e,t){return t>=1&&t<=4}set(e,t,r){return e.setMonth((r-1)*3,1),e.setHours(0,0,0,0),e}}class Ht extends h{constructor(){super(...arguments);o(this,"incompatibleTokens",["Y","R","q","Q","L","w","I","D","i","e","c","t","T"]);o(this,"priority",110)}parse(e,t,r){const a=i=>i-1;switch(t){case"M":return g(y(x.month,e),a);case"MM":return g(p(2,e),a);case"Mo":return g(r.ordinalNumber(e,{unit:"month"}),a);case"MMM":return r.month(e,{width:"abbreviated",context:"formatting"})||r.month(e,{width:"narrow",context:"formatting"});case"MMMMM":return r.month(e,{width:"narrow",context:"formatting"});case"MMMM":default:return r.month(e,{width:"wide",context:"formatting"})||r.month(e,{width:"abbreviated",context:"formatting"})||r.month(e,{width:"narrow",context:"formatting"})}}validate(e,t){return t>=0&&t<=11}set(e,t,r){return e.setMonth(r,1),e.setHours(0,0,0,0),e}}class It extends h{constructor(){super(...arguments);o(this,"priority",110);o(this,"incompatibleTokens",["Y","R","q","Q","M","w","I","D","i","e","c","t","T"])}parse(e,t,r){const a=i=>i-1;switch(t){case"L":return g(y(x.month,e),a);case"LL":return g(p(2,e),a);case"Lo":return g(r.ordinalNumber(e,{unit:"month"}),a);case"LLL":return r.month(e,{width:"abbreviated",context:"standalone"})||r.month(e,{width:"narrow",context:"standalone"});case"LLLLL":return r.month(e,{width:"narrow",context:"standalone"});case"LLLL":default:return r.month(e,{width:"wide",context:"standalone"})||r.month(e,{width:"abbreviated",context:"standalone"})||r.month(e,{width:"narrow",context:"standalone"})}}validate(e,t){return t>=0&&t<=11}set(e,t,r){return e.setMonth(r,1),e.setHours(0,0,0,0),e}}function Ct(n,s,e){const t=c(n),r=me(t,e)-s;return t.setDate(t.getDate()-r*7),t}class Nt extends h{constructor(){super(...arguments);o(this,"priority",100);o(this,"incompatibleTokens",["y","R","u","q","Q","M","L","I","d","D","i","t","T"])}parse(e,t,r){switch(t){case"w":return y(x.week,e);case"wo":return r.ordinalNumber(e,{unit:"week"});default:return p(t.length,e)}}validate(e,t){return t>=1&&t<=53}set(e,t,r,a){return N(Ct(e,r,a),a)}}function Ft(n,s){const e=c(n),t=Ge(e)-s;return e.setDate(e.getDate()-t*7),e}class qt extends h{constructor(){super(...arguments);o(this,"priority",100);o(this,"incompatibleTokens",["y","Y","u","q","Q","M","L","w","d","D","e","c","t","T"])}parse(e,t,r){switch(t){case"I":return y(x.week,e);case"Io":return r.ordinalNumber(e,{unit:"week"});default:return p(t.length,e)}}validate(e,t){return t>=1&&t<=53}set(e,t,r){return we(Ft(e,r))}}const vt=[31,28,31,30,31,30,31,31,30,31,30,31],Bt=[31,29,31,30,31,30,31,31,30,31,30,31];class Wt extends h{constructor(){super(...arguments);o(this,"priority",90);o(this,"subPriority",1);o(this,"incompatibleTokens",["Y","R","q","Q","w","I","D","i","e","c","t","T"])}parse(e,t,r){switch(t){case"d":return y(x.date,e);case"do":return r.ordinalNumber(e,{unit:"date"});default:return p(t.length,e)}}validate(e,t){const r=e.getFullYear(),a=Me(r),i=e.getMonth();return a?t>=1&&t<=Bt[i]:t>=1&&t<=vt[i]}set(e,t,r){return e.setDate(r),e.setHours(0,0,0,0),e}}class Rt extends h{constructor(){super(...arguments);o(this,"priority",90);o(this,"subpriority",1);o(this,"incompatibleTokens",["Y","R","q","Q","M","L","w","I","d","E","i","e","c","t","T"])}parse(e,t,r){switch(t){case"D":case"DD":return y(x.dayOfYear,e);case"Do":return r.ordinalNumber(e,{unit:"date"});default:return p(t.length,e)}}validate(e,t){const r=e.getFullYear();return Me(r)?t>=1&&t<=366:t>=1&&t<=365}set(e,t,r){return e.setMonth(0,r),e.setHours(0,0,0,0),e}}function U(n,s,e){var k,E,T,b;const t=G(),r=(e==null?void 0:e.weekStartsOn)??((E=(k=e==null?void 0:e.locale)==null?void 0:k.options)==null?void 0:E.weekStartsOn)??t.weekStartsOn??((b=(T=t.locale)==null?void 0:T.options)==null?void 0:b.weekStartsOn)??0,a=c(n),i=a.getDay(),u=(s%7+7)%7,w=7-r,M=s<0||s>6?s-(i+w)%7:(u+w)%7-(i+w)%7;return q(a,M)}class jt extends h{constructor(){super(...arguments);o(this,"priority",90);o(this,"incompatibleTokens",["D","i","e","c","t","T"])}parse(e,t,r){switch(t){case"E":case"EE":case"EEE":return r.day(e,{width:"abbreviated",context:"formatting"})||r.day(e,{width:"short",context:"formatting"})||r.day(e,{width:"narrow",context:"formatting"});case"EEEEE":return r.day(e,{width:"narrow",context:"formatting"});case"EEEEEE":return r.day(e,{width:"short",context:"formatting"})||r.day(e,{width:"narrow",context:"formatting"});case"EEEE":default:return r.day(e,{width:"wide",context:"formatting"})||r.day(e,{width:"abbreviated",context:"formatting"})||r.day(e,{width:"short",context:"formatting"})||r.day(e,{width:"narrow",context:"formatting"})}}validate(e,t){return t>=0&&t<=6}set(e,t,r,a){return e=U(e,r,a),e.setHours(0,0,0,0),e}}class At extends h{constructor(){super(...arguments);o(this,"priority",90);o(this,"incompatibleTokens",["y","R","u","q","Q","M","L","I","d","D","E","i","c","t","T"])}parse(e,t,r,a){const i=l=>{const u=Math.floor((l-1)/7)*7;return(l+a.weekStartsOn+6)%7+u};switch(t){case"e":case"ee":return g(p(t.length,e),i);case"eo":return g(r.ordinalNumber(e,{unit:"day"}),i);case"eee":return r.day(e,{width:"abbreviated",context:"formatting"})||r.day(e,{width:"short",context:"formatting"})||r.day(e,{width:"narrow",context:"formatting"});case"eeeee":return r.day(e,{width:"narrow",context:"formatting"});case"eeeeee":return r.day(e,{width:"short",context:"formatting"})||r.day(e,{width:"narrow",context:"formatting"});case"eeee":default:return r.day(e,{width:"wide",context:"formatting"})||r.day(e,{width:"abbreviated",context:"formatting"})||r.day(e,{width:"short",context:"formatting"})||r.day(e,{width:"narrow",context:"formatting"})}}validate(e,t){return t>=0&&t<=6}set(e,t,r,a){return e=U(e,r,a),e.setHours(0,0,0,0),e}}class Qt extends h{constructor(){super(...arguments);o(this,"priority",90);o(this,"incompatibleTokens",["y","R","u","q","Q","M","L","I","d","D","E","i","e","t","T"])}parse(e,t,r,a){const i=l=>{const u=Math.floor((l-1)/7)*7;return(l+a.weekStartsOn+6)%7+u};switch(t){case"c":case"cc":return g(p(t.length,e),i);case"co":return g(r.ordinalNumber(e,{unit:"day"}),i);case"ccc":return r.day(e,{width:"abbreviated",context:"standalone"})||r.day(e,{width:"short",context:"standalone"})||r.day(e,{width:"narrow",context:"standalone"});case"ccccc":return r.day(e,{width:"narrow",context:"standalone"});case"cccccc":return r.day(e,{width:"short",context:"standalone"})||r.day(e,{width:"narrow",context:"standalone"});case"cccc":default:return r.day(e,{width:"wide",context:"standalone"})||r.day(e,{width:"abbreviated",context:"standalone"})||r.day(e,{width:"short",context:"standalone"})||r.day(e,{width:"narrow",context:"standalone"})}}validate(e,t){return t>=0&&t<=6}set(e,t,r,a){return e=U(e,r,a),e.setHours(0,0,0,0),e}}function Gt(n){let e=c(n).getDay();return e===0&&(e=7),e}function zt(n,s){const e=c(n),t=Gt(e),r=s-t;return q(e,r)}class Xt extends h{constructor(){super(...arguments);o(this,"priority",90);o(this,"incompatibleTokens",["y","Y","u","q","Q","M","L","w","d","D","E","e","c","t","T"])}parse(e,t,r){const a=i=>i===0?7:i;switch(t){case"i":case"ii":return p(t.length,e);case"io":return r.ordinalNumber(e,{unit:"day"});case"iii":return g(r.day(e,{width:"abbreviated",context:"formatting"})||r.day(e,{width:"short",context:"formatting"})||r.day(e,{width:"narrow",context:"formatting"}),a);case"iiiii":return g(r.day(e,{width:"narrow",context:"formatting"}),a);case"iiiiii":return g(r.day(e,{width:"short",context:"formatting"})||r.day(e,{width:"narrow",context:"formatting"}),a);case"iiii":default:return g(r.day(e,{width:"wide",context:"formatting"})||r.day(e,{width:"abbreviated",context:"formatting"})||r.day(e,{width:"short",context:"formatting"})||r.day(e,{width:"narrow",context:"formatting"}),a)}}validate(e,t){return t>=1&&t<=7}set(e,t,r){return e=zt(e,r),e.setHours(0,0,0,0),e}}class Ut extends h{constructor(){super(...arguments);o(this,"priority",80);o(this,"incompatibleTokens",["b","B","H","k","t","T"])}parse(e,t,r){switch(t){case"a":case"aa":case"aaa":return r.dayPeriod(e,{width:"abbreviated",context:"formatting"})||r.dayPeriod(e,{width:"narrow",context:"formatting"});case"aaaaa":return r.dayPeriod(e,{width:"narrow",context:"formatting"});case"aaaa":default:return r.dayPeriod(e,{width:"wide",context:"formatting"})||r.dayPeriod(e,{width:"abbreviated",context:"formatting"})||r.dayPeriod(e,{width:"narrow",context:"formatting"})}}set(e,t,r){return e.setHours(X(r),0,0,0),e}}class Vt extends h{constructor(){super(...arguments);o(this,"priority",80);o(this,"incompatibleTokens",["a","B","H","k","t","T"])}parse(e,t,r){switch(t){case"b":case"bb":case"bbb":return r.dayPeriod(e,{width:"abbreviated",context:"formatting"})||r.dayPeriod(e,{width:"narrow",context:"formatting"});case"bbbbb":return r.dayPeriod(e,{width:"narrow",context:"formatting"});case"bbbb":default:return r.dayPeriod(e,{width:"wide",context:"formatting"})||r.dayPeriod(e,{width:"abbreviated",context:"formatting"})||r.dayPeriod(e,{width:"narrow",context:"formatting"})}}set(e,t,r){return e.setHours(X(r),0,0,0),e}}class Zt extends h{constructor(){super(...arguments);o(this,"priority",80);o(this,"incompatibleTokens",["a","b","t","T"])}parse(e,t,r){switch(t){case"B":case"BB":case"BBB":return r.dayPeriod(e,{width:"abbreviated",context:"formatting"})||r.dayPeriod(e,{width:"narrow",context:"formatting"});case"BBBBB":return r.dayPeriod(e,{width:"narrow",context:"formatting"});case"BBBB":default:return r.dayPeriod(e,{width:"wide",context:"formatting"})||r.dayPeriod(e,{width:"abbreviated",context:"formatting"})||r.dayPeriod(e,{width:"narrow",context:"formatting"})}}set(e,t,r){return e.setHours(X(r),0,0,0),e}}class $t extends h{constructor(){super(...arguments);o(this,"priority",70);o(this,"incompatibleTokens",["H","K","k","t","T"])}parse(e,t,r){switch(t){case"h":return y(x.hour12h,e);case"ho":return r.ordinalNumber(e,{unit:"hour"});default:return p(t.length,e)}}validate(e,t){return t>=1&&t<=12}set(e,t,r){const a=e.getHours()>=12;return a&&r<12?e.setHours(r+12,0,0,0):!a&&r===12?e.setHours(0,0,0,0):e.setHours(r,0,0,0),e}}class Kt extends h{constructor(){super(...arguments);o(this,"priority",70);o(this,"incompatibleTokens",["a","b","h","K","k","t","T"])}parse(e,t,r){switch(t){case"H":return y(x.hour23h,e);case"Ho":return r.ordinalNumber(e,{unit:"hour"});default:return p(t.length,e)}}validate(e,t){return t>=0&&t<=23}set(e,t,r){return e.setHours(r,0,0,0),e}}class Jt extends h{constructor(){super(...arguments);o(this,"priority",70);o(this,"incompatibleTokens",["h","H","k","t","T"])}parse(e,t,r){switch(t){case"K":return y(x.hour11h,e);case"Ko":return r.ordinalNumber(e,{unit:"hour"});default:return p(t.length,e)}}validate(e,t){return t>=0&&t<=11}set(e,t,r){return e.getHours()>=12&&r<12?e.setHours(r+12,0,0,0):e.setHours(r,0,0,0),e}}class St extends h{constructor(){super(...arguments);o(this,"priority",70);o(this,"incompatibleTokens",["a","b","h","H","K","t","T"])}parse(e,t,r){switch(t){case"k":return y(x.hour24h,e);case"ko":return r.ordinalNumber(e,{unit:"hour"});default:return p(t.length,e)}}validate(e,t){return t>=1&&t<=24}set(e,t,r){const a=r<=24?r%24:r;return e.setHours(a,0,0,0),e}}class er extends h{constructor(){super(...arguments);o(this,"priority",60);o(this,"incompatibleTokens",["t","T"])}parse(e,t,r){switch(t){case"m":return y(x.minute,e);case"mo":return r.ordinalNumber(e,{unit:"minute"});default:return p(t.length,e)}}validate(e,t){return t>=0&&t<=59}set(e,t,r){return e.setMinutes(r,0,0),e}}class tr extends h{constructor(){super(...arguments);o(this,"priority",50);o(this,"incompatibleTokens",["t","T"])}parse(e,t,r){switch(t){case"s":return y(x.second,e);case"so":return r.ordinalNumber(e,{unit:"second"});default:return p(t.length,e)}}validate(e,t){return t>=0&&t<=59}set(e,t,r){return e.setSeconds(r,0),e}}class rr extends h{constructor(){super(...arguments);o(this,"priority",30);o(this,"incompatibleTokens",["t","T"])}parse(e,t){const r=a=>Math.trunc(a*Math.pow(10,-t.length+3));return g(p(t.length,e),r)}set(e,t,r){return e.setMilliseconds(r),e}}class nr extends h{constructor(){super(...arguments);o(this,"priority",10);o(this,"incompatibleTokens",["t","T","x"])}parse(e,t){switch(t){case"X":return Y(O.basicOptionalMinutes,e);case"XX":return Y(O.basic,e);case"XXXX":return Y(O.basicOptionalSeconds,e);case"XXXXX":return Y(O.extendedOptionalSeconds,e);case"XXX":default:return Y(O.extended,e)}}set(e,t,r){return t.timestampIsSet?e:D(e,e.getTime()-pe(e)-r)}}class sr extends h{constructor(){super(...arguments);o(this,"priority",10);o(this,"incompatibleTokens",["t","T","X"])}parse(e,t){switch(t){case"x":return Y(O.basicOptionalMinutes,e);case"xx":return Y(O.basic,e);case"xxxx":return Y(O.basicOptionalSeconds,e);case"xxxxx":return Y(O.extendedOptionalSeconds,e);case"xxx":default:return Y(O.extended,e)}}set(e,t,r){return t.timestampIsSet?e:D(e,e.getTime()-pe(e)-r)}}class ar extends h{constructor(){super(...arguments);o(this,"priority",40);o(this,"incompatibleTokens","*")}parse(e){return be(e)}set(e,t,r){return[D(e,r*1e3),{timestampIsSet:!0}]}}class or extends h{constructor(){super(...arguments);o(this,"priority",20);o(this,"incompatibleTokens","*")}parse(e){return be(e)}set(e,t,r){return[D(e,r),{timestampIsSet:!0}]}}const ir={G:new kt,y:new _t,Y:new Ot,R:new Yt,u:new Et,Q:new Pt,q:new Lt,M:new Ht,L:new It,w:new Nt,I:new qt,d:new Wt,D:new Rt,E:new jt,e:new At,c:new Qt,i:new Xt,a:new Ut,b:new Vt,B:new Zt,h:new $t,H:new Kt,K:new Jt,k:new St,m:new er,s:new tr,S:new rr,X:new nr,x:new sr,t:new ar,T:new or},cr=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,ur=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,lr=/^'([^]*?)'?$/,dr=/''/g,hr=/\S/,fr=/[a-zA-Z]/;function yr(n,s,e,t){var L,V,Z,$,K,J,S,ee;const r=gt(),a=(t==null?void 0:t.locale)??r.locale??xe,i=(t==null?void 0:t.firstWeekContainsDate)??((V=(L=t==null?void 0:t.locale)==null?void 0:L.options)==null?void 0:V.firstWeekContainsDate)??r.firstWeekContainsDate??(($=(Z=r.locale)==null?void 0:Z.options)==null?void 0:$.firstWeekContainsDate)??1,l=(t==null?void 0:t.weekStartsOn)??((J=(K=t==null?void 0:t.locale)==null?void 0:K.options)==null?void 0:J.weekStartsOn)??r.weekStartsOn??((ee=(S=r.locale)==null?void 0:S.options)==null?void 0:ee.weekStartsOn)??0;if(s==="")return n===""?c(e):D(e,NaN);const u={firstWeekContainsDate:i,weekStartsOn:l,locale:a},w=[new Mt],M=s.match(ur).map(d=>{const m=d[0];if(m in j){const _=j[m];return _(d,a.formatLong)}return d}).join("").match(cr),k=[];for(let d of M){!(t!=null&&t.useAdditionalWeekYearTokens)&&ze(d)&&ae(d,s,n),!(t!=null&&t.useAdditionalDayOfYearTokens)&&Xe(d)&&ae(d,s,n);const m=d[0],_=ir[m];if(_){const{incompatibleTokens:te}=_;if(Array.isArray(te)){const re=k.find(ne=>te.includes(ne.token)||ne.token===m);if(re)throw new RangeError(`The format string mustn't contain \`${re.fullToken}\` and \`${d}\` at the same time`)}else if(_.incompatibleTokens==="*"&&k.length>0)throw new RangeError(`The format string mustn't contain \`${d}\` and any other token at the same time`);k.push({token:m,fullToken:d});const v=_.run(n,d,a.match,u);if(!v)return D(e,NaN);w.push(v.setter),n=v.rest}else{if(m.match(fr))throw new RangeError("Format string contains an unescaped latin alphabet character `"+m+"`");if(d==="''"?d="'":m==="'"&&(d=wr(d)),n.indexOf(d)===0)n=n.slice(d.length);else return D(e,NaN)}}if(n.length>0&&hr.test(n))return D(e,NaN);const E=w.map(d=>d.priority).sort((d,m)=>m-d).filter((d,m,_)=>_.indexOf(d)===m).map(d=>w.filter(m=>m.priority===d).sort((m,_)=>_.subPriority-m.subPriority)).map(d=>d[0]);let T=c(e);if(isNaN(T.getTime()))return D(e,NaN);const b={};for(const d of E){if(!d.validate(T,u))return D(e,NaN);const m=d.set(T,b,u);Array.isArray(m)?(T=m[0],Object.assign(b,m[1])):T=m}return D(e,T)}function wr(n){return n.match(lr)[1].replace(dr,"'")}function mr(n,s){const e=c(n);return e.setDate(s),e}function pr(n,s){const e=c(n);return e.setHours(s),e}function xr(n,s){const e=c(n);return e.setMinutes(s),e}function gr(n,s){const e=c(n),t=e.getFullYear(),r=e.getDate(),a=D(n,0);a.setFullYear(t,s,15),a.setHours(0,0,0,0);const i=ge(a);return e.setMonth(s,Math.min(r,i)),e}function Tr(n,s){const e=c(n);return e.setSeconds(s),e}function br(n,s){const e=c(n);return e.setMilliseconds(s),e}function Dr(n,s){const e=c(n);return isNaN(+e)?D(n,NaN):(e.setFullYear(s),e)}function Mr(n){const s=c(n);return s.setDate(1),s.setHours(0,0,0,0),s}function kr(n){const s=c(n),e=s.getMonth();return s.setFullYear(s.getFullYear(),e+1,0),s.setHours(23,59,59,999),s}function _r(n,s){const e=+c(n),[t,r]=[+c(s.start),+c(s.end)].sort((a,i)=>a-i);return e>=t&&e<=r}const Or={y:{sectionType:"year",contentType:"digit",maxLength:4},yy:"year",yyy:{sectionType:"year",contentType:"digit",maxLength:4},yyyy:"year",M:{sectionType:"month",contentType:"digit",maxLength:2},MM:"month",MMMM:{sectionType:"month",contentType:"letter"},MMM:{sectionType:"month",contentType:"letter"},L:{sectionType:"month",contentType:"digit",maxLength:2},LL:"month",LLL:{sectionType:"month",contentType:"letter"},LLLL:{sectionType:"month",contentType:"letter"},d:{sectionType:"day",contentType:"digit",maxLength:2},dd:"day",do:{sectionType:"day",contentType:"digit-with-letter"},E:{sectionType:"weekDay",contentType:"letter"},EE:{sectionType:"weekDay",contentType:"letter"},EEE:{sectionType:"weekDay",contentType:"letter"},EEEE:{sectionType:"weekDay",contentType:"letter"},EEEEE:{sectionType:"weekDay",contentType:"letter"},i:{sectionType:"weekDay",contentType:"digit",maxLength:1},ii:"weekDay",iii:{sectionType:"weekDay",contentType:"letter"},iiii:{sectionType:"weekDay",contentType:"letter"},e:{sectionType:"weekDay",contentType:"digit",maxLength:1},ee:"weekDay",eee:{sectionType:"weekDay",contentType:"letter"},eeee:{sectionType:"weekDay",contentType:"letter"},eeeee:{sectionType:"weekDay",contentType:"letter"},eeeeee:{sectionType:"weekDay",contentType:"letter"},c:{sectionType:"weekDay",contentType:"digit",maxLength:1},cc:"weekDay",ccc:{sectionType:"weekDay",contentType:"letter"},cccc:{sectionType:"weekDay",contentType:"letter"},ccccc:{sectionType:"weekDay",contentType:"letter"},cccccc:{sectionType:"weekDay",contentType:"letter"},a:"meridiem",aa:"meridiem",aaa:"meridiem",H:{sectionType:"hours",contentType:"digit",maxLength:2},HH:"hours",h:{sectionType:"hours",contentType:"digit",maxLength:2},hh:"hours",m:{sectionType:"minutes",contentType:"digit",maxLength:2},mm:"minutes",s:{sectionType:"seconds",contentType:"digit",maxLength:2},ss:"seconds"},Yr={year:"yyyy",month:"LLLL",monthShort:"MMM",dayOfMonth:"d",dayOfMonthFull:"do",weekday:"EEEE",weekdayShort:"EEEEEE",hours24h:"HH",hours12h:"hh",meridiem:"aa",minutes:"mm",seconds:"ss",fullDate:"PP",keyboardDate:"P",shortDate:"MMM d",normalDate:"d MMMM",normalDateWithWeekday:"EEE, MMM d",fullTime:"p",fullTime12h:"hh:mm aa",fullTime24h:"HH:mm",keyboardDateTime:"P p",keyboardDateTime12h:"P hh:mm aa",keyboardDateTime24h:"P HH:mm"};class Er{constructor(s){this.isMUIAdapter=!0,this.isTimezoneCompatible=!1,this.lib=void 0,this.locale=void 0,this.formats=void 0,this.formatTokenMap=Or,this.escapedCharacters={start:"'",end:"'"},this.longFormatters=void 0,this.date=i=>typeof i>"u"?new Date:i===null?null:new Date(i),this.getInvalidDate=()=>new Date("Invalid Date"),this.getTimezone=()=>"default",this.setTimezone=i=>i,this.toJsDate=i=>i,this.getCurrentLocaleCode=()=>this.locale.code,this.is12HourCycleInCurrentLocale=()=>/a/.test(this.locale.formatLong.time({width:"short"})),this.expandFormat=i=>{const l=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;return i.match(l).map(u=>{const w=u[0];if(w==="p"||w==="P"){const M=this.longFormatters[w];return M(u,this.locale.formatLong)}return u}).join("")},this.formatNumber=i=>i,this.getDayOfWeek=i=>i.getDay()+1;const{locale:e,formats:t,longFormatters:r,lib:a}=s;this.locale=e,this.formats=Oe({},Yr,t),this.longFormatters=r,this.lib=a||"date-fns"}}class Pr extends Er{constructor({locale:s,formats:e}={}){super({locale:s??xe,formats:e,longFormatters:j}),this.parse=(t,r)=>t===""?null:yr(t,r,new Date,{locale:this.locale}),this.isValid=t=>t==null?!1:Ue(t),this.format=(t,r)=>this.formatByString(t,this.formats[r]),this.formatByString=(t,r)=>Ve(t,r,{locale:this.locale}),this.isEqual=(t,r)=>t===null&&r===null?!0:t===null||r===null?!1:yt(t,r),this.isSameYear=(t,r)=>mt(t,r),this.isSameMonth=(t,r)=>pt(t,r),this.isSameDay=(t,r)=>wt(t,r),this.isSameHour=(t,r)=>xt(t,r),this.isAfter=(t,r)=>B(t,r),this.isAfterYear=(t,r)=>B(t,ie(r)),this.isAfterDay=(t,r)=>B(t,oe(r)),this.isBefore=(t,r)=>W(t,r),this.isBeforeYear=(t,r)=>W(t,this.startOfYear(r)),this.isBeforeDay=(t,r)=>W(t,this.startOfDay(r)),this.isWithinRange=(t,[r,a])=>_r(t,{start:r,end:a}),this.startOfYear=t=>Ze(t),this.startOfMonth=t=>Mr(t),this.startOfWeek=t=>N(t,{locale:this.locale}),this.startOfDay=t=>R(t),this.endOfYear=t=>ie(t),this.endOfMonth=t=>kr(t),this.endOfWeek=t=>ot(t,{locale:this.locale}),this.endOfDay=t=>oe(t),this.addYears=(t,r)=>at(t,r),this.addMonths=(t,r)=>ye(t,r),this.addWeeks=(t,r)=>st(t,r),this.addDays=(t,r)=>q(t,r),this.addHours=(t,r)=>nt(t,r),this.addMinutes=(t,r)=>rt(t,r),this.addSeconds=(t,r)=>tt(t,r),this.getYear=t=>ft(t),this.getMonth=t=>lt(t),this.getDate=t=>it(t),this.getHours=t=>ct(t),this.getMinutes=t=>ut(t),this.getSeconds=t=>dt(t),this.getMilliseconds=t=>ht(t),this.setYear=(t,r)=>Dr(t,r),this.setMonth=(t,r)=>gr(t,r),this.setDate=(t,r)=>mr(t,r),this.setHours=(t,r)=>pr(t,r),this.setMinutes=(t,r)=>xr(t,r),this.setSeconds=(t,r)=>Tr(t,r),this.setMilliseconds=(t,r)=>br(t,r),this.getDaysInMonth=t=>ge(t),this.getWeekArray=t=>{const r=this.startOfWeek(this.startOfMonth(t)),a=this.endOfWeek(this.endOfMonth(t));let i=0,l=r;const u=[];for(;this.isBefore(l,a);){const w=Math.floor(i/7);u[w]=u[w]||[],u[w].push(l),l=this.addDays(l,1),i+=1}return u},this.getWeekNumber=t=>me(t,{locale:this.locale}),this.getYearRange=([t,r])=>{const a=this.startOfYear(t),i=this.endOfYear(r),l=[];let u=a;for(;this.isBefore(u,i);)l.push(u),u=this.addYears(u,1);return l}}}const ue="/assets/logo-no-background-C_IDOYQs.png";function Lr({userName:n}){const s=Q(),{data:e}=Ye(),[t,r]=P.useState(null),[a,i]=P.useState({});P.useEffect(()=>{if(!e)return;const T=e.find(b=>b.username===n);i(T)},[n,e]);const{username:l,photo:u}=a,w=T=>{r(T.currentTarget)},M=()=>{r(null)},k=()=>{r(null),s(Pe()),s(Le())},E=n.substring(0,1).toUpperCase();return f.jsx(f.Fragment,{children:f.jsxs(I,{sx:{flexGrow:0},children:[f.jsx($e,{title:l,children:f.jsx(Ee,{onClick:w,sx:{p:0},children:f.jsx(Ke,{src:u,children:E})})}),f.jsxs(Je,{sx:{mt:"45px"},id:"menu-appbar",anchorEl:t,anchorOrigin:{vertical:"top",horizontal:"right"},keepMounted:!0,transformOrigin:{vertical:"top",horizontal:"right"},open:!!t,onClose:M,children:[f.jsx(A,{onClick:M,children:f.jsx(se,{textAlign:"center",children:"Настройки профиля"})},1),f.jsx(A,{onClick:k,children:f.jsx(se,{textAlign:"center",children:"Выйти"})},2)]})]})})}const Hr=le(He)(({theme:n})=>({color:n.palette.getContrastText(H[500]),backgroundColor:H[500],borderColor:"#fff",border:"1px","&:hover":{borderColor:"#fff",border:"1px",color:n.palette.getContrastText(H[700]),backgroundColor:H[700]}})),Ir=le(Se)(()=>({fieldset:{borderColor:"#fff"},svg:{color:"#fff"}}));function Cr({isLoggedIn:n}){const e=C(Ie).id,t=C(Ce),[r,a]=P.useState(e),[i]=Ne(),{data:l,refetch:u}=Fe(),[w]=qe(),M=Q();P.useEffect(()=>{n&&u()},[n,u]);const k=async T=>{try{const b=T.target.value;M(We(b)),a(b),await i(b)}catch(b){console.log(b)}},E=async()=>{const T={board:e,name:"",position_on_board:t.columnsLength};try{await w(T)}catch(b){console.log(b)}};return f.jsxs(I,{sx:{display:"flex",justifyContent:"flex-start",alignItems:"center",marginLeft:"20px",width:"inherit"},children:[f.jsxs(ve,{sx:{color:"#fff",m:1,width:200},size:"small",children:[f.jsx(Be,{sx:{color:"#fff"},id:"demo-simple-select-helper-label",children:"Рабочая доска"}),f.jsx(Ir,{defaultValue:"",sx:{color:"#fff"},labelId:"board-simple-select-helper-label",id:"board-simple-select-helper",value:r||"Доска не выбрана",label:"Рабочая доска",onChange:k,children:!!l&&l.map(T=>{const{id:b,name:L}=T;return f.jsx(A,{value:b,children:L},b)})})]}),f.jsx(Hr,{variant:"outlined",onClick:E,children:"Новая колонка"})]})}function Nr(){const n=C(de),s=n.isLoggedIn,e=n.user.name;return f.jsxs(I,{sx:{position:"fixed",zIndex:"999",display:"flex",flexDirection:"row",flexWrap:"nowrap",justifyContent:"space-between",alignItems:"center",paddingRight:"10px",width:"100%",height:"64px",backgroundColor:"#2f2f2f"},children:[f.jsx(I,{sx:{display:"flex",justifyContent:"center",alignItems:"center",width:"164px",height:"64px"},children:f.jsx("img",{height:"50px",srcSet:ue,src:ue,alt:"logo",loading:"lazy"})}),s&&f.jsxs(f.Fragment,{children:[f.jsx(Cr,{isLoggedIn:s}),f.jsx(Lr,{userName:e})]})]})}function Br(){const n=Q(),e=C(de).accessToken;return P.useEffect(()=>{e!==null&&n(Re())},[n]),f.jsx(et,{dateAdapter:Pr,children:f.jsxs("div",{className:"App",children:[f.jsx(Nr,{}),f.jsx(je,{})]})})}export{Br as default};
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function r(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=r(s);fetch(s.href,a)}})();function If(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Gd={exports:{}},fi={},Jd={exports:{}},Z={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ws=Symbol.for("react.element"),Uf=Symbol.for("react.portal"),zf=Symbol.for("react.fragment"),Df=Symbol.for("react.strict_mode"),Ff=Symbol.for("react.profiler"),Mf=Symbol.for("react.provider"),Bf=Symbol.for("react.context"),Wf=Symbol.for("react.forward_ref"),Hf=Symbol.for("react.suspense"),Vf=Symbol.for("react.memo"),qf=Symbol.for("react.lazy"),Qc=Symbol.iterator;function Kf(e){return e===null||typeof e!="object"?null:(e=Qc&&e[Qc]||e["@@iterator"],typeof e=="function"?e:null)}var Yd={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Qd=Object.assign,Xd={};function Dn(e,t,r){this.props=e,this.context=t,this.refs=Xd,this.updater=r||Yd}Dn.prototype.isReactComponent={};Dn.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};Dn.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function Zd(){}Zd.prototype=Dn.prototype;function El(e,t,r){this.props=e,this.context=t,this.refs=Xd,this.updater=r||Yd}var Tl=El.prototype=new Zd;Tl.constructor=El;Qd(Tl,Dn.prototype);Tl.isPureReactComponent=!0;var Xc=Array.isArray,eh=Object.prototype.hasOwnProperty,Cl={current:null},th={key:!0,ref:!0,__self:!0,__source:!0};function rh(e,t,r){var n,s={},a=null,o=null;if(t!=null)for(n in t.ref!==void 0&&(o=t.ref),t.key!==void 0&&(a=""+t.key),t)eh.call(t,n)&&!th.hasOwnProperty(n)&&(s[n]=t[n]);var l=arguments.length-2;if(l===1)s.children=r;else if(1<l){for(var c=Array(l),u=0;u<l;u++)c[u]=arguments[u+2];s.children=c}if(e&&e.defaultProps)for(n in l=e.defaultProps,l)s[n]===void 0&&(s[n]=l[n]);return{$$typeof:Ws,type:e,key:a,ref:o,props:s,_owner:Cl.current}}function Gf(e,t){return{$$typeof:Ws,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function Al(e){return typeof e=="object"&&e!==null&&e.$$typeof===Ws}function Jf(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(r){return t[r]})}var Zc=/\/+/g;function $i(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Jf(""+e.key):t.toString(36)}function Sa(e,t,r,n,s){var a=typeof e;(a==="undefined"||a==="boolean")&&(e=null);var o=!1;if(e===null)o=!0;else switch(a){case"string":case"number":o=!0;break;case"object":switch(e.$$typeof){case Ws:case Uf:o=!0}}if(o)return o=e,s=s(o),e=n===""?"."+$i(o,0):n,Xc(s)?(r="",e!=null&&(r=e.replace(Zc,"$&/")+"/"),Sa(s,t,r,"",function(u){return u})):s!=null&&(Al(s)&&(s=Gf(s,r+(!s.key||o&&o.key===s.key?"":(""+s.key).replace(Zc,"$&/")+"/")+e)),t.push(s)),1;if(o=0,n=n===""?".":n+":",Xc(e))for(var l=0;l<e.length;l++){a=e[l];var c=n+$i(a,l);o+=Sa(a,t,r,c,s)}else if(c=Kf(e),typeof c=="function")for(e=c.call(e),l=0;!(a=e.next()).done;)a=a.value,c=n+$i(a,l++),o+=Sa(a,t,r,c,s);else if(a==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return o}function Ys(e,t,r){if(e==null)return e;var n=[],s=0;return Sa(e,n,"","",function(a){return t.call(r,a,s++)}),n}function Yf(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(r){(e._status===0||e._status===-1)&&(e._status=1,e._result=r)},function(r){(e._status===0||e._status===-1)&&(e._status=2,e._result=r)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var Ge={current:null},Na={transition:null},Qf={ReactCurrentDispatcher:Ge,ReactCurrentBatchConfig:Na,ReactCurrentOwner:Cl};function nh(){throw Error("act(...) is not supported in production builds of React.")}Z.Children={map:Ys,forEach:function(e,t,r){Ys(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return Ys(e,function(){t++}),t},toArray:function(e){return Ys(e,function(t){return t})||[]},only:function(e){if(!Al(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};Z.Component=Dn;Z.Fragment=zf;Z.Profiler=Ff;Z.PureComponent=El;Z.StrictMode=Df;Z.Suspense=Hf;Z.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Qf;Z.act=nh;Z.cloneElement=function(e,t,r){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var n=Qd({},e.props),s=e.key,a=e.ref,o=e._owner;if(t!=null){if(t.ref!==void 0&&(a=t.ref,o=Cl.current),t.key!==void 0&&(s=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(c in t)eh.call(t,c)&&!th.hasOwnProperty(c)&&(n[c]=t[c]===void 0&&l!==void 0?l[c]:t[c])}var c=arguments.length-2;if(c===1)n.children=r;else if(1<c){l=Array(c);for(var u=0;u<c;u++)l[u]=arguments[u+2];n.children=l}return{$$typeof:Ws,type:e.type,key:s,ref:a,props:n,_owner:o}};Z.createContext=function(e){return e={$$typeof:Bf,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:Mf,_context:e},e.Consumer=e};Z.createElement=rh;Z.createFactory=function(e){var t=rh.bind(null,e);return t.type=e,t};Z.createRef=function(){return{current:null}};Z.forwardRef=function(e){return{$$typeof:Wf,render:e}};Z.isValidElement=Al;Z.lazy=function(e){return{$$typeof:qf,_payload:{_status:-1,_result:e},_init:Yf}};Z.memo=function(e,t){return{$$typeof:Vf,type:e,compare:t===void 0?null:t}};Z.startTransition=function(e){var t=Na.transition;Na.transition={};try{e()}finally{Na.transition=t}};Z.unstable_act=nh;Z.useCallback=function(e,t){return Ge.current.useCallback(e,t)};Z.useContext=function(e){return Ge.current.useContext(e)};Z.useDebugValue=function(){};Z.useDeferredValue=function(e){return Ge.current.useDeferredValue(e)};Z.useEffect=function(e,t){return Ge.current.useEffect(e,t)};Z.useId=function(){return Ge.current.useId()};Z.useImperativeHandle=function(e,t,r){return Ge.current.useImperativeHandle(e,t,r)};Z.useInsertionEffect=function(e,t){return Ge.current.useInsertionEffect(e,t)};Z.useLayoutEffect=function(e,t){return Ge.current.useLayoutEffect(e,t)};Z.useMemo=function(e,t){return Ge.current.useMemo(e,t)};Z.useReducer=function(e,t,r){return Ge.current.useReducer(e,t,r)};Z.useRef=function(e){return Ge.current.useRef(e)};Z.useState=function(e){return Ge.current.useState(e)};Z.useSyncExternalStore=function(e,t,r){return Ge.current.useSyncExternalStore(e,t,r)};Z.useTransition=function(){return Ge.current.useTransition()};Z.version="18.3.1";Jd.exports=Z;var I=Jd.exports;const Xf=If(I);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Zf=I,eg=Symbol.for("react.element"),tg=Symbol.for("react.fragment"),rg=Object.prototype.hasOwnProperty,ng=Zf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,sg={key:!0,ref:!0,__self:!0,__source:!0};function sh(e,t,r){var n,s={},a=null,o=null;r!==void 0&&(a=""+r),t.key!==void 0&&(a=""+t.key),t.ref!==void 0&&(o=t.ref);for(n in t)rg.call(t,n)&&!sg.hasOwnProperty(n)&&(s[n]=t[n]);if(e&&e.defaultProps)for(n in t=e.defaultProps,t)s[n]===void 0&&(s[n]=t[n]);return{$$typeof:eg,type:e,key:a,ref:o,props:s,_owner:ng.current}}fi.Fragment=tg;fi.jsx=sh;fi.jsxs=sh;Gd.exports=fi;var i=Gd.exports,xo={},ah={exports:{}},lt={},ih={exports:{}},oh={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(e){function t(O,U){var w=O.length;O.push(U);e:for(;0<w;){var X=w-1>>>1,M=O[X];if(0<s(M,U))O[X]=U,O[w]=M,w=X;else break e}}function r(O){return O.length===0?null:O[0]}function n(O){if(O.length===0)return null;var U=O[0],w=O.pop();if(w!==U){O[0]=w;e:for(var X=0,M=O.length,he=M>>>1;X<he;){var pe=2*(X+1)-1,E=O[pe],L=pe+1,H=O[L];if(0>s(E,w))L<M&&0>s(H,E)?(O[X]=H,O[L]=w,X=L):(O[X]=E,O[pe]=w,X=pe);else if(L<M&&0>s(H,w))O[X]=H,O[L]=w,X=L;else break e}}return U}function s(O,U){var w=O.sortIndex-U.sortIndex;return w!==0?w:O.id-U.id}if(typeof performance=="object"&&typeof performance.now=="function"){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,l=o.now();e.unstable_now=function(){return o.now()-l}}var c=[],u=[],d=1,h=null,p=3,v=!1,y=!1,x=!1,N=typeof setTimeout=="function"?setTimeout:null,f=typeof clearTimeout=="function"?clearTimeout:null,g=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function m(O){for(var U=r(u);U!==null;){if(U.callback===null)n(u);else if(U.startTime<=O)n(u),U.sortIndex=U.expirationTime,t(c,U);else break;U=r(u)}}function k(O){if(x=!1,m(O),!y)if(r(c)!==null)y=!0,Q(j);else{var U=r(u);U!==null&&B(k,U.startTime-O)}}function j(O,U){y=!1,x&&(x=!1,f($),$=-1),v=!0;var w=p;try{for(m(U),h=r(c);h!==null&&(!(h.expirationTime>U)||O&&!we());){var X=h.callback;if(typeof X=="function"){h.callback=null,p=h.priorityLevel;var M=X(h.expirationTime<=U);U=e.unstable_now(),typeof M=="function"?h.callback=M:h===r(c)&&n(c),m(U)}else n(c);h=r(c)}if(h!==null)var he=!0;else{var pe=r(u);pe!==null&&B(k,pe.startTime-U),he=!1}return he}finally{h=null,p=w,v=!1}}var C=!1,S=null,$=-1,q=5,J=-1;function we(){return!(e.unstable_now()-J<q)}function z(){if(S!==null){var O=e.unstable_now();J=O;var U=!0;try{U=S(!0,O)}finally{U?K():(C=!1,S=null)}}else C=!1}var K;if(typeof g=="function")K=function(){g(z)};else if(typeof MessageChannel<"u"){var b=new MessageChannel,T=b.port2;b.port1.onmessage=z,K=function(){T.postMessage(null)}}else K=function(){N(z,0)};function Q(O){S=O,C||(C=!0,K())}function B(O,U){$=N(function(){O(e.unstable_now())},U)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(O){O.callback=null},e.unstable_continueExecution=function(){y||v||(y=!0,Q(j))},e.unstable_forceFrameRate=function(O){0>O||125<O?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):q=0<O?Math.floor(1e3/O):5},e.unstable_getCurrentPriorityLevel=function(){return p},e.unstable_getFirstCallbackNode=function(){return r(c)},e.unstable_next=function(O){switch(p){case 1:case 2:case 3:var U=3;break;default:U=p}var w=p;p=U;try{return O()}finally{p=w}},e.unstable_pauseExecution=function(){},e.unstable_requestPaint=function(){},e.unstable_runWithPriority=function(O,U){switch(O){case 1:case 2:case 3:case 4:case 5:break;default:O=3}var w=p;p=O;try{return U()}finally{p=w}},e.unstable_scheduleCallback=function(O,U,w){var X=e.unstable_now();switch(typeof w=="object"&&w!==null?(w=w.delay,w=typeof w=="number"&&0<w?X+w:X):w=X,O){case 1:var M=-1;break;case 2:M=250;break;case 5:M=1073741823;break;case 4:M=1e4;break;default:M=5e3}return M=w+M,O={id:d++,callback:U,priorityLevel:O,startTime:w,expirationTime:M,sortIndex:-1},w>X?(O.sortIndex=w,t(u,O),r(c)===null&&O===r(u)&&(x?(f($),$=-1):x=!0,B(k,w-X))):(O.sortIndex=M,t(c,O),y||v||(y=!0,Q(j))),O},e.unstable_shouldYield=we,e.unstable_wrapCallback=function(O){var U=p;return function(){var w=p;p=U;try{return O.apply(this,arguments)}finally{p=w}}}})(oh);ih.exports=oh;var ag=ih.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var ig=I,ot=ag;function A(e){for(var t="https://reactjs.org/docs/error-decoder.html?invariant="+e,r=1;r<arguments.length;r++)t+="&args[]="+encodeURIComponent(arguments[r]);return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var lh=new Set,xs={};function Yr(e,t){Pn(e,t),Pn(e+"Capture",t)}function Pn(e,t){for(xs[e]=t,e=0;e<t.length;e++)lh.add(t[e])}var Qt=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),ko=Object.prototype.hasOwnProperty,og=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,eu={},tu={};function lg(e){return ko.call(tu,e)?!0:ko.call(eu,e)?!1:og.test(e)?tu[e]=!0:(eu[e]=!0,!1)}function cg(e,t,r,n){if(r!==null&&r.type===0)return!1;switch(typeof t){case"function":case"symbol":return!0;case"boolean":return n?!1:r!==null?!r.acceptsBooleans:(e=e.toLowerCase().slice(0,5),e!=="data-"&&e!=="aria-");default:return!1}}function ug(e,t,r,n){if(t===null||typeof t>"u"||cg(e,t,r,n))return!0;if(n)return!1;if(r!==null)switch(r.type){case 3:return!t;case 4:return t===!1;case 5:return isNaN(t);case 6:return isNaN(t)||1>t}return!1}function Je(e,t,r,n,s,a,o){this.acceptsBooleans=t===2||t===3||t===4,this.attributeName=n,this.attributeNamespace=s,this.mustUseProperty=r,this.propertyName=e,this.type=t,this.sanitizeURL=a,this.removeEmptyString=o}var $e={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(e){$e[e]=new Je(e,0,!1,e,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(e){var t=e[0];$e[t]=new Je(t,1,!1,e[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(e){$e[e]=new Je(e,2,!1,e.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(e){$e[e]=new Je(e,2,!1,e,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(e){$e[e]=new Je(e,3,!1,e.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(e){$e[e]=new Je(e,3,!0,e,null,!1,!1)});["capture","download"].forEach(function(e){$e[e]=new Je(e,4,!1,e,null,!1,!1)});["cols","rows","size","span"].forEach(function(e){$e[e]=new Je(e,6,!1,e,null,!1,!1)});["rowSpan","start"].forEach(function(e){$e[e]=new Je(e,5,!1,e.toLowerCase(),null,!1,!1)});var Rl=/[\-:]([a-z])/g;function Pl(e){return e[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(e){var t=e.replace(Rl,Pl);$e[t]=new Je(t,1,!1,e,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(e){var t=e.replace(Rl,Pl);$e[t]=new Je(t,1,!1,e,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(e){var t=e.replace(Rl,Pl);$e[t]=new Je(t,1,!1,e,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(e){$e[e]=new Je(e,1,!1,e.toLowerCase(),null,!1,!1)});$e.xlinkHref=new Je("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(e){$e[e]=new Je(e,1,!1,e.toLowerCase(),null,!0,!0)});function Ol(e,t,r,n){var s=$e.hasOwnProperty(t)?$e[t]:null;(s!==null?s.type!==0:n||!(2<t.length)||t[0]!=="o"&&t[0]!=="O"||t[1]!=="n"&&t[1]!=="N")&&(ug(t,r,s,n)&&(r=null),n||s===null?lg(t)&&(r===null?e.removeAttribute(t):e.setAttribute(t,""+r)):s.mustUseProperty?e[s.propertyName]=r===null?s.type===3?!1:"":r:(t=s.attributeName,n=s.attributeNamespace,r===null?e.removeAttribute(t):(s=s.type,r=s===3||s===4&&r===!0?"":""+r,n?e.setAttributeNS(n,t,r):e.setAttribute(t,r))))}var tr=ig.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Qs=Symbol.for("react.element"),dn=Symbol.for("react.portal"),hn=Symbol.for("react.fragment"),Ll=Symbol.for("react.strict_mode"),bo=Symbol.for("react.profiler"),ch=Symbol.for("react.provider"),uh=Symbol.for("react.context"),$l=Symbol.for("react.forward_ref"),wo=Symbol.for("react.suspense"),_o=Symbol.for("react.suspense_list"),Il=Symbol.for("react.memo"),cr=Symbol.for("react.lazy"),dh=Symbol.for("react.offscreen"),ru=Symbol.iterator;function Vn(e){return e===null||typeof e!="object"?null:(e=ru&&e[ru]||e["@@iterator"],typeof e=="function"?e:null)}var me=Object.assign,Ii;function ts(e){if(Ii===void 0)try{throw Error()}catch(r){var t=r.stack.trim().match(/\n( *(at )?)/);Ii=t&&t[1]||""}return`
`+Ii+e}var Ui=!1;function zi(e,t){if(!e||Ui)return"";Ui=!0;var r=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(t)if(t=function(){throw Error()},Object.defineProperty(t.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(t,[])}catch(u){var n=u}Reflect.construct(e,[],t)}else{try{t.call()}catch(u){n=u}e.call(t.prototype)}else{try{throw Error()}catch(u){n=u}e()}}catch(u){if(u&&n&&typeof u.stack=="string"){for(var s=u.stack.split(`
`),a=n.stack.split(`
`),o=s.length-1,l=a.length-1;1<=o&&0<=l&&s[o]!==a[l];)l--;for(;1<=o&&0<=l;o--,l--)if(s[o]!==a[l]){if(o!==1||l!==1)do if(o--,l--,0>l||s[o]!==a[l]){var c=`
`+s[o].replace(" at new "," at ");return e.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",e.displayName)),c}while(1<=o&&0<=l);break}}}finally{Ui=!1,Error.prepareStackTrace=r}return(e=e?e.displayName||e.name:"")?ts(e):""}function dg(e){switch(e.tag){case 5:return ts(e.type);case 16:return ts("Lazy");case 13:return ts("Suspense");case 19:return ts("SuspenseList");case 0:case 2:case 15:return e=zi(e.type,!1),e;case 11:return e=zi(e.type.render,!1),e;case 1:return e=zi(e.type,!0),e;default:return""}}function jo(e){if(e==null)return null;if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case hn:return"Fragment";case dn:return"Portal";case bo:return"Profiler";case Ll:return"StrictMode";case wo:return"Suspense";case _o:return"SuspenseList"}if(typeof e=="object")switch(e.$$typeof){case uh:return(e.displayName||"Context")+".Consumer";case ch:return(e._context.displayName||"Context")+".Provider";case $l:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case Il:return t=e.displayName||null,t!==null?t:jo(e.type)||"Memo";case cr:t=e._payload,e=e._init;try{return jo(e(t))}catch{}}return null}function hg(e){var t=e.type;switch(e.tag){case 24:return"Cache";case 9:return(t.displayName||"Context")+".Consumer";case 10:return(t._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return e=t.render,e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case 7:return"Fragment";case 5:return t;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return jo(t);case 8:return t===Ll?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t}return null}function Er(e){switch(typeof e){case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function hh(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function pg(e){var t=hh(e)?"checked":"value",r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t),n=""+e[t];if(!e.hasOwnProperty(t)&&typeof r<"u"&&typeof r.get=="function"&&typeof r.set=="function"){var s=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return s.call(this)},set:function(o){n=""+o,a.call(this,o)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(o){n=""+o},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Xs(e){e._valueTracker||(e._valueTracker=pg(e))}function ph(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var r=t.getValue(),n="";return e&&(n=hh(e)?e.checked?"true":"false":e.value),e=n,e!==r?(t.setValue(e),!0):!1}function Da(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}function So(e,t){var r=t.checked;return me({},t,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:r??e._wrapperState.initialChecked})}function nu(e,t){var r=t.defaultValue==null?"":t.defaultValue,n=t.checked!=null?t.checked:t.defaultChecked;r=Er(t.value!=null?t.value:r),e._wrapperState={initialChecked:n,initialValue:r,controlled:t.type==="checkbox"||t.type==="radio"?t.checked!=null:t.value!=null}}function fh(e,t){t=t.checked,t!=null&&Ol(e,"checked",t,!1)}function No(e,t){fh(e,t);var r=Er(t.value),n=t.type;if(r!=null)n==="number"?(r===0&&e.value===""||e.value!=r)&&(e.value=""+r):e.value!==""+r&&(e.value=""+r);else if(n==="submit"||n==="reset"){e.removeAttribute("value");return}t.hasOwnProperty("value")?Eo(e,t.type,r):t.hasOwnProperty("defaultValue")&&Eo(e,t.type,Er(t.defaultValue)),t.checked==null&&t.defaultChecked!=null&&(e.defaultChecked=!!t.defaultChecked)}function su(e,t,r){if(t.hasOwnProperty("value")||t.hasOwnProperty("defaultValue")){var n=t.type;if(!(n!=="submit"&&n!=="reset"||t.value!==void 0&&t.value!==null))return;t=""+e._wrapperState.initialValue,r||t===e.value||(e.value=t),e.defaultValue=t}r=e.name,r!==""&&(e.name=""),e.defaultChecked=!!e._wrapperState.initialChecked,r!==""&&(e.name=r)}function Eo(e,t,r){(t!=="number"||Da(e.ownerDocument)!==e)&&(r==null?e.defaultValue=""+e._wrapperState.initialValue:e.defaultValue!==""+r&&(e.defaultValue=""+r))}var rs=Array.isArray;function Sn(e,t,r,n){if(e=e.options,t){t={};for(var s=0;s<r.length;s++)t["$"+r[s]]=!0;for(r=0;r<e.length;r++)s=t.hasOwnProperty("$"+e[r].value),e[r].selected!==s&&(e[r].selected=s),s&&n&&(e[r].defaultSelected=!0)}else{for(r=""+Er(r),t=null,s=0;s<e.length;s++){if(e[s].value===r){e[s].selected=!0,n&&(e[s].defaultSelected=!0);return}t!==null||e[s].disabled||(t=e[s])}t!==null&&(t.selected=!0)}}function To(e,t){if(t.dangerouslySetInnerHTML!=null)throw Error(A(91));return me({},t,{value:void 0,defaultValue:void 0,children:""+e._wrapperState.initialValue})}function au(e,t){var r=t.value;if(r==null){if(r=t.children,t=t.defaultValue,r!=null){if(t!=null)throw Error(A(92));if(rs(r)){if(1<r.length)throw Error(A(93));r=r[0]}t=r}t==null&&(t=""),r=t}e._wrapperState={initialValue:Er(r)}}function gh(e,t){var r=Er(t.value),n=Er(t.defaultValue);r!=null&&(r=""+r,r!==e.value&&(e.value=r),t.defaultValue==null&&e.defaultValue!==r&&(e.defaultValue=r)),n!=null&&(e.defaultValue=""+n)}function iu(e){var t=e.textContent;t===e._wrapperState.initialValue&&t!==""&&t!==null&&(e.value=t)}function mh(e){switch(e){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Co(e,t){return e==null||e==="http://www.w3.org/1999/xhtml"?mh(t):e==="http://www.w3.org/2000/svg"&&t==="foreignObject"?"http://www.w3.org/1999/xhtml":e}var Zs,vh=function(e){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(t,r,n,s){MSApp.execUnsafeLocalFunction(function(){return e(t,r,n,s)})}:e}(function(e,t){if(e.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in e)e.innerHTML=t;else{for(Zs=Zs||document.createElement("div"),Zs.innerHTML="<svg>"+t.valueOf().toString()+"</svg>",t=Zs.firstChild;e.firstChild;)e.removeChild(e.firstChild);for(;t.firstChild;)e.appendChild(t.firstChild)}});function ks(e,t){if(t){var r=e.firstChild;if(r&&r===e.lastChild&&r.nodeType===3){r.nodeValue=t;return}}e.textContent=t}var os={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},fg=["Webkit","ms","Moz","O"];Object.keys(os).forEach(function(e){fg.forEach(function(t){t=t+e.charAt(0).toUpperCase()+e.substring(1),os[t]=os[e]})});function yh(e,t,r){return t==null||typeof t=="boolean"||t===""?"":r||typeof t!="number"||t===0||os.hasOwnProperty(e)&&os[e]?(""+t).trim():t+"px"}function xh(e,t){e=e.style;for(var r in t)if(t.hasOwnProperty(r)){var n=r.indexOf("--")===0,s=yh(r,t[r],n);r==="float"&&(r="cssFloat"),n?e.setProperty(r,s):e[r]=s}}var gg=me({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Ao(e,t){if(t){if(gg[e]&&(t.children!=null||t.dangerouslySetInnerHTML!=null))throw Error(A(137,e));if(t.dangerouslySetInnerHTML!=null){if(t.children!=null)throw Error(A(60));if(typeof t.dangerouslySetInnerHTML!="object"||!("__html"in t.dangerouslySetInnerHTML))throw Error(A(61))}if(t.style!=null&&typeof t.style!="object")throw Error(A(62))}}function Ro(e,t){if(e.indexOf("-")===-1)return typeof t.is=="string";switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Po=null;function Ul(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Oo=null,Nn=null,En=null;function ou(e){if(e=qs(e)){if(typeof Oo!="function")throw Error(A(280));var t=e.stateNode;t&&(t=xi(t),Oo(e.stateNode,e.type,t))}}function kh(e){Nn?En?En.push(e):En=[e]:Nn=e}function bh(){if(Nn){var e=Nn,t=En;if(En=Nn=null,ou(e),t)for(e=0;e<t.length;e++)ou(t[e])}}function wh(e,t){return e(t)}function _h(){}var Di=!1;function jh(e,t,r){if(Di)return e(t,r);Di=!0;try{return wh(e,t,r)}finally{Di=!1,(Nn!==null||En!==null)&&(_h(),bh())}}function bs(e,t){var r=e.stateNode;if(r===null)return null;var n=xi(r);if(n===null)return null;r=n[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(n=!n.disabled)||(e=e.type,n=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!n;break e;default:e=!1}if(e)return null;if(r&&typeof r!="function")throw Error(A(231,t,typeof r));return r}var Lo=!1;if(Qt)try{var qn={};Object.defineProperty(qn,"passive",{get:function(){Lo=!0}}),window.addEventListener("test",qn,qn),window.removeEventListener("test",qn,qn)}catch{Lo=!1}function mg(e,t,r,n,s,a,o,l,c){var u=Array.prototype.slice.call(arguments,3);try{t.apply(r,u)}catch(d){this.onError(d)}}var ls=!1,Fa=null,Ma=!1,$o=null,vg={onError:function(e){ls=!0,Fa=e}};function yg(e,t,r,n,s,a,o,l,c){ls=!1,Fa=null,mg.apply(vg,arguments)}function xg(e,t,r,n,s,a,o,l,c){if(yg.apply(this,arguments),ls){if(ls){var u=Fa;ls=!1,Fa=null}else throw Error(A(198));Ma||(Ma=!0,$o=u)}}function Qr(e){var t=e,r=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(r=t.return),e=t.return;while(e)}return t.tag===3?r:null}function Sh(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function lu(e){if(Qr(e)!==e)throw Error(A(188))}function kg(e){var t=e.alternate;if(!t){if(t=Qr(e),t===null)throw Error(A(188));return t!==e?null:e}for(var r=e,n=t;;){var s=r.return;if(s===null)break;var a=s.alternate;if(a===null){if(n=s.return,n!==null){r=n;continue}break}if(s.child===a.child){for(a=s.child;a;){if(a===r)return lu(s),e;if(a===n)return lu(s),t;a=a.sibling}throw Error(A(188))}if(r.return!==n.return)r=s,n=a;else{for(var o=!1,l=s.child;l;){if(l===r){o=!0,r=s,n=a;break}if(l===n){o=!0,n=s,r=a;break}l=l.sibling}if(!o){for(l=a.child;l;){if(l===r){o=!0,r=a,n=s;break}if(l===n){o=!0,n=a,r=s;break}l=l.sibling}if(!o)throw Error(A(189))}}if(r.alternate!==n)throw Error(A(190))}if(r.tag!==3)throw Error(A(188));return r.stateNode.current===r?e:t}function Nh(e){return e=kg(e),e!==null?Eh(e):null}function Eh(e){if(e.tag===5||e.tag===6)return e;for(e=e.child;e!==null;){var t=Eh(e);if(t!==null)return t;e=e.sibling}return null}var Th=ot.unstable_scheduleCallback,cu=ot.unstable_cancelCallback,bg=ot.unstable_shouldYield,wg=ot.unstable_requestPaint,be=ot.unstable_now,_g=ot.unstable_getCurrentPriorityLevel,zl=ot.unstable_ImmediatePriority,Ch=ot.unstable_UserBlockingPriority,Ba=ot.unstable_NormalPriority,jg=ot.unstable_LowPriority,Ah=ot.unstable_IdlePriority,gi=null,Ft=null;function Sg(e){if(Ft&&typeof Ft.onCommitFiberRoot=="function")try{Ft.onCommitFiberRoot(gi,e,void 0,(e.current.flags&128)===128)}catch{}}var Ct=Math.clz32?Math.clz32:Tg,Ng=Math.log,Eg=Math.LN2;function Tg(e){return e>>>=0,e===0?32:31-(Ng(e)/Eg|0)|0}var ea=64,ta=4194304;function ns(e){switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return e&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return e}}function Wa(e,t){var r=e.pendingLanes;if(r===0)return 0;var n=0,s=e.suspendedLanes,a=e.pingedLanes,o=r&268435455;if(o!==0){var l=o&~s;l!==0?n=ns(l):(a&=o,a!==0&&(n=ns(a)))}else o=r&~s,o!==0?n=ns(o):a!==0&&(n=ns(a));if(n===0)return 0;if(t!==0&&t!==n&&!(t&s)&&(s=n&-n,a=t&-t,s>=a||s===16&&(a&4194240)!==0))return t;if(n&4&&(n|=r&16),t=e.entangledLanes,t!==0)for(e=e.entanglements,t&=n;0<t;)r=31-Ct(t),s=1<<r,n|=e[r],t&=~s;return n}function Cg(e,t){switch(e){case 1:case 2:case 4:return t+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Ag(e,t){for(var r=e.suspendedLanes,n=e.pingedLanes,s=e.expirationTimes,a=e.pendingLanes;0<a;){var o=31-Ct(a),l=1<<o,c=s[o];c===-1?(!(l&r)||l&n)&&(s[o]=Cg(l,t)):c<=t&&(e.expiredLanes|=l),a&=~l}}function Io(e){return e=e.pendingLanes&-1073741825,e!==0?e:e&1073741824?1073741824:0}function Rh(){var e=ea;return ea<<=1,!(ea&4194240)&&(ea=64),e}function Fi(e){for(var t=[],r=0;31>r;r++)t.push(e);return t}function Hs(e,t,r){e.pendingLanes|=t,t!==536870912&&(e.suspendedLanes=0,e.pingedLanes=0),e=e.eventTimes,t=31-Ct(t),e[t]=r}function Rg(e,t){var r=e.pendingLanes&~t;e.pendingLanes=t,e.suspendedLanes=0,e.pingedLanes=0,e.expiredLanes&=t,e.mutableReadLanes&=t,e.entangledLanes&=t,t=e.entanglements;var n=e.eventTimes;for(e=e.expirationTimes;0<r;){var s=31-Ct(r),a=1<<s;t[s]=0,n[s]=-1,e[s]=-1,r&=~a}}function Dl(e,t){var r=e.entangledLanes|=t;for(e=e.entanglements;r;){var n=31-Ct(r),s=1<<n;s&t|e[n]&t&&(e[n]|=t),r&=~s}}var se=0;function Ph(e){return e&=-e,1<e?4<e?e&268435455?16:536870912:4:1}var Oh,Fl,Lh,$h,Ih,Uo=!1,ra=[],xr=null,kr=null,br=null,ws=new Map,_s=new Map,pr=[],Pg="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function uu(e,t){switch(e){case"focusin":case"focusout":xr=null;break;case"dragenter":case"dragleave":kr=null;break;case"mouseover":case"mouseout":br=null;break;case"pointerover":case"pointerout":ws.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":_s.delete(t.pointerId)}}function Kn(e,t,r,n,s,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:r,eventSystemFlags:n,nativeEvent:a,targetContainers:[s]},t!==null&&(t=qs(t),t!==null&&Fl(t)),e):(e.eventSystemFlags|=n,t=e.targetContainers,s!==null&&t.indexOf(s)===-1&&t.push(s),e)}function Og(e,t,r,n,s){switch(t){case"focusin":return xr=Kn(xr,e,t,r,n,s),!0;case"dragenter":return kr=Kn(kr,e,t,r,n,s),!0;case"mouseover":return br=Kn(br,e,t,r,n,s),!0;case"pointerover":var a=s.pointerId;return ws.set(a,Kn(ws.get(a)||null,e,t,r,n,s)),!0;case"gotpointercapture":return a=s.pointerId,_s.set(a,Kn(_s.get(a)||null,e,t,r,n,s)),!0}return!1}function Uh(e){var t=zr(e.target);if(t!==null){var r=Qr(t);if(r!==null){if(t=r.tag,t===13){if(t=Sh(r),t!==null){e.blockedOn=t,Ih(e.priority,function(){Lh(r)});return}}else if(t===3&&r.stateNode.current.memoizedState.isDehydrated){e.blockedOn=r.tag===3?r.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Ea(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var r=zo(e.domEventName,e.eventSystemFlags,t[0],e.nativeEvent);if(r===null){r=e.nativeEvent;var n=new r.constructor(r.type,r);Po=n,r.target.dispatchEvent(n),Po=null}else return t=qs(r),t!==null&&Fl(t),e.blockedOn=r,!1;t.shift()}return!0}function du(e,t,r){Ea(e)&&r.delete(t)}function Lg(){Uo=!1,xr!==null&&Ea(xr)&&(xr=null),kr!==null&&Ea(kr)&&(kr=null),br!==null&&Ea(br)&&(br=null),ws.forEach(du),_s.forEach(du)}function Gn(e,t){e.blockedOn===t&&(e.blockedOn=null,Uo||(Uo=!0,ot.unstable_scheduleCallback(ot.unstable_NormalPriority,Lg)))}function js(e){function t(s){return Gn(s,e)}if(0<ra.length){Gn(ra[0],e);for(var r=1;r<ra.length;r++){var n=ra[r];n.blockedOn===e&&(n.blockedOn=null)}}for(xr!==null&&Gn(xr,e),kr!==null&&Gn(kr,e),br!==null&&Gn(br,e),ws.forEach(t),_s.forEach(t),r=0;r<pr.length;r++)n=pr[r],n.blockedOn===e&&(n.blockedOn=null);for(;0<pr.length&&(r=pr[0],r.blockedOn===null);)Uh(r),r.blockedOn===null&&pr.shift()}var Tn=tr.ReactCurrentBatchConfig,Ha=!0;function $g(e,t,r,n){var s=se,a=Tn.transition;Tn.transition=null;try{se=1,Ml(e,t,r,n)}finally{se=s,Tn.transition=a}}function Ig(e,t,r,n){var s=se,a=Tn.transition;Tn.transition=null;try{se=4,Ml(e,t,r,n)}finally{se=s,Tn.transition=a}}function Ml(e,t,r,n){if(Ha){var s=zo(e,t,r,n);if(s===null)Yi(e,t,n,Va,r),uu(e,n);else if(Og(s,e,t,r,n))n.stopPropagation();else if(uu(e,n),t&4&&-1<Pg.indexOf(e)){for(;s!==null;){var a=qs(s);if(a!==null&&Oh(a),a=zo(e,t,r,n),a===null&&Yi(e,t,n,Va,r),a===s)break;s=a}s!==null&&n.stopPropagation()}else Yi(e,t,n,null,r)}}var Va=null;function zo(e,t,r,n){if(Va=null,e=Ul(n),e=zr(e),e!==null)if(t=Qr(e),t===null)e=null;else if(r=t.tag,r===13){if(e=Sh(t),e!==null)return e;e=null}else if(r===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null);return Va=e,null}function zh(e){switch(e){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(_g()){case zl:return 1;case Ch:return 4;case Ba:case jg:return 16;case Ah:return 536870912;default:return 16}default:return 16}}var vr=null,Bl=null,Ta=null;function Dh(){if(Ta)return Ta;var e,t=Bl,r=t.length,n,s="value"in vr?vr.value:vr.textContent,a=s.length;for(e=0;e<r&&t[e]===s[e];e++);var o=r-e;for(n=1;n<=o&&t[r-n]===s[a-n];n++);return Ta=s.slice(e,1<n?1-n:void 0)}function Ca(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function na(){return!0}function hu(){return!1}function ct(e){function t(r,n,s,a,o){this._reactName=r,this._targetInst=s,this.type=n,this.nativeEvent=a,this.target=o,this.currentTarget=null;for(var l in e)e.hasOwnProperty(l)&&(r=e[l],this[l]=r?r(a):a[l]);return this.isDefaultPrevented=(a.defaultPrevented!=null?a.defaultPrevented:a.returnValue===!1)?na:hu,this.isPropagationStopped=hu,this}return me(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var r=this.nativeEvent;r&&(r.preventDefault?r.preventDefault():typeof r.returnValue!="unknown"&&(r.returnValue=!1),this.isDefaultPrevented=na)},stopPropagation:function(){var r=this.nativeEvent;r&&(r.stopPropagation?r.stopPropagation():typeof r.cancelBubble!="unknown"&&(r.cancelBubble=!0),this.isPropagationStopped=na)},persist:function(){},isPersistent:na}),t}var Fn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Wl=ct(Fn),Vs=me({},Fn,{view:0,detail:0}),Ug=ct(Vs),Mi,Bi,Jn,mi=me({},Vs,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Hl,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Jn&&(Jn&&e.type==="mousemove"?(Mi=e.screenX-Jn.screenX,Bi=e.screenY-Jn.screenY):Bi=Mi=0,Jn=e),Mi)},movementY:function(e){return"movementY"in e?e.movementY:Bi}}),pu=ct(mi),zg=me({},mi,{dataTransfer:0}),Dg=ct(zg),Fg=me({},Vs,{relatedTarget:0}),Wi=ct(Fg),Mg=me({},Fn,{animationName:0,elapsedTime:0,pseudoElement:0}),Bg=ct(Mg),Wg=me({},Fn,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Hg=ct(Wg),Vg=me({},Fn,{data:0}),fu=ct(Vg),qg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Kg={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Gg={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Jg(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Gg[e])?!!t[e]:!1}function Hl(){return Jg}var Yg=me({},Vs,{key:function(e){if(e.key){var t=qg[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ca(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Kg[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Hl,charCode:function(e){return e.type==="keypress"?Ca(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ca(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Qg=ct(Yg),Xg=me({},mi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),gu=ct(Xg),Zg=me({},Vs,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Hl}),em=ct(Zg),tm=me({},Fn,{propertyName:0,elapsedTime:0,pseudoElement:0}),rm=ct(tm),nm=me({},mi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),sm=ct(nm),am=[9,13,27,32],Vl=Qt&&"CompositionEvent"in window,cs=null;Qt&&"documentMode"in document&&(cs=document.documentMode);var im=Qt&&"TextEvent"in window&&!cs,Fh=Qt&&(!Vl||cs&&8<cs&&11>=cs),mu=" ",vu=!1;function Mh(e,t){switch(e){case"keyup":return am.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Bh(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var pn=!1;function om(e,t){switch(e){case"compositionend":return Bh(t);case"keypress":return t.which!==32?null:(vu=!0,mu);case"textInput":return e=t.data,e===mu&&vu?null:e;default:return null}}function lm(e,t){if(pn)return e==="compositionend"||!Vl&&Mh(e,t)?(e=Dh(),Ta=Bl=vr=null,pn=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Fh&&t.locale!=="ko"?null:t.data;default:return null}}var cm={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function yu(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!cm[e.type]:t==="textarea"}function Wh(e,t,r,n){kh(n),t=qa(t,"onChange"),0<t.length&&(r=new Wl("onChange","change",null,r,n),e.push({event:r,listeners:t}))}var us=null,Ss=null;function um(e){ep(e,0)}function vi(e){var t=mn(e);if(ph(t))return e}function dm(e,t){if(e==="change")return t}var Hh=!1;if(Qt){var Hi;if(Qt){var Vi="oninput"in document;if(!Vi){var xu=document.createElement("div");xu.setAttribute("oninput","return;"),Vi=typeof xu.oninput=="function"}Hi=Vi}else Hi=!1;Hh=Hi&&(!document.documentMode||9<document.documentMode)}function ku(){us&&(us.detachEvent("onpropertychange",Vh),Ss=us=null)}function Vh(e){if(e.propertyName==="value"&&vi(Ss)){var t=[];Wh(t,Ss,e,Ul(e)),jh(um,t)}}function hm(e,t,r){e==="focusin"?(ku(),us=t,Ss=r,us.attachEvent("onpropertychange",Vh)):e==="focusout"&&ku()}function pm(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return vi(Ss)}function fm(e,t){if(e==="click")return vi(t)}function gm(e,t){if(e==="input"||e==="change")return vi(t)}function mm(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Rt=typeof Object.is=="function"?Object.is:mm;function Ns(e,t){if(Rt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var r=Object.keys(e),n=Object.keys(t);if(r.length!==n.length)return!1;for(n=0;n<r.length;n++){var s=r[n];if(!ko.call(t,s)||!Rt(e[s],t[s]))return!1}return!0}function bu(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function wu(e,t){var r=bu(e);e=0;for(var n;r;){if(r.nodeType===3){if(n=e+r.textContent.length,e<=t&&n>=t)return{node:r,offset:t-e};e=n}e:{for(;r;){if(r.nextSibling){r=r.nextSibling;break e}r=r.parentNode}r=void 0}r=bu(r)}}function qh(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?qh(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Kh(){for(var e=window,t=Da();t instanceof e.HTMLIFrameElement;){try{var r=typeof t.contentWindow.location.href=="string"}catch{r=!1}if(r)e=t.contentWindow;else break;t=Da(e.document)}return t}function ql(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}function vm(e){var t=Kh(),r=e.focusedElem,n=e.selectionRange;if(t!==r&&r&&r.ownerDocument&&qh(r.ownerDocument.documentElement,r)){if(n!==null&&ql(r)){if(t=n.start,e=n.end,e===void 0&&(e=t),"selectionStart"in r)r.selectionStart=t,r.selectionEnd=Math.min(e,r.value.length);else if(e=(t=r.ownerDocument||document)&&t.defaultView||window,e.getSelection){e=e.getSelection();var s=r.textContent.length,a=Math.min(n.start,s);n=n.end===void 0?a:Math.min(n.end,s),!e.extend&&a>n&&(s=n,n=a,a=s),s=wu(r,a);var o=wu(r,n);s&&o&&(e.rangeCount!==1||e.anchorNode!==s.node||e.anchorOffset!==s.offset||e.focusNode!==o.node||e.focusOffset!==o.offset)&&(t=t.createRange(),t.setStart(s.node,s.offset),e.removeAllRanges(),a>n?(e.addRange(t),e.extend(o.node,o.offset)):(t.setEnd(o.node,o.offset),e.addRange(t)))}}for(t=[],e=r;e=e.parentNode;)e.nodeType===1&&t.push({element:e,left:e.scrollLeft,top:e.scrollTop});for(typeof r.focus=="function"&&r.focus(),r=0;r<t.length;r++)e=t[r],e.element.scrollLeft=e.left,e.element.scrollTop=e.top}}var ym=Qt&&"documentMode"in document&&11>=document.documentMode,fn=null,Do=null,ds=null,Fo=!1;function _u(e,t,r){var n=r.window===r?r.document:r.nodeType===9?r:r.ownerDocument;Fo||fn==null||fn!==Da(n)||(n=fn,"selectionStart"in n&&ql(n)?n={start:n.selectionStart,end:n.selectionEnd}:(n=(n.ownerDocument&&n.ownerDocument.defaultView||window).getSelection(),n={anchorNode:n.anchorNode,anchorOffset:n.anchorOffset,focusNode:n.focusNode,focusOffset:n.focusOffset}),ds&&Ns(ds,n)||(ds=n,n=qa(Do,"onSelect"),0<n.length&&(t=new Wl("onSelect","select",null,t,r),e.push({event:t,listeners:n}),t.target=fn)))}function sa(e,t){var r={};return r[e.toLowerCase()]=t.toLowerCase(),r["Webkit"+e]="webkit"+t,r["Moz"+e]="moz"+t,r}var gn={animationend:sa("Animation","AnimationEnd"),animationiteration:sa("Animation","AnimationIteration"),animationstart:sa("Animation","AnimationStart"),transitionend:sa("Transition","TransitionEnd")},qi={},Gh={};Qt&&(Gh=document.createElement("div").style,"AnimationEvent"in window||(delete gn.animationend.animation,delete gn.animationiteration.animation,delete gn.animationstart.animation),"TransitionEvent"in window||delete gn.transitionend.transition);function yi(e){if(qi[e])return qi[e];if(!gn[e])return e;var t=gn[e],r;for(r in t)if(t.hasOwnProperty(r)&&r in Gh)return qi[e]=t[r];return e}var Jh=yi("animationend"),Yh=yi("animationiteration"),Qh=yi("animationstart"),Xh=yi("transitionend"),Zh=new Map,ju="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Cr(e,t){Zh.set(e,t),Yr(t,[e])}for(var Ki=0;Ki<ju.length;Ki++){var Gi=ju[Ki],xm=Gi.toLowerCase(),km=Gi[0].toUpperCase()+Gi.slice(1);Cr(xm,"on"+km)}Cr(Jh,"onAnimationEnd");Cr(Yh,"onAnimationIteration");Cr(Qh,"onAnimationStart");Cr("dblclick","onDoubleClick");Cr("focusin","onFocus");Cr("focusout","onBlur");Cr(Xh,"onTransitionEnd");Pn("onMouseEnter",["mouseout","mouseover"]);Pn("onMouseLeave",["mouseout","mouseover"]);Pn("onPointerEnter",["pointerout","pointerover"]);Pn("onPointerLeave",["pointerout","pointerover"]);Yr("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Yr("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Yr("onBeforeInput",["compositionend","keypress","textInput","paste"]);Yr("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Yr("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Yr("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ss="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),bm=new Set("cancel close invalid load scroll toggle".split(" ").concat(ss));function Su(e,t,r){var n=e.type||"unknown-event";e.currentTarget=r,xg(n,t,void 0,e),e.currentTarget=null}function ep(e,t){t=(t&4)!==0;for(var r=0;r<e.length;r++){var n=e[r],s=n.event;n=n.listeners;e:{var a=void 0;if(t)for(var o=n.length-1;0<=o;o--){var l=n[o],c=l.instance,u=l.currentTarget;if(l=l.listener,c!==a&&s.isPropagationStopped())break e;Su(s,l,u),a=c}else for(o=0;o<n.length;o++){if(l=n[o],c=l.instance,u=l.currentTarget,l=l.listener,c!==a&&s.isPropagationStopped())break e;Su(s,l,u),a=c}}}if(Ma)throw e=$o,Ma=!1,$o=null,e}function ce(e,t){var r=t[Vo];r===void 0&&(r=t[Vo]=new Set);var n=e+"__bubble";r.has(n)||(tp(t,e,2,!1),r.add(n))}function Ji(e,t,r){var n=0;t&&(n|=4),tp(r,e,n,t)}var aa="_reactListening"+Math.random().toString(36).slice(2);function Es(e){if(!e[aa]){e[aa]=!0,lh.forEach(function(r){r!=="selectionchange"&&(bm.has(r)||Ji(r,!1,e),Ji(r,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[aa]||(t[aa]=!0,Ji("selectionchange",!1,t))}}function tp(e,t,r,n){switch(zh(t)){case 1:var s=$g;break;case 4:s=Ig;break;default:s=Ml}r=s.bind(null,t,r,e),s=void 0,!Lo||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(s=!0),n?s!==void 0?e.addEventListener(t,r,{capture:!0,passive:s}):e.addEventListener(t,r,!0):s!==void 0?e.addEventListener(t,r,{passive:s}):e.addEventListener(t,r,!1)}function Yi(e,t,r,n,s){var a=n;if(!(t&1)&&!(t&2)&&n!==null)e:for(;;){if(n===null)return;var o=n.tag;if(o===3||o===4){var l=n.stateNode.containerInfo;if(l===s||l.nodeType===8&&l.parentNode===s)break;if(o===4)for(o=n.return;o!==null;){var c=o.tag;if((c===3||c===4)&&(c=o.stateNode.containerInfo,c===s||c.nodeType===8&&c.parentNode===s))return;o=o.return}for(;l!==null;){if(o=zr(l),o===null)return;if(c=o.tag,c===5||c===6){n=a=o;continue e}l=l.parentNode}}n=n.return}jh(function(){var u=a,d=Ul(r),h=[];e:{var p=Zh.get(e);if(p!==void 0){var v=Wl,y=e;switch(e){case"keypress":if(Ca(r)===0)break e;case"keydown":case"keyup":v=Qg;break;case"focusin":y="focus",v=Wi;break;case"focusout":y="blur",v=Wi;break;case"beforeblur":case"afterblur":v=Wi;break;case"click":if(r.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":v=pu;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":v=Dg;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":v=em;break;case Jh:case Yh:case Qh:v=Bg;break;case Xh:v=rm;break;case"scroll":v=Ug;break;case"wheel":v=sm;break;case"copy":case"cut":case"paste":v=Hg;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":v=gu}var x=(t&4)!==0,N=!x&&e==="scroll",f=x?p!==null?p+"Capture":null:p;x=[];for(var g=u,m;g!==null;){m=g;var k=m.stateNode;if(m.tag===5&&k!==null&&(m=k,f!==null&&(k=bs(g,f),k!=null&&x.push(Ts(g,k,m)))),N)break;g=g.return}0<x.length&&(p=new v(p,y,null,r,d),h.push({event:p,listeners:x}))}}if(!(t&7)){e:{if(p=e==="mouseover"||e==="pointerover",v=e==="mouseout"||e==="pointerout",p&&r!==Po&&(y=r.relatedTarget||r.fromElement)&&(zr(y)||y[Xt]))break e;if((v||p)&&(p=d.window===d?d:(p=d.ownerDocument)?p.defaultView||p.parentWindow:window,v?(y=r.relatedTarget||r.toElement,v=u,y=y?zr(y):null,y!==null&&(N=Qr(y),y!==N||y.tag!==5&&y.tag!==6)&&(y=null)):(v=null,y=u),v!==y)){if(x=pu,k="onMouseLeave",f="onMouseEnter",g="mouse",(e==="pointerout"||e==="pointerover")&&(x=gu,k="onPointerLeave",f="onPointerEnter",g="pointer"),N=v==null?p:mn(v),m=y==null?p:mn(y),p=new x(k,g+"leave",v,r,d),p.target=N,p.relatedTarget=m,k=null,zr(d)===u&&(x=new x(f,g+"enter",y,r,d),x.target=m,x.relatedTarget=N,k=x),N=k,v&&y)t:{for(x=v,f=y,g=0,m=x;m;m=Xr(m))g++;for(m=0,k=f;k;k=Xr(k))m++;for(;0<g-m;)x=Xr(x),g--;for(;0<m-g;)f=Xr(f),m--;for(;g--;){if(x===f||f!==null&&x===f.alternate)break t;x=Xr(x),f=Xr(f)}x=null}else x=null;v!==null&&Nu(h,p,v,x,!1),y!==null&&N!==null&&Nu(h,N,y,x,!0)}}e:{if(p=u?mn(u):window,v=p.nodeName&&p.nodeName.toLowerCase(),v==="select"||v==="input"&&p.type==="file")var j=dm;else if(yu(p))if(Hh)j=gm;else{j=pm;var C=hm}else(v=p.nodeName)&&v.toLowerCase()==="input"&&(p.type==="checkbox"||p.type==="radio")&&(j=fm);if(j&&(j=j(e,u))){Wh(h,j,r,d);break e}C&&C(e,p,u),e==="focusout"&&(C=p._wrapperState)&&C.controlled&&p.type==="number"&&Eo(p,"number",p.value)}switch(C=u?mn(u):window,e){case"focusin":(yu(C)||C.contentEditable==="true")&&(fn=C,Do=u,ds=null);break;case"focusout":ds=Do=fn=null;break;case"mousedown":Fo=!0;break;case"contextmenu":case"mouseup":case"dragend":Fo=!1,_u(h,r,d);break;case"selectionchange":if(ym)break;case"keydown":case"keyup":_u(h,r,d)}var S;if(Vl)e:{switch(e){case"compositionstart":var $="onCompositionStart";break e;case"compositionend":$="onCompositionEnd";break e;case"compositionupdate":$="onCompositionUpdate";break e}$=void 0}else pn?Mh(e,r)&&($="onCompositionEnd"):e==="keydown"&&r.keyCode===229&&($="onCompositionStart");$&&(Fh&&r.locale!=="ko"&&(pn||$!=="onCompositionStart"?$==="onCompositionEnd"&&pn&&(S=Dh()):(vr=d,Bl="value"in vr?vr.value:vr.textContent,pn=!0)),C=qa(u,$),0<C.length&&($=new fu($,e,null,r,d),h.push({event:$,listeners:C}),S?$.data=S:(S=Bh(r),S!==null&&($.data=S)))),(S=im?om(e,r):lm(e,r))&&(u=qa(u,"onBeforeInput"),0<u.length&&(d=new fu("onBeforeInput","beforeinput",null,r,d),h.push({event:d,listeners:u}),d.data=S))}ep(h,t)})}function Ts(e,t,r){return{instance:e,listener:t,currentTarget:r}}function qa(e,t){for(var r=t+"Capture",n=[];e!==null;){var s=e,a=s.stateNode;s.tag===5&&a!==null&&(s=a,a=bs(e,r),a!=null&&n.unshift(Ts(e,a,s)),a=bs(e,t),a!=null&&n.push(Ts(e,a,s))),e=e.return}return n}function Xr(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5);return e||null}function Nu(e,t,r,n,s){for(var a=t._reactName,o=[];r!==null&&r!==n;){var l=r,c=l.alternate,u=l.stateNode;if(c!==null&&c===n)break;l.tag===5&&u!==null&&(l=u,s?(c=bs(r,a),c!=null&&o.unshift(Ts(r,c,l))):s||(c=bs(r,a),c!=null&&o.push(Ts(r,c,l)))),r=r.return}o.length!==0&&e.push({event:t,listeners:o})}var wm=/\r\n?/g,_m=/\u0000|\uFFFD/g;function Eu(e){return(typeof e=="string"?e:""+e).replace(wm,`
`).replace(_m,"")}function ia(e,t,r){if(t=Eu(t),Eu(e)!==t&&r)throw Error(A(425))}function Ka(){}var Mo=null,Bo=null;function Wo(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Ho=typeof setTimeout=="function"?setTimeout:void 0,jm=typeof clearTimeout=="function"?clearTimeout:void 0,Tu=typeof Promise=="function"?Promise:void 0,Sm=typeof queueMicrotask=="function"?queueMicrotask:typeof Tu<"u"?function(e){return Tu.resolve(null).then(e).catch(Nm)}:Ho;function Nm(e){setTimeout(function(){throw e})}function Qi(e,t){var r=t,n=0;do{var s=r.nextSibling;if(e.removeChild(r),s&&s.nodeType===8)if(r=s.data,r==="/$"){if(n===0){e.removeChild(s),js(t);return}n--}else r!=="$"&&r!=="$?"&&r!=="$!"||n++;r=s}while(r);js(t)}function wr(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?")break;if(t==="/$")return null}}return e}function Cu(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="$"||r==="$!"||r==="$?"){if(t===0)return e;t--}else r==="/$"&&t++}e=e.previousSibling}return null}var Mn=Math.random().toString(36).slice(2),Dt="__reactFiber$"+Mn,Cs="__reactProps$"+Mn,Xt="__reactContainer$"+Mn,Vo="__reactEvents$"+Mn,Em="__reactListeners$"+Mn,Tm="__reactHandles$"+Mn;function zr(e){var t=e[Dt];if(t)return t;for(var r=e.parentNode;r;){if(t=r[Xt]||r[Dt]){if(r=t.alternate,t.child!==null||r!==null&&r.child!==null)for(e=Cu(e);e!==null;){if(r=e[Dt])return r;e=Cu(e)}return t}e=r,r=e.parentNode}return null}function qs(e){return e=e[Dt]||e[Xt],!e||e.tag!==5&&e.tag!==6&&e.tag!==13&&e.tag!==3?null:e}function mn(e){if(e.tag===5||e.tag===6)return e.stateNode;throw Error(A(33))}function xi(e){return e[Cs]||null}var qo=[],vn=-1;function Ar(e){return{current:e}}function ue(e){0>vn||(e.current=qo[vn],qo[vn]=null,vn--)}function oe(e,t){vn++,qo[vn]=e.current,e.current=t}var Tr={},Be=Ar(Tr),Ze=Ar(!1),Vr=Tr;function On(e,t){var r=e.type.contextTypes;if(!r)return Tr;var n=e.stateNode;if(n&&n.__reactInternalMemoizedUnmaskedChildContext===t)return n.__reactInternalMemoizedMaskedChildContext;var s={},a;for(a in r)s[a]=t[a];return n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=t,e.__reactInternalMemoizedMaskedChildContext=s),s}function et(e){return e=e.childContextTypes,e!=null}function Ga(){ue(Ze),ue(Be)}function Au(e,t,r){if(Be.current!==Tr)throw Error(A(168));oe(Be,t),oe(Ze,r)}function rp(e,t,r){var n=e.stateNode;if(t=t.childContextTypes,typeof n.getChildContext!="function")return r;n=n.getChildContext();for(var s in n)if(!(s in t))throw Error(A(108,hg(e)||"Unknown",s));return me({},r,n)}function Ja(e){return e=(e=e.stateNode)&&e.__reactInternalMemoizedMergedChildContext||Tr,Vr=Be.current,oe(Be,e),oe(Ze,Ze.current),!0}function Ru(e,t,r){var n=e.stateNode;if(!n)throw Error(A(169));r?(e=rp(e,t,Vr),n.__reactInternalMemoizedMergedChildContext=e,ue(Ze),ue(Be),oe(Be,e)):ue(Ze),oe(Ze,r)}var Kt=null,ki=!1,Xi=!1;function np(e){Kt===null?Kt=[e]:Kt.push(e)}function Cm(e){ki=!0,np(e)}function Rr(){if(!Xi&&Kt!==null){Xi=!0;var e=0,t=se;try{var r=Kt;for(se=1;e<r.length;e++){var n=r[e];do n=n(!0);while(n!==null)}Kt=null,ki=!1}catch(s){throw Kt!==null&&(Kt=Kt.slice(e+1)),Th(zl,Rr),s}finally{se=t,Xi=!1}}return null}var yn=[],xn=0,Ya=null,Qa=0,pt=[],ft=0,qr=null,Gt=1,Jt="";function Lr(e,t){yn[xn++]=Qa,yn[xn++]=Ya,Ya=e,Qa=t}function sp(e,t,r){pt[ft++]=Gt,pt[ft++]=Jt,pt[ft++]=qr,qr=e;var n=Gt;e=Jt;var s=32-Ct(n)-1;n&=~(1<<s),r+=1;var a=32-Ct(t)+s;if(30<a){var o=s-s%5;a=(n&(1<<o)-1).toString(32),n>>=o,s-=o,Gt=1<<32-Ct(t)+s|r<<s|n,Jt=a+e}else Gt=1<<a|r<<s|n,Jt=e}function Kl(e){e.return!==null&&(Lr(e,1),sp(e,1,0))}function Gl(e){for(;e===Ya;)Ya=yn[--xn],yn[xn]=null,Qa=yn[--xn],yn[xn]=null;for(;e===qr;)qr=pt[--ft],pt[ft]=null,Jt=pt[--ft],pt[ft]=null,Gt=pt[--ft],pt[ft]=null}var it=null,at=null,de=!1,Tt=null;function ap(e,t){var r=gt(5,null,null,0);r.elementType="DELETED",r.stateNode=t,r.return=e,t=e.deletions,t===null?(e.deletions=[r],e.flags|=16):t.push(r)}function Pu(e,t){switch(e.tag){case 5:var r=e.type;return t=t.nodeType!==1||r.toLowerCase()!==t.nodeName.toLowerCase()?null:t,t!==null?(e.stateNode=t,it=e,at=wr(t.firstChild),!0):!1;case 6:return t=e.pendingProps===""||t.nodeType!==3?null:t,t!==null?(e.stateNode=t,it=e,at=null,!0):!1;case 13:return t=t.nodeType!==8?null:t,t!==null?(r=qr!==null?{id:Gt,overflow:Jt}:null,e.memoizedState={dehydrated:t,treeContext:r,retryLane:1073741824},r=gt(18,null,null,0),r.stateNode=t,r.return=e,e.child=r,it=e,at=null,!0):!1;default:return!1}}function Ko(e){return(e.mode&1)!==0&&(e.flags&128)===0}function Go(e){if(de){var t=at;if(t){var r=t;if(!Pu(e,t)){if(Ko(e))throw Error(A(418));t=wr(r.nextSibling);var n=it;t&&Pu(e,t)?ap(n,r):(e.flags=e.flags&-4097|2,de=!1,it=e)}}else{if(Ko(e))throw Error(A(418));e.flags=e.flags&-4097|2,de=!1,it=e}}}function Ou(e){for(e=e.return;e!==null&&e.tag!==5&&e.tag!==3&&e.tag!==13;)e=e.return;it=e}function oa(e){if(e!==it)return!1;if(!de)return Ou(e),de=!0,!1;var t;if((t=e.tag!==3)&&!(t=e.tag!==5)&&(t=e.type,t=t!=="head"&&t!=="body"&&!Wo(e.type,e.memoizedProps)),t&&(t=at)){if(Ko(e))throw ip(),Error(A(418));for(;t;)ap(e,t),t=wr(t.nextSibling)}if(Ou(e),e.tag===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(A(317));e:{for(e=e.nextSibling,t=0;e;){if(e.nodeType===8){var r=e.data;if(r==="/$"){if(t===0){at=wr(e.nextSibling);break e}t--}else r!=="$"&&r!=="$!"&&r!=="$?"||t++}e=e.nextSibling}at=null}}else at=it?wr(e.stateNode.nextSibling):null;return!0}function ip(){for(var e=at;e;)e=wr(e.nextSibling)}function Ln(){at=it=null,de=!1}function Jl(e){Tt===null?Tt=[e]:Tt.push(e)}var Am=tr.ReactCurrentBatchConfig;function Yn(e,t,r){if(e=r.ref,e!==null&&typeof e!="function"&&typeof e!="object"){if(r._owner){if(r=r._owner,r){if(r.tag!==1)throw Error(A(309));var n=r.stateNode}if(!n)throw Error(A(147,e));var s=n,a=""+e;return t!==null&&t.ref!==null&&typeof t.ref=="function"&&t.ref._stringRef===a?t.ref:(t=function(o){var l=s.refs;o===null?delete l[a]:l[a]=o},t._stringRef=a,t)}if(typeof e!="string")throw Error(A(284));if(!r._owner)throw Error(A(290,e))}return e}function la(e,t){throw e=Object.prototype.toString.call(t),Error(A(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e))}function Lu(e){var t=e._init;return t(e._payload)}function op(e){function t(f,g){if(e){var m=f.deletions;m===null?(f.deletions=[g],f.flags|=16):m.push(g)}}function r(f,g){if(!e)return null;for(;g!==null;)t(f,g),g=g.sibling;return null}function n(f,g){for(f=new Map;g!==null;)g.key!==null?f.set(g.key,g):f.set(g.index,g),g=g.sibling;return f}function s(f,g){return f=Nr(f,g),f.index=0,f.sibling=null,f}function a(f,g,m){return f.index=m,e?(m=f.alternate,m!==null?(m=m.index,m<g?(f.flags|=2,g):m):(f.flags|=2,g)):(f.flags|=1048576,g)}function o(f){return e&&f.alternate===null&&(f.flags|=2),f}function l(f,g,m,k){return g===null||g.tag!==6?(g=ao(m,f.mode,k),g.return=f,g):(g=s(g,m),g.return=f,g)}function c(f,g,m,k){var j=m.type;return j===hn?d(f,g,m.props.children,k,m.key):g!==null&&(g.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===cr&&Lu(j)===g.type)?(k=s(g,m.props),k.ref=Yn(f,g,m),k.return=f,k):(k=Ia(m.type,m.key,m.props,null,f.mode,k),k.ref=Yn(f,g,m),k.return=f,k)}function u(f,g,m,k){return g===null||g.tag!==4||g.stateNode.containerInfo!==m.containerInfo||g.stateNode.implementation!==m.implementation?(g=io(m,f.mode,k),g.return=f,g):(g=s(g,m.children||[]),g.return=f,g)}function d(f,g,m,k,j){return g===null||g.tag!==7?(g=Hr(m,f.mode,k,j),g.return=f,g):(g=s(g,m),g.return=f,g)}function h(f,g,m){if(typeof g=="string"&&g!==""||typeof g=="number")return g=ao(""+g,f.mode,m),g.return=f,g;if(typeof g=="object"&&g!==null){switch(g.$$typeof){case Qs:return m=Ia(g.type,g.key,g.props,null,f.mode,m),m.ref=Yn(f,null,g),m.return=f,m;case dn:return g=io(g,f.mode,m),g.return=f,g;case cr:var k=g._init;return h(f,k(g._payload),m)}if(rs(g)||Vn(g))return g=Hr(g,f.mode,m,null),g.return=f,g;la(f,g)}return null}function p(f,g,m,k){var j=g!==null?g.key:null;if(typeof m=="string"&&m!==""||typeof m=="number")return j!==null?null:l(f,g,""+m,k);if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Qs:return m.key===j?c(f,g,m,k):null;case dn:return m.key===j?u(f,g,m,k):null;case cr:return j=m._init,p(f,g,j(m._payload),k)}if(rs(m)||Vn(m))return j!==null?null:d(f,g,m,k,null);la(f,m)}return null}function v(f,g,m,k,j){if(typeof k=="string"&&k!==""||typeof k=="number")return f=f.get(m)||null,l(g,f,""+k,j);if(typeof k=="object"&&k!==null){switch(k.$$typeof){case Qs:return f=f.get(k.key===null?m:k.key)||null,c(g,f,k,j);case dn:return f=f.get(k.key===null?m:k.key)||null,u(g,f,k,j);case cr:var C=k._init;return v(f,g,m,C(k._payload),j)}if(rs(k)||Vn(k))return f=f.get(m)||null,d(g,f,k,j,null);la(g,k)}return null}function y(f,g,m,k){for(var j=null,C=null,S=g,$=g=0,q=null;S!==null&&$<m.length;$++){S.index>$?(q=S,S=null):q=S.sibling;var J=p(f,S,m[$],k);if(J===null){S===null&&(S=q);break}e&&S&&J.alternate===null&&t(f,S),g=a(J,g,$),C===null?j=J:C.sibling=J,C=J,S=q}if($===m.length)return r(f,S),de&&Lr(f,$),j;if(S===null){for(;$<m.length;$++)S=h(f,m[$],k),S!==null&&(g=a(S,g,$),C===null?j=S:C.sibling=S,C=S);return de&&Lr(f,$),j}for(S=n(f,S);$<m.length;$++)q=v(S,f,$,m[$],k),q!==null&&(e&&q.alternate!==null&&S.delete(q.key===null?$:q.key),g=a(q,g,$),C===null?j=q:C.sibling=q,C=q);return e&&S.forEach(function(we){return t(f,we)}),de&&Lr(f,$),j}function x(f,g,m,k){var j=Vn(m);if(typeof j!="function")throw Error(A(150));if(m=j.call(m),m==null)throw Error(A(151));for(var C=j=null,S=g,$=g=0,q=null,J=m.next();S!==null&&!J.done;$++,J=m.next()){S.index>$?(q=S,S=null):q=S.sibling;var we=p(f,S,J.value,k);if(we===null){S===null&&(S=q);break}e&&S&&we.alternate===null&&t(f,S),g=a(we,g,$),C===null?j=we:C.sibling=we,C=we,S=q}if(J.done)return r(f,S),de&&Lr(f,$),j;if(S===null){for(;!J.done;$++,J=m.next())J=h(f,J.value,k),J!==null&&(g=a(J,g,$),C===null?j=J:C.sibling=J,C=J);return de&&Lr(f,$),j}for(S=n(f,S);!J.done;$++,J=m.next())J=v(S,f,$,J.value,k),J!==null&&(e&&J.alternate!==null&&S.delete(J.key===null?$:J.key),g=a(J,g,$),C===null?j=J:C.sibling=J,C=J);return e&&S.forEach(function(z){return t(f,z)}),de&&Lr(f,$),j}function N(f,g,m,k){if(typeof m=="object"&&m!==null&&m.type===hn&&m.key===null&&(m=m.props.children),typeof m=="object"&&m!==null){switch(m.$$typeof){case Qs:e:{for(var j=m.key,C=g;C!==null;){if(C.key===j){if(j=m.type,j===hn){if(C.tag===7){r(f,C.sibling),g=s(C,m.props.children),g.return=f,f=g;break e}}else if(C.elementType===j||typeof j=="object"&&j!==null&&j.$$typeof===cr&&Lu(j)===C.type){r(f,C.sibling),g=s(C,m.props),g.ref=Yn(f,C,m),g.return=f,f=g;break e}r(f,C);break}else t(f,C);C=C.sibling}m.type===hn?(g=Hr(m.props.children,f.mode,k,m.key),g.return=f,f=g):(k=Ia(m.type,m.key,m.props,null,f.mode,k),k.ref=Yn(f,g,m),k.return=f,f=k)}return o(f);case dn:e:{for(C=m.key;g!==null;){if(g.key===C)if(g.tag===4&&g.stateNode.containerInfo===m.containerInfo&&g.stateNode.implementation===m.implementation){r(f,g.sibling),g=s(g,m.children||[]),g.return=f,f=g;break e}else{r(f,g);break}else t(f,g);g=g.sibling}g=io(m,f.mode,k),g.return=f,f=g}return o(f);case cr:return C=m._init,N(f,g,C(m._payload),k)}if(rs(m))return y(f,g,m,k);if(Vn(m))return x(f,g,m,k);la(f,m)}return typeof m=="string"&&m!==""||typeof m=="number"?(m=""+m,g!==null&&g.tag===6?(r(f,g.sibling),g=s(g,m),g.return=f,f=g):(r(f,g),g=ao(m,f.mode,k),g.return=f,f=g),o(f)):r(f,g)}return N}var $n=op(!0),lp=op(!1),Xa=Ar(null),Za=null,kn=null,Yl=null;function Ql(){Yl=kn=Za=null}function Xl(e){var t=Xa.current;ue(Xa),e._currentValue=t}function Jo(e,t,r){for(;e!==null;){var n=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,n!==null&&(n.childLanes|=t)):n!==null&&(n.childLanes&t)!==t&&(n.childLanes|=t),e===r)break;e=e.return}}function Cn(e,t){Za=e,Yl=kn=null,e=e.dependencies,e!==null&&e.firstContext!==null&&(e.lanes&t&&(Xe=!0),e.firstContext=null)}function vt(e){var t=e._currentValue;if(Yl!==e)if(e={context:e,memoizedValue:t,next:null},kn===null){if(Za===null)throw Error(A(308));kn=e,Za.dependencies={lanes:0,firstContext:e}}else kn=kn.next=e;return t}var Dr=null;function Zl(e){Dr===null?Dr=[e]:Dr.push(e)}function cp(e,t,r,n){var s=t.interleaved;return s===null?(r.next=r,Zl(t)):(r.next=s.next,s.next=r),t.interleaved=r,Zt(e,n)}function Zt(e,t){e.lanes|=t;var r=e.alternate;for(r!==null&&(r.lanes|=t),r=e,e=e.return;e!==null;)e.childLanes|=t,r=e.alternate,r!==null&&(r.childLanes|=t),r=e,e=e.return;return r.tag===3?r.stateNode:null}var ur=!1;function ec(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function up(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,effects:e.effects})}function Yt(e,t){return{eventTime:e,lane:t,tag:0,payload:null,callback:null,next:null}}function _r(e,t,r){var n=e.updateQueue;if(n===null)return null;if(n=n.shared,te&2){var s=n.pending;return s===null?t.next=t:(t.next=s.next,s.next=t),n.pending=t,Zt(e,r)}return s=n.interleaved,s===null?(t.next=t,Zl(n)):(t.next=s.next,s.next=t),n.interleaved=t,Zt(e,r)}function Aa(e,t,r){if(t=t.updateQueue,t!==null&&(t=t.shared,(r&4194240)!==0)){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,Dl(e,r)}}function $u(e,t){var r=e.updateQueue,n=e.alternate;if(n!==null&&(n=n.updateQueue,r===n)){var s=null,a=null;if(r=r.firstBaseUpdate,r!==null){do{var o={eventTime:r.eventTime,lane:r.lane,tag:r.tag,payload:r.payload,callback:r.callback,next:null};a===null?s=a=o:a=a.next=o,r=r.next}while(r!==null);a===null?s=a=t:a=a.next=t}else s=a=t;r={baseState:n.baseState,firstBaseUpdate:s,lastBaseUpdate:a,shared:n.shared,effects:n.effects},e.updateQueue=r;return}e=r.lastBaseUpdate,e===null?r.firstBaseUpdate=t:e.next=t,r.lastBaseUpdate=t}function ei(e,t,r,n){var s=e.updateQueue;ur=!1;var a=s.firstBaseUpdate,o=s.lastBaseUpdate,l=s.shared.pending;if(l!==null){s.shared.pending=null;var c=l,u=c.next;c.next=null,o===null?a=u:o.next=u,o=c;var d=e.alternate;d!==null&&(d=d.updateQueue,l=d.lastBaseUpdate,l!==o&&(l===null?d.firstBaseUpdate=u:l.next=u,d.lastBaseUpdate=c))}if(a!==null){var h=s.baseState;o=0,d=u=c=null,l=a;do{var p=l.lane,v=l.eventTime;if((n&p)===p){d!==null&&(d=d.next={eventTime:v,lane:0,tag:l.tag,payload:l.payload,callback:l.callback,next:null});e:{var y=e,x=l;switch(p=t,v=r,x.tag){case 1:if(y=x.payload,typeof y=="function"){h=y.call(v,h,p);break e}h=y;break e;case 3:y.flags=y.flags&-65537|128;case 0:if(y=x.payload,p=typeof y=="function"?y.call(v,h,p):y,p==null)break e;h=me({},h,p);break e;case 2:ur=!0}}l.callback!==null&&l.lane!==0&&(e.flags|=64,p=s.effects,p===null?s.effects=[l]:p.push(l))}else v={eventTime:v,lane:p,tag:l.tag,payload:l.payload,callback:l.callback,next:null},d===null?(u=d=v,c=h):d=d.next=v,o|=p;if(l=l.next,l===null){if(l=s.shared.pending,l===null)break;p=l,l=p.next,p.next=null,s.lastBaseUpdate=p,s.shared.pending=null}}while(!0);if(d===null&&(c=h),s.baseState=c,s.firstBaseUpdate=u,s.lastBaseUpdate=d,t=s.shared.interleaved,t!==null){s=t;do o|=s.lane,s=s.next;while(s!==t)}else a===null&&(s.shared.lanes=0);Gr|=o,e.lanes=o,e.memoizedState=h}}function Iu(e,t,r){if(e=t.effects,t.effects=null,e!==null)for(t=0;t<e.length;t++){var n=e[t],s=n.callback;if(s!==null){if(n.callback=null,n=r,typeof s!="function")throw Error(A(191,s));s.call(n)}}}var Ks={},Mt=Ar(Ks),As=Ar(Ks),Rs=Ar(Ks);function Fr(e){if(e===Ks)throw Error(A(174));return e}function tc(e,t){switch(oe(Rs,t),oe(As,e),oe(Mt,Ks),e=t.nodeType,e){case 9:case 11:t=(t=t.documentElement)?t.namespaceURI:Co(null,"");break;default:e=e===8?t.parentNode:t,t=e.namespaceURI||null,e=e.tagName,t=Co(t,e)}ue(Mt),oe(Mt,t)}function In(){ue(Mt),ue(As),ue(Rs)}function dp(e){Fr(Rs.current);var t=Fr(Mt.current),r=Co(t,e.type);t!==r&&(oe(As,e),oe(Mt,r))}function rc(e){As.current===e&&(ue(Mt),ue(As))}var fe=Ar(0);function ti(e){for(var t=e;t!==null;){if(t.tag===13){var r=t.memoizedState;if(r!==null&&(r=r.dehydrated,r===null||r.data==="$?"||r.data==="$!"))return t}else if(t.tag===19&&t.memoizedProps.revealOrder!==void 0){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var Zi=[];function nc(){for(var e=0;e<Zi.length;e++)Zi[e]._workInProgressVersionPrimary=null;Zi.length=0}var Ra=tr.ReactCurrentDispatcher,eo=tr.ReactCurrentBatchConfig,Kr=0,ge=null,Ee=null,Ce=null,ri=!1,hs=!1,Ps=0,Rm=0;function Ue(){throw Error(A(321))}function sc(e,t){if(t===null)return!1;for(var r=0;r<t.length&&r<e.length;r++)if(!Rt(e[r],t[r]))return!1;return!0}function ac(e,t,r,n,s,a){if(Kr=a,ge=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,Ra.current=e===null||e.memoizedState===null?$m:Im,e=r(n,s),hs){a=0;do{if(hs=!1,Ps=0,25<=a)throw Error(A(301));a+=1,Ce=Ee=null,t.updateQueue=null,Ra.current=Um,e=r(n,s)}while(hs)}if(Ra.current=ni,t=Ee!==null&&Ee.next!==null,Kr=0,Ce=Ee=ge=null,ri=!1,t)throw Error(A(300));return e}function ic(){var e=Ps!==0;return Ps=0,e}function It(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ce===null?ge.memoizedState=Ce=e:Ce=Ce.next=e,Ce}function yt(){if(Ee===null){var e=ge.alternate;e=e!==null?e.memoizedState:null}else e=Ee.next;var t=Ce===null?ge.memoizedState:Ce.next;if(t!==null)Ce=t,Ee=e;else{if(e===null)throw Error(A(310));Ee=e,e={memoizedState:Ee.memoizedState,baseState:Ee.baseState,baseQueue:Ee.baseQueue,queue:Ee.queue,next:null},Ce===null?ge.memoizedState=Ce=e:Ce=Ce.next=e}return Ce}function Os(e,t){return typeof t=="function"?t(e):t}function to(e){var t=yt(),r=t.queue;if(r===null)throw Error(A(311));r.lastRenderedReducer=e;var n=Ee,s=n.baseQueue,a=r.pending;if(a!==null){if(s!==null){var o=s.next;s.next=a.next,a.next=o}n.baseQueue=s=a,r.pending=null}if(s!==null){a=s.next,n=n.baseState;var l=o=null,c=null,u=a;do{var d=u.lane;if((Kr&d)===d)c!==null&&(c=c.next={lane:0,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),n=u.hasEagerState?u.eagerState:e(n,u.action);else{var h={lane:d,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null};c===null?(l=c=h,o=n):c=c.next=h,ge.lanes|=d,Gr|=d}u=u.next}while(u!==null&&u!==a);c===null?o=n:c.next=l,Rt(n,t.memoizedState)||(Xe=!0),t.memoizedState=n,t.baseState=o,t.baseQueue=c,r.lastRenderedState=n}if(e=r.interleaved,e!==null){s=e;do a=s.lane,ge.lanes|=a,Gr|=a,s=s.next;while(s!==e)}else s===null&&(r.lanes=0);return[t.memoizedState,r.dispatch]}function ro(e){var t=yt(),r=t.queue;if(r===null)throw Error(A(311));r.lastRenderedReducer=e;var n=r.dispatch,s=r.pending,a=t.memoizedState;if(s!==null){r.pending=null;var o=s=s.next;do a=e(a,o.action),o=o.next;while(o!==s);Rt(a,t.memoizedState)||(Xe=!0),t.memoizedState=a,t.baseQueue===null&&(t.baseState=a),r.lastRenderedState=a}return[a,n]}function hp(){}function pp(e,t){var r=ge,n=yt(),s=t(),a=!Rt(n.memoizedState,s);if(a&&(n.memoizedState=s,Xe=!0),n=n.queue,oc(mp.bind(null,r,n,e),[e]),n.getSnapshot!==t||a||Ce!==null&&Ce.memoizedState.tag&1){if(r.flags|=2048,Ls(9,gp.bind(null,r,n,s,t),void 0,null),Ae===null)throw Error(A(349));Kr&30||fp(r,t,s)}return s}function fp(e,t,r){e.flags|=16384,e={getSnapshot:t,value:r},t=ge.updateQueue,t===null?(t={lastEffect:null,stores:null},ge.updateQueue=t,t.stores=[e]):(r=t.stores,r===null?t.stores=[e]:r.push(e))}function gp(e,t,r,n){t.value=r,t.getSnapshot=n,vp(t)&&yp(e)}function mp(e,t,r){return r(function(){vp(t)&&yp(e)})}function vp(e){var t=e.getSnapshot;e=e.value;try{var r=t();return!Rt(e,r)}catch{return!0}}function yp(e){var t=Zt(e,1);t!==null&&At(t,e,1,-1)}function Uu(e){var t=It();return typeof e=="function"&&(e=e()),t.memoizedState=t.baseState=e,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Os,lastRenderedState:e},t.queue=e,e=e.dispatch=Lm.bind(null,ge,e),[t.memoizedState,e]}function Ls(e,t,r,n){return e={tag:e,create:t,destroy:r,deps:n,next:null},t=ge.updateQueue,t===null?(t={lastEffect:null,stores:null},ge.updateQueue=t,t.lastEffect=e.next=e):(r=t.lastEffect,r===null?t.lastEffect=e.next=e:(n=r.next,r.next=e,e.next=n,t.lastEffect=e)),e}function xp(){return yt().memoizedState}function Pa(e,t,r,n){var s=It();ge.flags|=e,s.memoizedState=Ls(1|t,r,void 0,n===void 0?null:n)}function bi(e,t,r,n){var s=yt();n=n===void 0?null:n;var a=void 0;if(Ee!==null){var o=Ee.memoizedState;if(a=o.destroy,n!==null&&sc(n,o.deps)){s.memoizedState=Ls(t,r,a,n);return}}ge.flags|=e,s.memoizedState=Ls(1|t,r,a,n)}function zu(e,t){return Pa(8390656,8,e,t)}function oc(e,t){return bi(2048,8,e,t)}function kp(e,t){return bi(4,2,e,t)}function bp(e,t){return bi(4,4,e,t)}function wp(e,t){if(typeof t=="function")return e=e(),t(e),function(){t(null)};if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function _p(e,t,r){return r=r!=null?r.concat([e]):null,bi(4,4,wp.bind(null,t,e),r)}function lc(){}function jp(e,t){var r=yt();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&sc(t,n[1])?n[0]:(r.memoizedState=[e,t],e)}function Sp(e,t){var r=yt();t=t===void 0?null:t;var n=r.memoizedState;return n!==null&&t!==null&&sc(t,n[1])?n[0]:(e=e(),r.memoizedState=[e,t],e)}function Np(e,t,r){return Kr&21?(Rt(r,t)||(r=Rh(),ge.lanes|=r,Gr|=r,e.baseState=!0),t):(e.baseState&&(e.baseState=!1,Xe=!0),e.memoizedState=r)}function Pm(e,t){var r=se;se=r!==0&&4>r?r:4,e(!0);var n=eo.transition;eo.transition={};try{e(!1),t()}finally{se=r,eo.transition=n}}function Ep(){return yt().memoizedState}function Om(e,t,r){var n=Sr(e);if(r={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null},Tp(e))Cp(t,r);else if(r=cp(e,t,r,n),r!==null){var s=Ke();At(r,e,n,s),Ap(r,t,n)}}function Lm(e,t,r){var n=Sr(e),s={lane:n,action:r,hasEagerState:!1,eagerState:null,next:null};if(Tp(e))Cp(t,s);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,l=a(o,r);if(s.hasEagerState=!0,s.eagerState=l,Rt(l,o)){var c=t.interleaved;c===null?(s.next=s,Zl(t)):(s.next=c.next,c.next=s),t.interleaved=s;return}}catch{}finally{}r=cp(e,t,s,n),r!==null&&(s=Ke(),At(r,e,n,s),Ap(r,t,n))}}function Tp(e){var t=e.alternate;return e===ge||t!==null&&t===ge}function Cp(e,t){hs=ri=!0;var r=e.pending;r===null?t.next=t:(t.next=r.next,r.next=t),e.pending=t}function Ap(e,t,r){if(r&4194240){var n=t.lanes;n&=e.pendingLanes,r|=n,t.lanes=r,Dl(e,r)}}var ni={readContext:vt,useCallback:Ue,useContext:Ue,useEffect:Ue,useImperativeHandle:Ue,useInsertionEffect:Ue,useLayoutEffect:Ue,useMemo:Ue,useReducer:Ue,useRef:Ue,useState:Ue,useDebugValue:Ue,useDeferredValue:Ue,useTransition:Ue,useMutableSource:Ue,useSyncExternalStore:Ue,useId:Ue,unstable_isNewReconciler:!1},$m={readContext:vt,useCallback:function(e,t){return It().memoizedState=[e,t===void 0?null:t],e},useContext:vt,useEffect:zu,useImperativeHandle:function(e,t,r){return r=r!=null?r.concat([e]):null,Pa(4194308,4,wp.bind(null,t,e),r)},useLayoutEffect:function(e,t){return Pa(4194308,4,e,t)},useInsertionEffect:function(e,t){return Pa(4,2,e,t)},useMemo:function(e,t){var r=It();return t=t===void 0?null:t,e=e(),r.memoizedState=[e,t],e},useReducer:function(e,t,r){var n=It();return t=r!==void 0?r(t):t,n.memoizedState=n.baseState=t,e={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:t},n.queue=e,e=e.dispatch=Om.bind(null,ge,e),[n.memoizedState,e]},useRef:function(e){var t=It();return e={current:e},t.memoizedState=e},useState:Uu,useDebugValue:lc,useDeferredValue:function(e){return It().memoizedState=e},useTransition:function(){var e=Uu(!1),t=e[0];return e=Pm.bind(null,e[1]),It().memoizedState=e,[t,e]},useMutableSource:function(){},useSyncExternalStore:function(e,t,r){var n=ge,s=It();if(de){if(r===void 0)throw Error(A(407));r=r()}else{if(r=t(),Ae===null)throw Error(A(349));Kr&30||fp(n,t,r)}s.memoizedState=r;var a={value:r,getSnapshot:t};return s.queue=a,zu(mp.bind(null,n,a,e),[e]),n.flags|=2048,Ls(9,gp.bind(null,n,a,r,t),void 0,null),r},useId:function(){var e=It(),t=Ae.identifierPrefix;if(de){var r=Jt,n=Gt;r=(n&~(1<<32-Ct(n)-1)).toString(32)+r,t=":"+t+"R"+r,r=Ps++,0<r&&(t+="H"+r.toString(32)),t+=":"}else r=Rm++,t=":"+t+"r"+r.toString(32)+":";return e.memoizedState=t},unstable_isNewReconciler:!1},Im={readContext:vt,useCallback:jp,useContext:vt,useEffect:oc,useImperativeHandle:_p,useInsertionEffect:kp,useLayoutEffect:bp,useMemo:Sp,useReducer:to,useRef:xp,useState:function(){return to(Os)},useDebugValue:lc,useDeferredValue:function(e){var t=yt();return Np(t,Ee.memoizedState,e)},useTransition:function(){var e=to(Os)[0],t=yt().memoizedState;return[e,t]},useMutableSource:hp,useSyncExternalStore:pp,useId:Ep,unstable_isNewReconciler:!1},Um={readContext:vt,useCallback:jp,useContext:vt,useEffect:oc,useImperativeHandle:_p,useInsertionEffect:kp,useLayoutEffect:bp,useMemo:Sp,useReducer:ro,useRef:xp,useState:function(){return ro(Os)},useDebugValue:lc,useDeferredValue:function(e){var t=yt();return Ee===null?t.memoizedState=e:Np(t,Ee.memoizedState,e)},useTransition:function(){var e=ro(Os)[0],t=yt().memoizedState;return[e,t]},useMutableSource:hp,useSyncExternalStore:pp,useId:Ep,unstable_isNewReconciler:!1};function St(e,t){if(e&&e.defaultProps){t=me({},t),e=e.defaultProps;for(var r in e)t[r]===void 0&&(t[r]=e[r]);return t}return t}function Yo(e,t,r,n){t=e.memoizedState,r=r(n,t),r=r==null?t:me({},t,r),e.memoizedState=r,e.lanes===0&&(e.updateQueue.baseState=r)}var wi={isMounted:function(e){return(e=e._reactInternals)?Qr(e)===e:!1},enqueueSetState:function(e,t,r){e=e._reactInternals;var n=Ke(),s=Sr(e),a=Yt(n,s);a.payload=t,r!=null&&(a.callback=r),t=_r(e,a,s),t!==null&&(At(t,e,s,n),Aa(t,e,s))},enqueueReplaceState:function(e,t,r){e=e._reactInternals;var n=Ke(),s=Sr(e),a=Yt(n,s);a.tag=1,a.payload=t,r!=null&&(a.callback=r),t=_r(e,a,s),t!==null&&(At(t,e,s,n),Aa(t,e,s))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var r=Ke(),n=Sr(e),s=Yt(r,n);s.tag=2,t!=null&&(s.callback=t),t=_r(e,s,n),t!==null&&(At(t,e,n,r),Aa(t,e,n))}};function Du(e,t,r,n,s,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(n,a,o):t.prototype&&t.prototype.isPureReactComponent?!Ns(r,n)||!Ns(s,a):!0}function Rp(e,t,r){var n=!1,s=Tr,a=t.contextType;return typeof a=="object"&&a!==null?a=vt(a):(s=et(t)?Vr:Be.current,n=t.contextTypes,a=(n=n!=null)?On(e,s):Tr),t=new t(r,a),e.memoizedState=t.state!==null&&t.state!==void 0?t.state:null,t.updater=wi,e.stateNode=t,t._reactInternals=e,n&&(e=e.stateNode,e.__reactInternalMemoizedUnmaskedChildContext=s,e.__reactInternalMemoizedMaskedChildContext=a),t}function Fu(e,t,r,n){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(r,n),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(r,n),t.state!==e&&wi.enqueueReplaceState(t,t.state,null)}function Qo(e,t,r,n){var s=e.stateNode;s.props=r,s.state=e.memoizedState,s.refs={},ec(e);var a=t.contextType;typeof a=="object"&&a!==null?s.context=vt(a):(a=et(t)?Vr:Be.current,s.context=On(e,a)),s.state=e.memoizedState,a=t.getDerivedStateFromProps,typeof a=="function"&&(Yo(e,t,a,r),s.state=e.memoizedState),typeof t.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(t=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),t!==s.state&&wi.enqueueReplaceState(s,s.state,null),ei(e,r,s,n),s.state=e.memoizedState),typeof s.componentDidMount=="function"&&(e.flags|=4194308)}function Un(e,t){try{var r="",n=t;do r+=dg(n),n=n.return;while(n);var s=r}catch(a){s=`
Error generating stack: `+a.message+`
`+a.stack}return{value:e,source:t,stack:s,digest:null}}function no(e,t,r){return{value:e,source:null,stack:r??null,digest:t??null}}function Xo(e,t){try{console.error(t.value)}catch(r){setTimeout(function(){throw r})}}var zm=typeof WeakMap=="function"?WeakMap:Map;function Pp(e,t,r){r=Yt(-1,r),r.tag=3,r.payload={element:null};var n=t.value;return r.callback=function(){ai||(ai=!0,ll=n),Xo(e,t)},r}function Op(e,t,r){r=Yt(-1,r),r.tag=3;var n=e.type.getDerivedStateFromError;if(typeof n=="function"){var s=t.value;r.payload=function(){return n(s)},r.callback=function(){Xo(e,t)}}var a=e.stateNode;return a!==null&&typeof a.componentDidCatch=="function"&&(r.callback=function(){Xo(e,t),typeof n!="function"&&(jr===null?jr=new Set([this]):jr.add(this));var o=t.stack;this.componentDidCatch(t.value,{componentStack:o!==null?o:""})}),r}function Mu(e,t,r){var n=e.pingCache;if(n===null){n=e.pingCache=new zm;var s=new Set;n.set(t,s)}else s=n.get(t),s===void 0&&(s=new Set,n.set(t,s));s.has(r)||(s.add(r),e=Xm.bind(null,e,t,r),t.then(e,e))}function Bu(e){do{var t;if((t=e.tag===13)&&(t=e.memoizedState,t=t!==null?t.dehydrated!==null:!0),t)return e;e=e.return}while(e!==null);return null}function Wu(e,t,r,n,s){return e.mode&1?(e.flags|=65536,e.lanes=s,e):(e===t?e.flags|=65536:(e.flags|=128,r.flags|=131072,r.flags&=-52805,r.tag===1&&(r.alternate===null?r.tag=17:(t=Yt(-1,1),t.tag=2,_r(r,t,1))),r.lanes|=1),e)}var Dm=tr.ReactCurrentOwner,Xe=!1;function qe(e,t,r,n){t.child=e===null?lp(t,null,r,n):$n(t,e.child,r,n)}function Hu(e,t,r,n,s){r=r.render;var a=t.ref;return Cn(t,s),n=ac(e,t,r,n,a,s),r=ic(),e!==null&&!Xe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,er(e,t,s)):(de&&r&&Kl(t),t.flags|=1,qe(e,t,n,s),t.child)}function Vu(e,t,r,n,s){if(e===null){var a=r.type;return typeof a=="function"&&!mc(a)&&a.defaultProps===void 0&&r.compare===null&&r.defaultProps===void 0?(t.tag=15,t.type=a,Lp(e,t,a,n,s)):(e=Ia(r.type,null,n,t,t.mode,s),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!(e.lanes&s)){var o=a.memoizedProps;if(r=r.compare,r=r!==null?r:Ns,r(o,n)&&e.ref===t.ref)return er(e,t,s)}return t.flags|=1,e=Nr(a,n),e.ref=t.ref,e.return=t,t.child=e}function Lp(e,t,r,n,s){if(e!==null){var a=e.memoizedProps;if(Ns(a,n)&&e.ref===t.ref)if(Xe=!1,t.pendingProps=n=a,(e.lanes&s)!==0)e.flags&131072&&(Xe=!0);else return t.lanes=e.lanes,er(e,t,s)}return Zo(e,t,r,n,s)}function $p(e,t,r){var n=t.pendingProps,s=n.children,a=e!==null?e.memoizedState:null;if(n.mode==="hidden")if(!(t.mode&1))t.memoizedState={baseLanes:0,cachePool:null,transitions:null},oe(wn,nt),nt|=r;else{if(!(r&1073741824))return e=a!==null?a.baseLanes|r:r,t.lanes=t.childLanes=1073741824,t.memoizedState={baseLanes:e,cachePool:null,transitions:null},t.updateQueue=null,oe(wn,nt),nt|=e,null;t.memoizedState={baseLanes:0,cachePool:null,transitions:null},n=a!==null?a.baseLanes:r,oe(wn,nt),nt|=n}else a!==null?(n=a.baseLanes|r,t.memoizedState=null):n=r,oe(wn,nt),nt|=n;return qe(e,t,s,r),t.child}function Ip(e,t){var r=t.ref;(e===null&&r!==null||e!==null&&e.ref!==r)&&(t.flags|=512,t.flags|=2097152)}function Zo(e,t,r,n,s){var a=et(r)?Vr:Be.current;return a=On(t,a),Cn(t,s),r=ac(e,t,r,n,a,s),n=ic(),e!==null&&!Xe?(t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~s,er(e,t,s)):(de&&n&&Kl(t),t.flags|=1,qe(e,t,r,s),t.child)}function qu(e,t,r,n,s){if(et(r)){var a=!0;Ja(t)}else a=!1;if(Cn(t,s),t.stateNode===null)Oa(e,t),Rp(t,r,n),Qo(t,r,n,s),n=!0;else if(e===null){var o=t.stateNode,l=t.memoizedProps;o.props=l;var c=o.context,u=r.contextType;typeof u=="object"&&u!==null?u=vt(u):(u=et(r)?Vr:Be.current,u=On(t,u));var d=r.getDerivedStateFromProps,h=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function";h||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==n||c!==u)&&Fu(t,o,n,u),ur=!1;var p=t.memoizedState;o.state=p,ei(t,n,o,s),c=t.memoizedState,l!==n||p!==c||Ze.current||ur?(typeof d=="function"&&(Yo(t,r,d,n),c=t.memoizedState),(l=ur||Du(t,r,l,n,p,c,u))?(h||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=n,t.memoizedState=c),o.props=n,o.state=c,o.context=u,n=l):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),n=!1)}else{o=t.stateNode,up(e,t),l=t.memoizedProps,u=t.type===t.elementType?l:St(t.type,l),o.props=u,h=t.pendingProps,p=o.context,c=r.contextType,typeof c=="object"&&c!==null?c=vt(c):(c=et(r)?Vr:Be.current,c=On(t,c));var v=r.getDerivedStateFromProps;(d=typeof v=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==h||p!==c)&&Fu(t,o,n,c),ur=!1,p=t.memoizedState,o.state=p,ei(t,n,o,s);var y=t.memoizedState;l!==h||p!==y||Ze.current||ur?(typeof v=="function"&&(Yo(t,r,v,n),y=t.memoizedState),(u=ur||Du(t,r,u,n,p,y,c)||!1)?(d||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(n,y,c),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(n,y,c)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||l===e.memoizedProps&&p===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===e.memoizedProps&&p===e.memoizedState||(t.flags|=1024),t.memoizedProps=n,t.memoizedState=y),o.props=n,o.state=y,o.context=c,n=u):(typeof o.componentDidUpdate!="function"||l===e.memoizedProps&&p===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===e.memoizedProps&&p===e.memoizedState||(t.flags|=1024),n=!1)}return el(e,t,r,n,a,s)}function el(e,t,r,n,s,a){Ip(e,t);var o=(t.flags&128)!==0;if(!n&&!o)return s&&Ru(t,r,!1),er(e,t,a);n=t.stateNode,Dm.current=t;var l=o&&typeof r.getDerivedStateFromError!="function"?null:n.render();return t.flags|=1,e!==null&&o?(t.child=$n(t,e.child,null,a),t.child=$n(t,null,l,a)):qe(e,t,l,a),t.memoizedState=n.state,s&&Ru(t,r,!0),t.child}function Up(e){var t=e.stateNode;t.pendingContext?Au(e,t.pendingContext,t.pendingContext!==t.context):t.context&&Au(e,t.context,!1),tc(e,t.containerInfo)}function Ku(e,t,r,n,s){return Ln(),Jl(s),t.flags|=256,qe(e,t,r,n),t.child}var tl={dehydrated:null,treeContext:null,retryLane:0};function rl(e){return{baseLanes:e,cachePool:null,transitions:null}}function zp(e,t,r){var n=t.pendingProps,s=fe.current,a=!1,o=(t.flags&128)!==0,l;if((l=o)||(l=e!==null&&e.memoizedState===null?!1:(s&2)!==0),l?(a=!0,t.flags&=-129):(e===null||e.memoizedState!==null)&&(s|=1),oe(fe,s&1),e===null)return Go(t),e=t.memoizedState,e!==null&&(e=e.dehydrated,e!==null)?(t.mode&1?e.data==="$!"?t.lanes=8:t.lanes=1073741824:t.lanes=1,null):(o=n.children,e=n.fallback,a?(n=t.mode,a=t.child,o={mode:"hidden",children:o},!(n&1)&&a!==null?(a.childLanes=0,a.pendingProps=o):a=Si(o,n,0,null),e=Hr(e,n,r,null),a.return=t,e.return=t,a.sibling=e,t.child=a,t.child.memoizedState=rl(r),t.memoizedState=tl,e):cc(t,o));if(s=e.memoizedState,s!==null&&(l=s.dehydrated,l!==null))return Fm(e,t,o,n,l,s,r);if(a){a=n.fallback,o=t.mode,s=e.child,l=s.sibling;var c={mode:"hidden",children:n.children};return!(o&1)&&t.child!==s?(n=t.child,n.childLanes=0,n.pendingProps=c,t.deletions=null):(n=Nr(s,c),n.subtreeFlags=s.subtreeFlags&14680064),l!==null?a=Nr(l,a):(a=Hr(a,o,r,null),a.flags|=2),a.return=t,n.return=t,n.sibling=a,t.child=n,n=a,a=t.child,o=e.child.memoizedState,o=o===null?rl(r):{baseLanes:o.baseLanes|r,cachePool:null,transitions:o.transitions},a.memoizedState=o,a.childLanes=e.childLanes&~r,t.memoizedState=tl,n}return a=e.child,e=a.sibling,n=Nr(a,{mode:"visible",children:n.children}),!(t.mode&1)&&(n.lanes=r),n.return=t,n.sibling=null,e!==null&&(r=t.deletions,r===null?(t.deletions=[e],t.flags|=16):r.push(e)),t.child=n,t.memoizedState=null,n}function cc(e,t){return t=Si({mode:"visible",children:t},e.mode,0,null),t.return=e,e.child=t}function ca(e,t,r,n){return n!==null&&Jl(n),$n(t,e.child,null,r),e=cc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Fm(e,t,r,n,s,a,o){if(r)return t.flags&256?(t.flags&=-257,n=no(Error(A(422))),ca(e,t,o,n)):t.memoizedState!==null?(t.child=e.child,t.flags|=128,null):(a=n.fallback,s=t.mode,n=Si({mode:"visible",children:n.children},s,0,null),a=Hr(a,s,o,null),a.flags|=2,n.return=t,a.return=t,n.sibling=a,t.child=n,t.mode&1&&$n(t,e.child,null,o),t.child.memoizedState=rl(o),t.memoizedState=tl,a);if(!(t.mode&1))return ca(e,t,o,null);if(s.data==="$!"){if(n=s.nextSibling&&s.nextSibling.dataset,n)var l=n.dgst;return n=l,a=Error(A(419)),n=no(a,n,void 0),ca(e,t,o,n)}if(l=(o&e.childLanes)!==0,Xe||l){if(n=Ae,n!==null){switch(o&-o){case 4:s=2;break;case 16:s=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:s=32;break;case 536870912:s=268435456;break;default:s=0}s=s&(n.suspendedLanes|o)?0:s,s!==0&&s!==a.retryLane&&(a.retryLane=s,Zt(e,s),At(n,e,s,-1))}return gc(),n=no(Error(A(421))),ca(e,t,o,n)}return s.data==="$?"?(t.flags|=128,t.child=e.child,t=Zm.bind(null,e),s._reactRetry=t,null):(e=a.treeContext,at=wr(s.nextSibling),it=t,de=!0,Tt=null,e!==null&&(pt[ft++]=Gt,pt[ft++]=Jt,pt[ft++]=qr,Gt=e.id,Jt=e.overflow,qr=t),t=cc(t,n.children),t.flags|=4096,t)}function Gu(e,t,r){e.lanes|=t;var n=e.alternate;n!==null&&(n.lanes|=t),Jo(e.return,t,r)}function so(e,t,r,n,s){var a=e.memoizedState;a===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:n,tail:r,tailMode:s}:(a.isBackwards=t,a.rendering=null,a.renderingStartTime=0,a.last=n,a.tail=r,a.tailMode=s)}function Dp(e,t,r){var n=t.pendingProps,s=n.revealOrder,a=n.tail;if(qe(e,t,n.children,r),n=fe.current,n&2)n=n&1|2,t.flags|=128;else{if(e!==null&&e.flags&128)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Gu(e,r,t);else if(e.tag===19)Gu(e,r,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}n&=1}if(oe(fe,n),!(t.mode&1))t.memoizedState=null;else switch(s){case"forwards":for(r=t.child,s=null;r!==null;)e=r.alternate,e!==null&&ti(e)===null&&(s=r),r=r.sibling;r=s,r===null?(s=t.child,t.child=null):(s=r.sibling,r.sibling=null),so(t,!1,s,r,a);break;case"backwards":for(r=null,s=t.child,t.child=null;s!==null;){if(e=s.alternate,e!==null&&ti(e)===null){t.child=s;break}e=s.sibling,s.sibling=r,r=s,s=e}so(t,!0,r,null,a);break;case"together":so(t,!1,null,null,void 0);break;default:t.memoizedState=null}return t.child}function Oa(e,t){!(t.mode&1)&&e!==null&&(e.alternate=null,t.alternate=null,t.flags|=2)}function er(e,t,r){if(e!==null&&(t.dependencies=e.dependencies),Gr|=t.lanes,!(r&t.childLanes))return null;if(e!==null&&t.child!==e.child)throw Error(A(153));if(t.child!==null){for(e=t.child,r=Nr(e,e.pendingProps),t.child=r,r.return=t;e.sibling!==null;)e=e.sibling,r=r.sibling=Nr(e,e.pendingProps),r.return=t;r.sibling=null}return t.child}function Mm(e,t,r){switch(t.tag){case 3:Up(t),Ln();break;case 5:dp(t);break;case 1:et(t.type)&&Ja(t);break;case 4:tc(t,t.stateNode.containerInfo);break;case 10:var n=t.type._context,s=t.memoizedProps.value;oe(Xa,n._currentValue),n._currentValue=s;break;case 13:if(n=t.memoizedState,n!==null)return n.dehydrated!==null?(oe(fe,fe.current&1),t.flags|=128,null):r&t.child.childLanes?zp(e,t,r):(oe(fe,fe.current&1),e=er(e,t,r),e!==null?e.sibling:null);oe(fe,fe.current&1);break;case 19:if(n=(r&t.childLanes)!==0,e.flags&128){if(n)return Dp(e,t,r);t.flags|=128}if(s=t.memoizedState,s!==null&&(s.rendering=null,s.tail=null,s.lastEffect=null),oe(fe,fe.current),n)break;return null;case 22:case 23:return t.lanes=0,$p(e,t,r)}return er(e,t,r)}var Fp,nl,Mp,Bp;Fp=function(e,t){for(var r=t.child;r!==null;){if(r.tag===5||r.tag===6)e.appendChild(r.stateNode);else if(r.tag!==4&&r.child!==null){r.child.return=r,r=r.child;continue}if(r===t)break;for(;r.sibling===null;){if(r.return===null||r.return===t)return;r=r.return}r.sibling.return=r.return,r=r.sibling}};nl=function(){};Mp=function(e,t,r,n){var s=e.memoizedProps;if(s!==n){e=t.stateNode,Fr(Mt.current);var a=null;switch(r){case"input":s=So(e,s),n=So(e,n),a=[];break;case"select":s=me({},s,{value:void 0}),n=me({},n,{value:void 0}),a=[];break;case"textarea":s=To(e,s),n=To(e,n),a=[];break;default:typeof s.onClick!="function"&&typeof n.onClick=="function"&&(e.onclick=Ka)}Ao(r,n);var o;r=null;for(u in s)if(!n.hasOwnProperty(u)&&s.hasOwnProperty(u)&&s[u]!=null)if(u==="style"){var l=s[u];for(o in l)l.hasOwnProperty(o)&&(r||(r={}),r[o]="")}else u!=="dangerouslySetInnerHTML"&&u!=="children"&&u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&u!=="autoFocus"&&(xs.hasOwnProperty(u)?a||(a=[]):(a=a||[]).push(u,null));for(u in n){var c=n[u];if(l=s!=null?s[u]:void 0,n.hasOwnProperty(u)&&c!==l&&(c!=null||l!=null))if(u==="style")if(l){for(o in l)!l.hasOwnProperty(o)||c&&c.hasOwnProperty(o)||(r||(r={}),r[o]="");for(o in c)c.hasOwnProperty(o)&&l[o]!==c[o]&&(r||(r={}),r[o]=c[o])}else r||(a||(a=[]),a.push(u,r)),r=c;else u==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,l=l?l.__html:void 0,c!=null&&l!==c&&(a=a||[]).push(u,c)):u==="children"?typeof c!="string"&&typeof c!="number"||(a=a||[]).push(u,""+c):u!=="suppressContentEditableWarning"&&u!=="suppressHydrationWarning"&&(xs.hasOwnProperty(u)?(c!=null&&u==="onScroll"&&ce("scroll",e),a||l===c||(a=[])):(a=a||[]).push(u,c))}r&&(a=a||[]).push("style",r);var u=a;(t.updateQueue=u)&&(t.flags|=4)}};Bp=function(e,t,r,n){r!==n&&(t.flags|=4)};function Qn(e,t){if(!de)switch(e.tailMode){case"hidden":t=e.tail;for(var r=null;t!==null;)t.alternate!==null&&(r=t),t=t.sibling;r===null?e.tail=null:r.sibling=null;break;case"collapsed":r=e.tail;for(var n=null;r!==null;)r.alternate!==null&&(n=r),r=r.sibling;n===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:n.sibling=null}}function ze(e){var t=e.alternate!==null&&e.alternate.child===e.child,r=0,n=0;if(t)for(var s=e.child;s!==null;)r|=s.lanes|s.childLanes,n|=s.subtreeFlags&14680064,n|=s.flags&14680064,s.return=e,s=s.sibling;else for(s=e.child;s!==null;)r|=s.lanes|s.childLanes,n|=s.subtreeFlags,n|=s.flags,s.return=e,s=s.sibling;return e.subtreeFlags|=n,e.childLanes=r,t}function Bm(e,t,r){var n=t.pendingProps;switch(Gl(t),t.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return ze(t),null;case 1:return et(t.type)&&Ga(),ze(t),null;case 3:return n=t.stateNode,In(),ue(Ze),ue(Be),nc(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(oa(t)?t.flags|=4:e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,Tt!==null&&(dl(Tt),Tt=null))),nl(e,t),ze(t),null;case 5:rc(t);var s=Fr(Rs.current);if(r=t.type,e!==null&&t.stateNode!=null)Mp(e,t,r,n,s),e.ref!==t.ref&&(t.flags|=512,t.flags|=2097152);else{if(!n){if(t.stateNode===null)throw Error(A(166));return ze(t),null}if(e=Fr(Mt.current),oa(t)){n=t.stateNode,r=t.type;var a=t.memoizedProps;switch(n[Dt]=t,n[Cs]=a,e=(t.mode&1)!==0,r){case"dialog":ce("cancel",n),ce("close",n);break;case"iframe":case"object":case"embed":ce("load",n);break;case"video":case"audio":for(s=0;s<ss.length;s++)ce(ss[s],n);break;case"source":ce("error",n);break;case"img":case"image":case"link":ce("error",n),ce("load",n);break;case"details":ce("toggle",n);break;case"input":nu(n,a),ce("invalid",n);break;case"select":n._wrapperState={wasMultiple:!!a.multiple},ce("invalid",n);break;case"textarea":au(n,a),ce("invalid",n)}Ao(r,a),s=null;for(var o in a)if(a.hasOwnProperty(o)){var l=a[o];o==="children"?typeof l=="string"?n.textContent!==l&&(a.suppressHydrationWarning!==!0&&ia(n.textContent,l,e),s=["children",l]):typeof l=="number"&&n.textContent!==""+l&&(a.suppressHydrationWarning!==!0&&ia(n.textContent,l,e),s=["children",""+l]):xs.hasOwnProperty(o)&&l!=null&&o==="onScroll"&&ce("scroll",n)}switch(r){case"input":Xs(n),su(n,a,!0);break;case"textarea":Xs(n),iu(n);break;case"select":case"option":break;default:typeof a.onClick=="function"&&(n.onclick=Ka)}n=s,t.updateQueue=n,n!==null&&(t.flags|=4)}else{o=s.nodeType===9?s:s.ownerDocument,e==="http://www.w3.org/1999/xhtml"&&(e=mh(r)),e==="http://www.w3.org/1999/xhtml"?r==="script"?(e=o.createElement("div"),e.innerHTML="<script><\/script>",e=e.removeChild(e.firstChild)):typeof n.is=="string"?e=o.createElement(r,{is:n.is}):(e=o.createElement(r),r==="select"&&(o=e,n.multiple?o.multiple=!0:n.size&&(o.size=n.size))):e=o.createElementNS(e,r),e[Dt]=t,e[Cs]=n,Fp(e,t,!1,!1),t.stateNode=e;e:{switch(o=Ro(r,n),r){case"dialog":ce("cancel",e),ce("close",e),s=n;break;case"iframe":case"object":case"embed":ce("load",e),s=n;break;case"video":case"audio":for(s=0;s<ss.length;s++)ce(ss[s],e);s=n;break;case"source":ce("error",e),s=n;break;case"img":case"image":case"link":ce("error",e),ce("load",e),s=n;break;case"details":ce("toggle",e),s=n;break;case"input":nu(e,n),s=So(e,n),ce("invalid",e);break;case"option":s=n;break;case"select":e._wrapperState={wasMultiple:!!n.multiple},s=me({},n,{value:void 0}),ce("invalid",e);break;case"textarea":au(e,n),s=To(e,n),ce("invalid",e);break;default:s=n}Ao(r,s),l=s;for(a in l)if(l.hasOwnProperty(a)){var c=l[a];a==="style"?xh(e,c):a==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&vh(e,c)):a==="children"?typeof c=="string"?(r!=="textarea"||c!=="")&&ks(e,c):typeof c=="number"&&ks(e,""+c):a!=="suppressContentEditableWarning"&&a!=="suppressHydrationWarning"&&a!=="autoFocus"&&(xs.hasOwnProperty(a)?c!=null&&a==="onScroll"&&ce("scroll",e):c!=null&&Ol(e,a,c,o))}switch(r){case"input":Xs(e),su(e,n,!1);break;case"textarea":Xs(e),iu(e);break;case"option":n.value!=null&&e.setAttribute("value",""+Er(n.value));break;case"select":e.multiple=!!n.multiple,a=n.value,a!=null?Sn(e,!!n.multiple,a,!1):n.defaultValue!=null&&Sn(e,!!n.multiple,n.defaultValue,!0);break;default:typeof s.onClick=="function"&&(e.onclick=Ka)}switch(r){case"button":case"input":case"select":case"textarea":n=!!n.autoFocus;break e;case"img":n=!0;break e;default:n=!1}}n&&(t.flags|=4)}t.ref!==null&&(t.flags|=512,t.flags|=2097152)}return ze(t),null;case 6:if(e&&t.stateNode!=null)Bp(e,t,e.memoizedProps,n);else{if(typeof n!="string"&&t.stateNode===null)throw Error(A(166));if(r=Fr(Rs.current),Fr(Mt.current),oa(t)){if(n=t.stateNode,r=t.memoizedProps,n[Dt]=t,(a=n.nodeValue!==r)&&(e=it,e!==null))switch(e.tag){case 3:ia(n.nodeValue,r,(e.mode&1)!==0);break;case 5:e.memoizedProps.suppressHydrationWarning!==!0&&ia(n.nodeValue,r,(e.mode&1)!==0)}a&&(t.flags|=4)}else n=(r.nodeType===9?r:r.ownerDocument).createTextNode(n),n[Dt]=t,t.stateNode=n}return ze(t),null;case 13:if(ue(fe),n=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(de&&at!==null&&t.mode&1&&!(t.flags&128))ip(),Ln(),t.flags|=98560,a=!1;else if(a=oa(t),n!==null&&n.dehydrated!==null){if(e===null){if(!a)throw Error(A(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(A(317));a[Dt]=t}else Ln(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;ze(t),a=!1}else Tt!==null&&(dl(Tt),Tt=null),a=!0;if(!a)return t.flags&65536?t:null}return t.flags&128?(t.lanes=r,t):(n=n!==null,n!==(e!==null&&e.memoizedState!==null)&&n&&(t.child.flags|=8192,t.mode&1&&(e===null||fe.current&1?Te===0&&(Te=3):gc())),t.updateQueue!==null&&(t.flags|=4),ze(t),null);case 4:return In(),nl(e,t),e===null&&Es(t.stateNode.containerInfo),ze(t),null;case 10:return Xl(t.type._context),ze(t),null;case 17:return et(t.type)&&Ga(),ze(t),null;case 19:if(ue(fe),a=t.memoizedState,a===null)return ze(t),null;if(n=(t.flags&128)!==0,o=a.rendering,o===null)if(n)Qn(a,!1);else{if(Te!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=ti(e),o!==null){for(t.flags|=128,Qn(a,!1),n=o.updateQueue,n!==null&&(t.updateQueue=n,t.flags|=4),t.subtreeFlags=0,n=r,r=t.child;r!==null;)a=r,e=n,a.flags&=14680066,o=a.alternate,o===null?(a.childLanes=0,a.lanes=e,a.child=null,a.subtreeFlags=0,a.memoizedProps=null,a.memoizedState=null,a.updateQueue=null,a.dependencies=null,a.stateNode=null):(a.childLanes=o.childLanes,a.lanes=o.lanes,a.child=o.child,a.subtreeFlags=0,a.deletions=null,a.memoizedProps=o.memoizedProps,a.memoizedState=o.memoizedState,a.updateQueue=o.updateQueue,a.type=o.type,e=o.dependencies,a.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext}),r=r.sibling;return oe(fe,fe.current&1|2),t.child}e=e.sibling}a.tail!==null&&be()>zn&&(t.flags|=128,n=!0,Qn(a,!1),t.lanes=4194304)}else{if(!n)if(e=ti(o),e!==null){if(t.flags|=128,n=!0,r=e.updateQueue,r!==null&&(t.updateQueue=r,t.flags|=4),Qn(a,!0),a.tail===null&&a.tailMode==="hidden"&&!o.alternate&&!de)return ze(t),null}else 2*be()-a.renderingStartTime>zn&&r!==1073741824&&(t.flags|=128,n=!0,Qn(a,!1),t.lanes=4194304);a.isBackwards?(o.sibling=t.child,t.child=o):(r=a.last,r!==null?r.sibling=o:t.child=o,a.last=o)}return a.tail!==null?(t=a.tail,a.rendering=t,a.tail=t.sibling,a.renderingStartTime=be(),t.sibling=null,r=fe.current,oe(fe,n?r&1|2:r&1),t):(ze(t),null);case 22:case 23:return fc(),n=t.memoizedState!==null,e!==null&&e.memoizedState!==null!==n&&(t.flags|=8192),n&&t.mode&1?nt&1073741824&&(ze(t),t.subtreeFlags&6&&(t.flags|=8192)):ze(t),null;case 24:return null;case 25:return null}throw Error(A(156,t.tag))}function Wm(e,t){switch(Gl(t),t.tag){case 1:return et(t.type)&&Ga(),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return In(),ue(Ze),ue(Be),nc(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 5:return rc(t),null;case 13:if(ue(fe),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(A(340));Ln()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return ue(fe),null;case 4:return In(),null;case 10:return Xl(t.type._context),null;case 22:case 23:return fc(),null;case 24:return null;default:return null}}var ua=!1,Me=!1,Hm=typeof WeakSet=="function"?WeakSet:Set,D=null;function bn(e,t){var r=e.ref;if(r!==null)if(typeof r=="function")try{r(null)}catch(n){ye(e,t,n)}else r.current=null}function sl(e,t,r){try{r()}catch(n){ye(e,t,n)}}var Ju=!1;function Vm(e,t){if(Mo=Ha,e=Kh(),ql(e)){if("selectionStart"in e)var r={start:e.selectionStart,end:e.selectionEnd};else e:{r=(r=e.ownerDocument)&&r.defaultView||window;var n=r.getSelection&&r.getSelection();if(n&&n.rangeCount!==0){r=n.anchorNode;var s=n.anchorOffset,a=n.focusNode;n=n.focusOffset;try{r.nodeType,a.nodeType}catch{r=null;break e}var o=0,l=-1,c=-1,u=0,d=0,h=e,p=null;t:for(;;){for(var v;h!==r||s!==0&&h.nodeType!==3||(l=o+s),h!==a||n!==0&&h.nodeType!==3||(c=o+n),h.nodeType===3&&(o+=h.nodeValue.length),(v=h.firstChild)!==null;)p=h,h=v;for(;;){if(h===e)break t;if(p===r&&++u===s&&(l=o),p===a&&++d===n&&(c=o),(v=h.nextSibling)!==null)break;h=p,p=h.parentNode}h=v}r=l===-1||c===-1?null:{start:l,end:c}}else r=null}r=r||{start:0,end:0}}else r=null;for(Bo={focusedElem:e,selectionRange:r},Ha=!1,D=t;D!==null;)if(t=D,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,D=e;else for(;D!==null;){t=D;try{var y=t.alternate;if(t.flags&1024)switch(t.tag){case 0:case 11:case 15:break;case 1:if(y!==null){var x=y.memoizedProps,N=y.memoizedState,f=t.stateNode,g=f.getSnapshotBeforeUpdate(t.elementType===t.type?x:St(t.type,x),N);f.__reactInternalSnapshotBeforeUpdate=g}break;case 3:var m=t.stateNode.containerInfo;m.nodeType===1?m.textContent="":m.nodeType===9&&m.documentElement&&m.removeChild(m.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(A(163))}}catch(k){ye(t,t.return,k)}if(e=t.sibling,e!==null){e.return=t.return,D=e;break}D=t.return}return y=Ju,Ju=!1,y}function ps(e,t,r){var n=t.updateQueue;if(n=n!==null?n.lastEffect:null,n!==null){var s=n=n.next;do{if((s.tag&e)===e){var a=s.destroy;s.destroy=void 0,a!==void 0&&sl(t,r,a)}s=s.next}while(s!==n)}}function _i(e,t){if(t=t.updateQueue,t=t!==null?t.lastEffect:null,t!==null){var r=t=t.next;do{if((r.tag&e)===e){var n=r.create;r.destroy=n()}r=r.next}while(r!==t)}}function al(e){var t=e.ref;if(t!==null){var r=e.stateNode;switch(e.tag){case 5:e=r;break;default:e=r}typeof t=="function"?t(e):t.current=e}}function Wp(e){var t=e.alternate;t!==null&&(e.alternate=null,Wp(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&(delete t[Dt],delete t[Cs],delete t[Vo],delete t[Em],delete t[Tm])),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}function Hp(e){return e.tag===5||e.tag===3||e.tag===4}function Yu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Hp(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function il(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.nodeType===8?r.parentNode.insertBefore(e,t):r.insertBefore(e,t):(r.nodeType===8?(t=r.parentNode,t.insertBefore(e,r)):(t=r,t.appendChild(e)),r=r._reactRootContainer,r!=null||t.onclick!==null||(t.onclick=Ka));else if(n!==4&&(e=e.child,e!==null))for(il(e,t,r),e=e.sibling;e!==null;)il(e,t,r),e=e.sibling}function ol(e,t,r){var n=e.tag;if(n===5||n===6)e=e.stateNode,t?r.insertBefore(e,t):r.appendChild(e);else if(n!==4&&(e=e.child,e!==null))for(ol(e,t,r),e=e.sibling;e!==null;)ol(e,t,r),e=e.sibling}var Oe=null,Et=!1;function or(e,t,r){for(r=r.child;r!==null;)Vp(e,t,r),r=r.sibling}function Vp(e,t,r){if(Ft&&typeof Ft.onCommitFiberUnmount=="function")try{Ft.onCommitFiberUnmount(gi,r)}catch{}switch(r.tag){case 5:Me||bn(r,t);case 6:var n=Oe,s=Et;Oe=null,or(e,t,r),Oe=n,Et=s,Oe!==null&&(Et?(e=Oe,r=r.stateNode,e.nodeType===8?e.parentNode.removeChild(r):e.removeChild(r)):Oe.removeChild(r.stateNode));break;case 18:Oe!==null&&(Et?(e=Oe,r=r.stateNode,e.nodeType===8?Qi(e.parentNode,r):e.nodeType===1&&Qi(e,r),js(e)):Qi(Oe,r.stateNode));break;case 4:n=Oe,s=Et,Oe=r.stateNode.containerInfo,Et=!0,or(e,t,r),Oe=n,Et=s;break;case 0:case 11:case 14:case 15:if(!Me&&(n=r.updateQueue,n!==null&&(n=n.lastEffect,n!==null))){s=n=n.next;do{var a=s,o=a.destroy;a=a.tag,o!==void 0&&(a&2||a&4)&&sl(r,t,o),s=s.next}while(s!==n)}or(e,t,r);break;case 1:if(!Me&&(bn(r,t),n=r.stateNode,typeof n.componentWillUnmount=="function"))try{n.props=r.memoizedProps,n.state=r.memoizedState,n.componentWillUnmount()}catch(l){ye(r,t,l)}or(e,t,r);break;case 21:or(e,t,r);break;case 22:r.mode&1?(Me=(n=Me)||r.memoizedState!==null,or(e,t,r),Me=n):or(e,t,r);break;default:or(e,t,r)}}function Qu(e){var t=e.updateQueue;if(t!==null){e.updateQueue=null;var r=e.stateNode;r===null&&(r=e.stateNode=new Hm),t.forEach(function(n){var s=ev.bind(null,e,n);r.has(n)||(r.add(n),n.then(s,s))})}}function wt(e,t){var r=t.deletions;if(r!==null)for(var n=0;n<r.length;n++){var s=r[n];try{var a=e,o=t,l=o;e:for(;l!==null;){switch(l.tag){case 5:Oe=l.stateNode,Et=!1;break e;case 3:Oe=l.stateNode.containerInfo,Et=!0;break e;case 4:Oe=l.stateNode.containerInfo,Et=!0;break e}l=l.return}if(Oe===null)throw Error(A(160));Vp(a,o,s),Oe=null,Et=!1;var c=s.alternate;c!==null&&(c.return=null),s.return=null}catch(u){ye(s,t,u)}}if(t.subtreeFlags&12854)for(t=t.child;t!==null;)qp(t,e),t=t.sibling}function qp(e,t){var r=e.alternate,n=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:if(wt(t,e),Ot(e),n&4){try{ps(3,e,e.return),_i(3,e)}catch(x){ye(e,e.return,x)}try{ps(5,e,e.return)}catch(x){ye(e,e.return,x)}}break;case 1:wt(t,e),Ot(e),n&512&&r!==null&&bn(r,r.return);break;case 5:if(wt(t,e),Ot(e),n&512&&r!==null&&bn(r,r.return),e.flags&32){var s=e.stateNode;try{ks(s,"")}catch(x){ye(e,e.return,x)}}if(n&4&&(s=e.stateNode,s!=null)){var a=e.memoizedProps,o=r!==null?r.memoizedProps:a,l=e.type,c=e.updateQueue;if(e.updateQueue=null,c!==null)try{l==="input"&&a.type==="radio"&&a.name!=null&&fh(s,a),Ro(l,o);var u=Ro(l,a);for(o=0;o<c.length;o+=2){var d=c[o],h=c[o+1];d==="style"?xh(s,h):d==="dangerouslySetInnerHTML"?vh(s,h):d==="children"?ks(s,h):Ol(s,d,h,u)}switch(l){case"input":No(s,a);break;case"textarea":gh(s,a);break;case"select":var p=s._wrapperState.wasMultiple;s._wrapperState.wasMultiple=!!a.multiple;var v=a.value;v!=null?Sn(s,!!a.multiple,v,!1):p!==!!a.multiple&&(a.defaultValue!=null?Sn(s,!!a.multiple,a.defaultValue,!0):Sn(s,!!a.multiple,a.multiple?[]:"",!1))}s[Cs]=a}catch(x){ye(e,e.return,x)}}break;case 6:if(wt(t,e),Ot(e),n&4){if(e.stateNode===null)throw Error(A(162));s=e.stateNode,a=e.memoizedProps;try{s.nodeValue=a}catch(x){ye(e,e.return,x)}}break;case 3:if(wt(t,e),Ot(e),n&4&&r!==null&&r.memoizedState.isDehydrated)try{js(t.containerInfo)}catch(x){ye(e,e.return,x)}break;case 4:wt(t,e),Ot(e);break;case 13:wt(t,e),Ot(e),s=e.child,s.flags&8192&&(a=s.memoizedState!==null,s.stateNode.isHidden=a,!a||s.alternate!==null&&s.alternate.memoizedState!==null||(hc=be())),n&4&&Qu(e);break;case 22:if(d=r!==null&&r.memoizedState!==null,e.mode&1?(Me=(u=Me)||d,wt(t,e),Me=u):wt(t,e),Ot(e),n&8192){if(u=e.memoizedState!==null,(e.stateNode.isHidden=u)&&!d&&e.mode&1)for(D=e,d=e.child;d!==null;){for(h=D=d;D!==null;){switch(p=D,v=p.child,p.tag){case 0:case 11:case 14:case 15:ps(4,p,p.return);break;case 1:bn(p,p.return);var y=p.stateNode;if(typeof y.componentWillUnmount=="function"){n=p,r=p.return;try{t=n,y.props=t.memoizedProps,y.state=t.memoizedState,y.componentWillUnmount()}catch(x){ye(n,r,x)}}break;case 5:bn(p,p.return);break;case 22:if(p.memoizedState!==null){Zu(h);continue}}v!==null?(v.return=p,D=v):Zu(h)}d=d.sibling}e:for(d=null,h=e;;){if(h.tag===5){if(d===null){d=h;try{s=h.stateNode,u?(a=s.style,typeof a.setProperty=="function"?a.setProperty("display","none","important"):a.display="none"):(l=h.stateNode,c=h.memoizedProps.style,o=c!=null&&c.hasOwnProperty("display")?c.display:null,l.style.display=yh("display",o))}catch(x){ye(e,e.return,x)}}}else if(h.tag===6){if(d===null)try{h.stateNode.nodeValue=u?"":h.memoizedProps}catch(x){ye(e,e.return,x)}}else if((h.tag!==22&&h.tag!==23||h.memoizedState===null||h===e)&&h.child!==null){h.child.return=h,h=h.child;continue}if(h===e)break e;for(;h.sibling===null;){if(h.return===null||h.return===e)break e;d===h&&(d=null),h=h.return}d===h&&(d=null),h.sibling.return=h.return,h=h.sibling}}break;case 19:wt(t,e),Ot(e),n&4&&Qu(e);break;case 21:break;default:wt(t,e),Ot(e)}}function Ot(e){var t=e.flags;if(t&2){try{e:{for(var r=e.return;r!==null;){if(Hp(r)){var n=r;break e}r=r.return}throw Error(A(160))}switch(n.tag){case 5:var s=n.stateNode;n.flags&32&&(ks(s,""),n.flags&=-33);var a=Yu(e);ol(e,a,s);break;case 3:case 4:var o=n.stateNode.containerInfo,l=Yu(e);il(e,l,o);break;default:throw Error(A(161))}}catch(c){ye(e,e.return,c)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function qm(e,t,r){D=e,Kp(e)}function Kp(e,t,r){for(var n=(e.mode&1)!==0;D!==null;){var s=D,a=s.child;if(s.tag===22&&n){var o=s.memoizedState!==null||ua;if(!o){var l=s.alternate,c=l!==null&&l.memoizedState!==null||Me;l=ua;var u=Me;if(ua=o,(Me=c)&&!u)for(D=s;D!==null;)o=D,c=o.child,o.tag===22&&o.memoizedState!==null?ed(s):c!==null?(c.return=o,D=c):ed(s);for(;a!==null;)D=a,Kp(a),a=a.sibling;D=s,ua=l,Me=u}Xu(e)}else s.subtreeFlags&8772&&a!==null?(a.return=s,D=a):Xu(e)}}function Xu(e){for(;D!==null;){var t=D;if(t.flags&8772){var r=t.alternate;try{if(t.flags&8772)switch(t.tag){case 0:case 11:case 15:Me||_i(5,t);break;case 1:var n=t.stateNode;if(t.flags&4&&!Me)if(r===null)n.componentDidMount();else{var s=t.elementType===t.type?r.memoizedProps:St(t.type,r.memoizedProps);n.componentDidUpdate(s,r.memoizedState,n.__reactInternalSnapshotBeforeUpdate)}var a=t.updateQueue;a!==null&&Iu(t,a,n);break;case 3:var o=t.updateQueue;if(o!==null){if(r=null,t.child!==null)switch(t.child.tag){case 5:r=t.child.stateNode;break;case 1:r=t.child.stateNode}Iu(t,o,r)}break;case 5:var l=t.stateNode;if(r===null&&t.flags&4){r=l;var c=t.memoizedProps;switch(t.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&r.focus();break;case"img":c.src&&(r.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(t.memoizedState===null){var u=t.alternate;if(u!==null){var d=u.memoizedState;if(d!==null){var h=d.dehydrated;h!==null&&js(h)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(A(163))}Me||t.flags&512&&al(t)}catch(p){ye(t,t.return,p)}}if(t===e){D=null;break}if(r=t.sibling,r!==null){r.return=t.return,D=r;break}D=t.return}}function Zu(e){for(;D!==null;){var t=D;if(t===e){D=null;break}var r=t.sibling;if(r!==null){r.return=t.return,D=r;break}D=t.return}}function ed(e){for(;D!==null;){var t=D;try{switch(t.tag){case 0:case 11:case 15:var r=t.return;try{_i(4,t)}catch(c){ye(t,r,c)}break;case 1:var n=t.stateNode;if(typeof n.componentDidMount=="function"){var s=t.return;try{n.componentDidMount()}catch(c){ye(t,s,c)}}var a=t.return;try{al(t)}catch(c){ye(t,a,c)}break;case 5:var o=t.return;try{al(t)}catch(c){ye(t,o,c)}}}catch(c){ye(t,t.return,c)}if(t===e){D=null;break}var l=t.sibling;if(l!==null){l.return=t.return,D=l;break}D=t.return}}var Km=Math.ceil,si=tr.ReactCurrentDispatcher,uc=tr.ReactCurrentOwner,mt=tr.ReactCurrentBatchConfig,te=0,Ae=null,Se=null,Le=0,nt=0,wn=Ar(0),Te=0,$s=null,Gr=0,ji=0,dc=0,fs=null,Qe=null,hc=0,zn=1/0,Ht=null,ai=!1,ll=null,jr=null,da=!1,yr=null,ii=0,gs=0,cl=null,La=-1,$a=0;function Ke(){return te&6?be():La!==-1?La:La=be()}function Sr(e){return e.mode&1?te&2&&Le!==0?Le&-Le:Am.transition!==null?($a===0&&($a=Rh()),$a):(e=se,e!==0||(e=window.event,e=e===void 0?16:zh(e.type)),e):1}function At(e,t,r,n){if(50<gs)throw gs=0,cl=null,Error(A(185));Hs(e,r,n),(!(te&2)||e!==Ae)&&(e===Ae&&(!(te&2)&&(ji|=r),Te===4&&fr(e,Le)),tt(e,n),r===1&&te===0&&!(t.mode&1)&&(zn=be()+500,ki&&Rr()))}function tt(e,t){var r=e.callbackNode;Ag(e,t);var n=Wa(e,e===Ae?Le:0);if(n===0)r!==null&&cu(r),e.callbackNode=null,e.callbackPriority=0;else if(t=n&-n,e.callbackPriority!==t){if(r!=null&&cu(r),t===1)e.tag===0?Cm(td.bind(null,e)):np(td.bind(null,e)),Sm(function(){!(te&6)&&Rr()}),r=null;else{switch(Ph(n)){case 1:r=zl;break;case 4:r=Ch;break;case 16:r=Ba;break;case 536870912:r=Ah;break;default:r=Ba}r=tf(r,Gp.bind(null,e))}e.callbackPriority=t,e.callbackNode=r}}function Gp(e,t){if(La=-1,$a=0,te&6)throw Error(A(327));var r=e.callbackNode;if(An()&&e.callbackNode!==r)return null;var n=Wa(e,e===Ae?Le:0);if(n===0)return null;if(n&30||n&e.expiredLanes||t)t=oi(e,n);else{t=n;var s=te;te|=2;var a=Yp();(Ae!==e||Le!==t)&&(Ht=null,zn=be()+500,Wr(e,t));do try{Ym();break}catch(l){Jp(e,l)}while(!0);Ql(),si.current=a,te=s,Se!==null?t=0:(Ae=null,Le=0,t=Te)}if(t!==0){if(t===2&&(s=Io(e),s!==0&&(n=s,t=ul(e,s))),t===1)throw r=$s,Wr(e,0),fr(e,n),tt(e,be()),r;if(t===6)fr(e,n);else{if(s=e.current.alternate,!(n&30)&&!Gm(s)&&(t=oi(e,n),t===2&&(a=Io(e),a!==0&&(n=a,t=ul(e,a))),t===1))throw r=$s,Wr(e,0),fr(e,n),tt(e,be()),r;switch(e.finishedWork=s,e.finishedLanes=n,t){case 0:case 1:throw Error(A(345));case 2:$r(e,Qe,Ht);break;case 3:if(fr(e,n),(n&130023424)===n&&(t=hc+500-be(),10<t)){if(Wa(e,0)!==0)break;if(s=e.suspendedLanes,(s&n)!==n){Ke(),e.pingedLanes|=e.suspendedLanes&s;break}e.timeoutHandle=Ho($r.bind(null,e,Qe,Ht),t);break}$r(e,Qe,Ht);break;case 4:if(fr(e,n),(n&4194240)===n)break;for(t=e.eventTimes,s=-1;0<n;){var o=31-Ct(n);a=1<<o,o=t[o],o>s&&(s=o),n&=~a}if(n=s,n=be()-n,n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*Km(n/1960))-n,10<n){e.timeoutHandle=Ho($r.bind(null,e,Qe,Ht),n);break}$r(e,Qe,Ht);break;case 5:$r(e,Qe,Ht);break;default:throw Error(A(329))}}}return tt(e,be()),e.callbackNode===r?Gp.bind(null,e):null}function ul(e,t){var r=fs;return e.current.memoizedState.isDehydrated&&(Wr(e,t).flags|=256),e=oi(e,t),e!==2&&(t=Qe,Qe=r,t!==null&&dl(t)),e}function dl(e){Qe===null?Qe=e:Qe.push.apply(Qe,e)}function Gm(e){for(var t=e;;){if(t.flags&16384){var r=t.updateQueue;if(r!==null&&(r=r.stores,r!==null))for(var n=0;n<r.length;n++){var s=r[n],a=s.getSnapshot;s=s.value;try{if(!Rt(a(),s))return!1}catch{return!1}}}if(r=t.child,t.subtreeFlags&16384&&r!==null)r.return=t,t=r;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function fr(e,t){for(t&=~dc,t&=~ji,e.suspendedLanes|=t,e.pingedLanes&=~t,e=e.expirationTimes;0<t;){var r=31-Ct(t),n=1<<r;e[r]=-1,t&=~n}}function td(e){if(te&6)throw Error(A(327));An();var t=Wa(e,0);if(!(t&1))return tt(e,be()),null;var r=oi(e,t);if(e.tag!==0&&r===2){var n=Io(e);n!==0&&(t=n,r=ul(e,n))}if(r===1)throw r=$s,Wr(e,0),fr(e,t),tt(e,be()),r;if(r===6)throw Error(A(345));return e.finishedWork=e.current.alternate,e.finishedLanes=t,$r(e,Qe,Ht),tt(e,be()),null}function pc(e,t){var r=te;te|=1;try{return e(t)}finally{te=r,te===0&&(zn=be()+500,ki&&Rr())}}function Jr(e){yr!==null&&yr.tag===0&&!(te&6)&&An();var t=te;te|=1;var r=mt.transition,n=se;try{if(mt.transition=null,se=1,e)return e()}finally{se=n,mt.transition=r,te=t,!(te&6)&&Rr()}}function fc(){nt=wn.current,ue(wn)}function Wr(e,t){e.finishedWork=null,e.finishedLanes=0;var r=e.timeoutHandle;if(r!==-1&&(e.timeoutHandle=-1,jm(r)),Se!==null)for(r=Se.return;r!==null;){var n=r;switch(Gl(n),n.tag){case 1:n=n.type.childContextTypes,n!=null&&Ga();break;case 3:In(),ue(Ze),ue(Be),nc();break;case 5:rc(n);break;case 4:In();break;case 13:ue(fe);break;case 19:ue(fe);break;case 10:Xl(n.type._context);break;case 22:case 23:fc()}r=r.return}if(Ae=e,Se=e=Nr(e.current,null),Le=nt=t,Te=0,$s=null,dc=ji=Gr=0,Qe=fs=null,Dr!==null){for(t=0;t<Dr.length;t++)if(r=Dr[t],n=r.interleaved,n!==null){r.interleaved=null;var s=n.next,a=r.pending;if(a!==null){var o=a.next;a.next=s,n.next=o}r.pending=n}Dr=null}return e}function Jp(e,t){do{var r=Se;try{if(Ql(),Ra.current=ni,ri){for(var n=ge.memoizedState;n!==null;){var s=n.queue;s!==null&&(s.pending=null),n=n.next}ri=!1}if(Kr=0,Ce=Ee=ge=null,hs=!1,Ps=0,uc.current=null,r===null||r.return===null){Te=1,$s=t,Se=null;break}e:{var a=e,o=r.return,l=r,c=t;if(t=Le,l.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var u=c,d=l,h=d.tag;if(!(d.mode&1)&&(h===0||h===11||h===15)){var p=d.alternate;p?(d.updateQueue=p.updateQueue,d.memoizedState=p.memoizedState,d.lanes=p.lanes):(d.updateQueue=null,d.memoizedState=null)}var v=Bu(o);if(v!==null){v.flags&=-257,Wu(v,o,l,a,t),v.mode&1&&Mu(a,u,t),t=v,c=u;var y=t.updateQueue;if(y===null){var x=new Set;x.add(c),t.updateQueue=x}else y.add(c);break e}else{if(!(t&1)){Mu(a,u,t),gc();break e}c=Error(A(426))}}else if(de&&l.mode&1){var N=Bu(o);if(N!==null){!(N.flags&65536)&&(N.flags|=256),Wu(N,o,l,a,t),Jl(Un(c,l));break e}}a=c=Un(c,l),Te!==4&&(Te=2),fs===null?fs=[a]:fs.push(a),a=o;do{switch(a.tag){case 3:a.flags|=65536,t&=-t,a.lanes|=t;var f=Pp(a,c,t);$u(a,f);break e;case 1:l=c;var g=a.type,m=a.stateNode;if(!(a.flags&128)&&(typeof g.getDerivedStateFromError=="function"||m!==null&&typeof m.componentDidCatch=="function"&&(jr===null||!jr.has(m)))){a.flags|=65536,t&=-t,a.lanes|=t;var k=Op(a,l,t);$u(a,k);break e}}a=a.return}while(a!==null)}Xp(r)}catch(j){t=j,Se===r&&r!==null&&(Se=r=r.return);continue}break}while(!0)}function Yp(){var e=si.current;return si.current=ni,e===null?ni:e}function gc(){(Te===0||Te===3||Te===2)&&(Te=4),Ae===null||!(Gr&268435455)&&!(ji&268435455)||fr(Ae,Le)}function oi(e,t){var r=te;te|=2;var n=Yp();(Ae!==e||Le!==t)&&(Ht=null,Wr(e,t));do try{Jm();break}catch(s){Jp(e,s)}while(!0);if(Ql(),te=r,si.current=n,Se!==null)throw Error(A(261));return Ae=null,Le=0,Te}function Jm(){for(;Se!==null;)Qp(Se)}function Ym(){for(;Se!==null&&!bg();)Qp(Se)}function Qp(e){var t=ef(e.alternate,e,nt);e.memoizedProps=e.pendingProps,t===null?Xp(e):Se=t,uc.current=null}function Xp(e){var t=e;do{var r=t.alternate;if(e=t.return,t.flags&32768){if(r=Wm(r,t),r!==null){r.flags&=32767,Se=r;return}if(e!==null)e.flags|=32768,e.subtreeFlags=0,e.deletions=null;else{Te=6,Se=null;return}}else if(r=Bm(r,t,nt),r!==null){Se=r;return}if(t=t.sibling,t!==null){Se=t;return}Se=t=e}while(t!==null);Te===0&&(Te=5)}function $r(e,t,r){var n=se,s=mt.transition;try{mt.transition=null,se=1,Qm(e,t,r,n)}finally{mt.transition=s,se=n}return null}function Qm(e,t,r,n){do An();while(yr!==null);if(te&6)throw Error(A(327));r=e.finishedWork;var s=e.finishedLanes;if(r===null)return null;if(e.finishedWork=null,e.finishedLanes=0,r===e.current)throw Error(A(177));e.callbackNode=null,e.callbackPriority=0;var a=r.lanes|r.childLanes;if(Rg(e,a),e===Ae&&(Se=Ae=null,Le=0),!(r.subtreeFlags&2064)&&!(r.flags&2064)||da||(da=!0,tf(Ba,function(){return An(),null})),a=(r.flags&15990)!==0,r.subtreeFlags&15990||a){a=mt.transition,mt.transition=null;var o=se;se=1;var l=te;te|=4,uc.current=null,Vm(e,r),qp(r,e),vm(Bo),Ha=!!Mo,Bo=Mo=null,e.current=r,qm(r),wg(),te=l,se=o,mt.transition=a}else e.current=r;if(da&&(da=!1,yr=e,ii=s),a=e.pendingLanes,a===0&&(jr=null),Sg(r.stateNode),tt(e,be()),t!==null)for(n=e.onRecoverableError,r=0;r<t.length;r++)s=t[r],n(s.value,{componentStack:s.stack,digest:s.digest});if(ai)throw ai=!1,e=ll,ll=null,e;return ii&1&&e.tag!==0&&An(),a=e.pendingLanes,a&1?e===cl?gs++:(gs=0,cl=e):gs=0,Rr(),null}function An(){if(yr!==null){var e=Ph(ii),t=mt.transition,r=se;try{if(mt.transition=null,se=16>e?16:e,yr===null)var n=!1;else{if(e=yr,yr=null,ii=0,te&6)throw Error(A(331));var s=te;for(te|=4,D=e.current;D!==null;){var a=D,o=a.child;if(D.flags&16){var l=a.deletions;if(l!==null){for(var c=0;c<l.length;c++){var u=l[c];for(D=u;D!==null;){var d=D;switch(d.tag){case 0:case 11:case 15:ps(8,d,a)}var h=d.child;if(h!==null)h.return=d,D=h;else for(;D!==null;){d=D;var p=d.sibling,v=d.return;if(Wp(d),d===u){D=null;break}if(p!==null){p.return=v,D=p;break}D=v}}}var y=a.alternate;if(y!==null){var x=y.child;if(x!==null){y.child=null;do{var N=x.sibling;x.sibling=null,x=N}while(x!==null)}}D=a}}if(a.subtreeFlags&2064&&o!==null)o.return=a,D=o;else e:for(;D!==null;){if(a=D,a.flags&2048)switch(a.tag){case 0:case 11:case 15:ps(9,a,a.return)}var f=a.sibling;if(f!==null){f.return=a.return,D=f;break e}D=a.return}}var g=e.current;for(D=g;D!==null;){o=D;var m=o.child;if(o.subtreeFlags&2064&&m!==null)m.return=o,D=m;else e:for(o=g;D!==null;){if(l=D,l.flags&2048)try{switch(l.tag){case 0:case 11:case 15:_i(9,l)}}catch(j){ye(l,l.return,j)}if(l===o){D=null;break e}var k=l.sibling;if(k!==null){k.return=l.return,D=k;break e}D=l.return}}if(te=s,Rr(),Ft&&typeof Ft.onPostCommitFiberRoot=="function")try{Ft.onPostCommitFiberRoot(gi,e)}catch{}n=!0}return n}finally{se=r,mt.transition=t}}return!1}function rd(e,t,r){t=Un(r,t),t=Pp(e,t,1),e=_r(e,t,1),t=Ke(),e!==null&&(Hs(e,1,t),tt(e,t))}function ye(e,t,r){if(e.tag===3)rd(e,e,r);else for(;t!==null;){if(t.tag===3){rd(t,e,r);break}else if(t.tag===1){var n=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof n.componentDidCatch=="function"&&(jr===null||!jr.has(n))){e=Un(r,e),e=Op(t,e,1),t=_r(t,e,1),e=Ke(),t!==null&&(Hs(t,1,e),tt(t,e));break}}t=t.return}}function Xm(e,t,r){var n=e.pingCache;n!==null&&n.delete(t),t=Ke(),e.pingedLanes|=e.suspendedLanes&r,Ae===e&&(Le&r)===r&&(Te===4||Te===3&&(Le&130023424)===Le&&500>be()-hc?Wr(e,0):dc|=r),tt(e,t)}function Zp(e,t){t===0&&(e.mode&1?(t=ta,ta<<=1,!(ta&130023424)&&(ta=4194304)):t=1);var r=Ke();e=Zt(e,t),e!==null&&(Hs(e,t,r),tt(e,r))}function Zm(e){var t=e.memoizedState,r=0;t!==null&&(r=t.retryLane),Zp(e,r)}function ev(e,t){var r=0;switch(e.tag){case 13:var n=e.stateNode,s=e.memoizedState;s!==null&&(r=s.retryLane);break;case 19:n=e.stateNode;break;default:throw Error(A(314))}n!==null&&n.delete(t),Zp(e,r)}var ef;ef=function(e,t,r){if(e!==null)if(e.memoizedProps!==t.pendingProps||Ze.current)Xe=!0;else{if(!(e.lanes&r)&&!(t.flags&128))return Xe=!1,Mm(e,t,r);Xe=!!(e.flags&131072)}else Xe=!1,de&&t.flags&1048576&&sp(t,Qa,t.index);switch(t.lanes=0,t.tag){case 2:var n=t.type;Oa(e,t),e=t.pendingProps;var s=On(t,Be.current);Cn(t,r),s=ac(null,t,n,e,s,r);var a=ic();return t.flags|=1,typeof s=="object"&&s!==null&&typeof s.render=="function"&&s.$$typeof===void 0?(t.tag=1,t.memoizedState=null,t.updateQueue=null,et(n)?(a=!0,Ja(t)):a=!1,t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,ec(t),s.updater=wi,t.stateNode=s,s._reactInternals=t,Qo(t,n,e,r),t=el(null,t,n,!0,a,r)):(t.tag=0,de&&a&&Kl(t),qe(null,t,s,r),t=t.child),t;case 16:n=t.elementType;e:{switch(Oa(e,t),e=t.pendingProps,s=n._init,n=s(n._payload),t.type=n,s=t.tag=rv(n),e=St(n,e),s){case 0:t=Zo(null,t,n,e,r);break e;case 1:t=qu(null,t,n,e,r);break e;case 11:t=Hu(null,t,n,e,r);break e;case 14:t=Vu(null,t,n,St(n.type,e),r);break e}throw Error(A(306,n,""))}return t;case 0:return n=t.type,s=t.pendingProps,s=t.elementType===n?s:St(n,s),Zo(e,t,n,s,r);case 1:return n=t.type,s=t.pendingProps,s=t.elementType===n?s:St(n,s),qu(e,t,n,s,r);case 3:e:{if(Up(t),e===null)throw Error(A(387));n=t.pendingProps,a=t.memoizedState,s=a.element,up(e,t),ei(t,n,null,r);var o=t.memoizedState;if(n=o.element,a.isDehydrated)if(a={element:n,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},t.updateQueue.baseState=a,t.memoizedState=a,t.flags&256){s=Un(Error(A(423)),t),t=Ku(e,t,n,r,s);break e}else if(n!==s){s=Un(Error(A(424)),t),t=Ku(e,t,n,r,s);break e}else for(at=wr(t.stateNode.containerInfo.firstChild),it=t,de=!0,Tt=null,r=lp(t,null,n,r),t.child=r;r;)r.flags=r.flags&-3|4096,r=r.sibling;else{if(Ln(),n===s){t=er(e,t,r);break e}qe(e,t,n,r)}t=t.child}return t;case 5:return dp(t),e===null&&Go(t),n=t.type,s=t.pendingProps,a=e!==null?e.memoizedProps:null,o=s.children,Wo(n,s)?o=null:a!==null&&Wo(n,a)&&(t.flags|=32),Ip(e,t),qe(e,t,o,r),t.child;case 6:return e===null&&Go(t),null;case 13:return zp(e,t,r);case 4:return tc(t,t.stateNode.containerInfo),n=t.pendingProps,e===null?t.child=$n(t,null,n,r):qe(e,t,n,r),t.child;case 11:return n=t.type,s=t.pendingProps,s=t.elementType===n?s:St(n,s),Hu(e,t,n,s,r);case 7:return qe(e,t,t.pendingProps,r),t.child;case 8:return qe(e,t,t.pendingProps.children,r),t.child;case 12:return qe(e,t,t.pendingProps.children,r),t.child;case 10:e:{if(n=t.type._context,s=t.pendingProps,a=t.memoizedProps,o=s.value,oe(Xa,n._currentValue),n._currentValue=o,a!==null)if(Rt(a.value,o)){if(a.children===s.children&&!Ze.current){t=er(e,t,r);break e}}else for(a=t.child,a!==null&&(a.return=t);a!==null;){var l=a.dependencies;if(l!==null){o=a.child;for(var c=l.firstContext;c!==null;){if(c.context===n){if(a.tag===1){c=Yt(-1,r&-r),c.tag=2;var u=a.updateQueue;if(u!==null){u=u.shared;var d=u.pending;d===null?c.next=c:(c.next=d.next,d.next=c),u.pending=c}}a.lanes|=r,c=a.alternate,c!==null&&(c.lanes|=r),Jo(a.return,r,t),l.lanes|=r;break}c=c.next}}else if(a.tag===10)o=a.type===t.type?null:a.child;else if(a.tag===18){if(o=a.return,o===null)throw Error(A(341));o.lanes|=r,l=o.alternate,l!==null&&(l.lanes|=r),Jo(o,r,t),o=a.sibling}else o=a.child;if(o!==null)o.return=a;else for(o=a;o!==null;){if(o===t){o=null;break}if(a=o.sibling,a!==null){a.return=o.return,o=a;break}o=o.return}a=o}qe(e,t,s.children,r),t=t.child}return t;case 9:return s=t.type,n=t.pendingProps.children,Cn(t,r),s=vt(s),n=n(s),t.flags|=1,qe(e,t,n,r),t.child;case 14:return n=t.type,s=St(n,t.pendingProps),s=St(n.type,s),Vu(e,t,n,s,r);case 15:return Lp(e,t,t.type,t.pendingProps,r);case 17:return n=t.type,s=t.pendingProps,s=t.elementType===n?s:St(n,s),Oa(e,t),t.tag=1,et(n)?(e=!0,Ja(t)):e=!1,Cn(t,r),Rp(t,n,s),Qo(t,n,s,r),el(null,t,n,!0,e,r);case 19:return Dp(e,t,r);case 22:return $p(e,t,r)}throw Error(A(156,t.tag))};function tf(e,t){return Th(e,t)}function tv(e,t,r,n){this.tag=e,this.key=r,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=n,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function gt(e,t,r,n){return new tv(e,t,r,n)}function mc(e){return e=e.prototype,!(!e||!e.isReactComponent)}function rv(e){if(typeof e=="function")return mc(e)?1:0;if(e!=null){if(e=e.$$typeof,e===$l)return 11;if(e===Il)return 14}return 2}function Nr(e,t){var r=e.alternate;return r===null?(r=gt(e.tag,t,e.key,e.mode),r.elementType=e.elementType,r.type=e.type,r.stateNode=e.stateNode,r.alternate=e,e.alternate=r):(r.pendingProps=t,r.type=e.type,r.flags=0,r.subtreeFlags=0,r.deletions=null),r.flags=e.flags&14680064,r.childLanes=e.childLanes,r.lanes=e.lanes,r.child=e.child,r.memoizedProps=e.memoizedProps,r.memoizedState=e.memoizedState,r.updateQueue=e.updateQueue,t=e.dependencies,r.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},r.sibling=e.sibling,r.index=e.index,r.ref=e.ref,r}function Ia(e,t,r,n,s,a){var o=2;if(n=e,typeof e=="function")mc(e)&&(o=1);else if(typeof e=="string")o=5;else e:switch(e){case hn:return Hr(r.children,s,a,t);case Ll:o=8,s|=8;break;case bo:return e=gt(12,r,t,s|2),e.elementType=bo,e.lanes=a,e;case wo:return e=gt(13,r,t,s),e.elementType=wo,e.lanes=a,e;case _o:return e=gt(19,r,t,s),e.elementType=_o,e.lanes=a,e;case dh:return Si(r,s,a,t);default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case ch:o=10;break e;case uh:o=9;break e;case $l:o=11;break e;case Il:o=14;break e;case cr:o=16,n=null;break e}throw Error(A(130,e==null?e:typeof e,""))}return t=gt(o,r,t,s),t.elementType=e,t.type=n,t.lanes=a,t}function Hr(e,t,r,n){return e=gt(7,e,n,t),e.lanes=r,e}function Si(e,t,r,n){return e=gt(22,e,n,t),e.elementType=dh,e.lanes=r,e.stateNode={isHidden:!1},e}function ao(e,t,r){return e=gt(6,e,null,t),e.lanes=r,e}function io(e,t,r){return t=gt(4,e.children!==null?e.children:[],e.key,t),t.lanes=r,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}function nv(e,t,r,n,s){this.tag=t,this.containerInfo=e,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Fi(0),this.expirationTimes=Fi(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Fi(0),this.identifierPrefix=n,this.onRecoverableError=s,this.mutableSourceEagerHydrationData=null}function vc(e,t,r,n,s,a,o,l,c){return e=new nv(e,t,r,l,c),t===1?(t=1,a===!0&&(t|=8)):t=0,a=gt(3,null,null,t),e.current=a,a.stateNode=e,a.memoizedState={element:n,isDehydrated:r,cache:null,transitions:null,pendingSuspenseBoundaries:null},ec(a),e}function sv(e,t,r){var n=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:dn,key:n==null?null:""+n,children:e,containerInfo:t,implementation:r}}function rf(e){if(!e)return Tr;e=e._reactInternals;e:{if(Qr(e)!==e||e.tag!==1)throw Error(A(170));var t=e;do{switch(t.tag){case 3:t=t.stateNode.context;break e;case 1:if(et(t.type)){t=t.stateNode.__reactInternalMemoizedMergedChildContext;break e}}t=t.return}while(t!==null);throw Error(A(171))}if(e.tag===1){var r=e.type;if(et(r))return rp(e,r,t)}return t}function nf(e,t,r,n,s,a,o,l,c){return e=vc(r,n,!0,e,s,a,o,l,c),e.context=rf(null),r=e.current,n=Ke(),s=Sr(r),a=Yt(n,s),a.callback=t??null,_r(r,a,s),e.current.lanes=s,Hs(e,s,n),tt(e,n),e}function Ni(e,t,r,n){var s=t.current,a=Ke(),o=Sr(s);return r=rf(r),t.context===null?t.context=r:t.pendingContext=r,t=Yt(a,o),t.payload={element:e},n=n===void 0?null:n,n!==null&&(t.callback=n),e=_r(s,t,o),e!==null&&(At(e,s,o,a),Aa(e,s,o)),o}function li(e){if(e=e.current,!e.child)return null;switch(e.child.tag){case 5:return e.child.stateNode;default:return e.child.stateNode}}function nd(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var r=e.retryLane;e.retryLane=r!==0&&r<t?r:t}}function yc(e,t){nd(e,t),(e=e.alternate)&&nd(e,t)}function av(){return null}var sf=typeof reportError=="function"?reportError:function(e){console.error(e)};function xc(e){this._internalRoot=e}Ei.prototype.render=xc.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(A(409));Ni(e,t,null,null)};Ei.prototype.unmount=xc.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Jr(function(){Ni(null,e,null,null)}),t[Xt]=null}};function Ei(e){this._internalRoot=e}Ei.prototype.unstable_scheduleHydration=function(e){if(e){var t=$h();e={blockedOn:null,target:e,priority:t};for(var r=0;r<pr.length&&t!==0&&t<pr[r].priority;r++);pr.splice(r,0,e),r===0&&Uh(e)}};function kc(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function Ti(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11&&(e.nodeType!==8||e.nodeValue!==" react-mount-point-unstable "))}function sd(){}function iv(e,t,r,n,s){if(s){if(typeof n=="function"){var a=n;n=function(){var u=li(o);a.call(u)}}var o=nf(t,n,e,0,null,!1,!1,"",sd);return e._reactRootContainer=o,e[Xt]=o.current,Es(e.nodeType===8?e.parentNode:e),Jr(),o}for(;s=e.lastChild;)e.removeChild(s);if(typeof n=="function"){var l=n;n=function(){var u=li(c);l.call(u)}}var c=vc(e,0,!1,null,null,!1,!1,"",sd);return e._reactRootContainer=c,e[Xt]=c.current,Es(e.nodeType===8?e.parentNode:e),Jr(function(){Ni(t,c,r,n)}),c}function Ci(e,t,r,n,s){var a=r._reactRootContainer;if(a){var o=a;if(typeof s=="function"){var l=s;s=function(){var c=li(o);l.call(c)}}Ni(t,o,e,s)}else o=iv(r,t,e,s,n);return li(o)}Oh=function(e){switch(e.tag){case 3:var t=e.stateNode;if(t.current.memoizedState.isDehydrated){var r=ns(t.pendingLanes);r!==0&&(Dl(t,r|1),tt(t,be()),!(te&6)&&(zn=be()+500,Rr()))}break;case 13:Jr(function(){var n=Zt(e,1);if(n!==null){var s=Ke();At(n,e,1,s)}}),yc(e,1)}};Fl=function(e){if(e.tag===13){var t=Zt(e,134217728);if(t!==null){var r=Ke();At(t,e,134217728,r)}yc(e,134217728)}};Lh=function(e){if(e.tag===13){var t=Sr(e),r=Zt(e,t);if(r!==null){var n=Ke();At(r,e,t,n)}yc(e,t)}};$h=function(){return se};Ih=function(e,t){var r=se;try{return se=e,t()}finally{se=r}};Oo=function(e,t,r){switch(t){case"input":if(No(e,r),t=r.name,r.type==="radio"&&t!=null){for(r=e;r.parentNode;)r=r.parentNode;for(r=r.querySelectorAll("input[name="+JSON.stringify(""+t)+'][type="radio"]'),t=0;t<r.length;t++){var n=r[t];if(n!==e&&n.form===e.form){var s=xi(n);if(!s)throw Error(A(90));ph(n),No(n,s)}}}break;case"textarea":gh(e,r);break;case"select":t=r.value,t!=null&&Sn(e,!!r.multiple,t,!1)}};wh=pc;_h=Jr;var ov={usingClientEntryPoint:!1,Events:[qs,mn,xi,kh,bh,pc]},Xn={findFiberByHostInstance:zr,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},lv={bundleType:Xn.bundleType,version:Xn.version,rendererPackageName:Xn.rendererPackageName,rendererConfig:Xn.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:tr.ReactCurrentDispatcher,findHostInstanceByFiber:function(e){return e=Nh(e),e===null?null:e.stateNode},findFiberByHostInstance:Xn.findFiberByHostInstance||av,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var ha=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!ha.isDisabled&&ha.supportsFiber)try{gi=ha.inject(lv),Ft=ha}catch{}}lt.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=ov;lt.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!kc(t))throw Error(A(200));return sv(e,t,null,r)};lt.createRoot=function(e,t){if(!kc(e))throw Error(A(299));var r=!1,n="",s=sf;return t!=null&&(t.unstable_strictMode===!0&&(r=!0),t.identifierPrefix!==void 0&&(n=t.identifierPrefix),t.onRecoverableError!==void 0&&(s=t.onRecoverableError)),t=vc(e,1,!1,null,null,r,!1,n,s),e[Xt]=t.current,Es(e.nodeType===8?e.parentNode:e),new xc(t)};lt.findDOMNode=function(e){if(e==null)return null;if(e.nodeType===1)return e;var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(A(188)):(e=Object.keys(e).join(","),Error(A(268,e)));return e=Nh(t),e=e===null?null:e.stateNode,e};lt.flushSync=function(e){return Jr(e)};lt.hydrate=function(e,t,r){if(!Ti(t))throw Error(A(200));return Ci(null,e,t,!0,r)};lt.hydrateRoot=function(e,t,r){if(!kc(e))throw Error(A(405));var n=r!=null&&r.hydratedSources||null,s=!1,a="",o=sf;if(r!=null&&(r.unstable_strictMode===!0&&(s=!0),r.identifierPrefix!==void 0&&(a=r.identifierPrefix),r.onRecoverableError!==void 0&&(o=r.onRecoverableError)),t=nf(t,null,e,1,r??null,s,!1,a,o),e[Xt]=t.current,Es(e),n)for(e=0;e<n.length;e++)r=n[e],s=r._getVersion,s=s(r._source),t.mutableSourceEagerHydrationData==null?t.mutableSourceEagerHydrationData=[r,s]:t.mutableSourceEagerHydrationData.push(r,s);return new Ei(t)};lt.render=function(e,t,r){if(!Ti(t))throw Error(A(200));return Ci(null,e,t,!1,r)};lt.unmountComponentAtNode=function(e){if(!Ti(e))throw Error(A(40));return e._reactRootContainer?(Jr(function(){Ci(null,null,e,!1,function(){e._reactRootContainer=null,e[Xt]=null})}),!0):!1};lt.unstable_batchedUpdates=pc;lt.unstable_renderSubtreeIntoContainer=function(e,t,r,n){if(!Ti(r))throw Error(A(200));if(e==null||e._reactInternals===void 0)throw Error(A(38));return Ci(e,t,r,!1,n)};lt.version="18.3.1-next-f1338f8080-20240426";function af(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(af)}catch(e){console.error(e)}}af(),ah.exports=lt;var cv=ah.exports,ad=cv;xo.createRoot=ad.createRoot,xo.hydrateRoot=ad.hydrateRoot;function uv({open:e,onClose:t,session:r,loading:n,onSignIn:s,onSignUp:a}){const[o,l]=I.useState("signin"),[c,u]=I.useState({fullName:"",email:"",password:""}),[d,h]=I.useState(""),p=!!(r!=null&&r.user),v=I.useMemo(()=>o==="signin"?"Welcome back":"Create your founder account",[o]);if(!e)return null;const y=N=>f=>{u(g=>({...g,[N]:f.target.value}))},x=async N=>{N.preventDefault(),h("");try{o==="signin"?(await s({email:c.email,password:c.password}),h("You are signed in.")):(await a(c),h("Your account request was received. Check your inbox if confirmation is enabled."))}catch(f){h(f.message)}};return i.jsx("div",{className:"modal-backdrop",role:"presentation",onClick:t,children:i.jsxs("div",{className:"modal-card",role:"dialog","aria-modal":"true",onClick:N=>N.stopPropagation(),children:[i.jsx("button",{type:"button",className:"modal-close",onClick:t,"aria-label":"Close",children:"x"}),p?i.jsxs("div",{className:"auth-success",children:[i.jsx("p",{className:"eyebrow",children:"Welcome Back"}),i.jsx("h2",{children:"You are signed in."}),i.jsx("p",{children:r.user.email})]}):i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"section-heading compact-heading",children:[i.jsx("p",{className:"eyebrow",children:"Founder Access"}),i.jsx("h2",{children:v})]}),i.jsxs("div",{className:"auth-switch",children:[i.jsx("button",{type:"button",className:o==="signin"?"toggle-option active":"toggle-option",onClick:()=>l("signin"),children:"Sign In"}),i.jsx("button",{type:"button",className:o==="signup"?"toggle-option active":"toggle-option",onClick:()=>l("signup"),children:"Sign Up"})]}),i.jsxs("form",{className:"auth-form",onSubmit:x,children:[o==="signup"&&i.jsx("input",{type:"text",value:c.fullName,onChange:y("fullName"),placeholder:"Your name",required:!0}),i.jsx("input",{type:"email",value:c.email,onChange:y("email"),placeholder:"Email address",required:!0}),i.jsx("input",{type:"password",value:c.password,onChange:y("password"),placeholder:"Password",required:!0}),i.jsx("button",{type:"submit",className:"primary-btn",disabled:n,children:n?"Loading...":o==="signin"?"Sign In":"Create Account"})]})]}),d&&i.jsx("p",{className:"form-status",children:d})]})})}const oo={hero:{eyebrow:"Support for new founders and early startup teams",title:"Launch your startup with confidence.",text:"Venture Path helps founders turn ideas into clear startup plans, legal steps, launch actions, and growth progress.",image:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80"},heroStats:[{value:"4x",label:"faster launch momentum"},{value:"24/7",label:"always-on support"},{value:"100%",label:"clear across every screen"}],faqs:[{question:"Who is Venture Path for?",answer:"It is made for new founders, future founders, early-stage startup teams, and people with an idea who need guidance."},{question:"What kind of support does Venture Path offer?",answer:"It helps you understand your idea, prepare the right legal steps, organize your launch, and move forward with more clarity."},{question:"Do I need to already have a startup?",answer:"No. It is also useful if you are still shaping your idea and want help deciding what to do next."},{question:"How does it help me move forward?",answer:"Each track gives you practical guidance, clear next steps, and a stronger sense of direction so you can act with confidence."}]},dv=[{value:120,suffix:"+",label:"founders supported"},{value:45,suffix:"%",label:"faster early decisions"},{value:300,suffix:"+",label:"ideas shaped into action"},{value:24,suffix:"/7",label:"guidance when needed"}],hv=[{icon:"01",title:"Clear Direction",text:"Get support that helps you understand what your startup is solving and where to focus first."},{icon:"02",title:"Less Guesswork",text:"Move forward with practical steps instead of feeling stuck between too many ideas or unknowns."},{icon:"03",title:"Stronger Preparation",text:"Prepare your legal steps, launch actions, and early decisions with more confidence."},{icon:"04",title:"Better Progress",text:"Turn your idea into clear next actions so your startup keeps moving in the right direction."}],id=[{id:"track-a",directHref:"#track1-analyzer",track:"Track A",icon:"A",title:"Validate Your Idea",description:"Find out if your idea is strong enough to move forward.",highlights:["Market clarity","Risk check","MVP direction"],badge:"Best for new ideas",pageTitle:"Validate your idea with more clarity and less guesswork.",pageText:"This path helps founders step back, test the strength of their idea, and understand what deserves time, energy, and early investment.",steps:["Clarify the problem you want to solve","Understand who your first customers are","Compare your direction with the market around you","Decide what to build first and what can wait"],outcomeTitle:"What you gain",outcomeText:"You leave with a clearer view of your startup direction and a stronger sense of whether to move forward, improve the idea, or rethink the path."},{id:"track-b",track:"Track B",icon:"B",title:"Start the Right Way",description:"Understand the legal and administrative steps to start properly in Tunisia.",highlights:["Legal roadmap","Document checklist","Startup Act readiness"],badge:"Best for setup",pageTitle:"Start with the right structure and fewer missed steps.",pageText:"This path helps founders understand the important legal and administrative steps so they can build on a more solid base from the beginning.",steps:["Choose the company structure that fits your situation","Prepare the main documents you may need","Follow the important registration steps in order","Reduce confusion around deadlines and readiness"],outcomeTitle:"What you gain",outcomeText:"You leave with a clearer roadmap for starting properly in Tunisia and a better understanding of what to prepare next."},{id:"track-c",track:"Track C",icon:"C",title:"Launch & Grow",description:"Turn your plan into clear actions, better pitches, and growth steps.",highlights:["Launch plan","Pitch support","Growth tracking"],badge:"Best for execution",pageTitle:"Move from planning into launch with more confidence.",pageText:"This path helps founders turn ideas and plans into visible progress through clearer actions, stronger communication, and a more organized launch rhythm.",steps:["Break your next phase into practical tasks and milestones","Improve how you present your startup to others","Prepare simple actions that support early growth","Stay focused on progress without losing momentum"],outcomeTitle:"What you gain",outcomeText:"You leave with a more organized launch path, clearer priorities, and practical next steps you can act on right away."}],pv=[{tag:"Founder Story",title:"A founder preparing for launch",text:"A clearer way to explain the idea, show value, and feel more ready to speak with clients and partners.",image:"https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"},{tag:"Team Progress",title:"A team shaping its startup direction",text:"Simple structure and clear messaging that help early-stage teams organize what matters most.",image:"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"},{tag:"Growth Steps",title:"A startup getting ready to grow",text:"A warm, professional presentation that helps founders look ready for the next stage of their journey.",image:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"}],Ua=[{id:"local-1",quote:"This kind of support gives founders a clearer way to present their idea and move forward with more confidence.",name:"Amira Ben Salah",role:"Startup Program Lead",rating:5},{id:"local-2",quote:"It feels warm, simple, and easy to trust. That matters a lot when someone is still building their startup path.",name:"Youssef Trabelsi",role:"Innovation Mentor",rating:5},{id:"local-3",quote:"The message is clear and encouraging. It helps founders feel supported instead of overwhelmed.",name:"Sarra Jaziri",role:"Product Founder",rating:4}];function Ai(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var s=0,n=Object.getOwnPropertySymbols(e);s<n.length;s++)t.indexOf(n[s])<0&&Object.prototype.propertyIsEnumerable.call(e,n[s])&&(r[n[s]]=e[n[s]]);return r}function fv(e,t,r,n){function s(a){return a instanceof r?a:new r(function(o){o(a)})}return new(r||(r=Promise))(function(a,o){function l(d){try{u(n.next(d))}catch(h){o(h)}}function c(d){try{u(n.throw(d))}catch(h){o(h)}}function u(d){d.done?a(d.value):s(d.value).then(l,c)}u((n=n.apply(e,t||[])).next())})}const gv=e=>e?(...t)=>e(...t):(...t)=>fetch(...t);class bc extends Error{constructor(t,r="FunctionsError",n){super(t),this.name=r,this.context=n}toJSON(){return{name:this.name,message:this.message,context:this.context}}}class mv extends bc{constructor(t){super("Failed to send a request to the Edge Function","FunctionsFetchError",t)}}class od extends bc{constructor(t){super("Relay Error invoking the Edge Function","FunctionsRelayError",t)}}class ld extends bc{constructor(t){super("Edge Function returned a non-2xx status code","FunctionsHttpError",t)}}var hl;(function(e){e.Any="any",e.ApNortheast1="ap-northeast-1",e.ApNortheast2="ap-northeast-2",e.ApSouth1="ap-south-1",e.ApSoutheast1="ap-southeast-1",e.ApSoutheast2="ap-southeast-2",e.CaCentral1="ca-central-1",e.EuCentral1="eu-central-1",e.EuWest1="eu-west-1",e.EuWest2="eu-west-2",e.EuWest3="eu-west-3",e.SaEast1="sa-east-1",e.UsEast1="us-east-1",e.UsWest1="us-west-1",e.UsWest2="us-west-2"})(hl||(hl={}));class vv{constructor(t,{headers:r={},customFetch:n,region:s=hl.Any}={}){this.url=t,this.headers=r,this.region=s,this.fetch=gv(n)}setAuth(t){this.headers.Authorization=`Bearer ${t}`}invoke(t){return fv(this,arguments,void 0,function*(r,n={}){var s;let a,o;try{const{headers:l,method:c,body:u,signal:d,timeout:h}=n;let p={},{region:v}=n;v||(v=this.region);const y=new URL(`${this.url}/${r}`);v&&v!=="any"&&(p["x-region"]=v,y.searchParams.set("forceFunctionRegion",v));let x;u&&(l&&!Object.prototype.hasOwnProperty.call(l,"Content-Type")||!l)?typeof Blob<"u"&&u instanceof Blob||u instanceof ArrayBuffer?(p["Content-Type"]="application/octet-stream",x=u):typeof u=="string"?(p["Content-Type"]="text/plain",x=u):typeof FormData<"u"&&u instanceof FormData?x=u:(p["Content-Type"]="application/json",x=JSON.stringify(u)):u&&typeof u!="string"&&!(typeof Blob<"u"&&u instanceof Blob)&&!(u instanceof ArrayBuffer)&&!(typeof FormData<"u"&&u instanceof FormData)?x=JSON.stringify(u):x=u;let N=d;h&&(o=new AbortController,a=setTimeout(()=>o.abort(),h),d?(N=o.signal,d.addEventListener("abort",()=>o.abort())):N=o.signal);const f=yield this.fetch(y.toString(),{method:c||"POST",headers:Object.assign(Object.assign(Object.assign({},p),this.headers),l),body:x,signal:N}).catch(j=>{throw new mv(j)}),g=f.headers.get("x-relay-error");if(g&&g==="true")throw new od(f);if(!f.ok)throw new ld(f);let m=((s=f.headers.get("Content-Type"))!==null&&s!==void 0?s:"text/plain").split(";")[0].trim(),k;return m==="application/json"?k=yield f.json():m==="application/octet-stream"||m==="application/pdf"?k=yield f.blob():m==="text/event-stream"?k=f:m==="multipart/form-data"?k=yield f.formData():k=yield f.text(),{data:k,error:null,response:f}}catch(l){return{data:null,error:l,response:l instanceof ld||l instanceof od?l.context:void 0}}finally{a&&clearTimeout(a)}})}}const of=3,cd=e=>Math.min(1e3*2**e,3e4),yv=[520,503],lf=["GET","HEAD","OPTIONS"];var xv=class extends Error{constructor(e){super(e.message),this.name="PostgrestError",this.details=e.details,this.hint=e.hint,this.code=e.code}toJSON(){return{name:this.name,message:this.message,details:this.details,hint:this.hint,code:this.code}}};function ud(e,t){return new Promise(r=>{if(t!=null&&t.aborted){r();return}const n=setTimeout(()=>{t==null||t.removeEventListener("abort",s),r()},e);function s(){clearTimeout(n),r()}t==null||t.addEventListener("abort",s)})}function kv(e,t,r,n){return!(!n||r>=of||!lf.includes(e)||!yv.includes(t))}var bv=class{constructor(e){var t,r,n,s,a;this.shouldThrowOnError=!1,this.retryEnabled=!0,this.method=e.method,this.url=e.url,this.headers=new Headers(e.headers),this.schema=e.schema,this.body=e.body,this.shouldThrowOnError=(t=e.shouldThrowOnError)!==null&&t!==void 0?t:!1,this.signal=e.signal,this.isMaybeSingle=(r=e.isMaybeSingle)!==null&&r!==void 0?r:!1,this.shouldStripNulls=(n=e.shouldStripNulls)!==null&&n!==void 0?n:!1,this.urlLengthLimit=(s=e.urlLengthLimit)!==null&&s!==void 0?s:8e3,this.retryEnabled=(a=e.retry)!==null&&a!==void 0?a:!0,e.fetch?this.fetch=e.fetch:this.fetch=fetch}throwOnError(){return this.shouldThrowOnError=!0,this}stripNulls(){if(this.headers.get("Accept")==="text/csv")throw new Error("stripNulls() cannot be used with csv()");return this.shouldStripNulls=!0,this}setHeader(e,t){return this.headers=new Headers(this.headers),this.headers.set(e,t),this}retry(e){return this.retryEnabled=e,this}then(e,t){var r=this;if(this.schema===void 0||(["GET","HEAD"].includes(this.method)?this.headers.set("Accept-Profile",this.schema):this.headers.set("Content-Profile",this.schema)),this.method!=="GET"&&this.method!=="HEAD"&&this.headers.set("Content-Type","application/json"),this.shouldStripNulls){const o=this.headers.get("Accept");o==="application/vnd.pgrst.object+json"?this.headers.set("Accept","application/vnd.pgrst.object+json;nulls=stripped"):(!o||o==="application/json")&&this.headers.set("Accept","application/vnd.pgrst.array+json;nulls=stripped")}const n=this.fetch;let a=(async()=>{let o=0;for(;;){const u=new Headers(r.headers);o>0&&u.set("X-Retry-Count",String(o));let d;try{d=await n(r.url.toString(),{method:r.method,headers:u,body:JSON.stringify(r.body,(h,p)=>typeof p=="bigint"?p.toString():p),signal:r.signal})}catch(h){if((h==null?void 0:h.name)==="AbortError"||(h==null?void 0:h.code)==="ABORT_ERR"||!lf.includes(r.method))throw h;if(r.retryEnabled&&o<of){const p=cd(o);o++,await ud(p,r.signal);continue}throw h}if(kv(r.method,d.status,o,r.retryEnabled)){var l,c;const h=(l=(c=d.headers)===null||c===void 0?void 0:c.get("Retry-After"))!==null&&l!==void 0?l:null,p=h!==null?Math.max(0,parseInt(h,10)||0)*1e3:cd(o);await d.text(),o++,await ud(p,r.signal);continue}return await r.processResponse(d)}})();return this.shouldThrowOnError||(a=a.catch(o=>{var l;let c="",u="",d="";const h=o==null?void 0:o.cause;if(h){var p,v,y,x;const g=(p=h==null?void 0:h.message)!==null&&p!==void 0?p:"",m=(v=h==null?void 0:h.code)!==null&&v!==void 0?v:"";c=`${(y=o==null?void 0:o.name)!==null&&y!==void 0?y:"FetchError"}: ${o==null?void 0:o.message}`,c+=`

Caused by: ${(x=h==null?void 0:h.name)!==null&&x!==void 0?x:"Error"}: ${g}`,m&&(c+=` (${m})`),h!=null&&h.stack&&(c+=`
${h.stack}`)}else{var N;c=(N=o==null?void 0:o.stack)!==null&&N!==void 0?N:""}const f=this.url.toString().length;return(o==null?void 0:o.name)==="AbortError"||(o==null?void 0:o.code)==="ABORT_ERR"?(d="",u="Request was aborted (timeout or manual cancellation)",f>this.urlLengthLimit&&(u+=`. Note: Your request URL is ${f} characters, which may exceed server limits. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [many IDs])), consider using an RPC function to pass values server-side.`)):((h==null?void 0:h.name)==="HeadersOverflowError"||(h==null?void 0:h.code)==="UND_ERR_HEADERS_OVERFLOW")&&(d="",u="HTTP headers exceeded server limits (typically 16KB)",f>this.urlLengthLimit&&(u+=`. Your request URL is ${f} characters. If selecting many fields, consider using views. If filtering with large arrays (e.g., .in('id', [200+ IDs])), consider using an RPC function instead.`)),{success:!1,error:{message:`${(l=o==null?void 0:o.name)!==null&&l!==void 0?l:"FetchError"}: ${o==null?void 0:o.message}`,details:c,hint:u,code:d},data:null,count:null,status:0,statusText:""}})),a.then(e,t)}async processResponse(e){var t=this;let r=null,n=null,s=null,a=e.status,o=e.statusText;if(e.ok){var l,c;if(t.method!=="HEAD"){var u;const p=await e.text();p===""||(t.headers.get("Accept")==="text/csv"||t.headers.get("Accept")&&(!((u=t.headers.get("Accept"))===null||u===void 0)&&u.includes("application/vnd.pgrst.plan+text"))?n=p:n=JSON.parse(p))}const d=(l=t.headers.get("Prefer"))===null||l===void 0?void 0:l.match(/count=(exact|planned|estimated)/),h=(c=e.headers.get("content-range"))===null||c===void 0?void 0:c.split("/");d&&h&&h.length>1&&(s=parseInt(h[1])),t.isMaybeSingle&&Array.isArray(n)&&(n.length>1?(r={code:"PGRST116",details:`Results contain ${n.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:"JSON object requested, multiple (or no) rows returned"},n=null,s=null,a=406,o="Not Acceptable"):n.length===1?n=n[0]:n=null)}else{const d=await e.text();try{r=JSON.parse(d),Array.isArray(r)&&e.status===404&&(n=[],r=null,a=200,o="OK")}catch{e.status===404&&d===""?(a=204,o="No Content"):r={message:d}}if(r&&t.shouldThrowOnError)throw new xv(r)}return{success:r===null,error:r,data:n,count:s,status:a,statusText:o}}returns(){return this}overrideTypes(){return this}},wv=class extends bv{select(e){let t=!1;const r=(e??"*").split("").map(n=>/\s/.test(n)&&!t?"":(n==='"'&&(t=!t),n)).join("");return this.url.searchParams.set("select",r),this.headers.append("Prefer","return=representation"),this}order(e,{ascending:t=!0,nullsFirst:r,foreignTable:n,referencedTable:s=n}={}){const a=s?`${s}.order`:"order",o=this.url.searchParams.get(a);return this.url.searchParams.set(a,`${o?`${o},`:""}${e}.${t?"asc":"desc"}${r===void 0?"":r?".nullsfirst":".nullslast"}`),this}limit(e,{foreignTable:t,referencedTable:r=t}={}){const n=typeof r>"u"?"limit":`${r}.limit`;return this.url.searchParams.set(n,`${e}`),this}range(e,t,{foreignTable:r,referencedTable:n=r}={}){const s=typeof n>"u"?"offset":`${n}.offset`,a=typeof n>"u"?"limit":`${n}.limit`;return this.url.searchParams.set(s,`${e}`),this.url.searchParams.set(a,`${t-e+1}`),this}abortSignal(e){return this.signal=e,this}single(){return this.headers.set("Accept","application/vnd.pgrst.object+json"),this}maybeSingle(){return this.isMaybeSingle=!0,this}csv(){return this.headers.set("Accept","text/csv"),this}geojson(){return this.headers.set("Accept","application/geo+json"),this}explain({analyze:e=!1,verbose:t=!1,settings:r=!1,buffers:n=!1,wal:s=!1,format:a="text"}={}){var o;const l=[e?"analyze":null,t?"verbose":null,r?"settings":null,n?"buffers":null,s?"wal":null].filter(Boolean).join("|"),c=(o=this.headers.get("Accept"))!==null&&o!==void 0?o:"application/json";return this.headers.set("Accept",`application/vnd.pgrst.plan+${a}; for="${c}"; options=${l};`),a==="json"?this:this}rollback(){return this.headers.append("Prefer","tx=rollback"),this}returns(){return this}maxAffected(e){return this.headers.append("Prefer","handling=strict"),this.headers.append("Prefer",`max-affected=${e}`),this}};const dd=new RegExp("[,()]");var on=class extends wv{eq(e,t){return this.url.searchParams.append(e,`eq.${t}`),this}neq(e,t){return this.url.searchParams.append(e,`neq.${t}`),this}gt(e,t){return this.url.searchParams.append(e,`gt.${t}`),this}gte(e,t){return this.url.searchParams.append(e,`gte.${t}`),this}lt(e,t){return this.url.searchParams.append(e,`lt.${t}`),this}lte(e,t){return this.url.searchParams.append(e,`lte.${t}`),this}like(e,t){return this.url.searchParams.append(e,`like.${t}`),this}likeAllOf(e,t){return this.url.searchParams.append(e,`like(all).{${t.join(",")}}`),this}likeAnyOf(e,t){return this.url.searchParams.append(e,`like(any).{${t.join(",")}}`),this}ilike(e,t){return this.url.searchParams.append(e,`ilike.${t}`),this}ilikeAllOf(e,t){return this.url.searchParams.append(e,`ilike(all).{${t.join(",")}}`),this}ilikeAnyOf(e,t){return this.url.searchParams.append(e,`ilike(any).{${t.join(",")}}`),this}regexMatch(e,t){return this.url.searchParams.append(e,`match.${t}`),this}regexIMatch(e,t){return this.url.searchParams.append(e,`imatch.${t}`),this}is(e,t){return this.url.searchParams.append(e,`is.${t}`),this}isDistinct(e,t){return this.url.searchParams.append(e,`isdistinct.${t}`),this}in(e,t){const r=Array.from(new Set(t)).map(n=>typeof n=="string"&&dd.test(n)?`"${n}"`:`${n}`).join(",");return this.url.searchParams.append(e,`in.(${r})`),this}notIn(e,t){const r=Array.from(new Set(t)).map(n=>typeof n=="string"&&dd.test(n)?`"${n}"`:`${n}`).join(",");return this.url.searchParams.append(e,`not.in.(${r})`),this}contains(e,t){return typeof t=="string"?this.url.searchParams.append(e,`cs.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cs.{${t.join(",")}}`):this.url.searchParams.append(e,`cs.${JSON.stringify(t)}`),this}containedBy(e,t){return typeof t=="string"?this.url.searchParams.append(e,`cd.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cd.{${t.join(",")}}`):this.url.searchParams.append(e,`cd.${JSON.stringify(t)}`),this}rangeGt(e,t){return this.url.searchParams.append(e,`sr.${t}`),this}rangeGte(e,t){return this.url.searchParams.append(e,`nxl.${t}`),this}rangeLt(e,t){return this.url.searchParams.append(e,`sl.${t}`),this}rangeLte(e,t){return this.url.searchParams.append(e,`nxr.${t}`),this}rangeAdjacent(e,t){return this.url.searchParams.append(e,`adj.${t}`),this}overlaps(e,t){return typeof t=="string"?this.url.searchParams.append(e,`ov.${t}`):this.url.searchParams.append(e,`ov.{${t.join(",")}}`),this}textSearch(e,t,{config:r,type:n}={}){let s="";n==="plain"?s="pl":n==="phrase"?s="ph":n==="websearch"&&(s="w");const a=r===void 0?"":`(${r})`;return this.url.searchParams.append(e,`${s}fts${a}.${t}`),this}match(e){return Object.entries(e).filter(([t,r])=>r!==void 0).forEach(([t,r])=>{this.url.searchParams.append(t,`eq.${r}`)}),this}not(e,t,r){return this.url.searchParams.append(e,`not.${t}.${r}`),this}or(e,{foreignTable:t,referencedTable:r=t}={}){const n=r?`${r}.or`:"or";return this.url.searchParams.append(n,`(${e})`),this}filter(e,t,r){return this.url.searchParams.append(e,`${t}.${r}`),this}},_v=class{constructor(e,{headers:t={},schema:r,fetch:n,urlLengthLimit:s=8e3,retry:a}){this.url=e,this.headers=new Headers(t),this.schema=r,this.fetch=n,this.urlLengthLimit=s,this.retry=a}cloneRequestState(){return{url:new URL(this.url.toString()),headers:new Headers(this.headers)}}select(e,t){const{head:r=!1,count:n}=t??{},s=r?"HEAD":"GET";let a=!1;const o=(e??"*").split("").map(u=>/\s/.test(u)&&!a?"":(u==='"'&&(a=!a),u)).join(""),{url:l,headers:c}=this.cloneRequestState();return l.searchParams.set("select",o),n&&c.append("Prefer",`count=${n}`),new on({method:s,url:l,headers:c,schema:this.schema,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}insert(e,{count:t,defaultToNull:r=!0}={}){var n;const s="POST",{url:a,headers:o}=this.cloneRequestState();if(t&&o.append("Prefer",`count=${t}`),r||o.append("Prefer","missing=default"),Array.isArray(e)){const l=e.reduce((c,u)=>c.concat(Object.keys(u)),[]);if(l.length>0){const c=[...new Set(l)].map(u=>`"${u}"`);a.searchParams.set("columns",c.join(","))}}return new on({method:s,url:a,headers:o,schema:this.schema,body:e,fetch:(n=this.fetch)!==null&&n!==void 0?n:fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}upsert(e,{onConflict:t,ignoreDuplicates:r=!1,count:n,defaultToNull:s=!0}={}){var a;const o="POST",{url:l,headers:c}=this.cloneRequestState();if(c.append("Prefer",`resolution=${r?"ignore":"merge"}-duplicates`),t!==void 0&&l.searchParams.set("on_conflict",t),n&&c.append("Prefer",`count=${n}`),s||c.append("Prefer","missing=default"),Array.isArray(e)){const u=e.reduce((d,h)=>d.concat(Object.keys(h)),[]);if(u.length>0){const d=[...new Set(u)].map(h=>`"${h}"`);l.searchParams.set("columns",d.join(","))}}return new on({method:o,url:l,headers:c,schema:this.schema,body:e,fetch:(a=this.fetch)!==null&&a!==void 0?a:fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}update(e,{count:t}={}){var r;const n="PATCH",{url:s,headers:a}=this.cloneRequestState();return t&&a.append("Prefer",`count=${t}`),new on({method:n,url:s,headers:a,schema:this.schema,body:e,fetch:(r=this.fetch)!==null&&r!==void 0?r:fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}delete({count:e}={}){var t;const r="DELETE",{url:n,headers:s}=this.cloneRequestState();return e&&s.append("Prefer",`count=${e}`),new on({method:r,url:n,headers:s,schema:this.schema,fetch:(t=this.fetch)!==null&&t!==void 0?t:fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}};function Is(e){"@babel/helpers - typeof";return Is=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Is(e)}function jv(e,t){if(Is(e)!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t);if(Is(n)!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Sv(e){var t=jv(e,"string");return Is(t)=="symbol"?t:t+""}function Nv(e,t,r){return(t=Sv(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function hd(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(s){return Object.getOwnPropertyDescriptor(e,s).enumerable})),r.push.apply(r,n)}return r}function pa(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?hd(Object(r),!0).forEach(function(n){Nv(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):hd(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}var Ev=class cf{constructor(t,{headers:r={},schema:n,fetch:s,timeout:a,urlLengthLimit:o=8e3,retry:l}={}){this.url=t,this.headers=new Headers(r),this.schemaName=n,this.urlLengthLimit=o;const c=s??globalThis.fetch;a!==void 0&&a>0?this.fetch=(u,d)=>{const h=new AbortController,p=setTimeout(()=>h.abort(),a),v=d==null?void 0:d.signal;if(v){if(v.aborted)return clearTimeout(p),c(u,d);const y=()=>{clearTimeout(p),h.abort()};return v.addEventListener("abort",y,{once:!0}),c(u,pa(pa({},d),{},{signal:h.signal})).finally(()=>{clearTimeout(p),v.removeEventListener("abort",y)})}return c(u,pa(pa({},d),{},{signal:h.signal})).finally(()=>clearTimeout(p))}:this.fetch=c,this.retry=l}from(t){if(!t||typeof t!="string"||t.trim()==="")throw new Error("Invalid relation name: relation must be a non-empty string.");return new _v(new URL(`${this.url}/${t}`),{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}schema(t){return new cf(this.url,{headers:this.headers,schema:t,fetch:this.fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}rpc(t,r={},{head:n=!1,get:s=!1,count:a}={}){var o;let l;const c=new URL(`${this.url}/rpc/${t}`);let u;const d=v=>v!==null&&typeof v=="object"&&(!Array.isArray(v)||v.some(d)),h=n&&Object.values(r).some(d);h?(l="POST",u=r):n||s?(l=n?"HEAD":"GET",Object.entries(r).filter(([v,y])=>y!==void 0).map(([v,y])=>[v,Array.isArray(y)?`{${y.join(",")}}`:`${y}`]).forEach(([v,y])=>{c.searchParams.append(v,y)})):(l="POST",u=r);const p=new Headers(this.headers);return h?p.set("Prefer",a?`count=${a},return=minimal`:"return=minimal"):a&&p.set("Prefer",`count=${a}`),new on({method:l,url:c,headers:p,schema:this.schemaName,body:u,fetch:(o=this.fetch)!==null&&o!==void 0?o:fetch,urlLengthLimit:this.urlLengthLimit,retry:this.retry})}};class Tv{constructor(){}static detectEnvironment(){var t;if(typeof WebSocket<"u")return{type:"native",constructor:WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocket<"u")return{type:"native",constructor:globalThis.WebSocket};if(typeof global<"u"&&typeof global.WebSocket<"u")return{type:"native",constructor:global.WebSocket};if(typeof globalThis<"u"&&typeof globalThis.WebSocketPair<"u"&&typeof globalThis.WebSocket>"u")return{type:"cloudflare",error:"Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",workaround:"Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."};if(typeof globalThis<"u"&&globalThis.EdgeRuntime||typeof navigator<"u"&&(!((t=navigator.userAgent)===null||t===void 0)&&t.includes("Vercel-Edge")))return{type:"unsupported",error:"Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",workaround:"Use serverless functions or a different deployment target for WebSocket functionality."};const r=globalThis.process;if(r){const n=r.versions;if(n&&n.node){const s=n.node,a=parseInt(s.replace(/^v/,"").split(".")[0]);return a>=22?typeof globalThis.WebSocket<"u"?{type:"native",constructor:globalThis.WebSocket}:{type:"unsupported",error:`Node.js ${a} detected but native WebSocket not found.`,workaround:"Provide a WebSocket implementation via the transport option."}:{type:"unsupported",error:`Node.js ${a} detected without native WebSocket support.`,workaround:`For Node.js < 22, install "ws" package and provide it via the transport option:
import ws from "ws"
new RealtimeClient(url, { transport: ws })`}}}return{type:"unsupported",error:"Unknown JavaScript runtime without WebSocket support.",workaround:"Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."}}static getWebSocketConstructor(){const t=this.detectEnvironment();if(t.constructor)return t.constructor;let r=t.error||"WebSocket not supported in this environment.";throw t.workaround&&(r+=`

Suggested solution: ${t.workaround}`),new Error(r)}static isWebSocketSupported(){try{const t=this.detectEnvironment();return t.type==="native"||t.type==="ws"}catch{return!1}}}const Cv="2.104.1",Av=`realtime-js/${Cv}`,Rv="1.0.0",uf="2.0.0",Pv=uf,Ov=1e4,Lv=100,gr={closed:"closed",errored:"errored",joined:"joined",joining:"joining",leaving:"leaving"},df={close:"phx_close",error:"phx_error",join:"phx_join",leave:"phx_leave",access_token:"access_token"},pl={connecting:"connecting",closing:"closing",closed:"closed"};class $v{constructor(t){this.HEADER_LENGTH=1,this.USER_BROADCAST_PUSH_META_LENGTH=6,this.KINDS={userBroadcastPush:3,userBroadcast:4},this.BINARY_ENCODING=0,this.JSON_ENCODING=1,this.BROADCAST_EVENT="broadcast",this.allowedMetadataKeys=[],this.allowedMetadataKeys=t??[]}encode(t,r){if(t.event===this.BROADCAST_EVENT&&!(t.payload instanceof ArrayBuffer)&&typeof t.payload.event=="string")return r(this._binaryEncodeUserBroadcastPush(t));let n=[t.join_ref,t.ref,t.topic,t.event,t.payload];return r(JSON.stringify(n))}_binaryEncodeUserBroadcastPush(t){var r;return this._isArrayBuffer((r=t.payload)===null||r===void 0?void 0:r.payload)?this._encodeBinaryUserBroadcastPush(t):this._encodeJsonUserBroadcastPush(t)}_encodeBinaryUserBroadcastPush(t){var r,n;const s=(n=(r=t.payload)===null||r===void 0?void 0:r.payload)!==null&&n!==void 0?n:new ArrayBuffer(0);return this._encodeUserBroadcastPush(t,this.BINARY_ENCODING,s)}_encodeJsonUserBroadcastPush(t){var r,n;const s=(n=(r=t.payload)===null||r===void 0?void 0:r.payload)!==null&&n!==void 0?n:{},o=new TextEncoder().encode(JSON.stringify(s)).buffer;return this._encodeUserBroadcastPush(t,this.JSON_ENCODING,o)}_encodeUserBroadcastPush(t,r,n){var s,a;const o=t.topic,l=(s=t.ref)!==null&&s!==void 0?s:"",c=(a=t.join_ref)!==null&&a!==void 0?a:"",u=t.payload.event,d=this.allowedMetadataKeys?this._pick(t.payload,this.allowedMetadataKeys):{},h=Object.keys(d).length===0?"":JSON.stringify(d);if(c.length>255)throw new Error(`joinRef length ${c.length} exceeds maximum of 255`);if(l.length>255)throw new Error(`ref length ${l.length} exceeds maximum of 255`);if(o.length>255)throw new Error(`topic length ${o.length} exceeds maximum of 255`);if(u.length>255)throw new Error(`userEvent length ${u.length} exceeds maximum of 255`);if(h.length>255)throw new Error(`metadata length ${h.length} exceeds maximum of 255`);const p=this.USER_BROADCAST_PUSH_META_LENGTH+c.length+l.length+o.length+u.length+h.length,v=new ArrayBuffer(this.HEADER_LENGTH+p);let y=new DataView(v),x=0;y.setUint8(x++,this.KINDS.userBroadcastPush),y.setUint8(x++,c.length),y.setUint8(x++,l.length),y.setUint8(x++,o.length),y.setUint8(x++,u.length),y.setUint8(x++,h.length),y.setUint8(x++,r),Array.from(c,f=>y.setUint8(x++,f.charCodeAt(0))),Array.from(l,f=>y.setUint8(x++,f.charCodeAt(0))),Array.from(o,f=>y.setUint8(x++,f.charCodeAt(0))),Array.from(u,f=>y.setUint8(x++,f.charCodeAt(0))),Array.from(h,f=>y.setUint8(x++,f.charCodeAt(0)));var N=new Uint8Array(v.byteLength+n.byteLength);return N.set(new Uint8Array(v),0),N.set(new Uint8Array(n),v.byteLength),N.buffer}decode(t,r){if(this._isArrayBuffer(t)){let n=this._binaryDecode(t);return r(n)}if(typeof t=="string"){const n=JSON.parse(t),[s,a,o,l,c]=n;return r({join_ref:s,ref:a,topic:o,event:l,payload:c})}return r({})}_binaryDecode(t){const r=new DataView(t),n=r.getUint8(0),s=new TextDecoder;switch(n){case this.KINDS.userBroadcast:return this._decodeUserBroadcast(t,r,s)}}_decodeUserBroadcast(t,r,n){const s=r.getUint8(1),a=r.getUint8(2),o=r.getUint8(3),l=r.getUint8(4);let c=this.HEADER_LENGTH+4;const u=n.decode(t.slice(c,c+s));c=c+s;const d=n.decode(t.slice(c,c+a));c=c+a;const h=n.decode(t.slice(c,c+o));c=c+o;const p=t.slice(c,t.byteLength),v=l===this.JSON_ENCODING?JSON.parse(n.decode(p)):p,y={type:this.BROADCAST_EVENT,event:d,payload:v};return o>0&&(y.meta=JSON.parse(h)),{join_ref:null,ref:null,topic:u,event:this.BROADCAST_EVENT,payload:y}}_isArrayBuffer(t){var r;return t instanceof ArrayBuffer||((r=t==null?void 0:t.constructor)===null||r===void 0?void 0:r.name)==="ArrayBuffer"}_pick(t,r){return!t||typeof t!="object"?{}:Object.fromEntries(Object.entries(t).filter(([n])=>r.includes(n)))}}var ie;(function(e){e.abstime="abstime",e.bool="bool",e.date="date",e.daterange="daterange",e.float4="float4",e.float8="float8",e.int2="int2",e.int4="int4",e.int4range="int4range",e.int8="int8",e.int8range="int8range",e.json="json",e.jsonb="jsonb",e.money="money",e.numeric="numeric",e.oid="oid",e.reltime="reltime",e.text="text",e.time="time",e.timestamp="timestamp",e.timestamptz="timestamptz",e.timetz="timetz",e.tsrange="tsrange",e.tstzrange="tstzrange"})(ie||(ie={}));const pd=(e,t,r={})=>{var n;const s=(n=r.skipTypes)!==null&&n!==void 0?n:[];return t?Object.keys(t).reduce((a,o)=>(a[o]=Iv(o,e,t,s),a),{}):{}},Iv=(e,t,r,n)=>{const s=t.find(l=>l.name===e),a=s==null?void 0:s.type,o=r[e];return a&&!n.includes(a)?hf(a,o):fl(o)},hf=(e,t)=>{if(e.charAt(0)==="_"){const r=e.slice(1,e.length);return Fv(t,r)}switch(e){case ie.bool:return Uv(t);case ie.float4:case ie.float8:case ie.int2:case ie.int4:case ie.int8:case ie.numeric:case ie.oid:return zv(t);case ie.json:case ie.jsonb:return Dv(t);case ie.timestamp:return Mv(t);case ie.abstime:case ie.date:case ie.daterange:case ie.int4range:case ie.int8range:case ie.money:case ie.reltime:case ie.text:case ie.time:case ie.timestamptz:case ie.timetz:case ie.tsrange:case ie.tstzrange:return fl(t);default:return fl(t)}},fl=e=>e,Uv=e=>{switch(e){case"t":return!0;case"f":return!1;default:return e}},zv=e=>{if(typeof e=="string"){const t=parseFloat(e);if(!Number.isNaN(t))return t}return e},Dv=e=>{if(typeof e=="string")try{return JSON.parse(e)}catch{return e}return e},Fv=(e,t)=>{if(typeof e!="string")return e;const r=e.length-1,n=e[r];if(e[0]==="{"&&n==="}"){let a;const o=e.slice(1,r);try{a=JSON.parse("["+o+"]")}catch{a=o?o.split(","):[]}return a.map(l=>hf(t,l))}return e},Mv=e=>typeof e=="string"?e.replace(" ","T"):e,pf=e=>{const t=new URL(e);return t.protocol=t.protocol.replace(/^ws/i,"http"),t.pathname=t.pathname.replace(/\/+$/,"").replace(/\/socket\/websocket$/i,"").replace(/\/socket$/i,"").replace(/\/websocket$/i,""),t.pathname===""||t.pathname==="/"?t.pathname="/api/broadcast":t.pathname=t.pathname+"/api/broadcast",t.href};var ms=e=>typeof e=="function"?e:function(){return e},Bv=typeof self<"u"?self:null,ln=typeof window<"u"?window:null,Ut=Bv||ln||globalThis,Wv="2.0.0",Hv=1e4,Vv=1e3,zt={connecting:0,open:1,closing:2,closed:3},Ye={closed:"closed",errored:"errored",joined:"joined",joining:"joining",leaving:"leaving"},Vt={close:"phx_close",error:"phx_error",join:"phx_join",reply:"phx_reply",leave:"phx_leave"},gl={longpoll:"longpoll",websocket:"websocket"},qv={complete:4},ml="base64url.bearer.phx.",fa=class{constructor(e,t,r,n){this.channel=e,this.event=t,this.payload=r||function(){return{}},this.receivedResp=null,this.timeout=n,this.timeoutTimer=null,this.recHooks=[],this.sent=!1,this.ref=void 0}resend(e){this.timeout=e,this.reset(),this.send()}send(){this.hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload(),ref:this.ref,join_ref:this.channel.joinRef()}))}receive(e,t){return this.hasReceived(e)&&t(this.receivedResp.response),this.recHooks.push({status:e,callback:t}),this}reset(){this.cancelRefEvent(),this.ref=null,this.refEvent=null,this.receivedResp=null,this.sent=!1}destroy(){this.cancelRefEvent(),this.cancelTimeout()}matchReceive({status:e,response:t,_ref:r}){this.recHooks.filter(n=>n.status===e).forEach(n=>n.callback(t))}cancelRefEvent(){this.refEvent&&this.channel.off(this.refEvent)}cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=null}startTimeout(){this.timeoutTimer&&this.cancelTimeout(),this.ref=this.channel.socket.makeRef(),this.refEvent=this.channel.replyEventName(this.ref),this.channel.on(this.refEvent,e=>{this.cancelRefEvent(),this.cancelTimeout(),this.receivedResp=e,this.matchReceive(e)}),this.timeoutTimer=setTimeout(()=>{this.trigger("timeout",{})},this.timeout)}hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}trigger(e,t){this.channel.trigger(this.refEvent,{status:e,response:t})}},ff=class{constructor(e,t){this.callback=e,this.timerCalc=t,this.timer=void 0,this.tries=0}reset(){this.tries=0,clearTimeout(this.timer)}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries=this.tries+1,this.callback()},this.timerCalc(this.tries+1))}},Kv=class{constructor(e,t,r){this.state=Ye.closed,this.topic=e,this.params=ms(t||{}),this.socket=r,this.bindings=[],this.bindingRef=0,this.timeout=this.socket.timeout,this.joinedOnce=!1,this.joinPush=new fa(this,Vt.join,this.params,this.timeout),this.pushBuffer=[],this.stateChangeRefs=[],this.rejoinTimer=new ff(()=>{this.socket.isConnected()&&this.rejoin()},this.socket.rejoinAfterMs),this.stateChangeRefs.push(this.socket.onError(()=>this.rejoinTimer.reset())),this.stateChangeRefs.push(this.socket.onOpen(()=>{this.rejoinTimer.reset(),this.isErrored()&&this.rejoin()})),this.joinPush.receive("ok",()=>{this.state=Ye.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(n=>n.send()),this.pushBuffer=[]}),this.joinPush.receive("error",n=>{this.state=Ye.errored,this.socket.hasLogger()&&this.socket.log("channel",`error ${this.topic}`,n),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.onClose(()=>{this.rejoinTimer.reset(),this.socket.hasLogger()&&this.socket.log("channel",`close ${this.topic}`),this.state=Ye.closed,this.socket.remove(this)}),this.onError(n=>{this.socket.hasLogger()&&this.socket.log("channel",`error ${this.topic}`,n),this.isJoining()&&this.joinPush.reset(),this.state=Ye.errored,this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.joinPush.receive("timeout",()=>{this.socket.hasLogger()&&this.socket.log("channel",`timeout ${this.topic}`,this.joinPush.timeout),new fa(this,Vt.leave,ms({}),this.timeout).send(),this.state=Ye.errored,this.joinPush.reset(),this.socket.isConnected()&&this.rejoinTimer.scheduleTimeout()}),this.on(Vt.reply,(n,s)=>{this.trigger(this.replyEventName(s),n)})}join(e=this.timeout){if(this.joinedOnce)throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");return this.timeout=e,this.joinedOnce=!0,this.rejoin(),this.joinPush}teardown(){this.pushBuffer.forEach(e=>e.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=Ye.closed,this.bindings=[]}onClose(e){this.on(Vt.close,e)}onError(e){return this.on(Vt.error,t=>e(t))}on(e,t){let r=this.bindingRef++;return this.bindings.push({event:e,ref:r,callback:t}),r}off(e,t){this.bindings=this.bindings.filter(r=>!(r.event===e&&(typeof t>"u"||t===r.ref)))}canPush(){return this.socket.isConnected()&&this.isJoined()}push(e,t,r=this.timeout){if(t=t||{},!this.joinedOnce)throw new Error(`tried to push '${e}' to '${this.topic}' before joining. Use channel.join() before pushing events`);let n=new fa(this,e,function(){return t},r);return this.canPush()?n.send():(n.startTimeout(),this.pushBuffer.push(n)),n}leave(e=this.timeout){this.rejoinTimer.reset(),this.joinPush.cancelTimeout(),this.state=Ye.leaving;let t=()=>{this.socket.hasLogger()&&this.socket.log("channel",`leave ${this.topic}`),this.trigger(Vt.close,"leave")},r=new fa(this,Vt.leave,ms({}),e);return r.receive("ok",()=>t()).receive("timeout",()=>t()),r.send(),this.canPush()||r.trigger("ok",{}),r}onMessage(e,t,r){return t}filterBindings(e,t,r){return!0}isMember(e,t,r,n){return this.topic!==e?!1:n&&n!==this.joinRef()?(this.socket.hasLogger()&&this.socket.log("channel","dropping outdated message",{topic:e,event:t,payload:r,joinRef:n}),!1):!0}joinRef(){return this.joinPush.ref}rejoin(e=this.timeout){this.isLeaving()||(this.socket.leaveOpenTopic(this.topic),this.state=Ye.joining,this.joinPush.resend(e))}trigger(e,t,r,n){let s=this.onMessage(e,t,r,n);if(t&&!s)throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");let a=this.bindings.filter(o=>o.event===e&&this.filterBindings(o,t,r));for(let o=0;o<a.length;o++)a[o].callback(s,r,n||this.joinRef())}replyEventName(e){return`chan_reply_${e}`}isClosed(){return this.state===Ye.closed}isErrored(){return this.state===Ye.errored}isJoined(){return this.state===Ye.joined}isJoining(){return this.state===Ye.joining}isLeaving(){return this.state===Ye.leaving}},ci=class{static request(e,t,r,n,s,a,o){if(Ut.XDomainRequest){let l=new Ut.XDomainRequest;return this.xdomainRequest(l,e,t,n,s,a,o)}else if(Ut.XMLHttpRequest){let l=new Ut.XMLHttpRequest;return this.xhrRequest(l,e,t,r,n,s,a,o)}else{if(Ut.fetch&&Ut.AbortController)return this.fetchRequest(e,t,r,n,s,a,o);throw new Error("No suitable XMLHttpRequest implementation found")}}static fetchRequest(e,t,r,n,s,a,o){let l={method:e,headers:r,body:n},c=null;return s&&(c=new AbortController,setTimeout(()=>c.abort(),s),l.signal=c.signal),Ut.fetch(t,l).then(u=>u.text()).then(u=>this.parseJSON(u)).then(u=>o&&o(u)).catch(u=>{u.name==="AbortError"&&a?a():o&&o(null)}),c}static xdomainRequest(e,t,r,n,s,a,o){return e.timeout=s,e.open(t,r),e.onload=()=>{let l=this.parseJSON(e.responseText);o&&o(l)},a&&(e.ontimeout=a),e.onprogress=()=>{},e.send(n),e}static xhrRequest(e,t,r,n,s,a,o,l){e.open(t,r,!0),e.timeout=a;for(let[c,u]of Object.entries(n))e.setRequestHeader(c,u);return e.onerror=()=>l&&l(null),e.onreadystatechange=()=>{if(e.readyState===qv.complete&&l){let c=this.parseJSON(e.responseText);l(c)}},o&&(e.ontimeout=o),e.send(s),e}static parseJSON(e){if(!e||e==="")return null;try{return JSON.parse(e)}catch{return console&&console.log("failed to parse JSON response",e),null}}static serialize(e,t){let r=[];for(var n in e){if(!Object.prototype.hasOwnProperty.call(e,n))continue;let s=t?`${t}[${n}]`:n,a=e[n];typeof a=="object"?r.push(this.serialize(a,s)):r.push(encodeURIComponent(s)+"="+encodeURIComponent(a))}return r.join("&")}static appendParams(e,t){if(Object.keys(t).length===0)return e;let r=e.match(/\?/)?"&":"?";return`${e}${r}${this.serialize(t)}`}},Gv=e=>{let t="",r=new Uint8Array(e),n=r.byteLength;for(let s=0;s<n;s++)t+=String.fromCharCode(r[s]);return btoa(t)},Zr=class{constructor(e,t){t&&t.length===2&&t[1].startsWith(ml)&&(this.authToken=atob(t[1].slice(ml.length))),this.endPoint=null,this.token=null,this.skipHeartbeat=!0,this.reqs=new Set,this.awaitingBatchAck=!1,this.currentBatch=null,this.currentBatchTimer=null,this.batchBuffer=[],this.onopen=function(){},this.onerror=function(){},this.onmessage=function(){},this.onclose=function(){},this.pollEndpoint=this.normalizeEndpoint(e),this.readyState=zt.connecting,setTimeout(()=>this.poll(),0)}normalizeEndpoint(e){return e.replace("ws://","http://").replace("wss://","https://").replace(new RegExp("(.*)/"+gl.websocket),"$1/"+gl.longpoll)}endpointURL(){return ci.appendParams(this.pollEndpoint,{token:this.token})}closeAndRetry(e,t,r){this.close(e,t,r),this.readyState=zt.connecting}ontimeout(){this.onerror("timeout"),this.closeAndRetry(1005,"timeout",!1)}isActive(){return this.readyState===zt.open||this.readyState===zt.connecting}poll(){const e={Accept:"application/json"};this.authToken&&(e["X-Phoenix-AuthToken"]=this.authToken),this.ajax("GET",e,null,()=>this.ontimeout(),t=>{if(t){var{status:r,token:n,messages:s}=t;if(r===410&&this.token!==null){this.onerror(410),this.closeAndRetry(3410,"session_gone",!1);return}this.token=n}else r=0;switch(r){case 200:s.forEach(a=>{setTimeout(()=>this.onmessage({data:a}),0)}),this.poll();break;case 204:this.poll();break;case 410:this.readyState=zt.open,this.onopen({}),this.poll();break;case 403:this.onerror(403),this.close(1008,"forbidden",!1);break;case 0:case 500:this.onerror(500),this.closeAndRetry(1011,"internal server error",500);break;default:throw new Error(`unhandled poll status ${r}`)}})}send(e){typeof e!="string"&&(e=Gv(e)),this.currentBatch?this.currentBatch.push(e):this.awaitingBatchAck?this.batchBuffer.push(e):(this.currentBatch=[e],this.currentBatchTimer=setTimeout(()=>{this.batchSend(this.currentBatch),this.currentBatch=null},0))}batchSend(e){this.awaitingBatchAck=!0,this.ajax("POST",{"Content-Type":"application/x-ndjson"},e.join(`
`),()=>this.onerror("timeout"),t=>{this.awaitingBatchAck=!1,!t||t.status!==200?(this.onerror(t&&t.status),this.closeAndRetry(1011,"internal server error",!1)):this.batchBuffer.length>0&&(this.batchSend(this.batchBuffer),this.batchBuffer=[])})}close(e,t,r){for(let s of this.reqs)s.abort();this.readyState=zt.closed;let n=Object.assign({code:1e3,reason:void 0,wasClean:!0},{code:e,reason:t,wasClean:r});this.batchBuffer=[],clearTimeout(this.currentBatchTimer),this.currentBatchTimer=null,typeof CloseEvent<"u"?this.onclose(new CloseEvent("close",n)):this.onclose(n)}ajax(e,t,r,n,s){let a,o=()=>{this.reqs.delete(a),n()};a=ci.request(e,this.endpointURL(),t,r,this.timeout,o,l=>{this.reqs.delete(a),this.isActive()&&s(l)}),this.reqs.add(a)}},Jv=class as{constructor(t,r={}){let n=r.events||{state:"presence_state",diff:"presence_diff"};this.state={},this.pendingDiffs=[],this.channel=t,this.joinRef=null,this.caller={onJoin:function(){},onLeave:function(){},onSync:function(){}},this.channel.on(n.state,s=>{let{onJoin:a,onLeave:o,onSync:l}=this.caller;this.joinRef=this.channel.joinRef(),this.state=as.syncState(this.state,s,a,o),this.pendingDiffs.forEach(c=>{this.state=as.syncDiff(this.state,c,a,o)}),this.pendingDiffs=[],l()}),this.channel.on(n.diff,s=>{let{onJoin:a,onLeave:o,onSync:l}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(s):(this.state=as.syncDiff(this.state,s,a,o),l())})}onJoin(t){this.caller.onJoin=t}onLeave(t){this.caller.onLeave=t}onSync(t){this.caller.onSync=t}list(t){return as.list(this.state,t)}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel.joinRef()}static syncState(t,r,n,s){let a=this.clone(t),o={},l={};return this.map(a,(c,u)=>{r[c]||(l[c]=u)}),this.map(r,(c,u)=>{let d=a[c];if(d){let h=u.metas.map(x=>x.phx_ref),p=d.metas.map(x=>x.phx_ref),v=u.metas.filter(x=>p.indexOf(x.phx_ref)<0),y=d.metas.filter(x=>h.indexOf(x.phx_ref)<0);v.length>0&&(o[c]=u,o[c].metas=v),y.length>0&&(l[c]=this.clone(d),l[c].metas=y)}else o[c]=u}),this.syncDiff(a,{joins:o,leaves:l},n,s)}static syncDiff(t,r,n,s){let{joins:a,leaves:o}=this.clone(r);return n||(n=function(){}),s||(s=function(){}),this.map(a,(l,c)=>{let u=t[l];if(t[l]=this.clone(c),u){let d=t[l].metas.map(p=>p.phx_ref),h=u.metas.filter(p=>d.indexOf(p.phx_ref)<0);t[l].metas.unshift(...h)}n(l,u,c)}),this.map(o,(l,c)=>{let u=t[l];if(!u)return;let d=c.metas.map(h=>h.phx_ref);u.metas=u.metas.filter(h=>d.indexOf(h.phx_ref)<0),s(l,u,c),u.metas.length===0&&delete t[l]}),t}static list(t,r){return r||(r=function(n,s){return s}),this.map(t,(n,s)=>r(n,s))}static map(t,r){return Object.getOwnPropertyNames(t).map(n=>r(n,t[n]))}static clone(t){return JSON.parse(JSON.stringify(t))}},ga={HEADER_LENGTH:1,META_LENGTH:4,KINDS:{push:0,reply:1,broadcast:2},encode(e,t){if(e.payload.constructor===ArrayBuffer)return t(this.binaryEncode(e));{let r=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(r))}},decode(e,t){if(e.constructor===ArrayBuffer)return t(this.binaryDecode(e));{let[r,n,s,a,o]=JSON.parse(e);return t({join_ref:r,ref:n,topic:s,event:a,payload:o})}},binaryEncode(e){let{join_ref:t,ref:r,event:n,topic:s,payload:a}=e,o=this.META_LENGTH+t.length+r.length+s.length+n.length,l=new ArrayBuffer(this.HEADER_LENGTH+o),c=new DataView(l),u=0;c.setUint8(u++,this.KINDS.push),c.setUint8(u++,t.length),c.setUint8(u++,r.length),c.setUint8(u++,s.length),c.setUint8(u++,n.length),Array.from(t,h=>c.setUint8(u++,h.charCodeAt(0))),Array.from(r,h=>c.setUint8(u++,h.charCodeAt(0))),Array.from(s,h=>c.setUint8(u++,h.charCodeAt(0))),Array.from(n,h=>c.setUint8(u++,h.charCodeAt(0)));var d=new Uint8Array(l.byteLength+a.byteLength);return d.set(new Uint8Array(l),0),d.set(new Uint8Array(a),l.byteLength),d.buffer},binaryDecode(e){let t=new DataView(e),r=t.getUint8(0),n=new TextDecoder;switch(r){case this.KINDS.push:return this.decodePush(e,t,n);case this.KINDS.reply:return this.decodeReply(e,t,n);case this.KINDS.broadcast:return this.decodeBroadcast(e,t,n)}},decodePush(e,t,r){let n=t.getUint8(1),s=t.getUint8(2),a=t.getUint8(3),o=this.HEADER_LENGTH+this.META_LENGTH-1,l=r.decode(e.slice(o,o+n));o=o+n;let c=r.decode(e.slice(o,o+s));o=o+s;let u=r.decode(e.slice(o,o+a));o=o+a;let d=e.slice(o,e.byteLength);return{join_ref:l,ref:null,topic:c,event:u,payload:d}},decodeReply(e,t,r){let n=t.getUint8(1),s=t.getUint8(2),a=t.getUint8(3),o=t.getUint8(4),l=this.HEADER_LENGTH+this.META_LENGTH,c=r.decode(e.slice(l,l+n));l=l+n;let u=r.decode(e.slice(l,l+s));l=l+s;let d=r.decode(e.slice(l,l+a));l=l+a;let h=r.decode(e.slice(l,l+o));l=l+o;let p=e.slice(l,e.byteLength),v={status:h,response:p};return{join_ref:c,ref:u,topic:d,event:Vt.reply,payload:v}},decodeBroadcast(e,t,r){let n=t.getUint8(1),s=t.getUint8(2),a=this.HEADER_LENGTH+2,o=r.decode(e.slice(a,a+n));a=a+n;let l=r.decode(e.slice(a,a+s));a=a+s;let c=e.slice(a,e.byteLength);return{join_ref:null,ref:null,topic:o,event:l,payload:c}}},Yv=class{constructor(e,t={}){this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.channels=[],this.sendBuffer=[],this.ref=0,this.fallbackRef=null,this.timeout=t.timeout||Hv,this.transport=t.transport||Ut.WebSocket||Zr,this.conn=void 0,this.primaryPassedHealthCheck=!1,this.longPollFallbackMs=t.longPollFallbackMs,this.fallbackTimer=null,this.sessionStore=t.sessionStorage||Ut&&Ut.sessionStorage,this.establishedConnections=0,this.defaultEncoder=ga.encode.bind(ga),this.defaultDecoder=ga.decode.bind(ga),this.closeWasClean=!0,this.disconnecting=!1,this.binaryType=t.binaryType||"arraybuffer",this.connectClock=1,this.pageHidden=!1,this.encode=void 0,this.decode=void 0,this.transport!==Zr?(this.encode=t.encode||this.defaultEncoder,this.decode=t.decode||this.defaultDecoder):(this.encode=this.defaultEncoder,this.decode=this.defaultDecoder);let r=null;ln&&ln.addEventListener&&(ln.addEventListener("pagehide",n=>{this.conn&&(this.disconnect(),r=this.connectClock)}),ln.addEventListener("pageshow",n=>{r===this.connectClock&&(r=null,this.connect())}),ln.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"?this.pageHidden=!0:(this.pageHidden=!1,!this.isConnected()&&!this.closeWasClean&&this.teardown(()=>this.connect()))})),this.heartbeatIntervalMs=t.heartbeatIntervalMs||3e4,this.autoSendHeartbeat=t.autoSendHeartbeat??!0,this.heartbeatCallback=t.heartbeatCallback??(()=>{}),this.rejoinAfterMs=n=>t.rejoinAfterMs?t.rejoinAfterMs(n):[1e3,2e3,5e3][n-1]||1e4,this.reconnectAfterMs=n=>t.reconnectAfterMs?t.reconnectAfterMs(n):[10,50,100,150,200,250,500,1e3,2e3][n-1]||5e3,this.logger=t.logger||null,!this.logger&&t.debug&&(this.logger=(n,s,a)=>{console.log(`${n}: ${s}`,a)}),this.longpollerTimeout=t.longpollerTimeout||2e4,this.params=ms(t.params||{}),this.endPoint=`${e}/${gl.websocket}`,this.vsn=t.vsn||Wv,this.heartbeatTimeoutTimer=null,this.heartbeatTimer=null,this.heartbeatSentAt=null,this.pendingHeartbeatRef=null,this.reconnectTimer=new ff(()=>{if(this.pageHidden){this.log("Not reconnecting as page is hidden!"),this.teardown();return}this.teardown(async()=>{t.beforeReconnect&&await t.beforeReconnect(),this.connect()})},this.reconnectAfterMs),this.authToken=t.authToken}getLongPollTransport(){return Zr}replaceTransport(e){this.connectClock++,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.conn&&(this.conn.close(),this.conn=null),this.transport=e}protocol(){return location.protocol.match(/^https/)?"wss":"ws"}endPointURL(){let e=ci.appendParams(ci.appendParams(this.endPoint,this.params()),{vsn:this.vsn});return e.charAt(0)!=="/"?e:e.charAt(1)==="/"?`${this.protocol()}:${e}`:`${this.protocol()}://${location.host}${e}`}disconnect(e,t,r){this.connectClock++,this.disconnecting=!0,this.closeWasClean=!0,clearTimeout(this.fallbackTimer),this.reconnectTimer.reset(),this.teardown(()=>{this.disconnecting=!1,e&&e()},t,r)}connect(e){e&&(console&&console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor"),this.params=ms(e)),!(this.conn&&!this.disconnecting)&&(this.longPollFallbackMs&&this.transport!==Zr?this.connectWithFallback(Zr,this.longPollFallbackMs):this.transportConnect())}log(e,t,r){this.logger&&this.logger(e,t,r)}hasLogger(){return this.logger!==null}onOpen(e){let t=this.makeRef();return this.stateChangeCallbacks.open.push([t,e]),t}onClose(e){let t=this.makeRef();return this.stateChangeCallbacks.close.push([t,e]),t}onError(e){let t=this.makeRef();return this.stateChangeCallbacks.error.push([t,e]),t}onMessage(e){let t=this.makeRef();return this.stateChangeCallbacks.message.push([t,e]),t}onHeartbeat(e){this.heartbeatCallback=e}ping(e){if(!this.isConnected())return!1;let t=this.makeRef(),r=Date.now();this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:t});let n=this.onMessage(s=>{s.ref===t&&(this.off([n]),e(Date.now()-r))});return!0}transportName(e){switch(e){case Zr:return"LongPoll";default:return e.name}}transportConnect(){this.connectClock++,this.closeWasClean=!1;let e;this.authToken&&(e=["phoenix",`${ml}${btoa(this.authToken).replace(/=/g,"")}`]),this.conn=new this.transport(this.endPointURL(),e),this.conn.binaryType=this.binaryType,this.conn.timeout=this.longpollerTimeout,this.conn.onopen=()=>this.onConnOpen(),this.conn.onerror=t=>this.onConnError(t),this.conn.onmessage=t=>this.onConnMessage(t),this.conn.onclose=t=>this.onConnClose(t)}getSession(e){return this.sessionStore&&this.sessionStore.getItem(e)}storeSession(e,t){this.sessionStore&&this.sessionStore.setItem(e,t)}connectWithFallback(e,t=2500){clearTimeout(this.fallbackTimer);let r=!1,n=!0,s,a,o=this.transportName(e),l=c=>{this.log("transport",`falling back to ${o}...`,c),this.off([s,a]),n=!1,this.replaceTransport(e),this.transportConnect()};if(this.getSession(`phx:fallback:${o}`))return l("memorized");this.fallbackTimer=setTimeout(l,t),a=this.onError(c=>{this.log("transport","error",c),n&&!r&&(clearTimeout(this.fallbackTimer),l(c))}),this.fallbackRef&&this.off([this.fallbackRef]),this.fallbackRef=this.onOpen(()=>{if(r=!0,!n){let c=this.transportName(e);return this.primaryPassedHealthCheck||this.storeSession(`phx:fallback:${c}`,"true"),this.log("transport",`established ${c} fallback`)}clearTimeout(this.fallbackTimer),this.fallbackTimer=setTimeout(l,t),this.ping(c=>{this.log("transport","connected to primary after",c),this.primaryPassedHealthCheck=!0,clearTimeout(this.fallbackTimer)})}),this.transportConnect()}clearHeartbeats(){clearTimeout(this.heartbeatTimer),clearTimeout(this.heartbeatTimeoutTimer)}onConnOpen(){this.hasLogger()&&this.log("transport",`connected to ${this.endPointURL()}`),this.closeWasClean=!1,this.disconnecting=!1,this.establishedConnections++,this.flushSendBuffer(),this.reconnectTimer.reset(),this.autoSendHeartbeat&&this.resetHeartbeat(),this.triggerStateCallbacks("open")}heartbeatTimeout(){if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.hasLogger()&&this.log("transport","heartbeat timeout. Attempting to re-establish connection");try{this.heartbeatCallback("timeout")}catch(e){this.log("error","error in heartbeat callback",e)}this.triggerChanError(),this.closeWasClean=!1,this.teardown(()=>this.reconnectTimer.scheduleTimeout(),Vv,"heartbeat timeout")}}resetHeartbeat(){this.conn&&this.conn.skipHeartbeat||(this.pendingHeartbeatRef=null,this.clearHeartbeats(),this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}teardown(e,t,r){if(!this.conn)return e&&e();const n=this.conn;this.waitForBufferDone(n,()=>{t?n.close(t,r||""):n.close(),this.waitForSocketClosed(n,()=>{this.conn===n&&(this.conn.onopen=function(){},this.conn.onerror=function(){},this.conn.onmessage=function(){},this.conn.onclose=function(){},this.conn=null),e&&e()})})}waitForBufferDone(e,t,r=1){if(r===5||!e.bufferedAmount){t();return}setTimeout(()=>{this.waitForBufferDone(e,t,r+1)},150*r)}waitForSocketClosed(e,t,r=1){if(r===5||e.readyState===zt.closed){t();return}setTimeout(()=>{this.waitForSocketClosed(e,t,r+1)},150*r)}onConnClose(e){this.conn&&(this.conn.onclose=()=>{}),this.hasLogger()&&this.log("transport","close",e),this.triggerChanError(),this.clearHeartbeats(),this.closeWasClean||this.reconnectTimer.scheduleTimeout(),this.triggerStateCallbacks("close",e)}onConnError(e){this.hasLogger()&&this.log("transport",e);let t=this.transport,r=this.establishedConnections;this.triggerStateCallbacks("error",e,t,r),(t===this.transport||r>0)&&this.triggerChanError()}triggerChanError(){this.channels.forEach(e=>{e.isErrored()||e.isLeaving()||e.isClosed()||e.trigger(Vt.error)})}connectionState(){switch(this.conn&&this.conn.readyState){case zt.connecting:return"connecting";case zt.open:return"open";case zt.closing:return"closing";default:return"closed"}}isConnected(){return this.connectionState()==="open"}remove(e){this.off(e.stateChangeRefs),this.channels=this.channels.filter(t=>t!==e)}off(e){for(let t in this.stateChangeCallbacks)this.stateChangeCallbacks[t]=this.stateChangeCallbacks[t].filter(([r])=>e.indexOf(r)===-1)}channel(e,t={}){let r=new Kv(e,t,this);return this.channels.push(r),r}push(e){if(this.hasLogger()){let{topic:t,event:r,payload:n,ref:s,join_ref:a}=e;this.log("push",`${t} ${r} (${a}, ${s})`,n)}this.isConnected()?this.encode(e,t=>this.conn.send(t)):this.sendBuffer.push(()=>this.encode(e,t=>this.conn.send(t)))}makeRef(){let e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}sendHeartbeat(){if(!this.isConnected()){try{this.heartbeatCallback("disconnected")}catch(e){this.log("error","error in heartbeat callback",e)}return}if(this.pendingHeartbeatRef){this.heartbeatTimeout();return}this.pendingHeartbeatRef=this.makeRef(),this.heartbeatSentAt=Date.now(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback("sent")}catch(e){this.log("error","error in heartbeat callback",e)}this.heartbeatTimeoutTimer=setTimeout(()=>this.heartbeatTimeout(),this.heartbeatIntervalMs)}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}onConnMessage(e){this.decode(e.data,t=>{let{topic:r,event:n,payload:s,ref:a,join_ref:o}=t;if(a&&a===this.pendingHeartbeatRef){const l=this.heartbeatSentAt?Date.now()-this.heartbeatSentAt:void 0;this.clearHeartbeats();try{this.heartbeatCallback(s.status==="ok"?"ok":"error",l)}catch(c){this.log("error","error in heartbeat callback",c)}this.pendingHeartbeatRef=null,this.heartbeatSentAt=null,this.autoSendHeartbeat&&(this.heartbeatTimer=setTimeout(()=>this.sendHeartbeat(),this.heartbeatIntervalMs))}this.hasLogger()&&this.log("receive",`${s.status||""} ${r} ${n} ${a&&"("+a+")"||""}`.trim(),s);for(let l=0;l<this.channels.length;l++){const c=this.channels[l];c.isMember(r,n,s,o)&&c.trigger(n,s,a,o)}this.triggerStateCallbacks("message",t)})}triggerStateCallbacks(e,...t){try{this.stateChangeCallbacks[e].forEach(([r,n])=>{try{n(...t)}catch(s){this.log("error",`error in ${e} callback`,s)}})}catch(r){this.log("error",`error triggering ${e} callbacks`,r)}}leaveOpenTopic(e){let t=this.channels.find(r=>r.topic===e&&(r.isJoined()||r.isJoining()));t&&(this.hasLogger()&&this.log("transport",`leaving duplicate topic "${e}"`),t.leave())}};class vs{constructor(t,r){const n=Xv(r);this.presence=new Jv(t.getChannel(),n),this.presence.onJoin((s,a,o)=>{const l=vs.onJoinPayload(s,a,o);t.getChannel().trigger("presence",l)}),this.presence.onLeave((s,a,o)=>{const l=vs.onLeavePayload(s,a,o);t.getChannel().trigger("presence",l)}),this.presence.onSync(()=>{t.getChannel().trigger("presence",{event:"sync"})})}get state(){return vs.transformState(this.presence.state)}static transformState(t){return t=Qv(t),Object.getOwnPropertyNames(t).reduce((r,n)=>{const s=t[n];return r[n]=za(s),r},{})}static onJoinPayload(t,r,n){const s=fd(r),a=za(n);return{event:"join",key:t,currentPresences:s,newPresences:a}}static onLeavePayload(t,r,n){const s=fd(r),a=za(n);return{event:"leave",key:t,currentPresences:s,leftPresences:a}}}function za(e){return e.metas.map(t=>(t.presence_ref=t.phx_ref,delete t.phx_ref,delete t.phx_ref_prev,t))}function Qv(e){return JSON.parse(JSON.stringify(e))}function Xv(e){return(e==null?void 0:e.events)&&{events:e.events}}function fd(e){return e!=null&&e.metas?za(e):[]}var gd;(function(e){e.SYNC="sync",e.JOIN="join",e.LEAVE="leave"})(gd||(gd={}));class Zv{get state(){return this.presenceAdapter.state}constructor(t,r){this.channel=t,this.presenceAdapter=new vs(this.channel.channelAdapter,r)}}class e0{constructor(t,r,n){const s=t0(n);this.channel=t.getSocket().channel(r,s),this.socket=t}get state(){return this.channel.state}set state(t){this.channel.state=t}get joinedOnce(){return this.channel.joinedOnce}get joinPush(){return this.channel.joinPush}get rejoinTimer(){return this.channel.rejoinTimer}on(t,r){return this.channel.on(t,r)}off(t,r){this.channel.off(t,r)}subscribe(t){return this.channel.join(t)}unsubscribe(t){return this.channel.leave(t)}teardown(){this.channel.teardown()}onClose(t){this.channel.onClose(t)}onError(t){return this.channel.onError(t)}push(t,r,n){let s;try{s=this.channel.push(t,r,n)}catch{throw new Error(`tried to push '${t}' to '${this.channel.topic}' before joining. Use channel.subscribe() before pushing events`)}if(this.channel.pushBuffer.length>Lv){const a=this.channel.pushBuffer.shift();a.cancelTimeout(),this.socket.log("channel",`discarded push due to buffer overflow: ${a.event}`,a.payload())}return s}updateJoinPayload(t){const r=this.channel.joinPush.payload();this.channel.joinPush.payload=()=>Object.assign(Object.assign({},r),t)}canPush(){return this.socket.isConnected()&&this.state===gr.joined}isJoined(){return this.state===gr.joined}isJoining(){return this.state===gr.joining}isClosed(){return this.state===gr.closed}isLeaving(){return this.state===gr.leaving}updateFilterBindings(t){this.channel.filterBindings=t}updatePayloadTransform(t){this.channel.onMessage=t}getChannel(){return this.channel}}function t0(e){return{config:Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},e.config)}}var md;(function(e){e.ALL="*",e.INSERT="INSERT",e.UPDATE="UPDATE",e.DELETE="DELETE"})(md||(md={}));var _n;(function(e){e.BROADCAST="broadcast",e.PRESENCE="presence",e.POSTGRES_CHANGES="postgres_changes",e.SYSTEM="system"})(_n||(_n={}));var qt;(function(e){e.SUBSCRIBED="SUBSCRIBED",e.TIMED_OUT="TIMED_OUT",e.CLOSED="CLOSED",e.CHANNEL_ERROR="CHANNEL_ERROR"})(qt||(qt={}));class ys{get state(){return this.channelAdapter.state}set state(t){this.channelAdapter.state=t}get joinedOnce(){return this.channelAdapter.joinedOnce}get timeout(){return this.socket.timeout}get joinPush(){return this.channelAdapter.joinPush}get rejoinTimer(){return this.channelAdapter.rejoinTimer}constructor(t,r={config:{}},n){var s,a;if(this.topic=t,this.params=r,this.socket=n,this.bindings={},this.subTopic=t.replace(/^realtime:/i,""),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},r.config),this.channelAdapter=new e0(this.socket.socketAdapter,t,this.params),this.presence=new Zv(this),this._onClose(()=>{this.socket._remove(this)}),this._updateFilterTransform(),this.broadcastEndpointURL=pf(this.socket.socketAdapter.endPointURL()),this.private=this.params.config.private||!1,!this.private&&(!((a=(s=this.params.config)===null||s===void 0?void 0:s.broadcast)===null||a===void 0)&&a.replay))throw new Error(`tried to use replay on public channel '${this.topic}'. It must be a private channel.`)}subscribe(t,r=this.timeout){var n,s,a;if(this.socket.isConnected()||this.socket.connect(),this.channelAdapter.isClosed()){const{config:{broadcast:o,presence:l,private:c}}=this.params,u=(s=(n=this.bindings.postgres_changes)===null||n===void 0?void 0:n.map(v=>v.filter))!==null&&s!==void 0?s:[],d=!!this.bindings[_n.PRESENCE]&&this.bindings[_n.PRESENCE].length>0||((a=this.params.config.presence)===null||a===void 0?void 0:a.enabled)===!0,h={},p={broadcast:o,presence:Object.assign(Object.assign({},l),{enabled:d}),postgres_changes:u,private:c};this.socket.accessTokenValue&&(h.access_token=this.socket.accessTokenValue),this._onError(v=>{t==null||t(qt.CHANNEL_ERROR,v)}),this._onClose(()=>t==null?void 0:t(qt.CLOSED)),this.updateJoinPayload(Object.assign({config:p},h)),this._updateFilterMessage(),this.channelAdapter.subscribe(r).receive("ok",async({postgres_changes:v})=>{if(this.socket._isManualToken()||this.socket.setAuth(),v===void 0){t==null||t(qt.SUBSCRIBED);return}this._updatePostgresBindings(v,t)}).receive("error",v=>{this.state=gr.errored,t==null||t(qt.CHANNEL_ERROR,new Error(JSON.stringify(Object.values(v).join(", ")||"error")))}).receive("timeout",()=>{t==null||t(qt.TIMED_OUT)})}return this}_updatePostgresBindings(t,r){var n;const s=this.bindings.postgres_changes,a=(n=s==null?void 0:s.length)!==null&&n!==void 0?n:0,o=[];for(let l=0;l<a;l++){const c=s[l],{filter:{event:u,schema:d,table:h,filter:p}}=c,v=t&&t[l];if(v&&v.event===u&&ys.isFilterValueEqual(v.schema,d)&&ys.isFilterValueEqual(v.table,h)&&ys.isFilterValueEqual(v.filter,p))o.push(Object.assign(Object.assign({},c),{id:v.id}));else{this.unsubscribe(),this.state=gr.errored,r==null||r(qt.CHANNEL_ERROR,new Error("mismatch between server and client bindings for postgres changes"));return}}this.bindings.postgres_changes=o,this.state!=gr.errored&&r&&r(qt.SUBSCRIBED)}presenceState(){return this.presence.state}async track(t,r={}){return await this.send({type:"presence",event:"track",payload:t},r.timeout||this.timeout)}async untrack(t={}){return await this.send({type:"presence",event:"untrack"},t)}on(t,r,n){const s=this.channelAdapter.isJoined()||this.channelAdapter.isJoining(),a=t===_n.PRESENCE||t===_n.POSTGRES_CHANGES;if(s&&a)throw this.socket.log("channel",`cannot add \`${t}\` callbacks for ${this.topic} after \`subscribe()\`.`),new Error(`cannot add \`${t}\` callbacks for ${this.topic} after \`subscribe()\`.`);return this._on(t,r,n)}async httpSend(t,r,n={}){var s;if(r==null)return Promise.reject(new Error("Payload is required for httpSend()"));const a={apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"};this.socket.accessTokenValue&&(a.Authorization=`Bearer ${this.socket.accessTokenValue}`);const o={method:"POST",headers:a,body:JSON.stringify({messages:[{topic:this.subTopic,event:t,payload:r,private:this.private}]})},l=await this._fetchWithTimeout(this.broadcastEndpointURL,o,(s=n.timeout)!==null&&s!==void 0?s:this.timeout);if(l.status===202)return{success:!0};let c=l.statusText;try{const u=await l.json();c=u.error||u.message||c}catch{}return Promise.reject(new Error(c))}async send(t,r={}){var n,s;if(!this.channelAdapter.canPush()&&t.type==="broadcast"){console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");const{event:a,payload:o}=t,l={apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"};this.socket.accessTokenValue&&(l.Authorization=`Bearer ${this.socket.accessTokenValue}`);const c={method:"POST",headers:l,body:JSON.stringify({messages:[{topic:this.subTopic,event:a,payload:o,private:this.private}]})};try{const u=await this._fetchWithTimeout(this.broadcastEndpointURL,c,(n=r.timeout)!==null&&n!==void 0?n:this.timeout);return await((s=u.body)===null||s===void 0?void 0:s.cancel()),u.ok?"ok":"error"}catch(u){return u.name==="AbortError"?"timed out":"error"}}else return new Promise(a=>{var o,l,c;const u=this.channelAdapter.push(t.type,t,r.timeout||this.timeout);t.type==="broadcast"&&!(!((c=(l=(o=this.params)===null||o===void 0?void 0:o.config)===null||l===void 0?void 0:l.broadcast)===null||c===void 0)&&c.ack)&&a("ok"),u.receive("ok",()=>a("ok")),u.receive("error",()=>a("error")),u.receive("timeout",()=>a("timed out"))})}updateJoinPayload(t){this.channelAdapter.updateJoinPayload(t)}async unsubscribe(t=this.timeout){return new Promise(r=>{this.channelAdapter.unsubscribe(t).receive("ok",()=>r("ok")).receive("timeout",()=>r("timed out")).receive("error",()=>r("error"))})}teardown(){this.channelAdapter.teardown()}async _fetchWithTimeout(t,r,n){const s=new AbortController,a=setTimeout(()=>s.abort(),n),o=await this.socket.fetch(t,Object.assign(Object.assign({},r),{signal:s.signal}));return clearTimeout(a),o}_on(t,r,n){const s=t.toLocaleLowerCase(),a=this.channelAdapter.on(t,n),o={type:s,filter:r,callback:n,ref:a};return this.bindings[s]?this.bindings[s].push(o):this.bindings[s]=[o],this._updateFilterMessage(),this}_onClose(t){this.channelAdapter.onClose(t)}_onError(t){this.channelAdapter.onError(t)}_updateFilterMessage(){this.channelAdapter.updateFilterBindings((t,r,n)=>{var s,a,o,l,c,u,d;const h=t.event.toLocaleLowerCase();if(this._notThisChannelEvent(h,n))return!1;const p=(s=this.bindings[h])===null||s===void 0?void 0:s.find(v=>v.ref===t.ref);if(!p)return!0;if(["broadcast","presence","postgres_changes"].includes(h))if("id"in p){const v=p.id,y=(a=p.filter)===null||a===void 0?void 0:a.event;return v&&((o=r.ids)===null||o===void 0?void 0:o.includes(v))&&(y==="*"||(y==null?void 0:y.toLocaleLowerCase())===((l=r.data)===null||l===void 0?void 0:l.type.toLocaleLowerCase()))}else{const v=(u=(c=p==null?void 0:p.filter)===null||c===void 0?void 0:c.event)===null||u===void 0?void 0:u.toLocaleLowerCase();return v==="*"||v===((d=r==null?void 0:r.event)===null||d===void 0?void 0:d.toLocaleLowerCase())}else return p.type.toLocaleLowerCase()===h})}_notThisChannelEvent(t,r){const{close:n,error:s,leave:a,join:o}=df;return r&&[n,s,a,o].includes(t)&&r!==this.joinPush.ref}_updateFilterTransform(){this.channelAdapter.updatePayloadTransform((t,r,n)=>{if(typeof r=="object"&&"ids"in r){const s=r.data,{schema:a,table:o,commit_timestamp:l,type:c,errors:u}=s;return Object.assign(Object.assign({},{schema:a,table:o,commit_timestamp:l,eventType:c,new:{},old:{},errors:u}),this._getPayloadRecords(s))}return r})}copyBindings(t){if(this.joinedOnce)throw new Error("cannot copy bindings into joined channel");for(const r in t.bindings)for(const n of t.bindings[r])this._on(n.type,n.filter,n.callback)}static isFilterValueEqual(t,r){return(t??void 0)===(r??void 0)}_getPayloadRecords(t){const r={new:{},old:{}};return(t.type==="INSERT"||t.type==="UPDATE")&&(r.new=pd(t.columns,t.record)),(t.type==="UPDATE"||t.type==="DELETE")&&(r.old=pd(t.columns,t.old_record)),r}}class r0{constructor(t,r){this.socket=new Yv(t,r)}get timeout(){return this.socket.timeout}get endPoint(){return this.socket.endPoint}get transport(){return this.socket.transport}get heartbeatIntervalMs(){return this.socket.heartbeatIntervalMs}get heartbeatCallback(){return this.socket.heartbeatCallback}set heartbeatCallback(t){this.socket.heartbeatCallback=t}get heartbeatTimer(){return this.socket.heartbeatTimer}get pendingHeartbeatRef(){return this.socket.pendingHeartbeatRef}get reconnectTimer(){return this.socket.reconnectTimer}get vsn(){return this.socket.vsn}get encode(){return this.socket.encode}get decode(){return this.socket.decode}get reconnectAfterMs(){return this.socket.reconnectAfterMs}get sendBuffer(){return this.socket.sendBuffer}get stateChangeCallbacks(){return this.socket.stateChangeCallbacks}connect(){this.socket.connect()}disconnect(t,r,n,s=1e4){return new Promise(a=>{setTimeout(()=>a("timeout"),s),this.socket.disconnect(()=>{t(),a("ok")},r,n)})}push(t){this.socket.push(t)}log(t,r,n){this.socket.log(t,r,n)}makeRef(){return this.socket.makeRef()}onOpen(t){this.socket.onOpen(t)}onClose(t){this.socket.onClose(t)}onError(t){this.socket.onError(t)}onMessage(t){this.socket.onMessage(t)}isConnected(){return this.socket.isConnected()}isConnecting(){return this.socket.connectionState()==pl.connecting}isDisconnecting(){return this.socket.connectionState()==pl.closing}connectionState(){return this.socket.connectionState()}endPointURL(){return this.socket.endPointURL()}sendHeartbeat(){this.socket.sendHeartbeat()}getSocket(){return this.socket}}const n0={HEARTBEAT_INTERVAL:25e3},s0=[1e3,2e3,5e3,1e4],a0=1e4,i0=`
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;class o0{get endPoint(){return this.socketAdapter.endPoint}get timeout(){return this.socketAdapter.timeout}get transport(){return this.socketAdapter.transport}get heartbeatCallback(){return this.socketAdapter.heartbeatCallback}get heartbeatIntervalMs(){return this.socketAdapter.heartbeatIntervalMs}get heartbeatTimer(){return this.worker?this._workerHeartbeatTimer:this.socketAdapter.heartbeatTimer}get pendingHeartbeatRef(){return this.worker?this._pendingWorkerHeartbeatRef:this.socketAdapter.pendingHeartbeatRef}get reconnectTimer(){return this.socketAdapter.reconnectTimer}get vsn(){return this.socketAdapter.vsn}get encode(){return this.socketAdapter.encode}get decode(){return this.socketAdapter.decode}get reconnectAfterMs(){return this.socketAdapter.reconnectAfterMs}get sendBuffer(){return this.socketAdapter.sendBuffer}get stateChangeCallbacks(){return this.socketAdapter.stateChangeCallbacks}constructor(t,r){var n;if(this.channels=new Array,this.accessTokenValue=null,this.accessToken=null,this.apiKey=null,this.httpEndpoint="",this.headers={},this.params={},this.ref=0,this.serializer=new $v,this._manuallySetToken=!1,this._authPromise=null,this._workerHeartbeatTimer=void 0,this._pendingWorkerHeartbeatRef=null,this._resolveFetch=a=>a?(...o)=>a(...o):(...o)=>fetch(...o),!(!((n=r==null?void 0:r.params)===null||n===void 0)&&n.apikey))throw new Error("API key is required to connect to Realtime");this.apiKey=r.params.apikey;const s=this._initializeOptions(r);this.socketAdapter=new r0(t,s),this.httpEndpoint=pf(t),this.fetch=this._resolveFetch(r==null?void 0:r.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||this.isConnected())){this.accessToken&&!this._authPromise&&this._setAuthSafely("connect"),this._setupConnectionHandlers();try{this.socketAdapter.connect()}catch(t){const r=t.message;throw r.includes("Node.js")?new Error(`${r}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`):new Error(`WebSocket not available: ${r}`)}this._handleNodeJsRaceCondition()}}endpointURL(){return this.socketAdapter.endPointURL()}async disconnect(t,r){return this.isDisconnecting()?"ok":await this.socketAdapter.disconnect(()=>{clearInterval(this._workerHeartbeatTimer),this._terminateWorker()},t,r)}getChannels(){return this.channels}async removeChannel(t){const r=await t.unsubscribe();return r==="ok"&&t.teardown(),this.channels.length===0&&this.disconnect(),r}async removeAllChannels(){const t=this.channels.map(async n=>{const s=await n.unsubscribe();return n.teardown(),s}),r=await Promise.all(t);return this.disconnect(),r}log(t,r,n){this.socketAdapter.log(t,r,n)}connectionState(){return this.socketAdapter.connectionState()||pl.closed}isConnected(){return this.socketAdapter.isConnected()}isConnecting(){return this.socketAdapter.isConnecting()}isDisconnecting(){return this.socketAdapter.isDisconnecting()}channel(t,r={config:{}}){const n=`realtime:${t}`,s=this.getChannels().find(a=>a.topic===n);if(s)return s;{const a=new ys(`realtime:${t}`,r,this);return this.channels.push(a),a}}push(t){this.socketAdapter.push(t)}async setAuth(t=null){this._authPromise=this._performAuth(t);try{await this._authPromise}finally{this._authPromise=null}}_isManualToken(){return this._manuallySetToken}async sendHeartbeat(){this.socketAdapter.sendHeartbeat()}onHeartbeat(t){this.socketAdapter.heartbeatCallback=this._wrapHeartbeatCallback(t)}_makeRef(){return this.socketAdapter.makeRef()}_remove(t){this.channels=this.channels.filter(r=>r.topic!==t.topic)}async _performAuth(t=null){let r,n=!1;if(t)r=t,n=!0;else if(this.accessToken)try{r=await this.accessToken()}catch(s){this.log("error","Error fetching access token from callback",s),r=this.accessTokenValue}else r=this.accessTokenValue;n?this._manuallySetToken=!0:this.accessToken&&(this._manuallySetToken=!1),this.accessTokenValue!=r&&(this.accessTokenValue=r,this.channels.forEach(s=>{const a={access_token:r,version:Av};r&&s.updateJoinPayload(a),s.joinedOnce&&s.channelAdapter.isJoined()&&s.channelAdapter.push(df.access_token,{access_token:r})}))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(t="general"){this._isManualToken()||this.setAuth().catch(r=>{this.log("error",`Error setting auth in ${t}`,r)})}_setupConnectionHandlers(){this.socketAdapter.onOpen(()=>{(this._authPromise||(this.accessToken&&!this.accessTokenValue?this.setAuth():Promise.resolve())).catch(r=>{this.log("error","error waiting for auth on connect",r)}),this.worker&&!this.workerRef&&this._startWorkerHeartbeat()}),this.socketAdapter.onClose(()=>{this.worker&&this.workerRef&&this._terminateWorker()}),this.socketAdapter.onMessage(t=>{t.ref&&t.ref===this._pendingWorkerHeartbeatRef&&(this._pendingWorkerHeartbeatRef=null)})}_handleNodeJsRaceCondition(){this.socketAdapter.isConnected()&&this.socketAdapter.getSocket().onConnOpen()}_wrapHeartbeatCallback(t){return(r,n)=>{r=="sent"&&this._setAuthSafely(),t&&t(r,n)}}_startWorkerHeartbeat(){this.workerUrl?this.log("worker",`starting worker for from ${this.workerUrl}`):this.log("worker","starting default worker");const t=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(t),this.workerRef.onerror=r=>{this.log("worker","worker error",r.message),this._terminateWorker(),this.disconnect()},this.workerRef.onmessage=r=>{r.data.event==="keepAlive"&&this.sendHeartbeat()},this.workerRef.postMessage({event:"start",interval:this.heartbeatIntervalMs})}_terminateWorker(){this.workerRef&&(this.log("worker","terminating worker"),this.workerRef.terminate(),this.workerRef=void 0)}_workerObjectUrl(t){let r;if(t)r=t;else{const n=new Blob([i0],{type:"application/javascript"});r=URL.createObjectURL(n)}return r}_initializeOptions(t){var r,n,s,a,o,l,c,u,d;this.worker=(r=t==null?void 0:t.worker)!==null&&r!==void 0?r:!1,this.accessToken=(n=t==null?void 0:t.accessToken)!==null&&n!==void 0?n:null;const h={};h.timeout=(s=t==null?void 0:t.timeout)!==null&&s!==void 0?s:Ov,h.heartbeatIntervalMs=(a=t==null?void 0:t.heartbeatIntervalMs)!==null&&a!==void 0?a:n0.HEARTBEAT_INTERVAL,h.transport=(o=t==null?void 0:t.transport)!==null&&o!==void 0?o:Tv.getWebSocketConstructor(),h.params=t==null?void 0:t.params,h.logger=t==null?void 0:t.logger,h.heartbeatCallback=this._wrapHeartbeatCallback(t==null?void 0:t.heartbeatCallback),h.reconnectAfterMs=(l=t==null?void 0:t.reconnectAfterMs)!==null&&l!==void 0?l:x=>s0[x-1]||a0;let p,v;const y=(c=t==null?void 0:t.vsn)!==null&&c!==void 0?c:Pv;switch(y){case Rv:p=(x,N)=>N(JSON.stringify(x)),v=(x,N)=>N(JSON.parse(x));break;case uf:p=this.serializer.encode.bind(this.serializer),v=this.serializer.decode.bind(this.serializer);break;default:throw new Error(`Unsupported serializer version: ${h.vsn}`)}if(h.vsn=y,h.encode=(u=t==null?void 0:t.encode)!==null&&u!==void 0?u:p,h.decode=(d=t==null?void 0:t.decode)!==null&&d!==void 0?d:v,h.beforeReconnect=this._reconnectAuth.bind(this),(t!=null&&t.logLevel||t!=null&&t.log_level)&&(this.logLevel=t.logLevel||t.log_level,h.params=Object.assign(Object.assign({},h.params),{log_level:this.logLevel})),this.worker){if(typeof window<"u"&&!window.Worker)throw new Error("Web Worker is not supported");this.workerUrl=t==null?void 0:t.workerUrl,h.autoSendHeartbeat=!this.worker}return h}async _reconnectAuth(){await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()}}var Us=class extends Error{constructor(e,t){var r;super(e),this.name="IcebergError",this.status=t.status,this.icebergType=t.icebergType,this.icebergCode=t.icebergCode,this.details=t.details,this.isCommitStateUnknown=t.icebergType==="CommitStateUnknownException"||[500,502,504].includes(t.status)&&((r=t.icebergType)==null?void 0:r.includes("CommitState"))===!0}isNotFound(){return this.status===404}isConflict(){return this.status===409}isAuthenticationTimeout(){return this.status===419}};function l0(e,t,r){const n=new URL(t,e);if(r)for(const[s,a]of Object.entries(r))a!==void 0&&n.searchParams.set(s,a);return n.toString()}async function c0(e){return!e||e.type==="none"?{}:e.type==="bearer"?{Authorization:`Bearer ${e.token}`}:e.type==="header"?{[e.name]:e.value}:e.type==="custom"?await e.getHeaders():{}}function u0(e){const t=e.fetchImpl??globalThis.fetch;return{async request({method:r,path:n,query:s,body:a,headers:o}){const l=l0(e.baseUrl,n,s),c=await c0(e.auth),u=await t(l,{method:r,headers:{...a?{"Content-Type":"application/json"}:{},...c,...o},body:a?JSON.stringify(a):void 0}),d=await u.text(),h=(u.headers.get("content-type")||"").includes("application/json"),p=h&&d?JSON.parse(d):d;if(!u.ok){const v=h?p:void 0,y=v==null?void 0:v.error;throw new Us((y==null?void 0:y.message)??`Request failed with status ${u.status}`,{status:u.status,icebergType:y==null?void 0:y.type,icebergCode:y==null?void 0:y.code,details:v})}return{status:u.status,headers:u.headers,data:p}}}}function ma(e){return e.join("")}var d0=class{constructor(e,t=""){this.client=e,this.prefix=t}async listNamespaces(e){const t=e?{parent:ma(e.namespace)}:void 0;return(await this.client.request({method:"GET",path:`${this.prefix}/namespaces`,query:t})).data.namespaces.map(n=>({namespace:n}))}async createNamespace(e,t){const r={namespace:e.namespace,properties:t==null?void 0:t.properties};return(await this.client.request({method:"POST",path:`${this.prefix}/namespaces`,body:r})).data}async dropNamespace(e){await this.client.request({method:"DELETE",path:`${this.prefix}/namespaces/${ma(e.namespace)}`})}async loadNamespaceMetadata(e){return{properties:(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${ma(e.namespace)}`})).data.properties}}async namespaceExists(e){try{return await this.client.request({method:"HEAD",path:`${this.prefix}/namespaces/${ma(e.namespace)}`}),!0}catch(t){if(t instanceof Us&&t.status===404)return!1;throw t}}async createNamespaceIfNotExists(e,t){try{return await this.createNamespace(e,t)}catch(r){if(r instanceof Us&&r.status===409)return;throw r}}};function en(e){return e.join("")}var h0=class{constructor(e,t="",r){this.client=e,this.prefix=t,this.accessDelegation=r}async listTables(e){return(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${en(e.namespace)}/tables`})).data.identifiers}async createTable(e,t){const r={};return this.accessDelegation&&(r["X-Iceberg-Access-Delegation"]=this.accessDelegation),(await this.client.request({method:"POST",path:`${this.prefix}/namespaces/${en(e.namespace)}/tables`,body:t,headers:r})).data.metadata}async updateTable(e,t){const r=await this.client.request({method:"POST",path:`${this.prefix}/namespaces/${en(e.namespace)}/tables/${e.name}`,body:t});return{"metadata-location":r.data["metadata-location"],metadata:r.data.metadata}}async dropTable(e,t){await this.client.request({method:"DELETE",path:`${this.prefix}/namespaces/${en(e.namespace)}/tables/${e.name}`,query:{purgeRequested:String((t==null?void 0:t.purge)??!1)}})}async loadTable(e){const t={};return this.accessDelegation&&(t["X-Iceberg-Access-Delegation"]=this.accessDelegation),(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${en(e.namespace)}/tables/${e.name}`,headers:t})).data.metadata}async tableExists(e){const t={};this.accessDelegation&&(t["X-Iceberg-Access-Delegation"]=this.accessDelegation);try{return await this.client.request({method:"HEAD",path:`${this.prefix}/namespaces/${en(e.namespace)}/tables/${e.name}`,headers:t}),!0}catch(r){if(r instanceof Us&&r.status===404)return!1;throw r}}async createTableIfNotExists(e,t){try{return await this.createTable(e,t)}catch(r){if(r instanceof Us&&r.status===409)return await this.loadTable({namespace:e.namespace,name:t.name});throw r}}},p0=class{constructor(e){var n;let t="v1";e.catalogName&&(t+=`/${e.catalogName}`);const r=e.baseUrl.endsWith("/")?e.baseUrl:`${e.baseUrl}/`;this.client=u0({baseUrl:r,auth:e.auth,fetchImpl:e.fetch}),this.accessDelegation=(n=e.accessDelegation)==null?void 0:n.join(","),this.namespaceOps=new d0(this.client,t),this.tableOps=new h0(this.client,t,this.accessDelegation)}async listNamespaces(e){return this.namespaceOps.listNamespaces(e)}async createNamespace(e,t){return this.namespaceOps.createNamespace(e,t)}async dropNamespace(e){await this.namespaceOps.dropNamespace(e)}async loadNamespaceMetadata(e){return this.namespaceOps.loadNamespaceMetadata(e)}async listTables(e){return this.tableOps.listTables(e)}async createTable(e,t){return this.tableOps.createTable(e,t)}async updateTable(e,t){return this.tableOps.updateTable(e,t)}async dropTable(e,t){await this.tableOps.dropTable(e,t)}async loadTable(e){return this.tableOps.loadTable(e)}async namespaceExists(e){return this.namespaceOps.namespaceExists(e)}async tableExists(e){return this.tableOps.tableExists(e)}async createNamespaceIfNotExists(e,t){return this.namespaceOps.createNamespaceIfNotExists(e,t)}async createTableIfNotExists(e,t){return this.tableOps.createTableIfNotExists(e,t)}};function zs(e){"@babel/helpers - typeof";return zs=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},zs(e)}function f0(e,t){if(zs(e)!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t);if(zs(n)!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function g0(e){var t=f0(e,"string");return zs(t)=="symbol"?t:t+""}function m0(e,t,r){return(t=g0(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function vd(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(s){return Object.getOwnPropertyDescriptor(e,s).enumerable})),r.push.apply(r,n)}return r}function V(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?vd(Object(r),!0).forEach(function(n){m0(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):vd(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}var Ri=class extends Error{constructor(e,t="storage",r,n){super(e),this.__isStorageError=!0,this.namespace=t,this.name=t==="vectors"?"StorageVectorsError":"StorageError",this.status=r,this.statusCode=n}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}};function Pi(e){return typeof e=="object"&&e!==null&&"__isStorageError"in e}var vl=class extends Ri{constructor(e,t,r,n="storage"){super(e,n,t,r),this.name=n==="vectors"?"StorageVectorsApiError":"StorageApiError",this.status=t,this.statusCode=r}toJSON(){return V({},super.toJSON())}},gf=class extends Ri{constructor(e,t,r="storage"){super(e,r),this.name=r==="vectors"?"StorageVectorsUnknownError":"StorageUnknownError",this.originalError=t}};function wc(e,t,r){const n=V({},e),s=t.toLowerCase();for(const a of Object.keys(n))a.toLowerCase()===s&&delete n[a];return n[s]=r,n}function v0(e){const t={};for(const[r,n]of Object.entries(e))t[r.toLowerCase()]=n;return t}const y0=e=>e?(...t)=>e(...t):(...t)=>fetch(...t),x0=e=>{if(typeof e!="object"||e===null)return!1;const t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)},yl=e=>{if(Array.isArray(e))return e.map(r=>yl(r));if(typeof e=="function"||e!==Object(e))return e;const t={};return Object.entries(e).forEach(([r,n])=>{const s=r.replace(/([-_][a-z])/gi,a=>a.toUpperCase().replace(/[-_]/g,""));t[s]=yl(n)}),t},k0=e=>!e||typeof e!="string"||e.length===0||e.length>100||e.trim()!==e||e.includes("/")||e.includes("\\")?!1:/^[\w!.\*'() &$@=;:+,?-]+$/.test(e),yd=e=>{var t;return e.msg||e.message||e.error_description||(typeof e.error=="string"?e.error:(t=e.error)===null||t===void 0?void 0:t.message)||JSON.stringify(e)},b0=async(e,t,r,n)=>{if(e!==null&&typeof e=="object"&&typeof e.json=="function"){const s=e;let a=parseInt(s.status,10);Number.isFinite(a)||(a=500),s.json().then(o=>{const l=(o==null?void 0:o.statusCode)||(o==null?void 0:o.code)||a+"";t(new vl(yd(o),a,l,n))}).catch(()=>{const o=a+"";t(new vl(s.statusText||`HTTP ${a} error`,a,o,n))})}else t(new gf(yd(e),e,n))},w0=(e,t,r,n)=>{const s={method:e,headers:(t==null?void 0:t.headers)||{}};if(e==="GET"||e==="HEAD"||!n)return V(V({},s),r);if(x0(n)){var a;const o=(t==null?void 0:t.headers)||{};let l;for(const[c,u]of Object.entries(o))c.toLowerCase()==="content-type"&&(l=u);s.headers=wc(o,"Content-Type",(a=l)!==null&&a!==void 0?a:"application/json"),s.body=JSON.stringify(n)}else s.body=n;return t!=null&&t.duplex&&(s.duplex=t.duplex),V(V({},s),r)};async function Zn(e,t,r,n,s,a,o){return new Promise((l,c)=>{e(r,w0(t,n,s,a)).then(u=>{if(!u.ok)throw u;if(n!=null&&n.noResolveJson)return u;if(o==="vectors"){const d=u.headers.get("content-type");if(u.headers.get("content-length")==="0"||u.status===204)return{};if(!d||!d.includes("application/json"))return{}}return u.json()}).then(u=>l(u)).catch(u=>b0(u,c,n,o))})}function mf(e="storage"){return{get:async(t,r,n,s)=>Zn(t,"GET",r,n,s,void 0,e),post:async(t,r,n,s,a)=>Zn(t,"POST",r,s,a,n,e),put:async(t,r,n,s,a)=>Zn(t,"PUT",r,s,a,n,e),head:async(t,r,n,s)=>Zn(t,"HEAD",r,V(V({},n),{},{noResolveJson:!0}),s,void 0,e),remove:async(t,r,n,s,a)=>Zn(t,"DELETE",r,s,a,n,e)}}const _0=mf("storage"),{get:Ds,post:Nt,put:xl,head:j0,remove:_c}=_0,st=mf("vectors");var Bn=class{constructor(e,t={},r,n="storage"){this.shouldThrowOnError=!1,this.url=e,this.headers=v0(t),this.fetch=y0(r),this.namespace=n}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(e,t){return this.headers=wc(this.headers,e,t),this}async handleOperation(e){var t=this;try{return{data:await e(),error:null}}catch(r){if(t.shouldThrowOnError)throw r;if(Pi(r))return{data:null,error:r};throw r}}},S0=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t}then(e,t){return this.execute().then(e,t)}async execute(){var e=this;try{return{data:(await e.downloadFn()).body,error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(Pi(t))return{data:null,error:t};throw t}}};let vf;vf=Symbol.toStringTag;var N0=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t,this[vf]="BlobDownloadBuilder",this.promise=null}asStream(){return new S0(this.downloadFn,this.shouldThrowOnError)}then(e,t){return this.getPromise().then(e,t)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||(this.promise=this.execute()),this.promise}async execute(){var e=this;try{return{data:await(await e.downloadFn()).blob(),error:null}}catch(t){if(e.shouldThrowOnError)throw t;if(Pi(t))return{data:null,error:t};throw t}}};const E0={limit:100,offset:0,sortBy:{column:"name",order:"asc"}},xd={cacheControl:"3600",contentType:"text/plain;charset=UTF-8",upsert:!1};var T0=class extends Bn{constructor(e,t={},r,n){super(e,t,n,"storage"),this.bucketId=r}async uploadOrUpdate(e,t,r,n){var s=this;return s.handleOperation(async()=>{let a;const o=V(V({},xd),n);let l=V(V({},s.headers),e==="POST"&&{"x-upsert":String(o.upsert)});const c=o.metadata;if(typeof Blob<"u"&&r instanceof Blob?(a=new FormData,a.append("cacheControl",o.cacheControl),c&&a.append("metadata",s.encodeMetadata(c)),a.append("",r)):typeof FormData<"u"&&r instanceof FormData?(a=r,a.has("cacheControl")||a.append("cacheControl",o.cacheControl),c&&!a.has("metadata")&&a.append("metadata",s.encodeMetadata(c))):(a=r,l["cache-control"]=`max-age=${o.cacheControl}`,l["content-type"]=o.contentType,c&&(l["x-metadata"]=s.toBase64(s.encodeMetadata(c))),(typeof ReadableStream<"u"&&a instanceof ReadableStream||a&&typeof a=="object"&&"pipe"in a&&typeof a.pipe=="function")&&!o.duplex&&(o.duplex="half")),n!=null&&n.headers)for(const[p,v]of Object.entries(n.headers))l=wc(l,p,v);const u=s._removeEmptyFolders(t),d=s._getFinalPath(u),h=await(e=="PUT"?xl:Nt)(s.fetch,`${s.url}/object/${d}`,a,V({headers:l},o!=null&&o.duplex?{duplex:o.duplex}:{}));return{path:u,id:h.Id,fullPath:h.Key}})}async upload(e,t,r){return this.uploadOrUpdate("POST",e,t,r)}async uploadToSignedUrl(e,t,r,n){var s=this;const a=s._removeEmptyFolders(e),o=s._getFinalPath(a),l=new URL(s.url+`/object/upload/sign/${o}`);return l.searchParams.set("token",t),s.handleOperation(async()=>{let c;const u=V(V({},xd),n),d=V(V({},s.headers),{"x-upsert":String(u.upsert)});return typeof Blob<"u"&&r instanceof Blob?(c=new FormData,c.append("cacheControl",u.cacheControl),c.append("",r)):typeof FormData<"u"&&r instanceof FormData?(c=r,c.append("cacheControl",u.cacheControl)):(c=r,d["cache-control"]=`max-age=${u.cacheControl}`,d["content-type"]=u.contentType),{path:a,fullPath:(await xl(s.fetch,l.toString(),c,{headers:d})).Key}})}async createSignedUploadUrl(e,t){var r=this;return r.handleOperation(async()=>{let n=r._getFinalPath(e);const s=V({},r.headers);t!=null&&t.upsert&&(s["x-upsert"]="true");const a=await Nt(r.fetch,`${r.url}/object/upload/sign/${n}`,{},{headers:s}),o=new URL(r.url+a.url),l=o.searchParams.get("token");if(!l)throw new Ri("No token returned by API");return{signedUrl:o.toString(),path:e,token:l}})}async update(e,t,r){return this.uploadOrUpdate("PUT",e,t,r)}async move(e,t,r){var n=this;return n.handleOperation(async()=>await Nt(n.fetch,`${n.url}/object/move`,{bucketId:n.bucketId,sourceKey:e,destinationKey:t,destinationBucket:r==null?void 0:r.destinationBucket},{headers:n.headers}))}async copy(e,t,r){var n=this;return n.handleOperation(async()=>({path:(await Nt(n.fetch,`${n.url}/object/copy`,{bucketId:n.bucketId,sourceKey:e,destinationKey:t,destinationBucket:r==null?void 0:r.destinationBucket},{headers:n.headers})).Key}))}async createSignedUrl(e,t,r){var n=this;return n.handleOperation(async()=>{let s=n._getFinalPath(e);const a=typeof(r==null?void 0:r.transform)=="object"&&r.transform!==null&&Object.keys(r.transform).length>0;let o=await Nt(n.fetch,`${n.url}/object/sign/${s}`,V({expiresIn:t},a?{transform:r.transform}:{}),{headers:n.headers});const l=new URLSearchParams;r!=null&&r.download&&l.set("download",r.download===!0?"":r.download),(r==null?void 0:r.cacheNonce)!=null&&l.set("cacheNonce",String(r.cacheNonce));const c=l.toString();return{signedUrl:encodeURI(`${n.url}${o.signedURL}${c?`&${c}`:""}`)}})}async createSignedUrls(e,t,r){var n=this;return n.handleOperation(async()=>{const s=await Nt(n.fetch,`${n.url}/object/sign/${n.bucketId}`,{expiresIn:t,paths:e},{headers:n.headers}),a=new URLSearchParams;r!=null&&r.download&&a.set("download",r.download===!0?"":r.download),(r==null?void 0:r.cacheNonce)!=null&&a.set("cacheNonce",String(r.cacheNonce));const o=a.toString();return s.map(l=>V(V({},l),{},{signedUrl:l.signedURL?encodeURI(`${n.url}${l.signedURL}${o?`&${o}`:""}`):null}))})}download(e,t,r){const n=typeof(t==null?void 0:t.transform)=="object"&&t.transform!==null&&Object.keys(t.transform).length>0?"render/image/authenticated":"object",s=new URLSearchParams;t!=null&&t.transform&&this.applyTransformOptsToQuery(s,t.transform),(t==null?void 0:t.cacheNonce)!=null&&s.set("cacheNonce",String(t.cacheNonce));const a=s.toString(),o=this._getFinalPath(e),l=()=>Ds(this.fetch,`${this.url}/${n}/${o}${a?`?${a}`:""}`,{headers:this.headers,noResolveJson:!0},r);return new N0(l,this.shouldThrowOnError)}async info(e){var t=this;const r=t._getFinalPath(e);return t.handleOperation(async()=>yl(await Ds(t.fetch,`${t.url}/object/info/${r}`,{headers:t.headers})))}async exists(e){var t=this;const r=t._getFinalPath(e);try{return await j0(t.fetch,`${t.url}/object/${r}`,{headers:t.headers}),{data:!0,error:null}}catch(s){if(t.shouldThrowOnError)throw s;if(Pi(s)){var n;const a=s instanceof vl?s.status:s instanceof gf?(n=s.originalError)===null||n===void 0?void 0:n.status:void 0;if(a!==void 0&&[400,404].includes(a))return{data:!1,error:s}}throw s}}getPublicUrl(e,t){const r=this._getFinalPath(e),n=new URLSearchParams;t!=null&&t.download&&n.set("download",t.download===!0?"":t.download),t!=null&&t.transform&&this.applyTransformOptsToQuery(n,t.transform),(t==null?void 0:t.cacheNonce)!=null&&n.set("cacheNonce",String(t.cacheNonce));const s=n.toString(),a=typeof(t==null?void 0:t.transform)=="object"&&t.transform!==null&&Object.keys(t.transform).length>0?"render/image":"object";return{data:{publicUrl:encodeURI(`${this.url}/${a}/public/${r}`)+(s?`?${s}`:"")}}}async remove(e){var t=this;return t.handleOperation(async()=>await _c(t.fetch,`${t.url}/object/${t.bucketId}`,{prefixes:e},{headers:t.headers}))}async list(e,t,r){var n=this;return n.handleOperation(async()=>{const s=V(V(V({},E0),t),{},{prefix:e||""});return await Nt(n.fetch,`${n.url}/object/list/${n.bucketId}`,s,{headers:n.headers},r)})}async listV2(e,t){var r=this;return r.handleOperation(async()=>{const n=V({},e);return await Nt(r.fetch,`${r.url}/object/list-v2/${r.bucketId}`,n,{headers:r.headers},t)})}encodeMetadata(e){return JSON.stringify(e)}toBase64(e){return typeof Buffer<"u"?Buffer.from(e).toString("base64"):btoa(e)}_getFinalPath(e){return`${this.bucketId}/${e.replace(/^\/+/,"")}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,"").replace(/\/+/g,"/")}applyTransformOptsToQuery(e,t){return t.width&&e.set("width",t.width.toString()),t.height&&e.set("height",t.height.toString()),t.resize&&e.set("resize",t.resize),t.format&&e.set("format",t.format),t.quality&&e.set("quality",t.quality.toString()),e}};const C0="2.104.1",Gs={"X-Client-Info":`storage-js/${C0}`};var A0=class extends Bn{constructor(e,t={},r,n){const s=new URL(e);n!=null&&n.useNewHostname&&/supabase\.(co|in|red)$/.test(s.hostname)&&!s.hostname.includes("storage.supabase.")&&(s.hostname=s.hostname.replace("supabase.","storage.supabase."));const a=s.href.replace(/\/$/,""),o=V(V({},Gs),t);super(a,o,r,"storage")}async listBuckets(e){var t=this;return t.handleOperation(async()=>{const r=t.listBucketOptionsToQueryString(e);return await Ds(t.fetch,`${t.url}/bucket${r}`,{headers:t.headers})})}async getBucket(e){var t=this;return t.handleOperation(async()=>await Ds(t.fetch,`${t.url}/bucket/${e}`,{headers:t.headers}))}async createBucket(e,t={public:!1}){var r=this;return r.handleOperation(async()=>await Nt(r.fetch,`${r.url}/bucket`,{id:e,name:e,type:t.type,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes},{headers:r.headers}))}async updateBucket(e,t){var r=this;return r.handleOperation(async()=>await xl(r.fetch,`${r.url}/bucket/${e}`,{id:e,name:e,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes},{headers:r.headers}))}async emptyBucket(e){var t=this;return t.handleOperation(async()=>await Nt(t.fetch,`${t.url}/bucket/${e}/empty`,{},{headers:t.headers}))}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await _c(t.fetch,`${t.url}/bucket/${e}`,{},{headers:t.headers}))}listBucketOptionsToQueryString(e){const t={};return e&&("limit"in e&&(t.limit=String(e.limit)),"offset"in e&&(t.offset=String(e.offset)),e.search&&(t.search=e.search),e.sortColumn&&(t.sortColumn=e.sortColumn),e.sortOrder&&(t.sortOrder=e.sortOrder)),Object.keys(t).length>0?"?"+new URLSearchParams(t).toString():""}},R0=class extends Bn{constructor(e,t={},r){const n=e.replace(/\/$/,""),s=V(V({},Gs),t);super(n,s,r,"storage")}async createBucket(e){var t=this;return t.handleOperation(async()=>await Nt(t.fetch,`${t.url}/bucket`,{name:e},{headers:t.headers}))}async listBuckets(e){var t=this;return t.handleOperation(async()=>{const r=new URLSearchParams;(e==null?void 0:e.limit)!==void 0&&r.set("limit",e.limit.toString()),(e==null?void 0:e.offset)!==void 0&&r.set("offset",e.offset.toString()),e!=null&&e.sortColumn&&r.set("sortColumn",e.sortColumn),e!=null&&e.sortOrder&&r.set("sortOrder",e.sortOrder),e!=null&&e.search&&r.set("search",e.search);const n=r.toString(),s=n?`${t.url}/bucket?${n}`:`${t.url}/bucket`;return await Ds(t.fetch,s,{headers:t.headers})})}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await _c(t.fetch,`${t.url}/bucket/${e}`,{},{headers:t.headers}))}from(e){var t=this;if(!k0(e))throw new Ri("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");const r=new p0({baseUrl:this.url,catalogName:e,auth:{type:"custom",getHeaders:async()=>t.headers},fetch:this.fetch}),n=this.shouldThrowOnError;return new Proxy(r,{get(s,a){const o=s[a];return typeof o!="function"?o:async(...l)=>{try{return{data:await o.apply(s,l),error:null}}catch(c){if(n)throw c;return{data:null,error:c}}}}})}},P0=class extends Bn{constructor(e,t={},r){const n=e.replace(/\/$/,""),s=V(V({},Gs),{},{"Content-Type":"application/json"},t);super(n,s,r,"vectors")}async createIndex(e){var t=this;return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/CreateIndex`,e,{headers:t.headers})||{})}async getIndex(e,t){var r=this;return r.handleOperation(async()=>await st.post(r.fetch,`${r.url}/GetIndex`,{vectorBucketName:e,indexName:t},{headers:r.headers}))}async listIndexes(e){var t=this;return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/ListIndexes`,e,{headers:t.headers}))}async deleteIndex(e,t){var r=this;return r.handleOperation(async()=>await st.post(r.fetch,`${r.url}/DeleteIndex`,{vectorBucketName:e,indexName:t},{headers:r.headers})||{})}},O0=class extends Bn{constructor(e,t={},r){const n=e.replace(/\/$/,""),s=V(V({},Gs),{},{"Content-Type":"application/json"},t);super(n,s,r,"vectors")}async putVectors(e){var t=this;if(e.vectors.length<1||e.vectors.length>500)throw new Error("Vector batch size must be between 1 and 500 items");return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/PutVectors`,e,{headers:t.headers})||{})}async getVectors(e){var t=this;return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/GetVectors`,e,{headers:t.headers}))}async listVectors(e){var t=this;if(e.segmentCount!==void 0){if(e.segmentCount<1||e.segmentCount>16)throw new Error("segmentCount must be between 1 and 16");if(e.segmentIndex!==void 0&&(e.segmentIndex<0||e.segmentIndex>=e.segmentCount))throw new Error(`segmentIndex must be between 0 and ${e.segmentCount-1}`)}return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/ListVectors`,e,{headers:t.headers}))}async queryVectors(e){var t=this;return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/QueryVectors`,e,{headers:t.headers}))}async deleteVectors(e){var t=this;if(e.keys.length<1||e.keys.length>500)throw new Error("Keys batch size must be between 1 and 500 items");return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/DeleteVectors`,e,{headers:t.headers})||{})}},L0=class extends Bn{constructor(e,t={},r){const n=e.replace(/\/$/,""),s=V(V({},Gs),{},{"Content-Type":"application/json"},t);super(n,s,r,"vectors")}async createBucket(e){var t=this;return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/CreateVectorBucket`,{vectorBucketName:e},{headers:t.headers})||{})}async getBucket(e){var t=this;return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/GetVectorBucket`,{vectorBucketName:e},{headers:t.headers}))}async listBuckets(e={}){var t=this;return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/ListVectorBuckets`,e,{headers:t.headers}))}async deleteBucket(e){var t=this;return t.handleOperation(async()=>await st.post(t.fetch,`${t.url}/DeleteVectorBucket`,{vectorBucketName:e},{headers:t.headers})||{})}},$0=class extends L0{constructor(e,t={}){super(e,t.headers||{},t.fetch)}from(e){return new I0(this.url,this.headers,e,this.fetch)}async createBucket(e){var t=()=>super.createBucket,r=this;return t().call(r,e)}async getBucket(e){var t=()=>super.getBucket,r=this;return t().call(r,e)}async listBuckets(e={}){var t=()=>super.listBuckets,r=this;return t().call(r,e)}async deleteBucket(e){var t=()=>super.deleteBucket,r=this;return t().call(r,e)}},I0=class extends P0{constructor(e,t,r,n){super(e,t,n),this.vectorBucketName=r}async createIndex(e){var t=()=>super.createIndex,r=this;return t().call(r,V(V({},e),{},{vectorBucketName:r.vectorBucketName}))}async listIndexes(e={}){var t=()=>super.listIndexes,r=this;return t().call(r,V(V({},e),{},{vectorBucketName:r.vectorBucketName}))}async getIndex(e){var t=()=>super.getIndex,r=this;return t().call(r,r.vectorBucketName,e)}async deleteIndex(e){var t=()=>super.deleteIndex,r=this;return t().call(r,r.vectorBucketName,e)}index(e){return new U0(this.url,this.headers,this.vectorBucketName,e,this.fetch)}},U0=class extends O0{constructor(e,t,r,n,s){super(e,t,s),this.vectorBucketName=r,this.indexName=n}async putVectors(e){var t=()=>super.putVectors,r=this;return t().call(r,V(V({},e),{},{vectorBucketName:r.vectorBucketName,indexName:r.indexName}))}async getVectors(e){var t=()=>super.getVectors,r=this;return t().call(r,V(V({},e),{},{vectorBucketName:r.vectorBucketName,indexName:r.indexName}))}async listVectors(e={}){var t=()=>super.listVectors,r=this;return t().call(r,V(V({},e),{},{vectorBucketName:r.vectorBucketName,indexName:r.indexName}))}async queryVectors(e){var t=()=>super.queryVectors,r=this;return t().call(r,V(V({},e),{},{vectorBucketName:r.vectorBucketName,indexName:r.indexName}))}async deleteVectors(e){var t=()=>super.deleteVectors,r=this;return t().call(r,V(V({},e),{},{vectorBucketName:r.vectorBucketName,indexName:r.indexName}))}},z0=class extends A0{constructor(e,t={},r,n){super(e,t,r,n)}from(e){return new T0(this.url,this.headers,e,this.fetch)}get vectors(){return new $0(this.url+"/vector",{headers:this.headers,fetch:this.fetch})}get analytics(){return new R0(this.url+"/iceberg",this.headers,this.fetch)}};const yf="2.104.1",cn=30*1e3,kl=3,lo=kl*cn,D0="http://localhost:9999",F0="supabase.auth.token",M0={"X-Client-Info":`gotrue-js/${yf}`},bl="X-Supabase-Api-Version",xf={"2024-01-01":{timestamp:Date.parse("2024-01-01T00:00:00.0Z"),name:"2024-01-01"}},B0=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i,W0=10*60*1e3;class Fs extends Error{constructor(t,r,n){super(t),this.__isAuthError=!0,this.name="AuthError",this.status=r,this.code=n}toJSON(){return{name:this.name,message:this.message,status:this.status,code:this.code}}}function F(e){return typeof e=="object"&&e!==null&&"__isAuthError"in e}class H0 extends Fs{constructor(t,r,n){super(t,r,n),this.name="AuthApiError",this.status=r,this.code=n}}function V0(e){return F(e)&&e.name==="AuthApiError"}class Ur extends Fs{constructor(t,r){super(t),this.name="AuthUnknownError",this.originalError=r}}class rr extends Fs{constructor(t,r,n,s){super(t,n,s),this.name=r,this.status=n}}class rt extends rr{constructor(){super("Auth session missing!","AuthSessionMissingError",400,void 0)}}function va(e){return F(e)&&e.name==="AuthSessionMissingError"}class tn extends rr{constructor(){super("Auth session or user missing","AuthInvalidTokenResponseError",500,void 0)}}class ya extends rr{constructor(t){super(t,"AuthInvalidCredentialsError",400,void 0)}}class xa extends rr{constructor(t,r=null){super(t,"AuthImplicitGrantRedirectError",500,void 0),this.details=null,this.details=r}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}}function q0(e){return F(e)&&e.name==="AuthImplicitGrantRedirectError"}class kd extends rr{constructor(t,r=null){super(t,"AuthPKCEGrantCodeExchangeError",500,void 0),this.details=null,this.details=r}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{details:this.details})}}class K0 extends rr{constructor(){super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.","AuthPKCECodeVerifierMissingError",400,"pkce_code_verifier_not_found")}}class wl extends rr{constructor(t,r){super(t,"AuthRetryableFetchError",r,void 0)}}function co(e){return F(e)&&e.name==="AuthRetryableFetchError"}class bd extends rr{constructor(t,r,n){super(t,"AuthWeakPasswordError",r,"weak_password"),this.reasons=n}toJSON(){return Object.assign(Object.assign({},super.toJSON()),{reasons:this.reasons})}}class _l extends rr{constructor(t){super(t,"AuthInvalidJwtError",400,"invalid_jwt")}}const ui="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""),wd=` 	
\r=`.split(""),G0=(()=>{const e=new Array(128);for(let t=0;t<e.length;t+=1)e[t]=-1;for(let t=0;t<wd.length;t+=1)e[wd[t].charCodeAt(0)]=-2;for(let t=0;t<ui.length;t+=1)e[ui[t].charCodeAt(0)]=t;return e})();function _d(e,t,r){if(e!==null)for(t.queue=t.queue<<8|e,t.queuedBits+=8;t.queuedBits>=6;){const n=t.queue>>t.queuedBits-6&63;r(ui[n]),t.queuedBits-=6}else if(t.queuedBits>0)for(t.queue=t.queue<<6-t.queuedBits,t.queuedBits=6;t.queuedBits>=6;){const n=t.queue>>t.queuedBits-6&63;r(ui[n]),t.queuedBits-=6}}function kf(e,t,r){const n=G0[e];if(n>-1)for(t.queue=t.queue<<6|n,t.queuedBits+=6;t.queuedBits>=8;)r(t.queue>>t.queuedBits-8&255),t.queuedBits-=8;else{if(n===-2)return;throw new Error(`Invalid Base64-URL character "${String.fromCharCode(e)}"`)}}function jd(e){const t=[],r=o=>{t.push(String.fromCodePoint(o))},n={utf8seq:0,codepoint:0},s={queue:0,queuedBits:0},a=o=>{Q0(o,n,r)};for(let o=0;o<e.length;o+=1)kf(e.charCodeAt(o),s,a);return t.join("")}function J0(e,t){if(e<=127){t(e);return}else if(e<=2047){t(192|e>>6),t(128|e&63);return}else if(e<=65535){t(224|e>>12),t(128|e>>6&63),t(128|e&63);return}else if(e<=1114111){t(240|e>>18),t(128|e>>12&63),t(128|e>>6&63),t(128|e&63);return}throw new Error(`Unrecognized Unicode codepoint: ${e.toString(16)}`)}function Y0(e,t){for(let r=0;r<e.length;r+=1){let n=e.charCodeAt(r);if(n>55295&&n<=56319){const s=(n-55296)*1024&65535;n=(e.charCodeAt(r+1)-56320&65535|s)+65536,r+=1}J0(n,t)}}function Q0(e,t,r){if(t.utf8seq===0){if(e<=127){r(e);return}for(let n=1;n<6;n+=1)if(!(e>>7-n&1)){t.utf8seq=n;break}if(t.utf8seq===2)t.codepoint=e&31;else if(t.utf8seq===3)t.codepoint=e&15;else if(t.utf8seq===4)t.codepoint=e&7;else throw new Error("Invalid UTF-8 sequence");t.utf8seq-=1}else if(t.utf8seq>0){if(e<=127)throw new Error("Invalid UTF-8 sequence");t.codepoint=t.codepoint<<6|e&63,t.utf8seq-=1,t.utf8seq===0&&r(t.codepoint)}}function Rn(e){const t=[],r={queue:0,queuedBits:0},n=s=>{t.push(s)};for(let s=0;s<e.length;s+=1)kf(e.charCodeAt(s),r,n);return new Uint8Array(t)}function X0(e){const t=[];return Y0(e,r=>t.push(r)),new Uint8Array(t)}function Mr(e){const t=[],r={queue:0,queuedBits:0},n=s=>{t.push(s)};return e.forEach(s=>_d(s,r,n)),_d(null,r,n),t.join("")}function Z0(e){return Math.round(Date.now()/1e3)+e}function ey(){return Symbol("auth-callback")}const Pe=()=>typeof window<"u"&&typeof document<"u",Pr={tested:!1,writable:!1},bf=()=>{if(!Pe())return!1;try{if(typeof globalThis.localStorage!="object")return!1}catch{return!1}if(Pr.tested)return Pr.writable;const e=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(e,e),globalThis.localStorage.removeItem(e),Pr.tested=!0,Pr.writable=!0}catch{Pr.tested=!0,Pr.writable=!1}return Pr.writable};function ty(e){const t={},r=new URL(e);if(r.hash&&r.hash[0]==="#")try{new URLSearchParams(r.hash.substring(1)).forEach((s,a)=>{t[a]=s})}catch{}return r.searchParams.forEach((n,s)=>{t[s]=n}),t}const wf=e=>e?(...t)=>e(...t):(...t)=>fetch(...t),ry=e=>typeof e=="object"&&e!==null&&"status"in e&&"ok"in e&&"json"in e&&typeof e.json=="function",un=async(e,t,r)=>{await e.setItem(t,JSON.stringify(r))},Or=async(e,t)=>{const r=await e.getItem(t);if(!r)return null;try{return JSON.parse(r)}catch{return r}},Re=async(e,t)=>{await e.removeItem(t)};class Oi{constructor(){this.promise=new Oi.promiseConstructor((t,r)=>{this.resolve=t,this.reject=r})}}Oi.promiseConstructor=Promise;function ka(e){const t=e.split(".");if(t.length!==3)throw new _l("Invalid JWT structure");for(let n=0;n<t.length;n++)if(!B0.test(t[n]))throw new _l("JWT not in base64url format");return{header:JSON.parse(jd(t[0])),payload:JSON.parse(jd(t[1])),signature:Rn(t[2]),raw:{header:t[0],payload:t[1]}}}async function ny(e){return await new Promise(t=>{setTimeout(()=>t(null),e)})}function sy(e,t){return new Promise((n,s)=>{(async()=>{for(let a=0;a<1/0;a++)try{const o=await e(a);if(!t(a,null,o)){n(o);return}}catch(o){if(!t(a,o)){s(o);return}}})()})}function ay(e){return("0"+e.toString(16)).substr(-2)}function iy(){const t=new Uint32Array(56);if(typeof crypto>"u"){const r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",n=r.length;let s="";for(let a=0;a<56;a++)s+=r.charAt(Math.floor(Math.random()*n));return s}return crypto.getRandomValues(t),Array.from(t,ay).join("")}async function oy(e){const r=new TextEncoder().encode(e),n=await crypto.subtle.digest("SHA-256",r),s=new Uint8Array(n);return Array.from(s).map(a=>String.fromCharCode(a)).join("")}async function ly(e){if(!(typeof crypto<"u"&&typeof crypto.subtle<"u"&&typeof TextEncoder<"u"))return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."),e;const r=await oy(e);return btoa(r).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}async function rn(e,t,r=!1){const n=iy();let s=n;r&&(s+="/recovery"),await un(e,`${t}-code-verifier`,s);const a=await ly(n);return[a,n===a?"plain":"s256"]}const cy=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;function uy(e){const t=e.headers.get(bl);if(!t||!t.match(cy))return null;try{return new Date(`${t}T00:00:00.0Z`)}catch{return null}}function dy(e){if(!e)throw new Error("Missing exp claim");const t=Math.floor(Date.now()/1e3);if(e<=t)throw new Error("JWT has expired")}function hy(e){switch(e){case"RS256":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}};case"ES256":return{name:"ECDSA",namedCurve:"P-256",hash:{name:"SHA-256"}};default:throw new Error("Invalid alg claim")}}const py=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;function nn(e){if(!py.test(e))throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not")}function uo(){const e={};return new Proxy(e,{get:(t,r)=>{if(r==="__isUserNotAvailableProxy")return!0;if(typeof r=="symbol"){const n=r.toString();if(n==="Symbol(Symbol.toPrimitive)"||n==="Symbol(Symbol.toStringTag)"||n==="Symbol(util.inspect.custom)")return}throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${r}" property of the session object is not supported. Please use getUser() instead.`)},set:(t,r)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(t,r)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${r}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function fy(e,t){return new Proxy(e,{get:(r,n,s)=>{if(n==="__isInsecureUserWarningProxy")return!0;if(typeof n=="symbol"){const a=n.toString();if(a==="Symbol(Symbol.toPrimitive)"||a==="Symbol(Symbol.toStringTag)"||a==="Symbol(util.inspect.custom)"||a==="Symbol(nodejs.util.inspect.custom)")return Reflect.get(r,n,s)}return!t.value&&typeof n=="string"&&(console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."),t.value=!0),Reflect.get(r,n,s)}})}function Sd(e){return JSON.parse(JSON.stringify(e))}const Ir=e=>e.msg||e.message||e.error_description||e.error||JSON.stringify(e),gy=[502,503,504,520,521,522,523,524,530];async function Nd(e){var t;if(!ry(e))throw new wl(Ir(e),0);if(gy.includes(e.status))throw new wl(Ir(e),e.status);let r;try{r=await e.json()}catch(a){throw new Ur(Ir(a),a)}let n;const s=uy(e);if(s&&s.getTime()>=xf["2024-01-01"].timestamp&&typeof r=="object"&&r&&typeof r.code=="string"?n=r.code:typeof r=="object"&&r&&typeof r.error_code=="string"&&(n=r.error_code),n){if(n==="weak_password")throw new bd(Ir(r),e.status,((t=r.weak_password)===null||t===void 0?void 0:t.reasons)||[]);if(n==="session_not_found")throw new rt}else if(typeof r=="object"&&r&&typeof r.weak_password=="object"&&r.weak_password&&Array.isArray(r.weak_password.reasons)&&r.weak_password.reasons.length&&r.weak_password.reasons.reduce((a,o)=>a&&typeof o=="string",!0))throw new bd(Ir(r),e.status,r.weak_password.reasons);throw new H0(Ir(r),e.status||500,n)}const my=(e,t,r,n)=>{const s={method:e,headers:(t==null?void 0:t.headers)||{}};return e==="GET"?s:(s.headers=Object.assign({"Content-Type":"application/json;charset=UTF-8"},t==null?void 0:t.headers),s.body=JSON.stringify(n),Object.assign(Object.assign({},s),r))};async function W(e,t,r,n){var s;const a=Object.assign({},n==null?void 0:n.headers);a[bl]||(a[bl]=xf["2024-01-01"].name),n!=null&&n.jwt&&(a.Authorization=`Bearer ${n.jwt}`);const o=(s=n==null?void 0:n.query)!==null&&s!==void 0?s:{};n!=null&&n.redirectTo&&(o.redirect_to=n.redirectTo);const l=Object.keys(o).length?"?"+new URLSearchParams(o).toString():"",c=await vy(e,t,r+l,{headers:a,noResolveJson:n==null?void 0:n.noResolveJson},{},n==null?void 0:n.body);return n!=null&&n.xform?n==null?void 0:n.xform(c):{data:Object.assign({},c),error:null}}async function vy(e,t,r,n,s,a){const o=my(t,n,s,a);let l;try{l=await e(r,Object.assign({},o))}catch(c){throw console.error(c),new wl(Ir(c),0)}if(l.ok||await Nd(l),n!=null&&n.noResolveJson)return l;try{return await l.json()}catch(c){await Nd(c)}}function jt(e){var t;let r=null;ky(e)&&(r=Object.assign({},e),e.expires_at||(r.expires_at=Z0(e.expires_in)));const n=(t=e.user)!==null&&t!==void 0?t:e;return{data:{session:r,user:n},error:null}}function Ed(e){const t=jt(e);return!t.error&&e.weak_password&&typeof e.weak_password=="object"&&Array.isArray(e.weak_password.reasons)&&e.weak_password.reasons.length&&e.weak_password.message&&typeof e.weak_password.message=="string"&&e.weak_password.reasons.reduce((r,n)=>r&&typeof n=="string",!0)&&(t.data.weak_password=e.weak_password),t}function mr(e){var t;return{data:{user:(t=e.user)!==null&&t!==void 0?t:e},error:null}}function yy(e){return{data:e,error:null}}function xy(e){const{action_link:t,email_otp:r,hashed_token:n,redirect_to:s,verification_type:a}=e,o=Ai(e,["action_link","email_otp","hashed_token","redirect_to","verification_type"]),l={action_link:t,email_otp:r,hashed_token:n,redirect_to:s,verification_type:a},c=Object.assign({},o);return{data:{properties:l,user:c},error:null}}function Td(e){return e}function ky(e){return e.access_token&&e.refresh_token&&e.expires_in}const ho=["global","local","others"];class by{constructor({url:t="",headers:r={},fetch:n}){this.url=t,this.headers=r,this.fetch=wf(n),this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)},this.customProviders={listProviders:this._listCustomProviders.bind(this),createProvider:this._createCustomProvider.bind(this),getProvider:this._getCustomProvider.bind(this),updateProvider:this._updateCustomProvider.bind(this),deleteProvider:this._deleteCustomProvider.bind(this)}}async signOut(t,r=ho[0]){if(ho.indexOf(r)<0)throw new Error(`@supabase/auth-js: Parameter scope must be one of ${ho.join(", ")}`);try{return await W(this.fetch,"POST",`${this.url}/logout?scope=${r}`,{headers:this.headers,jwt:t,noResolveJson:!0}),{data:null,error:null}}catch(n){if(F(n))return{data:null,error:n};throw n}}async inviteUserByEmail(t,r={}){try{return await W(this.fetch,"POST",`${this.url}/invite`,{body:{email:t,data:r.data},headers:this.headers,redirectTo:r.redirectTo,xform:mr})}catch(n){if(F(n))return{data:{user:null},error:n};throw n}}async generateLink(t){try{const{options:r}=t,n=Ai(t,["options"]),s=Object.assign(Object.assign({},n),r);return"newEmail"in n&&(s.new_email=n==null?void 0:n.newEmail,delete s.newEmail),await W(this.fetch,"POST",`${this.url}/admin/generate_link`,{body:s,headers:this.headers,xform:xy,redirectTo:r==null?void 0:r.redirectTo})}catch(r){if(F(r))return{data:{properties:null,user:null},error:r};throw r}}async createUser(t){try{return await W(this.fetch,"POST",`${this.url}/admin/users`,{body:t,headers:this.headers,xform:mr})}catch(r){if(F(r))return{data:{user:null},error:r};throw r}}async listUsers(t){var r,n,s,a,o,l,c;try{const u={nextPage:null,lastPage:0,total:0},d=await W(this.fetch,"GET",`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:(n=(r=t==null?void 0:t.page)===null||r===void 0?void 0:r.toString())!==null&&n!==void 0?n:"",per_page:(a=(s=t==null?void 0:t.perPage)===null||s===void 0?void 0:s.toString())!==null&&a!==void 0?a:""},xform:Td});if(d.error)throw d.error;const h=await d.json(),p=(o=d.headers.get("x-total-count"))!==null&&o!==void 0?o:0,v=(c=(l=d.headers.get("link"))===null||l===void 0?void 0:l.split(","))!==null&&c!==void 0?c:[];return v.length>0&&(v.forEach(y=>{const x=parseInt(y.split(";")[0].split("=")[1].substring(0,1)),N=JSON.parse(y.split(";")[1].split("=")[1]);u[`${N}Page`]=x}),u.total=parseInt(p)),{data:Object.assign(Object.assign({},h),u),error:null}}catch(u){if(F(u))return{data:{users:[]},error:u};throw u}}async getUserById(t){nn(t);try{return await W(this.fetch,"GET",`${this.url}/admin/users/${t}`,{headers:this.headers,xform:mr})}catch(r){if(F(r))return{data:{user:null},error:r};throw r}}async updateUserById(t,r){nn(t);try{return await W(this.fetch,"PUT",`${this.url}/admin/users/${t}`,{body:r,headers:this.headers,xform:mr})}catch(n){if(F(n))return{data:{user:null},error:n};throw n}}async deleteUser(t,r=!1){nn(t);try{return await W(this.fetch,"DELETE",`${this.url}/admin/users/${t}`,{headers:this.headers,body:{should_soft_delete:r},xform:mr})}catch(n){if(F(n))return{data:{user:null},error:n};throw n}}async _listFactors(t){nn(t.userId);try{const{data:r,error:n}=await W(this.fetch,"GET",`${this.url}/admin/users/${t.userId}/factors`,{headers:this.headers,xform:s=>({data:{factors:s},error:null})});return{data:r,error:n}}catch(r){if(F(r))return{data:null,error:r};throw r}}async _deleteFactor(t){nn(t.userId),nn(t.id);try{return{data:await W(this.fetch,"DELETE",`${this.url}/admin/users/${t.userId}/factors/${t.id}`,{headers:this.headers}),error:null}}catch(r){if(F(r))return{data:null,error:r};throw r}}async _listOAuthClients(t){var r,n,s,a,o,l,c;try{const u={nextPage:null,lastPage:0,total:0},d=await W(this.fetch,"GET",`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:(n=(r=t==null?void 0:t.page)===null||r===void 0?void 0:r.toString())!==null&&n!==void 0?n:"",per_page:(a=(s=t==null?void 0:t.perPage)===null||s===void 0?void 0:s.toString())!==null&&a!==void 0?a:""},xform:Td});if(d.error)throw d.error;const h=await d.json(),p=(o=d.headers.get("x-total-count"))!==null&&o!==void 0?o:0,v=(c=(l=d.headers.get("link"))===null||l===void 0?void 0:l.split(","))!==null&&c!==void 0?c:[];return v.length>0&&(v.forEach(y=>{const x=parseInt(y.split(";")[0].split("=")[1].substring(0,1)),N=JSON.parse(y.split(";")[1].split("=")[1]);u[`${N}Page`]=x}),u.total=parseInt(p)),{data:Object.assign(Object.assign({},h),u),error:null}}catch(u){if(F(u))return{data:{clients:[]},error:u};throw u}}async _createOAuthClient(t){try{return await W(this.fetch,"POST",`${this.url}/admin/oauth/clients`,{body:t,headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(F(r))return{data:null,error:r};throw r}}async _getOAuthClient(t){try{return await W(this.fetch,"GET",`${this.url}/admin/oauth/clients/${t}`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(F(r))return{data:null,error:r};throw r}}async _updateOAuthClient(t,r){try{return await W(this.fetch,"PUT",`${this.url}/admin/oauth/clients/${t}`,{body:r,headers:this.headers,xform:n=>({data:n,error:null})})}catch(n){if(F(n))return{data:null,error:n};throw n}}async _deleteOAuthClient(t){try{return await W(this.fetch,"DELETE",`${this.url}/admin/oauth/clients/${t}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(r){if(F(r))return{data:null,error:r};throw r}}async _regenerateOAuthClientSecret(t){try{return await W(this.fetch,"POST",`${this.url}/admin/oauth/clients/${t}/regenerate_secret`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(F(r))return{data:null,error:r};throw r}}async _listCustomProviders(t){try{const r={};return t!=null&&t.type&&(r.type=t.type),await W(this.fetch,"GET",`${this.url}/admin/custom-providers`,{headers:this.headers,query:r,xform:n=>{var s;return{data:{providers:(s=n==null?void 0:n.providers)!==null&&s!==void 0?s:[]},error:null}}})}catch(r){if(F(r))return{data:{providers:[]},error:r};throw r}}async _createCustomProvider(t){try{return await W(this.fetch,"POST",`${this.url}/admin/custom-providers`,{body:t,headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(F(r))return{data:null,error:r};throw r}}async _getCustomProvider(t){try{return await W(this.fetch,"GET",`${this.url}/admin/custom-providers/${t}`,{headers:this.headers,xform:r=>({data:r,error:null})})}catch(r){if(F(r))return{data:null,error:r};throw r}}async _updateCustomProvider(t,r){try{return await W(this.fetch,"PUT",`${this.url}/admin/custom-providers/${t}`,{body:r,headers:this.headers,xform:n=>({data:n,error:null})})}catch(n){if(F(n))return{data:null,error:n};throw n}}async _deleteCustomProvider(t){try{return await W(this.fetch,"DELETE",`${this.url}/admin/custom-providers/${t}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(r){if(F(r))return{data:null,error:r};throw r}}}function Cd(e={}){return{getItem:t=>e[t]||null,setItem:(t,r)=>{e[t]=r},removeItem:t=>{delete e[t]}}}const Lt={debug:!!(globalThis&&bf()&&globalThis.localStorage&&globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug")==="true")};class _f extends Error{constructor(t){super(t),this.isAcquireTimeout=!0}}class Ad extends _f{}async function wy(e,t,r){Lt.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquire lock",e,t);const n=new globalThis.AbortController;let s;t>0&&(s=setTimeout(()=>{n.abort(),Lt.debug&&console.log("@supabase/gotrue-js: navigatorLock acquire timed out",e)},t)),await Promise.resolve();try{return await globalThis.navigator.locks.request(e,t===0?{mode:"exclusive",ifAvailable:!0}:{mode:"exclusive",signal:n.signal},async a=>{if(a){clearTimeout(s),Lt.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquired",e,a.name);try{return await r()}finally{Lt.debug&&console.log("@supabase/gotrue-js: navigatorLock: released",e,a.name)}}else{if(t===0)throw Lt.debug&&console.log("@supabase/gotrue-js: navigatorLock: not immediately available",e),new Ad(`Acquiring an exclusive Navigator LockManager lock "${e}" immediately failed`);if(Lt.debug)try{const o=await globalThis.navigator.locks.query();console.log("@supabase/gotrue-js: Navigator LockManager state",JSON.stringify(o,null,"  "))}catch(o){console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state",o)}return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"),clearTimeout(s),await r()}})}catch(a){if(t>0&&clearTimeout(s),(a==null?void 0:a.name)==="AbortError"&&t>0){if(n.signal.aborted)return Lt.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquire timeout, recovering by stealing lock",e),console.warn(`@supabase/gotrue-js: Lock "${e}" was not released within ${t}ms. This may indicate an orphaned lock from a component unmount (e.g., React Strict Mode). Forcefully acquiring the lock to recover.`),await Promise.resolve().then(()=>globalThis.navigator.locks.request(e,{mode:"exclusive",steal:!0},async o=>{if(o){Lt.debug&&console.log("@supabase/gotrue-js: navigatorLock: recovered (stolen)",e,o.name);try{return await r()}finally{Lt.debug&&console.log("@supabase/gotrue-js: navigatorLock: released (stolen)",e,o.name)}}else return console.warn("@supabase/gotrue-js: Navigator LockManager returned null lock even with steal: true"),await r()}));throw Lt.debug&&console.log("@supabase/gotrue-js: navigatorLock: lock was stolen by another request",e),new Ad(`Lock "${e}" was released because another request stole it`)}throw a}}function _y(){if(typeof globalThis!="object")try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch{typeof self<"u"&&(self.globalThis=self)}}function jf(e){if(!/^0x[a-fA-F0-9]{40}$/.test(e))throw new Error(`@supabase/auth-js: Address "${e}" is invalid.`);return e.toLowerCase()}function jy(e){return parseInt(e,16)}function Sy(e){const t=new TextEncoder().encode(e);return"0x"+Array.from(t,n=>n.toString(16).padStart(2,"0")).join("")}function Ny(e){var t;const{chainId:r,domain:n,expirationTime:s,issuedAt:a=new Date,nonce:o,notBefore:l,requestId:c,resources:u,scheme:d,uri:h,version:p}=e;{if(!Number.isInteger(r))throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r}`);if(!n)throw new Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');if(o&&o.length<8)throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${o}`);if(!h)throw new Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');if(p!=="1")throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${p}`);if(!((t=e.statement)===null||t===void 0)&&t.includes(`
`))throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e.statement}`)}const v=jf(e.address),y=d?`${d}://${n}`:n,x=e.statement?`${e.statement}
`:"",N=`${y} wants you to sign in with your Ethereum account:
${v}

${x}`;let f=`URI: ${h}
Version: ${p}
Chain ID: ${r}${o?`
Nonce: ${o}`:""}
Issued At: ${a.toISOString()}`;if(s&&(f+=`
Expiration Time: ${s.toISOString()}`),l&&(f+=`
Not Before: ${l.toISOString()}`),c&&(f+=`
Request ID: ${c}`),u){let g=`
Resources:`;for(const m of u){if(!m||typeof m!="string")throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${m}`);g+=`
- ${m}`}f+=g}return`${N}
${f}`}class je extends Error{constructor({message:t,code:r,cause:n,name:s}){var a;super(t,{cause:n}),this.__isWebAuthnError=!0,this.name=(a=s??(n instanceof Error?n.name:void 0))!==null&&a!==void 0?a:"Unknown Error",this.code=r}}class di extends je{constructor(t,r){super({code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:r,message:t}),this.name="WebAuthnUnknownError",this.originalError=r}}function Ey({error:e,options:t}){var r,n,s;const{publicKey:a}=t;if(!a)throw Error("options was missing required publicKey property");if(e.name==="AbortError"){if(t.signal instanceof AbortSignal)return new je({message:"Registration ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:e})}else if(e.name==="ConstraintError"){if(((r=a.authenticatorSelection)===null||r===void 0?void 0:r.requireResidentKey)===!0)return new je({message:"Discoverable credentials were required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",cause:e});if(t.mediation==="conditional"&&((n=a.authenticatorSelection)===null||n===void 0?void 0:n.userVerification)==="required")return new je({message:"User verification was required during automatic registration but it could not be performed",code:"ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",cause:e});if(((s=a.authenticatorSelection)===null||s===void 0?void 0:s.userVerification)==="required")return new je({message:"User verification was required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",cause:e})}else{if(e.name==="InvalidStateError")return new je({message:"The authenticator was previously registered",code:"ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",cause:e});if(e.name==="NotAllowedError")return new je({message:e.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:e});if(e.name==="NotSupportedError")return a.pubKeyCredParams.filter(l=>l.type==="public-key").length===0?new je({message:'No entry in pubKeyCredParams was of type "public-key"',code:"ERROR_MALFORMED_PUBKEYCREDPARAMS",cause:e}):new je({message:"No available authenticator supported any of the specified pubKeyCredParams algorithms",code:"ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",cause:e});if(e.name==="SecurityError"){const o=window.location.hostname;if(Sf(o)){if(a.rp.id!==o)return new je({message:`The RP ID "${a.rp.id}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:e})}else return new je({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:e})}else if(e.name==="TypeError"){if(a.user.id.byteLength<1||a.user.id.byteLength>64)return new je({message:"User ID was not between 1 and 64 characters",code:"ERROR_INVALID_USER_ID_LENGTH",cause:e})}else if(e.name==="UnknownError")return new je({message:"The authenticator was unable to process the specified options, or could not create a new credential",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:e})}return new je({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:e})}function Ty({error:e,options:t}){const{publicKey:r}=t;if(!r)throw Error("options was missing required publicKey property");if(e.name==="AbortError"){if(t.signal instanceof AbortSignal)return new je({message:"Authentication ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:e})}else{if(e.name==="NotAllowedError")return new je({message:e.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:e});if(e.name==="SecurityError"){const n=window.location.hostname;if(Sf(n)){if(r.rpId!==n)return new je({message:`The RP ID "${r.rpId}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:e})}else return new je({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:e})}else if(e.name==="UnknownError")return new je({message:"The authenticator was unable to process the specified options, or could not create a new assertion signature",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:e})}return new je({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:e})}class Cy{createNewAbortSignal(){if(this.controller){const r=new Error("Cancelling existing WebAuthn API call for new one");r.name="AbortError",this.controller.abort(r)}const t=new AbortController;return this.controller=t,t.signal}cancelCeremony(){if(this.controller){const t=new Error("Manually cancelling existing WebAuthn API call");t.name="AbortError",this.controller.abort(t),this.controller=void 0}}}const Ay=new Cy;function Ry(e){if(!e)throw new Error("Credential creation options are required");if(typeof PublicKeyCredential<"u"&&"parseCreationOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseCreationOptionsFromJSON=="function")return PublicKeyCredential.parseCreationOptionsFromJSON(e);const{challenge:t,user:r,excludeCredentials:n}=e,s=Ai(e,["challenge","user","excludeCredentials"]),a=Rn(t).buffer,o=Object.assign(Object.assign({},r),{id:Rn(r.id).buffer}),l=Object.assign(Object.assign({},s),{challenge:a,user:o});if(n&&n.length>0){l.excludeCredentials=new Array(n.length);for(let c=0;c<n.length;c++){const u=n[c];l.excludeCredentials[c]=Object.assign(Object.assign({},u),{id:Rn(u.id).buffer,type:u.type||"public-key",transports:u.transports})}}return l}function Py(e){if(!e)throw new Error("Credential request options are required");if(typeof PublicKeyCredential<"u"&&"parseRequestOptionsFromJSON"in PublicKeyCredential&&typeof PublicKeyCredential.parseRequestOptionsFromJSON=="function")return PublicKeyCredential.parseRequestOptionsFromJSON(e);const{challenge:t,allowCredentials:r}=e,n=Ai(e,["challenge","allowCredentials"]),s=Rn(t).buffer,a=Object.assign(Object.assign({},n),{challenge:s});if(r&&r.length>0){a.allowCredentials=new Array(r.length);for(let o=0;o<r.length;o++){const l=r[o];a.allowCredentials[o]=Object.assign(Object.assign({},l),{id:Rn(l.id).buffer,type:l.type||"public-key",transports:l.transports})}}return a}function Oy(e){var t;if("toJSON"in e&&typeof e.toJSON=="function")return e.toJSON();const r=e;return{id:e.id,rawId:e.id,response:{attestationObject:Mr(new Uint8Array(e.response.attestationObject)),clientDataJSON:Mr(new Uint8Array(e.response.clientDataJSON))},type:"public-key",clientExtensionResults:e.getClientExtensionResults(),authenticatorAttachment:(t=r.authenticatorAttachment)!==null&&t!==void 0?t:void 0}}function Ly(e){var t;if("toJSON"in e&&typeof e.toJSON=="function")return e.toJSON();const r=e,n=e.getClientExtensionResults(),s=e.response;return{id:e.id,rawId:e.id,response:{authenticatorData:Mr(new Uint8Array(s.authenticatorData)),clientDataJSON:Mr(new Uint8Array(s.clientDataJSON)),signature:Mr(new Uint8Array(s.signature)),userHandle:s.userHandle?Mr(new Uint8Array(s.userHandle)):void 0},type:"public-key",clientExtensionResults:n,authenticatorAttachment:(t=r.authenticatorAttachment)!==null&&t!==void 0?t:void 0}}function Sf(e){return e==="localhost"||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e)}function Rd(){var e,t;return!!(Pe()&&"PublicKeyCredential"in window&&window.PublicKeyCredential&&"credentials"in navigator&&typeof((e=navigator==null?void 0:navigator.credentials)===null||e===void 0?void 0:e.create)=="function"&&typeof((t=navigator==null?void 0:navigator.credentials)===null||t===void 0?void 0:t.get)=="function")}async function $y(e){try{const t=await navigator.credentials.create(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new di("Browser returned unexpected credential type",t)}:{data:null,error:new di("Empty credential response",t)}}catch(t){return{data:null,error:Ey({error:t,options:e})}}}async function Iy(e){try{const t=await navigator.credentials.get(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new di("Browser returned unexpected credential type",t)}:{data:null,error:new di("Empty credential response",t)}}catch(t){return{data:null,error:Ty({error:t,options:e})}}}const Uy={hints:["security-key"],authenticatorSelection:{authenticatorAttachment:"cross-platform",requireResidentKey:!1,userVerification:"preferred",residentKey:"discouraged"},attestation:"direct"},zy={userVerification:"preferred",hints:["security-key"],attestation:"direct"};function hi(...e){const t=s=>s!==null&&typeof s=="object"&&!Array.isArray(s),r=s=>s instanceof ArrayBuffer||ArrayBuffer.isView(s),n={};for(const s of e)if(s)for(const a in s){const o=s[a];if(o!==void 0)if(Array.isArray(o))n[a]=o;else if(r(o))n[a]=o;else if(t(o)){const l=n[a];t(l)?n[a]=hi(l,o):n[a]=hi(o)}else n[a]=o}return n}function Dy(e,t){return hi(Uy,e,t||{})}function Fy(e,t){return hi(zy,e,t||{})}class My{constructor(t){this.client=t,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(t){return this.client.mfa.enroll(Object.assign(Object.assign({},t),{factorType:"webauthn"}))}async _challenge({factorId:t,webauthn:r,friendlyName:n,signal:s},a){var o;try{const{data:l,error:c}=await this.client.mfa.challenge({factorId:t,webauthn:r});if(!l)return{data:null,error:c};const u=s??Ay.createNewAbortSignal();if(l.webauthn.type==="create"){const{user:d}=l.webauthn.credential_options.publicKey;if(!d.name){const h=n;if(h)d.name=`${d.id}:${h}`;else{const v=(await this.client.getUser()).data.user,y=((o=v==null?void 0:v.user_metadata)===null||o===void 0?void 0:o.name)||(v==null?void 0:v.email)||(v==null?void 0:v.id)||"User";d.name=`${d.id}:${y}`}}d.displayName||(d.displayName=d.name)}switch(l.webauthn.type){case"create":{const d=Dy(l.webauthn.credential_options.publicKey,a==null?void 0:a.create),{data:h,error:p}=await $y({publicKey:d,signal:u});return h?{data:{factorId:t,challengeId:l.id,webauthn:{type:l.webauthn.type,credential_response:h}},error:null}:{data:null,error:p}}case"request":{const d=Fy(l.webauthn.credential_options.publicKey,a==null?void 0:a.request),{data:h,error:p}=await Iy(Object.assign(Object.assign({},l.webauthn.credential_options),{publicKey:d,signal:u}));return h?{data:{factorId:t,challengeId:l.id,webauthn:{type:l.webauthn.type,credential_response:h}},error:null}:{data:null,error:p}}}}catch(l){return F(l)?{data:null,error:l}:{data:null,error:new Ur("Unexpected error in challenge",l)}}}async _verify({challengeId:t,factorId:r,webauthn:n}){return this.client.mfa.verify({factorId:r,challengeId:t,webauthn:n})}async _authenticate({factorId:t,webauthn:{rpId:r=typeof window<"u"?window.location.hostname:void 0,rpOrigins:n=typeof window<"u"?[window.location.origin]:void 0,signal:s}={}},a){if(!r)return{data:null,error:new Fs("rpId is required for WebAuthn authentication")};try{if(!Rd())return{data:null,error:new Ur("Browser does not support WebAuthn",null)};const{data:o,error:l}=await this.challenge({factorId:t,webauthn:{rpId:r,rpOrigins:n},signal:s},{request:a});if(!o)return{data:null,error:l};const{webauthn:c}=o;return this._verify({factorId:t,challengeId:o.challengeId,webauthn:{type:c.type,rpId:r,rpOrigins:n,credential_response:c.credential_response}})}catch(o){return F(o)?{data:null,error:o}:{data:null,error:new Ur("Unexpected error in authenticate",o)}}}async _register({friendlyName:t,webauthn:{rpId:r=typeof window<"u"?window.location.hostname:void 0,rpOrigins:n=typeof window<"u"?[window.location.origin]:void 0,signal:s}={}},a){if(!r)return{data:null,error:new Fs("rpId is required for WebAuthn registration")};try{if(!Rd())return{data:null,error:new Ur("Browser does not support WebAuthn",null)};const{data:o,error:l}=await this._enroll({friendlyName:t});if(!o)return await this.client.mfa.listFactors().then(d=>{var h;return(h=d.data)===null||h===void 0?void 0:h.all.find(p=>p.factor_type==="webauthn"&&p.friendly_name===t&&p.status!=="unverified")}).then(d=>d?this.client.mfa.unenroll({factorId:d==null?void 0:d.id}):void 0),{data:null,error:l};const{data:c,error:u}=await this._challenge({factorId:o.id,friendlyName:o.friendly_name,webauthn:{rpId:r,rpOrigins:n},signal:s},{create:a});return c?this._verify({factorId:o.id,challengeId:c.challengeId,webauthn:{rpId:r,rpOrigins:n,type:c.webauthn.type,credential_response:c.webauthn.credential_response}}):{data:null,error:u}}catch(o){return F(o)?{data:null,error:o}:{data:null,error:new Ur("Unexpected error in register",o)}}}}_y();const By={url:D0,storageKey:F0,autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:M0,flowType:"implicit",debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1,lockAcquireTimeout:5e3,skipAutoInitialize:!1};async function Pd(e,t,r){return await r()}const sn={};class Ms{get jwks(){var t,r;return(r=(t=sn[this.storageKey])===null||t===void 0?void 0:t.jwks)!==null&&r!==void 0?r:{keys:[]}}set jwks(t){sn[this.storageKey]=Object.assign(Object.assign({},sn[this.storageKey]),{jwks:t})}get jwks_cached_at(){var t,r;return(r=(t=sn[this.storageKey])===null||t===void 0?void 0:t.cachedAt)!==null&&r!==void 0?r:Number.MIN_SAFE_INTEGER}set jwks_cached_at(t){sn[this.storageKey]=Object.assign(Object.assign({},sn[this.storageKey]),{cachedAt:t})}constructor(t){var r,n,s;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.autoRefreshTickTimeout=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.initializePromise=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log;const a=Object.assign(Object.assign({},By),t);if(this.storageKey=a.storageKey,this.instanceID=(r=Ms.nextInstanceID[this.storageKey])!==null&&r!==void 0?r:0,Ms.nextInstanceID[this.storageKey]=this.instanceID+1,this.logDebugMessages=!!a.debug,typeof a.debug=="function"&&(this.logger=a.debug),this.instanceID>0&&Pe()){const o=`${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;console.warn(o),this.logDebugMessages&&console.trace(o)}if(this.persistSession=a.persistSession,this.autoRefreshToken=a.autoRefreshToken,this.admin=new by({url:a.url,headers:a.headers,fetch:a.fetch}),this.url=a.url,this.headers=a.headers,this.fetch=wf(a.fetch),this.lock=a.lock||Pd,this.detectSessionInUrl=a.detectSessionInUrl,this.flowType=a.flowType,this.hasCustomAuthorizationHeader=a.hasCustomAuthorizationHeader,this.throwOnError=a.throwOnError,this.lockAcquireTimeout=a.lockAcquireTimeout,a.lock?this.lock=a.lock:this.persistSession&&Pe()&&(!((n=globalThis==null?void 0:globalThis.navigator)===null||n===void 0)&&n.locks)?this.lock=wy:this.lock=Pd,this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=Number.MIN_SAFE_INTEGER),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new My(this)},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this),listGrants:this._listOAuthGrants.bind(this),revokeGrant:this._revokeOAuthGrant.bind(this)},this.persistSession?(a.storage?this.storage=a.storage:bf()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=Cd(this.memoryStorage)),a.userStorage&&(this.userStorage=a.userStorage)):(this.memoryStorage={},this.storage=Cd(this.memoryStorage)),Pe()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(o){console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available",o)}(s=this.broadcastChannel)===null||s===void 0||s.addEventListener("message",async o=>{this._debug("received broadcast notification from other tab or client",o);try{await this._notifyAllSubscribers(o.data.event,o.data.session,!1)}catch(l){this._debug("#broadcastChannel","error",l)}})}a.skipAutoInitialize||this.initialize().catch(o=>{this._debug("#initialize()","error",o)})}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(t){if(this.throwOnError&&t&&t.error)throw t.error;return t}_logPrefix(){return`GoTrueClient@${this.storageKey}:${this.instanceID} (${yf}) ${new Date().toISOString()}`}_debug(...t){return this.logDebugMessages&&this.logger(this._logPrefix(),...t),this}async initialize(){return this.initializePromise?await this.initializePromise:(this.initializePromise=(async()=>await this._acquireLock(this.lockAcquireTimeout,async()=>await this._initialize()))(),await this.initializePromise)}async _initialize(){var t;try{let r={},n="none";if(Pe()&&(r=ty(window.location.href),this._isImplicitGrantCallback(r)?n="implicit":await this._isPKCECallback(r)&&(n="pkce")),Pe()&&this.detectSessionInUrl&&n!=="none"){const{data:s,error:a}=await this._getSessionFromURL(r,n);if(a){if(this._debug("#_initialize()","error detecting session from URL",a),q0(a)){const c=(t=a.details)===null||t===void 0?void 0:t.code;if(c==="identity_already_exists"||c==="identity_not_found"||c==="single_identity_not_deletable")return{error:a}}return{error:a}}const{session:o,redirectType:l}=s;return this._debug("#_initialize()","detected session in URL",o,"redirect type",l),await this._saveSession(o),setTimeout(async()=>{l==="recovery"?await this._notifyAllSubscribers("PASSWORD_RECOVERY",o):await this._notifyAllSubscribers("SIGNED_IN",o)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(r){return F(r)?this._returnResult({error:r}):this._returnResult({error:new Ur("Unexpected error during initialization",r)})}finally{await this._handleVisibilityChange(),this._debug("#_initialize()","end")}}async signInAnonymously(t){var r,n,s;try{const a=await W(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{data:(n=(r=t==null?void 0:t.options)===null||r===void 0?void 0:r.data)!==null&&n!==void 0?n:{},gotrue_meta_security:{captcha_token:(s=t==null?void 0:t.options)===null||s===void 0?void 0:s.captchaToken}},xform:jt}),{data:o,error:l}=a;if(l||!o)return this._returnResult({data:{user:null,session:null},error:l});const c=o.session,u=o.user;return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers("SIGNED_IN",c)),this._returnResult({data:{user:u,session:c},error:null})}catch(a){if(F(a))return this._returnResult({data:{user:null,session:null},error:a});throw a}}async signUp(t){var r,n,s;try{let a;if("email"in t){const{email:d,password:h,options:p}=t;let v=null,y=null;this.flowType==="pkce"&&([v,y]=await rn(this.storage,this.storageKey)),a=await W(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,redirectTo:p==null?void 0:p.emailRedirectTo,body:{email:d,password:h,data:(r=p==null?void 0:p.data)!==null&&r!==void 0?r:{},gotrue_meta_security:{captcha_token:p==null?void 0:p.captchaToken},code_challenge:v,code_challenge_method:y},xform:jt})}else if("phone"in t){const{phone:d,password:h,options:p}=t;a=await W(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{phone:d,password:h,data:(n=p==null?void 0:p.data)!==null&&n!==void 0?n:{},channel:(s=p==null?void 0:p.channel)!==null&&s!==void 0?s:"sms",gotrue_meta_security:{captcha_token:p==null?void 0:p.captchaToken}},xform:jt})}else throw new ya("You must provide either an email or phone number and a password");const{data:o,error:l}=a;if(l||!o)return await Re(this.storage,`${this.storageKey}-code-verifier`),this._returnResult({data:{user:null,session:null},error:l});const c=o.session,u=o.user;return o.session&&(await this._saveSession(o.session),await this._notifyAllSubscribers("SIGNED_IN",c)),this._returnResult({data:{user:u,session:c},error:null})}catch(a){if(await Re(this.storage,`${this.storageKey}-code-verifier`),F(a))return this._returnResult({data:{user:null,session:null},error:a});throw a}}async signInWithPassword(t){try{let r;if("email"in t){const{email:a,password:o,options:l}=t;r=await W(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:a,password:o,gotrue_meta_security:{captcha_token:l==null?void 0:l.captchaToken}},xform:Ed})}else if("phone"in t){const{phone:a,password:o,options:l}=t;r=await W(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:a,password:o,gotrue_meta_security:{captcha_token:l==null?void 0:l.captchaToken}},xform:Ed})}else throw new ya("You must provide either an email or phone number and a password");const{data:n,error:s}=r;if(s)return this._returnResult({data:{user:null,session:null},error:s});if(!n||!n.session||!n.user){const a=new tn;return this._returnResult({data:{user:null,session:null},error:a})}return n.session&&(await this._saveSession(n.session),await this._notifyAllSubscribers("SIGNED_IN",n.session)),this._returnResult({data:Object.assign({user:n.user,session:n.session},n.weak_password?{weakPassword:n.weak_password}:null),error:s})}catch(r){if(F(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithOAuth(t){var r,n,s,a;return await this._handleProviderSignIn(t.provider,{redirectTo:(r=t.options)===null||r===void 0?void 0:r.redirectTo,scopes:(n=t.options)===null||n===void 0?void 0:n.scopes,queryParams:(s=t.options)===null||s===void 0?void 0:s.queryParams,skipBrowserRedirect:(a=t.options)===null||a===void 0?void 0:a.skipBrowserRedirect})}async exchangeCodeForSession(t){return await this.initializePromise,this._acquireLock(this.lockAcquireTimeout,async()=>this._exchangeCodeForSession(t))}async signInWithWeb3(t){const{chain:r}=t;switch(r){case"ethereum":return await this.signInWithEthereum(t);case"solana":return await this.signInWithSolana(t);default:throw new Error(`@supabase/auth-js: Unsupported chain "${r}"`)}}async signInWithEthereum(t){var r,n,s,a,o,l,c,u,d,h,p;let v,y;if("message"in t)v=t.message,y=t.signature;else{const{chain:x,wallet:N,statement:f,options:g}=t;let m;if(Pe())if(typeof N=="object")m=N;else{const q=window;if("ethereum"in q&&typeof q.ethereum=="object"&&"request"in q.ethereum&&typeof q.ethereum.request=="function")m=q.ethereum;else throw new Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.")}else{if(typeof N!="object"||!(g!=null&&g.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");m=N}const k=new URL((r=g==null?void 0:g.url)!==null&&r!==void 0?r:window.location.href),j=await m.request({method:"eth_requestAccounts"}).then(q=>q).catch(()=>{throw new Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid")});if(!j||j.length===0)throw new Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");const C=jf(j[0]);let S=(n=g==null?void 0:g.signInWithEthereum)===null||n===void 0?void 0:n.chainId;if(!S){const q=await m.request({method:"eth_chainId"});S=jy(q)}const $={domain:k.host,address:C,statement:f,uri:k.href,version:"1",chainId:S,nonce:(s=g==null?void 0:g.signInWithEthereum)===null||s===void 0?void 0:s.nonce,issuedAt:(o=(a=g==null?void 0:g.signInWithEthereum)===null||a===void 0?void 0:a.issuedAt)!==null&&o!==void 0?o:new Date,expirationTime:(l=g==null?void 0:g.signInWithEthereum)===null||l===void 0?void 0:l.expirationTime,notBefore:(c=g==null?void 0:g.signInWithEthereum)===null||c===void 0?void 0:c.notBefore,requestId:(u=g==null?void 0:g.signInWithEthereum)===null||u===void 0?void 0:u.requestId,resources:(d=g==null?void 0:g.signInWithEthereum)===null||d===void 0?void 0:d.resources};v=Ny($),y=await m.request({method:"personal_sign",params:[Sy(v),C]})}try{const{data:x,error:N}=await W(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"ethereum",message:v,signature:y},!((h=t.options)===null||h===void 0)&&h.captchaToken?{gotrue_meta_security:{captcha_token:(p=t.options)===null||p===void 0?void 0:p.captchaToken}}:null),xform:jt});if(N)throw N;if(!x||!x.session||!x.user){const f=new tn;return this._returnResult({data:{user:null,session:null},error:f})}return x.session&&(await this._saveSession(x.session),await this._notifyAllSubscribers("SIGNED_IN",x.session)),this._returnResult({data:Object.assign({},x),error:N})}catch(x){if(F(x))return this._returnResult({data:{user:null,session:null},error:x});throw x}}async signInWithSolana(t){var r,n,s,a,o,l,c,u,d,h,p,v;let y,x;if("message"in t)y=t.message,x=t.signature;else{const{chain:N,wallet:f,statement:g,options:m}=t;let k;if(Pe())if(typeof f=="object")k=f;else{const C=window;if("solana"in C&&typeof C.solana=="object"&&("signIn"in C.solana&&typeof C.solana.signIn=="function"||"signMessage"in C.solana&&typeof C.solana.signMessage=="function"))k=C.solana;else throw new Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.")}else{if(typeof f!="object"||!(m!=null&&m.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");k=f}const j=new URL((r=m==null?void 0:m.url)!==null&&r!==void 0?r:window.location.href);if("signIn"in k&&k.signIn){const C=await k.signIn(Object.assign(Object.assign(Object.assign({issuedAt:new Date().toISOString()},m==null?void 0:m.signInWithSolana),{version:"1",domain:j.host,uri:j.href}),g?{statement:g}:null));let S;if(Array.isArray(C)&&C[0]&&typeof C[0]=="object")S=C[0];else if(C&&typeof C=="object"&&"signedMessage"in C&&"signature"in C)S=C;else throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");if("signedMessage"in S&&"signature"in S&&(typeof S.signedMessage=="string"||S.signedMessage instanceof Uint8Array)&&S.signature instanceof Uint8Array)y=typeof S.signedMessage=="string"?S.signedMessage:new TextDecoder().decode(S.signedMessage),x=S.signature;else throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields")}else{if(!("signMessage"in k)||typeof k.signMessage!="function"||!("publicKey"in k)||typeof k!="object"||!k.publicKey||!("toBase58"in k.publicKey)||typeof k.publicKey.toBase58!="function")throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");y=[`${j.host} wants you to sign in with your Solana account:`,k.publicKey.toBase58(),...g?["",g,""]:[""],"Version: 1",`URI: ${j.href}`,`Issued At: ${(s=(n=m==null?void 0:m.signInWithSolana)===null||n===void 0?void 0:n.issuedAt)!==null&&s!==void 0?s:new Date().toISOString()}`,...!((a=m==null?void 0:m.signInWithSolana)===null||a===void 0)&&a.notBefore?[`Not Before: ${m.signInWithSolana.notBefore}`]:[],...!((o=m==null?void 0:m.signInWithSolana)===null||o===void 0)&&o.expirationTime?[`Expiration Time: ${m.signInWithSolana.expirationTime}`]:[],...!((l=m==null?void 0:m.signInWithSolana)===null||l===void 0)&&l.chainId?[`Chain ID: ${m.signInWithSolana.chainId}`]:[],...!((c=m==null?void 0:m.signInWithSolana)===null||c===void 0)&&c.nonce?[`Nonce: ${m.signInWithSolana.nonce}`]:[],...!((u=m==null?void 0:m.signInWithSolana)===null||u===void 0)&&u.requestId?[`Request ID: ${m.signInWithSolana.requestId}`]:[],...!((h=(d=m==null?void 0:m.signInWithSolana)===null||d===void 0?void 0:d.resources)===null||h===void 0)&&h.length?["Resources",...m.signInWithSolana.resources.map(S=>`- ${S}`)]:[]].join(`
`);const C=await k.signMessage(new TextEncoder().encode(y),"utf8");if(!C||!(C instanceof Uint8Array))throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");x=C}}try{const{data:N,error:f}=await W(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"solana",message:y,signature:Mr(x)},!((p=t.options)===null||p===void 0)&&p.captchaToken?{gotrue_meta_security:{captcha_token:(v=t.options)===null||v===void 0?void 0:v.captchaToken}}:null),xform:jt});if(f)throw f;if(!N||!N.session||!N.user){const g=new tn;return this._returnResult({data:{user:null,session:null},error:g})}return N.session&&(await this._saveSession(N.session),await this._notifyAllSubscribers("SIGNED_IN",N.session)),this._returnResult({data:Object.assign({},N),error:f})}catch(N){if(F(N))return this._returnResult({data:{user:null,session:null},error:N});throw N}}async _exchangeCodeForSession(t){const r=await Or(this.storage,`${this.storageKey}-code-verifier`),[n,s]=(r??"").split("/");try{if(!n&&this.flowType==="pkce")throw new K0;const{data:a,error:o}=await W(this.fetch,"POST",`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:t,code_verifier:n},xform:jt});if(await Re(this.storage,`${this.storageKey}-code-verifier`),o)throw o;if(!a||!a.session||!a.user){const l=new tn;return this._returnResult({data:{user:null,session:null,redirectType:null},error:l})}return a.session&&(await this._saveSession(a.session),await this._notifyAllSubscribers(s==="recovery"?"PASSWORD_RECOVERY":"SIGNED_IN",a.session)),this._returnResult({data:Object.assign(Object.assign({},a),{redirectType:s??null}),error:o})}catch(a){if(await Re(this.storage,`${this.storageKey}-code-verifier`),F(a))return this._returnResult({data:{user:null,session:null,redirectType:null},error:a});throw a}}async signInWithIdToken(t){try{const{options:r,provider:n,token:s,access_token:a,nonce:o}=t,l=await W(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:n,id_token:s,access_token:a,nonce:o,gotrue_meta_security:{captcha_token:r==null?void 0:r.captchaToken}},xform:jt}),{data:c,error:u}=l;if(u)return this._returnResult({data:{user:null,session:null},error:u});if(!c||!c.session||!c.user){const d=new tn;return this._returnResult({data:{user:null,session:null},error:d})}return c.session&&(await this._saveSession(c.session),await this._notifyAllSubscribers("SIGNED_IN",c.session)),this._returnResult({data:c,error:u})}catch(r){if(F(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async signInWithOtp(t){var r,n,s,a,o;try{if("email"in t){const{email:l,options:c}=t;let u=null,d=null;this.flowType==="pkce"&&([u,d]=await rn(this.storage,this.storageKey));const{error:h}=await W(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{email:l,data:(r=c==null?void 0:c.data)!==null&&r!==void 0?r:{},create_user:(n=c==null?void 0:c.shouldCreateUser)!==null&&n!==void 0?n:!0,gotrue_meta_security:{captcha_token:c==null?void 0:c.captchaToken},code_challenge:u,code_challenge_method:d},redirectTo:c==null?void 0:c.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:h})}if("phone"in t){const{phone:l,options:c}=t,{data:u,error:d}=await W(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{phone:l,data:(s=c==null?void 0:c.data)!==null&&s!==void 0?s:{},create_user:(a=c==null?void 0:c.shouldCreateUser)!==null&&a!==void 0?a:!0,gotrue_meta_security:{captcha_token:c==null?void 0:c.captchaToken},channel:(o=c==null?void 0:c.channel)!==null&&o!==void 0?o:"sms"}});return this._returnResult({data:{user:null,session:null,messageId:u==null?void 0:u.message_id},error:d})}throw new ya("You must provide either an email or phone number.")}catch(l){if(await Re(this.storage,`${this.storageKey}-code-verifier`),F(l))return this._returnResult({data:{user:null,session:null},error:l});throw l}}async verifyOtp(t){var r,n;try{let s,a;"options"in t&&(s=(r=t.options)===null||r===void 0?void 0:r.redirectTo,a=(n=t.options)===null||n===void 0?void 0:n.captchaToken);const{data:o,error:l}=await W(this.fetch,"POST",`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},t),{gotrue_meta_security:{captcha_token:a}}),redirectTo:s,xform:jt});if(l)throw l;if(!o)throw new Error("An error occurred on token verification.");const c=o.session,u=o.user;return c!=null&&c.access_token&&(await this._saveSession(c),await this._notifyAllSubscribers(t.type=="recovery"?"PASSWORD_RECOVERY":"SIGNED_IN",c)),this._returnResult({data:{user:u,session:c},error:null})}catch(s){if(F(s))return this._returnResult({data:{user:null,session:null},error:s});throw s}}async signInWithSSO(t){var r,n,s,a,o;try{let l=null,c=null;this.flowType==="pkce"&&([l,c]=await rn(this.storage,this.storageKey));const u=await W(this.fetch,"POST",`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},"providerId"in t?{provider_id:t.providerId}:null),"domain"in t?{domain:t.domain}:null),{redirect_to:(n=(r=t.options)===null||r===void 0?void 0:r.redirectTo)!==null&&n!==void 0?n:void 0}),!((s=t==null?void 0:t.options)===null||s===void 0)&&s.captchaToken?{gotrue_meta_security:{captcha_token:t.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:l,code_challenge_method:c}),headers:this.headers,xform:yy});return!((a=u.data)===null||a===void 0)&&a.url&&Pe()&&!(!((o=t.options)===null||o===void 0)&&o.skipBrowserRedirect)&&window.location.assign(u.data.url),this._returnResult(u)}catch(l){if(await Re(this.storage,`${this.storageKey}-code-verifier`),F(l))return this._returnResult({data:null,error:l});throw l}}async reauthenticate(){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async t=>{const{data:{session:r},error:n}=t;if(n)throw n;if(!r)throw new rt;const{error:s}=await W(this.fetch,"GET",`${this.url}/reauthenticate`,{headers:this.headers,jwt:r.access_token});return this._returnResult({data:{user:null,session:null},error:s})})}catch(t){if(F(t))return this._returnResult({data:{user:null,session:null},error:t});throw t}}async resend(t){try{const r=`${this.url}/resend`;if("email"in t){const{email:n,type:s,options:a}=t,{error:o}=await W(this.fetch,"POST",r,{headers:this.headers,body:{email:n,type:s,gotrue_meta_security:{captcha_token:a==null?void 0:a.captchaToken}},redirectTo:a==null?void 0:a.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:o})}else if("phone"in t){const{phone:n,type:s,options:a}=t,{data:o,error:l}=await W(this.fetch,"POST",r,{headers:this.headers,body:{phone:n,type:s,gotrue_meta_security:{captcha_token:a==null?void 0:a.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:o==null?void 0:o.message_id},error:l})}throw new ya("You must provide either an email or phone number and a type")}catch(r){if(F(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async getSession(){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>this._useSession(async r=>r))}async _acquireLock(t,r){this._debug("#_acquireLock","begin",t);try{if(this.lockAcquired){const n=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),s=(async()=>(await n,await r()))();return this.pendingInLock.push((async()=>{try{await s}catch{}})()),s}return await this.lock(`lock:${this.storageKey}`,t,async()=>{this._debug("#_acquireLock","lock acquired for storage key",this.storageKey);try{this.lockAcquired=!0;const n=r();for(this.pendingInLock.push((async()=>{try{await n}catch{}})()),await n;this.pendingInLock.length;){const s=[...this.pendingInLock];await Promise.all(s),this.pendingInLock.splice(0,s.length)}return await n}finally{this._debug("#_acquireLock","lock released for storage key",this.storageKey),this.lockAcquired=!1}})}finally{this._debug("#_acquireLock","end")}}async _useSession(t){this._debug("#_useSession","begin");try{const r=await this.__loadSession();return await t(r)}finally{this._debug("#_useSession","end")}}async __loadSession(){this._debug("#__loadSession()","begin"),this.lockAcquired||this._debug("#__loadSession()","used outside of an acquired lock!",new Error().stack);try{let t=null;const r=await Or(this.storage,this.storageKey);if(this._debug("#getSession()","session from storage",r),r!==null&&(this._isValidSession(r)?t=r:(this._debug("#getSession()","session from storage is not valid"),await this._removeSession())),!t)return{data:{session:null},error:null};const n=t.expires_at?t.expires_at*1e3-Date.now()<lo:!1;if(this._debug("#__loadSession()",`session has${n?"":" not"} expired`,"expires_at",t.expires_at),!n){if(this.userStorage){const o=await Or(this.userStorage,this.storageKey+"-user");o!=null&&o.user?t.user=o.user:t.user=uo()}if(this.storage.isServer&&t.user&&!t.user.__isUserNotAvailableProxy){const o={value:this.suppressGetSessionWarning};t.user=fy(t.user,o),o.value&&(this.suppressGetSessionWarning=!0)}return{data:{session:t},error:null}}const{data:s,error:a}=await this._callRefreshToken(t.refresh_token);return a?this._returnResult({data:{session:null},error:a}):this._returnResult({data:{session:s},error:null})}finally{this._debug("#__loadSession()","end")}}async getUser(t){if(t)return await this._getUser(t);await this.initializePromise;const r=await this._acquireLock(this.lockAcquireTimeout,async()=>await this._getUser());return r.data.user&&(this.suppressGetSessionWarning=!0),r}async _getUser(t){try{return t?await W(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:t,xform:mr}):await this._useSession(async r=>{var n,s,a;const{data:o,error:l}=r;if(l)throw l;return!(!((n=o.session)===null||n===void 0)&&n.access_token)&&!this.hasCustomAuthorizationHeader?{data:{user:null},error:new rt}:await W(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:(a=(s=o.session)===null||s===void 0?void 0:s.access_token)!==null&&a!==void 0?a:void 0,xform:mr})})}catch(r){if(F(r))return va(r)&&(await this._removeSession(),await Re(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({data:{user:null},error:r});throw r}}async updateUser(t,r={}){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>await this._updateUser(t,r))}async _updateUser(t,r={}){try{return await this._useSession(async n=>{const{data:s,error:a}=n;if(a)throw a;if(!s.session)throw new rt;const o=s.session;let l=null,c=null;this.flowType==="pkce"&&t.email!=null&&([l,c]=await rn(this.storage,this.storageKey));const{data:u,error:d}=await W(this.fetch,"PUT",`${this.url}/user`,{headers:this.headers,redirectTo:r==null?void 0:r.emailRedirectTo,body:Object.assign(Object.assign({},t),{code_challenge:l,code_challenge_method:c}),jwt:o.access_token,xform:mr});if(d)throw d;return o.user=u.user,await this._saveSession(o),await this._notifyAllSubscribers("USER_UPDATED",o),this._returnResult({data:{user:o.user},error:null})})}catch(n){if(await Re(this.storage,`${this.storageKey}-code-verifier`),F(n))return this._returnResult({data:{user:null},error:n});throw n}}async setSession(t){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>await this._setSession(t))}async _setSession(t){try{if(!t.access_token||!t.refresh_token)throw new rt;const r=Date.now()/1e3;let n=r,s=!0,a=null;const{payload:o}=ka(t.access_token);if(o.exp&&(n=o.exp,s=n<=r),s){const{data:l,error:c}=await this._callRefreshToken(t.refresh_token);if(c)return this._returnResult({data:{user:null,session:null},error:c});if(!l)return{data:{user:null,session:null},error:null};a=l}else{const{data:l,error:c}=await this._getUser(t.access_token);if(c)return this._returnResult({data:{user:null,session:null},error:c});a={access_token:t.access_token,refresh_token:t.refresh_token,user:l.user,token_type:"bearer",expires_in:n-r,expires_at:n},await this._saveSession(a),await this._notifyAllSubscribers("SIGNED_IN",a)}return this._returnResult({data:{user:a.user,session:a},error:null})}catch(r){if(F(r))return this._returnResult({data:{session:null,user:null},error:r});throw r}}async refreshSession(t){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>await this._refreshSession(t))}async _refreshSession(t){try{return await this._useSession(async r=>{var n;if(!t){const{data:o,error:l}=r;if(l)throw l;t=(n=o.session)!==null&&n!==void 0?n:void 0}if(!(t!=null&&t.refresh_token))throw new rt;const{data:s,error:a}=await this._callRefreshToken(t.refresh_token);return a?this._returnResult({data:{user:null,session:null},error:a}):s?this._returnResult({data:{user:s.user,session:s},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(r){if(F(r))return this._returnResult({data:{user:null,session:null},error:r});throw r}}async _getSessionFromURL(t,r){var n;try{if(!Pe())throw new xa("No browser detected.");if(t.error||t.error_description||t.error_code)throw new xa(t.error_description||"Error in URL with unspecified error_description",{error:t.error||"unspecified_error",code:t.error_code||"unspecified_code"});switch(r){case"implicit":if(this.flowType==="pkce")throw new kd("Not a valid PKCE flow url.");break;case"pkce":if(this.flowType==="implicit")throw new xa("Not a valid implicit grant flow url.");break;default:}if(r==="pkce"){if(this._debug("#_initialize()","begin","is PKCE flow",!0),!t.code)throw new kd("No code detected.");const{data:m,error:k}=await this._exchangeCodeForSession(t.code);if(k)throw k;const j=new URL(window.location.href);return j.searchParams.delete("code"),window.history.replaceState(window.history.state,"",j.toString()),{data:{session:m.session,redirectType:(n=m.redirectType)!==null&&n!==void 0?n:null},error:null}}const{provider_token:s,provider_refresh_token:a,access_token:o,refresh_token:l,expires_in:c,expires_at:u,token_type:d}=t;if(!o||!c||!l||!d)throw new xa("No session defined in URL");const h=Math.round(Date.now()/1e3),p=parseInt(c);let v=h+p;u&&(v=parseInt(u));const y=v-h;y*1e3<=cn&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${y}s, should have been closer to ${p}s`);const x=v-p;h-x>=120?console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale",x,v,h):h-x<0&&console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew",x,v,h);const{data:N,error:f}=await this._getUser(o);if(f)throw f;const g={provider_token:s,provider_refresh_token:a,access_token:o,expires_in:p,expires_at:v,refresh_token:l,token_type:d,user:N.user};return window.location.hash="",this._debug("#_getSessionFromURL()","clearing window.location.hash"),this._returnResult({data:{session:g,redirectType:t.type},error:null})}catch(s){if(F(s))return this._returnResult({data:{session:null,redirectType:null},error:s});throw s}}_isImplicitGrantCallback(t){return typeof this.detectSessionInUrl=="function"?this.detectSessionInUrl(new URL(window.location.href),t):!!(t.access_token||t.error_description)}async _isPKCECallback(t){const r=await Or(this.storage,`${this.storageKey}-code-verifier`);return!!(t.code&&r)}async signOut(t={scope:"global"}){return await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>await this._signOut(t))}async _signOut({scope:t}={scope:"global"}){return await this._useSession(async r=>{var n;const{data:s,error:a}=r;if(a&&!va(a))return this._returnResult({error:a});const o=(n=s.session)===null||n===void 0?void 0:n.access_token;if(o){const{error:l}=await this.admin.signOut(o,t);if(l&&!(V0(l)&&(l.status===404||l.status===401||l.status===403)||va(l)))return this._returnResult({error:l})}return t!=="others"&&(await this._removeSession(),await Re(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({error:null})})}onAuthStateChange(t){const r=ey(),n={id:r,callback:t,unsubscribe:()=>{this._debug("#unsubscribe()","state change callback with id removed",r),this.stateChangeEmitters.delete(r)}};return this._debug("#onAuthStateChange()","registered callback with id",r),this.stateChangeEmitters.set(r,n),(async()=>(await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>{this._emitInitialSession(r)})))(),{data:{subscription:n}}}async _emitInitialSession(t){return await this._useSession(async r=>{var n,s;try{const{data:{session:a},error:o}=r;if(o)throw o;await((n=this.stateChangeEmitters.get(t))===null||n===void 0?void 0:n.callback("INITIAL_SESSION",a)),this._debug("INITIAL_SESSION","callback id",t,"session",a)}catch(a){await((s=this.stateChangeEmitters.get(t))===null||s===void 0?void 0:s.callback("INITIAL_SESSION",null)),this._debug("INITIAL_SESSION","callback id",t,"error",a),va(a)?console.warn(a):console.error(a)}})}async resetPasswordForEmail(t,r={}){let n=null,s=null;this.flowType==="pkce"&&([n,s]=await rn(this.storage,this.storageKey,!0));try{return await W(this.fetch,"POST",`${this.url}/recover`,{body:{email:t,code_challenge:n,code_challenge_method:s,gotrue_meta_security:{captcha_token:r.captchaToken}},headers:this.headers,redirectTo:r.redirectTo})}catch(a){if(await Re(this.storage,`${this.storageKey}-code-verifier`),F(a))return this._returnResult({data:null,error:a});throw a}}async getUserIdentities(){var t;try{const{data:r,error:n}=await this.getUser();if(n)throw n;return this._returnResult({data:{identities:(t=r.user.identities)!==null&&t!==void 0?t:[]},error:null})}catch(r){if(F(r))return this._returnResult({data:null,error:r});throw r}}async linkIdentity(t){return"token"in t?this.linkIdentityIdToken(t):this.linkIdentityOAuth(t)}async linkIdentityOAuth(t){var r;try{const{data:n,error:s}=await this._useSession(async a=>{var o,l,c,u,d;const{data:h,error:p}=a;if(p)throw p;const v=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,t.provider,{redirectTo:(o=t.options)===null||o===void 0?void 0:o.redirectTo,scopes:(l=t.options)===null||l===void 0?void 0:l.scopes,queryParams:(c=t.options)===null||c===void 0?void 0:c.queryParams,skipBrowserRedirect:!0});return await W(this.fetch,"GET",v,{headers:this.headers,jwt:(d=(u=h.session)===null||u===void 0?void 0:u.access_token)!==null&&d!==void 0?d:void 0})});if(s)throw s;return Pe()&&!(!((r=t.options)===null||r===void 0)&&r.skipBrowserRedirect)&&window.location.assign(n==null?void 0:n.url),this._returnResult({data:{provider:t.provider,url:n==null?void 0:n.url},error:null})}catch(n){if(F(n))return this._returnResult({data:{provider:t.provider,url:null},error:n});throw n}}async linkIdentityIdToken(t){return await this._useSession(async r=>{var n;try{const{error:s,data:{session:a}}=r;if(s)throw s;const{options:o,provider:l,token:c,access_token:u,nonce:d}=t,h=await W(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:(n=a==null?void 0:a.access_token)!==null&&n!==void 0?n:void 0,body:{provider:l,id_token:c,access_token:u,nonce:d,link_identity:!0,gotrue_meta_security:{captcha_token:o==null?void 0:o.captchaToken}},xform:jt}),{data:p,error:v}=h;return v?this._returnResult({data:{user:null,session:null},error:v}):!p||!p.session||!p.user?this._returnResult({data:{user:null,session:null},error:new tn}):(p.session&&(await this._saveSession(p.session),await this._notifyAllSubscribers("USER_UPDATED",p.session)),this._returnResult({data:p,error:v}))}catch(s){if(await Re(this.storage,`${this.storageKey}-code-verifier`),F(s))return this._returnResult({data:{user:null,session:null},error:s});throw s}})}async unlinkIdentity(t){try{return await this._useSession(async r=>{var n,s;const{data:a,error:o}=r;if(o)throw o;return await W(this.fetch,"DELETE",`${this.url}/user/identities/${t.identity_id}`,{headers:this.headers,jwt:(s=(n=a.session)===null||n===void 0?void 0:n.access_token)!==null&&s!==void 0?s:void 0})})}catch(r){if(F(r))return this._returnResult({data:null,error:r});throw r}}async _refreshAccessToken(t){const r=`#_refreshAccessToken(${t.substring(0,5)}...)`;this._debug(r,"begin");try{const n=Date.now();return await sy(async s=>(s>0&&await ny(200*Math.pow(2,s-1)),this._debug(r,"refreshing attempt",s),await W(this.fetch,"POST",`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:t},headers:this.headers,xform:jt})),(s,a)=>{const o=200*Math.pow(2,s);return a&&co(a)&&Date.now()+o-n<cn})}catch(n){if(this._debug(r,"error",n),F(n))return this._returnResult({data:{session:null,user:null},error:n});throw n}finally{this._debug(r,"end")}}_isValidSession(t){return typeof t=="object"&&t!==null&&"access_token"in t&&"refresh_token"in t&&"expires_at"in t}async _handleProviderSignIn(t,r){const n=await this._getUrlForProvider(`${this.url}/authorize`,t,{redirectTo:r.redirectTo,scopes:r.scopes,queryParams:r.queryParams});return this._debug("#_handleProviderSignIn()","provider",t,"options",r,"url",n),Pe()&&!r.skipBrowserRedirect&&window.location.assign(n),{data:{provider:t,url:n},error:null}}async _recoverAndRefresh(){var t,r;const n="#_recoverAndRefresh()";this._debug(n,"begin");try{const s=await Or(this.storage,this.storageKey);if(s&&this.userStorage){let o=await Or(this.userStorage,this.storageKey+"-user");!this.storage.isServer&&Object.is(this.storage,this.userStorage)&&!o&&(o={user:s.user},await un(this.userStorage,this.storageKey+"-user",o)),s.user=(t=o==null?void 0:o.user)!==null&&t!==void 0?t:uo()}else if(s&&!s.user&&!s.user){const o=await Or(this.storage,this.storageKey+"-user");o&&(o!=null&&o.user)?(s.user=o.user,await Re(this.storage,this.storageKey+"-user"),await un(this.storage,this.storageKey,s)):s.user=uo()}if(this._debug(n,"session from storage",s),!this._isValidSession(s)){this._debug(n,"session is not valid"),s!==null&&await this._removeSession();return}const a=((r=s.expires_at)!==null&&r!==void 0?r:1/0)*1e3-Date.now()<lo;if(this._debug(n,`session has${a?"":" not"} expired with margin of ${lo}s`),a){if(this.autoRefreshToken&&s.refresh_token){const{error:o}=await this._callRefreshToken(s.refresh_token);o&&(console.error(o),co(o)||(this._debug(n,"refresh failed with a non-retryable error, removing the session",o),await this._removeSession()))}}else if(s.user&&s.user.__isUserNotAvailableProxy===!0)try{const{data:o,error:l}=await this._getUser(s.access_token);!l&&(o!=null&&o.user)?(s.user=o.user,await this._saveSession(s),await this._notifyAllSubscribers("SIGNED_IN",s)):this._debug(n,"could not get user data, skipping SIGNED_IN notification")}catch(o){console.error("Error getting user data:",o),this._debug(n,"error getting user data, skipping SIGNED_IN notification",o)}else await this._notifyAllSubscribers("SIGNED_IN",s)}catch(s){this._debug(n,"error",s),console.error(s);return}finally{this._debug(n,"end")}}async _callRefreshToken(t){var r,n;if(!t)throw new rt;if(this.refreshingDeferred)return this.refreshingDeferred.promise;const s=`#_callRefreshToken(${t.substring(0,5)}...)`;this._debug(s,"begin");try{this.refreshingDeferred=new Oi;const{data:a,error:o}=await this._refreshAccessToken(t);if(o)throw o;if(!a.session)throw new rt;await this._saveSession(a.session),await this._notifyAllSubscribers("TOKEN_REFRESHED",a.session);const l={data:a.session,error:null};return this.refreshingDeferred.resolve(l),l}catch(a){if(this._debug(s,"error",a),F(a)){const o={data:null,error:a};return co(a)||await this._removeSession(),(r=this.refreshingDeferred)===null||r===void 0||r.resolve(o),o}throw(n=this.refreshingDeferred)===null||n===void 0||n.reject(a),a}finally{this.refreshingDeferred=null,this._debug(s,"end")}}async _notifyAllSubscribers(t,r,n=!0){const s=`#_notifyAllSubscribers(${t})`;this._debug(s,"begin",r,`broadcast = ${n}`);try{this.broadcastChannel&&n&&this.broadcastChannel.postMessage({event:t,session:r});const a=[],o=Array.from(this.stateChangeEmitters.values()).map(async l=>{try{await l.callback(t,r)}catch(c){a.push(c)}});if(await Promise.all(o),a.length>0){for(let l=0;l<a.length;l+=1)console.error(a[l]);throw a[0]}}finally{this._debug(s,"end")}}async _saveSession(t){this._debug("#_saveSession()",t),this.suppressGetSessionWarning=!0,await Re(this.storage,`${this.storageKey}-code-verifier`);const r=Object.assign({},t),n=r.user&&r.user.__isUserNotAvailableProxy===!0;if(this.userStorage){!n&&r.user&&await un(this.userStorage,this.storageKey+"-user",{user:r.user});const s=Object.assign({},r);delete s.user;const a=Sd(s);await un(this.storage,this.storageKey,a)}else{const s=Sd(r);await un(this.storage,this.storageKey,s)}}async _removeSession(){this._debug("#_removeSession()"),this.suppressGetSessionWarning=!1,await Re(this.storage,this.storageKey),await Re(this.storage,this.storageKey+"-code-verifier"),await Re(this.storage,this.storageKey+"-user"),this.userStorage&&await Re(this.userStorage,this.storageKey+"-user"),await this._notifyAllSubscribers("SIGNED_OUT",null)}_removeVisibilityChangedCallback(){this._debug("#_removeVisibilityChangedCallback()");const t=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{t&&Pe()&&(window!=null&&window.removeEventListener)&&window.removeEventListener("visibilitychange",t)}catch(r){console.error("removing visibilitychange callback failed",r)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug("#_startAutoRefresh()");const t=setInterval(()=>this._autoRefreshTokenTick(),cn);this.autoRefreshTicker=t,t&&typeof t=="object"&&typeof t.unref=="function"?t.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(t);const r=setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0);this.autoRefreshTickTimeout=r,r&&typeof r=="object"&&typeof r.unref=="function"?r.unref():typeof Deno<"u"&&typeof Deno.unrefTimer=="function"&&Deno.unrefTimer(r)}async _stopAutoRefresh(){this._debug("#_stopAutoRefresh()");const t=this.autoRefreshTicker;this.autoRefreshTicker=null,t&&clearInterval(t);const r=this.autoRefreshTickTimeout;this.autoRefreshTickTimeout=null,r&&clearTimeout(r)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async _autoRefreshTokenTick(){this._debug("#_autoRefreshTokenTick()","begin");try{await this._acquireLock(0,async()=>{try{const t=Date.now();try{return await this._useSession(async r=>{const{data:{session:n}}=r;if(!n||!n.refresh_token||!n.expires_at){this._debug("#_autoRefreshTokenTick()","no session");return}const s=Math.floor((n.expires_at*1e3-t)/cn);this._debug("#_autoRefreshTokenTick()",`access token expires in ${s} ticks, a tick lasts ${cn}ms, refresh threshold is ${kl} ticks`),s<=kl&&await this._callRefreshToken(n.refresh_token)})}catch(r){console.error("Auto refresh tick failed with error. This is likely a transient error.",r)}}finally{this._debug("#_autoRefreshTokenTick()","end")}})}catch(t){if(t.isAcquireTimeout||t instanceof _f)this._debug("auto refresh token tick lock not available");else throw t}}async _handleVisibilityChange(){if(this._debug("#_handleVisibilityChange()"),!Pe()||!(window!=null&&window.addEventListener))return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>{try{await this._onVisibilityChanged(!1)}catch(t){this._debug("#visibilityChangedCallback","error",t)}},window==null||window.addEventListener("visibilitychange",this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(t){console.error("_handleVisibilityChange",t)}}async _onVisibilityChanged(t){const r=`#_onVisibilityChanged(${t})`;this._debug(r,"visibilityState",document.visibilityState),document.visibilityState==="visible"?(this.autoRefreshToken&&this._startAutoRefresh(),t||(await this.initializePromise,await this._acquireLock(this.lockAcquireTimeout,async()=>{if(document.visibilityState!=="visible"){this._debug(r,"acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");return}await this._recoverAndRefresh()}))):document.visibilityState==="hidden"&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(t,r,n){const s=[`provider=${encodeURIComponent(r)}`];if(n!=null&&n.redirectTo&&s.push(`redirect_to=${encodeURIComponent(n.redirectTo)}`),n!=null&&n.scopes&&s.push(`scopes=${encodeURIComponent(n.scopes)}`),this.flowType==="pkce"){const[a,o]=await rn(this.storage,this.storageKey),l=new URLSearchParams({code_challenge:`${encodeURIComponent(a)}`,code_challenge_method:`${encodeURIComponent(o)}`});s.push(l.toString())}if(n!=null&&n.queryParams){const a=new URLSearchParams(n.queryParams);s.push(a.toString())}return n!=null&&n.skipBrowserRedirect&&s.push(`skip_http_redirect=${n.skipBrowserRedirect}`),`${t}?${s.join("&")}`}async _unenroll(t){try{return await this._useSession(async r=>{var n;const{data:s,error:a}=r;return a?this._returnResult({data:null,error:a}):await W(this.fetch,"DELETE",`${this.url}/factors/${t.factorId}`,{headers:this.headers,jwt:(n=s==null?void 0:s.session)===null||n===void 0?void 0:n.access_token})})}catch(r){if(F(r))return this._returnResult({data:null,error:r});throw r}}async _enroll(t){try{return await this._useSession(async r=>{var n,s;const{data:a,error:o}=r;if(o)return this._returnResult({data:null,error:o});const l=Object.assign({friendly_name:t.friendlyName,factor_type:t.factorType},t.factorType==="phone"?{phone:t.phone}:t.factorType==="totp"?{issuer:t.issuer}:{}),{data:c,error:u}=await W(this.fetch,"POST",`${this.url}/factors`,{body:l,headers:this.headers,jwt:(n=a==null?void 0:a.session)===null||n===void 0?void 0:n.access_token});return u?this._returnResult({data:null,error:u}):(t.factorType==="totp"&&c.type==="totp"&&(!((s=c==null?void 0:c.totp)===null||s===void 0)&&s.qr_code)&&(c.totp.qr_code=`data:image/svg+xml;utf-8,${c.totp.qr_code}`),this._returnResult({data:c,error:null}))})}catch(r){if(F(r))return this._returnResult({data:null,error:r});throw r}}async _verify(t){return this._acquireLock(this.lockAcquireTimeout,async()=>{try{return await this._useSession(async r=>{var n;const{data:s,error:a}=r;if(a)return this._returnResult({data:null,error:a});const o=Object.assign({challenge_id:t.challengeId},"webauthn"in t?{webauthn:Object.assign(Object.assign({},t.webauthn),{credential_response:t.webauthn.type==="create"?Oy(t.webauthn.credential_response):Ly(t.webauthn.credential_response)})}:{code:t.code}),{data:l,error:c}=await W(this.fetch,"POST",`${this.url}/factors/${t.factorId}/verify`,{body:o,headers:this.headers,jwt:(n=s==null?void 0:s.session)===null||n===void 0?void 0:n.access_token});return c?this._returnResult({data:null,error:c}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+l.expires_in},l)),await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED",l),this._returnResult({data:l,error:c}))})}catch(r){if(F(r))return this._returnResult({data:null,error:r});throw r}})}async _challenge(t){return this._acquireLock(this.lockAcquireTimeout,async()=>{try{return await this._useSession(async r=>{var n;const{data:s,error:a}=r;if(a)return this._returnResult({data:null,error:a});const o=await W(this.fetch,"POST",`${this.url}/factors/${t.factorId}/challenge`,{body:t,headers:this.headers,jwt:(n=s==null?void 0:s.session)===null||n===void 0?void 0:n.access_token});if(o.error)return o;const{data:l}=o;if(l.type!=="webauthn")return{data:l,error:null};switch(l.webauthn.type){case"create":return{data:Object.assign(Object.assign({},l),{webauthn:Object.assign(Object.assign({},l.webauthn),{credential_options:Object.assign(Object.assign({},l.webauthn.credential_options),{publicKey:Ry(l.webauthn.credential_options.publicKey)})})}),error:null};case"request":return{data:Object.assign(Object.assign({},l),{webauthn:Object.assign(Object.assign({},l.webauthn),{credential_options:Object.assign(Object.assign({},l.webauthn.credential_options),{publicKey:Py(l.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(r){if(F(r))return this._returnResult({data:null,error:r});throw r}})}async _challengeAndVerify(t){const{data:r,error:n}=await this._challenge({factorId:t.factorId});return n?this._returnResult({data:null,error:n}):await this._verify({factorId:t.factorId,challengeId:r.id,code:t.code})}async _listFactors(){var t;const{data:{user:r},error:n}=await this.getUser();if(n)return{data:null,error:n};const s={all:[],phone:[],totp:[],webauthn:[]};for(const a of(t=r==null?void 0:r.factors)!==null&&t!==void 0?t:[])s.all.push(a),a.status==="verified"&&s[a.factor_type].push(a);return{data:s,error:null}}async _getAuthenticatorAssuranceLevel(t){var r,n,s,a;if(t)try{const{payload:v}=ka(t);let y=null;v.aal&&(y=v.aal);let x=y;const{data:{user:N},error:f}=await this.getUser(t);if(f)return this._returnResult({data:null,error:f});((n=(r=N==null?void 0:N.factors)===null||r===void 0?void 0:r.filter(k=>k.status==="verified"))!==null&&n!==void 0?n:[]).length>0&&(x="aal2");const m=v.amr||[];return{data:{currentLevel:y,nextLevel:x,currentAuthenticationMethods:m},error:null}}catch(v){if(F(v))return this._returnResult({data:null,error:v});throw v}const{data:{session:o},error:l}=await this.getSession();if(l)return this._returnResult({data:null,error:l});if(!o)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};const{payload:c}=ka(o.access_token);let u=null;c.aal&&(u=c.aal);let d=u;((a=(s=o.user.factors)===null||s===void 0?void 0:s.filter(v=>v.status==="verified"))!==null&&a!==void 0?a:[]).length>0&&(d="aal2");const p=c.amr||[];return{data:{currentLevel:u,nextLevel:d,currentAuthenticationMethods:p},error:null}}async _getAuthorizationDetails(t){try{return await this._useSession(async r=>{const{data:{session:n},error:s}=r;return s?this._returnResult({data:null,error:s}):n?await W(this.fetch,"GET",`${this.url}/oauth/authorizations/${t}`,{headers:this.headers,jwt:n.access_token,xform:a=>({data:a,error:null})}):this._returnResult({data:null,error:new rt})})}catch(r){if(F(r))return this._returnResult({data:null,error:r});throw r}}async _approveAuthorization(t,r){try{return await this._useSession(async n=>{const{data:{session:s},error:a}=n;if(a)return this._returnResult({data:null,error:a});if(!s)return this._returnResult({data:null,error:new rt});const o=await W(this.fetch,"POST",`${this.url}/oauth/authorizations/${t}/consent`,{headers:this.headers,jwt:s.access_token,body:{action:"approve"},xform:l=>({data:l,error:null})});return o.data&&o.data.redirect_url&&Pe()&&!(r!=null&&r.skipBrowserRedirect)&&window.location.assign(o.data.redirect_url),o})}catch(n){if(F(n))return this._returnResult({data:null,error:n});throw n}}async _denyAuthorization(t,r){try{return await this._useSession(async n=>{const{data:{session:s},error:a}=n;if(a)return this._returnResult({data:null,error:a});if(!s)return this._returnResult({data:null,error:new rt});const o=await W(this.fetch,"POST",`${this.url}/oauth/authorizations/${t}/consent`,{headers:this.headers,jwt:s.access_token,body:{action:"deny"},xform:l=>({data:l,error:null})});return o.data&&o.data.redirect_url&&Pe()&&!(r!=null&&r.skipBrowserRedirect)&&window.location.assign(o.data.redirect_url),o})}catch(n){if(F(n))return this._returnResult({data:null,error:n});throw n}}async _listOAuthGrants(){try{return await this._useSession(async t=>{const{data:{session:r},error:n}=t;return n?this._returnResult({data:null,error:n}):r?await W(this.fetch,"GET",`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:r.access_token,xform:s=>({data:s,error:null})}):this._returnResult({data:null,error:new rt})})}catch(t){if(F(t))return this._returnResult({data:null,error:t});throw t}}async _revokeOAuthGrant(t){try{return await this._useSession(async r=>{const{data:{session:n},error:s}=r;return s?this._returnResult({data:null,error:s}):n?(await W(this.fetch,"DELETE",`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:n.access_token,query:{client_id:t.clientId},noResolveJson:!0}),{data:{},error:null}):this._returnResult({data:null,error:new rt})})}catch(r){if(F(r))return this._returnResult({data:null,error:r});throw r}}async fetchJwk(t,r={keys:[]}){let n=r.keys.find(l=>l.kid===t);if(n)return n;const s=Date.now();if(n=this.jwks.keys.find(l=>l.kid===t),n&&this.jwks_cached_at+W0>s)return n;const{data:a,error:o}=await W(this.fetch,"GET",`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(o)throw o;return!a.keys||a.keys.length===0||(this.jwks=a,this.jwks_cached_at=s,n=a.keys.find(l=>l.kid===t),!n)?null:n}async getClaims(t,r={}){try{let n=t;if(!n){const{data:v,error:y}=await this.getSession();if(y||!v.session)return this._returnResult({data:null,error:y});n=v.session.access_token}const{header:s,payload:a,signature:o,raw:{header:l,payload:c}}=ka(n);r!=null&&r.allowExpired||dy(a.exp);const u=!s.alg||s.alg.startsWith("HS")||!s.kid||!("crypto"in globalThis&&"subtle"in globalThis.crypto)?null:await this.fetchJwk(s.kid,r!=null&&r.keys?{keys:r.keys}:r==null?void 0:r.jwks);if(!u){const{error:v}=await this.getUser(n);if(v)throw v;return{data:{claims:a,header:s,signature:o},error:null}}const d=hy(s.alg),h=await crypto.subtle.importKey("jwk",u,d,!0,["verify"]);if(!await crypto.subtle.verify(d,h,o,X0(`${l}.${c}`)))throw new _l("Invalid JWT signature");return{data:{claims:a,header:s,signature:o},error:null}}catch(n){if(F(n))return this._returnResult({data:null,error:n});throw n}}}Ms.nextInstanceID={};const Wy=Ms,Hy="2.104.1";let is="";typeof Deno<"u"?is="deno":typeof document<"u"?is="web":typeof navigator<"u"&&navigator.product==="ReactNative"?is="react-native":is="node";const Vy={"X-Client-Info":`supabase-js-${is}/${Hy}`},qy={headers:Vy},Ky={schema:"public"},Gy={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:"implicit"},Jy={};function Bs(e){"@babel/helpers - typeof";return Bs=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Bs(e)}function Yy(e,t){if(Bs(e)!="object"||!e)return e;var r=e[Symbol.toPrimitive];if(r!==void 0){var n=r.call(e,t);if(Bs(n)!="object")return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function Qy(e){var t=Yy(e,"string");return Bs(t)=="symbol"?t:t+""}function Xy(e,t,r){return(t=Qy(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function Od(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(s){return Object.getOwnPropertyDescriptor(e,s).enumerable})),r.push.apply(r,n)}return r}function ve(e){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?Od(Object(r),!0).forEach(function(n){Xy(e,n,r[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):Od(Object(r)).forEach(function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))})}return e}const Zy=e=>e?(...t)=>e(...t):(...t)=>fetch(...t),ex=()=>Headers,tx=(e,t,r)=>{const n=Zy(r),s=ex();return async(a,o)=>{var l;const c=(l=await t())!==null&&l!==void 0?l:e;let u=new s(o==null?void 0:o.headers);return u.has("apikey")||u.set("apikey",e),u.has("Authorization")||u.set("Authorization",`Bearer ${c}`),n(a,ve(ve({},o),{},{headers:u}))}};function rx(e){return e.endsWith("/")?e:e+"/"}function nx(e,t){var r,n;const{db:s,auth:a,realtime:o,global:l}=e,{db:c,auth:u,realtime:d,global:h}=t,p={db:ve(ve({},c),s),auth:ve(ve({},u),a),realtime:ve(ve({},d),o),storage:{},global:ve(ve(ve({},h),l),{},{headers:ve(ve({},(r=h==null?void 0:h.headers)!==null&&r!==void 0?r:{}),(n=l==null?void 0:l.headers)!==null&&n!==void 0?n:{})}),accessToken:async()=>""};return e.accessToken?p.accessToken=e.accessToken:delete p.accessToken,p}function sx(e){const t=e==null?void 0:e.trim();if(!t)throw new Error("supabaseUrl is required.");if(!t.match(/^https?:\/\//i))throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");try{return new URL(rx(t))}catch{throw Error("Invalid supabaseUrl: Provided URL is malformed.")}}var ax=class extends Wy{constructor(e){super(e)}},ix=class{constructor(e,t,r){var n,s;this.supabaseUrl=e,this.supabaseKey=t;const a=sx(e);if(!t)throw new Error("supabaseKey is required.");this.realtimeUrl=new URL("realtime/v1",a),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace("http","ws"),this.authUrl=new URL("auth/v1",a),this.storageUrl=new URL("storage/v1",a),this.functionsUrl=new URL("functions/v1",a);const o=`sb-${a.hostname.split(".")[0]}-auth-token`,l={db:Ky,realtime:Jy,auth:ve(ve({},Gy),{},{storageKey:o}),global:qy},c=nx(r??{},l);if(this.storageKey=(n=c.auth.storageKey)!==null&&n!==void 0?n:"",this.headers=(s=c.global.headers)!==null&&s!==void 0?s:{},c.accessToken)this.accessToken=c.accessToken,this.auth=new Proxy({},{get:(d,h)=>{throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(h)} is not possible`)}});else{var u;this.auth=this._initSupabaseAuthClient((u=c.auth)!==null&&u!==void 0?u:{},this.headers,c.global.fetch)}this.fetch=tx(t,this._getAccessToken.bind(this),c.global.fetch),this.realtime=this._initRealtimeClient(ve({headers:this.headers,accessToken:this._getAccessToken.bind(this),fetch:this.fetch},c.realtime)),this.accessToken&&Promise.resolve(this.accessToken()).then(d=>this.realtime.setAuth(d)).catch(d=>console.warn("Failed to set initial Realtime auth token:",d)),this.rest=new Ev(new URL("rest/v1",a).href,{headers:this.headers,schema:c.db.schema,fetch:this.fetch,timeout:c.db.timeout,urlLengthLimit:c.db.urlLengthLimit}),this.storage=new z0(this.storageUrl.href,this.headers,this.fetch,r==null?void 0:r.storage),c.accessToken||this._listenForAuthEvents()}get functions(){return new vv(this.functionsUrl.href,{headers:this.headers,customFetch:this.fetch})}from(e){return this.rest.from(e)}schema(e){return this.rest.schema(e)}rpc(e,t={},r={head:!1,get:!1,count:void 0}){return this.rest.rpc(e,t,r)}channel(e,t={config:{}}){return this.realtime.channel(e,t)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getAccessToken(){var e=this,t,r;if(e.accessToken)return await e.accessToken();const{data:n}=await e.auth.getSession();return(t=(r=n.session)===null||r===void 0?void 0:r.access_token)!==null&&t!==void 0?t:e.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:t,detectSessionInUrl:r,storage:n,userStorage:s,storageKey:a,flowType:o,lock:l,debug:c,throwOnError:u},d,h){const p={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new ax({url:this.authUrl.href,headers:ve(ve({},p),d),storageKey:a,autoRefreshToken:e,persistSession:t,detectSessionInUrl:r,storage:n,userStorage:s,flowType:o,lock:l,debug:c,throwOnError:u,fetch:h,hasCustomAuthorizationHeader:Object.keys(this.headers).some(v=>v.toLowerCase()==="authorization")})}_initRealtimeClient(e){return new o0(this.realtimeUrl.href,ve(ve({},e),{},{params:ve(ve({},{apikey:this.supabaseKey}),e==null?void 0:e.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((e,t)=>{this._handleTokenChanged(e,"CLIENT",t==null?void 0:t.access_token)})}_handleTokenChanged(e,t,r){(e==="TOKEN_REFRESHED"||e==="SIGNED_IN")&&this.changedAccessToken!==r?(this.changedAccessToken=r,this.realtime.setAuth(r)):e==="SIGNED_OUT"&&(this.realtime.setAuth(),t=="STORAGE"&&this.auth.signOut(),this.changedAccessToken=void 0)}};const ox=(e,t,r)=>new ix(e,t,r);function lx(){if(typeof window<"u")return!1;const e=globalThis.process;if(!e)return!1;const t=e.version;if(t==null)return!1;const r=t.match(/^v(\d+)\./);return r?parseInt(r[1],10)<=18:!1}lx()&&console.warn("⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217");const Nf=void 0,cx=void 0,Br=!!Nf;let po;function jn(){if(!Br)throw new Error("Supabase environment variables are missing.");return po||(po=ox(Nf,cx,{auth:{persistSession:!0,autoRefreshToken:!0}})),po}const Ef="venture-path-site-demo-db";function Tf(){const e=window.localStorage.getItem(Ef);return e?JSON.parse(e):{contacts:[],subscribers:[],pricingSelections:[],testimonials:[]}}function ux(e){window.localStorage.setItem(Ef,JSON.stringify(e))}function dx(e,t){const r=Tf(),n={id:`${e}-${Date.now()}`,created_at:new Date().toISOString(),...t};return r[e]=[n,...r[e]??[]],ux(r),n}function hx(e){return Tf()[e]??[]}async function jc(e,t){if(!Br)return dx(e,t);const r=jn(),{data:n,error:s}=await r.from(e).insert(t).select().single();if(s)throw s;return n}async function px(e){return jc("contact_submissions",e)}async function fx(e){return jc("newsletter_subscribers",e)}async function gx(e){return jc("testimonials",e)}async function mx(){if(!Br)return[...hx("testimonials"),...Ua];const e=jn(),{data:t,error:r}=await e.from("testimonials").select("*").eq("approved",!0).order("created_at",{ascending:!1}).limit(6);return r?Ua:t.length>0?t:Ua}function Ld(){const[e,t]=I.useState({name:"",email:"",subject:"",company:"",message:""}),[r,n]=I.useState(""),[s,a]=I.useState(!1),o=c=>u=>{t(d=>({...d,[c]:u.target.value}))},l=async c=>{c.preventDefault(),n(""),a(!0);try{await px(e),t({name:"",email:"",subject:"",company:"",message:""}),n("Message sent successfully.")}catch(u){n(u.message)}finally{a(!1)}};return i.jsxs("section",{id:"contact",className:"section contact-section",children:[i.jsxs("div",{className:"contact-copy reveal",children:[i.jsx("p",{className:"eyebrow",children:"Contact"}),i.jsx("h2",{children:"Tell us where you are in your startup journey."}),i.jsx("p",{children:"Tell us about your startup, your idea, or what you want to launch next. We would love to hear where you are now and where you want to go."})]}),i.jsxs("form",{className:"contact-form reveal delay-1",onSubmit:l,children:[i.jsxs("div",{className:"form-row",children:[i.jsx("input",{value:e.name,onChange:o("name"),type:"text",placeholder:"Your name",required:!0}),i.jsx("input",{value:e.email,onChange:o("email"),type:"email",placeholder:"Email address",required:!0})]}),i.jsxs("div",{className:"form-row",children:[i.jsx("input",{value:e.company,onChange:o("company"),type:"text",placeholder:"Startup or project name"}),i.jsx("input",{value:e.subject,onChange:o("subject"),type:"text",placeholder:"What do you need help with?",required:!0})]}),i.jsx("textarea",{value:e.message,onChange:o("message"),placeholder:"Tell us about your idea or your current stage...",rows:"6",required:!0}),i.jsx("button",{type:"submit",className:"primary-btn",disabled:s,children:s?"Sending...":"Send Message"}),r&&i.jsx("p",{className:"form-status",children:r})]})]})}function vx({faqs:e}){const[t,r]=I.useState(0);return i.jsxs("section",{className:"section content-section faq-section",children:[i.jsxs("div",{className:"section-heading reveal",children:[i.jsx("p",{className:"eyebrow",children:"FAQ"}),i.jsx("h2",{children:"Questions founders and teams often ask."})]}),i.jsx("div",{className:"faq-list",children:e.map((n,s)=>{const a=t===s;return i.jsxs("article",{className:`faq-item reveal delay-${s%3+1}${a?" open":""}`,children:[i.jsxs("button",{type:"button",className:"faq-question",onClick:()=>r(a?-1:s),children:[i.jsx("span",{children:n.question}),i.jsx("strong",{children:a?"-":"+"})]}),i.jsx("div",{className:"faq-answer",children:i.jsx("p",{children:n.answer})})]},n.question)})})]})}const ba={color:"#2f6bff",bg:"rgba(47,107,255,0.1)"},$d=[ba,ba,ba,ba];function yx({values:e,aboutParallax:t}){return i.jsxs("section",{id:"about",className:"section about-section",children:[i.jsx("style",{children:`
        /* ── Layout ────────────────────────────────── */
        .about-section {
          display: grid;
          grid-template-columns: 0.92fr 1.08fr;
          gap: 48px;
          align-items: center;
        }

        /* ── Left image panel ──────────────────────── */
        .about-image {
          position: relative;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 24px 64px rgba(14,38,84,0.14);
          aspect-ratio: 3/4;
          max-height: 560px;
        }

        .about-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          will-change: transform;
          transition: transform 0.6s ease;
        }

        .about-image:hover img { transform: scale(1.04); }

        .about-image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 50%, rgba(10,25,60,0.22));
          pointer-events: none;
        }

        /* ── Right copy ────────────────────────────── */
        .about-copy {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .about-copy h2 {
          max-width: 22ch;
          font-size: clamp(1.9rem, 3.2vw, 2.8rem);
          line-height: 1.1;
        }

        .about-copy > p {
          margin: 0;
          color: var(--text);
          font-size: 1.02rem;
          line-height: 1.72;
          max-width: 52ch;
        }

        /* ── Values grid ───────────────────────────── */
        .fv-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        /* ── Value card ────────────────────────────── */
        .fv-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 24px;
          border-radius: 22px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.96);
          box-shadow: 0 4px 18px rgba(14,38,84,0.06);
          overflow: hidden;
          transition: transform 0.36s ease, box-shadow 0.36s ease, border-color 0.36s ease;
        }

        body.dark-mode .fv-card { background: rgba(10,20,42,0.72); }

        .fv-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 4px;
          opacity: 0;
          transition: opacity 0.36s ease;
        }

        .fv-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 22px 52px rgba(14,38,84,0.13);
        }

        .fv-card:hover::before { opacity: 1; }

        /* ── Number badge ──────────────────────────── */
        .fv-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          font-family: "Space Grotesk", sans-serif;
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.02em;
          flex-shrink: 0;
          transition: transform 0.36s ease;
        }

        .fv-card:hover .fv-num { transform: scale(1.12); }

        /* ── Card title ────────────────────────────── */
        .fv-title {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--navy-900);
          line-height: 1.2;
        }

        /* ── Card text ─────────────────────────────── */
        .fv-text {
          margin: 0;
          font-size: 0.88rem;
          color: var(--text);
          line-height: 1.65;
        }

        /* ── Accent line on hover per card ─────────── */
        .fv-card-0::before { background: linear-gradient(90deg,#0d2145,#2f6bff); }
        .fv-card-1::before { background: linear-gradient(90deg,#065f46,#0d9488); }
        .fv-card-2::before { background: linear-gradient(90deg,#4c1d95,#7c3aed); }
        .fv-card-3::before { background: linear-gradient(90deg,#92400e,#d97706); }

        /* ── Responsive ────────────────────────────── */
        @media (max-width: 960px) {
          .about-section { grid-template-columns: 1fr; }
          .about-image { aspect-ratio: 16/7; max-height: none; }
        }

        @media (max-width: 600px) {
          .fv-grid { grid-template-columns: 1fr; }
        }
      `}),i.jsx("div",{className:"about-image reveal",children:i.jsx("img",{style:t,src:"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80",alt:"Entrepreneurs collaborating in a modern startup office"})}),i.jsxs("div",{className:"about-copy reveal delay-1",children:[i.jsx("p",{className:"eyebrow",children:"About"}),i.jsx("h2",{children:"Simple support for founders who want to move from idea to action."}),i.jsx("p",{children:"Starti is here to support founders who need clarity, guidance, and practical next steps. It helps you understand where you are, what to do next, and how to move forward with confidence."}),i.jsx("div",{className:"fv-grid",children:e.map((r,n)=>{const s=$d[n]??$d[0],a=String(n+1).padStart(2,"0");return i.jsxs("article",{className:`fv-card fv-card-${n} reveal delay-${n+1}`,children:[i.jsx("div",{className:"fv-num",style:{background:s.bg,color:s.color},"aria-hidden":"true",children:a}),i.jsx("h3",{className:"fv-title",children:r.title}),i.jsx("p",{className:"fv-text",children:r.text})]},r.title)})})]})]})}function fo(){return i.jsxs("footer",{className:"footer",children:[i.jsxs("div",{children:[i.jsx("strong",{children:"Starti"}),i.jsx("p",{children:"Helping founders turn ideas into clear plans, next steps, and stronger startup progress."})]}),i.jsxs("div",{className:"footer-links",children:[i.jsx("a",{href:"#home",children:"Home"}),i.jsx("a",{href:"#services",children:"Services"}),i.jsx("a",{href:"#about",children:"About"}),i.jsx("a",{href:"#portfolio",children:"Portfolio"}),i.jsx("a",{href:"#contact",children:"Contact"})]})]})}function xx({copy:e,stats:t,heroParallax:r,onPrimaryAction:n}){return i.jsxs("section",{id:"home",className:"hero-section section",children:[i.jsxs("div",{className:"hero-copy reveal",children:[i.jsx("p",{className:"eyebrow",children:e.eyebrow}),i.jsx("h1",{children:e.title}),i.jsx("p",{className:"hero-text",children:e.text}),i.jsxs("div",{className:"hero-actions",children:[i.jsx("button",{type:"button",className:"primary-btn",onClick:n,children:"Start Your Project"}),i.jsx("a",{href:"#services",className:"secondary-btn",children:"Explore Services"})]}),i.jsx("div",{className:"hero-stats",children:t.map(s=>i.jsxs("div",{children:[i.jsx("strong",{children:s.value}),i.jsx("span",{children:s.label})]},s.label))})]}),i.jsxs("div",{className:"hero-visual reveal delay-1",children:[i.jsx("div",{className:"hero-image-frame",style:r,children:i.jsx("img",{src:e.image,alt:"Startup team working around laptops in a modern innovation workspace"})}),i.jsx("div",{className:"floating-card card-a",children:i.jsx("strong",{children:"For New Founders"})}),i.jsx("div",{className:"floating-card card-b",children:i.jsx("strong",{children:"Launch Faster"})}),i.jsx("div",{className:"floating-card card-c",children:i.jsx("strong",{children:"Build Trust"})}),i.jsx("div",{className:"floating-card card-d",children:i.jsx("strong",{children:"Ready to Grow"})})]})]})}function kx(){const[e,t]=I.useState(""),[r,n]=I.useState(""),[s,a]=I.useState(!1),o=async l=>{l.preventDefault(),n(""),a(!0);try{await fx({email:e}),t(""),n("Subscribed successfully.")}catch(c){n(c.message)}finally{a(!1)}};return i.jsx("section",{id:"newsletter",className:"section content-section newsletter-section",children:i.jsxs("div",{className:"newsletter-card reveal",children:[i.jsxs("div",{children:[i.jsx("p",{className:"eyebrow",children:"Newsletter"}),i.jsx("h2",{children:"Get simple founder tips, launch ideas, and encouragement in your inbox."})]}),i.jsxs("form",{className:"newsletter-form",onSubmit:o,children:[i.jsx("input",{type:"email",value:e,onChange:l=>t(l.target.value),placeholder:"Enter your email address",required:!0}),i.jsx("button",{type:"submit",className:"primary-btn",disabled:s,children:s?"Joining...":"Subscribe"})]}),r&&i.jsx("p",{className:"form-status",children:r})]})})}function bx({items:e}){return i.jsxs("section",{id:"portfolio",className:"section content-section",children:[i.jsxs("div",{className:"section-heading reveal",children:[i.jsx("p",{className:"eyebrow",children:"Portfolio"}),i.jsx("h2",{children:"Examples of clear and confident startup presentation."})]}),i.jsx("div",{className:"portfolio-grid",children:e.map((t,r)=>i.jsxs("article",{className:`portfolio-card reveal delay-${r%3+1}`,children:[i.jsx("img",{src:t.image,alt:t.title}),i.jsxs("div",{className:"portfolio-body",children:[i.jsx("span",{children:t.tag}),i.jsx("h3",{children:t.title}),i.jsx("p",{children:t.text})]})]},t.title))})]})}const wx=["https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=60","https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=60"],_x=["linear-gradient(120deg,#0d2145 0%,#2f6bff 100%)","linear-gradient(120deg,#1a3b78 0%,#5a92ff 100%)","linear-gradient(120deg,#102a56 0%,#4b7cff 100%)"];function jx({services:e}){return i.jsxs("section",{id:"services",className:"section content-section",children:[i.jsx("style",{children:`
        .svc-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:26px;margin-top:52px}
        .svc-card{position:relative;display:flex;flex-direction:column;border-radius:28px;border:1px solid var(--border);background:rgba(255,255,255,0.97);box-shadow:0 6px 28px rgba(14,38,84,0.07);overflow:hidden;transition:transform .38s ease,box-shadow .38s ease,border-color .38s ease}
        body.dark-mode .svc-card{background:rgba(10,20,42,0.82)}
        .svc-card:hover{transform:translateY(-10px);box-shadow:0 28px 64px rgba(20,58,140,0.16),0 0 0 1.5px rgba(75,124,255,0.22);border-color:rgba(75,124,255,0.3)}
        .svc-top-bar{height:5px;width:100%;flex-shrink:0}
        .svc-bg-img{position:absolute;inset:0;background-size:cover;background-position:center right;opacity:.07;transition:opacity .38s ease;pointer-events:none}
        .svc-card:hover .svc-bg-img{opacity:.13}
        .svc-body{position:relative;display:flex;flex-direction:column;gap:18px;padding:28px 28px 32px;flex:1;z-index:1}
        .svc-meta{display:flex;align-items:center;justify-content:space-between;gap:10px}
        .svc-track-label{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;font-size:.72rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;background:rgba(47,107,255,.1);color:var(--navy-800)}
        .svc-track-badge{display:inline-flex;align-items:center;padding:6px 12px;border-radius:999px;font-size:.72rem;font-weight:700;background:rgba(47,107,255,.08);color:var(--blue-500)}
        .svc-title{margin:0;font-family:"Space Grotesk",sans-serif;font-size:clamp(1.5rem,2.2vw,1.8rem);font-weight:700;color:var(--navy-900);line-height:1.08;letter-spacing:-.025em}
        .svc-desc{margin:0;color:var(--text);font-size:.96rem;line-height:1.65;max-width:36ch}
        .svc-tags{display:flex;flex-wrap:wrap;gap:8px}
        .svc-tag{display:inline-flex;align-items:center;padding:7px 13px;border-radius:999px;border:1px solid var(--border);background:rgba(18,51,100,.045);color:var(--navy-800);font-size:.81rem;font-weight:600}
        body.dark-mode .svc-tag{background:rgba(255,255,255,.06)}
        .svc-btn{display:inline-flex;align-items:center;gap:8px;margin-top:6px;padding:13px 22px;border-radius:999px;font-size:.92rem;font-weight:800;color:#fff;border:0;background:linear-gradient(135deg,#10336a 0%,#2f6bff 55%,#5a92ff 100%);box-shadow:0 10px 26px rgba(21,63,138,.26);transition:transform .3s ease,box-shadow .3s ease;cursor:pointer;text-decoration:none;align-self:flex-start}
        .svc-btn:hover{transform:translateY(-3px);box-shadow:0 18px 40px rgba(21,63,138,.34);color:#fff}
        .svc-arrow{transition:transform .3s ease}
        .svc-btn:hover .svc-arrow{transform:translateX(4px)}
        .svc-footer{margin-top:52px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}
        .svc-footer-label{margin:0;font-family:"Space Grotesk",sans-serif;font-size:1.2rem;font-weight:700;color:var(--navy-900)}
        @media(max-width:900px){.svc-grid{grid-template-columns:1fr}}
      `}),i.jsxs("div",{className:"section-heading reveal",children:[i.jsx("p",{className:"eyebrow",children:"Services"}),i.jsx("h2",{children:"Choose your startup path"}),i.jsx("p",{className:"section-subtitle",children:"Whether testing an idea, handling legal setup, or launching — pick the track that fits where you are right now."})]}),i.jsx("div",{className:"svc-grid",children:e.map((t,r)=>{const n=t.directHref??`#${t.id}`;return i.jsxs("article",{className:`svc-card reveal delay-${r+1}`,children:[i.jsx("div",{className:"svc-bg-img",style:{backgroundImage:`url(${wx[r]})`},"aria-hidden":"true"}),i.jsx("div",{className:"svc-top-bar",style:{background:_x[r]},"aria-hidden":"true"}),i.jsxs("div",{className:"svc-body",children:[i.jsxs("div",{className:"svc-meta",children:[i.jsx("span",{className:"svc-track-label",children:t.track}),i.jsx("span",{className:"svc-track-badge",children:t.badge})]}),i.jsx("h3",{className:"svc-title",children:t.title}),i.jsx("p",{className:"svc-desc",children:t.description}),i.jsx("div",{className:"svc-tags",children:t.highlights.slice(0,3).map(s=>i.jsx("span",{className:"svc-tag",children:s},s))}),i.jsxs("a",{href:n,className:"svc-btn",children:["Explore Track",i.jsx("svg",{className:"svc-arrow",width:"15",height:"15",viewBox:"0 0 15 15",fill:"none","aria-hidden":"true",children:i.jsx("path",{d:"M2.5 7.5h10M8.5 3.5l4 4-4 4",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})})]})]})]},t.id)})}),i.jsxs("div",{className:"svc-footer reveal delay-2",children:[i.jsx("p",{className:"svc-footer-label",children:"Not sure where to start?"}),i.jsx("a",{href:"#contact",className:"primary-btn",children:"Find My Startup Track"})]})]})}function Sx({value:e,suffix:t,label:r}){const[n,s]=I.useState(0);return I.useEffect(()=>{let a;const l=performance.now(),c=u=>{const d=Math.min((u-l)/1400,1);s(Math.round(e*d)),d<1&&(a=requestAnimationFrame(c))};return a=requestAnimationFrame(c),()=>cancelAnimationFrame(a)},[e]),i.jsxs("div",{className:"stat-counter",children:[i.jsxs("strong",{children:[n,t]}),i.jsx("span",{children:r})]})}function Nx({stats:e}){return i.jsxs("section",{className:"section stats-section",children:[i.jsxs("div",{className:"section-heading reveal",children:[i.jsx("p",{className:"eyebrow",children:"Statistics"}),i.jsx("h2",{children:"Numbers that bring momentum to the startup story."})]}),i.jsx("div",{className:"stats-grid",children:e.map((t,r)=>i.jsx("div",{className:`reveal delay-${r%3+1}`,children:i.jsx(Sx,{...t})},t.label))})]})}function Ex({testimonials:e,loading:t,onSubmitReview:r,submittingReview:n}){const[s,a]=I.useState({name:"",role:"",quote:"",rating:5}),[o,l]=I.useState(""),c=d=>h=>{a(p=>({...p,[d]:h.target.value}))},u=async d=>{d.preventDefault(),l("");try{await r({name:s.name,role:s.role,quote:s.quote,rating:Number(s.rating),approved:!1}),a({name:"",role:"",quote:"",rating:5}),l("Review submitted successfully.")}catch(h){l(h.message)}};return i.jsxs("section",{id:"testimonials",className:"section content-section testimonials-section",children:[i.jsxs("div",{className:"section-heading reveal",children:[i.jsx("p",{className:"eyebrow",children:"Testimonials"}),i.jsx("h2",{children:"What founders and startup supporters say."})]}),i.jsx("div",{className:"testimonials-grid",children:(t?[]:e).map((d,h)=>i.jsxs("article",{className:`testimonial-card reveal delay-${h%3+1}`,children:[i.jsxs("p",{className:"quote",children:['"',d.quote,'"']}),i.jsx("strong",{children:d.name}),i.jsx("span",{children:d.role})]},d.id??d.name))}),i.jsxs("form",{className:"review-form reveal delay-2",onSubmit:u,children:[i.jsxs("div",{className:"section-heading compact-heading",children:[i.jsx("p",{className:"eyebrow",children:"Share Your Experience"}),i.jsx("h2",{children:"Tell others how this support helped you."})]}),i.jsxs("div",{className:"form-row",children:[i.jsx("input",{value:s.name,onChange:c("name"),type:"text",placeholder:"Your name",required:!0}),i.jsx("input",{value:s.role,onChange:c("role"),type:"text",placeholder:"Your role",required:!0})]}),i.jsx("div",{className:"form-row",children:i.jsxs("select",{value:s.rating,onChange:c("rating"),className:"select-field",children:[i.jsx("option",{value:"5",children:"5 stars"}),i.jsx("option",{value:"4",children:"4 stars"}),i.jsx("option",{value:"3",children:"3 stars"})]})}),i.jsx("textarea",{value:s.quote,onChange:c("quote"),rows:"4",placeholder:"Share your experience...",required:!0}),i.jsx("button",{type:"submit",className:"primary-btn",disabled:n,children:n?"Sending...":"Submit Review"}),o&&i.jsx("p",{className:"form-status",children:o})]})]})}function Tx({track:e}){return i.jsxs("section",{className:"section track-page",children:[i.jsxs("div",{className:"track-page-hero reveal",children:[i.jsxs("div",{className:"track-page-copy",children:[i.jsxs("div",{className:"track-card-top",children:[i.jsx("span",{className:"track-label",children:e.track}),i.jsx("span",{className:"track-badge",children:e.badge})]}),i.jsx("div",{className:"track-icon large-track-icon",children:e.icon}),i.jsx("h1",{children:e.pageTitle}),i.jsx("p",{children:e.pageText}),i.jsx("div",{className:"track-highlights",children:e.highlights.map(t=>i.jsx("span",{className:"track-chip",children:t},t))})]}),i.jsxs("div",{className:"track-page-panel reveal delay-1",children:[i.jsx("p",{className:"eyebrow",children:"This path helps you"}),i.jsx("div",{className:"track-steps",children:e.steps.map((t,r)=>i.jsxs("div",{className:"track-step",children:[i.jsx("span",{children:r+1}),i.jsx("p",{children:t})]},t))})]})]}),i.jsxs("div",{className:"track-page-outcome reveal delay-2",children:[i.jsxs("div",{children:[i.jsx("p",{className:"eyebrow",children:e.outcomeTitle}),i.jsx("h2",{children:e.title}),i.jsx("p",{children:e.outcomeText})]}),i.jsxs("div",{className:"track-page-actions",children:[i.jsx("a",{href:"#contact",className:"primary-btn",children:"Talk About This Track"}),i.jsx("a",{href:"#services",className:"secondary-btn",children:"Back to All Tracks"})]})]})]})}const Cx="/assets/logo-Bj8uJvso.png",Ax="/assets/darkLogo-Qn-Pg-3c.png";function go({darkMode:e,onToggleDarkMode:t,onOpenAuth:r,user:n,onSignOut:s}){return i.jsxs("header",{className:"topbar",children:[i.jsx("a",{href:"#home",className:"brand",children:i.jsx("img",{className:"brand-logo",src:e?Ax:Cx,alt:"Venture Path logo"})}),i.jsxs("nav",{className:"nav-links",children:[i.jsx("a",{href:"#home",children:"Home"}),i.jsx("a",{href:"#services",children:"Services"}),i.jsx("a",{href:"#about",children:"About"}),i.jsx("a",{href:"#portfolio",children:"Portfolio"}),i.jsx("a",{href:"#contact",children:"Contact"})]}),i.jsxs("div",{className:"nav-actions",children:[i.jsx("button",{type:"button",className:"theme-toggle icon-toggle",onClick:t,"aria-label":e?"Switch to light mode":"Switch to dark mode",title:e?"Light mode":"Dark mode",children:i.jsx("span",{"aria-hidden":"true",children:e?"☀":"☾"})}),n?i.jsxs(i.Fragment,{children:[i.jsx("span",{className:"auth-pill",children:n.email}),i.jsx("button",{type:"button",className:"secondary-btn nav-secondary",onClick:s,children:"Sign Out"})]}):i.jsx("button",{type:"button",className:"secondary-btn nav-secondary",onClick:r,children:"Sign In"}),i.jsx("a",{href:"#contact",className:"nav-cta",children:"Get Started"})]})]})}function Rx(){const[e,t]=I.useState(null),[r,n]=I.useState(null),[s,a]=I.useState(!0);return I.useEffect(()=>{if(!Br){a(!1);return}const u=jn();u.auth.getSession().then(({data:h})=>{var p;t(h.session),n(((p=h.session)==null?void 0:p.user)??null),a(!1)});const{data:{subscription:d}}=u.auth.onAuthStateChange((h,p)=>{t(p),n((p==null?void 0:p.user)??null),a(!1)});return()=>d.unsubscribe()},[]),{session:e,user:r,loading:s,signIn:async({email:u,password:d})=>{if(!Br)throw new Error("Founder sign in will be available as soon as account setup is connected.");const h=jn(),{error:p}=await h.auth.signInWithPassword({email:u,password:d});if(p)throw p},signUp:async({email:u,password:d,fullName:h})=>{if(!Br)throw new Error("Founder sign up will be available as soon as account setup is connected.");const p=jn(),{error:v}=await p.auth.signUp({email:u,password:d,options:{data:{full_name:h}}});if(v)throw v},signOut:async()=>{if(!Br){t(null),n(null);return}const u=jn(),{error:d}=await u.auth.signOut();if(d)throw d}}}function Px(){const[e,t]=I.useState(0),[r,n]=I.useState(0);return I.useEffect(()=>{const s=()=>{const o=document.documentElement.scrollHeight-window.innerHeight,l=o>0?window.scrollY/o*100:0;t(l),n(window.scrollY)};return s(),window.addEventListener("scroll",s,{passive:!0}),()=>window.removeEventListener("scroll",s)},[]),{scrollProgress:e,scrollY:r}}function Ox(){const[e,t]=I.useState(Ua),[r,n]=I.useState(!0),[s,a]=I.useState(!1);return I.useEffect(()=>{let l=!0;async function c(){n(!0);const u=await mx();l&&u.length>0&&t(u),l&&n(!1)}return c(),()=>{l=!1}},[]),{testimonials:e,loading:r,submittingReview:s,submitReview:async l=>{a(!0);try{const c=await gx(l);return t(u=>[c,...u].slice(0,6)),c}finally{a(!1)}}}}const Lx=["technology","education","health","finance","commerce","logistics / transport / mobility","real estate / housing","food / beverage","beauty / wellness / fitness","media / communications","professional services","manufacturing / industrial","agriculture","construction / home services","energy / environment","travel / hospitality","telecom / connectivity","public sector / nonprofit","other","unknown"],$x=["marketplace","booking / appointments","software tool / SaaS","API / developer platform","data / analytics product","workflow automation / internal tool","B2C app","community / social platform","subscription / membership","media / audience business","content / digital product","training / academy / coaching","ecommerce / retail","directory / lead generation","local service business","on-demand service","agency / done-for-you service","productized service","consulting / expert service","managed operations provider","broker / intermediary","reseller / distributor","wholesale business","import / export business","manufacturer / producer","hardware-enabled product / IoT","logistics / delivery operator","rental / asset access business","repair / maintenance business","franchise / branch model","events / experiences business"],Ix=["B2B","B2C","B2B2C","Marketplace (business + customer sides)","Public sector / nonprofit","Mixed / other"],Ux="http://127.0.0.1:5055",zx=`${Ux}/track1/analyze`,Dx=["Overview","Market","MVP","Operations","Finance","Legal"];function Ne({label:e,children:t}){return i.jsxs("label",{className:"track1-field",children:[i.jsx("span",{children:e}),t]})}function nr(e){const t={green:"#22c55e",red:"#ef4444",amber:"#f59e0b",blue:"#38bdf8",purple:"#8b5cf6",cyan:"#06b6d4",slate:"#94a3b8"};return t[e]||t.blue}function dr(e){const t=String(e||"").trim().toLowerCase();return["yes","high","appears original"].includes(t)?"green":["uncertain","medium","partially exists"].includes(t)?"amber":["no","low","already exists"].includes(t)?"red":"blue"}function Id(e){const t=String(e||"").trim().toLowerCase();return t==="high"?"red":t==="medium"?"amber":t==="low"?"green":"blue"}function Cf(e){const t=String(e||"").trim().toLowerCase();return t==="critical"?"red":t==="important"?"amber":t==="useful"?"blue":"slate"}function Af(e){return String(e).replaceAll("_"," ").replace(/\b\w/g,t=>t.toUpperCase())}function jl(e){return e==null||e===""||e==="missing_info"||e==="missing"||e==="N/A"}function xt(e){return jl(e)?"N/A":typeof e=="string"||typeof e=="number"||typeof e=="boolean"?String(e):Array.isArray(e)?e.map(t=>xt(t)).join(`
`):typeof e=="object"?Object.entries(e).map(([t,r])=>`${Af(t)}: ${xt(r)}`).join(`
`):String(e)}function Rf(e){const r=String(e||"").match(/\d+(?:\.\d+)?/g);return!r||r.length===0?null:r.length===1?[Number(r[0]),Number(r[0])]:[Number(r[0]),Number(r[1])]}function Fx(e=[]){const t=e.map(r=>Rf(r==null?void 0:r.salary_or_range)).filter(Boolean).map(r=>r[1]);return t.length?Math.max(...t):1}function Sc({children:e,tone:t="blue"}){const r=nr(t);return i.jsx("span",{className:"track1-pill",style:{color:r,background:`${r}20`,borderColor:`${r}66`},children:e})}function dt({label:e,value:t,tone:r}){const n=r||dr(t),s=nr(n);return i.jsxs("div",{className:"track1-metric",style:{background:`linear-gradient(135deg, ${s}18 0%, rgba(255,255,255,0.96) 55%, #f8fbff 100%)`,borderColor:`${s}40`},children:[i.jsx("span",{children:e}),i.jsx("strong",{children:xt(t)})]})}function Wt({title:e,children:t,tone:r="blue"}){const n=nr(r);return i.jsxs("div",{className:"track1-card",style:{borderLeft:`4px solid ${n}`},children:[i.jsx("h3",{children:e}),i.jsx("p",{className:"track1-muted",children:xt(t)})]})}function De({title:e,items:t,tone:r="blue"}){const n=nr(r),s=Array.isArray(t)?t:t?[t]:[];return i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:e}),s.length===0?i.jsx("div",{className:"track1-card",children:i.jsx("p",{className:"track1-muted",children:"No data."})}):s.map((a,o)=>i.jsx("div",{className:jl(a)?"track1-alert danger":"track1-card",style:jl(a)?{}:{borderLeft:`4px solid ${n}`},children:i.jsx("p",{className:"track1-muted",children:xt(a)})},o))]})}function Mx({label:e,value:t,globalMax:r=1,tone:n="blue"}){const s=Rf(t),a=nr(n);if(!s)return i.jsxs("p",{className:"track1-muted",children:[i.jsxs("strong",{children:[e,":"]})," ",xt(t)]});const[o,l]=s,c=Math.min(o/r*100,100),u=Math.max((l-o)/r*100,4);return i.jsxs("div",{className:"track1-range-wrap",children:[i.jsxs("div",{className:"track1-small-line",children:[i.jsx("strong",{children:e})," — ",t]}),i.jsx("div",{className:"track1-range-track",children:i.jsx("div",{className:"track1-range-bar",style:{left:`${c}%`,width:`${u}%`,background:a}})})]})}function Bx({item:e}){const t=(e==null?void 0:e.relevance_confidence)||"Medium",r=dr(t);return i.jsxs("div",{className:"track1-card",style:{borderLeft:`4px solid ${nr(r)}`},children:[i.jsx("h3",{children:(e==null?void 0:e.company_name)||"Unknown solution"}),i.jsx("div",{className:"track1-pill-row",children:i.jsxs(Sc,{tone:r,children:["Confidence: ",t]})}),i.jsxs("p",{className:"track1-muted",children:[i.jsx("strong",{children:"What it does:"})," ",xt(e==null?void 0:e.what_it_does)]}),i.jsxs("p",{className:"track1-muted",children:[i.jsx("strong",{children:"Similarity:"})," ",xt(e==null?void 0:e.similarity_to_startup)]})]})}function Wx({item:e,linkedFinance:t}){const r=(e==null?void 0:e.necessity_level)||(t==null?void 0:t.necessity_level)||"uncertain",n=Cf(r);return i.jsxs("div",{className:"track1-card role-card",style:{borderTop:`4px solid ${nr(n)}`},children:[i.jsx("h3",{children:(e==null?void 0:e.role)||"Unknown role"}),i.jsx("div",{className:"track1-pill-row",children:i.jsx(Sc,{tone:n,children:r})}),i.jsx("p",{className:"track1-muted",children:xt((e==null?void 0:e.responsibility_or_description)||(e==null?void 0:e.why_needed))})]})}function Hx({item:e,globalMax:t}){const r=Cf(e==null?void 0:e.necessity_level);return i.jsxs("div",{className:"track1-card",style:{borderLeft:`4px solid ${nr(r)}`},children:[i.jsx("h3",{children:(e==null?void 0:e.role)||"Unknown role"}),i.jsx("div",{className:"track1-pill-row",children:i.jsx(Sc,{tone:r,children:(e==null?void 0:e.necessity_level)||"uncertain"})}),i.jsxs("p",{className:"track1-muted",children:[i.jsx("strong",{children:"Why needed:"})," ",xt(e==null?void 0:e.why_needed)]}),i.jsx(Mx,{label:"Salary Range",value:e==null?void 0:e.salary_or_range,globalMax:t,tone:r})]})}function wa({title:e,data:t,tone:r="blue"}){const n=nr(r);return!t||typeof t!="object"||Array.isArray(t)?i.jsx(Wt,{title:e,tone:r,children:t}):i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:e}),Object.entries(t).map(([s,a])=>i.jsxs("div",{className:"track1-card",style:{borderLeft:`4px solid ${n}`},children:[i.jsx("h3",{children:Af(s)}),i.jsx("p",{className:"track1-muted",children:xt(a)})]},s))]})}function Vx({title:e,items:t}){const r=Array.isArray(t)?t:t?[t]:[];return i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:e}),r.length===0?i.jsx("div",{className:"track1-card",children:i.jsx("p",{className:"track1-muted",children:"No data."})}):r.map((n,s)=>i.jsxs("div",{className:"track1-timeline-step",children:[i.jsx("span",{className:"track1-timeline-index",children:s+1}),i.jsx("p",{children:xt(n)})]},s))]})}function qx(){var z,K,b;const[e,t]=I.useState({startup_idea:"",idea_description:"",problem:"",how_it_works_one_sentence:"",target_type:"B2B",target_location:"",target_notes:"",industry:"unknown",product_type:"software tool / SaaS",revenue_model:"",who_pays:"",when_paid:"",price_per_sale:"",sales_target_per_month:0,gain_on_sale_pct:0,months:"",initial_budget_tnd:0}),[r,n]=I.useState([{role:"",skills:""}]),[s,a]=I.useState(!1),[o,l]=I.useState(null),[c,u]=I.useState(""),[d,h]=I.useState("Overview");function p(T,Q){t(B=>({...B,[T]:Q}))}function v(T,Q,B){n(O=>O.map((U,w)=>w===T?{...U,[Q]:B}:U))}function y(){n(T=>[...T,{role:"",skills:""}])}async function x(){a(!0),u(""),l(null);const T={startup_idea:e.startup_idea.trim(),idea_description:e.idea_description.trim(),problem:e.problem.trim(),target_customer:{type:e.target_type,location:e.target_location.trim(),notes:e.target_notes.trim()},industry:e.industry,product_type:e.product_type,how_it_works_one_sentence:e.how_it_works_one_sentence.trim(),business_model:{revenue_model:e.revenue_model.trim(),who_pays:e.who_pays.trim(),when_paid:e.when_paid.trim()},team:{members:r.filter(Q=>Q.role.trim()||Q.skills.trim())},finance_assumptions:{price_per_sale:e.price_per_sale.trim(),sales_target_per_month:Number(e.sales_target_per_month),gain_on_sale_pct:Number(e.gain_on_sale_pct),months:e.months.trim(),initial_budget_tnd:Number(e.initial_budget_tnd)}};try{const Q=await fetch(zx,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(T)}),B=await Q.json();!Q.ok||B.error?u(B.error||"Pipeline failed."):(l(B),h("Overview"),window.scrollTo({top:0,behavior:"smooth"}))}catch{u("Could not connect to Track1 backend. Make sure FastAPI is running on port 5055.")}finally{a(!1)}}const N=(o==null?void 0:o.startup_summary)||{},f=(o==null?void 0:o.market_existence)||{},g=(o==null?void 0:o.mvp)||{},m=(o==null?void 0:o.operations)||{},k=(o==null?void 0:o.finance)||{},j=(o==null?void 0:o.legal_and_compliance)||{},C=(o==null?void 0:o.final_verdict)||{},S=(o==null?void 0:o.uncertainty_flags)||[],$=(k==null?void 0:k.employees_and_wages)||[],q=Object.fromEntries($.map(T=>[String(T.role||"").toLowerCase(),T])),J=[...$].sort((T,Q)=>{const B={critical:0,important:1,useful:2,uncertain:3};return(B[String(T.necessity_level||"").toLowerCase()]??99)-(B[String(Q.necessity_level||"").toLowerCase()]??99)}),we=Fx(J);return i.jsxs("main",{className:"track1-page",children:[i.jsx("style",{children:`
        .track1-page {
          min-height: 100vh;
          padding: 120px 6vw 70px;
          background:
            radial-gradient(circle at top left, rgba(62, 106, 225, 0.18), transparent 28%),
            radial-gradient(circle at 85% 10%, rgba(15, 37, 84, 0.12), transparent 22%),
            linear-gradient(180deg, #f6f9ff 0%, #eef3fb 100%);
          color: var(--navy-900);
        }

        body.dark-mode .track1-page {
          background:
            radial-gradient(circle at top left, rgba(75, 124, 255, 0.14), transparent 24%),
            radial-gradient(circle at 80% 12%, rgba(75, 124, 255, 0.1), transparent 18%),
            linear-gradient(180deg, #071224 0%, #0a1730 100%);
          color: #eff4ff;
        }

        .track1-shell {
          width: min(1220px, calc(100% - 28px));
          margin: 0 auto;
        }

        .track1-hero,
        .track1-form-card {
          padding: 30px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-md);
          margin-bottom: 22px;
          animation: trackFadeUp 0.45s ease;
        }

        body.dark-mode .track1-hero,
        body.dark-mode .track1-form-card {
          background: rgba(255, 255, 255, 0.04);
        }

        .track1-eyebrow {
          color: #6b7e9c;
          text-transform: uppercase;
          font-size: 0.78rem;
          letter-spacing: 0.05em;
          font-weight: 800;
          margin-bottom: 10px;
        }

        body.dark-mode .track1-eyebrow {
          color: #9db2d3;
        }

        .track1-hero h1 {
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          line-height: 0.98;
          margin: 0 0 16px;
          color: var(--navy-900);
        }

        .track1-hero p,
        .track1-hint {
          color: var(--text);
          max-width: 760px;
          font-size: 1.05rem;
          line-height: 1.7;
        }

        .track1-hint {
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(75, 124, 255, 0.1);
          border: 1px solid rgba(75, 124, 255, 0.22);
          margin-bottom: 18px;
        }

        .track1-form-card h2,
        .track1-card h3,
        .track1-section h2 {
          margin: 0 0 14px;
          font-family: "Space Grotesk", sans-serif;
          color: var(--navy-900);
        }

        .track1-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .track1-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .track1-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: var(--text);
          font-weight: 700;
          font-size: 0.92rem;
        }

        .track1-field input,
        .track1-field textarea,
        .track1-field select {
          width: 100%;
          border-radius: 16px;
          border: 1px solid var(--gray-300);
          background: var(--gray-050);
          color: var(--navy-900);
          padding: 15px 16px;
          outline: none;
          font: inherit;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
        }

        .track1-field textarea {
          min-height: 120px;
          resize: vertical;
        }

        .track1-field input:focus,
        .track1-field textarea:focus,
        .track1-field select:focus {
          border-color: rgba(75, 124, 255, 0.55);
          box-shadow: 0 0 0 4px rgba(75, 124, 255, 0.12);
          background: rgba(255, 255, 255, 0.96);
        }

        .track1-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .track1-btn {
          border: 0;
          border-radius: 999px;
          padding: 14px 22px;
          font-weight: 800;
          cursor: pointer;
          color: #fff;
          background: linear-gradient(135deg, #0d2145, #4b7cff);
          box-shadow: 0 16px 34px rgba(29, 77, 145, 0.28);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .track1-btn:hover {
          transform: translateY(-2px);
        }

        .track1-btn.secondary {
          color: var(--navy-900);
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: none;
        }

        .track1-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .track1-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 18px;
        }

        .track1-tab {
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.9);
          color: var(--navy-900);
          padding: 10px 16px;
          cursor: pointer;
          font-weight: 800;
          transition: transform 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease;
        }

        body.dark-mode .track1-tab {
          background: rgba(255, 255, 255, 0.04);
        }

        .track1-tab:hover {
          transform: translateY(-2px);
          border-color: rgba(75, 124, 255, 0.45);
        }

        .track1-tab.active {
          color: #fff;
          border-color: transparent;
          background: linear-gradient(135deg, #0d2145, #4b7cff);
          box-shadow: 0 16px 34px rgba(29, 77, 145, 0.28);
        }

        .track1-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }

        .track1-metric {
          padding: 18px;
          border-radius: 22px;
          border: 1px solid var(--border);
          min-height: 120px;
          box-shadow: var(--shadow-md);
          animation: trackFadeUp 0.45s ease;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .track1-metric:hover,
        .track1-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 28px 64px rgba(10, 32, 73, 0.14);
        }

        .track1-metric span {
          display: block;
          color: var(--text);
          margin-bottom: 8px;
        }

        .track1-metric strong {
          display: block;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.65rem;
          line-height: 1.05;
          white-space: pre-wrap;
        }

        .track1-card {
          padding: 22px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-md);
          margin-bottom: 18px;
          color: var(--text);
          animation: trackFadeUp 0.45s ease;
          transition: transform 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease, border-color 0.35s ease;
        }

        body.dark-mode .track1-card {
          background: rgba(255, 255, 255, 0.04);
        }

        .track1-muted {
          color: var(--text);
          margin: 0;
          line-height: 1.7;
          white-space: pre-wrap;
        }

        .track1-section {
          margin-bottom: 18px;
        }

        .track1-pill-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 12px;
        }

        .track1-pill {
          display: inline-block;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 800;
          border: 1px solid;
          text-transform: capitalize;
        }

        .track1-range-wrap {
          margin-top: 14px;
        }

        .track1-small-line {
          color: var(--text);
          font-size: 0.92rem;
          margin-bottom: 8px;
        }

        .track1-range-track {
          position: relative;
          height: 14px;
          border-radius: 999px;
          background: rgba(18, 51, 100, 0.1);
          overflow: hidden;
        }

        .track1-range-bar {
          position: absolute;
          top: 0;
          height: 14px;
          border-radius: 999px;
        }

        .track1-timeline-step {
          position: relative;
          padding: 16px 18px 16px 56px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-md);
          margin-bottom: 12px;
          animation: trackFadeUp 0.45s ease;
        }

        body.dark-mode .track1-timeline-step {
          background: rgba(255, 255, 255, 0.04);
        }

        .track1-timeline-step::before {
          content: "";
          position: absolute;
          left: 28px;
          top: 0;
          bottom: -12px;
          width: 2px;
          background: linear-gradient(180deg, var(--navy-900), var(--blue-500));
        }

        .track1-timeline-step:last-child::before {
          bottom: 50%;
        }

        .track1-timeline-index {
          position: absolute;
          left: 14px;
          top: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-weight: 900;
          background: linear-gradient(135deg, #0d2145, #4b7cff);
          color: #fff;
          z-index: 1;
        }

        .track1-timeline-step p {
          margin: 0;
          color: var(--text);
          line-height: 1.7;
        }

        .track1-alert,
        .track1-error {
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.35);
          color: #b91c1c;
          margin-top: 16px;
          animation: trackFadeUp 0.45s ease;
        }

        @keyframes trackFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ── Track1 photo hero ──────────────────── */
        .track1-photo-hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
          padding: 44px 40px;
          border-radius: 28px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.97);
          box-shadow: 0 8px 36px rgba(14,38,84,0.08);
          overflow: hidden;
          position: relative;
          margin-bottom: 28px;
        }

        body.dark-mode .track1-photo-hero { background: rgba(10,20,42,0.82); }

        .track1-photo-hero::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 5px;
          background: linear-gradient(90deg, #0d2145, #2f6bff, #5a92ff);
        }

        .track1-hero-copy { display: flex; flex-direction: column; gap: 20px; }

        .track1-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          background: rgba(47,107,255,.1);
          color: var(--navy-800);
          width: fit-content;
        }

        .track1-hero-title {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          color: var(--navy-900);
          line-height: 1.05;
          letter-spacing: -.03em;
        }

        .track1-hero-sub {
          margin: 0;
          color: var(--text);
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 46ch;
        }

        .track1-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }

        .track1-hero-visual {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4/3;
          box-shadow: 0 16px 48px rgba(14,38,84,.14);
        }

        .track1-hero-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .track1-hero-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(10,25,60,.18));
        }

        @media (max-width: 900px) {
          .track1-grid,
          .track1-grid-3,
          .track1-metrics {
            grid-template-columns: 1fr;
          }

          .track1-page {
            padding: 100px 18px 50px;
          }

          .track1-photo-hero {
            grid-template-columns: 1fr;
          }

          .track1-hero-visual {
            aspect-ratio: 16/7;
          }
        }
      `}),i.jsxs("div",{className:"track1-shell",children:[i.jsxs("div",{className:"track1-photo-hero reveal",children:[i.jsxs("div",{className:"track1-hero-copy",children:[i.jsx("span",{className:"track1-hero-eyebrow",children:o?"Track A · Startup Review":"Track A · Startup Evaluation"}),i.jsx("h1",{className:"track1-hero-title",children:o?"Startup Review Dashboard":"Validate your idea with clarity"}),i.jsx("p",{className:"track1-hero-sub",children:o?"Review the final Track A analysis with market, MVP, operations, finance, and legal insights.":"Fill in your startup details, run the full AI pipeline, and get a clear picture of market fit, risks, MVP direction, and legal readiness."}),i.jsxs("div",{className:"track1-hero-actions",children:[!o&&i.jsx("a",{href:"#services",className:"t3-secondary-btn",style:{textDecoration:"none"},children:"← Back to Tracks"}),o&&i.jsx("button",{className:"track1-btn secondary",type:"button",onClick:()=>{window.location.hash="#services"},children:"← Back to Tracks"})]})]}),i.jsx("div",{className:"track1-hero-visual",children:i.jsx("img",{src:"https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=900&q=75",alt:"Founders analysing startup idea and data",loading:"lazy"})})]}),!o&&i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"track1-hint",children:[i.jsx("strong",{children:"Tip:"})," Keep the idea practical and concrete. Mention what the startup does, who it serves, and how it works."]}),i.jsxs("section",{className:"track1-form-card",children:[i.jsx("h2",{children:"Core startup idea"}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(Ne,{label:"Startup idea",children:i.jsx("textarea",{value:e.startup_idea,onChange:T=>p("startup_idea",T.target.value)})}),i.jsx(Ne,{label:"Idea description",children:i.jsx("textarea",{value:e.idea_description,onChange:T=>p("idea_description",T.target.value)})}),i.jsx(Ne,{label:"Problem",children:i.jsx("textarea",{value:e.problem,onChange:T=>p("problem",T.target.value)})}),i.jsx(Ne,{label:"How it works in one sentence",children:i.jsx("textarea",{value:e.how_it_works_one_sentence,onChange:T=>p("how_it_works_one_sentence",T.target.value)})})]})]}),i.jsxs("section",{className:"track1-form-card",children:[i.jsx("h2",{children:"Market and customer"}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(Ne,{label:"Target customer type",children:i.jsx("select",{value:e.target_type,onChange:T=>p("target_type",T.target.value),children:Ix.map(T=>i.jsx("option",{children:T},T))})}),i.jsx(Ne,{label:"Target customer location",children:i.jsx("input",{value:e.target_location,onChange:T=>p("target_location",T.target.value)})}),i.jsx(Ne,{label:"Industry",children:i.jsx("select",{value:e.industry,onChange:T=>p("industry",T.target.value),children:Lx.map(T=>i.jsx("option",{children:T},T))})}),i.jsx(Ne,{label:"Product type",children:i.jsx("select",{value:e.product_type,onChange:T=>p("product_type",T.target.value),children:$x.map(T=>i.jsx("option",{children:T},T))})}),i.jsx(Ne,{label:"Target customer notes",children:i.jsx("textarea",{value:e.target_notes,onChange:T=>p("target_notes",T.target.value)})})]})]}),i.jsxs("section",{className:"track1-form-card",children:[i.jsx("h2",{children:"Business model"}),i.jsxs("div",{className:"track1-grid-3",children:[i.jsx(Ne,{label:"Revenue model",children:i.jsx("input",{value:e.revenue_model,onChange:T=>p("revenue_model",T.target.value)})}),i.jsx(Ne,{label:"Who pays",children:i.jsx("input",{value:e.who_pays,onChange:T=>p("who_pays",T.target.value)})}),i.jsx(Ne,{label:"When paid",children:i.jsx("input",{value:e.when_paid,onChange:T=>p("when_paid",T.target.value)})})]})]}),i.jsxs("section",{className:"track1-form-card",children:[i.jsx("h2",{children:"Team members"}),r.map((T,Q)=>i.jsxs("div",{className:"track1-grid",style:{marginBottom:12},children:[i.jsx(Ne,{label:`Role ${Q+1}`,children:i.jsx("input",{value:T.role,onChange:B=>v(Q,"role",B.target.value)})}),i.jsx(Ne,{label:`Skills ${Q+1}`,children:i.jsx("input",{value:T.skills,onChange:B=>v(Q,"skills",B.target.value)})})]},Q)),i.jsx("button",{className:"track1-btn secondary",type:"button",onClick:y,children:"Add member"})]}),i.jsxs("section",{className:"track1-form-card",children:[i.jsx("h2",{children:"Finance assumptions"}),i.jsxs("div",{className:"track1-grid-3",children:[i.jsx(Ne,{label:"Price per sale",children:i.jsx("input",{value:e.price_per_sale,onChange:T=>p("price_per_sale",T.target.value)})}),i.jsx(Ne,{label:"Sales target per month",children:i.jsx("input",{type:"number",value:e.sales_target_per_month,onChange:T=>p("sales_target_per_month",T.target.value)})}),i.jsx(Ne,{label:"Gain on sale %",children:i.jsx("input",{type:"number",value:e.gain_on_sale_pct,onChange:T=>p("gain_on_sale_pct",T.target.value)})}),i.jsx(Ne,{label:"Months",children:i.jsx("input",{value:e.months,onChange:T=>p("months",T.target.value)})}),i.jsx(Ne,{label:"Initial budget TND",children:i.jsx("input",{type:"number",value:e.initial_budget_tnd,onChange:T=>p("initial_budget_tnd",T.target.value)})})]}),i.jsx("div",{className:"track1-actions",children:i.jsx("button",{className:"track1-btn",type:"button",onClick:x,disabled:s,children:s?"Running full pipeline...":"Run Full Pipeline"})}),c&&i.jsx("div",{className:"track1-error",children:c})]})]}),o&&i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"track1-tabs",children:Dx.map(T=>i.jsx("button",{className:`track1-tab ${d===T?"active":""}`,onClick:()=>h(T),children:T},T))}),d==="Overview"&&i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"track1-metrics",children:[i.jsx(dt,{label:"Promising",value:C.is_startup_promising,tone:dr(C.is_startup_promising)}),i.jsx(dt,{label:"Feasible",value:C.is_feasible,tone:dr(C.is_feasible)}),i.jsx(dt,{label:"Market Status",value:f.status,tone:dr(f.status)}),i.jsx(dt,{label:"Legal Risk",value:j.risk_level,tone:Id(j.risk_level)})]}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(Wt,{title:"Idea",children:N.idea}),i.jsx(Wt,{title:"Problem",children:N.problem}),i.jsx(Wt,{title:"How It Works",children:N.how_it_works}),i.jsx(Wt,{title:"Target Customer",children:N.target_customer}),i.jsx(Wt,{title:"Business Model",children:N.business_model})]}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(De,{title:"Main Strengths",items:C.main_strengths,tone:"green"}),i.jsx(De,{title:"Main Weaknesses",items:C.main_weaknesses,tone:"red"})]}),i.jsx(De,{title:"Recommended Next Steps",items:C.recommended_next_steps,tone:"blue"})]}),d==="Market"&&i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"track1-metrics",children:[i.jsx(dt,{label:"Existence Risk Score",value:f.existence_risk_score,tone:"amber"}),i.jsx(dt,{label:"Innovation Score",value:f.innovation_score,tone:"green"}),i.jsx(dt,{label:"Confidence",value:f.confidence,tone:dr(f.confidence)}),i.jsx(dt,{label:"Status",value:f.status,tone:dr(f.status)})]}),i.jsx(Wt,{title:`Status: ${f.status||"N/A"}`,tone:dr(f.status),children:f.summary}),i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:"Relevant Existing Solutions"}),(f.relevant_existing_solutions||[]).map((T,Q)=>i.jsx(Bx,{item:T},Q))]}),i.jsx(De,{title:"Uncertainty Notes",items:f.uncertainty_notes,tone:"amber"})]}),d==="MVP"&&i.jsxs(i.Fragment,{children:[i.jsx(Wt,{title:"MVP Summary",tone:"blue",children:g.mvp_summary}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(De,{title:"Must Haves",items:g.must_haves,tone:"blue"}),i.jsx(De,{title:"Acceptance Criteria",items:g.acceptance_criteria,tone:"green"})]}),i.jsx(Vx,{title:"User Journey",items:g.user_journey}),i.jsx(De,{title:"Out of Scope",items:g.out_of_scope,tone:"red"})]}),d==="Operations"&&i.jsxs(i.Fragment,{children:[i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:"Minimum Roles & Responsibilities"}),i.jsx("div",{className:"track1-grid-3",children:(m.minimum_roles_responsibilities||[]).map((T,Q)=>i.jsx(Wx,{item:T,linkedFinance:q[String(T.role||"").toLowerCase()]},Q))})]}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(De,{title:"Materials & Equipment",items:m.materials_equipment,tone:"cyan"}),i.jsx(De,{title:"Tools Stack",items:m.tools_stack,tone:"purple"})]}),i.jsx(De,{title:"Operational Notes",items:m.important_operational_notes,tone:"blue"})]}),d==="Finance"&&i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"track1-metrics",children:[i.jsx(dt,{label:"Expected Monthly Revenue",value:((z=k.expected_monthly_revenue)==null?void 0:z.value)||k.expected_monthly_revenue,tone:"green"}),i.jsx(dt,{label:"Payback Months",value:((K=k.payback_months)==null?void 0:K.value)||k.payback_months,tone:"amber"}),i.jsx(dt,{label:"Suggested Price",value:((b=k.suggested_price)==null?void 0:b.range_tnd)||k.suggested_price,tone:"blue"})]}),i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:"Employees & Wage Ranges"}),J.map((T,Q)=>i.jsx(Hx,{item:T,globalMax:we},Q))]}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(wa,{title:"Tools / Materials / Ops Costs",data:k.tools_materials_ops_costs,tone:"cyan"}),i.jsx(wa,{title:"Monthly Costs",data:k.monthly_costs,tone:"amber"}),i.jsx(wa,{title:"One-Time Costs",data:k.one_time_costs,tone:"purple"}),i.jsx(wa,{title:"Price Realism",data:k.price_realism,tone:"blue"})]}),i.jsx(De,{title:"Missing / Uncertain Finance Parts",items:k.missing_or_uncertain_parts,tone:"red"})]}),d==="Legal"&&i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"track1-metrics",children:i.jsx(dt,{label:"Legal Risk Level",value:j.risk_level,tone:Id(j.risk_level)})}),i.jsx(Wt,{title:"Legal Review Note",tone:"amber",children:"This section should be treated as a practical compliance watchlist, not final legal advice."}),i.jsx(De,{title:"Compliance Checklist",items:j.legal_compliance_checklist,tone:"red"}),i.jsx(De,{title:"Trust Requirements",items:j.trust_requirements,tone:"blue"}),i.jsx(De,{title:"Operational Constraints",items:j.special_operational_constraints,tone:"amber"}),i.jsx(De,{title:"Filtered Summary",items:j.filtered_summary,tone:"purple"}),i.jsx(De,{title:"Uncertainty Flags",items:S,tone:"amber"})]})]})]})]})}const Kx="http://127.0.0.1:5055",Gx=`${Kx}/track1/report`,Jx=["Overview","Market","MVP","Operations","Finance","Legal"];function sr(e){const t={green:"#22c55e",red:"#ef4444",amber:"#f59e0b",blue:"#38bdf8",purple:"#8b5cf6",cyan:"#06b6d4",slate:"#94a3b8"};return t[e]||t.blue}function hr(e){const t=String(e||"").trim().toLowerCase();return["yes","high","appears original"].includes(t)?"green":["uncertain","medium","partially exists"].includes(t)?"amber":["no","low","already exists"].includes(t)?"red":"blue"}function Ud(e){const t=String(e||"").trim().toLowerCase();return t==="high"?"red":t==="medium"?"amber":t==="low"?"green":"blue"}function Pf(e){const t=String(e||"").trim().toLowerCase();return t==="critical"?"red":t==="important"?"amber":t==="useful"?"blue":"slate"}function Of(e){return String(e).replaceAll("_"," ").replace(/\b\w/g,t=>t.toUpperCase())}function Sl(e){return e==null||e===""||e==="missing_info"||e==="missing"||e==="N/A"}function kt(e){return Sl(e)?"N/A":typeof e=="string"||typeof e=="number"||typeof e=="boolean"?String(e):Array.isArray(e)?e.map(t=>kt(t)).join(`
`):typeof e=="object"?Object.entries(e).map(([t,r])=>`${Of(t)}: ${kt(r)}`).join(`
`):String(e)}function Lf(e){const r=String(e||"").match(/\d+(?:\.\d+)?/g);return!r||r.length===0?null:r.length===1?[Number(r[0]),Number(r[0])]:[Number(r[0]),Number(r[1])]}function Yx(e=[]){const t=e.map(r=>Lf(r==null?void 0:r.salary_or_range)).filter(Boolean).map(r=>r[1]);return t.length?Math.max(...t):1}function Nc({children:e,tone:t="blue"}){const r=sr(t);return i.jsx("span",{className:"track1-pill",style:{color:r,background:`${r}20`,borderColor:`${r}66`},children:e})}function ht({label:e,value:t,tone:r}){const n=r||hr(t),s=sr(n);return i.jsxs("div",{className:"track1-metric",style:{background:`linear-gradient(135deg, ${s}18 0%, rgba(255,255,255,0.96) 55%, #f8fbff 100%)`,borderColor:`${s}40`},children:[i.jsx("span",{children:e}),i.jsx("strong",{children:kt(t)})]})}function $t({title:e,children:t,tone:r="blue"}){const n=sr(r);return i.jsxs("div",{className:"track1-card",style:{borderLeft:`4px solid ${n}`},children:[i.jsx("h3",{children:e}),i.jsx("p",{className:"track1-muted",children:kt(t)})]})}function Fe({title:e,items:t,tone:r="blue"}){const n=sr(r),s=Array.isArray(t)?t:t?[t]:[];return i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:e}),s.length===0?i.jsx("div",{className:"track1-card",children:i.jsx("p",{className:"track1-muted",children:"No data."})}):s.map((a,o)=>i.jsx("div",{className:Sl(a)?"track1-alert danger":"track1-card",style:Sl(a)?{}:{borderLeft:`4px solid ${n}`},children:i.jsx("p",{className:"track1-muted",children:kt(a)})},o))]})}function Qx({label:e,value:t,globalMax:r=1,tone:n="blue"}){const s=Lf(t),a=sr(n);if(!s)return i.jsxs("p",{className:"track1-muted",children:[i.jsxs("strong",{children:[e,":"]})," ",kt(t)]});const[o,l]=s,c=Math.min(o/r*100,100),u=Math.max((l-o)/r*100,4);return i.jsxs("div",{className:"track1-range-wrap",children:[i.jsxs("div",{className:"track1-small-line",children:[i.jsx("strong",{children:e})," — ",t]}),i.jsx("div",{className:"track1-range-track",children:i.jsx("div",{className:"track1-range-bar",style:{left:`${c}%`,width:`${u}%`,background:a}})})]})}function Xx({item:e}){const t=(e==null?void 0:e.relevance_confidence)||"Medium",r=hr(t);return i.jsxs("div",{className:"track1-card",style:{borderLeft:`4px solid ${sr(r)}`},children:[i.jsx("h3",{children:(e==null?void 0:e.company_name)||"Unknown solution"}),i.jsx("div",{className:"track1-pill-row",children:i.jsxs(Nc,{tone:r,children:["Confidence: ",t]})}),i.jsxs("p",{className:"track1-muted",children:[i.jsx("strong",{children:"What it does:"})," ",kt(e==null?void 0:e.what_it_does)]}),i.jsxs("p",{className:"track1-muted",children:[i.jsx("strong",{children:"Similarity:"})," ",kt(e==null?void 0:e.similarity_to_startup)]})]})}function Zx({item:e,linkedFinance:t}){const r=(e==null?void 0:e.necessity_level)||(t==null?void 0:t.necessity_level)||"uncertain",n=Pf(r);return i.jsxs("div",{className:"track1-card role-card",style:{borderTop:`4px solid ${sr(n)}`},children:[i.jsx("h3",{children:(e==null?void 0:e.role)||"Unknown role"}),i.jsx("div",{className:"track1-pill-row",children:i.jsx(Nc,{tone:n,children:r})}),i.jsx("p",{className:"track1-muted",children:kt((e==null?void 0:e.responsibility_or_description)||(e==null?void 0:e.why_needed))})]})}function ek({item:e,globalMax:t}){const r=Pf(e==null?void 0:e.necessity_level);return i.jsxs("div",{className:"track1-card",style:{borderLeft:`4px solid ${sr(r)}`},children:[i.jsx("h3",{children:(e==null?void 0:e.role)||"Unknown role"}),i.jsx("div",{className:"track1-pill-row",children:i.jsx(Nc,{tone:r,children:(e==null?void 0:e.necessity_level)||"uncertain"})}),i.jsxs("p",{className:"track1-muted",children:[i.jsx("strong",{children:"Why needed:"})," ",kt(e==null?void 0:e.why_needed)]}),i.jsx(Qx,{label:"Salary Range",value:e==null?void 0:e.salary_or_range,globalMax:t,tone:r})]})}function _a({title:e,data:t,tone:r="blue"}){const n=sr(r);return!t||typeof t!="object"||Array.isArray(t)?i.jsx($t,{title:e,tone:r,children:t}):i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:e}),Object.entries(t).map(([s,a])=>i.jsxs("div",{className:"track1-card",style:{borderLeft:`4px solid ${n}`},children:[i.jsx("h3",{children:Of(s)}),i.jsx("p",{className:"track1-muted",children:kt(a)})]},s))]})}function tk({title:e,items:t}){const r=Array.isArray(t)?t:t?[t]:[];return i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:e}),r.length===0?i.jsx("div",{className:"track1-card",children:i.jsx("p",{className:"track1-muted",children:"No data."})}):r.map((n,s)=>i.jsxs("div",{className:"track1-timeline-step",children:[i.jsx("span",{className:"track1-timeline-index",children:s+1}),i.jsx("p",{children:kt(n)})]},s))]})}function rk(){var k,j,C;const[e,t]=I.useState(null),[r,n]=I.useState(""),[s,a]=I.useState(!0),[o,l]=I.useState("Overview");I.useEffect(()=>{async function S(){try{const $=await fetch(Gx),q=await $.json();!$.ok||q.error?n(q.error||"Could not load saved report."):t(q)}catch{n("Could not connect to Track1 backend.")}finally{a(!1)}}S()},[]);const c=(e==null?void 0:e.startup_summary)||{},u=(e==null?void 0:e.market_existence)||{},d=(e==null?void 0:e.mvp)||{},h=(e==null?void 0:e.operations)||{},p=(e==null?void 0:e.finance)||{},v=(e==null?void 0:e.legal_and_compliance)||{},y=(e==null?void 0:e.final_verdict)||{},x=(e==null?void 0:e.uncertainty_flags)||[],N=(p==null?void 0:p.employees_and_wages)||[],f=Object.fromEntries(N.map(S=>[String(S.role||"").toLowerCase(),S])),g=[...N].sort((S,$)=>{const q={critical:0,important:1,useful:2,uncertain:3};return(q[String(S.necessity_level||"").toLowerCase()]??99)-(q[String($.necessity_level||"").toLowerCase()]??99)}),m=Yx(g);return i.jsxs("main",{className:"track1-page",children:[i.jsx("style",{children:`
  .track1-page {
    min-height: 100vh;
    padding: 120px 6vw 70px;
    background:
      radial-gradient(circle at top left, rgba(62, 106, 225, 0.18), transparent 28%),
      radial-gradient(circle at 85% 10%, rgba(15, 37, 84, 0.12), transparent 22%),
      linear-gradient(180deg, #f6f9ff 0%, #eef3fb 100%);
    color: var(--navy-900);
  }

  body.dark-mode .track1-page {
    background:
      radial-gradient(circle at top left, rgba(75, 124, 255, 0.14), transparent 24%),
      radial-gradient(circle at 80% 12%, rgba(75, 124, 255, 0.1), transparent 18%),
      linear-gradient(180deg, #071224 0%, #0a1730 100%);
    color: #eff4ff;
  }

  .track1-shell {
    width: min(1220px, calc(100% - 28px));
    margin: 0 auto;
  }

  .track1-hero {
    padding: 30px;
    border-radius: 30px;
    background: rgba(255, 255, 255, 0.86);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    margin-bottom: 22px;
    animation: trackFadeUp 0.45s ease;
  }

  body.dark-mode .track1-hero {
    background: rgba(255, 255, 255, 0.04);
  }

  .track1-eyebrow {
    color: #6b7e9c;
    text-transform: uppercase;
    font-size: 0.78rem;
    letter-spacing: 0.05em;
    font-weight: 800;
    margin-bottom: 10px;
  }

  body.dark-mode .track1-eyebrow {
    color: #9db2d3;
  }

  .track1-hero h1 {
    font-family: "Space Grotesk", sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    line-height: 0.98;
    margin: 0 0 16px;
    color: var(--navy-900);
  }

  .track1-hero p {
    color: var(--text);
    max-width: 760px;
    font-size: 1.05rem;
    line-height: 1.7;
  }

  .track1-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 18px;
  }

  .track1-tab {
    border-radius: 999px;
    border: 1px solid var(--border);
    background: rgba(255, 255, 255, 0.9);
    color: var(--navy-900);
    padding: 10px 16px;
    cursor: pointer;
    font-weight: 800;
    transition: transform 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease, color 0.35s ease, border-color 0.35s ease;
  }

  body.dark-mode .track1-tab {
    background: rgba(255, 255, 255, 0.04);
  }

  .track1-tab:hover {
    transform: translateY(-2px);
    border-color: rgba(75, 124, 255, 0.45);
  }

  .track1-tab.active {
    color: #fff;
    border-color: transparent;
    background: linear-gradient(135deg, #0d2145, #4b7cff);
    box-shadow: 0 16px 34px rgba(29, 77, 145, 0.28);
  }

  .track1-metrics {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 18px;
  }

  .track1-metric {
    padding: 18px;
    border-radius: 22px;
    border: 1px solid var(--border);
    min-height: 120px;
    box-shadow: var(--shadow-md);
    animation: trackFadeUp 0.45s ease;
    transition: transform 0.35s ease, box-shadow 0.35s ease;
  }

  .track1-metric:hover,
  .track1-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 28px 64px rgba(10, 32, 73, 0.14);
  }

  .track1-metric span {
    display: block;
    color: var(--text);
    margin-bottom: 8px;
  }

  .track1-metric strong {
    display: block;
    color: var(--navy-900);
    font-family: "Space Grotesk", sans-serif;
    font-size: 1.65rem;
    line-height: 1.05;
    white-space: pre-wrap;
  }

  .track1-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .track1-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }

  .track1-card {
    padding: 22px;
    border-radius: 28px;
    background: rgba(255, 255, 255, 0.84);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    margin-bottom: 18px;
    color: var(--text);
    animation: trackFadeUp 0.45s ease;
    transition: transform 0.35s ease, box-shadow 0.35s ease, background-color 0.35s ease, border-color 0.35s ease;
  }

  body.dark-mode .track1-card {
    background: rgba(255, 255, 255, 0.04);
  }

  .track1-card h3,
  .track1-section h2 {
    margin: 0 0 14px;
    font-family: "Space Grotesk", sans-serif;
    color: var(--navy-900);
  }

  .track1-muted {
    color: var(--text);
    margin: 0;
    line-height: 1.7;
    white-space: pre-wrap;
  }

  .track1-section {
    margin-bottom: 18px;
  }

  .track1-pill-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .track1-pill {
    display: inline-block;
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 800;
    border: 1px solid;
    text-transform: capitalize;
  }

  .track1-kv-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 14px;
  }

  .track1-kv {
    padding: 12px;
    border-radius: 16px;
    background: rgba(18, 51, 100, 0.05);
    border: 1px solid var(--border);
  }

  body.dark-mode .track1-kv {
    background: rgba(255, 255, 255, 0.05);
  }

  .track1-kv span {
    display: block;
    color: #6b7e9c;
    font-size: 0.82rem;
    margin-bottom: 5px;
  }

  body.dark-mode .track1-kv span {
    color: #9db2d3;
  }

  .track1-kv strong {
    color: var(--navy-900);
    font-weight: 600;
    white-space: pre-wrap;
  }

  .track1-range-wrap {
    margin-top: 14px;
  }

  .track1-small-line {
    color: var(--text);
    font-size: 0.92rem;
    margin-bottom: 8px;
  }

  .track1-range-track {
    position: relative;
    height: 14px;
    border-radius: 999px;
    background: rgba(18, 51, 100, 0.1);
    overflow: hidden;
  }

  body.dark-mode .track1-range-track {
    background: rgba(255, 255, 255, 0.12);
  }

  .track1-range-bar {
    position: absolute;
    top: 0;
    height: 14px;
    border-radius: 999px;
  }

  .track1-timeline-step {
    position: relative;
    padding: 16px 18px 16px 56px;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.84);
    border: 1px solid var(--border);
    box-shadow: var(--shadow-md);
    margin-bottom: 12px;
    animation: trackFadeUp 0.45s ease;
  }

  body.dark-mode .track1-timeline-step {
    background: rgba(255, 255, 255, 0.04);
  }

  .track1-timeline-step::before {
    content: "";
    position: absolute;
    left: 28px;
    top: 0;
    bottom: -12px;
    width: 2px;
    background: linear-gradient(180deg, var(--navy-900), var(--blue-500));
  }

  .track1-timeline-step:last-child::before {
    bottom: 50%;
  }

  .track1-timeline-index {
    position: absolute;
    left: 14px;
    top: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-weight: 900;
    background: linear-gradient(135deg, #0d2145, #4b7cff);
    color: #fff;
    z-index: 1;
  }

  .track1-timeline-step p {
    margin: 0;
    color: var(--text);
    line-height: 1.7;
  }

  .track1-alert {
    padding: 16px;
    border-radius: 18px;
    margin-bottom: 12px;
    animation: trackFadeUp 0.45s ease;
  }

  .track1-alert.danger {
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
    color: #b91c1c;
  }

  .track1-error {
    padding: 14px 16px;
    border-radius: 16px;
    background: rgba(239, 68, 68, 0.12);
    border: 1px solid rgba(239, 68, 68, 0.35);
    color: #b91c1c;
    margin-top: 16px;
  }

  @keyframes trackFadeUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 900px) {
    .track1-grid,
    .track1-grid-3,
    .track1-metrics,
    .track1-kv-grid {
      grid-template-columns: 1fr;
    }

    .track1-page {
      padding: 100px 18px 50px;
    }
  }
`}),i.jsxs("div",{className:"track1-shell",children:[i.jsxs("section",{className:"track1-hero",children:[i.jsx("div",{className:"track1-eyebrow",children:"Track 1 · Saved Report"}),i.jsx("h1",{children:"Startup Review Dashboard"}),i.jsx("p",{children:"This page shows the saved Track1 report without rerunning the pipeline."})]}),s&&i.jsx($t,{title:"Loading",children:"Loading saved report..."}),r&&i.jsx("div",{className:"track1-error",children:r}),e&&i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"track1-tabs",children:Jx.map(S=>i.jsx("button",{className:`track1-tab ${o===S?"active":""}`,onClick:()=>l(S),children:S},S))}),o==="Overview"&&i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"track1-metrics",children:[i.jsx(ht,{label:"Promising",value:y.is_startup_promising,tone:hr(y.is_startup_promising)}),i.jsx(ht,{label:"Feasible",value:y.is_feasible,tone:hr(y.is_feasible)}),i.jsx(ht,{label:"Market Status",value:u.status,tone:hr(u.status)}),i.jsx(ht,{label:"Legal Risk",value:v.risk_level,tone:Ud(v.risk_level)})]}),i.jsxs("div",{className:"track1-grid",children:[i.jsx($t,{title:"Idea",children:c.idea}),i.jsx($t,{title:"Problem",children:c.problem}),i.jsx($t,{title:"How It Works",children:c.how_it_works}),i.jsx($t,{title:"Target Customer",children:c.target_customer}),i.jsx($t,{title:"Business Model",children:c.business_model})]}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(Fe,{title:"Main Strengths",items:y.main_strengths,tone:"green"}),i.jsx(Fe,{title:"Main Weaknesses",items:y.main_weaknesses,tone:"red"})]}),i.jsx(Fe,{title:"Recommended Next Steps",items:y.recommended_next_steps,tone:"blue"})]}),o==="Market"&&i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"track1-metrics",children:[i.jsx(ht,{label:"Existence Risk Score",value:u.existence_risk_score,tone:"amber"}),i.jsx(ht,{label:"Innovation Score",value:u.innovation_score,tone:"green"}),i.jsx(ht,{label:"Confidence",value:u.confidence,tone:hr(u.confidence)}),i.jsx(ht,{label:"Status",value:u.status,tone:hr(u.status)})]}),i.jsx($t,{title:`Status: ${u.status||"N/A"}`,tone:hr(u.status),children:u.summary}),i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:"Relevant Existing Solutions"}),(u.relevant_existing_solutions||[]).map((S,$)=>i.jsx(Xx,{item:S},$))]}),i.jsx(Fe,{title:"Uncertainty Notes",items:u.uncertainty_notes,tone:"amber"})]}),o==="MVP"&&i.jsxs(i.Fragment,{children:[i.jsx($t,{title:"MVP Summary",tone:"blue",children:d.mvp_summary}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(Fe,{title:"Must Haves",items:d.must_haves,tone:"blue"}),i.jsx(Fe,{title:"Acceptance Criteria",items:d.acceptance_criteria,tone:"green"})]}),i.jsx(tk,{title:"User Journey",items:d.user_journey}),i.jsx(Fe,{title:"Out of Scope",items:d.out_of_scope,tone:"red"})]}),o==="Operations"&&i.jsxs(i.Fragment,{children:[i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:"Minimum Roles & Responsibilities"}),i.jsx("div",{className:"track1-grid-3",children:(h.minimum_roles_responsibilities||[]).map((S,$)=>i.jsx(Zx,{item:S,linkedFinance:f[String(S.role||"").toLowerCase()]},$))})]}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(Fe,{title:"Materials & Equipment",items:h.materials_equipment,tone:"cyan"}),i.jsx(Fe,{title:"Tools Stack",items:h.tools_stack,tone:"purple"})]}),i.jsx(Fe,{title:"Operational Notes",items:h.important_operational_notes,tone:"blue"})]}),o==="Finance"&&i.jsxs(i.Fragment,{children:[i.jsxs("div",{className:"track1-metrics",children:[i.jsx(ht,{label:"Expected Monthly Revenue",value:((k=p.expected_monthly_revenue)==null?void 0:k.value)||p.expected_monthly_revenue,tone:"green"}),i.jsx(ht,{label:"Payback Months",value:((j=p.payback_months)==null?void 0:j.value)||p.payback_months,tone:"amber"}),i.jsx(ht,{label:"Suggested Price",value:((C=p.suggested_price)==null?void 0:C.range_tnd)||p.suggested_price,tone:"blue"})]}),i.jsxs("section",{className:"track1-section",children:[i.jsx("h2",{children:"Employees & Wage Ranges"}),g.map((S,$)=>i.jsx(ek,{item:S,globalMax:m},$))]}),i.jsxs("div",{className:"track1-grid",children:[i.jsx(_a,{title:"Tools / Materials / Ops Costs",data:p.tools_materials_ops_costs,tone:"cyan"}),i.jsx(_a,{title:"Monthly Costs",data:p.monthly_costs,tone:"amber"}),i.jsx(_a,{title:"One-Time Costs",data:p.one_time_costs,tone:"purple"}),i.jsx(_a,{title:"Price Realism",data:p.price_realism,tone:"blue"})]}),i.jsx(Fe,{title:"Missing / Uncertain Finance Parts",items:p.missing_or_uncertain_parts,tone:"red"})]}),o==="Legal"&&i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"track1-metrics",children:i.jsx(ht,{label:"Legal Risk Level",value:v.risk_level,tone:Ud(v.risk_level)})}),i.jsx($t,{title:"Legal Review Note",tone:"amber",children:"This section should be treated as a practical compliance watchlist, not final legal advice."}),i.jsx(Fe,{title:"Compliance Checklist",items:v.legal_compliance_checklist,tone:"red"}),i.jsx(Fe,{title:"Trust Requirements",items:v.trust_requirements,tone:"blue"}),i.jsx(Fe,{title:"Operational Constraints",items:v.special_operational_constraints,tone:"amber"}),i.jsx(Fe,{title:"Filtered Summary",items:v.filtered_summary,tone:"purple"}),i.jsx(Fe,{title:"Uncertainty Flags",items:x,tone:"amber"})]})]})]})]})}const zd="http://127.0.0.1:5057";let an=null;async function mo(){if(an)return an;const e=[zd,"http://127.0.0.1:5057","http://127.0.0.1:5060","http://127.0.0.1:5058","http://127.0.0.1:5059"];for(const t of e)try{if((await fetch(`${t}/health`,{method:"GET"})).ok)return an=t,an}catch{}return an=zd,an}const nk={startup_profile:{startup_name:"",sector:"",activity_description:"",founders_count:"",funding_need_tnd:"",wants_investors:!1,needs_limited_liability:!0,has_foreign_investors:!1,innovative:!1,scalable:!1,uses_technology:!1,associates:[{name:"",role:"Founder",equity_pct:100,active:!0}]},documents:[],label_input:{startup_name:"",transcript:"",slide_text:"",sector:"",traction_signals:[],team_signals:[],pitch_notes:[]},options:{strict_mode:!0,generate_json_report:!0,generate_pdf_report:!1,report_prefix:"track_b_template_run"}},sk=[{number:"01",title:"Legal structure",text:"Recommended form, liability fit, investor readiness, and founder setup."},{number:"02",title:"Document evidence",text:"Mandatory files, missing documents, upload quality, and strict-mode blockers."},{number:"03",title:"Decision package",text:"Final decision, legal score, risk level, and committee-ready summary."},{number:"04",title:"Market access",text:"Google, LinkedIn, Facebook, and event links for ecosystem follow-up."}],ak=[{id:"decision",label:"Decision"},{id:"documents",label:"Documents"},{id:"roadmap",label:"Roadmap"},{id:"opportunities",label:"Opportunities"}],ik=[["wants_investors","Investors"],["has_foreign_investors","Foreign investors"],["innovative","Innovative"],["scalable","Scalable"],["uses_technology","Technology"]];function Dd(e){return String(e||"").split(`
`).map(t=>t.trim()).filter(Boolean)}function ok(e){const t=String(e||"").toLowerCase();return["pass","go","ready","good"].includes(t)?"good":["fail","no_go","blocked"].includes(t)?"danger":"warn"}function Fd(e){return e>=75?"good":e>=45?"warn":"danger"}function Md(e){var r,n,s,a;return(((n=(r=e.agent_search)==null?void 0:r.results)==null?void 0:n.length)||0)>0?{label:"Found",tone:"good"}:((s=e.agent_search)==null?void 0:s.status)==="unavailable"?{label:"Checked",tone:"info"}:(a=e.agent_search)!=null&&a.status?{label:"Checked",tone:"info"}:{label:"Pending",tone:"warn"}}function lk(e){return e==="LinkedIn"?"The agent checked the public web but did not find a verified LinkedIn page.":e==="Facebook"?"The agent checked the public web but did not find a verified Facebook page.":e==="Events"?"The agent checked the public web but did not find a relevant event page.":"The agent checked the public web but did not find a verified official page."}function _t({label:e,children:t}){return i.jsxs("label",{className:"track2-field",children:[i.jsx("span",{children:e}),t]})}function lr({label:e,value:t,tone:r="info"}){return i.jsxs("div",{className:`track2-metric ${r}`,children:[i.jsx("span",{children:e}),i.jsx("strong",{children:t??"N/A"})]})}function es({title:e,text:t}){return i.jsxs("div",{className:"track2-empty",children:[i.jsx("strong",{children:e}),i.jsx("p",{children:t})]})}function ck({track:e}){var Pt,Hn,He;const[t,r]=I.useState(nk),[n,s]=I.useState(""),[a,o]=I.useState(!1),[l,c]=I.useState(!1),[u,d]=I.useState(!1),[h,p]=I.useState([]),[v,y]=I.useState(""),[x,N]=I.useState(null),[f,g]=I.useState("case"),m=(_,G)=>{r(ee=>({...ee,startup_profile:{...ee.startup_profile,[_]:G},label_input:_==="startup_name"||_==="sector"?{...ee.label_input,[_]:G}:ee.label_input}))},k=(_,G)=>{r(ee=>({...ee,label_input:{...ee.label_input,[_]:G}}))},j=(_,G)=>{k(_,Dd(G))},C=_=>{r(G=>({...G,startup_profile:{...G.startup_profile,[_]:!G.startup_profile[_]}}))},S=I.useMemo(()=>Dd(n).map(_=>{const[G,ee]=_.split("|").map(xe=>xe.trim());return{path:G,declared_type:ee||null}}),[n]),$=[!!t.startup_profile.startup_name.trim(),!!t.startup_profile.sector.trim(),!!t.startup_profile.activity_description.trim(),!!t.label_input.transcript.trim(),!!h.length],q=Math.round($.filter(Boolean).length/$.length*100);async function J(_){return(_.headers.get("content-type")||"").includes("application/json")?_.json():{detail:await _.text()}}async function we(){c(!0),y("");try{const _=await mo(),G=await fetch(`${_}/track2/sample`),ee=await J(G);if(!G.ok)throw new Error(ee.detail||"Unable to load sample.");r(ee),s(ee.documents.map(xe=>`${xe.path}|${xe.declared_type||""}`).join(`
`)),p(ee.documents.map(xe=>({file_name:xe.path.split(/[\\/]/).pop(),path:xe.path}))),N(null),g("case")}catch(_){y(z(_,"Unable to load sample."))}finally{c(!1)}}function z(_,G){const ee=(_==null?void 0:_.message)||"";return ee==="Failed to fetch"||_ instanceof TypeError?"Track B API is not running. Start it with: python -m uvicorn track2_api:app --host 127.0.0.1 --port 5057 --reload":ee||G}async function K(_){const G=Array.from(_.target.files||[]);if(G.length){d(!0),y("");try{const ee=new FormData;G.forEach(Bt=>ee.append("files",Bt));const xe=await mo(),ut=await fetch(`${xe}/track2/upload`,{method:"POST",body:ee}),_e=await J(ut);if(!ut.ok||_e.detail)throw new Error(typeof _e.detail=="string"?_e.detail:"Document upload failed.");const ke=_e.documents||[];p(Bt=>[...Bt,...ke]),s(Bt=>{const ir=ke.map(bt=>`${bt.path}|${bt.declared_type||""}`);return[Bt,...ir].filter(Boolean).join(`
`)})}catch(ee){y(z(ee,"Document upload failed."))}finally{d(!1),_.target.value=""}}}async function b(){if(!t.startup_profile.startup_name.trim()||!t.startup_profile.sector.trim()){y("Complete at least the startup name and sector before running the legal review.");return}o(!0),y("");try{const _=await mo(),G=await fetch(`${_}/track2/run`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...t,startup_profile:{...t.startup_profile,founders_count:Number(t.startup_profile.founders_count)||1,funding_need_tnd:Number(t.startup_profile.funding_need_tnd)||0},documents:S})}),ee=await J(G);if(!G.ok||ee.detail)throw new Error(typeof ee.detail=="string"?ee.detail:"Track B analysis failed.");N(ee),g("decision"),window.scrollTo({top:0,behavior:"smooth"})}catch(_){N(null),y(z(_,"Track B analysis failed."))}finally{o(!1)}}const T=(x==null?void 0:x.final_output)||{},Q=(x==null?void 0:x.external_research)||null,B=(x==null?void 0:x.strategic_agent)||{},O=(x==null?void 0:x.document_agent)||{},U=ok(T.final_decision||T.go_no_go),w=O.missing_documents||[],X=Number(O.overall_completeness_score??0),M=Number(O.global_risk_score??0),he=Number(B.startup_act_eligibility_score??0),pe=Number(((Pt=x==null?void 0:x.label_agent)==null?void 0:Pt.overall_score)??T.label_score??0),E=T.strict_mode&&(T.strict_fail||w.length>0||T.go_no_go==="NO_GO"),L=T.final_decision==="PASS"?"Ready to file":E?"Blocked by legal file":T.final_decision==="WARNING"?"Needs review":"Blocked",H=X>=80?"Complete":X>0?"Incomplete":"Not reviewed",ae=M>=60?"High":M>=35?"Medium":"Low",le=w.length?`${w.length} required document${w.length>1?"s":""} missing`:T.user_message||"No blocking issue returned.",Ie=(Q==null?void 0:Q.searches)||[],We=Ie.filter(_=>{var G;return!!((G=_.agent_search)!=null&&G.status||_.query)}).length,ar=Ie.reduce((_,G)=>{var ee,xe;return _+(((xe=(ee=G.agent_search)==null?void 0:ee.results)==null?void 0:xe.length)||0)},0),Wn=ar?"Links found":We?"Checked":"Pending",Js=[{title:"Complete the legal evidence pack",text:w.length?`Add ${w.slice(0,3).join(", ")}${w.length>3?"...":""}.`:"Keep the uploaded documents versioned and ready for advisor review.",status:w.length?"Priority":"Ready"},{title:"Validate the recommended structure",text:`Review the ${B.recommended_legal_form||"recommended legal form"} choice against founder liability, investment plans, and tax constraints.`,status:"Legal"},{title:"Prepare the committee narrative",text:"Use the decision summary, traction evidence, and Startup Act score to prepare the next advisor meeting.",status:"Pitch"},{title:"Run ecosystem outreach",text:"Review the direct source and event links returned by the agent, then capture the most relevant mentors, events, and investors.",status:"Growth"}],Li=[{id:"case",label:"Case"},...ak];return i.jsxs("section",{className:"section track-page track2-legal",children:[i.jsx("style",{children:`
        .track2-legal {
          padding-top: 18px;
        }

        .track2-shell {
          display: grid;
          gap: 22px;
        }

        .track2-hero {
          display: grid;
          grid-template-columns: minmax(0, 0.98fr) minmax(320px, 0.92fr);
          gap: 18px;
          align-items: stretch;
        }

        .track2-hero-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 380px;
          padding: 16px 0 22px;
        }

        .track2-kicker-row,
        .track2-tabs,
        .track2-chip-row,
        .track2-actions,
        .track2-result-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .track2-kicker {
          display: inline-flex;
          align-items: center;
          padding: 7px 11px;
          border-radius: 999px;
          border: 1px solid rgba(47, 107, 255, 0.22);
          background: rgba(47, 107, 255, 0.08);
          color: var(--blue-500);
          font-size: 0.73rem;
          font-weight: 800;
        }

        .track2-hero h1,
        .track2-result-hero h1 {
          margin: 16px 0 14px;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          line-height: 0.92;
          letter-spacing: 0;
        }

        .track2-hero h1 {
          max-width: 10ch;
          font-size: clamp(2.7rem, 6vw, 4.8rem);
        }

          .track2-hero-copy {
            min-height: auto;
          }

        .track2-result-hero h1 {
          max-width: 16ch;
          font-size: clamp(2.6rem, 5vw, 4.9rem);
        }

        .track2-hero-copy p,
        .track2-result-hero p {
          max-width: 46ch;
          margin: 0;
          color: var(--text);
          line-height: 1.62;
          font-size: 1.02rem;
        }

        .track2-actions,
        .track2-result-actions {
          margin-top: 22px;
        }

        .track2-progress {
          display: grid;
          gap: 10px;
          margin-top: 20px;
          max-width: 430px;
        }

        .track2-progress-row {
          display: flex;
          justify-content: space-between;
          color: var(--navy-800);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .track2-progress-track {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(18, 51, 100, 0.1);
        }

        .track2-progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(135deg, #102a56, #2f6bff);
        }

        .track2-roadmap {
          display: grid;
          gap: 16px;
          padding: 16px;
          border-radius: 26px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(241, 246, 255, 0.94)),
            radial-gradient(circle at 12% 12%, rgba(47, 107, 255, 0.12), transparent 32%);
          border: 1px solid rgba(255, 255, 255, 0.62);
          box-shadow: var(--shadow-md);
        }

        body.dark-mode .track2-roadmap {
          background: rgba(255, 255, 255, 0.035);
        }

        .track2-roadmap-card,
        .track2-form-card,
        .track2-result-card,
        .track2-panel {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.94);
          box-shadow: var(--shadow-md);
        }

        body.dark-mode .track2-roadmap-card,
        body.dark-mode .track2-form-card,
        body.dark-mode .track2-result-card,
        body.dark-mode .track2-panel {
          background: rgba(255, 255, 255, 0.045);
        }

        .track2-roadmap-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 16px;
          align-items: start;
          padding: 18px 18px 18px 16px;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
        }

        .track2-roadmap-card::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 4px;
          background: linear-gradient(180deg, #102a56, #2f6bff);
        }

        .track2-roadmap-card.is-active {
          border-color: rgba(47, 107, 255, 0.55);
          box-shadow: 0 18px 46px rgba(47, 107, 255, 0.14);
          transform: translateY(-2px);
        }

        .track2-step-number {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          color: #fff;
          background: linear-gradient(135deg, #102a56, #2f6bff);
          font-family: "Space Grotesk", sans-serif;
          font-weight: 800;
        }

        .track2-roadmap-card h3,
        .track2-form-card h2,
        .track2-result-card h2,
        .track2-panel h3,
        .track2-result-hero h2 {
          margin: 0;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          letter-spacing: 0;
        }

        .track2-roadmap-card p,
        .track2-form-card p,
        .track2-result-card p,
        .track2-panel p,
        .track2-panel li {
          margin: 8px 0 0;
          color: var(--text);
          line-height: 1.65;
        }

        .track2-roadmap-card h3 {
          font-size: 1.08rem;
        }

        .track2-roadmap-card p {
          font-size: 0.94rem;
        }

        .track2-tabs {
          position: sticky;
          top: 78px;
          z-index: 5;
          margin: 2px 0 0;
          padding: 10px;
          border: 1px solid rgba(255, 255, 255, 0.62);
          border-radius: 999px;
          background: rgba(245, 248, 255, 0.86);
          backdrop-filter: blur(14px);
          box-shadow: 0 14px 32px rgba(18, 51, 100, 0.08);
          width: fit-content;
        }

        .track2-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 34px;
          padding: 0 15px;
          border-radius: 999px;
          border: 1px solid transparent;
          background: rgba(255, 255, 255, 0.72);
          color: var(--navy-800);
          font-size: 0.82rem;
          font-weight: 800;
          cursor: pointer;
        }

        .track2-pill.is-active {
          color: #fff;
          background: linear-gradient(135deg, #102a56, #2f6bff);
          box-shadow: 0 12px 26px rgba(47, 107, 255, 0.2);
        }

        .track2-pill:disabled {
          cursor: not-allowed;
          opacity: 0.48;
        }

        .track2-workspace {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(330px, 0.95fr);
          gap: 18px;
          align-items: start;
        }

        .track2-form-card,
        .track2-result-card,
        .track2-panel {
          padding: 24px;
          border-radius: 18px;
        }

        .track2-form-card.is-wide,
        .track2-result-card.is-wide {
          grid-column: 1 / -1;
        }

        .track2-card-label {
          display: block;
          margin-bottom: 8px;
          color: #7a8cab;
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .track2-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .track2-form-grid.single {
          grid-template-columns: 1fr;
        }

        .track2-field {
          display: grid;
          gap: 7px;
          color: var(--text);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .track2-input,
        .track2-textarea {
          width: 100%;
          min-height: 42px;
          padding: 11px 12px;
          border: 1px solid rgba(47, 107, 255, 0.32);
          border-radius: 9px;
          background: rgba(247, 249, 255, 0.94);
          color: var(--navy-900);
          font: inherit;
          outline: none;
        }

        .track2-input:focus,
        .track2-textarea:focus {
          border-color: rgba(47, 107, 255, 0.72);
          box-shadow: 0 0 0 4px rgba(47, 107, 255, 0.11);
        }

        body.dark-mode .track2-input,
        body.dark-mode .track2-textarea {
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(255, 255, 255, 0.14);
        }

        .track2-textarea {
          min-height: 112px;
          resize: vertical;
        }

        .track2-chip-row {
          margin-top: 14px;
        }

        .track2-mini-chip,
        .track2-toggle-chip,
        .track2-status-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid var(--border);
          background: rgba(18, 51, 100, 0.04);
          color: var(--navy-800);
          font-size: 0.78rem;
          font-weight: 800;
        }

        .track2-toggle-chip {
          cursor: pointer;
        }

        .track2-toggle-chip.is-active,
        .track2-status-chip.good {
          border-color: rgba(34, 197, 94, 0.35);
          background: rgba(34, 197, 94, 0.1);
          color: #15803d;
        }

        .track2-status-chip.warn {
          border-color: rgba(245, 158, 11, 0.35);
          background: rgba(245, 158, 11, 0.1);
          color: #b45309;
        }

        .track2-status-chip.info {
          border-color: rgba(47, 107, 255, 0.3);
          background: rgba(47, 107, 255, 0.08);
          color: var(--blue-500);
        }

        .track2-status-chip.danger {
          border-color: rgba(239, 68, 68, 0.35);
          background: rgba(239, 68, 68, 0.09);
          color: #b91c1c;
        }

        .track2-upload-box {
          display: grid;
          place-items: center;
          min-height: 150px;
          margin-top: 18px;
          padding: 20px;
          border: 2px dashed rgba(47, 107, 255, 0.42);
          border-radius: 16px;
          background: rgba(247, 249, 255, 0.76);
          color: var(--text);
          text-align: center;
          cursor: pointer;
          transition: border-color 0.25s ease, background 0.25s ease, transform 0.25s ease;
        }

        .track2-upload-box:hover {
          border-color: rgba(47, 107, 255, 0.72);
          background: rgba(237, 244, 255, 0.92);
          transform: translateY(-1px);
        }

        .track2-upload-box strong {
          display: block;
          margin-bottom: 8px;
          color: var(--blue-500);
        }

        .track2-upload-box span {
          display: block;
          font-size: 0.78rem;
        }

        .track2-upload-box input {
          display: none;
        }

        .track2-upload-list,
        .track2-doc-grid,
        .track2-timeline,
        .track2-opportunity-grid {
          display: grid;
          gap: 10px;
        }

        .track2-upload-list {
          margin-top: 12px;
        }

        .track2-upload-item,
        .track2-doc-item,
        .track2-timeline-item {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          gap: 12px;
          align-items: center;
          padding: 12px 14px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(18, 51, 100, 0.04);
          color: var(--navy-800);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .track2-upload-item span:first-child,
        .track2-doc-item span:first-child {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .track2-message {
          margin: 14px 0 0;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid rgba(239, 68, 68, 0.22);
          background: rgba(239, 68, 68, 0.08);
          color: #b91c1c;
          font-weight: 800;
        }

        .track2-result-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.75fr);
          gap: 22px;
          align-items: center;
          padding: 28px;
          border: 1px solid rgba(255, 255, 255, 0.62);
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.92), rgba(237, 244, 255, 0.78));
          box-shadow: var(--shadow-md);
        }

        .track2-score-card {
          display: grid;
          gap: 14px;
          padding: 22px;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.82);
        }

        .track2-score-line {
          display: grid;
          grid-template-columns: 128px 1fr 48px;
          gap: 12px;
          align-items: center;
          color: var(--navy-800);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .track2-score-bar {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(18, 51, 100, 0.1);
        }

        .track2-score-bar span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(135deg, #102a56, #2f6bff);
        }

        .track2-metrics,
        .track2-results-grid,
        .track2-search-grid {
          display: grid;
          gap: 14px;
        }

        .track2-metrics {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .track2-metric {
          padding: 16px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: rgba(247, 249, 255, 0.84);
        }

        .track2-metric span {
          display: block;
          margin-bottom: 8px;
          color: var(--text);
          font-size: 0.76rem;
          font-weight: 800;
        }

        .track2-metric strong {
          display: block;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.16rem;
          line-height: 1.2;
        }

        .track2-metric.good strong {
          color: #15803d;
        }

        .track2-metric.warn strong {
          color: #b45309;
        }

        .track2-metric.danger strong {
          color: #b91c1c;
        }

        .track2-results-grid,
        .track2-search-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .track2-decision-banner {
          padding: 18px;
          border-radius: 16px;
          border: 1px solid rgba(245, 158, 11, 0.28);
          background: rgba(245, 158, 11, 0.1);
        }

        .track2-decision-banner.good {
          border-color: rgba(34, 197, 94, 0.28);
          background: rgba(34, 197, 94, 0.1);
        }

        .track2-decision-banner.danger {
          border-color: rgba(239, 68, 68, 0.28);
          background: rgba(239, 68, 68, 0.09);
        }

        .track2-decision-banner strong,
        .track2-empty strong {
          display: block;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.1rem;
        }

        .track2-panel ul {
          margin: 12px 0 0;
          padding-left: 18px;
        }

        .track2-empty {
          padding: 18px;
          border-radius: 14px;
          border: 1px dashed rgba(47, 107, 255, 0.32);
          background: rgba(247, 249, 255, 0.68);
        }

        .track2-search-empty {
          display: grid;
          gap: 10px;
          padding: 16px;
          border-radius: 14px;
          border: 1px solid rgba(47, 107, 255, 0.18);
          background: rgba(249, 251, 255, 0.86);
        }

        .track2-search-empty strong {
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: 0.95rem;
        }

        .track2-search-empty p {
          margin: 0;
          font-size: 0.78rem;
          line-height: 1.6;
        }

        .track2-search-empty ul {
          display: grid;
          gap: 5px;
          margin: 0;
          padding-left: 18px;
          color: var(--text);
          font-size: 0.74rem;
          line-height: 1.45;
        }

        .track2-opportunity-grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .track2-research-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 0.5fr);
          gap: 22px;
          align-items: stretch;
          padding: 30px;
          overflow: hidden;
          border-color: rgba(47, 107, 255, 0.2);
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(239, 246, 255, 0.9)),
            radial-gradient(circle at 88% 10%, rgba(47, 107, 255, 0.16), transparent 34%);
        }

        .track2-research-copy {
          align-self: center;
        }

        .track2-research-copy h2 {
          max-width: 18ch;
          font-size: clamp(2rem, 3vw, 3rem);
          line-height: 1.05;
        }

        .track2-research-note {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 12px;
          align-items: start;
          margin-top: 18px;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(47, 107, 255, 0.14);
          background: rgba(255, 255, 255, 0.66);
        }

        .track2-research-note strong {
          color: var(--navy-900);
        }

        .track2-research-dot {
          width: 12px;
          height: 12px;
          margin-top: 6px;
          border-radius: 999px;
          background: #16a34a;
          box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.12);
        }

        .track2-research-board {
          display: grid;
          gap: 12px;
          padding: 20px;
          border: 1px solid rgba(47, 107, 255, 0.14);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.78);
          color: var(--navy-900);
          box-shadow: 0 16px 38px rgba(18, 51, 100, 0.08);
        }

        .track2-research-board span,
        .track2-research-board strong {
          color: var(--navy-900);
        }

        .track2-research-stat {
          display: grid;
          gap: 4px;
          padding: 14px;
          border-radius: 14px;
          background: rgba(247, 249, 255, 0.92);
          border: 1px solid rgba(47, 107, 255, 0.12);
        }

        .track2-research-stat span {
          font-size: 0.74rem;
          font-weight: 800;
          opacity: 0.82;
        }

        .track2-research-stat strong {
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.6rem;
          line-height: 1;
        }

        .track2-search-card {
          display: flex;
          min-height: 0;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
          overflow: hidden;
          border: 1px solid rgba(47, 107, 255, 0.14);
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 20px 52px rgba(18, 51, 100, 0.1);
        }

        .track2-search-head {
          padding: 18px;
          border-bottom: 1px solid rgba(47, 107, 255, 0.12);
          background: linear-gradient(135deg, rgba(247, 249, 255, 0.98), rgba(255, 255, 255, 0.95));
        }

        .track2-search-head h3 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 8px;
        }

        .track2-platform-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border-radius: 11px;
          background: linear-gradient(135deg, rgba(16, 42, 86, 0.94), rgba(47, 107, 255, 0.88));
          color: #fff;
          font-family: "Space Grotesk", sans-serif;
          font-weight: 900;
          letter-spacing: 0;
        }

        .track2-search-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .track2-search-query {
          margin-top: 12px;
          padding: 10px;
          border-radius: 10px;
          background: rgba(18, 51, 100, 0.055);
          color: var(--navy-800);
          font-size: 0.72rem;
          font-weight: 800;
          word-break: break-word;
        }

        .track2-search-query.is-soft {
          background: rgba(47, 107, 255, 0.055);
          color: #38527a;
        }

        .track2-query-stack {
          display: grid;
          gap: 8px;
          margin-top: 2px;
        }

        .track2-query-title {
          color: #7a8cab;
          font-size: 0.68rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .track2-query-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 9px 10px;
          border-radius: 9px;
          border: 1px solid rgba(47, 107, 255, 0.12);
          background: rgba(255, 255, 255, 0.82);
          color: #38527a;
          font-size: 0.72rem;
          font-weight: 850;
          line-height: 1.35;
          word-break: break-word;
        }

        .track2-result-list {
          display: grid;
          gap: 10px;
          padding: 14px;
        }

        .track2-public-result {
          display: grid;
          gap: 7px;
          padding: 13px;
          border-radius: 13px;
          border: 1px solid rgba(47, 107, 255, 0.16);
          background: rgba(247, 249, 255, 0.8);
          text-decoration: none;
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .track2-public-result:hover {
          transform: translateY(-2px);
          border-color: rgba(47, 107, 255, 0.38);
          background: rgba(255, 255, 255, 0.96);
        }

        .track2-public-result strong {
          color: var(--navy-900);
          font-size: 0.92rem;
          line-height: 1.35;
        }

        .track2-public-result p {
          margin: 0;
          font-size: 0.76rem;
          line-height: 1.55;
        }

        .track2-result-domain {
          color: #7a8cab;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
        }

        .track2-search-card a {
          color: var(--blue-500);
          font-weight: 900;
        }

        .track2-result-action {
          display: inline-flex;
          width: fit-content;
          margin-top: 6px;
          color: var(--blue-500);
          font-size: 0.78rem;
          font-weight: 900;
          text-decoration: none;
        }

        .track2-result-query {
          display: block;
          color: #7a8cab;
          font-size: 0.7rem;
          font-weight: 800;
          line-height: 1.4;
        }

        .track2-search-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px 18px;
          margin-top: auto;
        }

        .track2-tab-content {
          display: grid;
          gap: 18px;
        }

        @media (max-width: 1100px) {
          .track2-hero,
          .track2-workspace,
          .track2-result-hero,
          .track2-research-hero,
          .track2-results-grid,
          .track2-search-grid,
          .track2-opportunity-grid {
            grid-template-columns: 1fr;
          }

          .track2-metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .track2-form-grid,
          .track2-metrics {
            grid-template-columns: 1fr;
          }

          .track2-tabs {
            position: static;
            border-radius: 18px;
            width: 100%;
          }

          .track2-pill {
            flex: 1 1 auto;
          }

          .track2-hero h1,
          .track2-result-hero h1 {
            font-size: clamp(2.5rem, 13vw, 4rem);
          }

          .track2-score-line {
            grid-template-columns: 1fr;
          }

          .track2-photo-hero {
            grid-template-columns: 1fr;
          }

          .track2-hero-visual {
            aspect-ratio: 16/7;
          }
        }

        .track2-photo-hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
          padding: 44px 40px;
          border-radius: 28px;
          border: 1px solid var(--track2-line);
          background: var(--track2-surface);
          box-shadow: 0 8px 36px rgba(14,38,84,0.08);
          overflow: hidden;
          position: relative;
          margin-bottom: 28px;
        }

        body.dark-mode .track2-photo-hero { background: rgba(10,20,42,0.82); }

        .track2-photo-hero::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 5px;
          background: linear-gradient(90deg, #12336c, #1f5eff, #5a8fff);
        }

        .track2-hero-copy { display: flex; flex-direction: column; gap: 20px; }

        .track2-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          background: rgba(31,94,255,.1);
          color: var(--track2-accent);
          width: fit-content;
        }

        .track2-hero-title {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          color: var(--navy-900);
          line-height: 1.05;
          letter-spacing: -.03em;
        }

        .track2-hero-sub {
          margin: 0;
          color: var(--track2-muted);
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 46ch;
        }

        .track2-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }

        .track2-hero-back {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 999px;
          font-size: .88rem;
          font-weight: 700;
          color: var(--track2-ink);
          border: 1px solid var(--track2-line);
          background: var(--track2-muted-surface);
          text-decoration: none;
          transition: transform .25s ease, box-shadow .25s ease;
        }

        .track2-hero-back:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(14,38,84,.1); }

        .track2-hero-visual {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4/3;
          box-shadow: 0 16px 48px rgba(14,38,84,.14);
        }

        .track2-hero-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .track2-hero-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(10,25,60,.18));
        }


        /* ===== UPDATED HERO + ROADMAP ONLY ===== */
        .track2-hero {
          grid-template-columns: minmax(0, 0.85fr) minmax(300px, 0.72fr);
          gap: 28px;
          align-items: center;
          padding: 34px;
          border-radius: 30px;
          background:
            radial-gradient(circle at 8% 12%, rgba(146, 197, 253, 0.28), transparent 35%),
            linear-gradient(135deg, #fbfdff 0%, #eef5ff 54%, #f8fbff 100%);
          border: 1px solid rgba(47, 107, 255, 0.13);
          box-shadow: 0 22px 55px rgba(18, 51, 100, 0.09);
          overflow: hidden;
          position: relative;
        }

        .track2-hero::after {
          content: "";
          position: absolute;
          width: 210px;
          height: 210px;
          right: -75px;
          top: -75px;
          border-radius: 999px;
          background: rgba(47, 107, 255, 0.08);
          pointer-events: none;
        }

        .track2-hero > * {
          position: relative;
          z-index: 1;
        }

        .track2-hero .track2-hero-copy {
          min-height: auto;
          padding: 6px 0;
          justify-content: center;
        }

        .track2-hero h1 {
          max-width: 13ch;
          margin: 14px 0 12px;
          font-size: clamp(2.35rem, 4.7vw, 3.85rem);
          line-height: 1.02;
          letter-spacing: -0.035em;
        }

        .track2-hero-copy p {
          max-width: 37ch;
          font-size: 0.96rem;
          line-height: 1.55;
          color: #5d6f8c;
        }

        .track2-kicker-row {
          gap: 8px;
        }

        .track2-kicker {
          padding: 6px 10px;
          font-size: 0.68rem;
          background: rgba(47, 107, 255, 0.09);
          border-color: rgba(47, 107, 255, 0.16);
        }

        .track2-progress {
          max-width: 330px;
          margin-top: 18px;
        }

        .track2-progress-track {
          height: 7px;
          background: rgba(47, 107, 255, 0.12);
        }

        .track2-progress-fill {
          background: linear-gradient(90deg, #2f6bff, #8bb8ff);
        }

        .track2-actions {
          margin-top: 18px;
        }

        .track2-roadmap {
          gap: 12px;
          padding: 14px;
          border-radius: 26px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(245, 249, 255, 0.96)),
            radial-gradient(circle at top right, rgba(47, 107, 255, 0.12), transparent 35%);
          box-shadow: 0 20px 50px rgba(18, 51, 100, 0.1);
        }

        .track2-roadmap-card {
          grid-template-columns: auto 1fr;
          gap: 12px;
          padding: 14px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(47, 107, 255, 0.13);
          box-shadow: 0 10px 24px rgba(18, 51, 100, 0.055);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .track2-roadmap-card::before {
          width: 0;
        }

        .track2-roadmap-card:hover {
          transform: translateY(-4px);
          border-color: rgba(47, 107, 255, 0.38);
          box-shadow: 0 18px 40px rgba(47, 107, 255, 0.16);
        }

        .track2-roadmap-card.is-active {
          border-color: rgba(47, 107, 255, 0.55);
          background: linear-gradient(135deg, #ffffff, #f2f7ff);
          box-shadow: 0 18px 42px rgba(47, 107, 255, 0.18);
        }

        .track2-step-number {
          width: 36px;
          height: 36px;
          border-radius: 13px;
          font-size: 0.78rem;
          background: linear-gradient(135deg, #2f6bff, #86b6ff);
        }

        .track2-roadmap-card h3 {
          font-size: 0.96rem;
          line-height: 1.2;
        }

        .track2-roadmap-card p {
          margin-top: 4px;
          font-size: 0.78rem;
          line-height: 1.42;
          color: #6d7d96;
        }

        @media (max-width: 1100px) {
          .track2-hero {
            grid-template-columns: 1fr;
            padding: 28px;
          }
        }

        @media (max-width: 700px) {
          .track2-hero {
            padding: 22px;
            gap: 20px;
          }

          .track2-hero h1 {
            max-width: 12ch;
            font-size: clamp(2rem, 10vw, 3rem);
          }

          .track2-roadmap {
            padding: 10px;
          }

          .track2-roadmap-card {
            padding: 12px;
          }
        }

      `}),i.jsxs("div",{className:"track2-photo-hero reveal",children:[i.jsxs("div",{className:"track2-hero-copy",children:[i.jsx("span",{className:"track2-hero-eyebrow",children:"Track B · Legal Operations Console"}),i.jsx("h1",{className:"track2-hero-title",children:"Start your startup the right way"}),i.jsx("p",{className:"track2-hero-sub",children:"Analyze company structure, Startup Act readiness, document compliance, and external evidence from one controlled legal workspace."}),i.jsx("div",{className:"track2-hero-actions",children:i.jsx("a",{href:"#services",className:"track2-hero-back",children:"← Back to Tracks"})})]}),i.jsx("div",{className:"track2-hero-visual",children:i.jsx("img",{src:"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1100&q=80",alt:"Startup legal documents and business planning workspace",loading:"lazy"})})]}),i.jsxs("div",{className:"track2-shell",children:[x?i.jsxs("div",{className:"track2-result-hero reveal",children:[i.jsxs("div",{children:[i.jsxs("div",{className:"track2-kicker-row",children:[i.jsx("span",{className:"track2-kicker",children:(e==null?void 0:e.track)||"Track B"}),i.jsx("span",{className:`track2-status-chip ${U}`,children:L})]}),i.jsxs("h1",{children:[t.startup_profile.startup_name||"Startup"," legal review."]}),i.jsx("p",{children:"The analysis is organized into decision, documents, roadmap, and opportunity views. Use the tabs below to review each part without mixing the case form with the final dashboard."}),i.jsxs("div",{className:"track2-result-actions",children:[i.jsx("button",{className:"secondary-btn",type:"button",onClick:()=>g("case"),children:"Edit case"}),i.jsx("button",{className:"primary-btn",type:"button",onClick:b,disabled:a,children:a?"Refreshing...":"Run again"})]}),v?i.jsx("div",{className:"track2-message",children:v}):null]}),i.jsxs("div",{className:"track2-score-card",children:[i.jsxs("div",{className:"track2-score-line",children:[i.jsx("span",{children:"Startup Act"}),i.jsx("div",{className:"track2-score-bar",children:i.jsx("span",{style:{width:`${Math.min(he,100)}%`}})}),i.jsxs("strong",{children:[he,"%"]})]}),i.jsxs("div",{className:"track2-score-line",children:[i.jsx("span",{children:"Label score"}),i.jsx("div",{className:"track2-score-bar",children:i.jsx("span",{style:{width:`${Math.min(pe,100)}%`}})}),i.jsxs("strong",{children:[pe,"%"]})]}),i.jsxs("div",{className:"track2-score-line",children:[i.jsx("span",{children:"Documents"}),i.jsx("div",{className:"track2-score-bar",children:i.jsx("span",{style:{width:`${Math.min(X,100)}%`}})}),i.jsxs("strong",{children:[X,"%"]})]})]})]}):i.jsxs("div",{className:"track2-hero reveal",children:[i.jsxs("div",{className:"track2-hero-copy",children:[i.jsxs("div",{className:"track2-kicker-row",children:[i.jsx("span",{className:"track2-kicker",children:(e==null?void 0:e.track)||"Track B"}),i.jsx("span",{className:"track2-kicker",children:"Legal & Administrative PRO"})]}),i.jsx("h1",{children:"Legal readiness dashboard for Tunisian startups."}),i.jsx("p",{children:"Build a clean legal file, upload the required evidence, and let the Track B agents prepare a structured decision package for advisors, investors, and Startup Act readiness."}),i.jsxs("div",{className:"track2-progress",children:[i.jsxs("div",{className:"track2-progress-row",children:[i.jsx("span",{children:"Case completion"}),i.jsxs("span",{children:[q,"%"]})]}),i.jsx("div",{className:"track2-progress-track",children:i.jsx("div",{className:"track2-progress-fill",style:{width:`${q}%`}})})]}),i.jsxs("div",{className:"track2-actions",children:[i.jsx("button",{className:"primary-btn",type:"button",onClick:b,disabled:a,children:a?"Reviewing...":"Review legal file"}),i.jsx("a",{href:"#services",className:"secondary-btn",children:"Back to Tracks"})]}),v?i.jsx("div",{className:"track2-message",children:v}):null]}),i.jsx("div",{className:"track2-roadmap",children:sk.map((_,G)=>i.jsxs("article",{className:`track2-roadmap-card${G===0?" is-active":""}`,children:[i.jsx("span",{className:"track2-step-number",children:_.number}),i.jsxs("div",{children:[i.jsx("h3",{children:_.title}),i.jsx("p",{children:_.text})]})]},_.number))})]}),i.jsx("div",{className:"track2-tabs",children:(x?Li:[{id:"case",label:"Case"}]).map(_=>i.jsx("button",{className:`track2-pill${f===_.id?" is-active":""}`,type:"button",onClick:()=>g(_.id),children:_.label},_.id))}),f==="case"?i.jsxs("div",{className:"track2-workspace",children:[i.jsxs("section",{className:"track2-form-card",children:[i.jsx("span",{className:"track2-card-label",children:"Startup profile"}),i.jsx("h2",{children:"Company information"}),i.jsxs("div",{className:"track2-form-grid",children:[i.jsx(_t,{label:"Startup name",children:i.jsx("input",{className:"track2-input",placeholder:"Example: MedLink Tunisia",value:t.startup_profile.startup_name,onChange:_=>m("startup_name",_.target.value)})}),i.jsx(_t,{label:"Sector",children:i.jsx("input",{className:"track2-input",placeholder:"Example: HealthTech SaaS",value:t.startup_profile.sector,onChange:_=>m("sector",_.target.value)})}),i.jsx(_t,{label:"Founders count",children:i.jsx("input",{className:"track2-input",type:"number",min:"1",placeholder:"Example: 2",value:t.startup_profile.founders_count,onChange:_=>m("founders_count",_.target.value)})}),i.jsx(_t,{label:"Funding need TND",children:i.jsx("input",{className:"track2-input",type:"number",placeholder:"Example: 350000",value:t.startup_profile.funding_need_tnd,onChange:_=>m("funding_need_tnd",_.target.value)})})]}),i.jsx("div",{className:"track2-form-grid single",children:i.jsx(_t,{label:"Activity description",children:i.jsx("textarea",{className:"track2-textarea",placeholder:"Describe what the startup does, who it serves, and what problem it solves.",value:t.startup_profile.activity_description,onChange:_=>m("activity_description",_.target.value)})})}),i.jsx("div",{className:"track2-chip-row",children:ik.map(([_,G])=>i.jsx("button",{className:`track2-toggle-chip${t.startup_profile[_]?" is-active":""}`,type:"button",onClick:()=>C(_),children:G},_))})]}),i.jsxs("section",{className:"track2-form-card",children:[i.jsx("span",{className:"track2-card-label",children:"Pitching package"}),i.jsx("h2",{children:"Pitch and legal file"}),i.jsx("div",{className:"track2-form-grid single",children:i.jsx(_t,{label:"Pitch notes",children:i.jsx("textarea",{className:"track2-textarea",placeholder:`Problem: ...
Solution: ...
Proof: ...
Team: ...`,value:t.label_input.transcript,onChange:_=>k("transcript",_.target.value)})})}),i.jsxs("div",{className:"track2-form-grid",children:[i.jsx(_t,{label:"Traction signals",children:i.jsx("textarea",{className:"track2-textarea",placeholder:`pilot users
advisor feedback
letters of intent`,value:t.label_input.traction_signals.join(`
`),onChange:_=>j("traction_signals",_.target.value)})}),i.jsx(_t,{label:"Team signals",children:i.jsx("textarea",{className:"track2-textarea",placeholder:`legal operations
AI engineering
domain expertise`,value:t.label_input.team_signals.join(`
`),onChange:_=>j("team_signals",_.target.value)})})]}),i.jsxs("label",{className:"track2-upload-box",children:[i.jsx("input",{type:"file",multiple:!0,accept:".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.bmp,.tif,.tiff,.webp",onChange:K,disabled:u}),i.jsxs("div",{children:[i.jsx("strong",{children:"Upload legal documents"}),i.jsx("span",{children:u?"Uploading documents...":"Choose files from your computer"}),i.jsx("span",{children:"PDF, Word, PowerPoint, images, scans"})]})]}),h.length?i.jsx("div",{className:"track2-upload-list",children:h.map(_=>i.jsxs("div",{className:"track2-upload-item",children:[i.jsx("span",{children:_.file_name||_.path.split(/[\\/]/).pop()}),i.jsx("span",{className:"track2-status-chip good",children:"Ready"})]},_.path))}):i.jsx(es,{title:"No document uploaded yet",text:"Add the legal files before strict review for a more realistic decision."}),i.jsxs("div",{className:"track2-actions",children:[i.jsx("button",{className:"secondary-btn",type:"button",onClick:we,disabled:l||a,children:l?"Loading...":"Load sample"}),i.jsx("button",{className:"primary-btn",type:"button",onClick:b,disabled:a,children:a?"Reviewing...":"Review legal file"})]})]}),i.jsxs("section",{className:"track2-form-card is-wide",children:[i.jsx("span",{className:"track2-card-label",children:"Accelerator readiness"}),i.jsx("h2",{children:"Network and funding context"}),i.jsxs("div",{className:"track2-form-grid",children:[i.jsx(_t,{label:"Founder profile",children:i.jsx("textarea",{className:"track2-textarea",placeholder:"Founder background, relevant experience, and execution strengths.",value:((He=(Hn=t.startup_profile.associates)==null?void 0:Hn[0])==null?void 0:He.name)||"",onChange:_=>r(G=>({...G,startup_profile:{...G.startup_profile,associates:[{name:_.target.value,role:"Founder",equity_pct:100,active:!0}]}}))})}),i.jsx(_t,{label:"Stage",children:i.jsx("input",{className:"track2-input",value:"Pre-seed / preparing launch",readOnly:!0})})]}),i.jsx("div",{className:"track2-form-grid single",children:i.jsx(_t,{label:"Networking goal",children:i.jsx("textarea",{className:"track2-textarea",placeholder:"Find mentors, early investors, and events that improve legal and funding readiness.",value:t.label_input.slide_text,onChange:_=>k("slide_text",_.target.value)})})}),i.jsxs("div",{className:"track2-chip-row",children:[i.jsx("span",{className:"track2-mini-chip",children:"Google discovery"}),i.jsx("span",{className:"track2-mini-chip",children:"LinkedIn relationship"}),i.jsx("span",{className:"track2-mini-chip",children:"Facebook ecosystem signals"}),i.jsx("span",{className:"track2-mini-chip",children:"Event database"}),i.jsx("span",{className:"track2-mini-chip",children:"Relationship history"})]})]})]}):null,x&&f==="decision"?i.jsxs("div",{className:"track2-tab-content",children:[i.jsxs("section",{className:"track2-result-card is-wide",children:[i.jsx("span",{className:"track2-card-label",children:"Decision package"}),i.jsx("h2",{children:"Final legal decision"}),i.jsxs("div",{className:"track2-metrics",children:[i.jsx(lr,{label:"Decision",value:L,tone:U}),i.jsx(lr,{label:"Legal form",value:B.recommended_legal_form||"N/A"}),i.jsx(lr,{label:"Startup Act",value:`${he}%`,tone:Fd(he)}),i.jsx(lr,{label:"Risk level",value:ae,tone:M>=60?"danger":"warn"})]})]}),i.jsxs("div",{className:`track2-decision-banner ${U}`,children:[i.jsx("strong",{children:L}),i.jsx("p",{children:T.user_message||"The final decision combines legal structure, document completeness, Startup Act readiness, and strict-mode blockers."})]}),i.jsxs("div",{className:"track2-results-grid",children:[i.jsxs("section",{className:"track2-panel",children:[i.jsx("span",{className:"track2-card-label",children:"Legal recommendation"}),i.jsx("h3",{children:"Strategy summary"}),(B.rationale||[]).length?i.jsx("ul",{children:(B.rationale||[]).slice(0,6).map((_,G)=>i.jsx("li",{children:_},`${_}-${G}`))}):i.jsx(es,{title:"No rationale returned",text:"Run again after adding more pitch and legal context."})]}),i.jsxs("section",{className:"track2-panel",children:[i.jsx("span",{className:"track2-card-label",children:"Main blocker"}),i.jsx("h3",{children:le}),i.jsx("p",{children:"Strict mode separates startup potential from file readiness. A strong Startup Act score can still be blocked if the required documents are incomplete."})]})]})]}):null,x&&f==="documents"?i.jsxs("div",{className:"track2-tab-content",children:[i.jsxs("section",{className:"track2-result-card is-wide",children:[i.jsx("span",{className:"track2-card-label",children:"File readiness"}),i.jsx("h2",{children:"Documents dashboard"}),i.jsxs("div",{className:"track2-metrics",children:[i.jsx(lr,{label:"Completeness",value:`${X}%`,tone:Fd(X)}),i.jsx(lr,{label:"Status",value:H,tone:X>=80?"good":"warn"}),i.jsx(lr,{label:"Uploaded",value:h.length}),i.jsx(lr,{label:"Missing",value:w.length,tone:w.length?"danger":"good"})]})]}),i.jsxs("div",{className:"track2-results-grid",children:[i.jsxs("section",{className:"track2-panel",children:[i.jsx("span",{className:"track2-card-label",children:"Uploaded evidence"}),i.jsx("h3",{children:"Ready documents"}),h.length?i.jsx("div",{className:"track2-doc-grid",children:h.map(_=>i.jsxs("div",{className:"track2-doc-item",children:[i.jsx("span",{children:_.file_name||_.path.split(/[\\/]/).pop()}),i.jsx("span",{className:"track2-status-chip good",children:"Ready"})]},_.path))}):i.jsx(es,{title:"No uploaded document",text:"Return to the Case tab and upload the legal evidence package."})]}),i.jsxs("section",{className:"track2-panel",children:[i.jsx("span",{className:"track2-card-label",children:"Required documents"}),i.jsx("h3",{children:"Documents to complete"}),w.length?i.jsx("div",{className:"track2-doc-grid",children:w.map(_=>i.jsxs("div",{className:"track2-doc-item",children:[i.jsx("span",{children:_}),i.jsx("span",{className:"track2-status-chip danger",children:"Missing"})]},_))}):i.jsx(es,{title:"No missing document",text:"The document agent did not return any mandatory missing item."})]})]})]}):null,x&&f==="roadmap"?i.jsxs("div",{className:"track2-tab-content",children:[i.jsxs("section",{className:"track2-result-card is-wide",children:[i.jsx("span",{className:"track2-card-label",children:"Execution plan"}),i.jsx("h2",{children:"Legal readiness roadmap"}),i.jsx("p",{children:"Follow these steps in order before advisor submission or investor outreach."})]}),i.jsx("div",{className:"track2-timeline",children:Js.map((_,G)=>i.jsxs("article",{className:"track2-timeline-item",children:[i.jsxs("div",{children:[i.jsxs("span",{className:"track2-card-label",children:["Step ",G+1]}),i.jsx("h3",{children:_.title}),i.jsx("p",{children:_.text})]}),i.jsx("span",{className:`track2-status-chip ${G===0&&w.length?"danger":"good"}`,children:_.status})]},_.title))})]}):null,x&&f==="opportunities"?i.jsxs("div",{className:"track2-tab-content",children:[i.jsxs("section",{className:"track2-result-card is-wide track2-research-hero",children:[i.jsxs("div",{className:"track2-research-copy",children:[i.jsx("span",{className:"track2-card-label",children:"External research agent"}),i.jsx("h2",{children:"Opportunities and ecosystem intelligence"}),i.jsx("p",{children:"The agent now executes public web searches for company credibility, LinkedIn presence, Facebook activity, and relevant startup events, then displays the most useful findings in a clean review board."}),i.jsxs("div",{className:"track2-research-note",children:[i.jsx("span",{className:"track2-research-dot"}),i.jsxs("p",{children:[i.jsx("strong",{children:"Agent research is ready."})," Review the findings below, open the strongest sources, and keep only evidence that matches the startup identity."]})]})]}),i.jsxs("div",{className:"track2-research-board",children:[i.jsxs("div",{className:"track2-research-stat",children:[i.jsx("span",{children:"Searches executed"}),i.jsxs("strong",{children:[We,"/",Ie.length||4]})]}),i.jsxs("div",{className:"track2-research-stat",children:[i.jsx("span",{children:"Public results found"}),i.jsx("strong",{children:ar})]}),i.jsxs("div",{className:"track2-research-stat",children:[i.jsx("span",{children:"Agent status"}),i.jsx("strong",{children:Wn})]})]})]}),Ie.length?i.jsx("div",{className:"track2-opportunity-grid",children:Ie.map(_=>{var G,ee,xe,ut;return i.jsxs("article",{className:"track2-search-card",children:[i.jsxs("div",{className:"track2-search-head",children:[i.jsxs("div",{className:"track2-search-topline",children:[i.jsx("span",{className:"track2-platform-badge",children:_.platform.slice(0,1)}),i.jsx("span",{className:`track2-status-chip ${Md(_).tone}`,children:Md(_).label})]}),i.jsx("span",{className:"track2-card-label",children:_.platform==="Events"?"Event discovery":`${_.platform} direct page check`}),i.jsx("h3",{children:_.platform}),i.jsx("p",{children:_.purpose}),i.jsx("div",{className:"track2-search-query",children:_.query})]}),i.jsx("div",{className:"track2-result-list",children:(((G=_.agent_search)==null?void 0:G.results)||[]).length?_.agent_search.results.map((_e,ke)=>i.jsxs("div",{className:"track2-public-result",children:[i.jsxs("a",{href:_e.url,target:"_blank",rel:"noreferrer",children:[i.jsx("span",{className:"track2-result-domain",children:_e.domain||"Public source"}),i.jsx("strong",{children:_e.title})]}),i.jsx("p",{children:_e.snippet}),_e.matched_query?i.jsxs("small",{className:"track2-result-query",children:["Found via: ",_e.matched_query]}):null,i.jsx("a",{className:"track2-result-action",href:_e.url,target:"_blank",rel:"noreferrer",children:"Open page"})]},`${_e.url||ke}`)):i.jsxs("div",{className:"track2-search-empty",children:[i.jsx("strong",{children:"No verified direct page found"}),i.jsx("p",{children:lk(_.platform)}),i.jsxs("ul",{children:[i.jsx("li",{children:"Verify the startup spelling and public brand name."}),i.jsx("li",{children:"Add the official website or profile URL in the case notes if the founder has one."}),i.jsx("li",{children:"Run the review again so the agent can include that direct page."})]}),i.jsxs("div",{className:"track2-query-stack",children:[i.jsx("span",{className:"track2-query-title",children:"Agent checked"}),(((ee=_.agent_search)==null?void 0:ee.attempted_queries)||[_.query]).slice(0,3).map(_e=>i.jsx("span",{className:"track2-query-chip",children:i.jsx("span",{children:_e})},_e))]})]})}),i.jsxs("div",{className:"track2-search-footer",children:[i.jsxs("span",{className:"track2-mini-chip",children:[(((xe=_.agent_search)==null?void 0:xe.results)||[]).length||0," public result"]}),(((ut=_.agent_search)==null?void 0:ut.results)||[]).length?i.jsx("span",{className:"track2-mini-chip",children:"Direct page links"}):null]})]},`${_.platform}-${_.query}`)})}):i.jsx(es,{title:"No external search returned",text:"Run the legal review again after completing the startup name, sector, and networking goal."})]}):null]})]})}const uk="http://127.0.0.1:5056",dk=`${uk}/track3/execution/run`,vo={startup_profile:{name:"MedLink",objective:"Launch an MVP for an online doctor appointment booking platform",problem_statement:"Patients need a simple way to find doctors, book appointments, and receive reminders.",target_users:"Patients in urban areas and small private clinics",mvp_scope_paragraph:"The MVP includes signup/login, doctor search, appointment booking, clinic dashboard, and reminder notifications.",execution_context:"Small startup team building an MVP in 10 weeks with limited budget and aiming for pilot clinics."},mvp_plan:{features:[{name:"User signup and authentication",priority:"high"},{name:"Doctor search and filtering",priority:"high"},{name:"Appointment booking",priority:"high"},{name:"Clinic dashboard",priority:"medium"},{name:"Reminder notifications",priority:"medium"}],admin_workflow:[{name:"Legal registration",priority:"high"},{name:"Pilot clinic partnership agreements",priority:"high"},{name:"Payment gateway setup",priority:"medium"}],deadlines:{mvp_launch:"2026-07-15",legal_deadline:"2026-06-01"}},team:[{name:"Sarah",role:"Product Manager",skills:["planning","requirements","operations"],availability:1},{name:"Youssef",role:"Backend Engineer",skills:["backend","api","database","integrations"],availability:1},{name:"Lina",role:"Frontend Designer",skills:["design","ux","frontend"],availability:1},{name:"Hamza",role:"Full Stack Engineer",skills:["frontend","backend","testing"],availability:1},{name:"Mariem",role:"Operations and Legal",skills:["documentation","legal","partnerships"],availability:1}],live_status:{progress_signals:[],founder_notes:""}};function yo(e){return String(e||"").replaceAll("_"," ").replace(/\b\w/g,t=>t.toUpperCase())}function Nl(e){const t=String(e||"").trim().toLowerCase();return["good","done","ready","synced","success"].includes(t)?"good":["fragile","todo","in_progress","warning"].includes(t)?"warn":["high_risk","blocked","delayed","error","failed"].includes(t)?"danger":"info"}function Bd(e){return JSON.stringify(e,null,2)}function pi({children:e,tone:t="info"}){return i.jsx("span",{className:`track3-status-badge ${t}`,children:e})}function ja({label:e,value:t,tone:r="info"}){return i.jsxs("div",{className:`track3-summary-metric ${r}`,children:[i.jsx("span",{children:e}),i.jsx("strong",{children:String(t??"N/A")})]})}function Wd({task:e}){return i.jsxs("article",{className:"track3-task-card",children:[i.jsxs("div",{className:"track3-task-header",children:[i.jsxs("div",{children:[i.jsx("strong",{children:e.title||"Untitled task"}),i.jsx("p",{children:e.description||"No description provided."})]}),i.jsxs("div",{className:"track3-pill-row",children:[i.jsx(pi,{tone:Nl(e.status),children:e.status||"todo"}),i.jsx(pi,{tone:Nl(e.priority),children:e.priority||"medium"})]})]}),i.jsxs("div",{className:"track3-task-meta",children:[i.jsxs("span",{children:["Owner: ",e.assigned_to||"Unassigned"]}),i.jsxs("span",{children:["Estimate: ",e.estimated_days||"N/A"," days"]}),i.jsxs("span",{children:["Milestone: ",e.milestone_title||"N/A"]}),i.jsxs("span",{children:["Action: ",e.agent_action||"update"]}),e.jira_issue_key?i.jsxs("span",{children:["Jira: ",e.jira_issue_key]}):null]})]})}function Hd(){return`exec_${Date.now()}_${Math.random().toString(36).substr(2,9)}`}function Vd(e){const t=JSON.stringify(e);let r=0;for(let n=0;n<t.length;n++){const s=t.charCodeAt(n);r=(r<<5)-r+s,r=r&r}return Math.abs(r).toString(16).slice(0,8)}function hk({track:e}){var he,pe;const[t,r]=I.useState(vo),[n,s]=I.useState(!1),[a,o]=I.useState(""),[l,c]=I.useState(null),[u,d]=I.useState([]),[h,p]=I.useState(Hd()),[v,y]=I.useState(Vd(vo)),x=(E,L)=>{r(H=>({...H,startup_profile:{...H.startup_profile,[E]:L}}))},N=(E,L)=>{r(H=>({...H,mvp_plan:{...H.mvp_plan,deadlines:{...H.mvp_plan.deadlines,[E]:L}}}))},f=(E,L,H)=>{r(ae=>{const le=[...ae.mvp_plan.features];return le[E]={...le[E],[L]:H},{...ae,mvp_plan:{...ae.mvp_plan,features:le}}})},g=()=>{r(E=>({...E,mvp_plan:{...E.mvp_plan,features:[...E.mvp_plan.features,{name:"",priority:"medium"}]}}))},m=E=>{r(L=>({...L,mvp_plan:{...L.mvp_plan,features:L.mvp_plan.features.filter((H,ae)=>ae!==E)}}))},k=(E,L,H)=>{r(ae=>{const le=[...ae.mvp_plan.admin_workflow];return le[E]={...le[E],[L]:H},{...ae,mvp_plan:{...ae.mvp_plan,admin_workflow:le}}})},j=()=>{r(E=>({...E,mvp_plan:{...E.mvp_plan,admin_workflow:[...E.mvp_plan.admin_workflow,{name:"",priority:"medium"}]}}))},C=E=>{r(L=>({...L,mvp_plan:{...L.mvp_plan,admin_workflow:L.mvp_plan.admin_workflow.filter((H,ae)=>ae!==E)}}))},S=(E,L,H)=>{r(ae=>{const le=[...ae.team];return le[E]={...le[E],[L]:H},{...ae,team:le}})},$=()=>{r(E=>({...E,team:[...E.team,{name:"",role:"",skills:[],availability:1}]}))},q=E=>{r(L=>({...L,team:L.team.filter((H,ae)=>ae!==E)}))},J=E=>{r(L=>({...L,live_status:{...L.live_status,founder_notes:E}}))};async function we(){s(!0),o("");const E=Hd(),L=Vd(t),H=new Date().toISOString();p(E),y(L);try{const ae=await fetch(dk,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)}),le=await ae.json();if(!ae.ok||le.error)throw new Error(le.error||"Track C execution failed.");const Ie={...le,_execution_meta:{execution_id:E,timestamp:H,input_hash:L,startup_name:t.startup_profile.name,execution_number:u.length+1}};c(Ie),d(We=>{var ar;return[{id:E,timestamp:H,startup:t.startup_profile.name,inputHash:L,taskCount:((ar=le.task_list)==null?void 0:ar.length)||0},...We]}),window.scrollTo({top:0,behavior:"smooth"})}catch(ae){c(null),o(ae.message||"Track C execution failed.")}finally{s(!1)}}function z(){r(vo),o(""),c(null)}const K=(l==null?void 0:l.executive_summary)||{},b=(l==null?void 0:l.feasibility)||{},T=(l==null?void 0:l.monitoring)||{},Q=(l==null?void 0:l.jira)||{},B=(l==null?void 0:l.next_actions)||[],O=(l==null?void 0:l.founder_decisions)||[],U=(l==null?void 0:l.anomalies)||[],w=((he=l==null?void 0:l.critic_report)==null?void 0:he.recommendations)||[],X=(l==null?void 0:l.task_list)||[],M=((pe=l==null?void 0:l.priority_queue)==null?void 0:pe.slice(0,6))||[];return i.jsxs("section",{className:"section track-page track3-execution",children:[i.jsx("style",{children:`
        .track3-execution .track-page-hero {
          align-items: stretch;
        }

        .track3-shell-card {
          border: 1px solid var(--border);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.86);
          box-shadow: var(--shadow-md);
        }

        body.dark-mode .track3-shell-card {
          background: rgba(255, 255, 255, 0.04);
        }

        .track3-hero-copy,
        .track3-hero-panel,
        .track3-editor-card,
        .track3-results-card,
        .track3-inline-card,
        .track3-task-card,
        .track3-summary-metric,
        .track3-json-preview {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.86);
          box-shadow: var(--shadow-md);
        }

        body.dark-mode .track3-hero-copy,
        body.dark-mode .track3-hero-panel,
        body.dark-mode .track3-editor-card,
        body.dark-mode .track3-results-card,
        body.dark-mode .track3-inline-card,
        body.dark-mode .track3-task-card,
        body.dark-mode .track3-summary-metric,
        body.dark-mode .track3-json-preview {
          background: rgba(255, 255, 255, 0.04);
        }

        .track3-hero-copy,
        .track3-hero-panel,
        .track3-editor-card,
        .track3-results-card {
          padding: 30px;
          border-radius: 30px;
        }

        .track3-hero-copy h1,
        .track3-results-card h2,
        .track3-editor-card h2,
        .track3-inline-card h3 {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          color: var(--navy-900);
        }

        .track3-hero-copy h1 {
          max-width: 11ch;
          font-size: clamp(2.6rem, 5vw, 4.4rem);
          line-height: 0.98;
        }

        .track3-hero-copy p,
        .track3-hero-panel p,
        .track3-editor-subtitle,
        .track3-task-card p,
        .track3-empty,
        .track3-json-preview pre,
        .track3-inline-card li,
        .track3-inline-card span {
          color: var(--text);
          line-height: 1.7;
        }

        .track3-hero-panel {
          display: grid;
          gap: 18px;
          align-content: start;
        }

        .track3-panel-grid,
        .track3-summary-grid,
        .track3-results-grid,
        .track3-meta-grid {
          display: grid;
          gap: 16px;
        }

        .track3-panel-grid,
        .track3-summary-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .track3-results-grid {
          grid-template-columns: 1.1fr 0.9fr;
          margin-top: 22px;
        }

        .track3-inline-card {
          padding: 22px;
          border-radius: 24px;
        }

        .track3-inline-card ul {
          margin: 14px 0 0;
          padding-left: 18px;
        }

        .track3-editor-card,
        .track3-results-card {
          margin-top: 24px;
        }

        .track3-editor-toolbar,
        .track3-editor-actions,
        .track3-pill-row,
        .track3-task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .track3-editor-toolbar {
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .track3-editor-actions {
          margin-top: 18px;
          flex-wrap: wrap;
        }

        .track3-form-section {
          margin-top: 24px;
          padding: 20px;
          border: 1px solid var(--border);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.04);
        }

        .track3-form-section h3 {
          margin-top: 0;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
        }

        .track3-form-group {
          margin-bottom: 16px;
        }

        .track3-form-label {
          display: block;
          margin-bottom: 6px;
          color: var(--navy-900);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .track3-form-input,
        .track3-form-textarea,
        .track3-form-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--gray-300);
          border-radius: 8px;
          background: var(--gray-050);
          color: var(--navy-900);
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
        }

        body.dark-mode .track3-form-input,
        body.dark-mode .track3-form-textarea,
        body.dark-mode .track3-form-select {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .track3-form-input:focus,
        .track3-form-textarea:focus,
        .track3-form-select:focus {
          border-color: rgba(75, 124, 255, 0.55);
          box-shadow: 0 0 0 4px rgba(75, 124, 255, 0.12);
        }

        .track3-form-textarea {
          min-height: 80px;
          resize: vertical;
        }

        .track3-form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .track3-form-item {
          padding: 14px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
          margin-bottom: 12px;
        }

        .track3-form-item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .track3-form-item-actions {
          display: flex;
          gap: 8px;
        }

        .track3-remove-btn {
          padding: 6px 10px;
          background: rgba(239, 68, 68, 0.14);
          color: #b91c1c;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .track3-remove-btn:hover {
          background: rgba(239, 68, 68, 0.24);
        }

        .track3-add-btn {
          padding: 8px 12px;
          background: rgba(75, 124, 255, 0.14);
          color: var(--blue-500);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          margin-top: 8px;
        }

        .track3-add-btn:hover {
          background: rgba(75, 124, 255, 0.24);
        }

        .track3-status-badge {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 800;
          border: 1px solid transparent;
          text-transform: capitalize;
        }

        .track3-status-badge.info {
          color: var(--blue-500);
          background: rgba(75, 124, 255, 0.14);
        }

        .track3-status-badge.good {
          color: #15803d;
          background: rgba(34, 197, 94, 0.14);
        }

        .track3-status-badge.warn {
          color: #b45309;
          background: rgba(245, 158, 11, 0.14);
        }

        .track3-status-badge.danger {
          color: #b91c1c;
          background: rgba(239, 68, 68, 0.14);
        }

        .track3-summary-grid {
          margin-top: 18px;
        }

        .track3-summary-metric {
          padding: 18px;
          border-radius: 22px;
        }

        .track3-summary-metric span {
          display: block;
          margin-bottom: 8px;
          color: var(--text);
        }

        .track3-summary-metric strong {
          display: block;
          color: var(--navy-900);
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.5rem;
          line-height: 1.05;
        }

        .track3-task-list {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .track3-task-card {
          padding: 22px;
          border-radius: 24px;
        }

        .track3-task-header {
          display: flex;
          justify-content: space-between;
          gap: 18px;
        }

        .track3-task-header strong {
          display: block;
          margin-bottom: 8px;
          color: var(--navy-900);
        }

        .track3-task-header p {
          margin: 0;
        }

        .track3-task-meta {
          margin-top: 14px;
          color: var(--text);
          font-size: 0.92rem;
        }

        .track3-meta-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 16px;
        }

        .track3-meta-grid div {
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(18, 51, 100, 0.05);
        }

        body.dark-mode .track3-meta-grid div {
          background: rgba(255, 255, 255, 0.05);
        }

        .track3-meta-grid strong {
          display: block;
          margin-bottom: 6px;
          color: var(--navy-900);
        }

        .track3-message {
          margin-top: 16px;
          padding: 14px 16px;
          border-radius: 18px;
          border: 1px solid rgba(239, 68, 68, 0.22);
          background: rgba(239, 68, 68, 0.08);
          color: #b91c1c;
          font-weight: 700;
        }

        .track3-json-preview {
          margin-top: 18px;
          padding: 18px;
          border-radius: 24px;
          overflow: auto;
        }

        .track3-json-preview pre {
          margin: 0;
          font-family: Consolas, "Courier New", monospace;
          font-size: 0.88rem;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .track3-empty {
          margin: 18px 0 0;
        }

        @media (max-width: 1100px) {
          .track3-results-grid,
          .track3-panel-grid,
          .track3-summary-grid,
          .track3-meta-grid,
          .track3-form-row {
            grid-template-columns: 1fr;
          }

          .track3-task-header {
            flex-direction: column;
          }
        }
      `}),i.jsxs("div",{className:"track-page-hero reveal",children:[i.jsxs("div",{className:"track3-hero-copy",children:[i.jsxs("div",{className:"track-card-top",children:[i.jsx("span",{className:"track-label",children:(e==null?void 0:e.track)||"Track C"}),i.jsx("span",{className:"track-badge",children:(e==null?void 0:e.badge)||"Execution agent"})]}),i.jsx("div",{className:"track-icon large-track-icon",children:(e==null?void 0:e.icon)||"C"}),i.jsx("h1",{children:"Build your execution plan with a simple form."}),i.jsx("p",{children:"Fill in your startup profile, features, team, and deadlines. We'll generate a complete execution plan with tasks, feasibility analysis, and Jira integration."}),i.jsxs("div",{className:"track-highlights",children:[i.jsx("span",{className:"track-chip",children:"Easy form-based input"}),i.jsx("span",{className:"track-chip",children:"Smart execution planning"}),i.jsx("span",{className:"track-chip",children:"Instant Jira sync"})]})]}),i.jsxs("div",{className:"track3-hero-panel",children:[i.jsx("p",{className:"eyebrow",children:"How it works"}),i.jsxs("div",{className:"track3-panel-grid",children:[i.jsxs("div",{className:"track3-inline-card",children:[i.jsx("h3",{children:"1. Your startup"}),i.jsx("p",{children:"Name, objective, problem, and target users."})]}),i.jsxs("div",{className:"track3-inline-card",children:[i.jsx("h3",{children:"2. Your plan"}),i.jsx("p",{children:"Features, admin tasks, and key deadlines."})]}),i.jsxs("div",{className:"track3-inline-card",children:[i.jsx("h3",{children:"3. Your team"}),i.jsx("p",{children:"Team members, roles, skills, and availability."})]}),i.jsxs("div",{className:"track3-inline-card",children:[i.jsx("h3",{children:"4. Get results"}),i.jsx("p",{children:"Execution plan with tasks, priorities, and risks."})]})]})]})]}),i.jsxs("section",{className:"track3-editor-card reveal delay-1",children:[i.jsxs("div",{className:"track3-editor-toolbar",children:[i.jsxs("div",{children:[i.jsx("p",{className:"eyebrow",children:"Startup Planning Form"}),i.jsx("h2",{children:"Build your execution plan"}),i.jsx("p",{className:"track3-editor-subtitle",children:"Fill in each section with your startup details. All fields help generate a better execution plan."})]}),i.jsxs("div",{className:"track3-pill-row",children:[i.jsx(pi,{tone:"info",children:"Interactive form"}),i.jsx(pi,{tone:n?"warn":"good",children:n?"Running":"Ready"})]})]}),i.jsxs("div",{className:"track3-form-section",children:[i.jsx("h3",{children:"📱 Startup Profile"}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Startup Name"}),i.jsx("input",{className:"track3-form-input",type:"text",value:t.startup_profile.name,onChange:E=>x("name",E.target.value),placeholder:"e.g., MedLink"})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Objective"}),i.jsx("input",{className:"track3-form-input",type:"text",value:t.startup_profile.objective,onChange:E=>x("objective",E.target.value),placeholder:"e.g., Launch an MVP for an online booking platform"})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Problem Statement"}),i.jsx("textarea",{className:"track3-form-textarea",value:t.startup_profile.problem_statement,onChange:E=>x("problem_statement",E.target.value),placeholder:"Describe the problem you're solving..."})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Target Users"}),i.jsx("input",{className:"track3-form-input",type:"text",value:t.startup_profile.target_users,onChange:E=>x("target_users",E.target.value),placeholder:"e.g., Urban patients and small clinics"})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"MVP Scope"}),i.jsx("textarea",{className:"track3-form-textarea",value:t.startup_profile.mvp_scope_paragraph,onChange:E=>x("mvp_scope_paragraph",E.target.value),placeholder:"Describe what's included in your MVP..."})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Execution Context"}),i.jsx("textarea",{className:"track3-form-textarea",value:t.startup_profile.execution_context,onChange:E=>x("execution_context",E.target.value),placeholder:"e.g., Small team, 10 weeks, limited budget..."})]})]}),i.jsxs("div",{className:"track3-form-section",children:[i.jsx("h3",{children:"🎯 MVP Features"}),t.mvp_plan.features.map((E,L)=>i.jsxs("div",{className:"track3-form-item",children:[i.jsxs("div",{className:"track3-form-item-header",children:[i.jsxs("span",{style:{fontWeight:600},children:["Feature ",L+1]}),t.mvp_plan.features.length>1&&i.jsx("button",{className:"track3-remove-btn",onClick:()=>m(L),children:"Remove"})]}),i.jsxs("div",{className:"track3-form-row",children:[i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Feature Name"}),i.jsx("input",{className:"track3-form-input",type:"text",value:E.name,onChange:H=>f(L,"name",H.target.value),placeholder:"e.g., User authentication"})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Priority"}),i.jsxs("select",{className:"track3-form-select",value:E.priority,onChange:H=>f(L,"priority",H.target.value),children:[i.jsx("option",{value:"high",children:"High"}),i.jsx("option",{value:"medium",children:"Medium"}),i.jsx("option",{value:"low",children:"Low"})]})]})]})]},L)),i.jsx("button",{className:"track3-add-btn",onClick:g,children:"+ Add Feature"})]}),i.jsxs("div",{className:"track3-form-section",children:[i.jsx("h3",{children:"⚙️ Admin Workflow"}),t.mvp_plan.admin_workflow.map((E,L)=>i.jsxs("div",{className:"track3-form-item",children:[i.jsxs("div",{className:"track3-form-item-header",children:[i.jsxs("span",{style:{fontWeight:600},children:["Task ",L+1]}),t.mvp_plan.admin_workflow.length>1&&i.jsx("button",{className:"track3-remove-btn",onClick:()=>C(L),children:"Remove"})]}),i.jsxs("div",{className:"track3-form-row",children:[i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Task Name"}),i.jsx("input",{className:"track3-form-input",type:"text",value:E.name,onChange:H=>k(L,"name",H.target.value),placeholder:"e.g., Legal registration"})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Priority"}),i.jsxs("select",{className:"track3-form-select",value:E.priority,onChange:H=>k(L,"priority",H.target.value),children:[i.jsx("option",{value:"high",children:"High"}),i.jsx("option",{value:"medium",children:"Medium"}),i.jsx("option",{value:"low",children:"Low"})]})]})]})]},L)),i.jsx("button",{className:"track3-add-btn",onClick:j,children:"+ Add Task"})]}),i.jsxs("div",{className:"track3-form-section",children:[i.jsx("h3",{children:"📅 Key Deadlines"}),i.jsxs("div",{className:"track3-form-row",children:[i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"MVP Launch Date"}),i.jsx("input",{className:"track3-form-input",type:"date",value:t.mvp_plan.deadlines.mvp_launch,onChange:E=>N("mvp_launch",E.target.value)})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Legal Deadline"}),i.jsx("input",{className:"track3-form-input",type:"date",value:t.mvp_plan.deadlines.legal_deadline,onChange:E=>N("legal_deadline",E.target.value)})]})]})]}),i.jsxs("div",{className:"track3-form-section",children:[i.jsx("h3",{children:"👥 Team Members"}),t.team.map((E,L)=>i.jsxs("div",{className:"track3-form-item",children:[i.jsxs("div",{className:"track3-form-item-header",children:[i.jsxs("span",{style:{fontWeight:600},children:["Member ",L+1]}),t.team.length>1&&i.jsx("button",{className:"track3-remove-btn",onClick:()=>q(L),children:"Remove"})]}),i.jsxs("div",{className:"track3-form-row",children:[i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Name"}),i.jsx("input",{className:"track3-form-input",type:"text",value:E.name,onChange:H=>S(L,"name",H.target.value),placeholder:"e.g., Sarah"})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Role"}),i.jsx("input",{className:"track3-form-input",type:"text",value:E.role,onChange:H=>S(L,"role",H.target.value),placeholder:"e.g., Product Manager"})]})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Skills (comma-separated)"}),i.jsx("input",{className:"track3-form-input",type:"text",value:E.skills.join(", "),onChange:H=>S(L,"skills",H.target.value.split(",").map(ae=>ae.trim())),placeholder:"e.g., backend, api, database"})]}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Availability (0-1)"}),i.jsx("input",{className:"track3-form-input",type:"number",min:"0",max:"1",step:"0.1",value:E.availability,onChange:H=>S(L,"availability",parseFloat(H.target.value)||0)})]})]},L)),i.jsx("button",{className:"track3-add-btn",onClick:$,children:"+ Add Team Member"})]}),i.jsxs("div",{className:"track3-form-section",children:[i.jsx("h3",{children:"📝 Founder Notes"}),i.jsxs("div",{className:"track3-form-group",children:[i.jsx("label",{className:"track3-form-label",children:"Any additional notes or context"}),i.jsx("textarea",{className:"track3-form-textarea",value:t.live_status.founder_notes,onChange:E=>J(E.target.value),placeholder:"Add any additional context or notes...",style:{minHeight:"100px"}})]})]}),i.jsxs("div",{className:"track3-editor-actions",children:[i.jsx("button",{className:"primary-btn",type:"button",onClick:we,disabled:n,children:n?"Running execution agent...":"🚀 Run Execution Agent"}),i.jsx("button",{className:"secondary-btn",type:"button",onClick:z,disabled:n,children:"Reset Form"})]}),a?i.jsx("div",{className:"track3-message",children:a}):null]}),l?i.jsxs("section",{className:"track3-results-card reveal delay-2",children:[i.jsx("p",{className:"eyebrow",children:"Execution report"}),i.jsxs("h2",{children:[l.startup_name||"Startup"," execution summary"]}),l._execution_meta&&i.jsxs("div",{style:{marginTop:"16px",padding:"14px",borderRadius:"12px",background:"rgba(34, 197, 94, 0.1)",border:"1px solid rgba(34, 197, 94, 0.3)"},children:[i.jsx("p",{style:{margin:"0 0 8px 0",color:"#15803d",fontWeight:600},children:"✓ Fresh Execution Verified"}),i.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(2, 1fr)",gap:"8px",fontSize:"0.85rem",color:"var(--text)"},children:[i.jsxs("div",{children:[i.jsx("strong",{children:"Execution ID:"})," ",i.jsx("code",{style:{fontSize:"0.8rem"},children:l._execution_meta.execution_id})]}),i.jsxs("div",{children:[i.jsx("strong",{children:"Input Hash:"})," ",i.jsx("code",{style:{fontSize:"0.8rem"},children:l._execution_meta.input_hash})]}),i.jsxs("div",{children:[i.jsx("strong",{children:"Timestamp:"})," ",new Date(l._execution_meta.timestamp).toLocaleString()]}),i.jsxs("div",{children:[i.jsx("strong",{children:"Run #:"})," ",l._execution_meta.execution_number]})]})]}),i.jsxs("div",{className:"track3-summary-grid",children:[i.jsx(ja,{label:"Feasibility",value:b.status||K.feasibility||"unknown",tone:Nl(b.status||K.feasibility)}),i.jsx(ja,{label:"Task count",value:T.task_count||0,tone:"info"}),i.jsx(ja,{label:"Ready tasks",value:T.ready_count||0,tone:"good"}),i.jsx(ja,{label:"Main risk",value:K.main_risk||"N/A",tone:"warn"})]}),i.jsxs("div",{className:"track3-results-grid",children:[i.jsxs("div",{children:[i.jsxs("div",{className:"track3-inline-card",children:[i.jsx("h3",{children:"Executive summary"}),i.jsx("div",{className:"track3-meta-grid",children:Object.entries(K).map(([E,L])=>i.jsxs("div",{children:[i.jsx("strong",{children:yo(E)}),i.jsx("span",{children:String(L??"N/A")})]},E))})]}),i.jsxs("div",{className:"track3-inline-card",style:{marginTop:18},children:[i.jsx("h3",{children:"Next actions"}),B.length===0?i.jsx("p",{className:"track3-empty",children:"No next actions were returned."}):i.jsx("ul",{children:B.map((E,L)=>i.jsx("li",{children:E},`${E}-${L}`))})]}),i.jsxs("div",{className:"track3-inline-card",style:{marginTop:18},children:[i.jsx("h3",{children:"Founder decisions"}),O.length===0?i.jsx("p",{className:"track3-empty",children:"No founder decisions were returned."}):i.jsx("ul",{children:O.map((E,L)=>i.jsx("li",{children:E},`${E}-${L}`))})]})]}),i.jsxs("div",{children:[i.jsxs("div",{className:"track3-inline-card",children:[i.jsx("h3",{children:"Feasibility details"}),i.jsx("div",{className:"track3-meta-grid",children:Object.entries(b).map(([E,L])=>i.jsxs("div",{children:[i.jsx("strong",{children:yo(E)}),i.jsx("span",{children:String(L??"N/A")})]},E))})]}),i.jsxs("div",{className:"track3-inline-card",style:{marginTop:18},children:[i.jsx("h3",{children:"Jira sync"}),i.jsx("div",{className:"track3-meta-grid",children:Object.keys(Q).length===0?i.jsxs("div",{children:[i.jsx("strong",{children:"Status"}),i.jsx("span",{children:"No Jira summary returned."})]}):Object.entries(Q).map(([E,L])=>i.jsxs("div",{children:[i.jsx("strong",{children:yo(E)}),i.jsx("span",{children:String(L??"N/A")})]},E))})]}),i.jsxs("div",{className:"track3-inline-card",style:{marginTop:18},children:[i.jsx("h3",{children:"Risks and recommendations"}),U.length===0&&w.length===0?i.jsx("p",{className:"track3-empty",children:"No major anomaly or recommendation was returned."}):i.jsxs("ul",{children:[U.slice(0,4).map((E,L)=>i.jsx("li",{children:Bd(E)},`anomaly-${L}`)),w.slice(0,4).map((E,L)=>i.jsx("li",{children:E},`recommendation-${L}`))]})]})]})]}),i.jsxs("div",{className:"track3-inline-card",style:{marginTop:22},children:[i.jsx("h3",{children:"Top priority tasks"}),M.length===0?i.jsx("p",{className:"track3-empty",children:"No priority queue was returned."}):i.jsx("div",{className:"track3-task-list",children:M.map(E=>i.jsx(Wd,{task:E},E.id||E.title))})]}),i.jsxs("div",{className:"track3-inline-card",style:{marginTop:22},children:[i.jsx("h3",{children:"All generated tasks"}),X.length===0?i.jsx("p",{className:"track3-empty",children:"No generated tasks were returned."}):i.jsx("div",{className:"track3-task-list",children:X.map(E=>i.jsx(Wd,{task:E},E.id||E.title))})]}),i.jsxs("div",{className:"track3-inline-card",style:{marginTop:22},children:[i.jsx("h3",{children:"📊 Execution History"}),u.length===0?i.jsx("p",{className:"track3-empty",children:"This is your first execution."}):i.jsxs("div",{style:{fontSize:"0.9rem",overflowX:"auto"},children:[i.jsxs("table",{style:{width:"100%",borderCollapse:"collapse"},children:[i.jsx("thead",{children:i.jsxs("tr",{style:{borderBottom:"1px solid var(--border)"},children:[i.jsx("th",{style:{textAlign:"left",padding:"8px",color:"var(--navy-900)",fontWeight:600},children:"Run"}),i.jsx("th",{style:{textAlign:"left",padding:"8px",color:"var(--navy-900)",fontWeight:600},children:"Startup"}),i.jsx("th",{style:{textAlign:"left",padding:"8px",color:"var(--navy-900)",fontWeight:600},children:"Tasks"}),i.jsx("th",{style:{textAlign:"left",padding:"8px",color:"var(--navy-900)",fontWeight:600},children:"Input Hash"}),i.jsx("th",{style:{textAlign:"left",padding:"8px",color:"var(--navy-900)",fontWeight:600},children:"Time"})]})}),i.jsx("tbody",{children:u.slice(0,5).map((E,L)=>i.jsxs("tr",{style:{borderBottom:"1px solid var(--border)"},children:[i.jsxs("td",{style:{padding:"8px",color:"var(--text)"},children:["#",u.length-L]}),i.jsx("td",{style:{padding:"8px",color:"var(--text)"},children:E.startup}),i.jsx("td",{style:{padding:"8px",color:"var(--text)"},children:E.taskCount}),i.jsx("td",{style:{padding:"8px",color:"var(--text)",fontSize:"0.75rem"},children:i.jsx("code",{children:E.inputHash})}),i.jsx("td",{style:{padding:"8px",color:"var(--text)",fontSize:"0.8rem"},children:new Date(E.timestamp).toLocaleTimeString()})]},E.id))})]}),u.length>5&&i.jsxs("p",{style:{marginTop:"8px",color:"var(--text)",fontSize:"0.85rem"},children:["... and ",u.length-5," more executions"]})]})]}),i.jsxs("details",{className:"track3-json-preview",children:[i.jsx("summary",{children:"View raw response JSON"}),i.jsx("pre",{children:Bd(l)})]})]}):null]})}const pk="http://127.0.0.1:5057",fk=`${pk}/pitch/analyze`;function qd({children:e,tone:t="info"}){return i.jsx("span",{className:`track3-status-badge ${t}`,children:e})}function gk({track:e}){var S,$,q,J,we;const[t,r]=I.useState(null),[n,s]=I.useState(""),[a,o]=I.useState("investor"),[l,c]=I.useState(!1),[u,d]=I.useState(!1),[h,p]=I.useState("medium"),[v,y]=I.useState(!1),[x,N]=I.useState(""),[f,g]=I.useState(null),m=I.useRef(null),k=z=>{var Q;const K=(Q=z.target.files)==null?void 0:Q[0];if(!K)return;if(![".mp4",".mov",".mkv"].some(B=>K.name.toLowerCase().endsWith(B))||!["video/mp4","video/quicktime","video/x-matroska"].includes(K.type)){N("Please upload an MP4, MOV, or MKV video file");return}r(K),s(URL.createObjectURL(K)),N(""),g(null),console.log(`Video file selected: ${K.name} (${(K.size/1024/1024).toFixed(2)} MB, ${K.type})`)},j=async()=>{if(!t){N("Please select a video file");return}y(!0),N("");try{const z=new FormData;z.append("file",t),z.append("coaching_mode",a),z.append("skip_visual",l?"true":"false"),z.append("skip_voice_emotion",u?"true":"false"),z.append("whisper_size",h),console.log("Sending analysis request with:"),console.log(`  - File: ${t.name} (${t.size} bytes)`),console.log(`  - Coaching Mode: ${a}`),console.log(`  - Skip Visual: ${l}`),console.log(`  - Skip Voice: ${u}`),console.log(`  - Whisper Size: ${h}`);const K=await fetch(fk,{method:"POST",body:z}),b=await K.json();if(!K.ok||b.error)throw console.error("API Error:",b),new Error(b.error||`API Error: ${K.status}`);console.log("Analysis successful:",b),g(b),window.scrollTo({top:0,behavior:"smooth"})}catch(z){console.error("Analysis error:",z),g(null),N(z.message||"Analysis failed")}finally{y(!1)}},C=()=>{n&&URL.revokeObjectURL(n),r(null),s(""),N(""),g(null),o("investor"),c(!1),d(!1),p("medium"),m.current&&(m.current.value="")};return i.jsxs("section",{className:"section track-page track3-pitch-coach",children:[i.jsx("style",{children:`
        .track3-pitch-coach .track-page-hero {
          align-items: stretch;
        }

        .pitch-upload-area {
          border: 2px dashed var(--border);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: rgba(75, 124, 255, 0.04);
        }

        .pitch-upload-area:hover {
          border-color: rgba(75, 124, 255, 0.5);
          background: rgba(75, 124, 255, 0.08);
        }

        .pitch-upload-area.has-file {
          border-color: rgba(34, 197, 94, 0.3);
          background: rgba(34, 197, 94, 0.08);
        }

        .pitch-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }

        .pitch-option {
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.02);
        }

        .pitch-option label {
          display: block;
          margin-bottom: 8px;
          color: var(--navy-900);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .pitch-option select,
        .pitch-option input[type="checkbox"] {
          width: 100%;
          padding: 8px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--gray-050);
          color: var(--navy-900);
          font-size: 0.9rem;
        }

        body.dark-mode .pitch-option select,
        body.dark-mode .pitch-option input[type="checkbox"] {
          background: rgba(255, 255, 255, 0.04);
        }

        .pitch-checkbox-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pitch-checkbox-group input {
          width: auto;
        }

        .pitch-checkbox-group label {
          margin-bottom: 0;
        }

        .pitch-video-preview {
          margin-top: 16px;
          border-radius: 12px;
          overflow: hidden;
          max-width: 100%;
          max-height: 300px;
        }

        .track3-results-card {
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.86);
          box-shadow: var(--shadow-md);
          padding: 30px;
          border-radius: 30px;
          margin-top: 24px;
        }

        body.dark-mode .track3-results-card {
          background: rgba(255, 255, 255, 0.04);
        }

        .pitch-scores-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        .pitch-insights {
          padding: 20px;
          border-radius: 12px;
          background: rgba(75, 124, 255, 0.08);
          border: 1px solid rgba(75, 124, 255, 0.2);
          margin-top: 20px;
        }

        .pitch-insights h4 {
          margin: 0 0 12px 0;
          color: var(--navy-900);
        }

        .pitch-insights ul {
          margin: 0;
          padding-left: 20px;
        }

        .pitch-insights li {
          color: var(--text);
          margin-bottom: 8px;
          line-height: 1.6;
        }
      `}),i.jsxs("div",{className:"track-page-hero reveal",children:[i.jsxs("div",{className:"track3-hero-copy",children:[i.jsxs("div",{className:"track-card-top",children:[i.jsx("span",{className:"track-label",children:(e==null?void 0:e.track)||"Track C"}),i.jsx("span",{className:"track-badge",children:"Pitch Coach"})]}),i.jsx("div",{className:"track-icon large-track-icon",style:{fontSize:"3.5rem"},children:"C"}),i.jsx("h1",{children:"Pitch Coach AI"}),i.jsx("p",{children:"Get intelligent feedback on your pitch video. Analyze delivery, content, narrative, and presence."}),i.jsxs("div",{className:"track-highlights",children:[i.jsx("span",{className:"track-chip",children:"Delivery Analysis"}),i.jsx("span",{className:"track-chip",children:"Content Review"}),i.jsx("span",{className:"track-chip",children:"Visual Feedback"})]})]}),i.jsxs("div",{className:"track3-hero-panel",children:[i.jsx("p",{className:"eyebrow",children:"What we analyze"}),i.jsxs("div",{className:"track3-panel-grid",children:[i.jsxs("div",{className:"track3-inline-card",children:[i.jsx("h3",{children:"Delivery"}),i.jsx("p",{children:"Pace, energy, filler words, sentence structure, and presentation clarity."})]}),i.jsxs("div",{className:"track3-inline-card",children:[i.jsx("h3",{children:"Content"}),i.jsx("p",{children:"Pitch messaging, structure, value proposition clarity, and investor appeal."})]}),i.jsxs("div",{className:"track3-inline-card",children:[i.jsx("h3",{children:"Visuals"}),i.jsx("p",{children:"Framing, posture, expressions, and visual confidence cues (optional)."})]}),i.jsxs("div",{className:"track3-inline-card",children:[i.jsx("h3",{children:"Voice"}),i.jsx("p",{children:"Tone, emotion, confidence, and vocal assurance throughout the pitch (optional)."})]})]})]})]}),i.jsxs("section",{className:"track3-editor-card reveal delay-1",children:[i.jsxs("div",{className:"track3-editor-toolbar",children:[i.jsxs("div",{children:[i.jsx("p",{className:"eyebrow",children:"Upload & Analyze"}),i.jsx("h2",{children:"Pitch Video Analysis"}),i.jsx("p",{className:"track3-editor-subtitle",children:"Upload an MP4, MOV, or MKV video. We'll analyze your pitch and provide detailed feedback."})]}),i.jsxs("div",{className:"track3-pill-row",children:[i.jsx(qd,{tone:"info",children:"Video Analysis"}),i.jsx(qd,{tone:v?"warn":"good",children:v?"Analyzing":"Ready"})]})]}),i.jsxs("div",{className:`pitch-upload-area ${t?"has-file":""}`,onClick:()=>{var z;return(z=m.current)==null?void 0:z.click()},children:[n?i.jsxs("div",{children:[i.jsx("video",{src:n,className:"pitch-video-preview",controls:!0}),i.jsx("p",{style:{marginTop:"12px",color:"var(--text)"},children:i.jsx("strong",{children:t==null?void 0:t.name})}),i.jsx("p",{style:{color:"var(--text)",fontSize:"0.9rem"},children:"Click to change video"})]}):i.jsxs("div",{children:[i.jsx("div",{style:{fontSize:"3rem",marginBottom:"12px"},children:"↑"}),i.jsx("p",{style:{color:"var(--navy-900)",fontWeight:600,margin:"0 0 4px 0"},children:"Click to upload your pitch video"}),i.jsx("p",{style:{color:"var(--text)",margin:"0",fontSize:"0.9rem"},children:"MP4, MOV, or MKV • Up to 500MB"})]}),i.jsx("input",{ref:m,type:"file",accept:"video/mp4,video/quicktime,video/x-matroska,.mp4,.mov,.mkv",style:{display:"none"},onChange:k})]}),i.jsxs("div",{className:"pitch-options-grid",children:[i.jsxs("div",{className:"pitch-option",children:[i.jsx("label",{children:"Coaching Mode"}),i.jsxs("select",{value:a,onChange:z=>o(z.target.value),children:[i.jsx("option",{value:"investor",children:"Investor Pitch"}),i.jsx("option",{value:"sales",children:"Sales Pitch"}),i.jsx("option",{value:"demo_day",children:"Demo Day"}),i.jsx("option",{value:"class_presentation",children:"Class Presentation"}),i.jsx("option",{value:"founder_story",children:"Founder Story"})]})]}),i.jsxs("div",{className:"pitch-option",children:[i.jsx("label",{children:"Whisper Model Size"}),i.jsxs("select",{value:h,onChange:z=>p(z.target.value),children:[i.jsx("option",{value:"tiny",children:"Tiny (Fast)"}),i.jsx("option",{value:"base",children:"Base"}),i.jsx("option",{value:"small",children:"Small"}),i.jsx("option",{value:"medium",children:"Medium"}),i.jsx("option",{value:"large-v3",children:"Large (Accurate)"})]})]}),i.jsxs("div",{className:"pitch-option",children:[i.jsxs("div",{className:"pitch-checkbox-group",children:[i.jsx("input",{type:"checkbox",id:"skipVisual",checked:l,onChange:z=>c(z.target.checked)}),i.jsx("label",{htmlFor:"skipVisual",children:"Skip Visual Analysis"})]}),i.jsx("p",{style:{fontSize:"0.85rem",color:"var(--text)",margin:"8px 0 0 0"},children:"Faster analysis, no face/posture feedback"})]}),i.jsxs("div",{className:"pitch-option",children:[i.jsxs("div",{className:"pitch-checkbox-group",children:[i.jsx("input",{type:"checkbox",id:"skipVoice",checked:u,onChange:z=>d(z.target.checked)}),i.jsx("label",{htmlFor:"skipVoice",children:"Skip Voice Emotion"})]}),i.jsx("p",{style:{fontSize:"0.85rem",color:"var(--text)",margin:"8px 0 0 0"},children:"Faster analysis, no tone/emotion feedback"})]})]}),i.jsxs("div",{className:"track3-editor-actions",children:[i.jsx("button",{className:"primary-btn",onClick:j,disabled:v||!t,style:{opacity:v||!t?.6:1},children:v?"Analyzing Your Pitch...":"Analyze Pitch"}),i.jsx("button",{className:"secondary-btn",onClick:C,disabled:v,children:"Reset"})]}),x&&i.jsx("div",{className:"track3-message",children:x})]}),f?i.jsxs("section",{className:"track3-results-card reveal delay-2",children:[i.jsx("p",{className:"eyebrow",children:"Analysis Report"}),i.jsx("h2",{children:"Your Pitch Feedback"}),f._execution_meta&&i.jsxs("div",{style:{marginTop:"20px",padding:"20px",borderRadius:"12px",background:"linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",border:"2px solid rgba(34, 197, 94, 0.3)"},children:[i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"16px"},children:[i.jsx("span",{style:{fontSize:"1.5rem"},children:"✓"}),i.jsx("h3",{style:{margin:"0",color:"#15803d",fontSize:"1.2rem"},children:"Unique Analysis Generated"})]}),i.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(250px, 1fr))",gap:"16px",marginBottom:"16px"},children:[i.jsxs("div",{style:{padding:"12px",backgroundColor:"rgba(255,255,255,0.5)",borderRadius:"8px"},children:[i.jsx("p",{style:{margin:"0 0 4px 0",fontSize:"0.85rem",color:"var(--text-muted)"},children:"Execution ID"}),i.jsx("code",{style:{fontSize:"0.9rem",fontWeight:"600",color:"var(--navy-900)",wordBreak:"break-all"},children:f._execution_meta.execution_id})]}),i.jsxs("div",{style:{padding:"12px",backgroundColor:"rgba(255,255,255,0.5)",borderRadius:"8px"},children:[i.jsx("p",{style:{margin:"0 0 4px 0",fontSize:"0.85rem",color:"var(--text-muted)"},children:"File Hash"}),i.jsx("code",{style:{fontSize:"0.9rem",fontWeight:"600",color:"var(--navy-900)"},children:f._execution_meta.file_hash})]}),i.jsxs("div",{style:{padding:"12px",backgroundColor:"rgba(255,255,255,0.5)",borderRadius:"8px"},children:[i.jsx("p",{style:{margin:"0 0 4px 0",fontSize:"0.85rem",color:"var(--text-muted)"},children:"Timestamp"}),i.jsx("p",{style:{margin:"0",fontSize:"0.9rem",fontWeight:"600",color:"var(--navy-900)"},children:new Date(f._execution_meta.timestamp).toLocaleString()})]}),i.jsxs("div",{style:{padding:"12px",backgroundColor:"rgba(255,255,255,0.5)",borderRadius:"8px"},children:[i.jsx("p",{style:{margin:"0 0 4px 0",fontSize:"0.85rem",color:"var(--text-muted)"},children:"Video File"}),i.jsx("p",{style:{margin:"0",fontSize:"0.9rem",fontWeight:"600",color:"var(--navy-900)"},children:f._execution_meta.filename})]}),i.jsxs("div",{style:{padding:"12px",backgroundColor:"rgba(255,255,255,0.5)",borderRadius:"8px"},children:[i.jsx("p",{style:{margin:"0 0 4px 0",fontSize:"0.85rem",color:"var(--text-muted)"},children:"File Size"}),i.jsxs("p",{style:{margin:"0",fontSize:"0.9rem",fontWeight:"600",color:"var(--navy-900)"},children:[f._execution_meta.file_size_kb," KB"]})]}),i.jsxs("div",{style:{padding:"12px",backgroundColor:"rgba(255,255,255,0.5)",borderRadius:"8px"},children:[i.jsx("p",{style:{margin:"0 0 4px 0",fontSize:"0.85rem",color:"var(--text-muted)"},children:"Coaching Mode"}),i.jsx("p",{style:{margin:"0",fontSize:"0.9rem",fontWeight:"600",color:"var(--navy-900)"},children:f._execution_meta.coaching_mode.charAt(0).toUpperCase()+f._execution_meta.coaching_mode.slice(1)})]}),i.jsxs("div",{style:{padding:"12px",backgroundColor:"rgba(255,255,255,0.5)",borderRadius:"8px"},children:[i.jsx("p",{style:{margin:"0 0 4px 0",fontSize:"0.85rem",color:"var(--text-muted)"},children:"Visual Analysis"}),i.jsx("p",{style:{margin:"0",fontSize:"0.9rem",fontWeight:"600",color:"var(--navy-900)"},children:f._execution_meta.skip_visual?"⊘ Skipped":"✓ Enabled"})]}),i.jsxs("div",{style:{padding:"12px",backgroundColor:"rgba(255,255,255,0.5)",borderRadius:"8px"},children:[i.jsx("p",{style:{margin:"0 0 4px 0",fontSize:"0.85rem",color:"var(--text-muted)"},children:"Voice Emotion"}),i.jsx("p",{style:{margin:"0",fontSize:"0.9rem",fontWeight:"600",color:"var(--navy-900)"},children:f._execution_meta.skip_voice_emotion?"⊘ Skipped":"✓ Enabled"})]})]})]}),i.jsxs("div",{style:{display:"flex",gap:"12px",marginTop:"20px",flexWrap:"wrap"},children:[i.jsx("button",{onClick:()=>{(async()=>{var Cc,Ac,Rc,Pc,Oc,Lc,$c,Ic,Uc,zc,Dc,Fc,Mc,Bc,Wc,Hc,Vc,qc,Kc,Gc;window.jspdf||await new Promise((P,R)=>{const Y=document.createElement("script");Y.src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",Y.onload=P,Y.onerror=R,document.head.appendChild(Y)});const{jsPDF:K}=window.jspdf,b=new K({unit:"mm",format:"a4"}),T=b.internal.pageSize.getWidth(),Q=b.internal.pageSize.getHeight(),B=18,O=T-B,U=T-B*2;let w=22;const X=(P=12)=>{w+P>Q-15&&(b.addPage(),w=18)},M=(P,R=10,Y=!1,ne=[15,30,60],re=0)=>{b.setFontSize(R),b.setFont("helvetica",Y?"bold":"normal"),b.setTextColor(...ne);const Ve=b.splitTextToSize(String(P??""),U-re);X(Ve.length*R*.42+2),b.text(Ve,B+re,w),w+=Ve.length*R*.42+2},he=(P=[210,218,235])=>{X(8),b.setDrawColor(...P),b.setLineWidth(.3),b.line(B,w,O,w),w+=6},pe=(P,R=[13,33,69])=>{X(16),w+=4,b.setFillColor(240,244,255),b.setDrawColor(180,195,230),b.roundedRect(B,w-5,U,10,2,2,"FD"),M(P,12,!0,R),w+=1},E=(P,R,Y,ne,re=0)=>{X(20);const Ve=R??0,Jc=Ve>=80?[21,128,61]:Ve>=60?[180,83,9]:[185,28,28];b.setFontSize(10),b.setFont("helvetica","bold"),b.setTextColor(15,30,60),b.text(P,B+re,w);const Yc=`${Ve}/100${Y?" — "+Y:""}`;b.setFontSize(9),b.setFont("helvetica","bold"),b.setTextColor(...Jc),b.text(Yc,O-b.getTextWidth(Yc),w),w+=5,b.setFillColor(220,225,235),b.roundedRect(B+re,w,U-re,3,1,1,"F"),b.setFillColor(...Jc),b.roundedRect(B+re,w,(U-re)*Ve/100,3,1,1,"F"),w+=6,ne&&M(ne,8.5,!1,[90,100,120],re),w+=1},L=(P,R,Y=4)=>{if(!R&&R!==0)return;X(8),b.setFontSize(9),b.setFont("helvetica","bold"),b.setTextColor(60,70,100),b.text(`${P}:`,B+Y,w),b.setFont("helvetica","normal"),b.setTextColor(40,50,70);const ne=typeof R=="object"?JSON.stringify(R):String(R),re=b.splitTextToSize(ne,U-Y-30);b.text(re,B+Y+30,w),w+=re.length*9*.42+1},H=(P,R=6,Y=[40,50,70])=>{X(8),b.setFontSize(9),b.setFont("helvetica","normal"),b.setTextColor(...Y);const ne=b.splitTextToSize(`• ${P}`,U-R);b.text(ne,B+R,w),w+=ne.length*9*.42+1.5},ae=(P,R)=>{if(R==null)return;X(7);const Y=typeof R=="number"?R:0,ne=Y>=75?[21,128,61]:Y>=50?[180,83,9]:[185,28,28];b.setFontSize(8.5),b.setFont("helvetica","normal"),b.setTextColor(60,70,100),b.text(P.replace(/_/g," ").replace(/\b\w/g,re=>re.toUpperCase()),B+8,w),b.setFont("helvetica","bold"),b.setTextColor(...ne),b.text(`${Y}`,O-12,w),w+=5},le=((Cc=f.reports)==null?void 0:Cc.scorecard)||{},Ie=((Ac=f.reports)==null?void 0:Ac.full_report)||{},We=Ie.final_report||Ie,ar=((Rc=f.reports)==null?void 0:Rc.markdown)||We.markdown_report||"",Wn=((Oc=(Pc=Ie.agent_state)==null?void 0:Pc.analyses)==null?void 0:Oc.content)||We.content||{},Js=(($c=(Lc=Ie.agent_state)==null?void 0:Lc.analyses)==null?void 0:$c.narrative)||We.narrative||{},Li=((Uc=(Ic=Ie.agent_state)==null?void 0:Ic.analyses)==null?void 0:Uc.delivery)||We.delivery||{},Pt=((Dc=(zc=Ie.agent_state)==null?void 0:zc.analyses)==null?void 0:Dc.audio_features)||We.audio_features||{},Hn=((Mc=(Fc=Ie.agent_state)==null?void 0:Fc.analyses)==null?void 0:Mc.rewrites)||We.rewrites||[],He=Ie.strategy||We.strategy||{},_=f._execution_meta||{};b.setFillColor(13,33,69),b.rect(0,0,T,52,"F"),b.setFontSize(22),b.setFont("helvetica","bold"),b.setTextColor(255,255,255),b.text("Pitch Coach Report",B,24),b.setFontSize(10),b.setFont("helvetica","normal"),b.setTextColor(160,180,220),b.text(`Mode: ${_.coaching_mode||"investor"}`,B,34);const G=_.filename||"",ee=G.length>70?G.slice(0,67)+"...":G;if(b.text(ee,B,40),b.text(`Generated: ${_.timestamp?new Date(_.timestamp).toLocaleString():new Date().toLocaleString()}`,B,46),w=60,le.overall_score!==void 0){const P=le.overall_score,R=P>=80?[21,128,61]:P>=60?[180,83,9]:[185,28,28],Y=P>=80?[220,252,231]:P>=60?[254,243,199]:[254,226,226];b.setFillColor(...Y),b.roundedRect(B,w,U,22,3,3,"F"),b.setFontSize(28),b.setFont("helvetica","bold"),b.setTextColor(...R),b.text(`${P}`,B+6,w+16),b.setFontSize(11),b.setTextColor(15,30,60),b.text(`/ 100  —  ${le.overall_status||""}`,B+24,w+10),b.setFontSize(8.5),b.setFont("helvetica","normal"),b.setTextColor(90,100,120),b.text("Overall weighted pitch score across all analysis dimensions",B+24,w+17),w+=28,he()}pe("Scorecard");const xe=Array.isArray(le.criteria)?le.criteria:[];xe.forEach(P=>{if(!P)return;E(P.label||P.id,P.score,P.status,P.what_it_means);const R=P.evidence||{};if(P.id==="content_clarity"&&Object.keys(R).length&&(Array.isArray(R.covered_parts)&&R.covered_parts.length&&M(`Covered: ${R.covered_parts.join(", ")}`,8,!1,[21,128,61],6),Array.isArray(R.missing_parts)&&R.missing_parts.length&&M(`Missing: ${R.missing_parts.join(", ")}`,8,!1,[185,28,28],6),Array.isArray(R.weak_parts)&&R.weak_parts.length&&M(`Weak: ${R.weak_parts.join(", ")}`,8,!1,[180,83,9],6),R.main_content_issue&&M(`Issue: ${R.main_content_issue}`,8,!1,[100,50,0],6)),P.id==="delivery_fluency"&&Object.keys(R).length){const Y=[];R.words_per_minute&&Y.push(`${R.words_per_minute} WPM`),R.filler_count!==void 0&&Y.push(`${R.filler_count} filler words`),R.avg_sentence_length_words&&Y.push(`avg ${R.avg_sentence_length_words} words/sentence`),Y.length&&M(`Audio metrics: ${Y.join("  |  ")}`,8,!1,[60,70,100],6)}if(P.id==="narrative_strength"&&R.signals){const Y=R.signals;Object.entries({opening_hook_score:"Opening hook",problem_clarity_score:"Problem clarity",solution_flow_score:"Solution flow",proof_strength_score:"Proof strength",closing_score:"Closing",ask_clarity_score:"Ask clarity",memorability_score:"Memorability"}).forEach(([re,Ve])=>{Y[re]!==void 0&&ae(Ve,Y[re])})}w+=1});const ut=le.summary||{};if(((Bc=ut.strongest_criteria)!=null&&Bc.length||(Wc=ut.weakest_criteria)!=null&&Wc.length)&&(he([220,230,245]),(Hc=ut.strongest_criteria)!=null&&Hc.length&&(M("Strongest Areas",10,!0,[21,128,61]),ut.strongest_criteria.forEach(P=>H(`${P.label}: ${P.score}/100`,6,[21,128,61]))),(Vc=ut.weakest_criteria)!=null&&Vc.length&&(w+=2,M("Priority Improvements",10,!0,[185,28,28]),ut.weakest_criteria.forEach(P=>H(`${P.label}: ${P.score}/100`,6,[185,28,28])))),he(),Object.keys(Wn).length||(qc=xe.find(P=>P.id==="content_clarity"))!=null&&qc.evidence){const P=Object.keys(Wn).length?Wn:((Kc=xe.find(Y=>Y.id==="content_clarity"))==null?void 0:Kc.evidence)||{};pe("Content Analysis"),P.main_content_issue&&(M(`Main Issue: ${P.main_content_issue}`,9.5,!0,[140,50,0]),w+=1),P.recommended_fix&&(M(P.recommended_fix,9,!1,[60,70,100]),w+=2);const R=P.component_feedback||{};Object.keys(R).length&&(M("Component Breakdown",10,!0),w+=1,Object.entries(R).forEach(([Y,ne])=>{if(!ne)return;X(10),b.setFontSize(9),b.setFont("helvetica","bold"),b.setTextColor(40,60,120),b.text(Y.replace(/_/g," ").replace(/\b\w/g,Ve=>Ve.toUpperCase())+":",B+4,w),b.setFont("helvetica","normal"),b.setTextColor(50,60,80);const re=b.splitTextToSize(String(ne),U-50);b.text(re,B+40,w),w+=Math.max(re.length*9*.42,5)+1})),Array.isArray(P.evidence)&&P.evidence.length&&(w+=2,M("Evidence",10,!0),P.evidence.slice(0,8).forEach(Y=>H(String(Y)))),he()}const _e=xe.find(P=>P.id==="narrative_strength"),ke=Object.keys(Js).length?Js:(_e==null?void 0:_e.evidence)||{};if(ke.narrative_summary||ke.signals){pe("Narrative Analysis"),ke.narrative_summary&&(M(ke.narrative_summary,9.5,!1,[40,50,80]),w+=2);const P=ke.signals||ke,R={opening_hook_score:"Opening Hook",problem_clarity_score:"Problem Clarity",solution_flow_score:"Solution Flow",proof_strength_score:"Proof Strength",ask_clarity_score:"Ask Clarity",closing_score:"Closing",memorability_score:"Memorability"};Object.keys(R).some(ne=>P[ne]!==void 0)&&(M("Sub-scores",10,!0),w+=1,Object.entries(R).forEach(([ne,re])=>{P[ne]!==void 0&&ae(re,P[ne])})),w+=2,ke.strongest_narrative_point&&M(`Strongest Point: ${ke.strongest_narrative_point}`,9,!1,[21,128,61]),ke.weakest_narrative_point&&M(`Weakest Point: ${ke.weakest_narrative_point}`,9,!1,[185,28,28]),Array.isArray(ke.key_gaps)&&ke.key_gaps.length&&(w+=2,M("Key Gaps",10,!0,[185,28,28]),ke.key_gaps.forEach(ne=>H(String(ne),6,[140,40,0]))),Array.isArray(ke.coaching_directions)&&ke.coaching_directions.length&&(w+=2,M("Coaching Directions",10,!0,[21,80,130]),ke.coaching_directions.forEach(ne=>H(String(ne),6,[20,80,140]))),he()}const Bt=xe.find(P=>P.id==="delivery_fluency"),ir=Li.observations||(Bt==null?void 0:Bt.evidence)||Pt;if(ir&&Object.keys(ir).length){pe("Delivery Analysis");const P=ir.words_per_minute??Pt.words_per_minute,R=ir.filler_count??Pt.filler_count,Y=ir.mean_energy??Pt.mean_energy,ne=ir.avg_sentence_length_words??Pt.avg_sentence_length_words,re=Pt.duration_sec,Ve=Pt.word_count;P!==void 0&&L("Speaking pace",`${P} words per minute${P<110?" (too slow)":P>170?" (too fast)":" (good range)"}`),R!==void 0&&L("Filler words",`${R} total${R>5?" — consider reducing":R===0?" — excellent":" — acceptable"}`),ne!==void 0&&L("Avg sentence length",`${ne} words${ne>24?" — sentences may be too long":" — good"}`),Y!==void 0&&L("Audio energy",`${parseFloat(Y).toFixed(4)}${Y>.02?" — strong vocal presence":" — consider projecting more"}`),re&&L("Total duration",`${Math.floor(re/60)}m ${Math.round(re%60)}s`),Ve&&L("Total word count",Ve),he()}if(He.dominant_problem||Array.isArray(He.top_priorities)&&He.top_priorities.length){pe("Coaching Strategy"),He.dominant_problem&&(M("Dominant Problem",10,!0,[140,40,0]),M(He.dominant_problem,9.5,!1,[80,40,0]),w+=1,He.why_this_is_dominant&&M(He.why_this_is_dominant,9,!1,[100,60,20]),w+=2);const P=He.top_priorities||[];P.length&&(M("Top Priorities",10,!0),P.forEach((R,Y)=>{X(24),w+=2,b.setFillColor(245,248,255),b.roundedRect(B,w-4,U,4,1,1,"F"),M(`${Y+1}. ${R.area||""}`,9.5,!0,[13,33,69]),R.evidence&&M(`Evidence: ${R.evidence}`,8.5,!1,[80,90,120],4),R.coaching_action&&M(`Action: ${R.coaching_action}`,8.5,!1,[40,100,60],4),R.success_test&&M(`Success test: ${R.success_test}`,8.5,!1,[100,80,20],4)})),Array.isArray(He.what_not_to_focus_on_yet)&&He.what_not_to_focus_on_yet.length&&(w+=2,M("What Not to Focus on Yet",10,!0,[100,100,100]),He.what_not_to_focus_on_yet.forEach(R=>H(`${R.area}: ${R.reason}`,6,[120,120,130]))),he()}const bt=He.next_best_action||We.next_best_action;if(bt){pe("Next Best Action",[20,100,60]),b.setFillColor(220,252,231),b.roundedRect(B,w,U,30,3,3,"F");const P=typeof bt=="string"?bt:bt.action||"",R=typeof bt=="object"?bt.why:"",Y=typeof bt=="object"?bt.success_test:"";b.setFontSize(11),b.setFont("helvetica","bold"),b.setTextColor(15,100,50);const ne=b.splitTextToSize(P,U-8);if(b.text(ne,B+4,w+9),w+=ne.length*11*.42+12,R){b.setFontSize(9),b.setFont("helvetica","normal"),b.setTextColor(40,100,60);const re=b.splitTextToSize(`Why: ${R}`,U-8);b.text(re,B+4,w),w+=re.length*9*.42+2}if(Y){b.setFontSize(9),b.setTextColor(60,120,80);const re=b.splitTextToSize(`Success test: ${Y}`,U-8);b.text(re,B+4,w),w+=re.length*9*.42+2}w+=4,he()}const Ec=Array.isArray(Hn)?Hn:[];Ec.length>0&&(pe("Suggested Rewrites"),Ec.forEach(P=>{P&&(X(20),M(`Part: ${(P.part||"").toUpperCase()}`,10,!0,[13,33,100]),P.original&&(M("Original:",9,!0,[150,50,50]),M(P.original,9,!1,[120,50,50],4),w+=1),P.improved&&(M("Improved:",9,!0,[21,128,61]),M(P.improved,9,!1,[20,100,50],4)),w+=4)}),he()),ar&&(pe("Full Coaching Report"),ar.split(`
`).forEach(P=>{const R=P.trim();if(!R){w+=2;return}R.startsWith("# ")?(M(R.slice(2),13,!0,[13,33,69]),w+=1):R.startsWith("## ")?(w+=2,M(R.slice(3),11,!0,[30,60,140])):R.startsWith("### ")?M(R.slice(4),10,!0,[50,80,160]):R.startsWith("- ")||R.startsWith("* ")?H(R.slice(2)):/^\d+\.\s/.test(R)?H(R,6):M(R,9,!1,[40,50,70])}),he()),(Gc=We.limitations)!=null&&Gc.length&&(pe("Limitations & Notes",[100,80,0]),We.limitations.forEach(P=>H(P,4,[120,80,0])));const Tc=b.internal.getNumberOfPages();for(let P=1;P<=Tc;P++)b.setPage(P),b.setFontSize(7.5),b.setFont("helvetica","normal"),b.setTextColor(160,170,190),b.text(`Pitch Coach Report  •  Page ${P} of ${Tc}`,B,Q-8),b.text(_.execution_id||"",O-b.getTextWidth(_.execution_id||""),Q-8);const $f=`pitch_report_${_.execution_id||Date.now()}.pdf`;b.save($f)})().catch(K=>alert("PDF generation failed: "+K.message))},style:{display:"inline-flex",alignItems:"center",gap:"8px",padding:"12px 20px",backgroundColor:"#dc2626",color:"white",border:"none",borderRadius:"8px",fontWeight:"600",fontSize:"1rem",cursor:"pointer",transition:"background-color 0.3s ease"},onMouseEnter:z=>z.currentTarget.style.backgroundColor="#b91c1c",onMouseLeave:z=>z.currentTarget.style.backgroundColor="#dc2626",children:"Download Report (PDF)"}),i.jsx("button",{onClick:()=>{const z=document.querySelector(".pitch-scores-grid");z&&z.scrollIntoView({behavior:"smooth"})},style:{padding:"12px 20px",backgroundColor:"var(--navy-900)",color:"white",border:"none",borderRadius:"8px",fontWeight:"600",fontSize:"1rem",cursor:"pointer",transition:"background-color 0.3s ease"},onMouseEnter:z=>z.currentTarget.style.backgroundColor="#1a3a52",onMouseLeave:z=>z.currentTarget.style.backgroundColor="var(--navy-900)",children:"View Scorecard"})]}),(S=f.reports)!=null&&S.scorecard?i.jsxs("div",{children:[f.reports.scorecard.overall_score!==void 0&&i.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",padding:"16px 20px",borderRadius:"14px",marginTop:"20px",background:f.reports.scorecard.overall_score>=80?"rgba(34,197,94,0.12)":f.reports.scorecard.overall_score>=60?"rgba(245,158,11,0.12)":"rgba(239,68,68,0.12)",border:`1px solid ${f.reports.scorecard.overall_score>=80?"rgba(34,197,94,0.35)":f.reports.scorecard.overall_score>=60?"rgba(245,158,11,0.35)":"rgba(239,68,68,0.35)"}`},children:[i.jsx("span",{style:{fontSize:"2.4rem",fontWeight:"800",color:f.reports.scorecard.overall_score>=80?"#15803d":f.reports.scorecard.overall_score>=60?"#b45309":"#b91c1c"},children:f.reports.scorecard.overall_score}),i.jsxs("div",{children:[i.jsxs("p",{style:{margin:"0 0 2px",fontWeight:700,color:"var(--navy-900)"},children:["Overall Score — ",f.reports.scorecard.overall_status||""]}),i.jsx("p",{style:{margin:0,fontSize:"0.85rem",color:"var(--text)"},children:"Weighted across all analysis dimensions"})]})]}),i.jsx("h3",{style:{color:"var(--navy-900)",marginTop:"30px"},children:"Your Pitch Scorecard"}),i.jsx("div",{className:"pitch-scores-grid",children:(f.reports.scorecard.criteria||[]).map(z=>{if(!z||!z.score)return null;const K=z.score,b=K>=80?"#15803d":K>=60?"#b45309":"#b91c1c",T=K>=80?"rgba(34, 197, 94, 0.2)":K>=60?"rgba(245, 158, 11, 0.2)":"rgba(239, 68, 68, 0.2)";return i.jsxs("div",{style:{padding:"16px",borderRadius:"12px",border:"1px solid var(--border)",backgroundColor:T},children:[i.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"},children:[i.jsx("strong",{style:{color:"var(--navy-900)"},children:z.label}),i.jsxs("div",{style:{textAlign:"right"},children:[i.jsx("span",{style:{fontSize:"1.4rem",fontWeight:"bold",color:b},children:K}),i.jsx("span",{style:{fontSize:"0.75rem",color:b,display:"block"},children:z.status})]})]}),i.jsx("div",{style:{width:"100%",height:"6px",backgroundColor:"rgba(0,0,0,0.1)",borderRadius:"3px",marginBottom:"8px"},children:i.jsx("div",{style:{height:"100%",width:`${K}%`,backgroundColor:b,borderRadius:"3px"}})}),z.what_it_means&&i.jsx("p",{style:{margin:"0",fontSize:"0.85rem",color:"var(--text)"},children:z.what_it_means})]},z.id)})}),f.reports.scorecard.summary&&i.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginTop:"20px"},children:[(($=f.reports.scorecard.summary.strongest_criteria)==null?void 0:$.length)>0&&i.jsxs("div",{className:"pitch-insights",style:{backgroundColor:"rgba(34,197,94,0.08)",borderColor:"rgba(34,197,94,0.2)"},children:[i.jsx("h4",{children:"Strongest Areas"}),i.jsx("ul",{children:f.reports.scorecard.summary.strongest_criteria.map((z,K)=>i.jsxs("li",{children:[i.jsx("strong",{children:z.label}),": ",z.score,"/100"]},K))})]}),((q=f.reports.scorecard.summary.weakest_criteria)==null?void 0:q.length)>0&&i.jsxs("div",{className:"pitch-insights",style:{backgroundColor:"rgba(245,158,11,0.08)",borderColor:"rgba(245,158,11,0.2)"},children:[i.jsx("h4",{children:"Areas to Improve"}),i.jsx("ul",{children:f.reports.scorecard.summary.weakest_criteria.map((z,K)=>i.jsxs("li",{children:[i.jsx("strong",{children:z.label}),": ",z.score,"/100"]},K))})]})]})]}):null,(J=f.reports)!=null&&J.full_report?(()=>{const z=f.reports.full_report.final_report||f.reports.full_report,K=z.diagnostic_summary,b=z.next_best_action,T=z.limitations,Q=K&&typeof K=="object"&&Object.keys(K).length>0,B=b&&(typeof b=="string"?b:b.action);return!Q&&!B&&!(T!=null&&T.length)?null:i.jsxs("div",{style:{marginTop:"30px"},children:[B&&i.jsxs("div",{className:"pitch-insights",style:{backgroundColor:"rgba(75,124,255,0.08)",borderColor:"rgba(75,124,255,0.2)"},children:[i.jsx("h4",{children:"Next Best Action"}),i.jsx("p",{style:{margin:0,fontSize:"0.95rem",color:"var(--text)"},children:typeof b=="string"?b:b.action||JSON.stringify(b)})]}),Q&&i.jsxs("div",{className:"pitch-insights",style:{marginTop:"16px"},children:[i.jsx("h4",{children:"Diagnostic Summary"}),i.jsx("ul",{children:Object.entries(K).map(([O,U])=>U?i.jsxs("li",{children:[i.jsxs("strong",{children:[O.replace(/_/g," "),":"]})," ",String(U)]},O):null)})]}),(T==null?void 0:T.length)>0&&i.jsxs("div",{className:"pitch-insights",style:{marginTop:"16px",backgroundColor:"rgba(245,158,11,0.08)",borderColor:"rgba(245,158,11,0.2)"},children:[i.jsx("h4",{children:"Limitations"}),i.jsx("ul",{children:T.map((O,U)=>i.jsx("li",{children:O},U))})]})]})})():null,((we=f.reports)==null?void 0:we.markdown)&&i.jsxs("details",{style:{marginTop:"30px"},open:!1,children:[i.jsx("summary",{style:{cursor:"pointer",padding:"12px 16px",backgroundColor:"rgba(0,0,0,0.03)",borderRadius:"8px",fontWeight:"600",fontSize:"1rem",color:"var(--navy-900)",marginBottom:"12px"},children:"View Full Markdown Report (Details)"}),i.jsx("div",{style:{padding:"20px",backgroundColor:"rgba(0,0,0,0.02)",borderRadius:"12px",marginTop:"12px"},children:i.jsx("pre",{style:{whiteSpace:"pre-wrap",wordBreak:"break-word",fontSize:"0.9rem",maxHeight:"600px",overflow:"auto",color:"var(--text)",fontFamily:"monospace",lineHeight:"1.5"},children:f.reports.markdown})})]})]}):null]})}const mk="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=75",vk=[{id:"execution",label:"Plan",title:"Your Roadmap",subtitle:"Break your next phase into clear milestones",items:["Define launch milestones","Set realistic timelines","Assign priorities per phase"],accentColor:"#2f6bff",actionLabel:"Build My Plan",feature:"execution"},{id:"tasks",label:"Tasks",title:"Your Actions",subtitle:"Stay focused on what moves the needle",items:["Identify top 3 priorities","Track what is done vs pending","Remove blockers early"],accentColor:"#0d9488",actionLabel:null,feature:null},{id:"pitch",label:"Progress",title:"Your Pitch",subtitle:"Present your startup with clarity and confidence",items:["Sharpen your investor story","Get feedback on delivery","Improve visual presence"],accentColor:"#7c3aed",actionLabel:"Open Pitch Coach",feature:"pitch-coach"}],yk=[{label:"Idea validation",pct:90},{label:"Legal structure",pct:55},{label:"Launch readiness",pct:30}];function Kd({onClick:e}){return i.jsxs("button",{onClick:e,style:{position:"fixed",top:"84px",left:"24px",zIndex:90,display:"inline-flex",alignItems:"center",gap:"6px",padding:"10px 16px",background:"rgba(255,255,255,0.9)",backdropFilter:"blur(12px)",border:"1px solid rgba(20,52,100,0.14)",borderRadius:"999px",color:"var(--navy-900)",fontWeight:700,fontSize:"0.88rem",cursor:"pointer",boxShadow:"0 4px 16px rgba(14,38,84,0.1)",transition:"transform .25s ease, box-shadow .25s ease"},children:[i.jsx("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none","aria-hidden":"true",children:i.jsx("path",{d:"M11 7H3M6 3.5 2.5 7 6 10.5",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})}),"Back to Track C"]})}function xk({track:e}){const[t,r]=I.useState(null);return t==="execution"?i.jsxs("div",{children:[i.jsx(Kd,{onClick:()=>r(null)}),i.jsx(hk,{track:e})]}):t==="pitch-coach"?i.jsxs("div",{children:[i.jsx(Kd,{onClick:()=>r(null)}),i.jsx(gk,{track:e})]}):i.jsxs("section",{className:"section track-page track3-hub",children:[i.jsx("style",{children:`
        /* ── Hub wrapper ─────────────────────────── */
        .track3-hub { padding: 28px 0 60px; }

        /* ── Hero ────────────────────────────────── */
        .t3-hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 40px;
          align-items: center;
          padding: 44px 40px;
          border-radius: 28px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.97);
          box-shadow: 0 8px 36px rgba(14,38,84,0.08);
          overflow: hidden;
          position: relative;
          margin-bottom: 36px;
        }

        body.dark-mode .t3-hero { background: rgba(10,20,42,0.82); }

        .t3-hero::before {
          content: "";
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 5px;
          background: linear-gradient(90deg, #0d2145, #2f6bff, #5a92ff);
        }

        .t3-hero-copy { display: flex; flex-direction: column; gap: 20px; }

        .t3-eyebrow {
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          border-radius: 999px;
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          background: rgba(47,107,255,.1);
          color: var(--navy-800);
          width: fit-content;
        }

        .t3-hero-title {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: clamp(2rem, 4vw, 3.2rem);
          font-weight: 700;
          color: var(--navy-900);
          line-height: 1.05;
          letter-spacing: -.03em;
        }

        .t3-hero-sub {
          margin: 0;
          color: var(--text);
          font-size: 1.05rem;
          line-height: 1.7;
          max-width: 46ch;
        }

        .t3-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }

        .t3-primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 26px;
          border-radius: 999px;
          font-size: .95rem;
          font-weight: 800;
          color: #fff;
          border: 0;
          background: linear-gradient(135deg, #10336a 0%, #2f6bff 55%, #5a92ff 100%);
          box-shadow: 0 12px 30px rgba(21,63,138,.28);
          cursor: pointer;
          text-decoration: none;
          transition: transform .3s ease, box-shadow .3s ease;
        }

        .t3-primary-btn:hover { transform: translateY(-3px); box-shadow: 0 20px 44px rgba(21,63,138,.36); color: #fff; }

        .t3-secondary-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 22px;
          border-radius: 999px;
          font-size: .92rem;
          font-weight: 700;
          color: var(--navy-900);
          border: 1px solid var(--border);
          background: rgba(255,255,255,.9);
          box-shadow: 0 4px 14px rgba(12,34,74,.07);
          cursor: pointer;
          text-decoration: none;
          transition: transform .3s ease, box-shadow .3s ease;
        }

        .t3-secondary-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(14,38,84,.12); }

        /* ── Hero image ──────────────────────────── */
        .t3-hero-visual {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          aspect-ratio: 4/3;
          box-shadow: 0 16px 48px rgba(14,38,84,.14);
        }

        .t3-hero-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .t3-hero-visual::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(10,25,60,.18));
        }

        /* ── Blocks grid ─────────────────────────── */
        .t3-blocks {
          display: grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 22px;
          margin-bottom: 28px;
        }

        .t3-block {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 26px;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,.97);
          box-shadow: 0 4px 20px rgba(14,38,84,.07);
          transition: transform .34s ease, box-shadow .34s ease;
        }

        body.dark-mode .t3-block { background: rgba(10,20,42,.72); }

        .t3-block:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(14,38,84,.13); }

        .t3-block-label {
          display: inline-flex;
          align-items: center;
          padding: 5px 11px;
          border-radius: 999px;
          font-size: .7rem;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          width: fit-content;
          color: #fff;
        }

        .t3-block-title {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--navy-900);
        }

        .t3-block-sub {
          margin: 0;
          font-size: .9rem;
          color: var(--text);
          line-height: 1.6;
        }

        .t3-block-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .t3-block-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: .9rem;
          color: var(--text);
          line-height: 1.5;
        }

        .t3-check {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 1px;
        }

        .t3-block-action {
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid var(--border);
        }

        .t3-block-btn {
          width: 100%;
          padding: 11px 14px;
          border-radius: 14px;
          border: 1px solid rgba(47,107,255,.28);
          background: rgba(47,107,255,.07);
          color: var(--blue-500);
          font-size: .88rem;
          font-weight: 800;
          cursor: pointer;
          transition: background .25s ease, transform .25s ease;
        }

        .t3-block-btn:hover { background: rgba(47,107,255,.14); transform: translateY(-1px); }

        /* ── Progress block ───────────────────────── */
        .t3-progress-block {
          padding: 28px 32px;
          border-radius: 24px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,.97);
          box-shadow: 0 4px 20px rgba(14,38,84,.07);
          display: grid;
          gap: 20px;
          margin-bottom: 28px;
        }

        body.dark-mode .t3-progress-block { background: rgba(10,20,42,.72); }

        .t3-progress-header { display: flex; justify-content: space-between; align-items: center; }

        .t3-progress-title {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--navy-900);
        }

        .t3-progress-sub { margin: 0; font-size: .88rem; color: var(--text); }

        .t3-progress-items { display: flex; flex-direction: column; gap: 14px; }

        .t3-progress-row { display: grid; gap: 6px; }

        .t3-progress-row-top { display: flex; justify-content: space-between; align-items: center; }

        .t3-progress-label { font-size: .88rem; font-weight: 600; color: var(--navy-900); }

        .t3-progress-pct { font-size: .82rem; font-weight: 700; color: var(--blue-500); }

        .t3-progress-track {
          height: 8px;
          border-radius: 999px;
          background: rgba(47,107,255,.1);
          overflow: hidden;
        }

        .t3-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #0d2145, #2f6bff);
          transition: width .9s ease;
        }

        /* ── Next Step card ──────────────────────── */
        .t3-next-step {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
          align-items: center;
          padding: 28px 32px;
          border-radius: 24px;
          border: 1px solid rgba(47,107,255,.22);
          background: linear-gradient(135deg, rgba(13,33,69,.04) 0%, rgba(47,107,255,.06) 100%);
          box-shadow: 0 4px 20px rgba(14,38,84,.06);
        }

        .t3-next-step-label {
          font-size: .72rem;
          font-weight: 800;
          letter-spacing: .06em;
          text-transform: uppercase;
          color: var(--blue-500);
          margin-bottom: 6px;
        }

        .t3-next-step-text {
          margin: 0;
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--navy-900);
        }

        .t3-next-step-sub {
          margin: 6px 0 0;
          font-size: .9rem;
          color: var(--text);
        }

        /* ── Responsive ───────────────────────────── */
        @media(max-width:960px) {
          .t3-hero { grid-template-columns: 1fr; }
          .t3-hero-visual { aspect-ratio: 16/7; }
          .t3-blocks { grid-template-columns: 1fr; }
          .t3-next-step { grid-template-columns: 1fr; }
        }
      `}),i.jsxs("div",{className:"t3-hero reveal",children:[i.jsxs("div",{className:"t3-hero-copy",children:[i.jsxs("span",{className:"t3-eyebrow",children:[(e==null?void 0:e.track)||"Track C"," — Launch & Grow"]}),i.jsx("h1",{className:"t3-hero-title",children:"Launch and manage your startup clearly"}),i.jsx("p",{className:"t3-hero-sub",children:"Plan your steps, track progress, and stay focused on what matters most for your startup."}),i.jsxs("div",{className:"t3-hero-actions",children:[i.jsxs("button",{className:"t3-primary-btn",onClick:()=>r("execution"),children:["Start My Plan",i.jsx("svg",{width:"15",height:"15",viewBox:"0 0 15 15",fill:"none","aria-hidden":"true",children:i.jsx("path",{d:"M2.5 7.5h10M8.5 3.5l4 4-4 4",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})})]}),i.jsx("button",{className:"t3-secondary-btn",onClick:()=>r("pitch-coach"),children:"Open Pitch Coach"})]})]}),i.jsx("div",{className:"t3-hero-visual",children:i.jsx("img",{src:mk,alt:"Startup team planning and launching together",loading:"lazy"})})]}),i.jsx("div",{className:"t3-blocks reveal delay-1",children:vk.map(n=>i.jsxs("div",{className:"t3-block",children:[i.jsx("span",{className:"t3-block-label",style:{background:n.accentColor},children:n.label}),i.jsx("h3",{className:"t3-block-title",children:n.title}),i.jsx("p",{className:"t3-block-sub",children:n.subtitle}),i.jsx("ul",{className:"t3-block-list",children:n.items.map(s=>i.jsxs("li",{children:[i.jsx("span",{className:"t3-check",style:{background:`${n.accentColor}18`},children:i.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none","aria-hidden":"true",children:i.jsx("path",{d:"M2 5l2.5 2.5L8 3",stroke:n.accentColor,strokeWidth:"1.6",strokeLinecap:"round",strokeLinejoin:"round"})})}),s]},s))}),n.actionLabel&&n.feature&&i.jsx("div",{className:"t3-block-action",children:i.jsx("button",{className:"t3-block-btn",style:{borderColor:`${n.accentColor}44`,color:n.accentColor,background:`${n.accentColor}0d`},onClick:()=>r(n.feature),children:n.actionLabel})})]},n.id))}),i.jsxs("div",{className:"t3-progress-block reveal delay-2",children:[i.jsx("div",{className:"t3-progress-header",children:i.jsxs("div",{children:[i.jsx("h3",{className:"t3-progress-title",children:"Your Progress"}),i.jsx("p",{className:"t3-progress-sub",children:"A snapshot of where your startup stands today"})]})}),i.jsx("div",{className:"t3-progress-items",children:yk.map(n=>i.jsxs("div",{className:"t3-progress-row",children:[i.jsxs("div",{className:"t3-progress-row-top",children:[i.jsx("span",{className:"t3-progress-label",children:n.label}),i.jsxs("span",{className:"t3-progress-pct",children:[n.pct,"%"]})]}),i.jsx("div",{className:"t3-progress-track",children:i.jsx("div",{className:"t3-progress-fill",style:{width:`${n.pct}%`}})})]},n.label))})]}),i.jsxs("div",{className:"t3-next-step reveal delay-3",children:[i.jsxs("div",{children:[i.jsx("p",{className:"t3-next-step-label",children:"Recommended next action"}),i.jsx("p",{className:"t3-next-step-text",children:"Your next best step to move forward"}),i.jsx("p",{className:"t3-next-step-sub",children:"Build a clear execution plan with milestones, task breakdowns, and timelines."})]}),i.jsx("button",{className:"t3-primary-btn",onClick:()=>r("execution"),children:"Get Recommendation"})]})]})}function kk(){const[e,t]=I.useState(!1),[r,n]=I.useState(!1),[s,a]=I.useState(window.location.hash||""),{scrollProgress:o,scrollY:l}=Px(),{session:c,user:u,loading:d,signIn:h,signUp:p,signOut:v}=Rx(),{testimonials:y,submitReview:x,loading:N,submittingReview:f}=Ox();I.useEffect(()=>(document.body.classList.toggle("dark-mode",e),()=>document.body.classList.remove("dark-mode")),[e]),I.useEffect(()=>{const j=()=>{a(window.location.hash||""),window.scrollTo({top:0,behavior:"smooth"})};return window.addEventListener("hashchange",j),()=>window.removeEventListener("hashchange",j)},[]);const g=I.useMemo(()=>({transform:`translateY(${l*.05}px)`}),[l]),m=I.useMemo(()=>({transform:`translateY(${l*.035}px)`}),[l]),k=I.useMemo(()=>id.find(j=>`#${j.id}`===s)??null,[s]);return window.location.hash==="#track1-analyzer"?i.jsxs("div",{className:"site-shell",children:[i.jsx(go,{darkMode:e,onToggleDarkMode:()=>t(j=>!j),onOpenAuth:()=>n(!0),user:u,onSignOut:v}),i.jsx(qx,{}),i.jsx(fo,{})]}):window.location.hash==="#track1-report"?i.jsxs("div",{className:"site-shell",children:[i.jsx(go,{darkMode:e,onToggleDarkMode:()=>t(j=>!j),onOpenAuth:()=>n(!0),user:u,onSignOut:v}),i.jsx(rk,{}),i.jsx(fo,{})]}):i.jsxs(i.Fragment,{children:[i.jsx("div",{className:"scroll-progress",style:{width:`${o}%`}}),i.jsxs("div",{className:"site-shell",children:[i.jsx(go,{darkMode:e,onToggleDarkMode:()=>t(j=>!j),onOpenAuth:()=>n(!0),user:u,onSignOut:v}),i.jsx("main",{children:k?i.jsxs(i.Fragment,{children:[k.id==="track-c"?i.jsx(xk,{track:k}):k.id==="track-b"?i.jsx(ck,{track:k}):i.jsx(Tx,{track:k}),k.id!=="track-b"?i.jsx(Ld,{}):null]}):i.jsxs(i.Fragment,{children:[i.jsx(xx,{copy:oo.hero,stats:oo.heroStats,heroParallax:g,onPrimaryAction:()=>n(!0)}),i.jsx(Nx,{stats:dv}),i.jsx(yx,{values:hv,aboutParallax:m}),i.jsx(jx,{services:id}),i.jsx(bx,{items:pv}),i.jsx(Ex,{testimonials:y,loading:N,onSubmitReview:x,submittingReview:f}),i.jsx(vx,{faqs:oo.faqs}),i.jsx(kx,{}),i.jsx(Ld,{})]})}),(k==null?void 0:k.id)!=="track-b"?i.jsx(fo,{}):null]}),i.jsx(uv,{open:r,onClose:()=>n(!1),session:c,loading:d,onSignIn:h,onSignUp:p})]})}xo.createRoot(document.getElementById("root")).render(i.jsx(Xf.StrictMode,{children:i.jsx(kk,{})}));

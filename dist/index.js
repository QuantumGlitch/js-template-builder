!function(t,e){for(var n in e)t[n]=e[n];e.__esModule&&Object.defineProperty(t,"__esModule",{value:!0})}(exports,(()=>{var __webpack_modules__={729:t=>{"use strict";var e=Object.prototype.hasOwnProperty,n="~";function a(){}function r(t,e,n){this.fn=t,this.context=e,this.once=n||!1}function i(){this._events=new a,this._eventsCount=0}Object.create&&(a.prototype=Object.create(null),(new a).__proto__||(n=!1)),i.prototype.eventNames=function(){var t,a,r=[];if(0===this._eventsCount)return r;for(a in t=this._events)e.call(t,a)&&r.push(n?a.slice(1):a);return Object.getOwnPropertySymbols?r.concat(Object.getOwnPropertySymbols(t)):r},i.prototype.listeners=function(t,e){var a=n?n+t:t,r=this._events[a];if(e)return!!r;if(!r)return[];if(r.fn)return[r.fn];for(var i=0,s=r.length,o=new Array(s);i<s;i++)o[i]=r[i].fn;return o},i.prototype.emit=function(t,e,a,r,i,s){var o=n?n+t:t;if(!this._events[o])return!1;var u,c,l=this._events[o],p=arguments.length;if(l.fn){switch(l.once&&this.removeListener(t,l.fn,void 0,!0),p){case 1:return l.fn.call(l.context),!0;case 2:return l.fn.call(l.context,e),!0;case 3:return l.fn.call(l.context,e,a),!0;case 4:return l.fn.call(l.context,e,a,r),!0;case 5:return l.fn.call(l.context,e,a,r,i),!0;case 6:return l.fn.call(l.context,e,a,r,i,s),!0}for(c=1,u=new Array(p-1);c<p;c++)u[c-1]=arguments[c];l.fn.apply(l.context,u)}else{var h,f=l.length;for(c=0;c<f;c++)switch(l[c].once&&this.removeListener(t,l[c].fn,void 0,!0),p){case 1:l[c].fn.call(l[c].context);break;case 2:l[c].fn.call(l[c].context,e);break;case 3:l[c].fn.call(l[c].context,e,a);break;case 4:l[c].fn.call(l[c].context,e,a,r);break;default:if(!u)for(h=1,u=new Array(p-1);h<p;h++)u[h-1]=arguments[h];l[c].fn.apply(l[c].context,u)}}return!0},i.prototype.on=function(t,e,a){var i=new r(e,a||this),s=n?n+t:t;return this._events[s]?this._events[s].fn?this._events[s]=[this._events[s],i]:this._events[s].push(i):(this._events[s]=i,this._eventsCount++),this},i.prototype.once=function(t,e,a){var i=new r(e,a||this,!0),s=n?n+t:t;return this._events[s]?this._events[s].fn?this._events[s]=[this._events[s],i]:this._events[s].push(i):(this._events[s]=i,this._eventsCount++),this},i.prototype.removeListener=function(t,e,r,i){var s=n?n+t:t;if(!this._events[s])return this;if(!e)return 0==--this._eventsCount?this._events=new a:delete this._events[s],this;var o=this._events[s];if(o.fn)o.fn!==e||i&&!o.once||r&&o.context!==r||(0==--this._eventsCount?this._events=new a:delete this._events[s]);else{for(var u=0,c=[],l=o.length;u<l;u++)(o[u].fn!==e||i&&!o[u].once||r&&o[u].context!==r)&&c.push(o[u]);c.length?this._events[s]=1===c.length?c[0]:c:0==--this._eventsCount?this._events=new a:delete this._events[s]}return this},i.prototype.removeAllListeners=function(t){var e;return t?(e=n?n+t:t,this._events[e]&&(0==--this._eventsCount?this._events=new a:delete this._events[e])):(this._events=new a,this._eventsCount=0),this},i.prototype.off=i.prototype.removeListener,i.prototype.addListener=i.prototype.on,i.prototype.setMaxListeners=function(){return this},i.prefixed=n,i.EventEmitter=i,t.exports=i},857:(t,e,n)=>{"use strict";function a(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var r=n(729),i=function(){},s={data:"state-data",cdata:"state-cdata",tagBegin:"state-tag-begin",tagName:"state-tag-name",tagEnd:"state-tag-end",attributeNameStart:"state-attribute-name-start",attributeName:"state-attribute-name",attributeNameEnd:"state-attribute-name-end",attributeValueBegin:"state-attribute-value-begin",attributeValue:"state-attribute-value"},o={lt:"action-lt",gt:"action-gt",space:"action-space",equal:"action-equal",quote:"action-quote",slash:"action-slash",char:"action-char",error:"action-error"},u={text:"text",openTag:"open-tag",closeTag:"close-tag",attributeName:"attribute-name",attributeValue:"attribute-value"},c={" ":o.space,"\t":o.space,"\n":o.space,"\r":o.space,"<":o.lt,">":o.gt,'"':o.quote,"'":o.quote,"=":o.equal,"/":o.slash};t.exports={State:s,Action:o,Type:u,create:function(t){var e,n,l,p,h,f,d,v,m,y;t=Object.assign({debug:!1},t);var b=new r,_=s.data,g="",x="",w="",T="",V="",$="",R=function(e,n){if("?"!==x[0]&&"!"!==x[0]){var a={type:e,value:n};t.debug&&console.log("emit:",a),b.emit("data",a)}};b.stateMachine=(a(y={},s.data,(a(e={},o.lt,(function(){g.trim()&&R(u.text,g),x="",V=!1,_=s.tagBegin})),a(e,o.char,(function(t){g+=t})),e)),a(y,s.cdata,a({},o.char,(function(t){"]]>"===(g+=t).substr(-3)&&(R(u.text,g.slice(0,-3)),g="",_=s.data)}))),a(y,s.tagBegin,(a(n={},o.space,i),a(n,o.char,(function(t){x=t,_=s.tagName})),a(n,o.slash,(function(){x="",V=!0})),n)),a(y,s.tagName,(a(l={},o.space,(function(){V?_=s.tagEnd:(_=s.attributeNameStart,R(u.openTag,x))})),a(l,o.gt,(function(){R(V?u.closeTag:u.openTag,x),g="",_=s.data})),a(l,o.slash,(function(){_=s.tagEnd,R(u.openTag,x)})),a(l,o.char,(function(t){"![CDATA["===(x+=t)&&(_=s.cdata,g="",x="")})),l)),a(y,s.tagEnd,(a(p={},o.gt,(function(){R(u.closeTag,x),g="",_=s.data})),a(p,o.char,i),p)),a(y,s.attributeNameStart,(a(h={},o.char,(function(t){w=t,_=s.attributeName})),a(h,o.gt,(function(){g="",_=s.data})),a(h,o.space,i),a(h,o.slash,(function(){V=!0,_=s.tagEnd})),h)),a(y,s.attributeName,(a(f={},o.space,(function(){_=s.attributeNameEnd})),a(f,o.equal,(function(){R(u.attributeName,w),_=s.attributeValueBegin})),a(f,o.gt,(function(){T="",R(u.attributeName,w),R(u.attributeValue,T),g="",_=s.data})),a(f,o.slash,(function(){V=!0,T="",R(u.attributeName,w),R(u.attributeValue,T),_=s.tagEnd})),a(f,o.char,(function(t){w+=t})),f)),a(y,s.attributeNameEnd,(a(d={},o.space,i),a(d,o.equal,(function(){R(u.attributeName,w),_=s.attributeValueBegin})),a(d,o.gt,(function(){T="",R(u.attributeName,w),R(u.attributeValue,T),g="",_=s.data})),a(d,o.char,(function(t){T="",R(u.attributeName,w),R(u.attributeValue,T),w=t,_=s.attributeName})),d)),a(y,s.attributeValueBegin,(a(v={},o.space,i),a(v,o.quote,(function(t){$=t,T="",_=s.attributeValue})),a(v,o.gt,(function(){R(u.attributeValue,T=""),g="",_=s.data})),a(v,o.char,(function(t){$="",T=t,_=s.attributeValue})),v)),a(y,s.attributeValue,(a(m={},o.space,(function(t){$?T+=t:(R(u.attributeValue,T),_=s.attributeNameStart)})),a(m,o.quote,(function(t){$===t?(R(u.attributeValue,T),_=s.attributeNameStart):T+=t})),a(m,o.gt,(function(t){$?T+=t:(R(u.attributeValue,T),g="",_=s.data)})),a(m,o.slash,(function(t){$?T+=t:(R(u.attributeValue,T),V=!0,_=s.tagEnd)})),a(m,o.char,(function(t){T+=t})),m)),y);var D=function(e){t.debug&&console.log(_,e);var n=b.stateMachine[_];(n[function(t){return c[t]||o.char}(e)]||n[o.error]||n[o.char])(e)};return b.write=function(t){for(var e=t.length,n=0;n<e;n++)D(t[n])},b}}},670:(t,e,n)=>{"use strict";var a=n(729),r=n(857),i=r.Type,s={element:"element",text:"text"},o=function(t){return Object.assign({name:"",type:s.element,value:"",parent:null,attributes:{},children:[]},t)},u=function(t){t=Object.assign({stream:!1,parentNodes:!0,doneEvent:"done",tagPrefix:"tag:",emitTopLevelOnly:!1,debug:!1},t);var e=void 0,n=void 0,u=void 0,c=void 0,l=new a,p=function(a){switch(a.type){case i.openTag:if(null===u)(u=n).name=a.value;else{var r=o({name:a.value,parent:u});u.children.push(r),u=r}break;case i.closeTag:var p=u.parent;if(t.parentNodes||(u.parent=null),u.name!==a.value)break;t.stream&&p===n&&(n.children=[],u.parent=null),t.emitTopLevelOnly&&p!==n||(l.emit(t.tagPrefix+u.name,u),l.emit("tag",u.name,u)),u===n&&(e.removeAllListeners("data"),l.emit(t.doneEvent,u),n=null),u=p;break;case i.text:u&&u.children.push(o({type:s.text,value:a.value,parent:t.parentNodes?u:null}));break;case i.attributeName:c=a.value,u.attributes[c]="";break;case i.attributeValue:u.attributes[c]=a.value}};return l.reset=function(){(e=r.create({debug:t.debug})).on("data",p),n=o(),u=null,c="",l.parse=e.write},l.reset(),l};t.exports={parseSync:function(t,e){e=Object.assign({},e,{stream:!1,tagPrefix:":"});var n=u(e),a=void 0;return n.on("done",(function(t){a=t})),n.parse(t),a},create:u,NodeType:s}},784:(t,e,n)=>{const{ModelDefinition:a,ModelNodeDefinition:r}=n(827),{Variable:i}=n(579),{ControlExpression:s}=n(681);class o{constructor({parent:t,controlExpression:e}={}){this.children=[],this.parent=t,this.controlExpression=e,this.variables=[]}get parent(){return this._parent}set parent(t){this.parent!==t&&(this.parent&&(this.parent.children=this.parent.children.filter((t=>t!==this))),t&&(t.children.push(this),this._parent=t))}addChild(t){t.parent=this}validate(){return this.variables=[],!this.controlExpression||!!this.controlExpression.validate({context:this})&&(this.variables=[...this.variables,...this.controlExpression.newVariables()],!0)}render({innerRender:t}){return this.controlExpression?this.controlExpression.render({innerRender:t}):t()}upsearchVar(t){let e=t.split(".");const n=e.shift();let a=this.parent,r=null;for(;a&&!r;)r=a.searchVarByName(n),a=a.parent;return r?r.getByPath(e):null}searchVar(t){let e=t.split(".");const n=e.shift(),a=this.variables.find((t=>t.name===n));return a?a.getByPath(e):null}searchVarByName(t){return this.variables.find((e=>e.name===t))}}t.exports={RootContext:class extends o{constructor({modelDefinition:t}){super({}),this.variables=t.props}get parent(){return null}set parent(t){}bind(t){this.variables.forEach((e=>e.bind(t[e.name])))}upsearchVar(){return null}},Context:o}},827:t=>{class e{constructor({name:t,description:e=null,type:n,props:a=null}){this.name=t,this.description=e,this._type=n,this._props=a,this.value=void 0}bind(t){this.value=t,"Object"===this.type&&"object"==typeof t&&t&&this.props.forEach((e=>e.bind(t[e.name])))}static parseFromRawObject(t){const n=new e({name:t.name,description:t.description,type:t.type});return t.props&&(n.props=t.props.map((t=>e.parseFromRawObject(t)))),n}get type(){return this._type}set type(t){this._type=t}get props(){return this._props}set props(t){this._props=t}getByPath(t){let e=this;for(let n=0;n<t.length&&(e=e.props.find((e=>e.name===t[n])),e);n++);return e}static getByPath(t,e){for(let n=0;n<e.length&&(t=t.props.find((t=>t.name===e[n])));n++);return t}}class n extends e{constructor({type:t,props:e}){super({type:t,props:e})}static parseFromRawObject(t){const a=new n({type:t.type});return t.props&&(a.props=t.props.map((t=>e.parseFromRawObject(t)))),a}}t.exports={ModelNodeDefinition:e,ModelDefinition:n,DataType:{Object:"Object",Array:"Array",Primitive:"Primitive"}}},579:(t,e,n)=>{const{ModelNodeDefinition:a,Type:r}=n(827);t.exports={Variable:class extends a{constructor({name:t,description:e=null,type:n=null,props:a=null}={}){super({name:t,description:e,type:n,props:a})}}}},681:(t,e,n)=>{const{Expression:a,Type:r,GlobalRegex:i}=n(993),{Variable:s}=n(579),{DataType:o}=n(827),u={If:"@if\\s+(.*)",Foreach:`@foreach\\s+${i.Identifier.Name}\\s+of\\s+${i.Identifier.Path}`};t.exports={ControlExpression:class extends a{validateSyntax(){let t=null;if(!this.value)return!0;if(t=this.value.match(new RegExp(`^\\s*${u.Foreach}\\s*$`)))this.match=t,this.type=r.Foreach;else{if(!(t=this.value.match(new RegExp(`^\\s*${u.If}\\s*$`))))return!1;this.match=t,this.type=r.If}return!0}validateSemantic({context:t}){switch(this.description=null,this.type){case r.Foreach:if(this.iterator=this.validateVariablePath(this.match[2],t),!this.iterator)return;if(this.iterator.type!==o.Array)return void(this.error=`Can't use the instruction '@foreach' on '${this.match[2]}'. The type is not 'Array'.`);this.description=`Repeat the block below for each element of '${this.iterator.description}', where the current element is '${this.match[1]}'.`;break;case r.If:const e=new a({value:this.match[1]});if(!e.validate({context:t}))return this.error=`Can't validate the value << ${this.match[1]} >> ${e.error?`<< ${e.error} >>`:""}`,!1;this.valueExpression=e,this.description=`Continue with the block below, if the variable or property '${this.match[1]}' is true or has a value.`}return!0}newVariables(){const t=[];switch(this.type){case r.Foreach:const e=new s({name:this.match[1],type:this.iterator.props?"Object":"Primive",props:this.iterator.props,description:`Element of '${this.iterator.description}'`});t.push(e),this.iteratorVariable=e}return t}render({innerRender:t}){switch(this.type){case r.Foreach:return this.iterator.value?this.iterator.value.map((e=>(this.iteratorVariable.bind(e),t()))):null;case r.If:const e=this.valueExpression.evaluate();return null!=e&&!1!==e?t():null}return t()}},Regex:u}},993:(module,__unused_webpack_exports,__webpack_require__)=>{const{DataType,ModelNodeDefinition}=__webpack_require__(827),{Variable}=__webpack_require__(579),{Context}=__webpack_require__(784);function deduceDataType(t){return t===DataType.Primitive?{type:DataType.Primitive}:t}const Functions={get(t){return this[t].function||this.name},add(t,e){this[t]=e},evalJS:function(string){return eval(string)},getProperty(t,e){const n=e.split(".");let a=t;for(let t of n){if(!a||!a.hasOwnProperty(t))return null;a=a[t]}return a},">":{function:(t,e)=>t>e,returns:{type:DataType.Primitive,description:"Result of a comparation"}},"<":{function:(t,e)=>t>e,returns:{type:DataType.Primitive,description:"Result of a comparation"}},"<=":{function:(t,e)=>t<=e,returns:{type:DataType.Primitive,description:"Result of a comparation"}},">=":{function:(t,e)=>t>=e,returns:{type:DataType.Primitive,description:"Result of a comparation"}},"==":{function:(t,e)=>t==e,returns:{type:DataType.Primitive,description:"Result of a equality"}},"===":{function:(t,e)=>t===e,returns:{type:DataType.Primitive,description:"Result of a strict equality"}},"!=":{function:(t,e)=>t==e,returns:{type:DataType.Primitive,description:"Result of a disequality"}},"!==":{function:(t,e)=>t==e,returns:{type:DataType.Primitive,description:"Result of a strict disequality"}},sum:{function:(...t)=>t.reduce(((t,e)=>t+e),0),returns:{type:DataType.Primitive,description:"Result of a sum"}},sub:{function:(t,...e)=>e.reduce(((t,e)=>t-e),t),returns:{type:DataType.Primitive,description:"Result of a subtraction"}},mul:{function:(...t)=>t.reduce(((t,e)=>t*e),1),returns:{type:DataType.Primitive,description:"Result of a multiplication"}},div:{function:(t,...e)=>e.reduce(((t,e)=>t/e),t),returns:{type:DataType.Primitive,description:"Result of a division"}},"Array.sum":{function:(t,e)=>e?Functions.sum.function(...t.map((t=>t[e]))):Functions.sum.function(...t),returns:{type:DataType.Primitive,description:"Result of a sum"}},"Array.sub":{function:(t,e)=>e?Functions.subtract.function(...t.map((t=>t[e]))):Functions.subtract.function(...t),returns:{type:DataType.Primitive,description:"Result of a subtraction"}},"Array.mul":{function:(t,e)=>e?Functions.multiply.function(...t.map((t=>t[e]))):Functions.multiply.function(...t),returns:{type:DataType.Primitive,description:"Result of a multiplication"}},"Array.div":{function:(t,e)=>e?Functions.divide.function(...t.map((t=>t[e]))):Functions.divide.function(...t),returns:{type:DataType.Primitive,description:"Result of a division"}},"Array.weightedSum":{function(...t){let e=0;for(let n=0;n<t[0].length;n++)e+=t.reduce(((t,e)=>t*e[n]),1);return e},returns:{type:DataType.Primitive,description:"Result of a weighted sum"}},"Array.mapByProperty":{function:(t,e)=>t.map((t=>Functions.getProperty(t,e))),returns:([t],[e,n])=>({type:DataType.Array,props:ModelNodeDefinition.getByPath(t.props,n),description:"Mapped array by property "+n})},"Array.filterByProperty":{function(t,e,n,...a){const r=Functions.get(n);if(!r)throw new Error(`Can't find the function called '${n}'`);return t.filter((t=>r(Functions.getProperty(t,e),...a)))},returns:([t],[e,n],[a,r])=>({type:DataType.Array,props:t.props,description:`Filtered array by property '${n}' with function '${r}'`})}},Type={VariableValue:"VariableValue",StaticValue:"StaticValue",FunctionCallValue:"FunctionCallValue",Declaration:"Declaration",If:"If",Foreach:"Foreach"},GlobalRegex={Static:{String:'"([^"\\\\]*(?:\\\\[\\s\\S][^"\\\\]*)*)"',Number:"(\\d+(\\.\\d+){0,1})"},Identifier:{Name:"([$A-Za-z_][0-9A-Za-z_$]*)",Path:"(([$A-Za-z_][0-9A-Za-z_$]*)(\\.[$A-Za-z_][0-9A-Za-z_$]*)*)"},Function:{Identifier:"[0-9A-Za-z\\_\\>\\<\\^\\|?\\!\\&\\$\\-\\+\\=\\.]+"}};GlobalRegex.Function.Call=`(${GlobalRegex.Function.Identifier})\\s*\\((.*)\\)`,GlobalRegex.Declaration=GlobalRegex.Identifier.Name+"\\s*=\\s*(.*)";class Expression{constructor({value:t}={}){this.value=t,this.error=null,this.description=null}validateVariablePath(t,e){const n=e.searchVar(t)||e.upsearchVar(t);return n||(this.error=`Can't find the variable or property '${t}'.`),n}validateSyntax(){let t=null;if(t=this.value.match(new RegExp(`^\\s*${GlobalRegex.Static.String}\\s*$`)))this.match=t,this.type=Type.StaticValue,this.staticValue=t[1].replace('\\"','"');else if(t=this.value.match(new RegExp(`^\\s*${GlobalRegex.Static.Number}\\s*$`)))this.match=t,this.type=Type.StaticValue,this.staticValue=Number(this.match[1]);else if(t=this.value.match(new RegExp(`^\\s*${GlobalRegex.Identifier.Path}\\s*$`)))this.match=t,this.type=Type.VariableValue;else if(t=this.value.match(new RegExp(`^\\s*${GlobalRegex.Function.Call}\\s*$`)))this.match=t,this.type=Type.FunctionCallValue;else{if(!(t=this.value.match(new RegExp(`^\\s*${GlobalRegex.Declaration}\\s*$`))))return!1;this.match=t,this.type=Type.Declaration}return!0}validateSemantic({context:t}){switch(this.type){case Type.VariableValue:const e=this.validateVariablePath(this.match[1],t);if(!e)return!1;this.variable=e;break;case Type.FunctionCallValue:const n=this.match[1];if(!Functions[n])return this.error=`Can't find the function '${n}'`,!1;{const e=[];let a=0,r="";for(let t=0;t<this.match[2].length;t++){const n=this.match[2][t];"("===n?a++:")"===n&&a--,0!==a||","!==n?r+=this.match[2][t]:(e.push(r),r="")}e.push(r);const i=[];for(let n=0;n<e.length;n++){const a=new Expression({value:e[n]});if(!a.validate({context:t}))return this.error=`Can't validate the parameter << ${e[n]} >>  ${a.error?`<< ${a.error} >>`:""}`,!1;i.push(a)}this.functionName=n,this.parameters=i}break;case Type.Declaration:const a=new Expression({value:this.match[2]});if(!a.validate({context:t}))return this.error=`Can't validate the value << ${this.match[2]} >> ${a.error?`<< ${a.error} >>`:""}`,!1;const r=a.deduceDataType(),i=new Variable({name:this.match[1],type:r.type,props:r.props,description:r.description});i.value=a.evaluate(),t.variables.push(i)}return!0}validate({context:t}){return this.validateSyntax()&&this.validateSemantic({context:t})}deduceDataType(){if(this.type===Type.FunctionCallValue){let t=Functions[this.functionName].returns;return"function"==typeof t?Functions[this.functionName].returns(...this.parameters.map((t=>[t.deduceDataType(),t.evaluate()]))):deduceDataType(t)}return this.type===Type.VariableValue?this.variable:{type:DataType.Primitive}}evaluate(){switch(this.type){case Type.StaticValue:return this.staticValue;case Type.VariableValue:return this.variable.value;case Type.FunctionCallValue:return(Functions[this.functionName].function||Functions[this.functionName])(...this.parameters.map((t=>t.evaluate())))}}render(){return this.evaluate()}}module.exports={Expression,Type,GlobalRegex,Functions}},138:(t,e,n)=>{t.exports={...n(827),...n(579),...n(784),...n(993),...n(681),Renderer:{...n(479)}}},479:(t,e,n)=>{const a=n(670),{ModelDefinition:r}=n(827),{Expression:i}=n(993),{ControlExpression:s}=n(681),{RootContext:o,Context:u}=n(784);function c(t,e){return!(!t.attributes||!t.attributes.class)&&t.attributes.class.split(" ").indexOf(e)>-1}function l(t){return`\n\n![ Error: << ${t.value.trim()} >> is not valid: ${t.error||"Generic Error."} ]\n\n`}function p(t,e){return t.children.map((t=>f(t,e))).filter((t=>null!=t)).join("")}function h(t){return t.replace(/\r?\n|\r/g,"").replace(/\s+/g," ")}function f(t,e){try{if(c(t,"data-context")){const n=t.children[0].children[0]?t.children[0].children[0].value:null,a=n?new s({value:h(n)}):null,r=new u({parent:e,controlExpression:a});if(!r.validate())return l(r.controlExpression);const i=r.render({innerRender:()=>f(t.children[1],r)});return null==i?"":i instanceof Array?i.join(""):i}if(c(t,"data-declaration")){const n=new i({value:h(t.children[0].value)});if(!n.validate({context:e}))return l(n)}else{if(c(t,"data-expression")){const n=new i({value:h(t.children[0].value)});return n.validate({context:e})?n.render():l(n)}if(c(t,"data-content"))return p(t,e);if("element"===t.type)return`<${t.name}${function(t){return t.attributes&&Object.keys(t.attributes).length>0?" "+Object.keys(t.attributes).map((e=>`${e}="${t.attributes[e]}"`)).join(""):""}(t)}>${p(t,e)}</${t.name}>`;if("text"===t.type)return t.value}}catch(t){return console.error(t),"Uncaught exception: "+t.message}}t.exports={parseFromXml:function(t,e,n){return new Promise(((r,i)=>{try{const i=a.create();i.on("done",(n=>{const a=new o({modelDefinition:t});a.bind(e),r(f(n,a))})),i.parse(n)}catch(t){i(t)}}))}}}},__webpack_module_cache__={};function __webpack_require__(t){if(__webpack_module_cache__[t])return __webpack_module_cache__[t].exports;var e=__webpack_module_cache__[t]={exports:{}};return __webpack_modules__[t](e,e.exports,__webpack_require__),e.exports}return __webpack_require__(138)})());
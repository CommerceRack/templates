/* **************************************************************

   Copyright 2013 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */

var widespread = function(_app) {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				
//resize is executed continuously and the browser dimensions change. This function allows the code to be executed once, on finish (or pause)
	$(window).resize(function() {
		if(this.resizeTO) {clearTimeout(this.resizeTO);}
		this.resizeTO = setTimeout(function() {
			$(this).trigger('resizeEnd');
			}, 500);
		});
//when window is resized, generate a new logo. The code is triggered right after being bound to generate the correct size logo to start.
	$(window).bind('resizeEnd', function(P) {
		//resize the logo to maximum available space.
		var $logo = $('.logo',$('#mastHead'));
		var $container = $('.container:first'); //used to determine margin width so logo sides align with 'shop' sides.
// _app.data[rd.datapointer]['zoovy:company_name']
		if(_app.data['appProfileInfo|'+zGlobals.appSettings.domain_only])	{
			$logo.html("<img alt='"+(_app.data['appProfileInfo|'+zGlobals.appSettings.domain_only]['zoovy:company_name'] || "")+"' src='"+_app.u.makeImage({"name":_app.data['appProfileInfo|'+zGlobals.appSettings.domain_only]['zoovy:logo_website'],"w":Math.round(($logo.width() - ($container.width() * .02) )),"h":$logo.height(),"b":"TTTTTT","tag":0})+"' />"); //the 100% makes the logo scale on resize before being regenerated.
			}
		
		if(typeof handleSrcSetUpdate == 'function')	{
			handleSrcSetUpdate($("#mainContentArea :visible:first"))
			}
		}).trigger('resizeEnd');
	
//bind a click action for the dropdown on the shop link.
	$('#shopNowLink').on('click',function(){
		$('#tier1categories').slideDown();
		$( document ).one( "click", function() {
			$('#tier1categories').slideUp();
			});
		return false;
		});

	//.menu adds some formatting for the HTOW dropdown.
	$('#hotwMenu').menu().width('200').on('click','li',function(){
		$('#hotwButton').addClass('ui-state-hover');
		showContent('',$(this).data());
		//do not return false here. if so, the 'one' click added to the body won't get triggered by clicking a sotw.
		});

//each time the HOTW button is clicked, the dropdown is generated showing the last few pages viewed.
	$('#hotwButton').button({icons: {primary: "ui-icon-circle-triangle-w"},text: false}).on('click',function(){
		var
			$menu = $('#hotwMenu').empty(),
			hotw = _app.ext.myRIA.vars.hotw;
// SANITY -> hotw has a fixed length (15 by default).
//start at spot 1. spot 0 is the page in focus.
		for(var i = 1; i < 8; i += 1)	{
			if(hotw[i])	{
				$menu.append($("<li \/>").data(hotw[i]).addClass('pointer').text(_app.ext.widespread.u.formatInfoObj4HOTW(hotw[i])));
				}
			else	{
				break; //exit early once the end of hotw is reached.
				}
			}
		$('#hotwMenu').slideDown();
		$(document.body).one('click',function(){
			$('#hotwButton').removeClass('ui-state-hover');
			$menu.slideUp();
			});
		return false;
		});



				
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				dump('BEGIN admin_orders.callbacks.init.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//actions are functions triggered by a user interaction, such as a click/tap.
//these are going the way of the do do, in favor of app events. new extensions should have few (if any) actions.
		a : {

			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//renderFormats are what is used to actually output data.
//on a data-bind, format: is equal to a renderformat. extension: tells the rendering engine where to look for the renderFormat.
//that way, two render formats named the same (but in different extensions) don't overwrite each other.
		renderFormats : {

			imageURL2Href : function($tag,data)	{
				data.bindData.name = (data.bindData.valuePretext) ? data.bindData.valuePretext+data.value : data.value;
				data.bindData.w = $tag.attr('width');
				data.bindData.h = $tag.attr('height');
				data.bindData.tag = 0;
				$tag.attr('href',_app.u.makeImage(data.bindData)); //passing in bindData allows for using
				},

			prodThumbs : function($tag,data)	{
				var attribs = data.value['%attribs']; //shortcut.
				if(attribs['zoovy:prod_image2'])	{
//					dump(" -> image 2 is set.");
					var $ul = $("<ul>").addClass('listStyleNone noPadOrMargin');
					for(var i = 1; i <= 25; i++)	{
						if(attribs['zoovy:prod_image'+i])	{
							$ul.append("<li class='floatLeft marginRight marginBottom'><a href='"+_app.u.makeImage({'name':attribs['zoovy:prod_image'+i],'w':'','h':'','b':'ffffff','tag':0})+"' data-gallery='gallery'><img src='"+_app.u.makeImage({'name':attribs['zoovy:prod_image'+i],'w':75,'h':75,'b':'ffffff','tag':0})+"' alt=''  width='75' height='75' /></a></li>");
							}
						else	{
							//image not set.
							}
						}
					$tag.append($ul);
					}
				else	{
//					dump(" -> image 2 is NOT set.");
					//if image2 isn't set, skip em all.
					}
				//<a href='blank.gif' data-bind='var: product(zoovy:prod_image2); format:imageURL2Href; h:; w:;' data-gallery="gallery"  ><img src='blank.gif' alt='' data-bind='var: product(zoovy:prod_image2); format:imageURL;' width='75' height='75' /></a>
				},
			
			srcset : function($tag,data)	{
//				dump('got into displayFunctions.image: "'+data.value+'" and range: '+data.bindData.range);
				data.bindData.b = data.bindData.bgcolor || 'ffffff'; //default to white.
				
				if(data.bindData.isElastic) {
					data.bindData.elasticImgIndex = data.bindData.elasticImgIndex || 0; //if a specific image isn't referenced, default to zero.
					data.value = data.value[data.bindData.elasticImgIndex];
					};
				if(data.value)	{
	//set some recommended/required params.
					data.bindData.name = (data.bindData.valuePretext) ? data.bindData.valuePretext+data.value : data.value;
					data.bindData.tag = 0;
					
					if(data.bindData.range == 'homeSearchResults')	{
						//used for defaultimage.
						data.bindData.w = 120;
						data.bindData.h = 120;

						var srcSet = new Array(
							_app.u.makeImage(data.bindData)+" 1040w 1x",
							_app.u.makeImage($.extend({},data.bindData,{h:240,w:240}))+" 1040w 2x", //double the default size. for high density screens.
							_app.u.makeImage($.extend({},data.bindData,{h:220,w:220}))+" 1x",
							_app.u.makeImage($.extend({},data.bindData,{h:440,w:440}))+" 2x"
							)
						}
					else if(data.bindData.range == 'lineItemProdlist')	{
						//used for defaultimage.
						data.bindData.w = 100;
						data.bindData.h = 100;

						var srcSet = new Array(
							_app.u.makeImage(data.bindData)+" 1040w 1x",
							_app.u.makeImage($.extend({},data.bindData,{h:200,w:200}))+" 1040w 2x", //double the default size. for high density screens.
							_app.u.makeImage($.extend({},data.bindData,{h:220,w:220}))+" 1x",
							_app.u.makeImage($.extend({},data.bindData,{h:440,w:440}))+" 2x"
							)
						}
					else if(data.bindData.range == 'homeCycle')	{
						//used for defaultimage.
						data.bindData.w = 280;
						data.bindData.h = 220;
//						dump(" -----------> data.bindData for srcset: "); dump(data.bindData,'debug');
						var srcSet = new Array(
							_app.u.makeImage(data.bindData)+" 800w 1x",
							_app.u.makeImage($.extend({},data.bindData,{h:440,w:560}))+" 800w 2x", //double the default size. for high density screens.
							_app.u.makeImage($.extend({},data.bindData,{h:220,w:360}))+" 1x",
							_app.u.makeImage($.extend({},data.bindData,{h:440,w:720}))+" 2x",
							_app.u.makeImage($.extend({},data.bindData,{h:220,w:500}))+" 1x",
							_app.u.makeImage($.extend({},data.bindData,{h:440,w:1000}))+" 2x"
							)
						}
					else if(data.bindData.range == 'prodDetailMainPic')	{
						//used for defaultimage.
						data.bindData.w = 260;
						data.bindData.h = 260;

						var srcSet = new Array(
							_app.u.makeImage(data.bindData)+" 1025w 1x",
							_app.u.makeImage($.extend({},data.bindData,{h:520,w:520}))+" 1025w 2x", //double the default size. for high density screens.
							_app.u.makeImage($.extend({},data.bindData,{h:360,w:360}))+" 1x",
							_app.u.makeImage($.extend({},data.bindData,{h:720,w:720}))+" 2x"
							)
						}
					else	{
						//use whatever is set on the image.
						}


					$tag.attr('src',_app.u.makeImage(data.bindData)); //passing in bindData allows for using
					$tag.attr("srcset",srcSet.join(','));
					
					}
				else	{
	//				$tag.css('display','none'); //if there is no image, hide the src. 
					}
				}
			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {


			formatInfoObj4HOTW : function (sotw){
				var r; //what is returned. a 'pretty' text for this history item.
				switch(sotw.pageType)	{
					case 'product':
						r = "product: "+((_app.data['appProductGet|'+sotw.pid]) ?  _app.data['appProductGet|'+sotw.pid]['%attribs']['zoovy:prod_name'] : sotw.pid);
						break;
					
					case 'category':
						r = "category: "+((_app.data['appNavcatDetail|'+sotw.navcat]) ?  _app.data['appNavcatDetail|'+sotw.navcat].pretty : sotw.navcat);
						break;
					
					case 'homepage':
						r = "Home";
						break;
					
					case 'search':
						r = "Search: "+sotw.KEYWORDS;
						break;
					
					case 'cart':
						r = 'Cart';
						break;
			
					case 'checkout':
						r = 'Checkout';
						break;
			
					default:
						r = sotw.pageType + ': '+sotw.show;
					}
				return r;
				}


			}, //u [utilities]

//app-events are added to an element through data-app-event="extensionName|functionName"
//right now, these are not fully supported, but they will be going forward. 
//they're used heavily in the admin.html file.
//while no naming convention is stricly forced, 
//when adding an event, be sure to do off('click.appEventName') and then on('click.appEventName') to ensure the same event is not double-added if app events were to get run again over the same template.
		e : {
			} //e [app Events]
		} //r object.
	return r;
	}
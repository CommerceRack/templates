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





var store_masonry = function() {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
//executed when extension is loaded. should include any validation that needs to occur.
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).

				//if there is any functionality required for this extension to load, put it here. such as a check for async google, the FB object, etc. return false if dependencies are not present. don't check for other extensions.
				
				app.rq.push(['templateFunction','categoryTemplate','onCompletes',function(infoObj) {
					var $context = $(app.u.jqSelector('#'+infoObj.parentID));
					if(!$context.data('masonized')){
						app.ext.store_masonry.u.masonImageInit($context);
						app.ext.store_masonry.u.runMasonry($context);
						$context.data('masonized',true);
					}
					else {
						setTimeout(function(){app.ext.store_masonry.u.reloadMasonry($context);},2000);
					}
				}]);
				
				r = true;

				return r;
				},
			onError : function()	{
//errors will get reported for this callback as part of the extensions loading.  This is here for extra error handling purposes.
//you may or may not need it.
				app.u.dump('BEGIN admin_orders.callbacks.init.onError');
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
		
			assignElasticImgSrc : function($tag, data){
				//app.u.dump(data.value[data.bindData.index]);
				$tag.attr('data-imgsrc',data.value[data.bindData.index]);
			},
		
			//randomly assigns size of category and product list divs for masonry layout
			pickClass : function($tag, data) {

				var a = Math.random()*4+1;
				var b = a.toString().split('.');
				var number = b[0];
				
				//decide which size the cat/prod list element should be
				switch(number) {
					case '1'	:	$tag.addClass('masonOne'); break;
					case '2'	:	$tag.addClass('masonTwo'); break;
					case '3'	:	$tag.addClass('masonThree'); break;
					case '4'	:	$tag.addClass('masonFour'); break;
						//for some reason the above logic concatenates the numbers to be added sometimes,
						//default case adds largest image because that case is acceptable for repetition.
					default		:	$tag.addClass('masonOne');
				}
			}, //pickClass
		

			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//utilities are typically functions that are exected by an event or action.
//any functions that are recycled should be here.
		u : {
		
			//does what the name implies
			runMasonry : function($context) {
				var $target = $('.masonList', $context);
				//initialize
				setTimeout(function() {
					var masonry = $target.masonry({
						columnWidth		:	177,
						itemSelector	:	'.anyMasonry',
						gutter			:	0,
					//	isFitWidth		:	true,
						transitionDuration : '2s',
						containerStyle	:
						{
							position	:	'relative',
							opacity		:	1,
							transition	:	'opacity 1s',
							'-webkit-transition' : 'opacity 2s 2s'
						}
					});
					//$target.data('masonry',masonry);
				},2000);
			}, //runMasonry
			
			//does what the name implies
			reloadMasonry : function($context) {
				var $target = $('.masonList', $context);
				var masonry = $target.masonry('layout');
			}, //reloadMasonry
			
			//reads elements w/ masonImage class and runs makeImageFromImgSrc on them
			masonImageInit : function($context) {
				$('.masonImage', $context).each(function() {
					app.ext.store_masonry.u.makeImageFromImgSrc($(this));
					//$(this).removeClass('catMasonImage');
				});
			},
			
			//does a make image on elements w/ data-imgsrc based on the container size
			makeImageFromImgSrc : function($tag, attempts){
				attempts = attempts || 0;
				if($tag.attr('data-imgsrc')){
 					$tag.append(app.u.makeImage({
						"name"	: $tag.data('imgsrc'),
						"w"		: $tag.innerWidth(),
						"h"		: $tag.innerHeight(),
						"b"		: "tttttt",
						"tag"	: 1
					}));
				}
				else if(attempts < 50){
					setTimeout(function(){
						app.ext.store_masonry.u.makeImageFromImgSrc($tag, attempts +1);
						}, 250);
				}
				else {
					app.u.dump("-> ERROR app.ext.store_masonry.u.makeImageFromImgSrc failed to load an image for following tag:"); app.u.dump($tag);
				}
			},
		
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
 $(document).bind("mobileinit", function () {
           // $.support.cors = true; // force cross-site scripting (as of jQuery 1.5)
            $.mobile.allowCrossDomainPages = true;
        });
$(function() {
	//$.mobile.page.prototype.options.domCache = true;
	//active = $.mobile.activePage.attr('id')+'.html';
	racine ="http://outils.vn.auf.org/media/";
	
	var viewport = {
    width  : $(window).width(),
    height : $(window).height()
	};
	

	
	 ajaxNews();
	ajaxSA();
   $(document).on('click','#news ul li a', function () {
           
		    siteweb = $(this).attr('data-title');
			frame ='<IFRAME id="frameId" src="'+siteweb+'" width="100%"  scrolling=auto frameborder=1 > </IFRAME>';
			
			theframe = $(frame);
			//theframe.appendTo($("#contenusite"));
			
			$("#contenusite").html(theframe);
			$.mobile.initializePage();
			
			$.mobile.changePage('#details', "up", true, true);
			$("#frameId").load(function() {
    			$(this).height( viewport.height );
			});
			$('body').find('#details').page();
				
		
        });   
		   
	$('div.ui-page').live("swipeleft", function(){
		var nextpage = $(this).next('div[data-role="page"]');
		
		if (nextpage.length > 0 && nextpage.attr('id') !='details') {
			$.mobile.changePage(nextpage, "slide", false, true);
		}
	});
	$('div.ui-page').live("swiperight", function(){
		var prevpage = $(this).prev('div[data-role="page"]');
		
		if (prevpage.length > 0) {
		$.mobile.changePage(prevpage, {transition: "slide",reverse: true}, false, true);

		}
	});
	
			
			
	
});
function ajaxSA(){
	var url = 'https://outils.vn.auf.org/veille/api_sa/?format=jsonp';
	 $.ajax({
		type: 'GET',
		dataType: "jsonp",
		url: url,
		crossDomain: true,
		jsonp: 'callback', 
		cache: false,
		success: function (responseData, textStatus, jqXHR) {			
				
		
			var data = responseData.results;
			var resultat = '<div data-role="tabs" id="tabs"><div data-role="navbar"  style="position:fixed;width:95%;z-index:10000;height:80px;"><ul>';
			for(i=0;i<data.length;i++ ){
				resultat +='<li><a href="#pays'+data[i].id+'" >'+data[i].pays+'</a></li>';
			
				
				}
					
			resultat+='</ul>  </div>';
  			for(i=0;i<data.length;i++ ){
				resultat+='<div id="pays'+data[i].id+'" class="ui-body-d ui-content " style="top:100px;height:device-height;overflow:auto;-webkit-overflow-scrolling: touch;">';
					resultat+='<h2>'+data[i].pays+'</h2>';
					resultat+= data[i].contenu_mobile;
 				 resultat+='</div>';
			
				
			}
				 resultat+='</div>';
    		$('#systemeinfos').html(resultat);

		},
		error: function (responseData, textStatus, errorThrown) {
				
			 alert('POST failed.'+errorThrown);
		}
		});
}
function ajaxNews(){
	 var  url = "https://outils.vn.auf.org/news/api/?format=jsonp";
	 
	 $.ajax({
				type: 'GET',
				dataType: "jsonp",
				url: url,
				crossDomain: true,
				jsonp: 'callback', 
				cache: false,
				success: function (responseData, textStatus, jqXHR) {			
						
						var resultat ='<ul data-role="listview" data-inset="true" class="listnews">';
						var data = responseData.results;
						for(i=0;i<data.length;i++ ){
					 		
							resultat+= '<li><a href="#"  data-title="'+data[i].lien_vers_site+'" data-ajax="false"><img src="'+racine+data[i].images+'"> <h2>'+data[i].titre+'</h2><p >'+data[i].extrait_contenu.substring(80,-1)+'</p></a> </li>';
						
						
						}
							resultat+='</ul>';
						// $("[data-role='listview']").html(resultat);
						 $("#news").html(resultat).find("ul").addClass('listnews');
						
				},
				error: function (responseData, textStatus, errorThrown) {
						
					 alert('POST failed.'+errorThrown);
				}
				});
}
 $(document).bind("mobileinit", function () {
           // $.support.cors = true; // force cross-site scripting (as of jQuery 1.5)
            $.mobile.allowCrossDomainPages = true;
        });
$(function() {
	//$.mobile.page.prototype.options.domCache = true;
	//active = $.mobile.activePage.attr('id')+'.html';
	racine ="https://outils.vn.auf.org/media/";
	
	var viewport = {
    width  : $(window).width(),
    height : $(window).height()
	};
	

	 url = "http://outils.vn.auf.org/news/api/?format=jsonp";
	 ajax();
	
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
function ajax(){
	 $.ajax({
				type: 'GET',
				dataType: "jsonp",
				url: url,
				crossDomain: true,
				jsonp: 'callback', 
				cache: false,
				success: function (responseData, textStatus, jqXHR) {			
						
						var resultat ='<ul data-role="listview" data-inset="true">';
						var data = responseData.results;
						for(i=0;i<data.length;i++ ){
					 		
							resultat+= '<li><a href="#"  data-title="'+data[i].lien_vers_site+'" data-ajax="false"><img src="'+racine+data[i].images+'"> <h2>'+data[i].titre+'</h2><p>'+data[i].extrait_contenu+'</p></a> </li>';
						
						
						}
							resultat+='</ul>';
						// $("[data-role='listview']").html(resultat);
						 $("#news").html(resultat).find("ul").listview();
						
				},
				error: function (responseData, textStatus, errorThrown) {
						
					 alert('POST failed.'+errorThrown);
				}
				});
}
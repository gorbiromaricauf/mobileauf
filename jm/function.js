 
$(function() {
	racine ="http://outils.vn.auf.org/media/";
	if(typeof(Storage) !== "undefined") {
   		 if(typeof(sessionStorage.recherche) == "undefined"){
		 	sessionStorage.recherche = false;
		 }
		 
		 if(typeof(sessionStorage.urlnews) == "undefined" || (sessionStorage.urlnews == 'null') ){
		 	sessionStorage.urlnews = "http://outils.vn.auf.org/news/api/?page=1";
		 }
		 
		 if(typeof(localStorage.premierefois)=="undefined"){
		 	localStorage.premierefois = true;
			document.getElementById('light').style.display='block';document.getElementById('fade').style.display='block';
		 }
	} else {
   		 alert('Votre navigateur ne supporte pas les coockies');
	}
	
	$(window).scroll(function () {
			// Start loading when 200px from the bottom
			
			if ($(window).scrollTop() + $(window).height() > $('#news').height() - 100 && !isLoading) {
			  	sessionStorage.recherche = false;
				
			   if(sessionStorage.urlnews!='null'){
				
				ajaxNews();
			   }else{
				   
				$('#loading').html('<h2 >Aucune données à télécharger</h2>');
			   }
			}
		});

	var viewport = {
    width  : $(window).width(),
    height : $(window).height()
	};
	isLoading = false;
	ajaxNews();
	ajaxSA();
   $(document).on('click','#news ul li ', function () {
           
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
		  $(document).on('click','.index', function () {
           	if(sessionStorage.urlnews =='null'){
				sessionStorage.recherche = 	true; 
			}
			ajaxNews();
		
        });   
	
});

function ajaxSA(){
	
	var url = 'http://outils.vn.auf.org/veille/api_sa/?format=jsonp';
	 $.ajax({
		type: 'GET',
		dataType: "jsonp",
		url: url,
		crossDomain: true,
		jsonp: 'callback', 
		cache: false,
		success: function (responseData, textStatus, jqXHR) {			
				
		
			var data = responseData.results;
			var resultat = '<div data-role="tabs" id="tabs"><div data-role="navbar" data-position="fixed" style="position:fixed;width:95%;z-index:10000;height:80px;top:43px;"><ul>';
			for(i=0;i<data.length;i++ ){
				resultat +='<li><a href="#pays'+data[i].id+'" >'+data[i].pays+'</a></li>';
			
				
				}
					
			resultat+='</ul>  </div>';
  			for(i=0;i<data.length;i++ ){
				resultat+='<div id="pays'+data[i].id+'" class="ui-body-d ui-content " style="top:50px;overflow:auto;-webkit-overflow-scrolling: touch;">';
					resultat+='<h2>'+data[i].pays+'</h2>';
					resultat+= data[i].contenu_mobile;
 				 resultat+='</div>';
			
				
			}
				 resultat+='</div>';
    		$('#systemeinfos').html(resultat);
			$('body').find('#systeme').page();

		},
		error: function (responseData, textStatus, errorThrown) {
				
			 alert('POST failed.'+errorThrown);
		}
		});
}

function ajaxNews(){
	var isRecherche = sessionStorage.recherche;
	
	isLoading = true;
	$("#loading").show();
	// url = urlnews+'&format=jsonp';	
	if(sessionStorage.urlnews =='null'){
		sessionStorage.urlnews = "http://outils.vn.auf.org/news/api/?page=1"; 
	}
	var url = sessionStorage.urlnews;
	
	 $.ajax({
		type: 'GET',
		dataType: "jsonp",
		url: url,
		crossDomain: true,
		jsonp: 'callback', 
		cache: false,
		success: function (responseData, textStatus, jqXHR) {			
				
			var resultat ='';
			var data = responseData.results;
			
			
			for(i=0;i<data.length;i++ ){
				
				resultat+= '<li data-title="'+data[i].lien_vers_site+'"><a href="#"   data-ajax="false"><img src="'+racine+data[i].images+'"> <h2>'+data[i].titre.substring(130,-1)+'</h2><p >'+data[i].extrait_contenu.substring(100,-1)+'</p></a> </li>';
			
			
			}
		 $("#loading").hide();
		
		 if(isRecherche=='true'){
			
			 $("#listnews").html(resultat).addClass('listnews');
		 }else{
		 	
			$("#listnews").append(resultat).addClass('listnews');
		 }
		 isLoading = false;
		
		 sessionStorage.urlnews =  responseData.next;
		 sessionStorage.recherche = false;
		},
		error: function (responseData, textStatus, errorThrown) {
				
			 alert('POST failed.'+errorThrown);
		}
		});
}
function rechercher(){
	 recherche = true; 
	 sessionStorage.urlnews = 'http://outils.vn.auf.org/news/api/?titre='+$('#searchinput1').val();
	 sessionStorage.recherche = true;
	 
}
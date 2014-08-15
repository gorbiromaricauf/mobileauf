 
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
			
  			for(i=0;i<data.length;i++ ){
				
				var resultat = '<div> '+data[i].contenu_mobile+'</div>';
				data[i].pays = data[i].pays.replace(' ','').toLowerCase();
				
				$('#systeme_contenu_'+data[i].pays).append(resultat);
				$('body').find('#systeme_'+data[i].pays).page();
			
				
			}
				
    		//$('#systemeinfos').append(resultat);
			

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
	url = "http://outils.vn.auf.org/news/api/?page=1";
	var resultat = '';
	
	 $.getJSON(url, function(datas){
	 	var data =  datas.results;
		for(i=0;i<data.length;i++ ){
				
			resultat+= '<li data-title="'+data[i].lien_vers_site+'"><a href="#"   data-ajax="false"><img src="'+racine+data[i].images+'"> <h2>'+data[i].titre.substring(130,-1)+'</h2><p >'+data[i].extrait_contenu.substring(100,-1)+'</p></a> </li>';
	
		}
		
		$("#loading").hide();
		
		 if(isRecherche=='true'){
			
		//	$("#listnews").html(resultat).addClass('listnews');
			$("#listnews").html(resultat).listview();
		 }else{
		 	// $("#listnews").append(resultat).addClass('listnews');
			$("#listnews").append(resultat).listview();
			
		 }
		 isLoading = false;
		
		
		 sessionStorage.urlnews =  datas.next;
		 sessionStorage.recherche = false;
	 });
	
}
function rechercher(){
	 
	 sessionStorage.urlnews = 'http://outils.vn.auf.org/news/api/?titre='+$('#searchinput1').val();
	 sessionStorage.recherche = true;
	 ajaxNews();
	 
	 
}
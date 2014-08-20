 
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
   $(document).on('tap','#news ul li ', function () {
           
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
		  $(document).on('tap','.test1 li', function () {
           	if(sessionStorage.urlnews =='null'){
				sessionStorage.recherche = 	true; 
			}
			ajaxNews();
			ajaxSA()
		
        });   
	 $('#enregistrer_repertoire').bind( "tap", add_membre );	
	function add_membre(){alert('fr');
		/*$.post( "http://outils.vn.auf.org/veille/add-membres/", { name: "John", time: "2pm" } )
			.done(function( data ) {
   		 alert( "Data Loaded: " + data );
  		});*/
		$.ajax({
		  type:'POST',
		  
		  
		  url: "http://outils.vn.auf.org/veille/add-membres/",
		  data: JSON.stringify({"nom":"Gor bi","prenom":"Romaric the one","email":"test@yahoo.com"}),
		 
		  contentType: "application/json; charset=utf-8",	  
		 success: function (responseData, textStatus, jqXHR) {			
		
			alert(responseData.toString());
		},
		error: function (responseData, textStatus, errorThrown) {
				
			 alert('POST failed.'+errorThrown+ textStatus);
		}
		});
	}
	
});

function ajaxSA(){
	
	var url = 'http://outils.vn.auf.org/veille/api_sa/?format=jsonp';

	 $.ajax({
		type: 'GET',
		dataType: "jsonp",
		url: url,
		timeout:30000 ,
		crossDomain: true,
		jsonp: 'callback', 
		cache: false,
		success: function (responseData, textStatus, jqXHR) {			
		
			var data = responseData.results;
			
  			for(i=0;i<data.length;i++ ){
				
				var resultat = '<div> '+data[i].contenu_mobile+'</div>';
				data[i].pays = data[i].pays.replace(' ','').toLowerCase();
				
				$('#systeme_contenu_'+data[i].pays).html(resultat);
				$('body').find('#systeme_'+data[i].pays).page();
			
				
			}
				
			

		},
		error: function (responseData, textStatus, errorThrown) {
				
			if(textStatus == 'timeout')
			{     
				alert('Vérifiez votre connexion internet'); 
				//do something. Try again perhaps?
			}
		}
		});
}

function ajaxNews(){
	
	
	
	isLoading = true;
	$("#loading").show();
	// url = urlnews+'&format=jsonp';	
	if(sessionStorage.urlnews =='null'){
		sessionStorage.urlnews = "http://outils.vn.auf.org/news/api/?page=1"; 
		sessionStorage.recherche = true;
	}
	var url = sessionStorage.urlnews;
	var isRecherche = sessionStorage.recherche;
	var resultat = '';
	
	 $.getJSON(url, function(datas){
	 	var data =  datas.results;
		for(i=0;i<data.length;i++ ){
			extrait = data[i].extrait_contenu.split(' ',20);
			extrait = extrait.join(' ');
			titre = data[i].titre.split(' ',20);
			titre = titre.join(' ');
			if(data[i].images!=''){var img = '<img src="'+racine+data[i].images+'">';}else{var img ='<div > &nbsp;</div>';}
			resultat+= '<li data-title="'+data[i].lien_vers_site+'"><a href="#"   data-ajax="false">'+img+' <h2>'+titre+'</h2><h2 class="pour_grand_ecran">'+data[i].titre+'</h2><p >'+extrait+'</p></a> </li>';
	
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

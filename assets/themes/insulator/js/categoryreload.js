
	var hash = document.location.hash;
	var pathname = document.location.pathname;
	var prefix = "categoriestab_";
	var idPrefix = "nav_"
	var id = pathname.split('/')[1].split('.')[0];
	idPrefix += id;
	var activeEle = document.getElementById(idPrefix);
	if(activeEle)
	{
		activeEle.setAttribute("class","active");
	}
	if (hash) {
	    $('.nav-tabs a[href='+hash.replace(prefix,"")+']').tab('show');
	} 

	// Change hash for page-reload
	$('.nav-tabs a').on('shown.bs.tab', function (e) {
	    window.location.hash = e.target.hash.replace("#", "#" + prefix);
	});

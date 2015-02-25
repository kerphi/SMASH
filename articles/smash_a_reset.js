/*
* 	This script is adapted from Matthew Reidsma's 360Link Reset script.
*
* 	360Link Reset > 360link-reset.js
* 	Script for radically improving the Serials Solutions 360Link Link Resolver
*
*	For more information, see http://github.com/gvsulib/360Link-Reset
*
*	Author: Matthew Reidsma, reidsmam@gvsu.edu, @mreidsma
*	Version 3.0
*/

var $j = jQuery.noConflict(); // Simplify the noConflict call since 360Link loads Prototype

$j(document).ready(function() { // Wait until the original page loads

	var debug = false;  // Enable/Disable edit citation and console.log
	var catalog_detail = 'http://catalogue.univ-aix-marseille.fr/cgi-bin/koha/opac-detail.pl?biblionumber=';

	// ACTIVATE MAGIC FAIRY DUST

	// Make site responsive
	$j("head").append('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');

	// Remove existing styles
	$j("head").find("link").remove();

	// Load custom local stylesheets
	$j("head").append("<link rel=\"shortcut icon\" type=\"text/css\" href=\"https://googledrive.com/host/0B5eMKEibXI0pWExrQmFnMkQ3NWc/favicon.ico\" />"); // Load webfont
	$j("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"http://fonts.googleapis.com/css?family=Open+Sans\" />"); // Load webfont
	$j("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"http://cdnjs.cloudflare.com/ajax/libs/pure/0.5.0/pure-min.css\" />"); // Load stylesheet from library website
	$j("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"https://googledrive.com/host/0B5eMKEibXI0pWExrQmFnMkQ3NWc/smash_a.min.css\" />"); // Load stylesheet from library website

	// Function to grab items from the URL

	function getQueryVariable(v) {
		var vars = query.split('&');
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			if (decodeURIComponent(pair[0]) == v) {
				return decodeURIComponent(pair[1]);
			}
		}
		if (debug === true) { console.log('Query variable %s not found', v) }
	}

	// Define common variables
	var authorFirst=$j(".given-name").text().trim(),
	authorLast=$j(".family-name").text().trim(),
	results="",
	articleLinkdata=[],
	journalLinkdata=[],
	BookLinkdata=[],
	dateRangedata=[],
	DatabaseNamedata=[],
	DatabaseLinkdata=[],
	gsAut='disabled',
	gsAutlabel='bounce-label-false',
	gsAutURL="",
	gsCit='disabled',
	gsCitlabel='bounce-label-false',
	gsCitURL="",
	orderCopy='disabled',
	orderCopylabel='bounce-label-false',
	orderURL="",
	refinerlink="",
	i=0, ///
	libFormat="",
	buttonText="",
	buttonLink="",
	query = document.location.search;
	// Define citation variables
	var	title="",
	article="",
	vol="",
	issue="",
	pages="",
	date="",
	standardno="",
	resultsTable="",
	journalDOI="",
	journalDOIhtml="",
	authorName = authorLast + ', ' + authorFirst;

	// Set variables from citation
	if (format === "Journal" || format === "JournalFormat") { // Journals
		title = $j("#CitationJournalTitleValue").text().trim(),
		article = $j("#CitationJournalArticleValue").text().trim(),
		vol = $j("#CitationJournalVolumeValue").text().trim(),
		issue = $j("#CitationJournalIssueValue").text().trim(),
		date = $j("#CitationJournalDateValue").text().trim(),
		pages = $j("#CitationJournalPageValue").text().trim(),
		standardno = $j("#CitationJournalIssnValue").text().trim(),
		resultsTable = $j("#JournalLinkTable"),
		journalDOI = $j("td#CitationJournalDOIValue").text().trim(),
		journalDOIhtml,
		libFormat = "Revue";
	}
	if (format === "BookFormat" || format === "Book") { // Books
		title = $j("#CitationBookTitleValue").text().trim(),
		date = $j("#CitationBookDateValue").text().trim(),
		standardno = $j("td#CitationBookISBNValue").text().trim(),
		resultsTable = $j("#BookLinkTable"),
		libFormat = "Livre";
		var searchisbn = standardno;
		var comma = standardno.indexOf(',');
		searchisbn = searchisbn.substring(0, searchisbn != -1 ? comma : searchisbn.length);
	}
	if (format === "Dissertation" || format === "DissertationFormat") { // Dissertations
		title = $j("#CitationDissertationTitleValue").text().trim(),
		date = $j("#CitationDissertationDateValue").text().trim(),
		resultsTable = $j("#BookLinkTable");
	}
	if (format === "Patent" || format === "PatentFormat") { // Patents
		title = $j("#CitationPatentTitleValue").text().trim(),
		date = $j("#CitationPatentInventorDateValue").text().trim(),
		authorName = $j("td#CitationPatentInventorValue").text().trim(),
		resultsTable = $j("#BookLinkTable");
	}
	if (format === "UnknownFormat" || format === "Unknown") { // Unknown Format
		title = $j("#CitationUnknownPublicationValue").text().trim(),
		date = $j("#CitationUnknownDateValue").text().trim(),
		standardno=$j("#CitationBookISBNValue").text().trim(),
		resultsTable=$j("#BookLinkTable");
	}

	// Build URL for Biblio+ & Dispo+
	if(format === "Journal" || format === "JournalFormat") {
		orderURL = 'http://bu.univ-amu.fr/pret-entre-bibliotheques?type=article&journalName=' + encodeURI(title) + '&journalDate=' + encodeURI(date) + '&journalVol=' + encodeURI(vol) + '&journalIssue=' + encodeURI(issue) + '&journalPages=' + encodeURI(pages) + '&journalissn=' + encodeURI(standardno) + '&authorName=' + authorName + '&articleName=' + encodeURI(article) + '&articleDOI=' + encodeURI(journalDOI);
		if (debug === true) { console.log(orderURL) }
		if (typeof journalDOI !== 'undefined' && journalDOI !== '') {
			gsCit = "enabled",	gsCitlabel = "bounce-label-true", gsCitURL = 'http://scholar.google.fr/scholar?hl=fr&inst=2952611022847718469&cites=http://dx.doi.org/' + journalDOI;
		}
		if (typeof authorName !== 'undefined') {
			gsAut = "enabled",	gsAutlabel = "bounce-label-true", gsAutURL = 'http://scholar.google.fr/scholar?hl=fr&inst=2952611022847718469&q=authornbsp%3A&quot;' + authorFirst + '&nbsp;' + authorLast + '&quot;';
		}
		if (standardno !== 'undefined') { getSRU(standardno,'issn') }
		if (article !== 'undefined') { getJEEP(article,authorLast) }
	} else if (format === "BookFormat" || format === "Book") {
		if (standardno !== 'undefined') { getSRU(standardno,'isbn') }
		if (title !== 'undefined') { getJEEP(title,authorLast) }
	} else {
		$j('#oaDispo').html('<a class="disabled" href="#"><span class="bounce-label-false"></span>Article en libre accès</a>');
	}

	var newPage = document.createElement('div');
	newPage.id = 'layout';

	var newPageContent = document.createElement('div');
	newPageContent.id = 'content';
	newPageContent.className = 'pure-g';
	newPage.appendChild(newPageContent);

	var newPageContentMain = document.createElement('div');
	newPageContentMain.id = 'main';
	newPageContentMain.className = 'pure-u-1 pure-u-md-2-3';
	newPageContent.appendChild(newPageContentMain);

	var newPageContentSidebar = document.createElement('div');
	newPageContentSidebar.id = 'sidebar';
	newPageContentSidebar.className = 'pure-u-1 pure-u-md-1-3';
	newPageContent.appendChild(newPageContentSidebar);

	var newPageFooter = document.createElement('div');
	newPageFooter.id = 'footer';
	newPageFooter.className = 'pure-u-1';
	newPageFooter.innerHTML = '<div class="footer-content"><div class="line-block"><div class="line-color" style="background-color: #FF8800;"></div><div class="line-color" style="background-color: #FBBA00;"></div><div class="line-color" style="background-color: #7CB61F;"></div><div class="line-color" style="background-color: #22BBEA;"></div><div class="line-color" style="background-color: #0071B9;"></div><div class="line-color" style="background-color: #5943FF;"></div><div class="line-color" style="background-color: #B243FF;"></div></div><p><a href="http://sh2hh6qx2e.search.serialssolutions.com/">SMASH</a> articles - <span style="color: #0071B9;">(</span>Aix<span style="color: #FBBA00;">*</span>Marseille Université | <a href="http://bu.univ-amu.fr/">Bibliothèques universitaires</a></p></div>';
	newPage.appendChild(newPageFooter);

	// Add context so if var is blank, it won't display 
	if (authorName.length > 0) {authorName = authorName + '.';}
	if (article.length > 0) {article = '&nbsp;&#xAB;&nbsp;' + article + '&nbsp;&#xBB;.&nbsp;';}
	if (vol.length > 0) {vol = '&nbsp;' + vol ;}
	if (issue.length > 0) {issue = '.' + issue ;}
	if (date.length > 0) {date = '&nbsp;(' + date +')';}
	if (pages.length > 0) {pages = '&nbsp;' + pages;}
	if (standardno.length > 0) {
		if (format === "Journal" || format === "JournalFormat") {standardno = '.&nbsp;ISSN&nbsp;' + standardno;}
		else {standardno = '.&nbsp;ISBN&nbsp;' + standardno;}
	}
	if (journalDOI.length > 0) {journalDOIhtml = '.&nbsp;DOI&nbsp;<a href="http://dx.doi.org.lama.univ-amu.fr/' + journalDOI + '"><span id="CitationDOI">' + journalDOI + '</span></a>';}

	if (debug === true) {refinerlink = '&nbsp;<a href="' + $j("#RefinerLink0").find("a").attr("href") + '" class="edit-link">[Edit]</a>';}

	var citationDiv = document.createElement('div');
	citationDiv.id = 'citation';
	citationDiv.innerHTML = '<div class="pure-u"><p class="result-content-title"><span id="citation-author">' + authorName + '</span><span id="citation-article">' + article + '</span><em><span id="citation-title">' + title + '</span></em>' + vol + issue + '<span id="citation-date">' + date + '</span>' + pages + standardno + journalDOIhtml + '.' + refinerlink + '</p></div><div data-badge-type="donut" data-doi="' + journalDOI + '" data-hide-no-mentions="false" class="altmetric-embed result-content-altmetric"></div>';

	// Get data on all items in results list
	$j(resultsTable).find("tr").each(function(index) {
		// Grab values from the results table
		if (index !== 0) {
			if (format === "Journal" || format === "JournalFormat") {
				// Get the article link, if available
				articleLinkdata[i] = $j(this).find("#ArticleCL").find("a").attr("href");
				journalLinkdata[i] = $j(this).find("#JournalCL").find("a").attr("href");
				} else {
				// Not a journal article
				// Get the book link, if applicable
				BookLinkdata[i] = $j(this).find("#BookCL").find("a").attr("href");
			}
			// Get the date range
			dateRangedata[i] = $j(this).find("#DateCL").text();
			// Get the database name
			DatabaseNamedata[i] = $j(this).find("#DatabaseCL").text();
			// Get the database link
			DatabaseLinkdata[i] = $j(this).find("#DatabaseCL").find("a").attr("href");
			i++;
		}
		results = index; // Get total number of results
	});

	if (results > 0) {
		// There are results
		if (debug === true) { console.log(journalDOI) }
		// Develop link for top result
		if ((typeof articleLinkdata[0] === 'undefined') && (typeof BookLinkdata[0] === 'undefined') && (journalDOI == "")) {
			// Journal level link only
			buttonText = 'consulter la revue';
			buttonLink = journalLinkdata[0];
		} else if ((typeof articleLinkdata[0] === 'undefined') && (typeof BookLinkdata[0] === 'undefined') && (journalDOI != "")) {
			// Journal level link but DOI
			buttonText = 'texte intégral';
			buttonLink = 'http://dx.doi.org.lama.univ-amu.fr/' + journalDOI;
		} else {
			buttonText = 'texte intégral';
			if(typeof articleLinkdata[0] === 'undefined') {
				// Book
				buttonLink = BookLinkdata[0];
			} else {
				buttonLink = articleLinkdata[0];
			}
		}

		// Create the results DOM object
		var resultsDiv = document.createElement('div');
		resultsDiv.id = 'search-results';

		var topResult = document.createElement('div');
		topResult.id = 'top-result';
		topResult.className = 'result-item pure-g';
		topResult.innerHTML = '<div class="pure-u"><a href="' + buttonLink + '" class="pure-button pure-button-primary">' + buttonText + '</a><span class="result-item-name">' + DatabaseNamedata[0].trim() + '</span></div>';
		resultsDiv.appendChild(topResult);

		if(i > 1) { // There are additional links
			var showResultsLabel, extraResults = i-1;
			if(extraResults === 1) { // Only 1 additional result
				showResultsLabel = "voir 1 résultat supplémentaire";
			} else { // More than one result
				showResultsLabel = "voir " + extraResults + " résultats supplémentaires";
			}

			var additionalResultsTrigger = document.createElement('div');
			additionalResultsTrigger.id = 'more-results-button';
			additionalResultsTrigger.className = 'result-item pure-g';
			additionalResultsTrigger.innerHTML = '<div class="pure-u">' + showResultsLabel + '</div>';

			// Create variables for additional results
			var newResult,
			newResultLink,
			newResultLabel;

			var additionalResultsDiv = document.createElement('div');
			additionalResultsDiv.id = 'more-results';
			additionalResultsDiv.className = 'result-item pure-g';

			for(var x = 1; x < results; x++) {
				if (debug === true) { console.log(DatabaseNamedata[x].trim()) }
				newResult = document.createElement('div');
				newResult.className = 'result-item-add pure-g';
				if(typeof articleLinkdata[x] === 'undefined') {
					newResultLink = journalLinkdata[x];
					newResultLabel = 'consulter la revue';
				} else {
					newResultLink = articleLinkdata[x];
					newResultLabel = 'texte intégral';
				}
				newResult.innerHTML = '<div class="pure-u"><a href="' + newResultLink + '" class="pure-button pure-button-primary">' + newResultLabel + '</a><span class="result-item-name">' + DatabaseNamedata[x] + '</span></div>';
				additionalResultsDiv.appendChild(newResult);
			} // End for loop

			resultsDiv.appendChild(additionalResultsTrigger);
			resultsDiv.appendChild(additionalResultsDiv);
		} // End additional results loop

	} else { // No results

		// Create the results DOM object
		var resultsDiv = document.createElement('div'),
		noResultsLabel = 'Aucun lien disponible.';

		resultsDiv.id = 'no-content';
		resultsDiv.className = 'result-item pure-g';

		var noResultsHelp = document.createElement('div');
		noResultsHelp.className = 'result-item-add pure-u';

		if (format === "Journal" || format === "JournalFormat") {
			noResultsLabel = 'Aucun texte intégral trouvé pour cet article, relancer une recherche <a href="http://scholar.google.fr/scholar?as_q=&hl=fr&inst=2952611022847718469&num=10&btnG=Search+Scholar&as_epq=' + article + '&as_sauthors=' + authorName + '">Google Scholar</a>.';
			orderCopy = "enabled", orderCopylabel = "bounce-label-true";
		} else if (format === "BookFormat" || format === "Book") {
			if (standardno !== "") {
				noResultsLabel = 'Aucun texte intégral trouvé pour ce livre, relancer une recherche <a href="http://books.google.fr/books?vid=ISBN' + searchisbn + '">Google Books</a> ou <a href="http://scholar.google.fr/scholar?as_q=&hl=fr&inst=2952611022847718469&num=10&btnG=Search+Scholar&as_epq=' + title + '&as_sauthors=' + authorName + '">Google Scholar</a>.';
			} else {
				noResultsLabel = 'Aucun texte intégral trouvé pour ce livre, relancer une recherche <a id="ua_gb" href="http://www.google.fr/search?tbm=bks&hl=fr&q=' + title + '">Google Books</a> ou <a id="ua_gs" href="http://scholar.google.fr/scholar?as_q=&hl=fr&inst=2952611022847718469&num=10&btnG=Search+Scholar&as_epq=' + title + '&as_sauthors=' + authorName + '">Google Scholar</a>.';
			}			
		} else if (format === "Patent" || format === "PatentFormat") {
			noResultsLabel = 'Aucun texte intégral trouvé pour ce brevet, relancer une recherche <a href="http://www.google.com/?tbm=pts#tbm=pts&q=' + title + '">Google Patent</a>.';
		}

		// Build no results message
		var noResultsMessage = document.createElement('div');
		noResultsMessage.className = 'pure-u';
		noResultsMessage.innerHTML = noResultsLabel;
		resultsDiv.appendChild(noResultsMessage);

	} // End no results

	// Serials Solutions does a strange thing when 2 citations conflict. They ask the user to choose between them.
	// This clunky fix tries to make it easier for the user to understand why they are being asked to choose
	// between two seemingly identical things.

	var idiotDiv = $j(".SS_HoldingText a").attr("href"); // This silly solution has appeared

	if(typeof(idiotDiv) !== 'undefined') { // There is a choice between two different citations

		orderCopy = "disabled", orderCopylabel = "bounce-label-false";

		// Set the variables needed
		var whichCitationLink=[],
		whichCitationJournal=[],
		whichCitationIssn=[],
		idiotResults,
		t=0,
		newResultItem;

		// Cycle through the data on the page and populate the arrays
		$j(".SS_HoldingText").each(function(n) {
			whichCitationLink[t] = $j(this).find("a").attr("href");
			whichCitationJournal[t] = $j(this).find(".SS_JournalTitle").text();
			whichCitationIssn[t] = $j(this).find(".SS_IssnText").text();
			t++;
		});
		idiotResults = t + 1;

		var resultsDiv = document.createElement('div');
		resultsDiv.id = 'citation-choice';
		resultsDiv.className = 'result-item pure-g';
		
		var choiceHeading = document.createElement('div');
		choiceHeading.className = 'pure-u';
		choiceHeading.innerHTML = 'Référence disponible dans les revues suivantes :&nbsp;';
		var choiceList = document.createElement('div');
		choiceList.id = 'top-result';
		choiceList.className = 'pure-u';

		for(var j=0; j < idiotResults-1; j++) {
			newResultItem = document.createElement('span');
			newResultItem.innerHTML = '<a href="' + whichCitationLink[j] + '">' + whichCitationJournal[j] + '</a>' + whichCitationIssn[j] + '&nbsp;';
			choiceList.appendChild(newResultItem);
		}

		resultsDiv.appendChild(choiceHeading);
		resultsDiv.appendChild(choiceList);

	} // End of Silly Choice Function

	// Do the magic if this is a link resolver display page:
	// Rewrite Serials Solutions terrible page with a nice semantic, clean div full of easy-to-follow markup
	// So we need to add a div wrapper around the Serials Solutions content to add this HTML into

	var pairvalues = query.split("&");
	if(pairvalues[0] !== "?SS_Page=refiner") { // This is the citation form. Don't rewrite the page.

		newPageContentMain.appendChild(resultsDiv);
		newPageContentMain.appendChild(citationDiv);
		citationDiv.className = 'result-content pure-g';

		var SidebarNav = document.createElement('div');
		SidebarNav.id = 'nav';
		SidebarNav.className = 'pure-u';
		newPageContentSidebar.appendChild(SidebarNav);

		SidebarNav.innerHTML = '<div class="nav-inner"><div class="pure-menu pure-menu-open"><ul><li class="pure-menu-heading">Biblio+</li><li><a class="' + gsAut + '" href="' + gsAutURL + '"><span class="' + gsAutlabel + '"></span>Google Scholar auteur</a></li><li><a class="' + gsCit + '" href="' + gsCitURL + '"><span class="' + gsCitlabel + '"></span>Google Scholar citations</a></li><li class="pure-menu-heading">Dispo+</li><li id="oaDispo"><a class="disabled" href="#"><span class="bounce-label-standby"></span>Article en libre accès</a></li><li id="printDispo"><a class="disabled" href="#"><span class="bounce-label-standby"></span>' + libFormat + ' en bibliothèque</a></li><li id="orderDispo"><a class="' + orderCopy + '" href="' + orderURL + '"><span class="' + orderCopylabel + '"></span>Commander l\'article</a></li></ul></div></div>';

		// Add a clear div to reset all floats at the bottom before the footer starts
		var newPageClear = document.createElement('div');
		newPageClear.style.clear = 'both';
		newPage.appendChild(newPageClear);

		// Find the
		var container = document.getElementById('CitationResults');
		container.parentNode.replaceChild(newPage, container);

		// Hide additional results until toggled
		$j("#more-results").hide();
		$j("#more-results-button").click(function() {
			$j("#more-results").slideToggle(400);
			var current_text = $j("#more-results-button").html();
			if(current_text === '<div class="pure-u">masquer les résultats supplémentaires</div>') {
				$j("#more-results-button").html('<div class="pure-u">voir plus de résultats</div>');
			} else {
				$j("#more-results-button").html('<div class="pure-u">masquer les résultats supplémentaires</div>');
			}
		});
		// Pointer when hover additional results
		$j("#more-results-button").hover(function() {
			$j(this).stop().css({
				"cursor": "pointer"
			});
		});
	} // End page rewrite

    function getSRU(id,type,dispo){ // Print
        id = id.replace(/ /g,'');
        id = id.split(',');
        var query = "";
        for (var i = 0; i < id.length; i++) {
            if(i === 0){
                query += 'index='+type+'&q='+id[i];
            }
            else {
                query += '&q='+id[i];
            }
        }
        var url = "http://smash-sru.appspot.com/?"+query;
        if (debug === true) { console.log(url) }
        $j.ajax({
            url : url,
            dataType: 'jsonp',
            success : function(data) {
                if (data !== null) {
                    var biblionumber = data[0]['biblionumber'];
                    $j('#printDispo').html('<a class="enabled" href="' + catalog_detail + biblionumber + '"><span class="bounce-label-true"></span>' + libFormat + ' en bibliothèque</a>');
                }
                else {
                    $j('#printDispo').html('<a class="disabled" href="#"><span class="bounce-label-false"></span>' + libFormat + ' en bibliothèque</a>');
                }
                if (debug === true) { console.log(biblionumber) }
            }
        });
    }

    function getJEEP(ti,au){ // Open Access
        //ti = ti.replace(/[^\w\s]/gi, '%20AND%20');
        //ti = ti.replace(/ /g,'%20AND%20');
        if (debug === true) { console.log(ti) }
		// au = au.replace(/[^\w\s]/gi, '');
		// au = au.replace(/ /g,'%20');
		// if (debug === true) { console.log(au) };
        // var query = "";
        //query += 'title:%20((' + ti + '))';
        //%20AND%20author:%20(' + au + ')';
        // var url = 'http://jeepway.lib.kyushu-u.ac.jp/jeepway/api/index?target=[%22base%22]&response=0&maxno=1&title=' + ti + '&aulast=' + au ;
        var url = 'http://jeepway.lib.kyushu-u.ac.jp/jeepway/api/index?target=[%22base%22]&response=0&maxno=1&title=' + ti;
        $j.ajax({
            url : url,
            dataType: 'jsonp',
            success : function(data) {
            	// if (debug === true) { console.log(data.status['http_code']) }
                // if (data.status['http_code'] !== "200") {
                //	$j('#oaDispo').html('<a class="disabled" href="#"><span class="bounce-label-false"></span>Article en libre accès</a>');
                // }
                if (data[0] !== undefined) {
                	var jeep = data[0]['identifier'];
   	                jeep = jeep.match(/^\S[^,]+/ig);
                    if (debug === true) { console.log(jeep) }
                    $j('#oaDispo').html('<a class="enabled" href="' + jeep + '"><span class="bounce-label-true"></span>Article en libre accès</a>');
                 	$j('#orderDispo').html('<a class="disabled" href="#"><span class="bounce-label-false"></span>Commander l\'article</a>');
                }
                else {
                 	$j('#oaDispo').html('<a class="disabled" href="#"><span class="bounce-label-false"></span>Article en libre accès</a>');
                }
            }
        });
//		if (debug === true) { console.log(query) };
		if (debug === true) { console.log(url) }
    }

});

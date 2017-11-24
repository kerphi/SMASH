/*
 *  Script modifié ne pas utiliser, se reporter au script original
 */

/*
 * 	360Link Reset > 360link-reset.js
 * 	Script for radically improving the Serials Solutions 360Link Link Resolver
 *
 *	For more information, see http://github.com/gvsulib/360Link-Reset
 *
 *	Author: Matthew Reidsma, reidsmam@gvsu.edu, @mreidsma
 *	Version 3.0
 */

window.$j = jQuery.noConflict(); // Simplify the noConflict call since 360Link loads Prototype

$j(document).ready(function() { // Wait until the original page loads

    // ************************************************************************************
    // Define your institution's local variables here
    // ************************************************************************************

    // Put the base URL for your catalog here, set for a title search. (Syntax set for Sierra -
    // Include the ? )
    var opacUrl = 'http://catalogue.univ-amu.fr/cgi-bin/koha/opac-search.pl?idx=ti&q=';
    var catalog_detail = 'http://catalogue.univ-amu.fr/cgi-bin/koha/opac-detail.pl?biblionumber='

    // The short name of your library or school you want to use in dialogs
    var libraryName = 'AMU';

    // Change this to read whatever 360Link says when your print holdings show up
    var printLabel = 'Print Journal at AMU Libraries';

    // Do you want to show a tooltip pointing folks to Document Delivery or ILL if they click
    // on more than 1 full text link? (Usually means broken links)
    // true = yes, false = no
    var docDelTooltip = true;

    // Temporary patch to make Illiad requests work - this is custom to the GVSU install
    var illiadLink = $j("table.CandyWrapper:last a.AnchorButton:contains('Document Delivery')").attr("href");



    // ************************************************************************************
    // DON'T EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU ARE DOING!
    // ************************************************************************************

    // Define common variables
    var problemUrl = encodeURIComponent(document.URL),
        authorFirst = $j(".given-name").text().trim(),
        authorLast = $j(".family-name").text().trim(),
        results = "",
        articleLinkdata = new Array(),
        journalLinkdata = new Array(),
        BookLinkdata = new Array(),
        dateRangedata = new Array(),
        DatabaseNamedata = new Array(),
        DatabaseLinkdata = new Array(),
        clicks = 0,
        refinerlink = $j("#RefinerLink0").find("a").attr("href"),
        hasPrint = false,
        newHref, i = 0,
        searchLabel = '<i class="material-icons">search</i> Rechercher ce document en version imprimée  dans les bibliothèques AMU',
        query = document.location.search,
        authorName = authorLast + ', ' + authorFirst,
        formatType, itemType, journalDOI = '',
        patentNumber = '',
        chaptitle = '',
        gaPebFormat;


    // Let's first record what type of item this is. Useful for knowing how many books folks are seeing here.

    // First, let's standardize the format types
    if (format.indexOf('Format') > 0) {
        formatType = format.split('Format');
        itemType = formatType[0];
    } else {
        itemType = format;
    }
    gaPebFormat = itemType.toLowerCase();
    console.log('itemType : ' + gaPebFormat);


    // ACTIVATE MAGIC FAIRY DUST

    // Make site responsive
    $j("head").append('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');

    // Remove existing styles
    $j("head").find("link").remove();
    $j("body").find("p").remove();

    // Load custom local stylesheets
    $j("head").append("<link rel=\"shortcut icon\" type=\"text/css\" href=\"https://assets-brew.appspot.com/static/favicon.ico\" />"); // Load favicon
    $j("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"https://fonts.googleapis.com/icon?family=Material+Icons\" />"); // Load material icon webfont
    $j("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"https://cdnjs.cloudflare.com/ajax/libs/pure/0.6.0/pure-min.css\" />"); // Load stylesheet from library website
    $j("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"https://assets-brew.appspot.com/static/resolver.min.css\" />"); // Load stylesheet from library website

    // Function to grab items from the URL

    function getQueryVariable(v) {
        var sidquery = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (decodeURIComponent(pair[0]) == v) {
                return decodeURIComponent(pair[1]);
                console.log(pair[1]);
            }
        }
        console.log('Query variable %s not found', v);
    }


    // Set variables from citation
    if (format === "Journal" || format === "JournalFormat") { // Journals
        var title = $j("#CitationJournalTitleValue").text().trim(),
            article = $j("#CitationJournalArticleValue").text().trim() + '.',
            articleC = $j("#CitationJournalArticleValue").text().trim(),
            vol = ' (' + $j("#CitationJournalVolumeValue").text().trim() + ')',
            issue = $j("#CitationJournalIssueValue").text().trim() + '.',
            date = '&nbsp;(' + $j("#CitationJournalDateValue").text().trim() + ').',
            pages = ' p.' + $j("#CitationJournalPageValue").text().trim() + '.',
            standardno = $j("#CitationJournalIssnValue").text().trim(),
            L = "cet article",
            A = "3 à 5 jours",
            O = "article",
            titleEncode = encodeURI(title),
            resultsTable = $j("#JournalLinkTable"),
            journalDOI = $j("td#CitationJournalDOIValue").text().trim(),
            pebURL = 'http://bu.univ-amu.fr/pret-entre-bibliotheques?type=article&journalName=' + encodeURI(title) + '&journalDate=' + encodeURI(date) + '&journalVol=' + encodeURI(vol) + '&journalIssue=' + encodeURI(issue) + '&journalPages=' + encodeURI(pages) + '&journalissn=' + encodeURI(standardno) + '&authorName=' + authorName + '&articleName=' + encodeURI(article) + '&articleDOI=' + encodeURI(journalDOI);
        if (standardno !== 'undefined') {
            getSRU(standardno, 'issn')
        }
				if (journalDOI !== 'undefined') {
            getoaDOI(journalDOI)
        }
        if (article !== 'undefined') {
            getHAL(encodeURI(article), journalDOI)
        }
        if (article !== 'undefined') {
            getJEEP(journalDOI, encodeURI(article), encodeURI(authorName))
        }
        if (article !== 'undefined') {
            getCORE(journalDOI, encodeURI(article), encodeURI(authorName))
        }
        if (article !== 'undefined') {
            getISTEX(journalDOI, encodeURI(article), encodeURI(authorName))
        }
        if (article !== 'undefined') {
            getOSF(encodeURI(articleC))
        }
    }
    if (format === "BookFormat" || format === "Book") { // Books
        var title = $j("#CitationBookTitleValue").text().trim(),
						chaptitle = $j("#CitationBookChapterValue").text().trim(),
            date = '&nbsp;(' + $j("#CitationBookDateValue").text().trim() + ').',
            standardno = $j("td#CitationBookISBNValue").text().trim(),
            L = "ce livre",
            A = "1 à 2 semaines",
            O = "book",
            titleEncode = encodeURI(title),
            resultsTable = $j("#BookLinkTable"),
            vol = '',
            issue = '',
            pages = '',
            article = '',
            pebURL = 'http://bu.univ-amu.fr/pret-entre-bibliotheques?type=livre&bookTitle=' + encodeURI(title) + '&bookDate=' + encodeURI(date) + '&authorName=' + authorName + '&articleName=' + '&bookisbn=' + encodeURI(standardno);
        var searchisbn = standardno,
            comma = standardno.indexOf(',');
        searchisbn = searchisbn.substring(0, searchisbn != -1 ? comma : searchisbn.length);
        if (searchisbn !== 'undefined') {
            getSRU(searchisbn, 'isbn')
        }
    }
    if (format === "Dissertation" || format === "DissertationFormat") { // Dissertations
        var title = $j("#CitationDissertationTitleValue").text().trim(),
            date = '&nbsp;(' + $j("#CitationDissertationDateValue").text().trim() + ').',
            L = "cette thèse",
            A = "1 à 2 semaines",
            O = "dissertation",
            titleEncode = encodeURI(title),
            resultsTable = $j("#BookLinkTable"),
            vol = '',
            issue = '',
            pages = '',
            article = '',
            pebURL = 'http://bu.univ-amu.fr/pret-entre-bibliotheques?type=these&thesisTitle=' + encodeURI(title) + '&thesisDate=' + encodeURI(date) + '&authorName=' + authorName; // Encode the white space in the URL
        if (titleEncode !== 'undefined') {
            getHAL(titleEncode, journalDOI)
        }
        if (article !== 'undefined') {
            getJEEP("", titleEncode, encodeURI(authorName))
        }
    }
    if (format === "Patent" || format === "PatentFormat") { // Patents
        var title = $j("#CitationPatentTitleValue").text().trim(),
            date = '&nbsp;(' + $j("#CitationPatentInventorDateValue").text().trim() + ').',
            authorName = $j("td#CitationPatentInventorValue").text().trim(),
            L = "ce brevet",
            A = "1 à 2 semaines (sous réserve)",
            O = "patent",
            titleEncode = encodeURI(title),
            resultsTable = $j("#BookLinkTable"),
            vol = '',
            issue = '',
            pages = '',
            article = '',
            patentNumber = $j("#CitationPatentNumberLabel").next().text().trim().substr(0, $j("#CitationPatentNumberLabel").next().text().trim().indexOf(' '));
    }
    if (format === "UnknownFormat" || format === "Unknown") { // Unknown Format
        var title = $j("#CitationUnknownPublicationValue").text().trim(),
            date = '&nbsp;(' + $j("#CitationUnknownDateValue").text().trim() + ').',
            standardno = $j("#CitationBookISBNValue").text().trim(),
            L = "ce document",
            A = "1 à 2 semaines (sous réserve)",
            O = "item",
            titleEncode = encodeURI(title),
            date = '',
            resultsTable = $j("#BookLinkTable"),
            vol = '',
            issue = '',
            pages = '',
            article = '';
    }

		// COinS

    // Build OpenURL for document delivery
    //var OpenUrl = 'sid=' + encodeURI(getQueryVariable('rfr_id')) + '&genre='+O+'&aulast='+encodeURI(authorLast)+'&aufirst='+encodeURI(authorFirst)+'&title='+encodeURI(title)+'&date='+encodeURI(	$j("#CitationJournalDateValue").text().trim());
    //if(format === "Journal" || format === "JournalFormat") {
    //	OpenUrl += '&issn='+standardno+'&atitle='+encodeURI($j("#CitationJournalArticleValue").text().trim())+'&volume='+$j("#CitationJournalVolumeValue").text().trim()+'&part=&issue='+$j("#CitationJournalIssueValue").text().trim();
    //} else {
    //	OpenUrl += '&isbn='+standardno+''
    //}
    //OpenUrl += '&spage='+pages.substr(3).replace(".","")+'&epage=';

    var newPage = document.createElement('div');
    newPage.id = 'layout';

    var newPageMain = document.createElement('div');
    newPageMain.className = 'main';
    newPage.appendChild(newPageMain);

    var citationDiv = document.createElement('div');
    citationDiv.id = 'citation';
    citationDiv.innerHTML = '<span id="citation-author">' + authorName + '.</span><span id="citation-date">' + date + '</span><span id="citation-article">&nbsp;' + article + '</span> <span id="citation-title">' + title + chaptitle + '.</span>' + vol + issue + pages + '&nbsp;<a href="https://dx-doi-org.lama.univ-amu.fr/' + journalDOI + '" onClick="ga(\'send\', \'event\', \'openurl\', \'doi\');" target="_blank">' + journalDOI + '</a>' + '<a href="https://worldwide.espacenet.com/searchResults?submitted=true&DB=EPODOC&ST=advanced&PN=' + patentNumber + '" onClick="ga(\'send\', \'event\', \'openurl\', \'patentnumber\');" target="_blank">' + patentNumber + '</a><a href="' + refinerlink + '" onClick="ga(\'send\', \'event\', \'openurl\', \'refiner\');"> <i class="material-icons">mode_edit</i></a><div data-badge-type="donut" data-doi="' + journalDOI + '" data-hide-no-mentions="false" data-link-target=\'_blank\' class="altmetric-embed result-content-altmetric"></div>';

    // Build list element for searching catalog or Google Patents
    var listGet = document.createElement('li'),
        itemType = O;
    listGet.id = 'next-step-external';
    var listOpac = document.createElement('li'),
        itemType = O;
    listOpac.id = 'next-step-opac';
    if (format === "Journal" || format === "JournalFormat") {
        itemType = 'Revue';
    }
    if (format === "BookFormat" || format === "Book") {
        itemType = 'Livre';
    }
    if (format === "Patent" || format === "PatentFormat" || format === "UnknownFormat" || format === "Unknown") {
        listOpac.innerHTML = "";
        listGet.innerHTML = "";
    } else {
        listOpac.innerHTML = '<a href="' + opacUrl + titleEncode + '" onClick="ga(\'send\', \'event\', \'print\', \'search_catalog\');" target="_blank">' + searchLabel + '</a>';
        listGet.innerHTML = "Sources complémentaires : <span id=\"dispooaDOI\"><a class=\"pure-button button-small pure-button-disabled\" href=\"#\">oaDOI</a></span> <span id=\"dispoHAL\"><a class=\"pure-button button-small pure-button-disabled\" href=\"#\">HAL</a></span> <span id=\"dispoBASE\"><a class=\"pure-button button-small pure-button-disabled\" href=\"#\">BASE</a></span> <span id=\"dispoCORE\"><a class=\"pure-button button-small pure-button-disabled\" href=\"#\">CORE</a></span> <span id=\"dispoISTEX\"><a class=\"pure-button button-small pure-button-disabled\" href=\"#\">ISTEX</a></span> <span id=\"dispoOSF\"><a class=\"pure-button button-small pure-button-disabled\" href=\"#\">OSF</a></span>";
    }

    // Build the next steps list
    var nextStepsList = document.createElement('div');
    var nextStepsUl = document.createElement('ul');
    nextStepsList.id = 'next-step';
    nextStepsUl.appendChild(listGet);
    nextStepsUl.appendChild(listOpac);
    //if(typeof listConsortium !== 'undefined') {
    //	nextStepsUl.appendChild(listConsortium);
    //}
    // Get data on all items in results list
    $j(resultsTable).find("tr").each(function(index) { // Grab values from the results table
        if (index !== 0) {
            if (format === "Journal" || format === "JournalFormat") {
                // Get the article link, if available
                articleLinkdata[i] = $j(this).find("#ArticleCL").find("a").attr("href");
                journalLinkdata[i] = $j(this).find("#JournalCL").find("a").attr("href");
            } else { // Not a journal article
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

    if (results > 0) { // There are results

        if (DatabaseNamedata[0] === printLabel) {
            hasPrint = true;
        }

        // Develop link for top result
        if ((typeof articleLinkdata[0] === 'undefined') && (typeof BookLinkdata[0] === 'undefined')) { // Journal level link only
            buttonText = 'Parcourir la revue';
            buttonLink = journalLinkdata[0];
        } else {
            buttonText = 'Texte intégral';
            if (typeof articleLinkdata[0] === 'undefined') { // Book
                buttonLink = BookLinkdata[0];
            } else {
                buttonLink = articleLinkdata[0];
            }
        }

        // Create the results DOM object
        var resultsDiv = document.createElement('div');
        resultsDiv.id = 'search-results';

        var topResult = document.createElement('li'),
            topResultdiv = document.createElement('ul'),
            topResultMore = document.createElement('div'),
            topResultTrigger = document.createElement('span');
        topResultdiv.id = 'top-result';
        topResult.innerHTML = '<a href="' + buttonLink + '" onClick="ga(\'send\', \'event\', \'openurl\', \'primary\');" class="pure-button pure-button-primary" target="_blank">' + buttonText + '</a> dans <a href="' + DatabaseLinkdata[0] + '" onClick="ga(\'send\', \'event\', \'openurl\', \'database\');" class="SS_DatabaseHyperLink" target="_blank">' + DatabaseNamedata[0].trim() + '</a>';
        if (format === "Journal" || format === "JournalFormat") {
            topResultTrigger.className = 'holding-details';
            topResultTrigger.innerHTML = '<i class="material-icons">expand_more</i>';
            topResult.appendChild(topResultTrigger);
            topResultMore.className = 'tooltip';
            topResultMore.innerHTML = 'Période couverte : ' + dateRangedata[0] + ' <a href="' + journalLinkdata[0] + '" onClick="ga(\'send\', \'event\', \'openurl\', \'journal\');" class="journal-button" target="_blank">Parcourir la revue</a>';
            topResult.appendChild(topResultMore);
        }
        topResultdiv.appendChild(topResult);
        resultsDiv.appendChild(topResultdiv);


        if (i > 1) { // There are additional links
            var extraResults = i - 1;
            if (extraResults === 1) { // Only 1 additional result
                var showResultsLabel = "voir 1 résultat supplémentaire";
            } else { // More than one result
                var showResultsLabel = "voir " + extraResults + " résultats supplémentaires";
            }

            var additionalResultsTrigger = document.createElement('div');
            additionalResultsTrigger.className = 'event-head';
            additionalResultsTrigger.innerHTML = showResultsLabel;

            // Create variables for additional results
            var additionalResultsdiv = document.createElement('div'),
                onlineResultsdiv = document.createElement('ul'),
                printResultsdiv = document.createElement('ul'),
                newResult, newResultLink, newResultLabel, newResultHoldings, printHeading, onlineHeading;

            for (var x = 1; x < results; x++) {
                console.log(DatabaseNamedata[x].trim());
                if (DatabaseNamedata[x].trim() === printLabel) { // Item is in print // utilisation du SRU
                    printHeading = document.createElement('h4');
                    printHeading.innerHTML = 'En rayon';
                    hasPrint = true; // Toggle this setting to true
                    newResult = document.createElement('li');
                    newResult.innerHTML = '<a href="' + journalLinkdata[x] + '" onClick="ga(\'send\', \'event\', \'openurl\', \'journal_print\');" target="blank">Available in Print</a> at ' + libraryName;
                    printResultsdiv.appendChild(newResult);
                } else { // Item is online
                    onlineHeading = document.createElement('h4');
                    // onlineHeading.innerHTML = 'En ligne';
                    newResult = document.createElement('li');
                    if (typeof articleLinkdata[x] === 'undefined') {
                        newResultLink = journalLinkdata[x];
                        newResultLabel = 'Parcourir la revue';
                    } else {
                        newResultLink = articleLinkdata[x];
                        newResultLabel = 'Texte intégral';
                    }
                    newResult.innerHTML = '<a href="' + newResultLink + '" onClick="ga(\'send\', \'event\', \'openurl\', \'secondary\');" class="pure-button pure-button-primary" target="_blank">' + newResultLabel + '</a> dans <a href="' + DatabaseLinkdata[x] + '" onClick="ga(\'send\', \'event\', \'openurl\', \'database\');" class="SS_DatabaseHyperLink" target="_blank">' + DatabaseNamedata[x] + '</a> <span class="holding-details"><i class="material-icons">expand_more</i></span>';
                    newResultHoldings = document.createElement('div');
                    newResultHoldings.className = 'tooltip';
                    newResultHoldings.innerHTML = 'Période couverte : ' + dateRangedata[x] + ' <a href="' + journalLinkdata[x] + '" onClick="ga(\'send\', \'event\', \'openurl\', \'journal\');" class="journal-button" target="_blank">Parcourir la revue</a>';
                    newResult.appendChild(newResultHoldings);
                    onlineResultsdiv.appendChild(newResult);
                } // End item online loop
            } // End for loop

            var additionalResultsDiv = document.createElement('div');
            additionalResultsDiv.className = 'event-body';

            if (typeof onlineHeading !== 'undefined') {
                additionalResultsDiv.appendChild(onlineHeading);
                additionalResultsDiv.appendChild(onlineResultsdiv);
            }
            if (typeof printHeading !== 'undefined') {
                additionalResultsDiv.appendChild(printHeading);
                additionalResultsDiv.appendChild(printResultsdiv);
            }

            resultsDiv.appendChild(additionalResultsTrigger);
            resultsDiv.appendChild(additionalResultsDiv);

        } // End additional results loop

    } else { // No results

        // Create the results DOM object
        var resultsDiv = document.createElement('div'),
            noResultsLabel = 'Désolé, nous n\'avons pas trouvé de version de ce document accessible en ligne !',
            noResultsButton = '',
            noResultsButtonLabel = '',
            noResultsIll = document.createElement('div'),
            noResultsprc = document.createElement('div');
        resultsDiv.id = 'ContentNotAvailableTable';

        if (format === "Journal" || format === "JournalFormat") {
            noResultsLabel = 'Désolé, nous n\'avons pas trouvé de version de cet article accessible en ligne !';
            noResultsButtonLabel = 'Vérifiez si des liens de téléchargement ci-dessous sont actifs et/ou relancez une recherche dans <a href="https://scholar.google.fr/scholar?as_q=&hl=fr&inst=2952611022847718469&num=10&btnG=Search+Scholar&as_epq=' + article + '" onClick="ga(\'send\', \'event\', \'search\', \'google_scholar\');" target="_blank">Google Scholar</a>';
            noResultsButton = document.createElement('span');
            noResultsButton.innerHTML = noResultsButtonLabel;
        } else if (format === "BookFormat" || format === "Book") { // Requested item is not an article
            noResultsLabel = 'Désolé, nous n\'avons pas trouvé de version de ce livre accessible en ligne !';
            noResultsButtonLabel = 'Vérifiez si des liens de téléchargement ci-dessous sont actifs et/ou relancez une recherche dans <a href="https://books.google.fr/books?vid=ISBN' + searchisbn + '" onClick="ga(\'send\', \'event\', \'search\', \'google_books\');" target="_blank">Google Books</a> ou <a href="https://scholar.google.fr/scholar?as_q=&hl=fr&inst=2952611022847718469&num=10&btnG=Search+Scholar&as_epq=' + titleEncode + '" onClick="ga(\'send\', \'event\', \'search\', \'google_scholar\');" target="_blank">Google Scholar</a>';
            noResultsButton = document.createElement('span');
            noResultsButton.innerHTML = noResultsButtonLabel;
        } else if (format === "Dissertation" || format === "DissertationFormat") {
            noResultsLabel = 'Désolé, nous n\'avons pas trouvé de version de cette thèse accessible en ligne !';
            noResultsButtonLabel = 'Vérifiez si des liens de téléchargement ci-dessous sont actifs et/ou relancez une recherche dans <a href="http://search.ndltd.org/search.php?q=title%3A%22' + titleEncode + '%22" onClick="ga(\'send\', \'event\', \'search\', \'ndltd\');" target="_blank">NDLTD</a>';
            noResultsButton = document.createElement('span');
            noResultsButton.innerHTML = noResultsButtonLabel;
        } else if (format === "Patent" || format === "PatentFormat") {
            noResultsLabel = 'Désolé, nous n\'avons pas trouvé de version de ce brevet accessible en ligne !';
            noResultsButtonLabel = 'Relancez une recherche dans <a href="https://www.google.fr/?tbm=pts&gws_rd=cr,ssl#tbm=pts&q=' + titleEncode + '%22" onClick="ga(\'send\', \'event\', \'search\', \'google_patent\');" target="_blank">Google Patent Search</a>';
            noResultsButton = document.createElement('span');
            noResultsButton.innerHTML = noResultsButtonLabel;
        } else {}
        // Build no results message
        noResultsMessage = document.createElement('h4');
        noResultsMessage.innerHTML = noResultsLabel;
        resultsDiv.appendChild(noResultsMessage);

        resultsDiv.appendChild(noResultsButton);
        resultsDiv.appendChild(listGet);
        resultsDiv.appendChild(listOpac);

        // Make a container to hold the help options
        var noResultsHelp = document.createElement('div');
        noResultsHelp.className = 'line';

        // Build help options - first ILL/Document Delivery
        noResultsIll.className = "span2 unit left";
        var noResultsIllHeader = document.createElement('h4');
        noResultsIllHeader.innerHTML = 'Non disponible en ligne, ni en version imprimée dans les bibliothèques AMU ?';
        noResultsIll.appendChild(noResultsIllHeader);
        var noResultsIllText = document.createElement('span');
        noResultsIllText.style.fontSize = '1em';
        noResultsIllText.innerHTML = 'Nous vous mettons ' + L + ' à disposition en ' + A + '.'; // Uses terms from citation grabber
        noResultsIll.appendChild(noResultsIllText);
        var noResultsIllButton = document.createElement('ul');
        noResultsIllButton.innerHTML = '<a href="' + pebURL + '" onClick="ga(\'send\', \'event\', \'peb\', \'' + gaPebFormat + '\');" target="_blank"><i class="material-icons">shopping_cart</i> Commander ' + L + ' par le service du PEB</a>';
        noResultsIll.appendChild(noResultsIllButton);


        if (format === "Patent" || format === "PatentFormat" || format === "UnknownFormat" || format === "Unknown") {
            noResultsIll.innerHTML = "";
        }

        noResultsHelp.appendChild(noResultsIll);
        noResultsHelp.appendChild(noResultsprc);

        resultsDiv.appendChild(noResultsHelp);

    } // End no results


    // Serials Solutions does a strange thing when 2 citations conflict. They ask the user to choose between them.
    // This clunky fix tries to make it easier for the user to understand why they are being asked to choose
    // between two seemingly identical things.

    var idiotDiv = $j(".SS_HoldingText a").attr("href"); // This silly solution has appeared

    if (typeof(idiotDiv) !== 'undefined' && (format === "Journal" || format === "JournalFormat")) { // There is a choice between two different citations

        // Set the variables needed
        var whichCitationLink = new Array(),
            whichCitationJournal = new Array(),
            whichCitationIssn = new Array(),
            idiotResults, t = 0,
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
        var choiceHeading = document.createElement('h4');
        choiceHeading.innerHTML = 'Référence disponible dans les revues suivantes :';
        var choiceList = document.createElement('ul');
        choiceList.id = 'top-result';

        for (var j = 0; j < idiotResults - 1; j++) {
            newResultItem = document.createElement('li');
            newResultItem.innerHTML = '<a href="' + whichCitationLink[j] + '">' + whichCitationJournal[j] + ' ' + whichCitationIssn[j] + '</a>';
            choiceList.appendChild(newResultItem);
        }

        resultsDiv.appendChild(choiceHeading);
        resultsDiv.appendChild(choiceList);

    } // End of Silly Choice Function

    // Do the magic if this is a link resolver display page:
    // Rewrite Serials Solutions terrible page with a nice semantic, clean div full of easy-to-follow markup
    // So we need to add a div wrapper around the Serials Solutions content to add this HTML into

    var pairvalues = query.split("&");
    if (pairvalues[0] !== "?SS_Page=refiner") { // This is the citation form. Don't rewrite the page.

        // Build the next steps list
        // nextStepsUl.appendChild(listIll);
        // nextStepsUl.appendChild(listProblem);
        if (docDelTooltip === true) { // Show Doc Delivery Tooltip
            // Let's show a tooltip highlighting Document Delivery when the user has tried a few sources.
            var tooltip = document.createElement('li');
            tooltip.id = 'doc-del-tooltip';
            tooltip.innerHTML = 'Vous rencontrez une erreur ? Utilisez la bulle d\'aide en bas de page !';
            nextStepsUl.appendChild(tooltip);
        }
        nextStepsList.appendChild(nextStepsUl);

        newPageMain.appendChild(citationDiv);
        newPageMain.appendChild(resultsDiv);
        newPageMain.appendChild(nextStepsList);

        // Add a clear div to reset all floats at the bottom before the footer starts
        newPageClear = document.createElement('div');
        newPageClear.style.clear = 'both';
        newPage.appendChild(newPageClear);

        // Find the
        var container = document.getElementById('CitationResults');
        container.parentNode.replaceChild(newPage, container);

        //check and see if there are print holdings for journal. If so, hide the search the catalog link
        if (hasPrint === true && (format === "Journal" || format === "JournalFormat")) {
            document.getElementById('next-step-opac').style.display = 'none';
        }

        if ($j('.holding-details').length > 0) {
            // There are results, so holding information should be hidden until asked for
            $j('.tooltip').hide();

            // Show or hide tooltip if holding details is clicked on
            $j('span.holding-details').click(function() {
                $j(this).next('.tooltip').toggle();
                var currentLabel = $j(this).html();
                if (currentLabel === "<i class=\"material-icons\">expand_more</i>") {
                    $j(this).html('<i class="material-icons">expand_less</i>');
                } else {
                    $j(this).html('<i class="material-icons">expand_more</i>');
                }
            });
            // Pointer when hover holding details
            $j('.holding-details').hover(function() {
                $j(this).stop().css({
                    "cursor": "pointer"
                });
            });
        }

        // Hide additional results until toggled
        $j(".event-body").hide();
        $j(".event-head").click(function() {
            jQuery(".event-body").slideToggle(400);
            var current_text = jQuery(".event-head").text();
            if (current_text === "masquer les résultats supplémentaires") {
                jQuery(".event-head").text('voir plus de résultats');
            } else {
                jQuery(".event-head").text('masquer les résultats supplémentaires');
            }
        });
        // Pointer when hover additional results
        $j(".event-head").hover(function() {
            $j(this).stop().css({
                "cursor": "pointer"
            });
        });

        if (docDelTooltip === true) {
            // Hide the tooltip for now
            var docDelObject = document.getElementById('doc-del-tooltip');
            docDelObject.style.display = 'none';

            // User has hidden the document delivery tooltip
            $j("#cancel-doc-del").click(function() {
                docDelObject.style.display = 'none';
                clicks = 0;
            });
            console.log(clicks);

            // Let's count clicks to see when to show the document delivery tooltip
            $j("#search-results").find("li").find("a").click(function() {
                clicks++;
                console.log(clicks);
                if (clicks > 1) {
                    docDelObject.style.display = 'block';
                }
            });
        } // End doc del tooltip behavior code

    } // End page rewrite

    function getSRU(id, type, dispo) { // Print
        id = id.replace(/ /g, '');
        id = id.split(',');
        var query = "";
        for (var i = 0; i < id.length; i++) {
            if (i === 0) {
                query += 'index=' + type + '&q=' + id[i];
            } else {
                query += '&q=' + id[i];
            }
        }
        var url = "https://smash-sru.appspot.com/?" + query;
        console.log(url)
        $j.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                if (data !== null) {
                    var biblionumber = data[0]['biblionumber'];
                    $j('#next-step-opac').html('<a target="_blank" href="' + catalog_detail + biblionumber + '" onClick="ga(\'send\', \'event\', \'print\', \'sru_catalog\');"><i class="material-icons">local_library</i> ' + itemType + ' disponible en version imprimée dans les bibliothèques AMU</a>');
                }
            }
        });
    }

		function getoaDOI(id) { // oaDOI
        var url = 'https://api.oadoi.org/' + id ;
        console.log(url)
        $j.ajax({
            url: url,
            dataType: 'json',
            success: function(data) {
                if (data['results'][0]['free_fulltext_url'] !== null) {
                    var urloaDOI = data['results'][0]['free_fulltext_url'];
                    $j('#dispooaDOI').html('<a class=\"pure-button button-small button-success\" target=\"_blank\" href=\"' + urloaDOI + '\" onClick="ga(\'send\', \'event\', \'api\', \'oadoi\');">oaDOI</a>');
                }
            }
        });
    }

    function getHAL(title, id) { // HAL
        if (id !== "") {
            var url = 'https://api.archives-ouvertes.fr/search/?&q=doiId_s:%22' + id + '%22&q=title_t:%22' + title + '%22~&wt=json';
        } else if (title.split("%20").length > 2) {
            var url = 'https://api.archives-ouvertes.fr/search/?&q=title_t:%22' + title + '%22~&wt=json';
        }
        console.log(url)
        console.log(title)
        console.log(title.split("%20").length)
        $j.ajax({
            url: url,
            dataType: 'json',
            success: function(data) {
                if (data.response['numFound'] !== 0) {
                    var urlHAL = data.response['docs'][0]['uri_s'];
                    $j('#dispoHAL').html('<a class=\"pure-button button-small button-success\" target=\"_blank\" href=\"' + urlHAL + '\" onClick="ga(\'send\', \'event\', \'api\', \'hal\');">HAL</a>');
                }
            }
        });
    }

    function getJEEP(id, title, author) { // BASE
        if (id !== "" && author !== "") {
            var url = 'http://jeepway.lib.kyushu-u.ac.jp/jeepway/api/index?target=[%22base%22]&response=0&maxno=1&title=' + title + '&rft.au=' + author + '&rft_id=info:doi=' + id;
        } else if (author !== "" && title.split("%20").length > 2) {
            var url = 'http://jeepway.lib.kyushu-u.ac.jp/jeepway/api/index?target=[%22base%22]&response=0&maxno=1&title=' + title + '&rft.au=' + author;
        } else if (title.split("%20").length > 2) {
            var url = 'http://jeepway.lib.kyushu-u.ac.jp/jeepway/api/index?target=[%22base%22]&response=0&maxno=1&title=' + title;
        }
        console.log(url)
        $j.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                if (data[0] !== undefined) {
                    var urlJEEP = data[0]['identifier'];
                    urlJEEP = urlJEEP.match(/^\S[^,]+/ig);
                    $j('#dispoBASE').html('<a class=\"pure-button button-small button-success\" target=\"_blank\" href=\"' + urlJEEP + '\" onClick="ga(\'send\', \'event\', \'api\', \'base\');">BASE</a>');
                }
            }
        });
    }

    function getCORE(id, title, author) { // CORE
        if (id !== "" && author !== "") {
            var url = encodeURI('https://smash-core2.appspot.com/?url=https://core.ac.uk/api-v2/search/doi:"' + id + '" OR (title:("' + title + '") AND authors:(' + author + '))?page=1&pageSize=10&metadata=true');
        } else if (author !== "" && title.split("%20").length > 2) {
            var url = encodeURI('https://smash-core2.appspot.com/?url=https://core.ac.uk/api-v2/search/title:("' + title + '") AND authors:(' + author + ')?page=1&pageSize=10&metadata=true');
        } else if (title.split("%20").length > 2) {
            var url = encodeURI('https://smash-core2.appspot.com/?url=https://core.ac.uk/api-v2/search/title:("' + title + '")?page=1&pageSize=10&metadata=true');
        }
        console.log(url)
        $j.ajax({
            url: url,
            dataType: 'json',
            success: function(data) {
                if (data.contents['status'] === "OK") {
                    var urlCORE = data.contents.data[0]['id'];
                    urlCORE = urlCORE.match(/^\S[^,]+/ig);
                    $j('#dispoCORE').html('<a class=\"pure-button button-small button-success\" target=\"_blank\" href=\"https:\/\/core.ac.uk:443\/api-v2\/articles\/get\/' + urlCORE + '\/download\/pdf?apiKey=KCVTj1gVVD51W8Ii65mDcq1UGGkncsPE\" onClick="ga(\'send\', \'event\', \'api\', \'core\');">CORE</a>');
                }
            }
        });
    }

    function getISTEX(id, title, author) { // ISTEX
        if (id !== "" && author !== "") {
            var url = 'https://api.istex.fr/document/?q=doi:%22' + id + '%22&output=id&sid=smash';
        } else if (author !== "" && title.split("%20").length > 2) {
            var url = 'https://api.istex.fr/document/?q=title:%22' + title + '%22%20AND%20author.name:%22' + author + '%22&output=id&sid=smash';
        } else if (title.split("%20").length > 2) {
            var url = 'https://api.istex.fr/document/?q=title:%22' + title + '%22&output=id&sid=smash';
        }
        console.log(url)
        $j.ajax({
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                if (data.hits[0] !== undefined) {
                    var urlISTEX = data.hits[0]['id'];
                    urlISTEX = urlISTEX.match(/^\S[^,]+/ig);
                    $j('#dispoISTEX').html('<a class=\"pure-button button-small button-success\" target=\"_blank\" href=\"http:\/\/lama.univ-amu.fr/login?url=https:\/\/api.istex.fr\/document\/' + urlISTEX + '\/fulltext\/pdf?sid=smash\" onClick="ga(\'send\', \'event\', \'api\', \'istex\');">ISTEX</a>');
                }
            }
        });
    }

    function getOSF(title) { // OSF
        if (title.split("%20").length > 2) {
            var url = 'https://smash-proxy.herokuapp.com/https://api.osf.io/v2/nodes/?filter%5Btitle%5D=' + title + '&format=json';
        }
        console.log(url)
        $j.ajax({
            url: url,
            dataType: 'json',
            success: function(data) {
                if (data.data[0]['id'] !== undefined) {
                    var urlOSF = data.data[0]['id'];
                    $j('#dispoOSF').html('<a class=\"pure-button button-small button-success\" target=\"_blank\" href=\"https:\/\/osf.io\/' + urlOSF + '\/" onClick="ga(\'send\', \'event\', \'api\', \'osf\');">OSF</a>');
                }
            }
        });
    }

});

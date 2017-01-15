#WhatPage

WhatPage is a small app that allows the user to find the ranking of a website.

##Google Custom Search API Integration

This app uses the Google Custom Search API, which is generally used to search a specific website.  The Google Web Search API would have been more suited, but has been decommissioned by Google since 2014.  As a result, I had to tweek their new Google Custom Search to do the job.  There is an option to "search my site and also the web", then make the list of sites empty.  Not an elegant solution, but it works.  Note this cannot be done with a Premium Google Developer account, meaning we are limited to 100 calls per day with no hope of upgrade.

The Google Custom Search API takes search parameters and a starting index, and returns 10 results starting with the provided index.  Only 10 results are given with a single call, and only the top 100 results are accessible with the API.

##Design

When you hit the "Which result is it?" button, the app makes a call to the Google Custom Search API for the first 10 results of the search parameters, and checks each url for a match to the keyword.  If no match is found, the user is told that the keyword is not in the first 10 results, and is asked if they would like to keep searching.  If they would, the app makes a call for the next 10 results and so on.  I made these further checks manual because it makes a call each time, and we are limited to 100/day.

##Moving Forward

I have already seen another version of this sort of application.  My plans are to use this functionality to allow the user to set a schedule for these checks to occur periodically, and store the results in a database.  This will allow a user to see a schedule of their search engine ranking while applying SEO or similar, to see the effects.

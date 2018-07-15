frontend-nanodegree-arcade-game
===============================

## Table of Contents

* [Instructions for the users](#instructions-for-the-users)
* [Loading the app](#loading-the-app)
* [Technical Instructions for Developers](#technical-instructions-for-developers)
* [Credits](#credits)

## Instructions for the users

Oslo Best Summer Beaches

The goal of this app is to track your book reading. You have 2 screens.  
The main one ('/') is the screen listing your saved books. You can re-arrange them by changing their category (Currently Reading, Read, or Want to read). You can also "delete" them from your collection by modifying their category to 'none'.  
The second screen, that you access clicking on the button bottom right of the home screen, is the Search Page from which you can add books to your collection. Type some keywords or title, or even authors in the search fields. The books corresponding to your query will appear. You can add them to your collection by changing their category and adding them to the appropriate one. If they are already present in your collection then their current category will be selected.  
At this point of the development only certain keywords will provide an answer. If your query does not match anything, a list of search terms will be displayed on your screen. 

## Loading the app

This app can be loaded by starting the server
+ Open a terminal in the root folder
+ type 'npm install' and then 'npm start'
+ go to 'localhost:3000' in your browser

## Technical Instructions for Developers

The matser branch is production ready, but the features are still kept very simple.
Next features to be added include:
+ New filters such as topic category (e.g. 'Education', or 'Business & Economics'), maturity rating, ...
+ Some more infos could be displayed, for example, with a modal window opening when you click a "detail" button on a corner of the book cover, or below it. This modal could display informations such as page count, a description, a bigger thumbnail, language, the date of publishing, publisher, etc.
+ The theme, the style, could benefit a personalization


## Credits

This game was designed by Udacity, and coded by Raphaël Ferrand on a starter base, for the Google Scholarship - Front End Web Development Nanodegree of Udacity.  
Google fonts for the fonts and Subtle patterns for some texture.

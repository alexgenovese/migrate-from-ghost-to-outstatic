const fs = require('fs')
var TurndownService = require('turndown')
const turndownService = new TurndownService()
const backup_path = 'backup.json'
const converter = require('html-to-markdown');


fs.readFile(backup_path, 'utf8', (err, file) => {

// check for any errors
  if (err) {
    console.error('Error while reading the file:', err)
  return
  }
  try {
    const data = JSON.parse(file);
    const dir = "./articles";
    const base_url = "https://alexgenovese.it"

    // create folder 
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    // output the parsed data
    data.db[0].data.posts.forEach(element => {
        console.log(element)
        
        let body = turndownService.turndown(element.html)
        body = element.html.replaceAll("__GHOST_URL__", base_url);
        let image = element.feature_image?.replaceAll("__GHOST_URL__", base_url);
        
        let content=`---
title: '${element.title}'
status: '${element.status}'
description: '${element.custom_excerpt}'
coverImage: '${image}'
tags: [{"label":"marketing","value":"marketing"}]
author:
    name: 'Alex Genovese'
slug: '${element.slug}'
publishedAt: '${element.published_at}'
---

${body}`;

        
        try {
            if (element.status == 'published') {
              fs.writeFileSync('./articles/'+element.slug+'.md', content, { flag: 'w+' });
            }
            
            // file written successfully
        } catch (err) {
            console.error(err);
        }

    });

    
  } catch (err) {
    console.error('Error while parsing JSON data:', err)
  }
})
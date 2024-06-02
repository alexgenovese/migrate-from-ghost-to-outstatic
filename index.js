const fs = require('fs')
var converter = require('html-to-markdown'); // TODO - da cambiare non traduce bene 

const path = 'backup.json'

fs.readFile(path, 'utf8', (err, file) => {

// check for any errors
  if (err) {
    console.error('Error while reading the file:', err)
  return
  }
  try {
    const data = JSON.parse(file);
    const dir = "./articles";
    const base_url = "http://alexgenovese.it"

    // output the parsed data
    data.db[0].data.posts.forEach(element => {
        console.log(element)

        // TODO - preg replace GHOST_URL con il link al nuovo sito 

        let body = converter.convert(element.html)
        let content=`---
title: '${element.title}'
status: '${element.status}'
description: '${element.custom_excerpt}'
coverImage: '${element.feature_image}'
tags: [{"label":"marketing","value":"marketing"}]
author:
    name: 'Alex Genovese'
slug: '${element.slug}'
publishedAt: '${element.published_at}'
---

${body}`;

        // create folder 
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        try {
            fs.writeFileSync('./articles/'+element.slug+'.md', content, { flag: 'w+' });
            // file written successfully
        } catch (err) {
            console.error(err);
        }

    });

    
  } catch (err) {
    console.error('Error while parsing JSON data:', err)
  }
})
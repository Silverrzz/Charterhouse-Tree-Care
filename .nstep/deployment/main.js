const fs = require('fs');
const path = require('path');
const express = require('express');

const domain = '__DOMAIN__';
const port = __PORT__
const protocol = '__PROTOCOL__';

const app = express();

app.use(express.static(__dirname + '/public'));

{{ __PAGE_ROUTES__ }}

pages_json = JSON.parse(fs.readFileSync(path.join(__dirname, 'admin/pages.json'), 'utf8'));
found = false;

//if the user requests a page that is not in the pages.json file, redirect to the 404 page
app.get('*', (req, res) => {
    if (req.url.endsWith('.html')) {
        res.redirect("/")
    }
    if (req.url.endsWith('/')) {
        res.redirect(req.url.slice(0, -1))
    }
    for (let i = 0; i < pages_json["pages"].length; i++) {
        page = pages_json[pages_json["pages"][i]];
        page_routes = page.routes;

        if (!found) {
            for (let j = 0; j < page_routes.length; j++) {

                if (req.path == page_routes[j] && found == false) {
                    found = true;
                }
            }
        }
    }

    if (!found) {

        res.redirect(`/404?search=${req.path.slice(1)}`)

    }

});

app.listen(port, domain, () => {
    console.log(`Server running at ${protocol}://${domain}:${port}/`);
});
import json
import sys
import re

config_json = json.loads(open('.nstep/config.json', 'r').read())

destination = sys.argv[1]

protocol = str(config_json[destination]['protocol'])
domain = str(config_json[destination]['domain'])
port = str(config_json[destination]['port'])

#Open f"{destination}/main.js" and replace __HOST__ with host, __PORT__ with port and __PROTOCOL__ with protocol

main_js = open(f"{destination}/main.js", 'r').read()
main_js = re.sub(r'__DOMAIN__', domain, main_js)
main_js = re.sub(r'__PORT__', port, main_js)
main_js = re.sub(r'__PROTOCOL__', protocol, main_js)

#Open destination/admin/pages.js and create all the app.get() routes
#pages.json should be loaded with the pages.json["pages"]
#each page has an id (correlates to the name of the html file), a slug (the url the page will be at), routes[] (the routes that will redirect to the slug)
#replace {{ __PAGE_ROUTES__ }} with the routes in main.js

pages_json = json.loads(open(f"{destination}/admin/pages.json", 'r').read())
routes = ""
for page_name in pages_json["pages"]:
    page = pages_json[page_name]
    if page["private"] == True:
        continue
    for route in page["routes"]:
        if route != page["slug"] and route != "/" + page["slug"]:
            routes += f"app.get('{route}', (req, res) => res.redirect('{page['slug']}'))\r"

    routes += f"app.get('{page['slug']}', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', '{page['id']}.html')))\r"

#loop through destination/public/assets and add all the assets to the routes

import os

for root, dirs, files in os.walk(f"{destination}/public/assets"):
    for file in files:
        if True in [True for ext in [".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".css", ".js"] if file.endswith(ext)]:
            routes += f"app.get('/assets/{file}', (req, res) => res.sendFile(path.join(__dirname, 'public', 'assets', '{file}')))\r"

main_js = re.sub(r'{{ __PAGE_ROUTES__ }}', routes, main_js)

open(f"{destination}/main.js", 'w').write(main_js)

# Path: .nstep\scripts\build_pages.py
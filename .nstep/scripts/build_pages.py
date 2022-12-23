import os
import sys
import json
import copy

source = sys.argv[1]
destination = sys.argv[2]

source_step = source.split('/')[0]
dest_step = destination.split('/')[0]

pages_json = json.loads(open(source, 'r').read())

template_dir = "SRC/admin/templates"
widgets_dir = "SRC/widgets"
content_dir = "SRC/pages"

pages = [page_name for page_name in pages_json]

pages_json["pages"] = pages

#writing pages.json to destination[0]/source[1:]

save_path = dest_step + "/" + ("/".join(source.split('/')[1:]))

open(save_path, 'w').write(json.dumps(pages_json, indent=4, sort_keys=False))

for page in pages:
    page = pages_json[page]
    page_id = page['id']
    page_name = page['name']
    page_template = page['template']
    page_stylesheet = page['stylesheet']

    page_template_path = template_dir + "/" + page_template + '.html'

    page_template_content = open(page_template_path, 'r').read()
    try:
        page_content = open(os.path.join(content_dir, page_id + '.html'), 'r').read()
    except:
        page_content = ""

    search_terms = json.loads(open(source_step + "/admin/search_terms.json", "r").read())

    for p in pages:
        pg = pages_json[p]

        if pg['name'] in search_terms:
            search_terms[pg['name']]['terms'].extend([route.replace("/", " ") for route in pg['routes']])

        else:
            pages_terms = [route.replace("/", " ") for route in pg['routes']]
            #keep only alphanumeric characters and spaces
            clean_name = ''.join(e for e in pg['name'] if e.isalnum() or e == " ")
            pages_terms.append(clean_name)
            term = {"name": pg['name'], "slug": pg['slug'], "terms": [term for term in pages_terms]}
            search_terms[pg['name']] = term

    term_string = ""

    for key, value in search_terms.items():

        term_string += value["name"] + ":" + value["slug"] + ":" + ";".join(value["terms"]) + ","

    search_terms = term_string[:-1]

    #template

    content = page_template_content.replace("{{ STYLESHEET }}", page_stylesheet).replace("{{ NAME }}", page_name).replace("{{ CONTENT }}", "\n" + page_content + "\n")

    #widgets

    #go through file line by line, widgets are on their own line.
    #they start with <widget name="*" and end with ></widget>

    widget_lines = []

    for line in content.splitlines():
        if line.startswith('<widget name="') and line.rstrip("\n").endswith(' ></widget>'):
            widget_line = line.rstrip("\n")
            widget_name = widget_line.split('"')[1]
            widget_path = widgets_dir + "/" + widget_name + '.html'
            widget_content = open(widget_path, 'r').read()

            #widget config is inside <config> </config> tags in the widget file
            #it contains a comma separated list of attributes for the widget

            widget_config = copy.deepcopy(widget_content)
            widget_config = widget_config.replace("\n", "")

            widget_config = widget_config.split('<config>')[1].split('</config>')[0]

            widget_attributes = widget_config.split(',')
            widget_attributes = [x.strip() for x in widget_attributes]

            #replace widget attributes in widget content
            #a widget attribute is inside the widget tag, like <widget name="widget_name" attribute="value" />

            widget_values = {}

            for widget_attribute in widget_attributes:
                try:
                    widget_values[widget_attribute] = widget_line.split(" " + widget_attribute + '="')[1].split('"')[0]
                except:
                    widget_values[widget_attribute] = ''

            for widget_attribute in widget_values:

                widget_content = widget_content.replace('{{ ' + widget_attribute.upper() + ' }}', widget_values[widget_attribute])

            #get rid of <config> </config> tags
            #loop through lines, once we find <config> we start deleting lines until we find </config>

            widget_content_lines = widget_content.splitlines()

            config_start = 0
            config_end = 0

            for i in range(len(widget_content_lines)):
                if widget_content_lines[i].startswith('<config>'):
                    config_start = i
                if widget_content_lines[i].startswith('</config>'):
                    config_end = i

            for i in range(config_start, config_end + 1):
                widget_content_lines[i] = ''

            widget_content = '\n'.join(widget_content_lines)

            content = content.replace(widget_line, widget_content + "\n")

    config_json = json.loads(open(".nstep/config.json", "r").read())

    content = content.replace("!HOST!", config_json[dest_step]['host']).replace("{{ __SEARCH_TERMS__ }}", search_terms)

    page_destination = os.path.join(destination, page_id + '.html')
    open(page_destination, 'w').write(content)
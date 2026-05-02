#!/usr/bin/env python3
"""Build v4 deployable single-file HTML from all the modules."""

import os

base = os.path.dirname(os.path.abspath(__file__))

# Read all parts
with open(f'{base}/index_template.html') as f:
    template = f.read()

with open(f'{base}/_props.js') as f:
    props = f.read()

with open(f'{base}/_questions.js') as f:
    questions = f.read()

with open(f'{base}/_questions_extra.js') as f:
    questions_extra = f.read()

with open(f'{base}/_questions_extra2.js') as f:
    questions_extra2 = f.read()

with open(f'{base}/_characters.js') as f:
    characters = f.read()

with open(f'{base}/_modelhome.js') as f:
    modelhome = f.read()

with open(f'{base}/_damage.js') as f:
    damage = f.read()

with open(f'{base}/_catalogue.js') as f:
    catalogue = f.read()

with open(f'{base}/_logic.js') as f:
    logic = f.read()

with open(f'{base}/_hero_assets.js') as f:
    hero_assets = f.read()

with open(f'{base}/_layouts.js') as f:
    layouts = f.read()

with open(f'{base}/_furniture.js') as f:
    furniture = f.read()

with open(f'{base}/_pests.js') as f:
    pests = f.read()

with open(f'{base}/_layout_renderer.js') as f:
    layout_renderer = f.read()

with open(f'{base}/_editor.js') as f:
    editor = f.read()

# Assemble
data_block = props + '\n\n' + questions + '\n\n' + questions_extra + '\n\n' + questions_extra2

editor_block = (
    layouts + '\n\n' + furniture + '\n\n' + pests + '\n\n' +
    layout_renderer + '\n\n' + editor
)

result = template.replace('__DATA_GOES_HERE__', data_block)
result = result.replace('__CHARACTERS_GOES_HERE__', characters)
result = result.replace('__MODELHOME_GOES_HERE__', modelhome + '\n\n' + damage + '\n\n' + catalogue + '\n\n' + hero_assets + '\n\n' + editor_block)
result = result.replace('__GAME_LOGIC_HERE__', logic)

# Write final file
out_path = f'{base}/public/index.html'
with open(out_path, 'w') as f:
    f.write(result)

print(f"Built: {out_path}")
print(f"Size: {len(result)} bytes ({len(result)/1024:.1f} KB)")
print(f"Lines: {result.count(chr(10))}")  

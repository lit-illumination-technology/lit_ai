#!/usr/bin/python3
import json
import os
import lit

if __name__ == '__main__':
    if not os.path.exists('entities'):
        os.mkdir('entities')

    # colors
    colors = lit.get_colors()
    color_names = list(map(lambda x: {'value':x['name'],'synonyms':[x['name']]}, colors))
    color_file = open('entities/colors.json', 'w')
    color_file.write(json.dumps({'name': 'color', 'id': 'color', 'entries': color_names}))

    # effects
    effects = lit.get_effects()
    effect_names = list(map(lambda x: {'value':x['name'],'synonyms':[x['name']]}, effects))
    effects_file = open('entities/effects.json', 'w')
    effects_file.write(json.dumps({'name': 'effect', 'id': 'effect', 'entries': effect_names}))

    # speeds
    speeds = lit.get_speeds()
    speed_names = list(map(lambda k: {'value':k,'synonyms':[k]}, speeds.keys()))
    speeds_file = open('entities/speeds.json', 'w')
    speeds_file.write(json.dumps({'name': 'speed', 'id': 'speed', 'entries': speed_names}))

    # sections
    sections = lit.get_sections() + lit.get_zones()
    section_names = list(map(lambda x: {'value':x,'synonyms':[x]}, sections))
    sections_file = open('entities/ranges.json', 'w')
    sections_file.write(json.dumps({'name': 'range', 'id': 'range', 'entries': section_names}))

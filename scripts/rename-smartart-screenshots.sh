#!/bin/bash
# Rename SmartArt screenshots after manual export from PowerPoint
#
# Usage:
# 1. Open smartart.pptx in PowerPoint
# 2. File > Export > File Format: PNG, Save Every Slide
# 3. Save to assets/smartart-refs/ folder
# 4. Run this script: ./scripts/rename-smartart-screenshots.sh

cd "$(dirname "$0")/../assets/smartart-refs"

# Mapping: Slide number -> OOXML ID
declare -A SLIDE_TO_ID=(
    [1]="pyramid2"
    [2]="pyramid1"
    [3]="pyramid3"
    [4]="default"
    [5]="AlternatingHexagons"
    [6]="arrow2"
    [7]="DescendingProcess"
    [8]="matrix3"
    [9]="matrix1"
    [10]="matrix2"
    [11]="cycle4"
    [12]="AccentedPicture"
    [13]="CaptionedPictures"
    [14]="vList3"
    [15]="chevron1"
    [16]="cycle8"
    [17]="chart3"
    [18]="radial3"
)

# Look for exported files (PowerPoint exports as "Slide1.png", "Slide2.png", etc.)
for slide in {1..18}; do
    # Try different naming patterns
    for pattern in "Slide${slide}.png" "slide${slide}.png" "幻灯片${slide}.png" "smartart.${slide}.png"; do
        if [ -f "$pattern" ]; then
            id="${SLIDE_TO_ID[$slide]}"
            if [ -n "$id" ]; then
                mv "$pattern" "${id}.png"
                echo "Renamed $pattern -> ${id}.png"
            fi
            break
        fi
    done
done

echo ""
echo "Done! PNG files in assets/smartart-refs/:"
ls -la *.png 2>/dev/null || echo "No PNG files found"

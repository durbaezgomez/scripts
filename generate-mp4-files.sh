#!/bin/bash

# THIS SCRIPT ACCEPTS FILES IN MP3 AND JPG
# MP3 NAMED:  [bpm]bpm - title - [key] - [prod tag].mp3
# EXAMPLE:    90bpm - diamonds - Gmin - prod. @odys.wrld.mp3

# Directories
BEATS_DIR="./beats"
IMAGES_DIR="./images"
OUTPUT_DIR="./output"
MUSIC_FORMAT="mp3" # change music format here
IMG_FORMAT="jpg" # change image format here

# Ensure the output directory exists
mkdir -p "$OUTPUT_DIR"

# Get the list of files
beatsNumber=($(ls "$BEATS_DIR"/*."$MUSIC_FORMAT" | wc -l)) 
imagesNumber=($(ls "$IMAGES_DIR"/*."$IMG_FORMAT" | wc -l)) 

BEATS=()
IMAGES=()

for BEAT in "$BEATS_DIR"/*"$MUSIC_FORMAT"; do
  # Check if it is a file and add it to the array
  if [ -f "$BEAT" ]; then
    BEATS+=("$BEAT")
  fi
done

for IMG in "$IMAGES_DIR"/*"$IMG_FORMAT"; do
  # Check if it is a file and add it to the array
  if [ -f "$BEAT" ]; then
    IMAGES+=("$IMG")
  fi
done

# echo "${BEATS}"
# echo "${IMAGES}"

# Check if the number of beats and images match
if [ ${beatsNumber} -lt ${imagesNumber} ]; then
  echo "Error: Not enough images.\n
  beats: ${beatsNumber} images: ${imagesNumber}"
  exit 1
fi

# Generate videos and text files
for i in "${!BEATS[@]}"; do
  BEAT="${BEATS[$i]}"
  IMAGE="${IMAGES[$i]}"

  # Extract base filename without extension
  BEAT_BASENAME=$(basename "$BEAT" .mp3)

  # Extract components: Title, BPM, Key
  BPM=$(echo "$BEAT_BASENAME" | cut -d '-' -f 1 | tr -d '[:space:]')
  TITLE=$(echo "$BEAT_BASENAME" | cut -d '-' -f 2 | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  TITLEUPPERCASED="$(tr '[:lower:]' '[:upper:]' <<< ${TITLE:0:1})${TITLE:1}"
  KEY=$(echo "$BEAT_BASENAME" | cut -d '-' -f 3 | tr -d '[:space:]')

  # Output video and text filenames
  OUTPUT_VIDEO="$OUTPUT_DIR/[FREE] Type Beat \"${TITLEUPPERCASED}\".mp4"
  OUTPUT_TEXT="$OUTPUT_DIR/${TITLE}_${BPM}_${KEY}.txt"
  touch "${OUTPUT_TEXT}"

  # echo "${OUTPUT_VIDEO}"

  echo -e "PROCESSING: $BEAT, \nimage: $IMAGE, \nvideo: $OUTPUT_VIDEO, \ntxt: $OUTPUT_TEXT"

  # Generate the video
  ffmpeg -loop 1 -i "$IMAGE" -i "$BEAT" \
    -vf "scale=-2:1080, pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" \
    -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest "$OUTPUT_VIDEO" > /dev/null 2>&1

  # Write the extracted details to the text file

done

echo -e "\n\nCOMPLETE: All videos and text files have been generated in the $OUTPUT_DIR directory."
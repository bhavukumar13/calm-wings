#!/usr/bin/env python3
"""
Calm Wings — Spritesheet Generator
Extracts 16 frames from each of 4 video clips and composites them into an 8x8 spritesheet.
"""

import os
import subprocess
import sys
import shutil
from PIL import Image

# Configuration
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
ASSETS_DIR = os.path.join(PROJECT_ROOT, "assets")
SRC_ASSETS_DIR = os.path.join(PROJECT_ROOT, "src", "assets")
FRAMES_PER_CLIP = 16
FRAME_W = 512
FRAME_H = 288
GRID_COLS = 8
JPEG_QUALITY = 85

# Video file prefixes in order
VIDEO_PREFIXES = [
    "Camera_moves_through_airport_ter",
    "Camera_moves_toward_security_scr",
    "Camera_moves_toward_boarding_gate",
    "Camera_moves_through_jet_bridge",
]

JOURNEY_PREFIX = "Young_traveler_giving_thumbs_up"


def find_video_files():
    all_files = os.listdir(ASSETS_DIR)
    video_paths = []
    for prefix in VIDEO_PREFIXES:
        matches = [f for f in all_files if f.startswith(prefix) and f.endswith(".mp4")]
        if not matches:
            print(f"ERROR: No video file starting with '{prefix}' found in {ASSETS_DIR}")
            sys.exit(1)
        video_paths.append(os.path.join(ASSETS_DIR, matches[0]))
    return video_paths


def find_journey_complete():
    all_files = os.listdir(ASSETS_DIR)
    matches = [f for f in all_files if f.startswith(JOURNEY_PREFIX) and f.endswith((".jpeg", ".jpg"))]
    if not matches:
        print(f"ERROR: No journey complete image found")
        sys.exit(1)
    return os.path.join(ASSETS_DIR, matches[0])


def get_duration(video_path):
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", video_path],
        capture_output=True, text=True
    )
    return float(result.stdout.strip())


def extract_frames(video_path, clip_index, temp_dir):
    duration = get_duration(video_path)
    print(f"  Clip {clip_index+1}: {os.path.basename(video_path)} -- {duration:.2f}s")

    frames = []
    for frame_idx in range(FRAMES_PER_CLIP):
        timestamp = (duration * frame_idx) / FRAMES_PER_CLIP
        output_path = os.path.join(temp_dir, f"clip{clip_index}_frame{frame_idx:03d}.jpg")

        subprocess.run([
            "ffmpeg", "-y", "-ss", str(timestamp),
            "-i", video_path,
            "-frames:v", "1",
            "-vf", f"scale={FRAME_W}:{FRAME_H}",
            "-q:v", "2",
            output_path
        ], capture_output=True, check=True)
        frames.append(output_path)

    return frames


def build_spritesheet(all_frames, output_path):
    sheet = Image.new("RGB", (GRID_COLS * FRAME_W, 8 * FRAME_H), (0, 0, 0))

    for i, frame_path in enumerate(all_frames):
        row = i // GRID_COLS
        col = i % GRID_COLS
        x = col * FRAME_W
        y = row * FRAME_H

        frame = Image.open(frame_path)
        frame = frame.resize((FRAME_W, FRAME_H), Image.LANCZOS)
        sheet.paste(frame, (x, y))

    sheet.save(output_path, "JPEG", quality=JPEG_QUALITY)
    print(f"\nSpritesheet saved: {output_path}")
    print(f"Size: {sheet.size[0]}x{sheet.size[1]}")


def copy_journey_complete(source_path, dest_path):
    img = Image.open(source_path)
    img.save(dest_path, "JPEG", quality=90)
    print(f"Journey complete image copied: {dest_path}")


def main():
    print("=== Calm Wings Spritesheet Generator ===\n")

    video_paths = find_video_files()
    journey_complete_path = find_journey_complete()

    os.makedirs(SRC_ASSETS_DIR, exist_ok=True)

    temp_dir = os.path.join(PROJECT_ROOT, "tmp_frames")
    os.makedirs(temp_dir, exist_ok=True)

    all_frames = []
    for clip_idx, video_path in enumerate(video_paths):
        print(f"\nExtracting frames from clip {clip_idx+1}...")
        frames = extract_frames(video_path, clip_idx, temp_dir)
        all_frames.extend(frames)

    print(f"\nTotal frames extracted: {len(all_frames)}")

    print("\nBuilding spritesheet...")
    spritesheet_path = os.path.join(SRC_ASSETS_DIR, "spritesheet.jpg")
    build_spritesheet(all_frames, spritesheet_path)

    print("\nCopying journey complete image...")
    journey_dest = os.path.join(SRC_ASSETS_DIR, "journey-complete.jpg")
    copy_journey_complete(journey_complete_path, journey_dest)

    shutil.rmtree(temp_dir)
    print("\nTemp frames cleaned up.")
    print("\n=== Done! Assets ready for web app. ===")


if __name__ == "__main__":
    main()

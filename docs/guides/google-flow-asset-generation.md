# Calm Wings — Google Flow Asset Generation Guide

> **Tool:** Google Flow (labs.google/fx/tools/flow)
> **Subscription required:** Google AI Pro ($19.99/mo) minimum
> **Total generations:** ~10 (4 images + 4 videos + 1 image + 1-2 retries)
> **Estimated time:** 2-3 hours (including iteration)
> **Output location:** Create a folder `G:\.shortcut-targets-by-id\1aBPs7hhQpl1bzyOnxaK6OgY8GGAPPIU2\Vibe To Viable\assets-raw\`

---

## Before You Start

### 1. Create the output folder

```bash
mkdir -p "G:/.shortcut-targets-by-id/1aBPs7hhQpl1bzyOnxaK6OgY8GGAPPIU2/Vibe To Viable/assets-raw"
```

### 2. Open Google Flow

- Go to <https://labs.google/fx/tools/flow> in Chrome or Edge
- Sign in with your Google account (must have AI Pro or Ultra subscription)
- Create a new project called **"Calm Wings"**

### 3. Understanding the workflow

You'll do this in order:

```
Step 1: Generate 4 keyframe images (Imagen)
Step 2: Add the first keyframe as an Ingredient for style consistency
Step 3: Generate 4 flythrough videos using Start/End Frames (Veo 3.1)
Step 4: Generate 1 journey complete image (Imagen)
Step 5: Download everything to assets-raw/
```

---

## Step 1: Generate 4 Keyframe Images

These are your 4 scene backgrounds. They define the visual style, lighting, and composition for the entire experience. **Getting these right is the most important part of the process.**

### Setup

1. In your Flow project, click the model name
2. Select **Image** mode
3. Model: **Nano Banana Pro** (best quality) or **Nano Banana 2** (if Pro is too expensive)
4. Aspect ratio: **16:9** (mandatory — all assets must be widescreen)
5. Number of outputs: **1** (generate one at a time so you can iterate)

### Art Style Template

Every keyframe prompt starts with this prefix. **Do not change it between images — this is what keeps the style consistent:**

```
Semi-realistic anime illustration style, clean vector lines, soft ambient lighting, warm and cool color contrast. Color palette: deep navy blue (#0A1628) environment, warm golden yellow (#F5A623) accent lighting and signage, cool blue (#3B82F6) screen glows. Polished floors with subtle reflections. Friendly, welcoming atmosphere. Clean architectural lines, simplified but realistic detail. No text in image, no watermark.
```

### Keyframe 1: Airport Entrance

**Prompt:**

```
Semi-realistic anime illustration style, clean vector lines, soft ambient lighting, warm and cool color contrast. Color palette: deep navy blue (#0A1628) environment, warm golden yellow (#F5A623) accent lighting and signage, cool blue (#3B82F6) screen glows. Polished floors with subtle reflections. Friendly, welcoming atmosphere. Clean architectural lines, simplified but realistic detail. No text in image, no watermark.

Airport terminal entrance, first-person view at eye level. Large sliding glass doors ahead, transparent glass showing the departure hall beyond. Above the doors, a illuminated sign panel (blank, no text). Potted plants on either side of the entrance. Ceiling with warm spotlights. Through the glass doors, check-in counters and a large flight information display board are faintly visible in the background. The floor is polished stone with subtle reflections. Symmetrical composition, inviting and calm.
```

**What you want:** The camera is standing AT the entrance, looking IN through the glass doors. The check-in area should be visible through the glass — this is your Approach C spatial continuity (scene 1's background leads into scene 2's foreground).

**If it doesn't look right:** Retry with adjustments. Common fixes:

- Too photorealistic? Add "anime illustration, cel-shaded, stylized"
- Too dark? Add "brighter lighting, well-lit interior"
- Wrong composition? Add "symmetrical, centered, eye-level perspective"

**When you get a good one:** Download it as `keyframe-1-entrance.jpg` to your `assets-raw/` folder.

### Keyframe 2: Check-in Counters

**Prompt:**

```
Semi-realistic anime illustration style, clean vector lines, soft ambient lighting, warm and cool color contrast. Color palette: deep navy blue (#0A1628) environment, warm golden yellow (#F5A623) accent lighting and signage, cool blue (#3B82F6) screen glows. Polished floors with subtle reflections. Friendly, welcoming atmosphere. Clean architectural lines, simplified but realistic detail. No text in image, no watermark.

Airport check-in area, first-person view standing mid-room. Five airline check-in counters ahead (01-05) with queue barrier belts. Behind the counters, a large blue flight information display screen (FIDS board, blank screen). To the right, the terminal entrance glass doors are visible behind the viewer's position. The ceiling is high with structural beams and warm lighting. Luggage carts near the counters. The floor is polished with subtle reflections. Spacious and orderly atmosphere.
```

**What you want:** The camera has walked THROUGH the entrance doors and is now standing in the check-in area. The entrance doors should be visible behind/beside — connecting back to keyframe 1.

**Download as:** `keyframe-2-checkin.jpg`

### Keyframe 3: Security Screening

**Prompt:**

```
Semi-realistic anime illustration style, clean vector lines, soft ambient lighting, warm and cool color contrast. Color palette: deep navy blue (#0A1628) environment, warm golden yellow (#F5A623) accent lighting and signage, cool blue (#3B82F6) screen glows. Polished floors with subtle reflections. Friendly, welcoming atmosphere. Clean architectural lines, simplified but realistic detail. No text in image, no watermark.

Airport security screening area, first-person view. Ahead: an X-ray belt machine with a roller conveyor, a metal detector archway gate, and a tray preparation table. Security personnel in uniform standing near the scanner. Yellow floor markings indicating the screening zone. Behind the viewer, the check-in counter area is visible in the background. Overhead signage panels (blank, no text). The area is well-lit with a mix of warm spotlights and cool fluorescent lighting. Organized and calm atmosphere.
```

**What you want:** Camera has walked past check-in to security. The check-in area should be visible behind — connecting back to keyframe 2.

**Download as:** `keyframe-3-security.jpg`

### Keyframe 4: Boarding Gate

**Prompt:**

```
Semi-realistic anime illustration style, clean vector lines, soft ambient lighting, warm and cool color contrast. Color palette: deep navy blue (#0A1628) environment, warm golden yellow (#F5A623) accent lighting and signage, cool blue (#3B82F6) screen glows. Polished floors with subtle reflections. Friendly, welcoming atmosphere. Clean architectural lines, simplified but realistic detail. No text in image, no watermark.

Airport boarding gate area, first-person view. A gate sign panel overhead (blank, no text). A large window showing an airplane on the tarmac outside with a jet bridge connected to the terminal. Boarding queue lanes with belt barriers. A flight information display screen (FIDS) on the wall (blank blue screen). Seating area near the window. Behind the viewer, the airside terminal corridor with retail shops is visible. Bright, optimistic atmosphere with natural daylight from the window.
```

**What you want:** Camera is at the boarding gate, jet bridge and airplane visible ahead. Terminal corridor behind connects to keyframe 3's area.

**Download as:** `keyframe-4-boarding.jpg`

---

## Step 2: Set Up Style Consistency (Ingredients)

Before generating videos, you want to ensure Veo uses your keyframes as visual references. **Flow's "Ingredients" feature lets you upload reference images that the model uses for style and content.**

1. In your Flow project, click the model name
2. Select **Video** mode
3. Click **Ingredients**
4. Upload your best keyframe image (keyframe 1 is a good choice — it sets the overall art style)
5. This ingredient will be available to reference in all video generations

**Optional but recommended:** Upload ALL 4 keyframes as ingredients. When generating clip 1, reference keyframe 1 and 2 as ingredients so Veo blends the style between them.

---

## Step 3: Generate 4 Flythrough Videos

This is the core of the experience. Each video is a camera flyforward from one keyframe to the next. **Use the Start/End Frames feature.**

### Setup for all videos

1. Click model name → **Video** → **Frames**
2. Model: **Veo 3.1 Fast** (balanced speed/quality) or **Veo 3.1** (best quality, costs more credits)
3. Aspect ratio: **16:9**
4. Generation length: **2 seconds** (shortest available — you only need a quick flythrough)
5. Number of outputs: **1**

### How Start/End Frames work

- **Start Frame** = the keyframe image for the current checkpoint
- **End Frame** = the keyframe image for the NEXT checkpoint
- Veo generates a video that smoothly transitions from start frame to end frame
- This creates the illusion of walking forward through the airport

### Video Clip 1: Entrance → Check-in

1. **Start Frame:** Drag `keyframe-1-entrance.jpg` to "Add start frame"
2. **End Frame:** Drag `keyframe-2-checkin.jpg` to "Add end frame"
3. **Prompt:**

```
Camera slowly pushes forward through the airport terminal entrance, passing through the sliding glass doors, moving toward the check-in counters. Smooth dolly forward motion. The environment remains consistent. No subject movement — only the camera moves forward. Ambient atmosphere, warm lighting. Style: semi-realistic anime illustration.
```

1. Click Generate
2. Wait for the video to complete (usually 1-3 minutes)
3. **Check the result:**
   - Does the camera move forward smoothly? ✅
   - Does the transition from entrance to check-in feel natural? ✅
   - Is the art style consistent? ✅
   - Is there obvious flickering or morphing? ❌ (retry if yes)
4. **Download as:** `clip-1-entrance-to-checkin.mp4` to `assets-raw/`

### Video Clip 2: Check-in → Security

1. **Start Frame:** `keyframe-2-checkin.jpg`
2. **End Frame:** `keyframe-3-security.jpg`
3. **Prompt:**

```
Camera slowly pushes forward past the check-in counters, walking toward the security screening area. The X-ray machines and metal detector archway come into view as the camera advances. Smooth dolly forward motion. No subject movement — only the camera moves forward. Ambient atmosphere. Style: semi-realistic anime illustration.
```

1. Download as: `clip-2-checkin-to-security.mp4`

### Video Clip 3: Security → Boarding Gate

1. **Start Frame:** `keyframe-3-security.jpg`
2. **End Frame:** `keyframe-4-boarding.jpg`
3. **Prompt:**

```
Camera slowly pushes forward through the security screening area, walking toward the boarding gate. The jet bridge and airplane outside the window come into view as the camera advances. Smooth dolly forward motion. No subject movement — only the camera moves forward. Ambient atmosphere, brightening natural light from windows. Style: semi-realistic anime illustration.
```

1. Download as: `clip-3-security-to-boarding.mp4`

### Video Clip 4: Boarding Gate → Jet Bridge / Aircraft Door

For the final clip, you need an end frame showing the inside of the jet bridge or aircraft door. You have two options:

**Option A (recommended): Generate a 5th keyframe as the end frame**

Go back to Image mode and generate:

```
Semi-realistic anime illustration style, clean vector lines, soft ambient lighting, warm and cool color contrast. Color palette: deep navy blue (#0A1628) environment, warm golden yellow (#F5A623) accent lighting, cool blue (#3B82F6) screen glows. Polished floors with subtle reflections. Clean architectural lines. No text in image, no watermark.

Jet bridge interior, first-person view. White tunnel-like corridor with overhead lighting, slightly claustrophobic but clean. At the far end, the aircraft door is open, revealing a glimpse of the airplane cabin interior. The tunnel has a slight upward slope. Calm, welcoming atmosphere.
```

Download as: `keyframe-5-jetbridge.jpg`

Then generate the video:

1. **Start Frame:** `keyframe-4-boarding.jpg`
2. **End Frame:** `keyframe-5-jetbridge.jpg`
3. **Prompt:**

```
Camera slowly pushes forward through the boarding gate, entering the jet bridge tunnel. The white corridor surrounds the camera as it moves toward the aircraft door. Smooth dolly forward motion. No subject movement — only the camera moves forward. Ambient atmosphere, brightening light from the aircraft door ahead. Style: semi-realistic anime illustration.
```

1. Download as: `clip-4-boarding-to-jetbridge.mp4`

**Option B (faster, fewer credits): Use keyframe 4 as both start and end**

Skip the 5th keyframe. Use keyframe 4 as start frame, and just prompt for a slow zoom:

1. **Start Frame:** `keyframe-4-boarding.jpg`
2. **End Frame:** (none)
3. **Prompt:**

```
Camera slowly pushes forward toward the jet bridge entrance at the boarding gate. The camera moves toward the window and jet bridge door. Smooth dolly forward motion. No subject movement. Ambient atmosphere. Style: semi-realistic anime illustration.
```

---

## Step 4: Generate Journey Complete Image

This is the final static image shown when the user finishes scrolling. It's NOT on the canvas — it's a React DOM overlay.

1. Switch back to **Image** mode
2. Model: **Nano Banana Pro** or **Nano Banana 2**
3. Aspect ratio: **16:9**

**Prompt:**

```
Semi-realistic anime illustration style, clean vector lines, soft ambient lighting, warm and cool color contrast. Color palette: deep navy blue (#0A1628) environment, warm golden yellow (#F5A623) accent lighting, cool blue (#3B82F6) screen glows. Clean architectural lines. No text in image, no watermark.

A young traveler seated in an airplane cabin window seat, giving a thumbs up, smiling. The window shows blue sky and clouds. Overhead bin is closed. Seatbelt is fastened. The cabin has warm ambient lighting. Cozy and triumphant atmosphere. The character is drawn in a clean anime style with expressive features.
```

**Download as:** `journey-complete.jpg` to `assets-raw/`

---

## Step 5: Verify & Organize

### Check your assets-raw/ folder

You should have these files:

```
assets-raw/
├── keyframe-1-entrance.jpg          ← scene 1 background
├── keyframe-2-checkin.jpg           ← scene 2 background
├── keyframe-3-security.jpg          ← scene 3 background
├── keyframe-4-boarding.jpg          ← scene 4 background
├── keyframe-5-jetbridge.jpg         ← scene 5 background (optional, for clip 4 end frame)
├── clip-1-entrance-to-checkin.mp4   ← flythrough video 1
├── clip-2-checkin-to-security.mp4   ← flythrough video 2
├── clip-3-security-to-boarding.mp4 ← flythrough video 3
├── clip-4-boarding-to-jetbridge.mp4 ← flythrough video 4
└── journey-complete.jpg             ← final summary screen image
```

### Quality Checklist

Before moving to Phase 1 (spritesheet generation), verify:

- [ ] All 4 keyframe images share the same art style (lighting, palette, line quality)
- [ ] All 4 video clips show smooth camera forward motion (no jarring jumps)
- [ ] Video transitions between clips feel spatially connected (entrance leads to check-in, check-in leads to security, etc.)
- [ ] No visible text or watermarks in the keyframe images (signage panels should be blank)
- [ ] Journey complete image shows a character in a cabin, thumbs up
- [ ] All files are 16:9 aspect ratio
- [ ] All files downloaded to `assets-raw/`

### Watermark Note

Veo generates videos with a visible watermark (Veo badge). This is expected on the Pro tier. **Do not worry about it** — when the agent extracts frames and builds the spritesheet, the HUD overlay will cover the screen edges where watermarks typically appear. If the watermark is in a visible area, it can be cropped during frame extraction (Task 1 in the build plan will handle this).

---

## What Happens Next

Once all assets are in `assets-raw/`, the automated pipeline takes over:

```
Task 1 (Agent): ffmpeg extracts 64 frames from the 4 MP4 clips
     → composites them into 1 spritesheet (8×8 grid, 512×288 per frame)
     → copies journey-complete.jpg to src/assets/
     → outputs: src/assets/spritesheet.jpg + src/assets/journey-complete.jpg

Tasks 2-6 (Agents): Build the web app
     → Vite + React 19 + TypeScript scaffold
     → Canvas scroll-scrub engine (spritesheet → drawImage)
     → HUD overlay components (cosmetic, no interaction)
     → Integration + polish

Task 7 (Agent): README + cleanup
Task 8 (Emo): Deploy to Vercel
```

You're done after Step 5. The agents handle everything else.

---

## Troubleshooting

### "The art style is inconsistent between keyframes"

This is the most common issue. Fix it by:

1. Using the **exact same prompt prefix** (the art style template) for every keyframe
2. Only changing the scene description portion
3. Adding keyframe 1 as an **Ingredient** when generating keyframes 2-4 so the model references its style

### "The video looks like a slideshow, not a smooth flythrough"

Veo should handle this well with Start/End Frames. If it doesn't:

1. Make sure your prompt says "smooth dolly forward motion" and "no subject movement"
2. Try a longer generation (4 seconds instead of 2) — sometimes the model needs more frames to smooth out the transition
3. If the 2-second clip is too short for a smooth move, generate a 4-second clip and the agent will sample 16 frames from it

### "The video has audio I don't want"

Veo 3.1 generates audio by default. You can either:

1. Mute it in the web app (the canvas engine doesn't play audio anyway)
2. The agent will extract frames only — audio is automatically discarded during frame extraction

### "I ran out of credits"

Google AI Pro gives you a monthly credit allowance. If you run out:

1. Switch to Veo 3.1 Lite (cheaper per generation)
2. Or switch to Nano Banana 2 instead of Pro for images
3. Or purchase additional AI Credits
4. Or fall back to ComfyUI + AnimateDiff (your local setup) for the remaining assets

### "Flow is not available in my region"

Flow is confirmed available in India. If you still get a region error:

1. Make sure your Google account age is verified (18+)
2. Check that your Google AI Pro/Ultra subscription is active
3. Try in an incognito window
4. VPNs will NOT bypass Flow region restrictions (Google blocks them)

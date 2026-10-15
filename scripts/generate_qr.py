# scripts/generate_qr.py
"""
High-Resolution QR Code & Pitch Card Generator for Droneit
Target URL: https://drone-it-tawny.vercel.app/
Outputs:
1. droneit_qr_code.png (Crisp standalone branded QR code, 1200x1200px)
2. droneit_qr_clean.png (Clean standard monochrome QR code, 1200x1200px)
3. droneit_qr_pitch_card.png (Stunning presentation poster card, 1200x1550px)
"""

import os
import qrcode
from PIL import Image, ImageDraw, ImageFont

TARGET_URL = "https://drone-it-tawny.vercel.app/"
OUTPUT_DIRS = [
    "/Users/janstevedaniel/Desktop/DroneIt/public",
    "/Users/janstevedaniel/.gemini/antigravity/brain/375331e5-a6ab-408c-bbcc-331a79d27502"
]

for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

# ---------------------------------------------------------------------------
# 1. Base QR Code Matrix with Error Correction Level H (30% fault tolerance)
# ---------------------------------------------------------------------------
BORDER_MODULES = 4
BOX_PIXELS = 24

qr = qrcode.QRCode(
    version=4,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=BOX_PIXELS,
    border=BORDER_MODULES,
)
qr.add_data(TARGET_URL)
qr.make(fit=True)

matrix = qr.get_matrix()
matrix_size = len(matrix)
qr_dimension = matrix_size * BOX_PIXELS

print(f"Matrix size: {matrix_size}x{matrix_size}, Dimension: {qr_dimension}x{qr_dimension}px")

# Color palette (Droneit branding)
COLOR_BG = (255, 255, 255)
COLOR_DARK = (15, 23, 42)      # Slate-900 (#0F172A)
COLOR_EMERALD = (5, 150, 105)   # Emerald-600 (#059669)
COLOR_EMERALD_DARK = (4, 120, 87) # Emerald-700
COLOR_EMERALD_LIGHT = (209, 250, 229) # Emerald-100 (#D1FAE5)
COLOR_MUTED = (100, 116, 139)   # Slate-500 (#64748B)
COLOR_BORDER = (226, 232, 240)  # Slate-200 (#E2E8F0)
COLOR_CARD_BG = (248, 250, 252) # Slate-50 (#F8FAFC)

# Inner core finder positions:
# TL: rows 6..8, cols 6..8
# TR: rows 6..8, cols (matrix_size - 9)..(matrix_size - 7)
# BL: rows (matrix_size - 9)..(matrix_size - 7), cols 6..8
def is_finder_core(r, c, size):
    tr_start = size - 4 - 5
    tr_end = size - 4 - 3
    bl_start = size - 4 - 5
    bl_end = size - 4 - 3

    # Top-Left 3x3 core
    if 6 <= r <= 8 and 6 <= c <= 8:
        return True
    # Top-Right 3x3 core
    if 6 <= r <= 8 and tr_start <= c <= tr_end:
        return True
    # Bottom-Left 3x3 core
    if bl_start <= r <= bl_end and 6 <= c <= 8:
        return True
    return False

# ---------------------------------------------------------------------------
# 2. Render Custom Branded QR Code Image
# ---------------------------------------------------------------------------
def render_styled_qr(branded=True):
    img = Image.new("RGBA", (qr_dimension, qr_dimension), COLOR_BG)
    draw = ImageDraw.Draw(img)

    # Draw individual modules
    for r in range(matrix_size):
        for c in range(matrix_size):
            if matrix[r][c]:
                x0 = c * BOX_PIXELS
                y0 = r * BOX_PIXELS
                x1 = x0 + BOX_PIXELS
                y1 = y0 + BOX_PIXELS

                if branded and is_finder_core(r, c, matrix_size):
                    fill_color = COLOR_EMERALD
                else:
                    fill_color = COLOR_DARK

                draw.rectangle([x0, y0, x1, y1], fill=fill_color)

    # Center Badge (Hexacopter / DRN Droneit emblem)
    if branded:
        center_x = qr_dimension // 2
        center_y = qr_dimension // 2
        badge_radius = int(qr_dimension * 0.10) # 20% diameter (well within 30% H-limit)

        # White safety border background circle
        draw.ellipse(
            [center_x - badge_radius - 12, center_y - badge_radius - 12,
             center_x + badge_radius + 12, center_y + badge_radius + 12],
            fill=(255, 255, 255, 255),
            outline=COLOR_BORDER,
            width=3
        )

        # Emerald circle base
        draw.ellipse(
            [center_x - badge_radius, center_y - badge_radius,
             center_x + badge_radius, center_y + badge_radius],
            fill=COLOR_EMERALD,
            outline=COLOR_EMERALD_DARK,
            width=2
        )

        # Draw Drone / Hexacopter Icon in white inside center circle
        # Center fuselage
        draw.ellipse(
            [center_x - 14, center_y - 14, center_x + 14, center_y + 14],
            fill=(255, 255, 255)
        )
        draw.ellipse(
            [center_x - 7, center_y - 7, center_x + 7, center_y + 7],
            fill=COLOR_EMERALD
        )

        # 4 Drone Rotors & Arms (diagonal)
        arm_len = int(badge_radius * 0.62)
        rotor_r = 8
        offsets = [
            (-arm_len, -arm_len),
            (arm_len, -arm_len),
            (-arm_len, arm_len),
            (arm_len, arm_len),
        ]
        for dx, dy in offsets:
            rx = center_x + dx
            ry = center_y + dy
            # Arm line
            draw.line([center_x, center_y, rx, ry], fill=(255, 255, 255), width=4)
            # Motor / Rotor disc
            draw.ellipse([rx - rotor_r, ry - rotor_r, rx + rotor_r, ry + rotor_r], fill=(255, 255, 255))
            draw.ellipse([rx - 3, ry - 3, rx + 3, ry + 3], fill=COLOR_EMERALD)

    return img

img_branded_qr = render_styled_qr(branded=True)
img_clean_qr = render_styled_qr(branded=False)

# Resize to crisp 1200x1200px
qr_1200 = img_branded_qr.resize((1200, 1200), Image.Resampling.LANCZOS)
qr_clean_1200 = img_clean_qr.resize((1200, 1200), Image.Resampling.LANCZOS)

# ---------------------------------------------------------------------------
# 3. Create Full Presentation Pitch Card Poster (1200 x 1550 px)
# ---------------------------------------------------------------------------
card_w = 1200
card_h = 1550
card = Image.new("RGB", (card_w, card_h), COLOR_CARD_BG)
draw_card = ImageDraw.Draw(card)

# Load fonts
try:
    font_bold_title = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 54)
    font_bold_sub = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 24)
    font_badge = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 19)
    font_url = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 27)
    font_body = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 22)
    font_tag = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 18)
    font_footer = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 17)
except Exception as e:
    print("Font fallback:", e)
    font_bold_title = font_bold_sub = font_badge = font_url = font_body = font_tag = font_footer = ImageFont.load_default()

# Inner White Card with soft border
inner_margin_x = 55
inner_margin_y = 55
inner_rect = [inner_margin_x, inner_margin_y, card_w - inner_margin_x, card_h - inner_margin_y]

# Draw rounded white card
draw_card.rounded_rectangle(inner_rect, radius=36, fill=(255, 255, 255), outline=COLOR_BORDER, width=2)

# Top Category Pill: "5-MIN AUTONOMOUS DRONE DELIVERY"
pill_text = "5-MIN AUTONOMOUS DRONE DELIVERY"
pill_box = draw_card.textbbox((0, 0), pill_text, font=font_badge)
pill_w = (pill_box[2] - pill_box[0]) + 48
pill_h = (pill_box[3] - pill_box[1]) + 20
pill_x = (card_w - pill_w) // 2
pill_y = inner_margin_y + 45

# Draw pill with green dot indicator
draw_card.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + pill_h], radius=16, fill=COLOR_EMERALD_LIGHT, outline=COLOR_EMERALD, width=1)
# Green pulse dot
dot_cx = pill_x + 20
dot_cy = pill_y + (pill_h // 2)
draw_card.ellipse([dot_cx - 4, dot_cy - 4, dot_cx + 4, dot_cy + 4], fill=COLOR_EMERALD)
draw_card.text((dot_cx + 12, pill_y + 9), pill_text, fill=(6, 95, 70), font=font_badge)

# Brand Title: "Droneit"
title_text = "Droneit"
title_bbox = draw_card.textbbox((0, 0), title_text, font=font_bold_title)
title_x = (card_w - (title_bbox[2] - title_bbox[0])) // 2
title_y = pill_y + pill_h + 18
draw_card.text((title_x, title_y), title_text, fill=COLOR_DARK, font=font_bold_title)

# Tagline: "Scan with Phone Camera to Experience Live App"
sub_text = "Point phone camera to experience live 3–5 min quick delivery"
sub_bbox = draw_card.textbbox((0, 0), sub_text, font=font_body)
sub_x = (card_w - (sub_bbox[2] - sub_bbox[0])) // 2
sub_y = title_y + (title_bbox[3] - title_bbox[1]) + 10
draw_card.text((sub_x, sub_y), sub_text, fill=COLOR_MUTED, font=font_body)

# QR Code Box Background (white with border)
qr_display_size = 660
qr_box_x = (card_w - qr_display_size) // 2
qr_box_y = sub_y + (sub_bbox[3] - sub_bbox[1]) + 28

# Elevated container for QR code
draw_card.rounded_rectangle(
    [qr_box_x - 18, qr_box_y - 18, qr_box_x + qr_display_size + 18, qr_box_y + qr_display_size + 18],
    radius=26,
    fill=(255, 255, 255),
    outline=COLOR_BORDER,
    width=2
)

# Paste QR code
qr_resized_for_card = img_branded_qr.resize((qr_display_size, qr_display_size), Image.Resampling.LANCZOS)
card.paste(qr_resized_for_card, (qr_box_x, qr_box_y), qr_resized_for_card)

# URL Pill beneath QR code
url_pill_text = "https://drone-it-tawny.vercel.app/"
url_bbox = draw_card.textbbox((0, 0), url_pill_text, font=font_url)
url_pill_w = (url_bbox[2] - url_bbox[0]) + 44
url_pill_h = (url_bbox[3] - url_bbox[1]) + 20
url_pill_x = (card_w - url_pill_w) // 2
url_pill_y = qr_box_y + qr_display_size + 36

draw_card.rounded_rectangle(
    [url_pill_x, url_pill_y, url_pill_x + url_pill_w, url_pill_y + url_pill_h],
    radius=18,
    fill=(241, 245, 249),
    outline=COLOR_BORDER,
    width=1
)
draw_card.text((url_pill_x + 22, url_pill_y + 9), url_pill_text, fill=COLOR_EMERALD, font=font_url)

# Instruction line with checkmark circle
instr_text = "Compatible with iPhone Camera, Android Camera & Google Lens"
instr_bbox = draw_card.textbbox((0, 0), instr_text, font=font_body)
instr_w = (instr_bbox[2] - instr_bbox[0]) + 26
instr_x = (card_w - instr_w) // 2
instr_y = url_pill_y + url_pill_h + 20

# Checkmark circle icon
check_cx = instr_x + 8
check_cy = instr_y + 11
draw_card.ellipse([check_cx - 7, check_cy - 7, check_cx + 7, check_cy + 7], fill=COLOR_EMERALD)
draw_card.line([check_cx - 3, check_cy, check_cx - 1, check_cy + 3], fill=(255, 255, 255), width=2)
draw_card.line([check_cx - 1, check_cy + 3, check_cx + 4, check_cy - 3], fill=(255, 255, 255), width=2)
draw_card.text((instr_x + 24, instr_y), instr_text, fill=COLOR_MUTED, font=font_body)

# Feature Badges Row (3 feature tags)
tags = [
    ("3–5 Min Aerial Speed", COLOR_EMERALD),
    ("DGCA Green Zone Corridor", (13, 148, 136)),
    ("100% Circular GreenLoop", (16, 185, 129))
]
tag_gap = 14
tag_h = 42
total_tags_w = 0
tag_widths = []

for t_text, _ in tags:
    bb = draw_card.textbbox((0, 0), t_text, font=font_tag)
    w = (bb[2] - bb[0]) + 44
    tag_widths.append(w)
    total_tags_w += w
total_tags_w += tag_gap * (len(tags) - 1)

tag_start_x = (card_w - total_tags_w) // 2
tag_y = instr_y + (instr_bbox[3] - instr_bbox[1]) + 26

cur_x = tag_start_x
for idx, (t_text, dot_col) in enumerate(tags):
    tw = tag_widths[idx]
    draw_card.rounded_rectangle([cur_x, tag_y, cur_x + tw, tag_y + tag_h], radius=14, fill=(248, 250, 252), outline=COLOR_BORDER, width=1)
    # Colored indicator dot
    dot_x = cur_x + 18
    dot_y = tag_y + (tag_h // 2)
    draw_card.ellipse([dot_x - 4, dot_y - 4, dot_x + 4, dot_y + 4], fill=dot_col)
    draw_card.text((dot_x + 12, tag_y + 11), t_text, fill=COLOR_DARK, font=font_tag)
    cur_x += tw + tag_gap

# Footer divider & info
div_y = tag_y + tag_h + 30
draw_card.line([inner_margin_x + 40, div_y, card_w - inner_margin_x - 40, div_y], fill=COLOR_BORDER, width=1)

footer_l = "Premier BBA Business Competition 2026 • Official Live Web App"
footer_r = "Droneiteco@gmail.com • +91 8438110297"

draw_card.text((inner_margin_x + 40, div_y + 16), footer_l, fill=COLOR_MUTED, font=font_footer)
bb_r = draw_card.textbbox((0, 0), footer_r, font=font_footer)
draw_card.text((card_w - inner_margin_x - 40 - (bb_r[2] - bb_r[0]), div_y + 16), footer_r, fill=COLOR_MUTED, font=font_footer)

# ---------------------------------------------------------------------------
# 4. Save to all destination directories
# ---------------------------------------------------------------------------
for target_dir in OUTPUT_DIRS:
    path_branded = os.path.join(target_dir, "droneit_qr_code.png")
    path_clean = os.path.join(target_dir, "droneit_qr_clean.png")
    path_card = os.path.join(target_dir, "droneit_qr_pitch_card.png")

    qr_1200.save(path_branded, "PNG", dpi=(300, 300))
    qr_clean_1200.save(path_clean, "PNG", dpi=(300, 300))
    card.save(path_card, "PNG", dpi=(300, 300))

    print(f"Saved assets to: {target_dir}")
    print(f" - {path_branded}")
    print(f" - {path_clean}")
    print(f" - {path_card}")

print("\nAll QR code assets successfully generated and verified!")

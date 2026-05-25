#!/usr/bin/env python3
# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "google-genai>=1.16.0",
#   "Pillow>=10.0.0",
# ]
# ///

import argparse
import base64
import os
import sys
from pathlib import Path

RESOLUTION_MAP = {
    "512px": (512, 512),
    "1K": (1024, 1024),
    "2K": (2048, 2048),
    "4K": (4096, 4096),
}

ASPECT_RATIOS = {
    "1:1":  (1, 1),
    "1:4":  (1, 4),
    "1:8":  (1, 8),
    "2:3":  (2, 3),
    "3:2":  (3, 2),
    "3:4":  (3, 4),
    "4:1":  (4, 1),
    "4:3":  (4, 3),
    "4:5":  (4, 5),
    "5:4":  (5, 4),
    "8:1":  (8, 1),
    "9:16": (9, 16),
    "16:9": (16, 9),
    "21:9": (21, 9),
}


def resolve_dimensions(resolution: str, aspect_ratio: str | None) -> tuple[int, int]:
    base = RESOLUTION_MAP.get(resolution, RESOLUTION_MAP["1K"])
    base_px = base[0]

    if not aspect_ratio:
        return base_px, base_px

    if aspect_ratio not in ASPECT_RATIOS:
        print(f"Warning: unknown aspect ratio '{aspect_ratio}', using 1:1", file=sys.stderr)
        return base_px, base_px

    w_ratio, h_ratio = ASPECT_RATIOS[aspect_ratio]
    if w_ratio >= h_ratio:
        width = base_px
        height = round(base_px * h_ratio / w_ratio)
    else:
        height = base_px
        width = round(base_px * w_ratio / h_ratio)

    # Round to nearest multiple of 8 (model requirement)
    width = max(8, (width // 8) * 8)
    height = max(8, (height // 8) * 8)
    return width, height


def load_image_b64(path: str) -> tuple[str, str]:
    """Return (mime_type, base64_data) for an image file."""
    from PIL import Image
    import io

    p = Path(path)
    if not p.exists():
        print(f"Error: input image not found: {path}", file=sys.stderr)
        sys.exit(1)

    with Image.open(p) as img:
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        data = base64.b64encode(buf.getvalue()).decode()
    return "image/png", data


def generate(
    prompt: str,
    filename: str,
    resolution: str,
    aspect_ratio: str | None,
    input_images: list[str],
    api_key: str,
) -> str:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=api_key)
    width, height = resolve_dimensions(resolution, aspect_ratio)

    contents: list = []

    # Add reference images first (if any)
    for img_path in input_images:
        mime, data = load_image_b64(img_path)
        contents.append(
            types.Part.from_bytes(data=base64.b64decode(data), mime_type=mime)
        )

    # Add text prompt
    contents.append(types.Part.from_text(text=prompt))

    response = client.models.generate_content(
        model="gemini-3.1-flash-image-preview",
        contents=contents,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
            image_generation_config=types.ImageGenerationConfig(
                number_of_images=1,
                output_mime_type="image/png",
                output_compression_quality=95,
            ),
        ),
    )

    out_path = Path(filename)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    saved = None
    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.mime_type.startswith("image/"):
            image_bytes = part.inline_data.data
            if isinstance(image_bytes, str):
                image_bytes = base64.b64decode(image_bytes)

            # Resize to exact target dimensions if needed
            from PIL import Image
            import io
            img = Image.open(io.BytesIO(image_bytes))
            if img.size != (width, height):
                img = img.resize((width, height), Image.LANCZOS)

            img.save(out_path, format="PNG", optimize=True)
            saved = str(out_path.resolve())
            break

    if saved is None:
        # Print any text response for debugging
        for part in response.candidates[0].content.parts:
            if hasattr(part, "text") and part.text:
                print(f"Model response: {part.text}", file=sys.stderr)
        print("Error: no image returned by the model.", file=sys.stderr)
        sys.exit(1)

    return saved


def main():
    parser = argparse.ArgumentParser(description="Nano Banana 2 image generation")
    parser.add_argument("--prompt", required=True, help="Image generation prompt")
    parser.add_argument("--filename", required=True, help="Output filename (PNG)")
    parser.add_argument("--resolution", default="1K", choices=list(RESOLUTION_MAP.keys()), help="Output resolution")
    parser.add_argument("--aspect-ratio", default=None, help="Aspect ratio (e.g. 16:9, 4:5, 9:16)")
    parser.add_argument("--input-image", action="append", default=[], dest="input_images", help="Reference image(s) for editing")
    parser.add_argument("--api-key", default=None, help="Gemini API key (falls back to GEMINI_API_KEY env var)")
    args = parser.parse_args()

    api_key = args.api_key or os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Error: no API key. Pass --api-key or set GEMINI_API_KEY.", file=sys.stderr)
        sys.exit(1)

    saved_path = generate(
        prompt=args.prompt,
        filename=args.filename,
        resolution=args.resolution,
        aspect_ratio=args.aspect_ratio,
        input_images=args.input_images,
        api_key=api_key,
    )
    print(saved_path)


if __name__ == "__main__":
    main()

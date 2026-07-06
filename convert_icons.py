"""
Script para remover fundo e converter JPG → WebP
Uso: python convert_icons.py [pasta_origem] [pasta_destino]
Requer: pip install Pillow rembg onnxruntime
"""
import sys
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Instale Pillow: pip install Pillow")
    sys.exit(1)

try:
    from rembg import remove
except ImportError:
    print("Instale rembg: pip install rembg onnxruntime")
    sys.exit(1)


def process_image(src: Path, dst: Path):
    with open(src, "rb") as f:
        input_data = f.read()
    output_data = remove(input_data)
    tmp = dst.with_suffix(".png")
    with open(tmp, "wb") as f:
        f.write(output_data)
    img = Image.open(tmp).convert("RGBA")
    img.save(dst, "WEBP", quality=90)
    tmp.unlink()
    return dst


def main():
    src_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("assets/agendas/icons")
    dst_dir = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("assets/agendas/icons_webp")

    if not src_dir.exists():
        print(f"Pasta não encontrada: {src_dir}")
        sys.exit(1)

    dst_dir.mkdir(parents=True, exist_ok=True)

    files = list(src_dir.glob("*.jpg")) + list(src_dir.glob("*.JPG")) + list(src_dir.glob("*.jpeg"))
    if not files:
        print(f"Nenhum JPG encontrado em {src_dir}")
        return

    print(f"Encontrados {len(files)} arquivos. Processando...")
    for i, src in enumerate(files, 1):
        dst = dst_dir / (src.stem + ".webp")
        print(f"  [{i}/{len(files)}] {src.name} → {dst.name} (removendo fundo...)")
        process_image(src, dst)
        print(f"           ✓ Salvo em {dst}")

    print(f"\nConcluído! {len(files)} imagens salvas em {dst_dir}")


if __name__ == "__main__":
    main()

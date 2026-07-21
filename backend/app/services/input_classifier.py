"""
输入类型分类器。

根据文件扩展名、PDF 文本长度等判断应使用文本模型还是视觉模型。
"""

# 纯文本文件类型
TEXT_FILE_TYPES = {
    ".txt",
    ".md",
}

# 图片文件类型 → 需要视觉模型
IMAGE_FILE_TYPES = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
}

# PDF 文本提取阈值
# 提取到的文本低于此字符数，视为扫描件，需要视觉模型
PDF_MIN_TEXT_LENGTH = 100


def classify_file(
    filename: str,
    pdf_text: str | None = None,
) -> tuple[bool, bool]:
    """
    分类输入文件，返回 (has_image, requires_vision)。

    Args:
        filename: 文件名（含扩展名）
        pdf_text: PDF 提取的文本内容（仅 PDF 需要）

    Returns:
        (has_image, requires_vision)
    """
    filename_lower = filename.lower()

    # 判断扩展名
    for ext in IMAGE_FILE_TYPES:
        if filename_lower.endswith(ext):
            return True, True

    # PDF: 根据可提取文本长度判断
    if filename_lower.endswith(".pdf"):
        if pdf_text is not None:
            text_length = len(pdf_text.strip())
            if text_length < PDF_MIN_TEXT_LENGTH:
                # 可能是扫描件，需要视觉
                print(
                    f"[Input Classifier] PDF text length ({text_length}) < "
                    f"threshold ({PDF_MIN_TEXT_LENGTH}), routing to vision model"
                )
                return True, True
        # 可正常提取文本的 PDF
        return False, False

    # 文本或其他文件
    return False, False


def is_image_file(filename: str) -> bool:
    """判断是否为图片文件。"""
    filename_lower = filename.lower()
    return any(filename_lower.endswith(ext) for ext in IMAGE_FILE_TYPES)

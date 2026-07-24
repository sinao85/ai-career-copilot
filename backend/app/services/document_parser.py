import logging

from fastapi import UploadFile
from pypdf import PdfReader
from pypdf.errors import PdfReadError
from io import BytesIO

logger = logging.getLogger(__name__)

MAX_PAGES = 10


async def extract_text(file: UploadFile) -> str:
    """Parse PDF content from uploaded file entirely in memory using BytesIO.

    No temporary files are created on disk — all parsing happens in memory
    for privacy and reliability.
    """
    content = await file.read()
    logger.info("PDF file read into memory: %s (%d bytes)", file.filename, len(content))

    pdf_stream = BytesIO(content)

    try:
        reader = PdfReader(pdf_stream)
    except PdfReadError:
        raise ValueError("无法读取 PDF 文件，文件可能已损坏。")
    except Exception:
        raise ValueError("无法解析 PDF 文件，请确认文件格式正确。")

    # Encrypted PDFs typically have empty metadata and no extractable text;
    # pypdf also sets `is_encrypted` flag when the file has encryption.
    if reader.is_encrypted:
        raise ValueError("PDF 文件已加密，请提供未加密的简历文件。")

    page_count = len(reader.pages)
    logger.info("PDF parsed: %d pages", page_count)

    if page_count > MAX_PAGES:
        raise ValueError(
            f"PDF 文件页数过多（{page_count} 页），简历文件请控制在 {MAX_PAGES} 页以内。"
        )

    text_parts: list[str] = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text_parts.append(page_text)

    result = "".join(text_parts)
    logger.info("PDF text extracted: %d characters", len(result))

    return result

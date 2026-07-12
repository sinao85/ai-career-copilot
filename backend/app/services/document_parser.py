from fastapi import UploadFile
from pypdf import PdfReader


async def extract_text(file: UploadFile):

    print("1. 开始读取:", file.filename)

    content = await file.read()

    print("2. 文件大小:", len(content))

    with open("temp.pdf", "wb") as f:
        f.write(content)

    print("3. 开始PDF解析")

    reader = PdfReader("temp.pdf")

    print("4. PDF页数:", len(reader.pages))

    text = ""

    for page in reader.pages:
        text += page.extract_text() or ""

    print("5. 文本长度:", len(text))

    return text
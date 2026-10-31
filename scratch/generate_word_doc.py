import re
import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def add_callout_box(doc, text, title="NOTE"):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, "F8FAFC")
    set_cell_margins(cell, top=140, bottom=140, left=200, right=200)
    
    # Left border only (accent line)
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(
        f'<w:tcBorders {nsdecls("w")}>'
        f'<w:left w:val="single" w:sz="24" w:space="0" w:color="AB526B"/>'
        f'<w:top w:val="none"/>'
        f'<w:right w:val="none"/>'
        f'<w:bottom w:val="none"/>'
        f'</w:tcBorders>'
    )
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    r_title = p.add_run(f"[{title}] ")
    r_title.bold = True
    r_title.font.name = "Segoe UI"
    r_title.font.size = Pt(9.5)
    r_title.font.color.rgb = RGBColor(171, 82, 107)
    
    r_text = p.add_run(text)
    r_text.font.name = "Segoe UI"
    r_text.font.size = Pt(9.5)
    r_text.font.color.rgb = RGBColor(51, 65, 85)
    
    doc.add_paragraph().paragraph_format.space_after = Pt(4)

def clean_inline_markdown(text):
    # Strip file links: [text](url) -> text
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    return text

def add_formatted_paragraph(doc, text, style='Normal', space_after=4, bullet=False):
    p = doc.add_paragraph(style='List Bullet' if bullet else style)
    p.paragraph_format.space_before = Pt(1)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    
    # Strip file links [label](url) -> label
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    
    # Tokenize bold and code
    # Regex split while preserving delimiters
    tokens = re.split(r'(\*\*[^*]+\*\*|`[^`]+`)', text)
    for token in tokens:
        if not token:
            continue
        if token.startswith('**') and token.endswith('**'):
            run = p.add_run(token[2:-2])
            run.bold = True
            run.font.name = 'Segoe UI'
            run.font.size = Pt(10.5)
            run.font.color.rgb = RGBColor(30, 41, 59)
        elif token.startswith('`') and token.endswith('`'):
            run = p.add_run(token[1:-1])
            run.font.name = 'Consolas'
            run.font.size = Pt(9.5)
            run.font.color.rgb = RGBColor(171, 82, 107)
            # Subtle background
        else:
            run = p.add_run(token)
            run.font.name = 'Segoe UI'
            run.font.size = Pt(10.5)
            run.font.color.rgb = RGBColor(51, 65, 85)
    return p

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    md_path = os.path.join(root_dir, 'DOCUMENTATION.md')
    out_docx_path = os.path.join(root_dir, 'Algoverse_Documentation.docx')
    
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    doc = docx.Document()

    # Configure Margins (0.8 inches all around)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # ================= COVER / TITLE =================
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(24)
    title_p.paragraph_format.space_after = Pt(6)
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_badge = title_p.add_run("SYSTEM ARCHITECTURE & TECHNICAL MANUAL\n")
    r_badge.font.name = "Segoe UI"
    r_badge.font.size = Pt(11)
    r_badge.font.bold = True
    r_badge.font.color.rgb = RGBColor(171, 82, 107)

    r_title = title_p.add_run("ALGOVERSE (CODE NOVA)")
    r_title.font.name = "Segoe UI"
    r_title.font.size = Pt(28)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(17, 24, 39)

    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    sub_p.paragraph_format.space_after = Pt(18)
    r_sub = sub_p.add_run("Interactive 3D Visualizer, Code Studio, PvP Coding Duels & Assessment Engine")
    r_sub.font.name = "Segoe UI"
    r_sub.font.size = Pt(13)
    r_sub.font.color.rgb = RGBColor(100, 116, 139)

    meta_tbl = doc.add_table(rows=1, cols=3)
    meta_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    for idx, (lbl, val) in enumerate([("Version", "1.0.0 Production"), ("Stack", "React 19 • Express 5 • Socket.io"), ("Engine", "Three.js • JDoodle • Gemini 2.0")]):
        cell = meta_tbl.cell(0, idx)
        set_cell_background(cell, "F1F5F9")
        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r1 = p.add_run(lbl + "\n")
        r1.font.name = "Segoe UI"
        r1.font.size = Pt(8.5)
        r1.font.color.rgb = RGBColor(100, 116, 139)
        r2 = p.add_run(val)
        r2.font.name = "Segoe UI"
        r2.font.size = Pt(9.5)
        r2.font.bold = True
        r2.font.color.rgb = RGBColor(30, 41, 59)

    doc.add_paragraph().paragraph_format.space_after = Pt(20)

    # Process Markdown lines
    lines = content.split('\n')
    i = 0
    in_code_block = False
    code_lang = ""
    code_lines = []

    in_table = False
    table_rows = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        # Handle code blocks
        if stripped.startswith('```'):
            if not in_code_block:
                in_code_block = True
                code_lang = stripped[3:].strip()
                code_lines = []
                i += 1
                continue
            else:
                in_code_block = False
                # Render code block
                tbl = doc.add_table(rows=1, cols=1)
                tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                cell = tbl.cell(0, 0)
                set_cell_background(cell, "1E1E2E")
                set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
                p = cell.paragraphs[0]
                p.paragraph_format.space_before = Pt(2)
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.line_spacing = 1.05
                
                # Language tag
                if code_lang:
                    r_lang = p.add_run(f"// {code_lang.upper()}\n")
                    r_lang.font.name = "Consolas"
                    r_lang.font.size = Pt(8.5)
                    r_lang.font.color.rgb = RGBColor(148, 163, 184)
                
                code_text = "\n".join(code_lines)
                r_code = p.add_run(code_text)
                r_code.font.name = "Consolas"
                r_code.font.size = Pt(8.5)
                r_code.font.color.rgb = RGBColor(226, 232, 240)
                
                doc.add_paragraph().paragraph_format.space_after = Pt(4)
                i += 1
                continue

        if in_code_block:
            code_lines.append(line)
            i += 1
            continue

        # Handle tables
        if stripped.startswith('|') and stripped.endswith('|'):
            # Table separator row check (e.g. |:---|:---|)
            if re.match(r'^\|[\s\:\-]+(?:\|[\s\:\-]+)*\|$', stripped):
                i += 1
                continue
            cols = [c.strip() for c in stripped[1:-1].split('|')]
            table_rows.append(cols)
            # Peek next line to see if table continues
            if i + 1 < len(lines) and lines[i+1].strip().startswith('|'):
                i += 1
                continue
            else:
                # Render table
                if table_rows:
                    num_rows = len(table_rows)
                    num_cols = max(len(r) for r in table_rows)
                    tbl = doc.add_table(rows=num_rows, cols=num_cols)
                    tbl.style = 'Table Grid'
                    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
                    
                    for r_idx, row_data in enumerate(table_rows):
                        is_header = (r_idx == 0)
                        for c_idx in range(num_cols):
                            cell = tbl.cell(r_idx, c_idx)
                            val = row_data[c_idx] if c_idx < len(row_data) else ""
                            val = clean_inline_markdown(val)
                            
                            set_cell_background(cell, "331921" if is_header else ("F8FAFC" if r_idx % 2 == 1 else "FFFFFF"))
                            set_cell_margins(cell, top=70, bottom=70, left=90, right=90)
                            cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                            
                            p = cell.paragraphs[0]
                            p.paragraph_format.space_before = Pt(1)
                            p.paragraph_format.space_after = Pt(1)
                            p.paragraph_format.line_spacing = 1.1
                            run = p.add_run(val)
                            run.font.name = "Segoe UI"
                            run.font.size = Pt(8.5 if not is_header else 9)
                            if is_header:
                                run.bold = True
                                run.font.color.rgb = RGBColor(244, 235, 195)
                            else:
                                run.font.color.rgb = RGBColor(51, 65, 85)
                    
                    doc.add_paragraph().paragraph_format.space_after = Pt(6)
                    table_rows = []
                i += 1
                continue

        # Skip horizontal rules
        if stripped in ['---', '***', '___']:
            i += 1
            continue

        # Headings
        if stripped.startswith('# ') and not stripped.startswith('## '):
            # Skip the main title since we already rendered the cover
            i += 1
            continue

        if stripped.startswith('## '):
            heading_text = clean_inline_markdown(stripped[3:].strip())
            h = doc.add_heading(level=1)
            h.paragraph_format.space_before = Pt(18)
            h.paragraph_format.space_after = Pt(6)
            h.paragraph_format.keep_with_next = True
            run = h.add_run(heading_text)
            run.font.name = "Segoe UI"
            run.font.size = Pt(16)
            run.font.bold = True
            run.font.color.rgb = RGBColor(171, 82, 107) # #AB526B
            i += 1
            continue

        if stripped.startswith('### '):
            heading_text = clean_inline_markdown(stripped[4:].strip())
            h = doc.add_heading(level=2)
            h.paragraph_format.space_before = Pt(12)
            h.paragraph_format.space_after = Pt(4)
            h.paragraph_format.keep_with_next = True
            run = h.add_run(heading_text)
            run.font.name = "Segoe UI"
            run.font.size = Pt(13)
            run.font.bold = True
            run.font.color.rgb = RGBColor(30, 41, 59)
            i += 1
            continue

        if stripped.startswith('#### '):
            heading_text = clean_inline_markdown(stripped[5:].strip())
            h = doc.add_heading(level=3)
            h.paragraph_format.space_before = Pt(8)
            h.paragraph_format.space_after = Pt(3)
            h.paragraph_format.keep_with_next = True
            run = h.add_run(heading_text)
            run.font.name = "Segoe UI"
            run.font.size = Pt(11)
            run.font.bold = True
            run.font.color.rgb = RGBColor(71, 85, 105)
            i += 1
            continue

        # Bullet list items
        if stripped.startswith('- ') or stripped.startswith('* '):
            item_text = stripped[2:].strip()
            add_formatted_paragraph(doc, item_text, bullet=True)
            i += 1
            continue

        # Numbered list items
        m_num = re.match(r'^\d+\.\s+(.*)$', stripped)
        if m_num:
            item_text = m_num.group(1).strip()
            add_formatted_paragraph(doc, item_text, bullet=True)
            i += 1
            continue

        # Empty lines
        if not stripped:
            i += 1
            continue

        # Standard paragraph
        add_formatted_paragraph(doc, stripped)
        i += 1

    doc.save(out_docx_path)
    print(f"Successfully generated Word document: {out_docx_path}")

if __name__ == '__main__':
    main()

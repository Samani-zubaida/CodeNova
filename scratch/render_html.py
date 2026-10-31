import os
import re
from markdown_it import MarkdownIt

def build_html():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    md_path = os.path.join(root_dir, 'DOCUMENTATION.md')
    html_out = os.path.join(root_dir, 'scratch', 'doc.html')

    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to handle mermaid code blocks so mermaid.js can render them
    # MarkdownIt converts ```mermaid ... ``` into <pre><code class="language-mermaid">...</code></pre>
    # We will convert those to <pre class="mermaid">...</pre>
    
    md = MarkdownIt('commonmark').enable('table')
    raw_html = md.render(content)

    # Convert language-mermaid blocks to <pre class="mermaid">...</pre>
    raw_html = re.sub(
        r'<pre><code class="language-mermaid">(.*?)</code></pre>',
        r'<pre class="mermaid">\1</pre>',
        raw_html,
        flags=re.DOTALL
    )

    # Style blockquotes / alerts
    raw_html = re.sub(r'<blockquote>\s*<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*', r'<blockquote class="alert alert-\1"><p>', raw_html)

    # HTML Template
    template = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Algoverse (Code Nova) Technical Documentation</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

    @page {{
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
    }}

    * {{
      box-sizing: border-box;
    }}

    body {{
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.6;
      color: #334155;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }}

    /* Cover Page */
    .cover-page {{
      page-break-after: always;
      min-height: 85vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 40px 20px;
    }}

    .cover-badge {{
      display: inline-block;
      padding: 6px 16px;
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #AB526B;
      background: rgba(171, 82, 107, 0.1);
      border: 1px solid rgba(171, 82, 107, 0.25);
      border-radius: 999px;
      margin-bottom: 24px;
    }}

    .cover-title {{
      font-size: 32pt;
      font-weight: 800;
      letter-spacing: -1px;
      color: #0F172A;
      margin: 0 0 16px 0;
      line-height: 1.15;
    }}

    .cover-subtitle {{
      font-size: 13pt;
      color: #64748B;
      max-width: 650px;
      margin: 0 auto 36px auto;
      line-height: 1.5;
    }}

    .cover-meta {{
      display: flex;
      gap: 16px;
      margin-top: 20px;
      justify-content: center;
    }}

    .meta-card {{
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 14px 20px;
      text-align: center;
      min-width: 140px;
    }}

    .meta-card .label {{
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94A3B8;
      font-weight: 600;
      margin-bottom: 4px;
    }}

    .meta-card .val {{
      font-size: 10pt;
      color: #1E293B;
      font-weight: 700;
    }}

    /* Typography & Hierarchy */
    h1 {{
      font-size: 20pt;
      font-weight: 800;
      color: #0F172A;
      margin-top: 36px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid #F1F5F9;
      page-break-after: avoid;
    }}

    h2 {{
      font-size: 15pt;
      font-weight: 700;
      color: #AB526B;
      margin-top: 28px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1.5px solid #F8FAFC;
      page-break-after: avoid;
    }}

    h3 {{
      font-size: 12pt;
      font-weight: 700;
      color: #1E293B;
      margin-top: 20px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }}

    h4 {{
      font-size: 10.5pt;
      font-weight: 600;
      color: #475569;
      margin-top: 16px;
      margin-bottom: 6px;
      page-break-after: avoid;
    }}

    p {{
      margin: 0 0 10px 0;
    }}

    ul, ol {{
      margin: 0 0 12px 0;
      padding-left: 22px;
    }}

    li {{
      margin-bottom: 5px;
    }}

    li strong {{
      color: #1E293B;
    }}

    /* Code & Syntax */
    code {{
      font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
      font-size: 8.5pt;
      background: #F1F5F9;
      color: #AB526B;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #E2E8F0;
    }}

    pre {{
      background: #111827;
      border-radius: 8px;
      padding: 14px 16px;
      overflow-x: auto;
      margin: 12px 0 16px 0;
      border: 1px solid #1F2937;
      page-break-inside: avoid;
    }}

    pre code {{
      background: transparent;
      color: #F3F4F6;
      padding: 0;
      border: none;
      font-size: 8pt;
      line-height: 1.5;
    }}

    /* Tables */
    table {{
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0 20px 0;
      font-size: 8.5pt;
      page-break-inside: avoid;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #CBD5E1;
    }}

    th {{
      background: #331921;
      color: #F4EBC3;
      font-weight: 700;
      text-align: left;
      padding: 8px 12px;
      border-bottom: 2px solid #AB526B;
      letter-spacing: 0.3px;
    }}

    td {{
      padding: 8px 12px;
      border-bottom: 1px solid #E2E8F0;
      vertical-align: middle;
      color: #334155;
    }}

    tr:nth-child(even) td {{
      background: #F8FAFC;
    }}

    /* Links */
    a {{
      color: #AB526B;
      text-decoration: none;
      font-weight: 600;
    }}

    /* Mermaid diagrams container */
    pre.mermaid {{
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      margin: 16px 0;
      page-break-inside: avoid;
    }}

    /* Divider */
    hr {{
      border: none;
      border-top: 1px solid #E2E8F0;
      margin: 24px 0;
    }}

    /* Header/Footer Spacer */
    .page-break {{
      page-break-after: always;
    }}
  </style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <script>
    mermaid.initialize({{
      startOnLoad: true,
      theme: 'neutral',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      securityLevel: 'loose'
    }});
  </script>
</head>
<body>

  <!-- Cover Page -->
  <div class="cover-page">
    <div class="cover-badge">ENGINEERING & ARCHITECTURE MANUAL</div>
    <h1 class="cover-title">ALGOVERSE<br/><span style="color: #AB526B;">(CODE NOVA)</span></h1>
    <div class="cover-subtitle">
      Comprehensive Technical Architecture, Definition Specifications, Algorithm Visualizers, and Workflow Documentation
    </div>

    <div class="cover-meta">
      <div class="meta-card">
        <div class="label">Platform Version</div>
        <div class="val">1.0.0 Production</div>
      </div>
      <div class="meta-card">
        <div class="label">Core Framework</div>
        <div class="val">React 19 + Express 5</div>
      </div>
      <div class="meta-card">
        <div class="label">Graphics & Physics</div>
        <div class="val">Three.js / WebGL</div>
      </div>
      <div class="meta-card">
        <div class="label">Execution Engine</div>
        <div class="val">JDoodle + Gemini AI</div>
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <div class="content-body">
    {raw_html}
  </div>

</body>
</html>"""

    with open(html_out, 'w', encoding='utf-8') as f:
        f.write(template)

    print(f"Rendered intermediate HTML to: {html_out}")

if __name__ == '__main__':
    build_html()

"""Convert filled HTML to templates with placeholders - improved version."""
import re
from pathlib import Path

def convert_to_template(html: str) -> str:
    """Convert filled HTML to template with placeholders."""
    
    # Title in head
    html = re.sub(r'<title>[^<]+</title>', '<title>{{title}}</title>', html)
    
    # H1 title
    html = re.sub(r'(<h1[^>]*>)[^<]+(</h1>)', r'\1{{title}}\2', html)
    
    # Subtitle
    html = re.sub(r'(<p[^>]*class="subtitle"[^>]*>)[^<]+(</p>)', r'\1{{subtitle}}\2', html)
    html = re.sub(r'(<div[^>]*class="subtitle"[^>]*>)[^<]+(</div>)', r'\1{{subtitle}}\2', html)
    
    # Category and page number
    html = re.sub(r'(<span[^>]*class="category-label"[^>]*>)[^<]+(</span>)', r'\1{{category}}\2', html)
    html = re.sub(r'(<span[^>]*class="page-number"[^>]*>)[^<]+(</span>)', r'\1{{page_number}}\2', html)
    
    # Footer
    html = re.sub(r'(<div[^>]*class="footer-info"[^>]*>)[^<]+(</div>)', r'\1{{footer}}\2', html)
    
    # Section labels
    html = re.sub(r'(<h3[^>]*class="section-label"[^>]*>)[^<]+(</h3>)', r'\1{{section_label}}\2', html)
    
    # Quote
    html = re.sub(r'(<p[^>]*class="quote-text"[^>]*>)[^<]+(</p>)', r'\1{{quote_text}}\2', html)
    html = re.sub(r'(<div[^>]*class="quote-text"[^>]*>)[^<]+(</div>)', r'\1{{quote_text}}\2', html)
    html = re.sub(r'(<div[^>]*class="quote-author"[^>]*>)[^<]+(</div>)', r'\1{{quote_author}}\2', html)
    html = re.sub(r'(<div[^>]*class="quote-role"[^>]*>)[^<]+(</div>)', r'\1{{quote_role}}\2', html)
    html = re.sub(r'(<span[^>]*class="author-name"[^>]*>)[^<]+(</span>)', r'\1{{quote_author}}\2', html)
    html = re.sub(r'(<span[^>]*class="author-title"[^>]*>)[^<]+(</span>)', r'\1{{quote_role}}\2', html)
    
    # Description
    html = re.sub(r'(<p[^>]*class="description"[^>]*>)[^<]+(</p>)', r'\1{{description}}\2', html)
    
    # Department/author info
    html = re.sub(r'(<div[^>]*class="department"[^>]*>)[^<]+(</div>)', r'\1{{department}}\2', html)
    html = re.sub(r'(<div[^>]*class="date"[^>]*>)[^<]+(</div>)', r'\1{{date}}\2', html)
    
    # Image section placeholder
    html = re.sub(r'(<div[^>]*class="image-section"[^>]*>)\s*\[[^\]]+\]\s*(</div>)', r'\1{{image_placeholder}}\2', html)
    
    # Column titles and content
    html = re.sub(r'(<h2[^>]*class="column-title"[^>]*>)[^<]+(</h2>)', lambda m: m.group(1) + '{{column_title}}' + m.group(2), html, count=1)
    html = re.sub(r'(<h2[^>]*class="column-title"[^>]*>)[^<]+(</h2>)', lambda m: m.group(1) + '{{column_2_title}}' + m.group(2), html, count=1)
    
    # Generic h2 titles
    counter = [0]
    def replace_h2(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{heading_{counter[0]}}}}}{m.group(2)}'
    html = re.sub(r'(<h2[^>]*>)[^<]+(</h2>)', replace_h2, html)
    
    # Generic h3 titles (not section-label)
    counter = [0]
    def replace_h3(m):
        if 'section-label' in m.group(1):
            return m.group(0)
        counter[0] += 1
        return f'{m.group(1)}{{{{subheading_{counter[0]}}}}}{m.group(2)}'
    html = re.sub(r'(<h3[^>]*>)[^<]+(</h3>)', replace_h3, html)
    
    # Stat values and labels
    counter = [0]
    def replace_stat_value(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{stat_{counter[0]}_value}}}}{m.group(2)}'
    html = re.sub(r'(<div[^>]*class="stat-value"[^>]*>)[^<]+(</div>)', replace_stat_value, html)
    
    counter = [0]
    def replace_stat_label(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{stat_{counter[0]}_label}}}}{m.group(2)}'
    html = re.sub(r'(<div[^>]*class="stat-label"[^>]*>)[^<]+(</div>)', replace_stat_label, html)
    
    # Timeline items
    counter = [0]
    def replace_timeline_year(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{timeline_{counter[0]}_year}}}}{m.group(2)}'
    html = re.sub(r'(<div[^>]*class="timeline-year"[^>]*>)[^<]+(</div>)', replace_timeline_year, html)
    
    counter = [0]
    def replace_timeline_title(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{timeline_{counter[0]}_title}}}}{m.group(2)}'
    html = re.sub(r'(<h3[^>]*class="timeline-title"[^>]*>)[^<]+(</h3>)', replace_timeline_title, html)
    html = re.sub(r'(<div[^>]*class="timeline-title"[^>]*>)[^<]+(</div>)', replace_timeline_title, html)
    
    counter = [0]
    def replace_timeline_desc(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{timeline_{counter[0]}_desc}}}}{m.group(2)}'
    html = re.sub(r'(<p[^>]*class="timeline-desc"[^>]*>)[^<]+(</p>)', replace_timeline_desc, html)
    html = re.sub(r'(<div[^>]*class="timeline-desc"[^>]*>)[^<]+(</div>)', replace_timeline_desc, html)
    
    # Task names
    counter = [0]
    def replace_task_name(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{task_{counter[0]}_name}}}}{m.group(2)}'
    html = re.sub(r'(<div[^>]*class="task-name"[^>]*>)[^<]+(</div>)', replace_task_name, html)
    
    counter = [0]
    def replace_task_owner(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{task_{counter[0]}_owner}}}}{m.group(2)}'
    html = re.sub(r'(<div[^>]*class="task-owner"[^>]*>)[^<]+(</div>)', replace_task_owner, html)
    
    # Gantt bar
    counter = [0]
    def replace_gantt_bar(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{gantt_{counter[0]}_status}}}}{m.group(2)}'
    html = re.sub(r'(<div[^>]*class="gantt-bar"[^>]*>)[^<]+(</div>)', replace_gantt_bar, html)
    
    # Table headers
    counter = [0]
    def replace_th(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{th_{counter[0]}}}}}{m.group(2)}'
    html = re.sub(r'(<th[^>]*>)[^<]+(</th>)', replace_th, html)
    
    # Generic bullet items
    counter = [0]
    def replace_bullet(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{bullet_{counter[0]}}}}}{m.group(2)}'
    html = re.sub(r'(<span class="bullet-dot"></span><span>)[^<]+(</span>)', replace_bullet, html)
    
    # Feature items
    counter = [0]
    def replace_feature(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{feature_{counter[0]}}}}}{m.group(2)}'
    html = re.sub(r'(<span[^>]*class="feature-text"[^>]*>)[^<]+(</span>)', replace_feature, html)
    
    # Card icons
    counter = [0]
    def replace_card_icon(m):
        counter[0] += 1
        return f'{m.group(1)}{{{{card_{counter[0]}_icon}}}}{m.group(2)}'
    html = re.sub(r'(<div[^>]*class="card-icon"[^>]*>)[^<]+(</div>)', replace_card_icon, html)
    
    # Remaining paragraphs with content
    counter = [0]
    def replace_p(m):
        # Skip if already has placeholder
        if '{{' in m.group(0):
            return m.group(0)
        counter[0] += 1
        return f'{m.group(1)}{{{{paragraph_{counter[0]}}}}}{m.group(2)}'
    html = re.sub(r'(<p[^>]*>)([^<{]+)(</p>)', replace_p, html)
    
    # Remaining divs with direct text
    counter = [0]
    def replace_div_text(m):
        if '{{' in m.group(0) or not m.group(2).strip():
            return m.group(0)
        # Check if it's just Chinese text
        if re.search(r'[\u4e00-\u9fff]', m.group(2)):
            counter[0] += 1
            return f'{m.group(1)}{{{{text_{counter[0]}}}}}{m.group(3)}'
        return m.group(0)
    # This is tricky, skip for now
    
    return html


def main():
    # Use script directory as base
    script_dir = Path(__file__).parent
    base = script_dir / 'layouts'
    outputs = script_dir / 'outputs'
    
    # Restore classic from all-layouts
    classic_dir = base / 'classic'
    for f in (outputs / 'all-layouts').glob('*.html'):
        name = f.name.split('-', 1)[1] if '-' in f.name else f.name
        dest = classic_dir / name
        dest.write_text(f.read_text())
    
    # Restore modern from all-layouts-v2
    modern_dir = base / 'modern'
    for f in (outputs / 'all-layouts-v2').glob('*.html'):
        name = f.name.split('-', 1)[1] if '-' in f.name else f.name
        # Rename 2-column-footer to 2-column
        if name == 'column-footer.html':
            name = '2-column.html'
        dest = modern_dir / name
        dest.write_text(f.read_text())
    
    print("Restored files from outputs")
    
    # Now convert
    for layout_dir in base.iterdir():
        if not layout_dir.is_dir():
            continue
        print(f"Converting {layout_dir.name}/")
        
        for html_file in layout_dir.glob('*.html'):
            print(f"  - {html_file.name}")
            content = html_file.read_text(encoding='utf-8')
            converted = convert_to_template(content)
            html_file.write_text(converted, encoding='utf-8')


if __name__ == '__main__':
    main()

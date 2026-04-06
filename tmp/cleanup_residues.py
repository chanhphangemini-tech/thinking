import re
import os

def cleanup_residues(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    filename = os.path.basename(filepath)
    
    if filename == "systems.html":
        # Remove leftover constraint lists and their closing div
        new_content = re.sub(r'<ul class="constraint-list">.*?</ul>\s*</div>', '', new_content, flags=re.DOTALL)
        # Also clean up any double newlines caused by removals
        new_content = re.sub(r'\n\s*\n\s*\n', '\n\n', new_content)
        
    elif filename == "pitching.html":
        # Remove leftover kpi tables and their closing div
        new_content = re.sub(r'<table class="kpi-tbl">.*?</table>\s*</div>', '', new_content, flags=re.DOTALL)
        # Remove leftover constraint lists and their closing div
        new_content = re.sub(r'<ul class="cst-list">.*?</ul>\s*</div>', '', new_content, flags=re.DOTALL)
        new_content = re.sub(r'\n\s*\n\s*\n', '\n\n', new_content)
        
    elif filename == "thinkingai.html":
        # Remove leftover kpi tables (they didn't have a wrap div start tag in my previous run, but had a header)
        new_content = re.sub(r'<table class="kpi-tbl">.*?</table>', '', new_content, flags=re.DOTALL)
        # Remove leftover constraint lists and their closing div
        new_content = re.sub(r'<ul class="cst-list">.*?</ul>\s*</div>', '', new_content, flags=re.DOTALL)
        new_content = re.sub(r'\n\s*\n\s*\n', '\n\n', new_content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Cleaned up residues in {filepath}")

cleanup_residues(r'G:\thinking\systems.html')
cleanup_residues(r'G:\thinking\pitching.html')
cleanup_residues(r'G:\thinking\thinkingai.html')

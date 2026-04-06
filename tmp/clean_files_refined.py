import re
import os

def remove_nested_div(content, class_name):
    # This regex looks for <div class="class_name"> and matches everything 
    # until the closing </div> that matches the opening one.
    # Since we know the structure has exactly one level of nesting (a title div),
    # we can match until the second </div> or use a more specific pattern.
    
    # Pattern for systems.html: <div class="constraint-box"> ... </div> (contains one inner div)
    if class_name == "constraint-box":
        pattern = r'<div class="constraint-box">.*?<div.*?>.*?</div>.*?</div>'
        return re.sub(pattern, '', content, flags=re.DOTALL)
    
    # Pattern for pitching.html and thinkingai.html: <div class="constraint"> ... </div> (contains one inner div)
    if class_name == "constraint":
        pattern = r'<div class="constraint">.*?<div.*?>.*?</div>.*?</div>'
        return re.sub(pattern, '', content, flags=re.DOTALL)

    # Pattern for kpi-wrap: <div class="kpi-wrap"> ... </div> (no inner divs, but contains a table)
    if class_name == "kpi-wrap":
        pattern = r'<div class="kpi-wrap">.*?</div>'
        return re.sub(pattern, '', content, flags=re.DOTALL)
        
    return content

def remove_blocks_refined(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    
    filename = os.path.basename(filepath)
    
    if filename == "systems.html":
        # Remove KPI headers and tables
        new_content = re.sub(r'<div class="phase-section-title">// KPI Xác Nhận Pass Giai Đoạn \d+</div>', '', new_content, flags=re.DOTALL)
        new_content = re.sub(r'<table class="kpi-table">.*?</table>', '', new_content, flags=re.DOTALL)
        # Remove Constraint boxes (nested)
        new_content = remove_nested_div(new_content, "constraint-box")
        
    elif filename == "pitching.html":
        # Remove KPI wraps
        new_content = remove_nested_div(new_content, "kpi-wrap")
        # Remove Constraint boxes (nested)
        new_content = remove_nested_div(new_content, "constraint")
        
    elif filename == "thinkingai.html":
        # Remove KPI headers and tables
        new_content = re.sub(r'<div class="col-hd" id="kpi">.*?</div>', '', new_content, flags=re.DOTALL)
        new_content = re.sub(r'<table class="kpi-tbl">.*?</table>', '', new_content, flags=re.DOTALL)
        # Remove Constraint boxes (nested)
        new_content = remove_nested_div(new_content, "constraint")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Refined processing for {filepath}")

remove_blocks_refined(r'G:\thinking\systems.html')
remove_blocks_refined(r'G:\thinking\pitching.html')
remove_blocks_refined(r'G:\thinking\thinkingai.html')

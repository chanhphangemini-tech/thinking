const fs = require('fs');

const files = [
    { name: 'systems.html', logo: '.logo', docs: true },
    { name: 'pitching.html', logo: '.logo', docs: true },
    { name: 'thinkingai.html', logo: '.logo', docs: true },
    { name: 'index.html', logo: 'h1', docs: false },
    { name: 'Profile.html', logo: '.hdr-logo', docs: false }
];

files.forEach(f => {
    const path = `g:/thinking/${f.name}`;
    let content = fs.readFileSync(path, 'utf8');

    // 1. Unified Mobile Nav Trigger Styling
    const unifiedNavTrigger = `
  /* UNIFIED MOBILE NAV FIX */
  .nav-trigger {
    position: fixed !important;
    top: 18px !important;
    left: 20px !important;
    z-index: 1100 !important;
    display: none;
  }
  @media (max-width: 900px) {
    .nav-trigger { display: block !important; }
    ${f.logo} { margin-left: 60px !important; }
  }
  /* Hide hamburger when docs/drawer is open */
  .docs-open .nav-trigger, .nav-active .nav-trigger { display: none !important; }
`;

    // Remove any previous partial fixes to avoid duplication
    content = content.replace(/\/\* UNIFIED MOBILE NAV FIX \*\/[\s\S]*?\n\n/g, ''); 
    // This is bit risky if it doesn't match exactly. Let's just append it to style tag for now but handle duplicates.
    
    if (!content.includes('/* UNIFIED MOBILE NAV FIX */')) {
        content = content.replace('</style>', unifiedNavTrigger + '\n</style>');
    } else {
        // Update existing block
        const regex = /\/\* UNIFIED MOBILE NAV FIX \*\/[\s\S]*?(?=\n\n|\<\/style\>)/;
        content = content.replace(regex, unifiedNavTrigger.trim());
    }

    // 2. Ensure openDocs/closeDocs handles the class (for modules)
    if (f.docs) {
        if (content.includes('function openDocs() {') && !content.includes('document.body.classList.add(\'docs-open\')')) {
            content = content.replace('function openDocs() {', 'function openDocs() {\n  document.body.classList.add(\'docs-open\');');
        }
        if (content.includes('function closeDocs() {') && !content.includes('document.body.classList.remove(\'docs-open\')')) {
            content = content.replace('function closeDocs() {', 'function closeDocs() {\n  document.body.classList.remove(\'docs-open\');');
        }
    }

    // 3. For index.html specifically, we don't have a docs drawer but we have a nav-overlay
    // The unified style already handles .nav-active .nav-trigger { display: none !important; }

    fs.writeFileSync(path, content, 'utf8');
    console.log(`Successfully applied unified fix to ${f.name}`);
});

#!/usr/bin/env python3
"""À exécuter dans une copie locale du dépôt zou_mai (python APPLIQUER_LOGO_TOUTES_PAGES.py).
Ajoute la signature dans toutes les pages HTML, y compris les pages hors Ressources.
Sauvegarder le dépôt avant utilisation. Exclut les fichiers du présent kit déjà modifiés.
"""
from pathlib import Path
import re
root=Path(__file__).resolve().parent
for page in root.rglob('*.html'):
    if '.git' in page.parts or page.name.endswith('.bak.html') or page.name in ('index.html','ressources.html') and page.parent==root or page.as_posix().endswith('ressources/anglais/index.html'):
        continue
    s=page.read_text(encoding='utf-8')
    if '<body' not in s.lower() or 'zm-corner-logo' in s or 'zoumai-brand.css' in s:
        continue
    prefix='../'*len(page.relative_to(root).parts[:-1])
    s=s.replace('</head>',f'<link rel="stylesheet" href="{prefix}zoumai-brand.css"></head>',1)
    badge=f'<a class="zm-corner-logo" href="{prefix}index.html" aria-label="Accueil Zou Maï"><img src="{prefix}images/logo-zou-mai-sensei.png" alt="Logo Sensei Zou_Maï"></a>'
    s=re.sub(r'(<body\b[^>]*>)',lambda m:m.group(1)+badge,s,count=1,flags=re.I)
    page.write_text(s,encoding='utf-8')
    print('Logo ajouté :',page.relative_to(root))

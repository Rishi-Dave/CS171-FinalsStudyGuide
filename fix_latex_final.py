#!/usr/bin/env python3
"""
Final comprehensive LaTeX fixer for CS171 JSON files.
"""

import json
import re
from pathlib import Path

def fix_latex_comprehensive(text):
    """Comprehensively fix all LaTeX and formatting issues."""
    if not isinstance(text, str):
        return text

    result = text

    # Fix concatenated words (common issue from previous processing)
    concatenated_fixes = {
        'isoftenmodeledusingaGaussiandistributioncalculatedfromthemean':
            'is often modeled using a Gaussian distribution calculated from the mean',
        'isoftenmodeledusingaGaussiandistribution': 'is often modeled using a Gaussian distribution',
    }
    for bad, good in concatenated_fixes.items():
        result = result.replace(bad, good)

    # Greek letters with backslashes
    greek = {
        r'\\mu': 'μ',
        r'\\sigma': 'σ',
        r'\\theta': 'θ',
        r'\\lambda': 'λ',
        r'\\alpha': 'α',
        r'\\beta': 'β',
        r'\\epsilon': 'ε',
        r'\\delta': 'δ',
        r'\\Delta': 'Δ',
        r'\\gamma': 'γ',
        r'\\Gamma': 'Γ',
        r'\\pi': 'π',
        r'\\rho': 'ρ',
        r'\\tau': 'τ',
        r'\\omega': 'ω',
        r'\\Omega': 'Ω',
        r'\\nabla': '∇',
        r'\\Sigma': 'Σ',
        r'\\phi': 'φ',
        r'\\Phi': 'Φ',
        r'\\psi': 'ψ',
        r'\\Psi': 'Ψ',
    }

    for latex, unicode_char in greek.items():
        result = result.replace(latex, unicode_char)

    # Math symbols
    math_symbols = {
        r'\\cdot': '·',
        r'\\times': '×',
        r'\\leq': '≤',
        r'\\geq': '≥',
        r'\\neq': '≠',
        r'\\approx': '≈',
        r'\\infty': '∞',
        r'\\partial': '∂',
        r'\\dots': '...',
        r'\\ldots': '...',
        r'\\cdots': '...',
        r'\\prod': 'Π',
        r'\\sum': 'Σ',
        r'\\int': '∫',
        r'\\sqrt': '√',
        r'\\pm': '±',
        r'\\mp': '∓',
        r'\\div': '÷',
        r'\\equiv': '≡',
        r'\\sim': '~',
        r'\\simeq': '≃',
        r'\\cong': '≅',
        r'\\propto': '∝',
        r'\\forall': '∀',
        r'\\exists': '∃',
        r'\\in': '∈',
        r'\\notin': '∉',
        r'\\subset': '⊂',
        r'\\supset': '⊃',
        r'\\subseteq': '⊆',
        r'\\supseteq': '⊇',
        r'\\cup': '∪',
        r'\\cap': '∩',
        r'\\emptyset': '∅',
        r'\\neg': '¬',
        r'\\wedge': '∧',
        r'\\vee': '∨',
        r'\\Rightarrow': '⇒',
        r'\\Leftarrow': '⇐',
        r'\\Leftrightarrow': '⇔',
        r'\\rightarrow': '→',
        r'\\leftarrow': '←',
        r'\\leftrightarrow': '↔',
    }

    for latex, symbol in math_symbols.items():
        result = result.replace(latex, symbol)

    # Math functions
    math_funcs = {
        r'\\log': 'log',
        r'\\ln': 'ln',
        r'\\exp': 'exp',
        r'\\sin': 'sin',
        r'\\cos': 'cos',
        r'\\tan': 'tan',
        r'\\max': 'max',
        r'\\min': 'min',
        r'\\sup': 'sup',
        r'\\inf': 'inf',
        r'\\lim': 'lim',
        r'\\arg\\max': 'argmax',
        r'\\arg\\min': 'argmin',
    }

    for latex, func in math_funcs.items():
        result = result.replace(latex, func)

    # Remove hat, tilde, bar, etc
    result = re.sub(r'\\hat\{([^}]+)\}', r'^\1', result)
    result = re.sub(r'\\tilde\{([^}]+)\}', r'~\1', result)
    result = re.sub(r'\\bar\{([^}]+)\}', r'\1̄', result)

    # Clean up $...$ patterns
    # Complex patterns first
    result = re.sub(r'\$P\(([^)]+)\|([^)]+)\)\$', r'P(\1|\2)', result)
    result = re.sub(r'\$E\[([^\]]+)\]\$', r'E[\1]', result)
    result = re.sub(r'\$P\(([^)]+)\)\$', r'P(\1)', result)

    # Simple variable names in $
    result = re.sub(r'\$([A-Za-z_][A-Za-z0-9_]*)\$', r'\1', result)

    # Remove remaining $
    result = result.replace('$', '')

    # Fix subscripts with spacing issues
    subscript_map = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'n': 'ₙ', 'm': 'ₘ',
        'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ', 'p': 'ₚ', 's': 'ₛ',
        't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'r': 'ᵣ'
    }

    # Fix patterns like "X_k", "C_i", "θ_j"
    result = re.sub(r'([A-Za-zα-ωΑ-Ω])_([0-9a-z]+)',
                    lambda m: m.group(1) + ''.join(subscript_map.get(c, '_'+c) for c in m.group(2)),
                    result)

    # Fix patterns with spaces like "w i ​" (with zero-width chars)
    result = re.sub(r'([A-Za-zα-ωΑ-Ω])\s+([0-9ijknmaexpop])\s*​\s*',
                    lambda m: m.group(1) + subscript_map.get(m.group(2), '_' + m.group(2)), result)

    # Fix uppercase with subscripts (e.g., "C i", "Q 3")
    result = re.sub(r'([A-Z])\s+([0-9ijkn])\s*​\s*',
                    lambda m: m.group(1) + subscript_map.get(m.group(2), m.group(2)), result)

    # Fix L-norms
    result = re.sub(r'L\s*_?\s*([0-9])\s*​?\s*', lambda m: 'L' + subscript_map.get(m.group(1), m.group(1)), result)
    result = re.sub(r'L\s*_?p\s*​?\s*', 'Lₚ', result)
    result = result.replace('Lmax', 'L∞')
    result = result.replace('L max', 'L∞')

    # Superscripts
    superscript_map = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        'i': 'ⁱ', 'n': 'ⁿ', '-': '⁻', '+': '⁺', 'T': 'ᵀ'
    }

    # Fix ^{...} patterns
    result = re.sub(r'\^?\{([0-9in+-])\}', lambda m: superscript_map.get(m.group(1), '^'+m.group(1)), result)
    result = re.sub(r'\^([0-9in+-])', lambda m: superscript_map.get(m.group(1), '^'+m.group(1)), result)

    # Fix " 2" patterns for squared (when oddly spaced)
    result = re.sub(r'([A-Za-zα-ωΑ-Ω])\s+2\s*​?\s*(?![0-9])', r'\1²', result)

    # Parenthetical superscripts
    result = result.replace('⁽i⁾', '⁽ⁱ⁾')
    result = result.replace('⁽j⁾', '⁽ʲ⁾')
    result = result.replace('⁽k⁾', '⁽ᵏ⁾')

    # Clean up zero-width and special characters
    result = result.replace('​', '')  # Zero-width space
    result = result.replace('\u200b', '')  # Another zero-width space
    result = result.replace('\u200c', '')  # Zero-width non-joiner
    result = result.replace('\u200d', '')  # Zero-width joiner
    result = result.replace('\ufeff', '')  # Zero-width no-break space

    # Clean up extra spaces
    result = re.sub(r'\s+', ' ', result)

    # Fix specific notation issues
    result = result.replace('P(X|Y)', 'P(X|Y)')  # Ensure clean
    result = result.replace('P(Y|X)', 'P(Y|X)')
    result = result.replace(' × ', ' × ')  # Ensure spacing

    return result.strip()

def fix_json_file(filepath):
    """Fix all issues in a JSON file."""
    print(f"Processing: {filepath.name}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        fixes_count = 0

        if 'questions' in data:
            for question in data['questions']:
                for field in ['question', 'reasoning', 'answer']:
                    if field in question and isinstance(question[field], str):
                        original = question[field]
                        fixed = fix_latex_comprehensive(original)
                        if fixed != original:
                            question[field] = fixed
                            fixes_count += 1

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"  ✓ Fixed {fixes_count} instances")
        return fixes_count

    except Exception as e:
        print(f"  ✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return 0

def main():
    """Process all CS171 files."""
    base_dir = Path('/Users/rishidave/Documents/CS171-FinalsStudyGuide/js')

    files = [
        # True/False
        'truefalse_topic1_intro_logistics.json',
        'truefalse_topic2_statistics_viz.json',
        'truefalse_topic3_preprocessing.json',
        'truefalse_topic4_supervised1.json',
        'truefalse_topic5_supervised2.json',
        'truefalse_topic6_supervised_advanced.json',
        'truefalse_topic7_unsupervised1.json',
        'truefalse_topic8_density_eval.json',
        'truefalse_topic9_pattern_mining.json',
        # Short Answer
        'shortanswer_topic1_intro_data_preprocessing.json',
        'shortanswer_topic2_supervised_learning.json',
        'shortanswer_topic3_unsupervised_learning.json',
        'shortanswer_topic4_frequent_patterns.json',
    ]

    total_fixes = 0

    print("\n" + "="*60)
    print("CS171 Final LaTeX Fixer")
    print("="*60 + "\n")

    for filename in files:
        filepath = base_dir / filename
        if filepath.exists():
            total_fixes += fix_json_file(filepath)

    print("\n" + "="*60)
    print(f"Total fixes: {total_fixes}")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()

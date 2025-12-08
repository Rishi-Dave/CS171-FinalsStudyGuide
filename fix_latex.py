#!/usr/bin/env python3
"""
Fix LaTeX and formatting issues in CS171 JSON question files.
Converts LaTeX notation to HTML-friendly Unicode and readable text.
"""

import json
import re
import sys
from pathlib import Path

def fix_latex_text(text):
    """Convert LaTeX notation to readable Unicode text."""
    if not isinstance(text, str):
        return text

    # Greek letters
    replacements = {
        r'$\\beta$': 'β',
        r'\\beta': 'β',
        r'$\\alpha$': 'α',
        r'\\alpha': 'α',
        r'$\\theta$': 'θ',
        r'\\theta': 'θ',
        r'$\\lambda$': 'λ',
        r'\\lambda': 'λ',
        r'$\\sigma$': 'σ',
        r'\\sigma': 'σ',
        r'$\\mu$': 'μ',
        r'\\mu': 'μ',
        r'$\\epsilon$': 'ε',
        r'\\epsilon': 'ε',
        r'$\\Delta$': 'Δ',
        r'\\Delta': 'Δ',
        r'$\\nabla$': '∇',
        r'\\nabla': '∇',
        r'$\\Sigma$': 'Σ',
        r'\\Sigma': 'Σ',
        r'$\\pi$': 'π',
        r'\\pi': 'π',

        # Math operators
        r'\\cdot': '·',
        r'\\times': '×',
        r'\\leq': '≤',
        r'\\geq': '≥',
        r'\\neq': '≠',
        r'\\approx': '≈',
        r'\\sum': 'Σ',
        r'\\prod': 'Π',
        r'\\infty': '∞',
        r'\\partial': '∂',

        # Common math functions
        r'\\log': 'log',
        r'\\exp': 'exp',
        r'\\sin': 'sin',
        r'\\cos': 'cos',
        r'\\max': 'max',
        r'\\min': 'min',
        r'\\arg\\max': 'argmax',
        r'\\arg\\min': 'argmin',
    }

    result = text
    for latex, unicode_char in replacements.items():
        result = result.replace(latex, unicode_char)

    # Remove dollar signs for simple inline math
    result = re.sub(r'\$([A-Za-z_][A-Za-z0-9_]*)\$', r'\1', result)

    # Fix subscripts with spaces (e.g., "w i ​" -> "wᵢ", "x j ​" -> "xⱼ")
    subscript_map = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'n': 'ₙ', 'm': 'ₘ',
        'a': 'ₐ', 'e': 'ₑ', 'o': 'ₒ', 'x': 'ₓ'
    }

    # Handle patterns like "θ j ​" or "x i ​"
    result = re.sub(r'([A-Za-zα-ωΑ-Ω])\s+([0-9ijknmaexo])\s*​?\s*',
                    lambda m: m.group(1) + subscript_map.get(m.group(2), '_' + m.group(2)), result)

    # Handle patterns like "C i ​" or "Q 3"
    result = re.sub(r'([A-Z])\s+([0-9])\s*​?\s*',
                    lambda m: m.group(1) + subscript_map.get(m.group(2), m.group(2)), result)

    # Fix superscripts (e.g., "σ 2" -> "σ²", "x (i)" -> "x⁽ⁱ⁾")
    superscript_map = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        'i': 'ⁱ', 'n': 'ⁿ', '-': '⁻', '+': '⁺'
    }

    # Handle "number space 2" patterns for squared
    result = re.sub(r'(\w+)\s+2\s*​?\s*(?![0-9])', r'\1²', result)

    # Handle parenthetical superscripts like "(i)" -> "⁽ⁱ⁾"
    result = re.sub(r'\(i\)', '⁽ⁱ⁾', result)
    result = re.sub(r'\(j\)', '⁽ʲ⁾', result)

    # Clean up probability notation P(X|Y)
    result = re.sub(r'\$P\(([^)]+)\|([^)]+)\)\$', r'P(\1|\2)', result)
    result = re.sub(r'\$P\(([^)]+)\)\$', r'P(\1)', result)
    result = re.sub(r'\$E\[([^\]]+)\]\$', r'E[\1]', result)

    # Remove remaining $ symbols
    result = result.replace('$', '')

    # Fix common fraction patterns
    result = re.sub(r'n\s+1\s*​?\s*∑', '(1/n) Σ', result)
    result = re.sub(r'2m\s+1\s*​?\s*', '(1/2m)', result)
    result = re.sub(r'(\d+)m\s+1\s*​?\s*', r'(1/\1m)', result)

    # Fix L-norms (e.g., "L 1 ​" -> "L₁", "L 2 ​" -> "L₂")
    result = re.sub(r'L\s+([0-9])\s*​?\s*', lambda m: 'L' + subscript_map.get(m.group(1), m.group(1)), result)
    result = re.sub(r'L\s+p\s*​?\s*', 'Lₚ', result)
    result = re.sub(r'L\s+max', 'L∞', result)

    # Fix multiplication symbols
    result = result.replace('×IQR', ' × IQR')

    # Clean up extra spaces and zero-width characters
    result = re.sub(r'\s*​\s*', '', result)
    result = re.sub(r'\s+', ' ', result)

    return result.strip()

def fix_json_file(filepath):
    """Fix LaTeX issues in a JSON question file."""
    print(f"Processing: {filepath.name}")

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        fixes_count = 0

        # Fix all questions
        if 'questions' in data:
            for question in data['questions']:
                # Fix question text
                if 'question' in question:
                    original = question['question']
                    fixed = fix_latex_text(original)
                    if fixed != original:
                        question['question'] = fixed
                        fixes_count += 1

                # Fix reasoning
                if 'reasoning' in question:
                    original = question['reasoning']
                    fixed = fix_latex_text(original)
                    if fixed != original:
                        question['reasoning'] = fixed
                        fixes_count += 1

                # Fix answer (if it's text)
                if 'answer' in question and isinstance(question['answer'], str):
                    original = question['answer']
                    fixed = fix_latex_text(original)
                    if fixed != original:
                        question['answer'] = fixed
                        fixes_count += 1

        # Write back to file
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"  ✓ Fixed {fixes_count} instances")
        return fixes_count

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return 0

def main():
    """Process all CS171 JSON files."""
    base_dir = Path('/Users/rishidave/Documents/CS171-FinalsStudyGuide/js')

    # True/False files
    tf_files = [
        'truefalse_topic1_intro_logistics.json',
        'truefalse_topic2_statistics_viz.json',
        'truefalse_topic3_preprocessing.json',
        'truefalse_topic4_supervised1.json',
        'truefalse_topic5_supervised2.json',
        'truefalse_topic6_supervised_advanced.json',
        'truefalse_topic7_unsupervised1.json',
        'truefalse_topic8_density_eval.json',
        'truefalse_topic9_pattern_mining.json',
    ]

    # Short Answer files
    sa_files = [
        'shortanswer_topic1_intro_data_preprocessing.json',
        'shortanswer_topic2_supervised_learning.json',
        'shortanswer_topic3_unsupervised_learning.json',
        'shortanswer_topic4_frequent_patterns.json',
    ]

    total_fixes = 0
    files_processed = 0

    print("\n" + "="*60)
    print("CS171 LaTeX/Formatting Fixer")
    print("="*60 + "\n")

    print("True/False Files:")
    print("-" * 60)
    for filename in tf_files:
        filepath = base_dir / filename
        if filepath.exists():
            fixes = fix_json_file(filepath)
            total_fixes += fixes
            files_processed += 1
        else:
            print(f"  ✗ Not found: {filename}")

    print("\nShort Answer Files:")
    print("-" * 60)
    for filename in sa_files:
        filepath = base_dir / filename
        if filepath.exists():
            fixes = fix_json_file(filepath)
            total_fixes += fixes
            files_processed += 1
        else:
            print(f"  ✗ Not found: {filename}")

    print("\n" + "="*60)
    print(f"Summary: {total_fixes} fixes across {files_processed} files")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()

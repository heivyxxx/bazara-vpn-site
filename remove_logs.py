import os
import re

def process_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace console.log(...) with // console.log(...)
        new_content, count = re.subn(r'^(.*\s)console\.log\(', r'\1// console.log(', content, flags=re.MULTILINE)
        
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath} ({count} replacements)")
    except Exception as e:
        print(f"Error on {filepath}: {e}")

def main():
    root_dir = r"c:\Users\Shtompy\Desktop\bazara-vpn-site\src"
    for dirpath, _, filenames in os.walk(root_dir):
        for filename in filenames:
            if filename.endswith(('.ts', '.tsx', '.js', '.jsx')):
                process_file(os.path.join(dirpath, filename))

if __name__ == '__main__':
    main()

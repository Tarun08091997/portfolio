# Resume Generator

This Python script generates a professional resume in Word document format based on the project and experience data from the portfolio.

## Setup

1. Create virtual environment (if not already created):
```bash
python -m venv venv
```

2. Activate virtual environment:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

3. Install required dependencies:
```bash
pip install -r requirements.txt
```

## Usage

Run the script to generate the resume:
```bash
python generate_resume.py
```

The generated resume will be saved in the `output/` folder with a timestamp.

## Features

- Filters and selects only AI/ML projects (3 projects)
- Uses existing description points from projects.json
- Formats resume similar to reference resume
- Includes:
  - Professional Experience
  - Projects (AI/ML only)
  - Technical Skills
  - Certifications

## Output

The resume is generated as a Word document (.docx) in the `output/` directory.


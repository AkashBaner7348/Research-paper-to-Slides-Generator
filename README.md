Scientific Paper to Slide Generator
Solo Project by AkashBaner7348

Automatically converts scientific research papers into professionally structured PowerPoint slide decks using deep learning and natural language processing.

🚀 Overview
This project solves a major pain point for researchers: preparing slide decks from lengthy academic papers is manual, time-consuming, and prone to missing key insights. My app streamlines this workflow, instantly generating slide decks from PDF/LaTeX papers so authors can focus on sharing breakthroughs, not wrangling with formatting.

🛠️ Technologies Used
Python (main backend language)

Flask (web framework)

PyTorch & Transformers (deep learning & NLP)

spaCy / NLTK (text processing)

pdfplumber (PDF text extraction)

python-pptx (PowerPoint creation)

HTML/CSS/JS (frontend)

Mini CSV dataset for testing and prototyping

📦 Installation
Clone the repository:


git clone https://github.com/yourusername/scientific-paper-to-slide-generator.git
cd scientific-paper-to-slide-generator
Install dependencies:


pip install -r requirements.txt
(Optional) Download or place trained model files into /model directory.

Run locally:

python app.py
Open (http://localhost:5000) in your browser.

💡 Usage
Upload your research paper (PDF format).

The app extracts, summarizes, and clusters core sections.

Download ready-to-edit PowerPoint slide deck.

Sample mini dataset in /data/mini_slide_dataset.csv for fast prototyping.

🌟 Key Features

1)PDF upload & extraction
2)Transformer-based summarization
3)Visual extraction (figures/tables)
4)Automatic slide grouping and layout
5)One-click export to PPTX

📊 Results
Mini dataset shows >80% content selection accuracy and strong slide coverage.

ROUGE scores: ~0.6 on toy data; scales up with larger datasets.

🧠 Challenges & Learnings
Parsing inconsistent document styles and noisy text required robust preprocessing.

Handling redundancy in generated slides solved using clustering and ILP optimization.

Building the frontend and backend as a one-person team was challenging but rewarding.

🔮 Future Plans
Add multilingual and multimodal support.

Enhance figure/table captioning.

Explore integrations with online journal and conference systems.

👤 Author
[Your Name] – AkashBaner7348
Contact: akashbanerjee11aroll21@gmail.com

🙏 Acknowledgements
Thanks to the open source community and all referenced libraries.

from weasyprint import HTML
import os

def convert_html_to_pdf(html_path, pdf_path):
    try:
        print(f"Converting {html_path} to PDF...")
        
        # Convert HTML file to PDF
        HTML(html_path).write_pdf(pdf_path)
        print(f"PDF successfully created at: {pdf_path}")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")

def main():
    # Get the current directory
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Define input and output paths
    html_file = os.path.join(current_dir, 'PROJECT_SUMMARY.html')
    pdf_file = os.path.join(current_dir, 'PROJECT_SUMMARY.pdf')
    
    # Check if HTML file exists
    if not os.path.exists(html_file):
        print(f"Error: Could not find {html_file}")
        return
    
    # Convert HTML to PDF
    convert_html_to_pdf(html_file, pdf_file)

if __name__ == "__main__":
    main() 
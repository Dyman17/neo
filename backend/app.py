import gradio as gr
import subprocess
import sys
import os

def start_backend():
    """Start the FastAPI backend"""
    try:
        # Install requirements
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        
        # Start the FastAPI server
        subprocess.check_call([sys.executable, "-m", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860"])
    except Exception as e:
        return f"Error: {str(e)}"

# Create Gradio interface
with gr.Blocks(title="Archaeoscan Backend") as demo:
    gr.Markdown("# 🏺 Archaeoscan Backend Server")
    gr.Markdown("FastAPI WebSocket server for archaeological monitoring")
    
    with gr.Row():
        start_btn = gr.Button("Start Backend Server", variant="primary")
        status = gr.Textbox(label="Status", interactive=False)
    
    start_btn.click(start_backend, outputs=status)

if __name__ == "__main__":
    demo.launch()

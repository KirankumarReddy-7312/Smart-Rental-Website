#!/usr/bin/env python
"""
Quick setup script for RAG + LLM system
"""
import os
import subprocess
import sys

def install_requirements():
    """Install RAG requirements"""
    print("Installing RAG requirements...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements_rag.txt"])
        print("✅ Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    return True

def setup_env_file():
    """Setup environment file"""
    env_file = ".env"
    if not os.path.exists(env_file):
        print("Creating .env file...")
        os.rename(".env.example", ".env")
        print("✅ .env file created!")
        print("🔑 Please add your OpenAI API key to .env file")
        return True
    else:
        print("✅ .env file already exists")
        return True

def main():
    """Main setup function"""
    print("🚀 Setting up RAG + LLM system for Rentora...")
    print()
    
    # Install requirements
    if not install_requirements():
        return
    
    # Setup environment
    if not setup_env_file():
        return
    
    print()
    print("✨ RAG + LLM setup complete!")
    print()
    print("📋 Next steps:")
    print("1. Add your OpenAI API key to .env file")
    print("2. Run: python manage.py runserver")
    print("3. Test the chatbot at: http://localhost:3000")
    print()
    print("🤖 The chatbot now uses:")
    print("   • Vector embeddings for semantic search")
    print("   • FAISS for fast similarity matching")
    print("   • LLM for intelligent responses")
    print("   • Real database integration")

if __name__ == "__main__":
    main()

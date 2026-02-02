# 🚀 ArchaeoScan Deployment Guide

This guide covers the complete CI/CD setup for deploying ArchaeoScan frontend and backend.

## 📋 Overview

- **Frontend**: React + Vite deployed to Vercel
- **Backend**: FastAPI deployed to Hugging Face Spaces
- **CI/CD**: GitHub Actions for automated deployments

## 🔧 Required Secrets

### GitHub Repository Secrets

Add these secrets to your GitHub repository settings:

#### Frontend Deployment (Vercel)
```
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
VERCEL_TOKEN=your_vercel_token
VITE_API_URL=https://your-backend.hf.space
VITE_WS_URL=wss://your-backend.hf.space/ws
```

#### Backend Deployment (Hugging Face)
```
HF_TOKEN=your_huggingface_token
HF_USERNAME=your_huggingface_username
HF_SPACE_NAME=archaeoscan-backend
```

## 🏗️ Deployment Architecture

```
GitHub Repository
├── .github/workflows/
│   ├── deploy-frontend.yml    # Deploys to Vercel
│   └── deploy-backend.yml     # Deploys to Hugging Face
├── src/                        # Frontend source
├── server/                     # Backend source
├── vercel.json                 # Vercel configuration
└── DEPLOYMENT.md               # This file
```

## 📱 Frontend Deployment (Vercel)

### Automatic Deployment
1. Push to `main` or `develop` branch
2. GitHub Action triggers automatically
3. Builds and deploys to Vercel
4. Environment variables are injected during build

### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Environment Variables
Frontend uses these environment variables:
- `VITE_API_URL`: Backend API URL
- `VITE_WS_URL`: WebSocket URL

## 🤖 Backend Deployment (Hugging Face)

### Automatic Deployment
1. Push changes to `server/` directory
2. GitHub Action creates/updates Hugging Face Space
3. Deploys FastAPI application
4. Runs health checks

### Manual Deployment
```bash
# Install Hugging Face Hub
pip install huggingface_hub

# Login to Hugging Face
huggingface-cli login

# Create space
huggingface-cli space create \
  --name archaeoscan-backend \
  --sdk gradio \
  --public

# Upload files
huggingface-cli upload . . --repo-type space
```

### Backend Structure
```
server/
├── app.py              # FastAPI application
├── requirements.txt    # Python dependencies
├── main.py            # WebSocket server
└── api/               # API endpoints
```

## 🔗 Repository URLs

- **Frontend**: https://github.com/Dyman17/archaeoscan_frontend
- **Backend**: https://github.com/Dyman17/archaeoscan-websocket-server

## 🌐 Live URLs

After deployment:
- **Frontend**: https://archeoscan.vercel.app
- **Backend**: https://archaeoscan-backend.hf.space

## 🔄 CI/CD Workflow

### Frontend Workflow (deploy-frontend.yml)
```yaml
Triggers:
  - Push to main/develop branches
  - Changes in src/, package.json, etc.

Steps:
  1. Checkout code
  2. Setup Node.js
  3. Install dependencies
  4. Build with environment variables
  5. Deploy to Vercel
  6. Fallback to GitHub Pages
```

### Backend Workflow (deploy-backend.yml)
```yaml
Triggers:
  - Push to main/develop branches
  - Changes in server/, app.py, etc.

Steps:
  1. Checkout code
  2. Setup Python
  3. Install dependencies
  4. Run tests
  5. Create Hugging Face Space
  6. Deploy to Hugging Face
  7. Health check deployment
```

## 🛠️ Local Development

### Frontend
```bash
# Clone frontend repository
git clone https://github.com/Dyman17/archaeoscan_frontend
cd archaeoscan_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend
```bash
# Clone backend repository
git clone https://github.com/Dyman17/archaeoscan-websocket-server
cd archaeoscan-websocket-server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 7860
```

## 🔍 Monitoring

### Vercel
- Dashboard: https://vercel.com/dashboard
- Logs and metrics available
- Preview deployments for PRs

### Hugging Face
- Space dashboard: https://huggingface.co/spaces/your-username/archaeoscan-backend
- Build logs and metrics
- Automatic restarts on errors

## 🚨 Troubleshooting

### Common Issues

#### Frontend
- **Build fails**: Check environment variables
- **API errors**: Verify backend URL is correct
- **WebSocket connection**: Check CORS settings

#### Backend
- **Deployment fails**: Check Hugging Face token
- **Health check fails**: Verify FastAPI app structure
- **WebSocket issues**: Check Gradio compatibility

### Debug Commands

```bash
# Frontend build check
npm run build

# Backend health check
curl https://your-backend.hf.space/health

# WebSocket test
wscat -c wss://your-backend.hf.space/ws
```

## 📝 Notes

- Both repositories use the same CI/CD configuration
- Environment variables are injected during build time
- Deployments are automatic on push
- Preview deployments available for PRs
- Health checks ensure deployment success

## 🆘 Support

For deployment issues:
1. Check GitHub Actions logs
2. Verify all secrets are set
3. Ensure repository structure is correct
4. Test locally first

---

**Happy Deploying! 🎉**

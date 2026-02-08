#!/bin/bash
cd /Users/cristianosilva/.gemini/antigravity/playground/aphelion-protostar
git add .
git commit -m "deploy: Manual deployment"
git push origin main
echo "✅ Deploy enviado para Vercel!"

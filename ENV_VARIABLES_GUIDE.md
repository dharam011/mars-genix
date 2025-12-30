# Environment Variables Reference

## 🔐 DO NOT COMMIT THESE FILES
These files contain sensitive information and should NEVER be pushed to GitHub.

```
✅ These are in .gitignore:
- backend/.env
- backend/.env.local
- frontend/.env
- frontend/.env.local
- frontend/.env.production
```

---

## 📋 Backend Environment Variables

### Development (`backend/.env`)
```env
# Database
MONGO_URI=mongodb+srv://marsgenix_user:PASSWORD@cluster0.xxxxx.mongodb.net/marsgenix?retryWrites=true&w=majority

# Server
NODE_ENV=development
PORT=5000

# JWT
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=30d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Production (Render Environment Variables)
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://marsgenix_user:PASSWORD@cluster0.xxxxx.mongodb.net/marsgenix?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
JWT_EXPIRE=30d
FRONTEND_URL=https://marsgenix.vercel.app
```

---

## 📋 Frontend Environment Variables

### Development (`frontend/.env.local`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Production (Vercel Environment Variables)
```
VITE_API_URL=https://marsgenix-api.onrender.com/api
```

---

## 🔑 How to Generate Strong Secrets

### JWT_SECRET (Must be at least 32 characters)
**Option 1: Online Generator**
- Go to https://randomkeygen.com
- Copy the "CodeIgniter Encryption Keys" value (it's 32+ chars)
- Paste as JWT_SECRET

**Option 2: Command Line (Mac/Linux/WSL)**
```bash
openssl rand -base64 32
```

**Option 3: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📍 Where to Put Environment Variables

### Local Development
1. Create `backend/.env` with development values
2. Create `frontend/.env.local` with development API URL
3. Never commit these files

### Production on Render (Backend)
1. Don't create `.env` file
2. Set variables directly in Render dashboard:
   - Settings → Environment Variables
   - Add each variable one by one
   - Render reads them automatically

### Production on Vercel (Frontend)
1. Don't create `.env.production` file
2. Set variables directly in Vercel dashboard:
   - Settings → Environment Variables
   - Add each variable one by one
   - Vercel reads them automatically

---

## ✅ Checklist Before Deploying

- [ ] MongoDB Atlas cluster created
- [ ] MongoDB database user created with password
- [ ] MongoDB connection string verified
- [ ] JWT_SECRET generated (min 32 characters)
- [ ] `backend/.env` created locally for testing
- [ ] `frontend/.env.local` created locally for testing
- [ ] Both `.env` files are in `.gitignore`
- [ ] Code tested locally with both .env files
- [ ] Code pushed to GitHub without .env files
- [ ] Render environment variables set correctly
- [ ] Vercel environment variables set correctly
- [ ] FRONTEND_URL added to Render backend

---

## 🚨 Security Best Practices

1. **Never** put `.env` files in GitHub
2. **Never** log sensitive variables in console
3. **Never** share your JWT_SECRET with anyone
4. **Never** use simple passwords for database users
5. **Always** use HTTPS (Vercel & Render provide this)
6. **Always** regenerate secrets if they're exposed
7. **Always** use different secrets for dev and production

---

## 🔍 How to Use Environment Variables in Code

### Backend (Node.js)
```javascript
const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 5000;
```

### Frontend (React/Vite)
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
// Note: Must start with VITE_ to be accessible in browser
```

---

## 📝 Example Full `.env` Files

### `backend/.env`
```env
MONGO_URI=mongodb+srv://marsgenix_user:abc123xyz789@cluster0.j7k8m9n.mongodb.net/marsgenix?retryWrites=true&w=majority
NODE_ENV=development
PORT=5000
JWT_SECRET=aB3dEfGhIjKlMnOpQrStUvWxYz1234567890ABCD
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env.local`
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🆘 Troubleshooting

**Problem**: "Cannot find module .env"
**Solution**: The `.env` file is not found. Make sure it's created in the correct folder.

**Problem**: "JWT_SECRET is undefined"
**Solution**: You forgot to set it in `.env` or in Render environment variables.

**Problem**: "MongoDB connection failed"
**Solution**: 
1. Check MONGO_URI spelling
2. Verify password doesn't have special URL characters
3. Make sure IP is whitelisted on MongoDB Atlas

**Problem**: "API calls failing with CORS error"
**Solution**: 
1. Check FRONTEND_URL in Render backend settings
2. Wait 2-3 minutes for Render to redeploy
3. Clear browser cache and reload


# Quick Start Guide - Testing the New Theme

## 🎨 Matte Black + Amber Yellow Theme

Your ResumeRAG application has been redesigned with a premium hacker aesthetic.

## Starting the Application

### 1. Navigate to Frontend Directory
```bash
cd "c:\RAG Resume\frontend"
```

### 2. Install Dependencies (if not already installed)
```bash
npm install
```

### 3. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## What to Expect

### 🌑 Visual Changes

#### Colors
- **Background**: Deep matte black (#0f0f0f)
- **Cards**: Dark gray-black (#1a1a1a)
- **Text**: Soft white for excellent readability
- **Accents**: Amber yellow (#facc15) for all interactive elements

#### Design Elements
- ✅ No emojis anywhere
- ✅ No gradients
- ✅ Subtle shadows only
- ✅ Clean, professional typography
- ✅ Amber buttons with black text
- ✅ Minimal, focused design

### 📱 Pages to Check

1. **Login Page** (`/login/recruiter` or `/login/candidate`)
   - Matte black background
   - Amber login button
   - Clean card design

2. **Dashboard** (after login)
   - Dark feature cards
   - Amber "Launch Tool" / "Open Tool" buttons
   - No emoji icons on cards
   - Professional layout

3. **Component Views**
   - Upload forms with amber accents
   - Search results with amber highlights
   - Chat interface with "U" and "AI" avatars
   - Clean keyword tags in amber

## Testing Tips

### Browser DevTools
Press `F12` to open DevTools and check:
- Colors are applying correctly
- No console errors
- CSS variables are being used

### Color Verification
The theme uses these CSS variables (defined in `variables.css`):
- `--bg-primary`: #0f0f0f
- `--bg-card`: #1a1a1a
- `--amber-400`: #facc15
- `--text-primary`: #f5f5f5

### Interactive Elements
Test these features:
- Hover over buttons (should darken to #f59e0b)
- Focus on input fields (should show amber border)
- Click through different features
- Check chat avatars show "U" and "AI"

## Common Issues & Solutions

### Issue: Old colors still showing
**Solution**: Hard refresh the browser
- Windows: `Ctrl + Shift + R` or `Ctrl + F5`
- Mac: `Cmd + Shift + R`

### Issue: Styles not loading
**Solution**: Check CSS import order in `src/index.js`:
1. variables.css (first)
2. main.css
3. components.css

### Issue: Console errors
**Solution**: Clear browser cache and restart dev server:
```bash
# Stop server (Ctrl+C)
npm start
```

## Demo Credentials

If the backend is running, use these to test:

### Recruiter Account
- Email: `recruiter@example.com`
- Password: `password123`

### Candidate Account  
- Email: `candidate@example.com`
- Password: `password123`

## Files Modified

All theme changes are in:
- `/src/styles/` - All CSS files updated
- `/src/components/` - All JSX files (emojis removed)
- `/src/pages/` - Dashboard pages updated

See `THEME_CHANGES.md` for complete details.

## Next Steps

1. ✅ Start the app
2. ✅ Test all pages
3. ✅ Verify colors and interactions
4. ✅ Check responsiveness (resize window)
5. ✅ Test on different browsers

## Need Help?

- Check browser console for errors
- Verify backend is running (if using API features)
- Ensure Node.js version is compatible (14+)
- Check `THEME_CHANGES.md` for detailed changes

---

**Enjoy your new premium dark theme! 🚀**

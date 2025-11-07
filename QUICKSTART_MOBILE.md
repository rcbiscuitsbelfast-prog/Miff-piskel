# 🚀 Quick Start - Piskel Mobile Edition

Get started with mobile sprite editing in 5 minutes!

## 📱 Step 1: Enable Mobile Mode

### Option A: URL Parameter
Add `?mobile=1` to any Piskel URL:
```
http://localhost:9001/?mobile=1
```

### Option B: Force in Browser Console
```javascript
localStorage.setItem('forceMobileMode', 'true');
location.reload();
```

### Option C: Automatic Detection
Mobile mode automatically activates on:
- Mobile devices (phones/tablets)
- Screens < 768px width

## 🎨 Step 2: Choose Your Workflow

### Create New Sprite
1. You'll see the **MIFF splash screen** on first load
2. Tap **"Get Started"**
3. Tap **✏️ Draw** button (top right) - already selected
4. Canvas is ready for drawing!

### Import Existing Sprite Sheet
1. Tap **📥 Import** button (top right)
2. Upload your sprite sheet image
3. Auto-chop will detect grid size
4. Review chopped sprites in asset tray

## 🖌️ Step 3: Draw or Edit

### Drawing Tools
1. Tap the **drawer handle** at bottom of screen
2. Select a tool:
   - ✏️ **Pen** - Draw pixels
   - 🪣 **Fill** - Fill areas
   - 🧽 **Eraser** - Erase pixels
   - 📏 **Line** - Straight lines
   - ▭ **Rectangle** - Rectangles
   - ○ **Circle** - Circles
   - More tools available!

### Touch Gestures
- **Swipe right** → Undo
- **Swipe left** → Redo
- **Pinch out** → Zoom in
- **Pinch in** → Zoom out
- **Long press** → Pick color from canvas

### Quick Actions
- **Undo/Redo buttons** - Bottom left
- **Zoom controls** - Bottom right

## 🏷️ Step 4: Tag Your Animations

After importing or creating frames:

1. Tap **"Tag Frames"** in asset tray or export dialog
2. Fill in animation details:
   - **Name**: `walk`, `idle`, `attack`, etc.
   - **Tags**: `npc, character, element-fire`
   - **Frame Range**: 0-7 (which frames)
   - **Category**: Character, NPC, Item, etc.
   - **FPS**: Animation speed
3. Tap **"Save Tag"**
4. Repeat for other animations

## 💾 Step 5: Export

1. Tap **💾 Export** button (bottom center)
2. Choose export format:
   - **PNG Sequence + JSON** - Individual frames
   - **Sprite Sheet + JSON** - Combined sheet
   - **MIFF Bundle** - Everything in ZIP
3. Name your asset (e.g., `hero-sprite`)
4. Check **"Include manifest"** for MIFF
5. Tap **"Export"**

## 📦 What You Get

After export, you'll have:

### Files Downloaded
```
hero-sprite_spritesheet.png    # Your sprite sheet
hero-sprite_metadata.json      # Animation data
hero-sprite_manifest.txt       # Human-readable info
```

### metadata.json Content
```json
{
  "name": "hero-sprite",
  "sprite": {
    "width": 32,
    "height": 32,
    "frameCount": 24,
    "fps": 10
  },
  "animations": [
    {
      "name": "walk",
      "frameStart": 0,
      "frameEnd": 7,
      "fps": 10,
      "tags": ["npc", "character"]
    }
  ]
}
```

## 🎮 Using in Your Game

### Godot Example
```gdscript
# Load metadata
var file = FileAccess.open("res://sprites/hero/metadata.json", FileAccess.READ)
var json = JSON.parse_string(file.get_as_text())

# Create animation
var sprite = $AnimatedSprite2D
for anim in json.animations:
    sprite.frames.add_animation(anim.name)
    # Add frames based on frameStart/frameEnd
```

### JavaScript/HTML5 Example
```javascript
// Load metadata
const data = await fetch('hero-sprite_metadata.json').then(r => r.json());

// Set up sprite
const img = new Image();
img.src = 'hero-sprite_spritesheet.png';

// Use animation data
data.animations.forEach(anim => {
  console.log(`${anim.name}: frames ${anim.frameStart}-${anim.frameEnd}`);
  // Set up your animation system
});
```

## 💡 Pro Tips

### Drawing
- Use **Pen** for pixel-perfect control
- **Fill** works great for solid areas
- **Eraser** with right-click/long-press to restore
- Hold tool steady for straight pixels

### Importing
- Best results with **consistent grid sizes**
- Use **transparent backgrounds** for auto-detection
- Common sizes: 16x16, 32x32, 64x64
- LPC sheets work great!

### Tagging
- Use **consistent naming**: `idle`, `walk`, `run`, `attack`
- Add **hierarchical tags**: `element-fire`, `variant-blue`
- Set **appropriate FPS**: 6-8 for idle, 10-12 for action
- Tag **frame ranges** accurately for smooth loops

### Exporting
- Always include **manifest** for documentation
- Use **PNG Sequence** for maximum flexibility
- **Sprite Sheet** is more compact
- **MIFF Bundle** has everything organized

## 🐛 Troubleshooting

### Mobile mode not activating?
- Add `?mobile=1` to URL
- Check console for errors
- Try force mode: `localStorage.setItem('forceMobileMode', 'true')`

### Auto-chop not detecting grid?
- Ensure sprites have clear boundaries
- Try transparent backgrounds
- Use manual grid size input
- Common sizes: 8, 16, 24, 32, 48, 64

### Gestures not working?
- Ensure you're on canvas area
- Try with/without zoom
- Check if touch events are enabled in browser
- Use button alternatives (undo/redo buttons)

### Export not downloading?
- Check browser download permissions
- Try different export format
- Look in Downloads folder
- Check browser console for errors

## 🎯 Next Steps

### Learn More
- Read [MOBILE_README.md](./MOBILE_README.md) for full documentation
- Explore all tools in the drawer
- Try different export formats
- Experiment with tagging system

### Advanced Features
- **Multi-layer sprites** - Use layers (if not hidden)
- **Onion skinning** - Preview previous frames
- **Batch operations** - Select multiple frames
- **Custom palettes** - Save color schemes

### Game Integration
- Check engine-specific examples
- Use JSON metadata for automation
- Build asset pipeline
- Create reusable templates

## 🙋 Getting Help

- **GitHub Issues**: Bug reports and features
- **Discussions**: Questions and ideas
- **MIFF Discord**: Community support
- **Documentation**: Full README for details

---

Happy sprite creating! 🎨✨

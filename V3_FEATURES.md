# ✨ V3 Professional Features Guide

**Piskel Mobile V3** - The ultimate professional sprite editing experience with advanced tools for power users!

---

## 🎯 What's New in V3?

V3 builds on everything from V1 and V2 and adds **professional-grade features** for advanced sprite work:

- 🎨 **Advanced Layer Management** with blend modes & opacity
- 🧅 **Onion Skinning** for smooth animation workflows
- ↔️ **Symmetry Drawing Tools** (horizontal, vertical, radial)
- 📑 **Project Templates** for quick starts
- 💎 **Advanced Export Formats** (APNG, WebP coming soon)
- ⚡ **Performance Optimizations** for complex projects
- 🎭 **Professional UI** with polished animations

---

## 🎨 Advanced Layer Management

### Features
- **Multiple Layers** - Create, organize, and manage unlimited layers
- **Layer Opacity** - Control transparency (0-100%)
- **Blend Modes** - Professional compositing:
  - Normal
  - Multiply
  - Screen
  - Overlay
  - Darken / Lighten
  - Color Dodge / Color Burn
- **Layer Visibility** - Show/hide layers with one tap
- **Layer Locking** - Prevent accidental edits
- **Thumbnails** - Visual preview of each layer

### How to Use

1. **Open Layer Panel** (in tool drawer)
2. **Add Layer** - Tap the `+` button
3. **Rename** - Tap layer name to edit
4. **Adjust Opacity** - Use slider (0-100%)
5. **Change Blend Mode** - Select from dropdown
6. **Toggle Visibility** - Tap 👁️ icon
7. **Lock/Unlock** - Tap 🔓/🔒 icon
8. **Delete** - Tap 🗑️ (can't delete last layer)

### Blend Mode Effects

```
Normal      - Standard rendering
Multiply    - Darken effect (great for shadows)
Screen      - Lighten effect (great for highlights)
Overlay     - Contrast enhancement
Darken      - Keep darkest pixels
Lighten     - Keep lightest pixels
Color Dodge - Intense brightening
Color Burn  - Intense darkening
```

### Tips
- Use **Multiply** for shadow layers
- Use **Screen** for glow effects
- **Lock** your background layer to prevent changes
- Reduce opacity for subtle effects
- Hide layers temporarily while working on others

---

## 🧅 Onion Skinning

### What is Onion Skinning?
See previous and next frames while drawing to create **smooth animations**!

### Features
- **Previous Frames** - See up to 5 frames before (red tint)
- **Next Frames** - See up to 5 frames after (blue tint)
- **Adjustable Opacity** - Control transparency (10-80%)
- **Custom Colors** - Change tint colors
- **Toggle On/Off** - Quick enable/disable

### How to Use

1. **Enable** - Tap 🧅 Onion Skin in Quick Actions
2. **Adjust Settings** (in tool drawer):
   - Previous frames: 0-5
   - Next frames: 0-5
   - Opacity: 10-80%
   - Previous color: Red (default)
   - Next color: Blue (default)

### Animation Workflow

```
Step 1: Create frame 1
Step 2: Add frame 2
Step 3: Enable onion skin
Step 4: See frame 1 ghosted in red
Step 5: Draw frame 2 aligned with frame 1
Step 6: Continue for smooth animation!
```

### Best Practices
- Start with **2 previous / 2 next** frames
- Use **30-40% opacity** for clarity
- Adjust colors if your sprite uses red/blue heavily
- Disable when editing single frames
- Great for walk cycles, attacks, idle animations

### Example Use Cases
- ✓ Character walk cycles
- ✓ Attack animations
- ✓ Spell effects
- ✓ UI animations
- ✓ Any motion that requires smoothness

---

## ↔️ Symmetry Drawing Tools

### Types of Symmetry
1. **Horizontal** ↔️ - Mirror left/right
2. **Vertical** ↕️ - Mirror top/bottom
3. **Both** ✚ - Four-way symmetry
4. **Radial** ✴️ - Rotational symmetry (2-16 segments)

### Features
- **Live Preview** - See symmetry guides on canvas
- **Multiple Modes** - Switch instantly between types
- **Radial Control** - 2 to 16 segments for radial mode
- **Guide Toggle** - Show/hide guide lines
- **All Tools** - Works with any drawing tool

### How to Use

1. **Enable** - Tap ↔️ Symmetry in Quick Actions
2. **Choose Mode**:
   - Horizontal - Mirror across vertical center
   - Vertical - Mirror across horizontal center
   - Both - Quad symmetry
   - Radial - Rotational (adjust segments)
3. **Draw** - Your strokes are mirrored automatically!
4. **Toggle Guides** - Show/hide red guide lines

### Perfect For

```
Horizontal:
- Character faces
- Armor designs
- Vehicles (front view)

Vertical:
- Swords/weapons
- Towers/buildings
- Vertical UI elements

Both (Quad):
- Centered logos
- Tiles
- Icons

Radial:
- Mandala patterns
- Flowers/snowflakes (6+ segments)
- Gears/wheels (4-8 segments)
- Magic circles (8+ segments)
```

### Tips
- Use **Horizontal** for character design
- Use **Radial (6)** for flowers
- Use **Radial (8)** for stars/mandalas
- Toggle guides off for final touches
- Disable symmetry for asymmetric details

---

## 📑 Project Templates

### Built-In Templates

| Template | Size | Frames | Best For |
|----------|------|--------|----------|
| 8x8 Character | 8x8 | 4 | Tiny retro sprites |
| 16x16 Character | 16x16 | 8 | Classic game characters |
| 32x32 Character | 32x32 | 12 | Detailed characters |
| 16x16 Item | 16x16 | 1 | Game items/icons |
| 32x32 Tile | 32x32 | 1 | Environment tiles |
| 64x64 Effect | 64x64 | 16 | Visual effects |
| 24x24 UI Icon | 24x24 | 1 | Interface icons |
| Custom Size | Any | Any | Your dimensions |

### How to Use

1. **Tap** 📑 Templates button
2. **Choose** a template from the grid
3. **Confirm** (current work will be saved)
4. **Start** with pre-configured canvas!

### Custom Size
1. Select **Custom Size** template
2. Enter dimensions:
   - Width (1-256px)
   - Height (1-256px)
   - Frame count (1-100)
3. **Create** - Start immediately!

### Template Benefits
- ✓ **Pre-configured** for common use cases
- ✓ **Correct dimensions** from the start
- ✓ **Frame count** set up
- ✓ **FPS optimized** for animation type
- ✓ **Save time** - no manual setup

### Recommendations

**Retro Games (NES/GB style):**
- 8x8 or 16x16 Character templates
- 8 FPS for animations

**Modern 2D Games:**
- 32x32 Character template
- 12 FPS for smooth animations

**HD/Mobile Games:**
- 64x64 or custom (128x128+)
- 15+ FPS for fluid motion

**UI Design:**
- 24x24 UI Icon template
- Single frame (non-animated)

---

## 💎 Advanced Export

### V3 Export Formats

1. **PNG Sequence** (same as V1/V2)
   - Individual frame files
   - `frame_001.png`, `frame_002.png`, etc.

2. **Sprite Sheet** (enhanced)
   - All frames in one image
   - Horizontal or vertical layout
   - Optimized dimensions

3. **Animated GIF** (same as V2)
   - Browser-compatible animation
   - Adjustable quality

4. **JSON Metadata** (enhanced)
   - Animation data
   - Layer information
   - Blend modes & opacity
   - Frame timing

5. **APNG** (coming soon)
   - Animated PNG with transparency
   - Better quality than GIF

6. **WebP** (coming soon)
   - Modern format
   - Better compression

### Export Workflow

1. **Tap Export** button
2. **Preview** - See final output
3. **Choose Format**:
   - Quick export: Sprite Sheet
   - Animation: GIF or APNG
   - Game engine: PNG + JSON
4. **Download** - Save to device

### MIFF Bundle (V3 Enhanced)
```json
{
  "name": "hero_idle",
  "size": {"w": 32, "h": 32},
  "animations": [{
    "name": "idle",
    "frames": [0, 1, 2, 3],
    "fps": 8,
    "loop": true
  }],
  "layers": [{
    "name": "Base",
    "opacity": 1.0,
    "blendMode": "normal"
  }, {
    "name": "Shadow",
    "opacity": 0.5,
    "blendMode": "multiply"
  }],
  "tags": ["character", "hero", "idle"]
}
```

### Game Engine Integration

**Godot:**
```gdscript
# Load sprite + metadata
var sprite_data = load_json("hero_idle.json")
var sprite = Sprite.new()
sprite.texture = load("hero_idle.png")
sprite.hframes = sprite_data.frames.size()
```

**Unity:**
```csharp
// Import sprite sheet
// Use JSON for animation clips
var data = JsonUtility.FromJson<SpriteData>(jsonText);
```

---

## ⚡ Performance Mode

V3 includes automatic performance optimizations:

### Auto-Optimization
- **Canvas rendering** - Hardware acceleration
- **Layer compositing** - GPU-accelerated
- **Undo/redo** - Efficient history
- **Large canvases** - Tiled rendering (coming soon)

### Manual Controls (Coming Soon)
- Reduce animation preview FPS
- Limit onion skin frames
- Disable blend modes for speed

---

## 🎨 Professional UI Enhancements

### Visual Polish
- **Smooth animations** - 60 FPS transitions
- **Gradient effects** - Beautiful button styling
- **Backdrop blur** - Modern panel overlays
- **Pulse effects** - Draw attention to new features
- **Success feedback** - Visual confirmation

### Accessibility
- **High contrast** - Easy to read
- **Large targets** - 48px+ touch areas
- **Clear labels** - Icon + text
- **Keyboard shortcuts** (desktop)
- **Screen reader** support (coming soon)

---

## 🚀 V3 Workflow Examples

### Creating a Character with Layers

```
1. Choose "32x32 Character" template
2. Add layers:
   - Layer 1: Base colors
   - Layer 2: Shading (Multiply blend, 70% opacity)
   - Layer 3: Highlights (Screen blend, 60% opacity)
   - Layer 4: Outline
3. Enable symmetry (horizontal) for face
4. Use onion skin for animation frames
5. Export as PNG sequence + JSON
```

### Smooth Walk Cycle

```
1. Create frame 1 (standing)
2. Enable onion skin (2 previous, 2 next, 30% opacity)
3. Add frame 2 (leg forward)
4. See frame 1 ghosted - align for smooth motion
5. Continue through 8 frames
6. Review animation in preview
7. Export as GIF or sprite sheet
```

### Logo/Icon with Radial Symmetry

```
1. Choose "24x24 UI Icon" template
2. Enable symmetry (Radial, 8 segments)
3. Draw one segment - others auto-fill
4. Disable symmetry for finishing touches
5. Export as PNG
```

---

## 🎯 Comparison: V1 vs V2 vs V3

| Feature | V1 | V2 | V3 |
|---------|----|----|-----|
| Touch UI | ✅ | ✅ | ✅ |
| Draw/Import Modes | ✅ | ✅ | ✅ |
| Auto-Chop | ✅ | ✅ | ✅ |
| Animation Tagging | ✅ | ✅ | ✅ |
| Tutorial | ❌ | ✅ | ✅ |
| Quick Actions | ❌ | ✅ | ✅ |
| Animation Preview | ❌ | ✅ | ✅ |
| Color Presets | ❌ | ✅ | ✅ |
| **Advanced Layers** | ❌ | ❌ | ✅ |
| **Onion Skinning** | ❌ | ❌ | ✅ |
| **Symmetry Tools** | ❌ | ❌ | ✅ |
| **Templates** | ❌ | ❌ | ✅ |
| **Blend Modes** | ❌ | ❌ | ✅ |
| **APNG Export** | ❌ | ❌ | ✅ |

---

## 💡 Tips & Tricks

### Layer Tips
- Name layers clearly ("Base", "Shadow", "Outline")
- Use multiply blend for shadows
- Lock layers you're not editing
- Duplicate layers for variations

### Onion Skin Tips
- Start with low opacity (30%)
- Increase previous/next frames gradually
- Match tint color to your needs
- Toggle off for detail work

### Symmetry Tips
- Use horizontal for faces
- Use radial for flowers/stars
- Toggle guides on/off as needed
- Disable for asymmetric details

### Template Tips
- Save custom sizes as presets (coming soon)
- Choose correct size for target platform
- Use effect templates for particles
- Start with templates, customize as needed

---

## 🐛 Known Limitations

### Current Limitations
- Layer count: Tested up to 50 layers
- Radial symmetry: Max 16 segments
- Onion skin: Max 5 frames each direction
- Templates: 8 built-in (custom sizes unlimited)

### Coming Soon
- Custom template saving
- APNG export (partial support)
- WebP export (planned)
- Performance mode toggle
- Layer folders/groups
- Keyboard shortcut customization

---

## 📚 Additional Resources

- **[Main README](./README.md)** - Project overview
- **[Mobile Documentation](./MOBILE_README.md)** - Full mobile guide
- **[V1 vs V2 Comparison](./V1_VS_V2_COMPARISON.md)** - Version comparison
- **[GitHub Pages Setup](./GITHUB_PAGES_SETUP.md)** - Deployment guide
- **[Quick Start](./QUICKSTART_MOBILE.md)** - 5-minute intro

---

## 🎉 Ready to Create!

V3 Professional gives you all the tools you need for **professional sprite work**:

✅ Advanced layers with blend modes  
✅ Smooth animation with onion skinning  
✅ Perfect symmetry for complex designs  
✅ Quick starts with templates  
✅ Professional export options  

**Launch V3 and start creating!** 🎨🚀

---

*Made with MIFF in mind* 🎮 | *Open Source* | *Apache 2.0 License*

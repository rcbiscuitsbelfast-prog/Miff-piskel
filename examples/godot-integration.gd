# Godot Integration Example for Piskel Mobile Edition
# Shows how to use exported JSON metadata in Godot

extends Node2D

# References
@onready var animated_sprite = $AnimatedSprite2D

# Path to your exported sprite
const SPRITE_PATH = "res://content/sprites/hero-sprite/"

func _ready():
	load_piskel_sprite()

func load_piskel_sprite():
	# Load the metadata JSON
	var metadata = load_json_metadata(SPRITE_PATH + "metadata.json")
	if not metadata:
		push_error("Failed to load metadata")
		return
	
	# Load the sprite sheet
	var texture = load(SPRITE_PATH + "spritesheet.png")
	if not texture:
		push_error("Failed to load sprite sheet")
		return
	
	# Get sprite dimensions
	var sprite_width = metadata.sprite.width
	var sprite_height = metadata.sprite.height
	var frame_count = metadata.sprite.frameCount
	
	# Calculate frames per row (assuming horizontal layout)
	var frames_per_row = texture.get_width() / sprite_width
	
	# Create SpriteFrames resource
	var sprite_frames = SpriteFrames.new()
	
	# Add each animation from metadata
	for anim in metadata.animations:
		var anim_name = anim.name
		sprite_frames.add_animation(anim_name)
		
		# Set FPS for this animation
		sprite_frames.set_animation_speed(anim_name, anim.fps)
		
		# Add frames for this animation
		for i in range(anim.frameStart, anim.frameEnd + 1):
			var frame_texture = extract_frame(texture, i, sprite_width, sprite_height, frames_per_row)
			sprite_frames.add_frame(anim_name, frame_texture)
		
		# Set loop if it's a looping animation
		var should_loop = is_looping_animation(anim.name)
		sprite_frames.set_animation_loop(anim_name, should_loop)
		
		print("Added animation: %s (%d frames @ %d fps)" % [anim_name, anim.frameCount, anim.fps])
	
	# Apply to AnimatedSprite2D
	animated_sprite.sprite_frames = sprite_frames
	
	# Play default animation
	if metadata.animations.size() > 0:
		animated_sprite.play(metadata.animations[0].name)
	
	print("Loaded sprite: %s" % metadata.name)

func load_json_metadata(path: String) -> Dictionary:
	# Load and parse JSON file
	var file = FileAccess.open(path, FileAccess.READ)
	if not file:
		push_error("Could not open metadata file: " + path)
		return {}
	
	var json_string = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var error = json.parse(json_string)
	if error != OK:
		push_error("JSON Parse Error: " + json.get_error_message())
		return {}
	
	return json.data

func extract_frame(texture: Texture2D, frame_index: int, frame_width: int, frame_height: int, frames_per_row: int) -> AtlasTexture:
	# Calculate frame position in sprite sheet
	var row = frame_index / frames_per_row
	var col = frame_index % frames_per_row
	
	# Create AtlasTexture for this frame
	var atlas = AtlasTexture.new()
	atlas.atlas = texture
	atlas.region = Rect2(
		col * frame_width,
		row * frame_height,
		frame_width,
		frame_height
	)
	
	return atlas

func is_looping_animation(anim_name: String) -> bool:
	# Determine if animation should loop
	var looping_anims = ["idle", "walk", "run", "fly", "swim"]
	var non_looping_anims = ["attack", "death", "hurt", "jump"]
	
	if anim_name in looping_anims:
		return true
	if anim_name in non_looping_anims:
		return false
	
	# Default to looping
	return true

# Helper function to get animations by tag
func get_animations_by_tag(metadata: Dictionary, tag: String) -> Array:
	var result = []
	for anim in metadata.animations:
		if tag in anim.tags:
			result.append(anim)
	return result

# Example: Play animation by name
func play_animation(anim_name: String):
	if animated_sprite.sprite_frames.has_animation(anim_name):
		animated_sprite.play(anim_name)
	else:
		push_warning("Animation not found: " + anim_name)

# Example: Get all available animations
func get_available_animations() -> Array:
	return animated_sprite.sprite_frames.get_animation_names()

# Example usage in game
func _input(event):
	if event.is_action_pressed("ui_right"):
		play_animation("walk")
	elif event.is_action_pressed("ui_accept"):
		play_animation("attack")
	elif event.is_action_released("ui_right"):
		play_animation("idle")

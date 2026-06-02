import requests
import json

# The direct model test showed laptop at 0.234
# The API with conf_threshold=0.3 showed 0 detections
# Let's send the SAME screenshot to the API with conf_threshold=0.1 to confirm

print("=== API TEST at threshold 0.1 (should find laptop at 0.234) ===")
with open("test_screenshot_resized.jpg", 'rb') as f:
    response = requests.post(
        'http://127.0.0.1:8000/api/detect',
        params={'conf_threshold': 0.1, 'nms_threshold': 0.4, 'model_variant': 'coco'},
        files={'file': ('frame.jpg', f, 'image/jpeg')}
    )

print('HTTP Status:', response.status_code)
data = response.json()
print(json.dumps(data, indent=2))

print()
print(f"Detection Count: {len(data.get('detections', []))}")
for det in data.get('detections', []):
    print(f"  -> {det['label']} conf={det['confidence']:.4f} bbox={det['bbox']}")

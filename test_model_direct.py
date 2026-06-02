import cv2
import numpy as np
import json

# Direct model test — bypass the API, test the model code directly
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

from model import SSDObjectDetector

print("Loading model...")
detector = SSDObjectDetector()
print("Model loaded.")

# Test 1: Load the saved screenshot and run inference directly
print("\n=== TEST 1: Screenshot image ===")
img = cv2.imread("test_screenshot_resized.jpg")
print(f"Image shape: {img.shape}")
print(f"Image dtype: {img.dtype}")
print(f"Image value range: {img.min()} - {img.max()}")

results = detector.detect(img, conf_threshold=0.1, nms_threshold=0.4)
print(f"Detections at conf=0.1: {len(results)}")
for r in results:
    print(f"  {r['label']} {r['confidence']:.3f} {r['bbox']}")

# Test 2: Try the raw blob output to see raw scores
print("\n=== TEST 2: Raw SSD output scores ===")
blob = cv2.dnn.blobFromImage(img, size=(300, 300), swapRB=True, crop=False)
detector.net.setInput(blob)
raw = detector.net.forward()
print(f"Output shape: {raw.shape}")  # Should be (1,1,N,7)

# Look at all confidence values across all detections
confidences = raw[0, 0, :, 2]
class_ids = raw[0, 0, :, 1].astype(int)

# Sort by confidence
sorted_idx = np.argsort(confidences)[::-1][:20]
print("Top 20 raw detections (before any threshold):")
for idx in sorted_idx:
    c = confidences[idx]
    cid = class_ids[idx]
    label = detector.labels.get(cid, f"id:{cid}")
    coords = raw[0, 0, idx, 3:7]
    print(f"  [{idx}] class={label}({cid}) conf={c:.4f} coords={coords}")
